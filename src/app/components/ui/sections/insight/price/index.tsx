import Image from "next/image";
import { PriceCard } from "./PriceCard";
import Arrow from "@/assets/icons/common/arrow.svg";

{
  /* Price Section */
}
export default function PriceSection() {
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
        <button className="rounded-[20px] bg-[#1C1C1C] text-white px-[30px] text-[14px] flex justify-center items-center gap-[9px] w-[168px] h-[40px]">
          Detail View <Image src={Arrow} alt="arrow" />
        </button>
      </div>
      <div className="flex justify-end gap-x-[120px]">
        <PriceCard value="$2.11" label="TON Price" />
        <PriceCard value="6.8M" label="Trading volume (USD)" />
        <PriceCard value="20M" label="TON Staked Amount" />
      </div>
    </div>
  );
}
