"use client";

interface HeatmapTooltipProps {
  date: string;
  value: number;
  x: number;
  y: number;
  visible: boolean;
}

export default function HeatmapTooltip({
  date,
  value,
  x,
  y,
  visible,
}: HeatmapTooltipProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 px-3 py-2 bg-[#1a1a1d] border border-[#333] text-[12px] text-white pointer-events-none shadow-xl"
      style={{ left: x, top: y - 40, transform: "translateX(-50%)" }}
    >
      <div className="font-[700] font-orbitron">{value} changes</div>
      <div className="text-[#929298] text-[10px]">{date}</div>
    </div>
  );
}
