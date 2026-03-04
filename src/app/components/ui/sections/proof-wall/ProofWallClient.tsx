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
      className="w-full flex justify-center bg-[#141414] px-6 py-[100px] [@media(max-width:700px)]:py-[60px]"
    >
      <div className="w-full max-w-[1200px]">
        <h2 className="text-[14px] uppercase tracking-[3px] text-[#0078FF] font-[500] mb-4 text-center">
          Activity Proof
        </h2>
        <p
          className="text-[28px] [@media(max-width:700px)]:text-[22px] text-white/80 font-[300] text-center mb-[60px] max-w-[600px] mx-auto leading-snug transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          Don&apos;t take our word for it. Here&apos;s what we&apos;ve been building.
        </p>

        {/* Top row: 4 animated metric counters */}
        <div className="grid grid-cols-4 [@media(max-width:900px)]:grid-cols-2 gap-6 mb-[60px]">
          {allMetrics.map((metric, i) => (
            <div
              key={metric.label}
              className="flex flex-col items-center p-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl transition-all duration-700"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <div className="text-[36px] [@media(max-width:700px)]:text-[28px] font-[500] text-white mb-1">
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
                <span className="text-[13px] text-white/40 font-[400] mb-1">
                  {metric.suffix}
                </span>
              )}
              <span className="text-[13px] text-white/50 font-[400]">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom row: Category activity bar chart */}
        {categories.length > 0 && (
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 [@media(max-width:700px)]:p-5">
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
