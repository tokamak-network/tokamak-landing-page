"use client";

import AnimatedCounter from "@/app/components/ui/sections/reports/AnimatedCounter";
import { LINKS } from "@/app/constants/links";

interface HeroMetric {
  readonly label: string;
  readonly value: string;
  readonly delay: number;
}

const HERO_METRICS: readonly HeroMetric[] = [
  { label: "TON Staked", value: "28,500,000", delay: 0 },
  { label: "Active Projects", value: "42", delay: 200 },
  { label: "Code Changes", value: "4,898,658", delay: 400 },
] as const;

function MetricItem({ metric }: { readonly metric: HeroMetric }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-slate-400 text-[12px] font-[700] uppercase tracking-[0.2em]">
        {metric.label}
      </span>
      <AnimatedCounter
        value={metric.value}
        duration={2000}
        delay={metric.delay}
        className="text-[48px] md:text-[72px] [@media(max-width:640px)]:text-[36px] font-[800] text-white leading-none tracking-tighter"
      />
    </div>
  );
}

function Divider() {
  return (
    <div className="hidden [@media(min-width:641px)]:block w-px h-24 bg-border-color" />
  );
}

export default function HeroC() {
  return (
    <section className="w-full flex flex-col items-center pt-[120px] pb-[80px] [@media(max-width:640px)]:pt-[80px] [@media(max-width:640px)]:pb-[50px] px-6">
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <div className="flex gap-12 [@media(min-width:641px)]:gap-24 [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:gap-8 items-center justify-center w-full mb-8">
          <MetricItem metric={HERO_METRICS[0]} />
          <Divider />
          <MetricItem metric={HERO_METRICS[1]} />
          <Divider />
          <MetricItem metric={HERO_METRICS[2]} />
        </div>
        <div className="flex flex-col items-center gap-6 max-w-2xl mt-4">
          <p className="text-slate-400 text-[18px] [@media(max-width:640px)]:text-[16px] text-center leading-relaxed">
            Monitor the core metrics and real-time activity across the Tokamak Network ecosystem.
          </p>
          <a
            href={LINKS.ROLLUP_HUB}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-primary/90 text-white text-[16px] font-[700] shadow-[0_0_20px_rgba(19,91,236,0.3)] transition-all"
          >
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}
