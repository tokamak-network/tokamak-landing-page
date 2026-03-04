"use client";

import AnimatedCounter from "@/app/components/ui/sections/reports/AnimatedCounter";
import { LINKS } from "@/app/constants/links";

interface HeroMetric {
  readonly label: string;
  readonly value: string;
  readonly delay: number;
}

const HERO_METRICS: readonly HeroMetric[] = [
  { label: "Total Staked", value: "28,500,000", delay: 0 },
  { label: "Active Projects", value: "42", delay: 200 },
  { label: "Code Changes", value: "4,898,658", delay: 400 },
] as const;

function MetricItem({ metric }: { readonly metric: HeroMetric }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[15px] font-[400] text-white/60 uppercase tracking-wider">
        {metric.label}
      </span>
      <AnimatedCounter
        value={metric.value}
        duration={2000}
        delay={metric.delay}
        className="text-[56px] [@media(max-width:768px)]:text-[36px] font-[700] text-white leading-none"
      />
    </div>
  );
}

export default function HeroC() {
  return (
    <section className="w-full flex flex-col items-center pt-[120px] pb-[80px] [@media(max-width:640px)]:pt-[80px] [@media(max-width:640px)]:pb-[50px] px-[25px]">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <div className="flex gap-[60px] [@media(max-width:768px)]:gap-[40px] [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:gap-[32px] mb-[40px]">
          {HERO_METRICS.map((metric) => (
            <MetricItem key={metric.label} metric={metric} />
          ))}
        </div>
        <p className="text-[20px] [@media(max-width:640px)]:text-[16px] font-[300] text-white/70 text-center mb-[40px]">
          Building the infrastructure for on-demand L2s
        </p>
        <a
          href={LINKS.ROLLUP_HUB}
          target="_blank"
          rel="noopener noreferrer"
          className="px-[32px] py-[14px] bg-[#0078FF] hover:bg-[#0060CC] text-white text-[14px] font-[600] rounded-[26px] transition-colors duration-200"
        >
          START BUILDING
        </a>
      </div>
    </section>
  );
}
