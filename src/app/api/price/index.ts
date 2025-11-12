const fetchTONPriceInfo = async () => {
  try {
    console.log("[fetchTONPriceInfo] Fetching from Upbit...");
    const response = await fetch(
      "https://api.upbit.com/v1/ticker?markets=KRW-tokamak",
      { cache: "no-store" }
    );
    console.log("[fetchTONPriceInfo] Response status:", response.status);
    const data = await response.json();
    // Upbit API returns an array, extract first element
    const result = Array.isArray(data) ? data[0] : data;
    console.log("[fetchTONPriceInfo] Success:", result ? "✓" : "✗");
    return result;
  } catch (error) {
    console.error("[fetchTONPriceInfo] Error:", error);
    return null;
  }
};

const getUSDPrice = async () => {
  try {
    console.log("[getUSDPrice] Fetching exchange rate...");
    const response = await fetch("https://open.er-api.com/v6/latest/KRW", {
      cache: "no-store",
    });
    console.log("[getUSDPrice] Response status:", response.status);
    const data = await response.json();
    const rate = data.rates.USD;
    console.log("[getUSDPrice] Success:", rate ? "✓" : "✗");
    return rate;
  } catch (error) {
    console.error("[getUSDPrice] Error:", error);
    return null;
  }
};

const getStakingVolume = async () => {
  try {
    console.log("[getStakingVolume] Fetching staking data...");
    const [currentStaked, DAOStaked] = await Promise.all([
      fetch("https://price.api.tokamak.network/staking/current", {
        cache: "no-store",
      }).then((res) => {
        console.log("[getStakingVolume] staking/current status:", res.status);
        return res.json();
      }),
      fetch("https://price.api.tokamak.network/supply", {
        cache: "no-store",
      }).then((res) => {
        console.log("[getStakingVolume] supply status:", res.status);
        return res.json();
      }),
    ]);

    const result = {
      currentStaked,
      DAOStaked: DAOStaked.daoValue,
    };
    console.log("[getStakingVolume] Success:", result ? "✓" : "✗");
    return result;
  } catch (error) {
    console.error("[getStakingVolume] Error:", error);
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
    console.log("[getSuuplyInfo] Fetching supply data...");
    const [circulationSupply, totalSupplyData] = await Promise.all([
      fetch("https://price.api.tokamak.network/circulationSupply", {
        cache: "no-store",
      }).then((res) => {
        console.log("[getSuuplyInfo] circulationSupply status:", res.status);
        return res.json();
      }),
      fetch("https://price.api.tokamak.network/supply", {
        cache: "no-store",
      }).then((res) => {
        console.log("[getSuuplyInfo] supply status:", res.status);
        return res.json();
      }),
    ]);

    const result = {
      ...circulationSupply,
      totalSupply: totalSupplyData.totalSupply,
      burned: totalSupplyData.burnedValue,
    };
    console.log("[getSuuplyInfo] Success:", result ? "✓" : "✗");
    return result;
  } catch (error) {
    console.error("[getSuuplyInfo] Error:", error);
    return null;
  }
};

export const fetchPriceDatas = async () => {
  console.log("[fetchPriceDatas] Starting to fetch all price data sources...");

  const [priceInfo, krwToUsdRate, stakingVolume, suuplyInfo] =
    await Promise.all([
      fetchTONPriceInfo(),
      getUSDPrice(),
      getStakingVolume(),
      getSuuplyInfo(),
    ]);

  console.log("[fetchPriceDatas] Results:", {
    priceInfo: priceInfo ? "✓" : "✗",
    krwToUsdRate: krwToUsdRate ? "✓" : "✗",
    stakingVolume: stakingVolume ? "✓" : "✗",
    suuplyInfo: suuplyInfo ? "✓" : "✗",
  });

  // Check if any API call failed
  if (!priceInfo || !krwToUsdRate || !stakingVolume || !suuplyInfo) {
    const missing = [];
    if (!priceInfo) missing.push("priceInfo");
    if (!krwToUsdRate) missing.push("krwToUsdRate");
    if (!stakingVolume) missing.push("stakingVolume");
    if (!suuplyInfo) missing.push("suuplyInfo");

    throw new Error(`Failed to fetch: ${missing.join(", ")}`);
  }

  console.log("[fetchPriceDatas] All data sources fetched successfully");

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
