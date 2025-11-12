const FETCH_OPTIONS = {
  next: { revalidate: 60 },
} as const;

const fetchTONPriceInfo = async () => {
  try {
    const response = await fetch(
      "https://api.upbit.com/v1/ticker?markets=KRW-tokamak",
      FETCH_OPTIONS
    );
    const data = await response.json();
    // Upbit API returns an array, extract first element
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error("Error fetching TON price from Upbit:", error);
    return null;
  }
};

const getUSDPrice = async () => {
  try {
    const response = await fetch(
      "https://open.er-api.com/v6/latest/KRW",
      FETCH_OPTIONS
    );
    const data = await response.json();
    return data.rates.USD;
  } catch (error) {
    console.error("Error fetching USD exchange rate:", error);
    return null;
  }
};

const getStakingVolume = async () => {
  try {
    const [currentStaked, DAOStaked] = await Promise.all([
      fetch(
        "https://price.api.tokamak.network/staking/current",
        FETCH_OPTIONS
      ).then((res) => res.json()),
      fetch("https://price.api.tokamak.network/supply", FETCH_OPTIONS).then(
        (res) => res.json()
      ),
    ]);

    return {
      currentStaked,
      DAOStaked: DAOStaked.daoValue,
    };
  } catch (error) {
    console.error("Error fetching staking volume:", error);
    return null;
  }
};

const getSuuplyInfo = async (): Promise<{
  totalCirculationSupply: number;
  C1: number;
  C2: number;
  C3: number;
  totalSupply: number;
  burned: number;
} | null> => {
  try {
    const [circulationSupply, totalSupplyData] = await Promise.all([
      fetch(
        "https://price.api.tokamak.network/circulationSupply",
        FETCH_OPTIONS
      ).then((res) => res.json()),
      fetch("https://price.api.tokamak.network/supply", FETCH_OPTIONS).then(
        (res) => res.json()
      ),
    ]);

    return {
      ...circulationSupply,
      totalSupply: totalSupplyData.totalSupply,
      burned: totalSupplyData.burnedValue,
    };
  } catch (error) {
    console.error("Error fetching supply data:", error);
    return null;
  }
};

export const fetchPriceDatas = async () => {
  const [priceInfo, krwToUsdRate, stakingVolume, suuplyInfo] =
    await Promise.all([
      fetchTONPriceInfo(),
      getUSDPrice(),
      getStakingVolume(),
      getSuuplyInfo(),
    ]);

  // Check if any API call failed
  if (!priceInfo || !krwToUsdRate || !stakingVolume || !suuplyInfo) {
    throw new Error("Failed to fetch one or more price data sources");
  }

  const usdCurrentPrice =
    Math.round(priceInfo.trade_price * krwToUsdRate * 100) / 100;

  const tradingVolumeUSD = Math.floor(
    priceInfo.acc_trade_volume_24h * usdCurrentPrice
  );
  const marketCap = Math.floor(usdCurrentPrice * suuplyInfo.C1);
  const fullyDilutedValuation = Math.floor(
    usdCurrentPrice * suuplyInfo.totalSupply
  );

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
