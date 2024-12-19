import Image from "next/image";
import { PriceCard } from "./PriceCard";
import Arrow from "@/assets/icons/common/arrow.svg";
import { fetchPriceInfo } from "@/app/api/price";

{
  /* Price Section */
}
export default async function PriceSection() {
  const { tonPrice, tradingVolumeUSD, stakingVolume } = await fetchPriceInfo();

  return (
    <div className="flex justify-between">
      <div className="flex flex-col w-[360px]">
        <h2 className="text-[30px] mb-[9px]">
          Price <span className="font-bold">TODAY</span>
        </h2>
        <p className="text-[15px] text-gray-600 mb-[30px]">
          Current status of TON, an important token in the Tokamak Network
          ecosystem
        </p>
        <a
          href="https://price.tokamak.network/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[20px] bg-[#1C1C1C] text-white px-[30px] text-[14px] flex justify-center items-center gap-[9px] w-[168px] h-[40px]"
        >
          Detail View <Image src={Arrow} alt="arrow" />
        </a>
      </div>
      <div className="flex justify-end gap-x-[120px]">
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
