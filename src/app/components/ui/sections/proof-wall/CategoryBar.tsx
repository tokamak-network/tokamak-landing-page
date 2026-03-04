"use client";

import { useEffect, useRef, useState } from "react";
import { sanitizeColor } from "@/app/lib/utils/format";

export interface CategoryBarData {
  name: string;
  color: string;
  linesChanged: number;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString("en-US");
}

export default function CategoryBar({
  categories,
}: {
  categories: CategoryBarData[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (categories.length === 0) return null;

  const maxValue = Math.max(...categories.map((c) => c.linesChanged));

  return (
    <div ref={ref} className="flex flex-col gap-3">
      {categories.map((cat, i) => {
        const widthPercent = maxValue > 0 ? (cat.linesChanged / maxValue) * 100 : 0;
        const safeColor = sanitizeColor(cat.color);

        return (
          <div key={cat.name} className="flex items-center gap-3">
            <span className="text-[13px] text-white/60 font-[300] w-[180px] [@media(max-width:700px)]:w-[120px] text-right shrink-0 truncate">
              {cat.name}
            </span>
            <div className="flex-1 h-[24px] bg-white/[0.04] rounded-md overflow-hidden relative">
              <div
                className="h-full rounded-md transition-all duration-1000 ease-out"
                style={{
                  width: isVisible ? `${Math.max(widthPercent, 2)}%` : "0%",
                  backgroundColor: safeColor,
                  opacity: 0.7,
                  transitionDelay: `${i * 100}ms`,
                }}
              />
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-white/50 font-[400] transition-opacity duration-500"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${i * 100 + 500}ms`,
                }}
              >
                {formatCompact(cat.linesChanged)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
