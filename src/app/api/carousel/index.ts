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
    return JSON.parse(JSON.stringify(data).replace(/]|[[]/g, ""));
  } catch (error) {
    console.error("setPosts error");
    console.log(error);
  }
};

const getUSDPrice = async () => {
  const response = await fetch(
    "https://open.er-api.com/v6/latest/KRW",
    FETCH_OPTIONS
  );
  const data = await response.json();
  return data.rates.USD;
};

const getStakingVolume = async () => {
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
    throw error;
  }
};

export const fetchCarouselDatas = async () => {
  const [priceInfo, krwToUsdRate, stakingVolume, suuplyInfo] =
    await Promise.all([
      fetchTONPriceInfo(),
      getUSDPrice(),
      getStakingVolume(),
      getSuuplyInfo(),
    ]);

  const usdPrice = Math.round(priceInfo.trade_price * krwToUsdRate * 100) / 100;

  const tradingVolumeUSD = Math.floor(
    priceInfo.acc_trade_volume_24h * usdPrice
  );
  const marketCap = Math.floor(usdPrice * suuplyInfo.C1);
  const fullyDilutedValuation = Math.floor(usdPrice * suuplyInfo.totalSupply);

  return {
    tonPrice: {
      usd: usdPrice,
      krw: priceInfo.trade_price,
    },
    marketCap,
    tradingVolumeUSD,
    fullyDilutedValuation,
    totalSupply: suuplyInfo.totalSupply,
    totalSupplyUSD: Math.floor(suuplyInfo.totalSupply * usdPrice),
    circulatingSupply: suuplyInfo.C1,
    circulatingSupplyUSD: Math.floor(suuplyInfo.C1 * usdPrice),
    circulatingSuupplyUpbitStandard: suuplyInfo.C2,
    burnedSupply: suuplyInfo.burned,
    burnedSupplyUSD: Math.floor(suuplyInfo.burned * usdPrice),
    stakedVolume: stakingVolume.currentStaked,
    stakedVolumeUSD: Math.floor(stakingVolume.currentStaked * usdPrice),
    DAOStakedVolume: stakingVolume.DAOStaked,
    DAOStakedVolumeUSD: Math.floor(stakingVolume.DAOStaked * usdPrice),
  };
};
