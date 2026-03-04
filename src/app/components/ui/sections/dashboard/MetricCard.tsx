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
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex-1 min-w-[260px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <span className="text-[13px] font-[500] text-slate-400 uppercase tracking-wider mb-3">
        {label}
      </span>
      <AnimatedCounter
        value={value}
        delay={delay}
        className="text-[42px] [@media(max-width:500px)]:text-[32px] font-[700] text-primary leading-tight"
      />
      <span className="text-[14px] text-slate-500 mt-2 text-center">
        {description}
      </span>
    </div>
  );
}
