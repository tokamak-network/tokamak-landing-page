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
  const response = await fetch(
    "https://price.api.tokamak.network/staking/current"
  );
  const data = await response.json();
  return data;
};

export const fetchPriceInfo = async () => {
  const [priceInfo, krwToUsdRate, stakingVolume] = await Promise.all([
    fetchTONPriceInfo(),
    getUSDPrice(),
    getStakingVolume(),
  ]);

  const usdPrice = priceInfo.trade_price * krwToUsdRate;
  const tradingVolumeUSD =
    (priceInfo.acc_trade_volume_24h * usdPrice) / 1000000;
  const stakingVolumeM = stakingVolume / 1000000;

  return {
    tonPrice: usdPrice,
    tradingVolumeUSD,
    stakingVolume: stakingVolumeM,
  };
};
