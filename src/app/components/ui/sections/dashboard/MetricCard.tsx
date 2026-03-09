"use client";

import { useRef, useEffect, useState } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`flex flex-col items-center justify-center p-10 bg-surface border-t-2 border-primary shadow-[0_24px_65px_rgba(0,0,0,0.64)] transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <span className="text-[11px] font-[700] text-primary/70 uppercase tracking-[0.12em] mb-5">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        {prefix && (
          <span className="text-[28px] [@media(max-width:500px)]:text-[22px] font-[700] text-white/60 leading-tight">
            {prefix}
          </span>
        )}
        <AnimatedCounter
          value={value}
          delay={delay}
          decimals={decimals}
          className="text-[60px] [@media(max-width:500px)]:text-[44px] font-[900] text-white leading-tight"
        />
        {suffix && (
          <span className="text-[18px] [@media(max-width:500px)]:text-[14px] font-[700] text-white/40 leading-tight ml-1">
            {suffix}
          </span>
        )}
      </div>
      <span className="text-[13px] text-[#929298] mt-4 text-center">
        {description}
      </span>
    </div>
  );
}
