"use client";

import { useState, useEffect } from "react";

export interface CubeData {
  [key: string]: number;
  tonPriceUSD: number;
  stakedVolume: number;
  marketCap: number;
  circulatingSupply: number;
  tradingVolumeUSD: number;
  fullyDilutedValuation: number;
  codeChanges: number;
  netGrowth: number;
  activeProjects: number;
}

const DEFAULTS: CubeData = {
  tonPriceUSD: 0,
  stakedVolume: 28_500_000,
  marketCap: 0,
  circulatingSupply: 0,
  tradingVolumeUSD: 0,
  fullyDilutedValuation: 0,
  codeChanges: 3_603_187,
  netGrowth: 1_980_785,
  activeProjects: 49,
};

export function useCubeData(): CubeData {
  const [data, setData] = useState<CubeData>(DEFAULTS);

  useEffect(() => {
    fetch("/api/price")
      .then((r) => r.json())
      .then((price) => {
        setData((prev) => ({
          ...prev,
          tonPriceUSD: price.tonPrice?.current?.usd ?? prev.tonPriceUSD,
          stakedVolume: price.stakedVolume ?? prev.stakedVolume,
          marketCap: price.marketCap ?? prev.marketCap,
          circulatingSupply: price.circulatingSupply ?? prev.circulatingSupply,
          tradingVolumeUSD: price.tradingVolumeUSD ?? prev.tradingVolumeUSD,
          fullyDilutedValuation:
            price.fullyDilutedValuation ?? prev.fullyDilutedValuation,
        }));
      })
      .catch(() => {});
  }, []);

  return data;
}
