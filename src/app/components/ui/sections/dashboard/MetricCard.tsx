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
    <div className="flex flex-col items-center justify-center p-10 bg-surface flex-1 min-w-[260px] shadow-[0_24px_65px_rgba(0,0,0,0.64)]">
      <span className="text-[12px] font-[700] text-[#929298] uppercase tracking-[0.08em] mb-4">
        {label}
      </span>
      <AnimatedCounter
        value={value}
        delay={delay}
        className="text-[56px] [@media(max-width:500px)]:text-[40px] font-[900] text-primary leading-tight"
      />
      <span className="text-[14px] text-[#929298] mt-3 text-center">
        {description}
      </span>
    </div>
  );
}
