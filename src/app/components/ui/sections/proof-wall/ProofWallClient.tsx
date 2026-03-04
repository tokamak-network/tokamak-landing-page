"use client";

import { useEffect, useRef, useState } from "react";
import AnimatedCounter from "@/app/components/ui/sections/reports/AnimatedCounter";
import CategoryBar from "./CategoryBar";
import type { CategoryBarData } from "./CategoryBar";
import Link from "next/link";

interface MetricCard {
  label: string;
  value: string;
  suffix?: string;
}

interface ProofWallClientProps {
  metrics: MetricCard[];
  categories: CategoryBarData[];
  latestReportSlug: string;
}

export default function ProofWallClient({
  metrics,
  categories,
  latestReportSlug,
}: ProofWallClientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stakedVolume, setStakedVolume] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStaked() {
      try {
        const res = await fetch("/api/price", { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (data.stakedVolume) {
          const formatted = Math.floor(data.stakedVolume).toLocaleString("en-US");
          setStakedVolume(formatted);
        }
      } catch {
        // Silently fail — metric will show fallback
      }
    }

    fetchStaked();
    return () => controller.abort();
  }, []);

  const allMetrics: MetricCard[] = [
    ...metrics,
    {
      label: "TON Staked",
      value: stakedVolume ?? "---",
      suffix: "TON",
    },
  ];

  return (
    <section
      ref={ref}
      className="w-full flex justify-center bg-[#0a0f1a] text-white px-6 py-[100px] [@media(max-width:700px)]:py-[60px]"
    >
      <div className="w-full max-w-[1200px]">
        <span className="block text-[#0078FF] font-[700] text-[12px] tracking-[3px] uppercase text-center mb-3">
          Proof of Work
        </span>
        <h2
          className="text-[36px] md:text-[48px] [@media(max-width:700px)]:text-[28px] font-[700] tracking-tight text-center mb-[60px] transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          Don&apos;t take our word for it.
        </h2>

        {/* Metric cards */}
        <div className="grid grid-cols-4 [@media(max-width:900px)]:grid-cols-2 gap-6 mb-[60px]">
          {allMetrics.map((metric, i) => (
            <div
              key={metric.label}
              className="flex flex-col items-center p-6 bg-white/5 border border-white/10 rounded-xl text-center transition-all duration-700"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <span className="text-[13px] text-slate-400 font-[500] mb-2">
                {metric.label}
              </span>
              <div className="text-[32px] md:text-[36px] [@media(max-width:700px)]:text-[28px] font-[900] text-[#0078FF]">
                {metric.value === "---" ? (
                  <span className="text-white/30">---</span>
                ) : (
                  <AnimatedCounter
                    value={metric.value}
                    duration={2000}
                    delay={i * 200}
                  />
                )}
              </div>
              {metric.suffix && (
                <span className="text-[13px] text-slate-400 font-[400] mt-1">
                  {metric.suffix}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Category activity bar chart */}
        {categories.length > 0 && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8 [@media(max-width:700px)]:p-5">
            <h3 className="text-[16px] text-white/70 font-[400] mb-6">
              Code Changes by Category
            </h3>
            <CategoryBar categories={categories} />
            <div className="mt-6 text-right">
              <Link
                href={`/about/reports/${latestReportSlug}`}
                className="text-[14px] text-[#0078FF] hover:text-[#3399ff] font-[400] transition-colors"
              >
                See detailed report →
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
