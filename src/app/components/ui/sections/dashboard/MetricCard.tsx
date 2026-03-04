"use client";

import AnimatedCounter from "@/app/components/ui/sections/reports/AnimatedCounter";

interface MetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly description: string;
  readonly delay?: number;
}

export default function MetricCard({
  label,
  value,
  description,
  delay = 0,
}: MetricCardProps) {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 rounded-[16px]
        bg-white border border-[#E5E5E5] flex-1 min-w-[260px]"
    >
      <span className="text-[13px] font-[500] text-[#808992] uppercase tracking-wider mb-3">
        {label}
      </span>
      <AnimatedCounter
        value={value}
        delay={delay}
        className="text-[42px] [@media(max-width:500px)]:text-[32px] font-[700] text-[#1C1C1C] leading-tight"
      />
      <span className="text-[14px] font-[300] text-[#808992] mt-2 text-center">
        {description}
      </span>
    </div>
  );
}
