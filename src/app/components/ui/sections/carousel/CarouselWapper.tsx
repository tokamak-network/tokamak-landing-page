"use client";

import { useEffect, useState } from "react";
import CarouselList from "./CarouselList";
import { CarouselDisplayProps } from "./types";

export default function CarouselWrapper() {
  const [carouselDatas, setCarouselDatas] = useState<CarouselDisplayProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/price");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();

        const {
          tonPrice,
          marketCap,
          tradingVolumeUSD,
          fullyDilutedValuation,
          totalSupply,
          totalSupplyUSD,
          circulatingSupply,
          circulatingSupplyUSD,
          burnedSupply,
          burnedSupplyUSD,
          stakedVolume,
          stakedVolumeUSD,
          DAOStakedVolume,
          DAOStakedVolumeUSD,
        } = data;

        const datas: CarouselDisplayProps[] = [
          {
            category: "Price",
            datas: [
              {
                label: "TON Price",
                info: tonPrice.current.usd,
                currency: "USD",
                conversion: `₩ ${tonPrice.current.krw}`,
              },
              {
                label: "Market Cap",
                info: marketCap,
                currency: "USD",
              },
              {
                label: "Trading Volume",
                info: tradingVolumeUSD,
                currency: "USD",
              },
              {
                label: "Fully Diluted Valuation",
                info: fullyDilutedValuation,
                currency: "USD",
              },
            ],
          },
          {
            category: "Supply",
            datas: [
              {
                label: "Total Supply",
                info: totalSupply,
                currency: "TON",
                usdValue: totalSupplyUSD,
              },
              {
                label: "Circulating Supply",
                info: circulatingSupply,
                currency: "TON",
                usdValue: circulatingSupplyUSD,
              },
              {
                label: "Burned",
                info: burnedSupply,
                currency: "TON",
                usdValue: burnedSupplyUSD,
              },
            ],
          },
          {
            category: "Staking",
            datas: [
              {
                label: "Staked",
                info: stakedVolume,
                currency: "TON",
                usdValue: stakedVolumeUSD,
              },
              {
                label: "DAO Vault",
                info: DAOStakedVolume,
                currency: "TON",
                usdValue: DAOStakedVolumeUSD,
              },
            ],
          },
        ];

        setCarouselDatas(datas);
      } catch (error) {
        console.error("Error fetching carousel data:", error);
        setCarouselDatas([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="h-[60px]" />;
  }

  if (carouselDatas.length === 0) {
    return null;
  }

  return <CarouselList carouselDatas={carouselDatas} />;
}
