import Image from "next/image";
import { PriceCard } from "./PriceCard";
import Arrow from "@/assets/icons/common/arrow.svg";
import { fetchPriceInfo } from "@/app/api/carousel";

{
  /* Price Section */
}
export default async function PriceSection() {
  const { tonPrice, tradingVolumeUSD, stakingVolume } = await fetchPriceInfo();

  return (
    <div className="flex  flex-col [@media(min-width:1000px)]:flex-row  justify-between [@media(max-width:1000px)]:gap-y-[45px] [@media(max-width:800px)]:items-center">
      <div className="flex flex-col w-full max-w-[360px] [@media(max-width:800px)]:items-center [@media(max-width:800px)]:text-center">
        <h2 className="text-[30px] mb-[9px] text-tokamak-black">
          Price <span className="font-bold">TODAY</span>
        </h2>
        <p className="text-[15px] text-[#252525] mb-[30px] [@media(max-width:800px)]:mb-[18px]">
          Current status of TON, an important token in the Tokamak Network
          ecosystem
        </p>
        <a
          href="https://price.tokamak.network/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[20px] bg-[#1C1C1C] text-white px-[30px] text-[14px] flex justify-center items-center gap-[9px] w-[168px] h-[40px] hover:bg-tokamak-blue"
        >
          Detail View <Image src={Arrow} alt="arrow" />
        </a>
      </div>
      <div className="flex flex-col md:flex-row justify-center [@media(min-width:1000px)]:justify-end gap-x-[120px]">
        <PriceCard value={`$${tonPrice.toFixed(2)}`} label="TON Price" />
        <PriceCard
          value={`${tradingVolumeUSD.toFixed(2)}M`}
          label="Trading volume (USD)"
        />
        <PriceCard
          value={`${stakingVolume.toFixed(2)}M`}
          label="TON Staked Amount"
        />
      </div>
    </div>
  );
}
