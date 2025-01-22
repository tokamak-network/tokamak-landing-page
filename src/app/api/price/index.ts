const fetchTONPriceInfo = async () => {
  try {
    const response = await fetch(
      "https://api.upbit.com/v1/ticker?markets=KRW-tokamak"
    );
    const data = await response.json();
    return JSON.parse(JSON.stringify(data).replace(/]|[[]/g, ""));
  } catch (error) {
    console.error("setPosts error");
    console.log(error);
  }
};

const getUSDPrice = async () => {
  const response = await fetch("https://open.er-api.com/v6/latest/KRW");
  const data = await response.json();
  return data.rates.USD;
};

const getStakingVolume = async () => {
  const [currentStaked, DAOStaked] = await Promise.all([
    fetch("https://price.api.tokamak.network/staking/current").then((res) =>
      res.json()
    ),
    fetch("https://price.api.tokamak.network/supply").then((res) => res.json()),
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
}> => {
  try {
    const [circulationSupply, totalSupplyData] = await Promise.all([
      fetch("https://price.api.tokamak.network/circulationSupply").then((res) =>
        res.json()
      ),
      fetch("https://price.api.tokamak.network/supply").then((res) =>
        res.json()
      ),
    ]);

    return {
      ...circulationSupply,
      totalSupply: totalSupplyData.totalSupply,
      burned: totalSupplyData.burnedValue,
    };
  } catch (error) {
    console.error("Error fetching supply data:", error);
    throw error;
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
        usd: priceInfo.opening_price,
        krw: priceInfo.opening_price * krwToUsdRate,
      },
      closing: {
        usd: priceInfo.prev_closing_price,
        krw: priceInfo.prev_closing_price * krwToUsdRate,
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
      c3: suuplyInfo.C1 + suuplyInfo.C2 + suuplyInfo.C3,
    },
    liquidityUSD: {
      c1: Math.floor(suuplyInfo.C1 * usdCurrentPrice),
      c2: Math.floor((suuplyInfo.C1 + suuplyInfo.C2) * usdCurrentPrice),
      c3: Math.floor(
        (suuplyInfo.C1 + suuplyInfo.C2 + suuplyInfo.C3) * usdCurrentPrice
      ),
    },
  };
};
