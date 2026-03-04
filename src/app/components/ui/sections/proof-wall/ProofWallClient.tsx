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
      className="relative z-10 w-full flex justify-center bg-surface text-white px-6 py-[160px] [@media(max-width:700px)]:py-[80px]"
    >
      <div className="w-full max-w-[1280px]">
        <span className="block text-primary font-[700] text-[12px] tracking-[0.08em] uppercase text-center mb-3">
          Proof of Work
        </span>
        <h2
          className="text-[38px] md:text-[48px] [@media(max-width:700px)]:text-[32px] font-[900] tracking-[0.06em] uppercase text-center mb-[80px] transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          Don&apos;t Take Our Word For It.
        </h2>

        {/* Metric cards */}
        <div className="grid grid-cols-4 [@media(max-width:900px)]:grid-cols-2 gap-0 mb-[60px]">
          {allMetrics.map((metric, i) => (
            <div
              key={metric.label}
              className="flex flex-col items-center p-8 bg-black/40 text-center transition-all duration-700"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <span className="text-[12px] text-[#929298] font-[700] uppercase tracking-[0.08em] mb-3">
                {metric.label}
              </span>
              <div className="text-[36px] md:text-[48px] [@media(max-width:700px)]:text-[28px] font-[900] text-primary">
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
                <span className="text-[12px] text-[#929298] font-[400] mt-1 uppercase">
                  {metric.suffix}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Category activity bar chart */}
        {categories.length > 0 && (
          <div className="bg-black/40 border border-[#434347] p-8 [@media(max-width:700px)]:p-5">
            <h3 className="text-[14px] text-[#929298] font-[700] uppercase tracking-[0.06em] mb-6">
              Code Changes by Category
            </h3>
            <CategoryBar categories={categories} />
            <div className="mt-6 text-right">
              <Link
                href={`/about/reports/${latestReportSlug}`}
                className="text-[14px] text-primary hover:text-primary/80 font-[700] uppercase tracking-[0.04em] transition-colors duration-300"
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
