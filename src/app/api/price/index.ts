const fetchTONPriceInfo = async () => {
  try {
    const response = await fetch(
      "https://api.upbit.com/v1/ticker?markets=KRW-tokamak",
      { next: { revalidate: 120 } }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const text = await response.text();
    const data = JSON.parse(text);
    return JSON.parse(JSON.stringify(data).replace(/]|[[]/g, ""));
  } catch (error) {
    console.error("setPosts error:", error);
  }
};

const getUSDPrice = async () => {
  const response = await fetch("https://open.er-api.com/v6/latest/KRW", {
    next: { revalidate: 120 },
  });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const text = await response.text();
  const data = JSON.parse(text);
  return data.rates.USD;
};

const getStakingVolume = async () => {
  const [currentStaked, DAOStaked] = await Promise.all([
    fetch("https://price.api.tokamak.network/staking/current", {
      next: { revalidate: 120 },
    }).then(async (res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const text = await res.text();
      return JSON.parse(text);
    }),
    fetch("https://price.api.tokamak.network/supply", {
      next: { revalidate: 120 },
    }).then(async (res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const text = await res.text();
      return JSON.parse(text);
    }),
  ]);

  return {
    currentStaked,
    DAOStaked: DAOStaked.daoValue,
  };
};

const getSuuplyInfo = async (): Promise<{
  totalCirculationSupply: number;
  C1: number;
  C2: number;
  C3: number;
  totalSupply: number;
  burned: number;
  vested: number;
}> => {
  try {
    const [circulationSupply, totalSupplyData] = await Promise.all([
      fetch("https://price.api.tokamak.network/circulationSupply", {
        next: { revalidate: 120 },
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const text = await res.text();
        return JSON.parse(text);
      }),
      fetch("https://price.api.tokamak.network/supply", {
        next: { revalidate: 120 },
      }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const text = await res.text();
        return JSON.parse(text);
      }),
    ]);

    return {
      ...circulationSupply,
      totalSupply: totalSupplyData.totalSupply,
      burned: totalSupplyData.burnedValue,
      vested: totalSupplyData.vestingAmount ?? 0,
    };
  } catch (error) {
    console.error("Error fetching supply data:", error);
    throw error;
  }
};

/**
 * 24x 60-minute candles from Upbit (KRW-TOKAMAK). Returned chronologically
 * (oldest → newest) so we can render a sparkline directly. Each entry is
 * the candle's close price in KRW; convert to USD at the caller.
 */
const get24hKrwCandles = async (): Promise<number[]> => {
  try {
    const res = await fetch(
      "https://api.upbit.com/v1/candles/minutes/60?market=KRW-tokamak&count=24",
      { next: { revalidate: 120 } }
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = (await res.json()) as Array<{ trade_price: number }>;
    // Upbit returns newest first — reverse for chronological order.
    return data.map((c) => c.trade_price).reverse();
  } catch (error) {
    console.error("Error fetching Upbit candles:", error);
    return [];
  }
};

export const fetchPriceDatas = async () => {
  const [priceInfo, krwToUsdRate, stakingVolume, suuplyInfo, krwCandles] =
    await Promise.all([
      fetchTONPriceInfo(),
      getUSDPrice(),
      getStakingVolume(),
      getSuuplyInfo(),
      get24hKrwCandles(),
    ]);

  const usdCurrentPrice =
    Math.round(priceInfo.trade_price * krwToUsdRate * 100) / 100;

  const tradingVolumeUSD = Math.floor(
    priceInfo.acc_trade_volume_24h * usdCurrentPrice
  );
  const marketCap = Math.floor(usdCurrentPrice * suuplyInfo.C1);
  const fullyDilutedValuation = Math.floor(
    usdCurrentPrice * suuplyInfo.totalSupply
  );

  // 24h sparkline in USD — derived from Upbit KRW candles × current FX rate.
  const priceHistoryUSD = krwCandles.map((krw) => krw * krwToUsdRate);

  return {
    tonPrice: {
      current: {
        usd: usdCurrentPrice,
        krw: priceInfo.trade_price,
      },
      opening: {
        usd: priceInfo.opening_price * krwToUsdRate,
        krw: priceInfo.opening_price,
      },
      closing: {
        usd: priceInfo.prev_closing_price * krwToUsdRate,
        krw: priceInfo.prev_closing_price,
      },
    },
    priceHistoryUSD,
    marketCap,
    tradingVolumeUSD,
    fullyDilutedValuation,
    totalSupply: suuplyInfo.totalSupply,
    totalSupplyUSD: Math.floor(suuplyInfo.totalSupply * usdCurrentPrice),
    circulatingSupply: suuplyInfo.C1,
    circulatingSupplyUSD: Math.floor(suuplyInfo.C1 * usdCurrentPrice),
    circulatingSuupplyUpbitStandard:
      suuplyInfo.totalSupply - stakingVolume.DAOStaked,
    burnedSupply: suuplyInfo.burned,
    burnedSupplyUSD: Math.floor(suuplyInfo.burned * usdCurrentPrice),
    stakedVolume: stakingVolume.currentStaked,
    stakedVolumeUSD: Math.floor(stakingVolume.currentStaked * usdCurrentPrice),
    DAOStakedVolume: stakingVolume.DAOStaked,
    DAOStakedVolumeUSD: Math.floor(stakingVolume.DAOStaked * usdCurrentPrice),
    vestedSupply: suuplyInfo.vested,
    vestedSupplyUSD: Math.floor(suuplyInfo.vested * usdCurrentPrice),
    liquidity: {
      c1: suuplyInfo.C1,
      c2: suuplyInfo.C1 + suuplyInfo.C2,
      c3: suuplyInfo.C1 + suuplyInfo.C2,
      // c3: suuplyInfo.C1 + suuplyInfo.C2 + suuplyInfo.C3,
    },
    liquidityUSD: {
      c1: Math.floor(suuplyInfo.C1 * usdCurrentPrice),
      c2: Math.floor((suuplyInfo.C1 + suuplyInfo.C2) * usdCurrentPrice),
      c3: Math.floor((suuplyInfo.C1 + suuplyInfo.C2) * usdCurrentPrice),
      // c3: Math.floor(
      //   (suuplyInfo.C1 + suuplyInfo.C2 + suuplyInfo.C3) * usdCurrentPrice
      // ),
    },
  };
};
