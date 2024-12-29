import { fetchCarouselDatas } from "@/app/api/carousel";
import { formatCurrencyString, formatNumber } from "@/app/lib/utils/format";

interface CarouselDisplayProps {
  category: "Price" | "Supply" | "Staking";
  datas: {
    label: string;
    info: number;
    currency: string | number;
    conversion?: string | number;
    usdValue?: number;
  }[];
}

function CarouselItem({ category, datas }: CarouselDisplayProps) {
  console.log("datas", datas);
  const categoryTitel =
    category === "Price" ? "Price TODAY" : "Supply" ? "TON SUPPLY" : category;

  return (
    <div className="flex items-center gap-x-[75px]">
      <h1 className="text-[21px]">{categoryTitel}</h1>
      {datas.map((data) => {
        if (data.usdValue) {
          return (
            <div className="flex items-center gap-x-[24px]" key={data.label}>
              <h2 className="opacity-[0.75] text-[13px] ">{data.label}</h2>
              <div className="flex flex-col">
                <div className="flex gap-x-[6px] items-center">
                  <strong className="text-[21px]">
                    {formatNumber(data.info)}
                  </strong>
                  <p className="text-[12px] self-end pb-[4px]">
                    {formatNumber(data.currency)}
                    {data.conversion
                      ? ` / ${formatCurrencyString(data.conversion)}`
                      : ""}
                  </p>
                </div>
                <span className="text-[12px] opacity-[0.35]">
                  $ {formatNumber(data.usdValue)}
                </span>
              </div>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-x-[24px]" key={data.label}>
            <h2 className="opacity-[0.75] text-[13px]">{data.label}</h2>
            <div className="flex gap-x-[6px] items-center">
              <strong className="text-[21px]">{formatNumber(data.info)}</strong>
              <p className="text-[12px] self-end pb-[4px]">
                {formatNumber(data.currency)}
                {data.conversion
                  ? ` / ${formatCurrencyString(data.conversion)}`
                  : ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function CarouselList() {
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
  } = await fetchCarouselDatas();

  const carouselDatas: CarouselDisplayProps[] = [
    {
      category: "Price",
      datas: [
        {
          label: "TON Price",
          info: tonPrice.usd,
          currency: "USD",
          conversion: `₩ ${tonPrice.krw}`,
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

  return (
    <div className="flex items-center gap-x-[120px] text-white font-bold">
      {carouselDatas.map((data, index) => (
        <CarouselItem key={index} {...data} />
      ))}
    </div>
  );
}
