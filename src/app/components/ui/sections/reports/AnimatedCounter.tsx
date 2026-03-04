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
}: {
  value: string;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const prefix = value.match(/^[+-]/)?.[0] ?? "";
  const target = Math.abs(parseNum(value));
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
              const current = Math.round(target * eased);
              const formatted =
                current === 0
                  ? "0"
                  : prefix + current.toLocaleString("en-US");
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
  }, [target, duration, delay, prefix]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
