"use client";

import AnimatedCounter from "@/app/components/ui/sections/reports/AnimatedCounter";

interface MetricCardProps {
  readonly label: string;
  readonly value: string;
  readonly description: string;
  readonly delay?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly decimals?: number;
}

export default function MetricCard({
  label,
  value,
  description,
  delay = 0,
  prefix,
  suffix,
  decimals,
}: MetricCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-surface shadow-[0_24px_65px_rgba(0,0,0,0.64)]">
      <span className="text-[12px] font-[700] text-[#929298] uppercase tracking-[0.08em] mb-4">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        {prefix && (
          <span className="text-[36px] [@media(max-width:500px)]:text-[28px] font-[900] text-primary leading-tight">
            {prefix}
          </span>
        )}
        <AnimatedCounter
          value={value}
          delay={delay}
          decimals={decimals}
          className="text-[56px] [@media(max-width:500px)]:text-[40px] font-[900] text-primary leading-tight"
        />
        {suffix && (
          <span className="text-[20px] [@media(max-width:500px)]:text-[16px] font-[700] text-primary/60 leading-tight ml-1">
            {suffix}
          </span>
        )}
      </div>
      <span className="text-[14px] text-[#929298] mt-3 text-center">
        {description}
      </span>
    </div>
  );
}
