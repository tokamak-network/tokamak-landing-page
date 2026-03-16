"use client";

import { useState, useEffect, useRef } from "react";
import { parseNum } from "@/app/lib/utils/format";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function AnimatedCounter({
  value,
  duration = 1800,
  delay = 0,
  className,
  decimals = 0,
}: {
  value: string;
  duration?: number;
  delay?: number;
  className?: string;
  decimals?: number;
}) {
  const signPrefix = value.match(/^[+-]/)?.[0] ?? "";
  const target = decimals > 0
    ? Math.abs(parseFloat(value.replace(/[^0-9.-]/g, "")) || 0)
    : Math.abs(parseNum(value));
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timerId: ReturnType<typeof setTimeout> | undefined;
    let rafId: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          observer.disconnect();

          timerId = setTimeout(() => {
            const start = performance.now();

            function tick(now: number) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = easeOutCubic(progress);
              const current = target * eased;
              const formatted =
                current === 0
                  ? "0"
                  : decimals > 0
                    ? signPrefix + current.toLocaleString("en-US", {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals,
                      })
                    : signPrefix + Math.round(current).toLocaleString("en-US");
              setDisplay(formatted);

              if (progress < 1) {
                rafId = requestAnimationFrame(tick);
              }
            }

            rafId = requestAnimationFrame(tick);
          }, delay);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timerId !== undefined) clearTimeout(timerId);
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, [target, duration, delay, signPrefix, decimals]);

  // Split large numbers: show trailing ",000" groups smaller
  // Triggers for numbers >= 1,000,000 (has at least two comma groups)
  const commaGroups = display.replace(/^[+-]/, "").split(",");
  const shouldFade = commaGroups.length >= 3 && decimals === 0;

  if (shouldFade) {
    // Keep all but last comma group as "main", last group as "trail"
    const mainPart = commaGroups.slice(0, -1).join(",");
    const trailPart = "," + commaGroups[commaGroups.length - 1];
    const prefix = display.match(/^[+-]/)?.[0] ?? "";

    return (
      <span ref={ref} className={className}>
        {prefix}{mainPart}
        <span className="text-[0.55em] font-[700] opacity-35 tracking-tight">{trailPart}</span>
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
