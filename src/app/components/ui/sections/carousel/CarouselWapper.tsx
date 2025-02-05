import { fetchPriceDatas } from "@/app/api/price";
import CarouselList from "./CarouselList";
import { CarouselDisplayProps } from "./types";

export default async function CarouselWrapper() {
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
  } = await fetchPriceDatas();

  const carouselDatas: CarouselDisplayProps[] = [
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

  return <CarouselList carouselDatas={carouselDatas} />;
}
