import { PriceCardProps } from "../types";

export function PriceCard({ value, label }: PriceCardProps) {
  return (
    <div className="flex flex-col items-center gap-y-[18px]">
      <span className="text-[45px] h-[55px] text-[#1c1c1c]">{value}</span>
      <span className="text-[15px] text-[#252525]">{label}</span>
    </div>
  );
}
