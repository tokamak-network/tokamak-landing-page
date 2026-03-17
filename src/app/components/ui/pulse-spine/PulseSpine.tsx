"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * PulseSpine — fixed vertical element that persists across sections,
 * changing its appearance and displayed metric based on which section
 * is currently in view.
 */

interface SpineSection {
  id: string;
  label: string;
  value: string;
  color: string;
  glowColor: string;
}

interface PulseSpineProps {
  codeChanges: number;
  netGrowth: number;
  activeProjects: number;
  totalStaked: number;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

function buildSections(props: PulseSpineProps): SpineSection[] {
  return [
    {
      id: "hero-visual",
      label: "CODE CHANGES",
      value: formatCompact(props.codeChanges),
      color: "#0077ff",
      glowColor: "rgba(0, 119, 255, 0.6)",
    },
    {
      id: "ecosystem-flow",
      label: "NET GROWTH",
      value: `+${formatCompact(props.netGrowth)}`,
      color: "#22c55e",
      glowColor: "rgba(34, 197, 94, 0.5)",
    },
    {
      id: "ecosystem-metrics",
      label: "TOTAL STAKED",
      value: `${formatCompact(props.totalStaked)} TON`,
      color: "#22c55e",
      glowColor: "rgba(34, 197, 94, 0.5)",
    },
    {
      id: "developer-cta",
      label: "ACTIVE PROJECTS",
      value: String(props.activeProjects),
      color: "#0077ff",
      glowColor: "rgba(0, 119, 255, 0.4)",
    },
  ];
}

export default function PulseSpine({ codeChanges, netGrowth, activeProjects, totalStaked }: PulseSpineProps) {
  const SECTIONS = buildSections({ codeChanges, netGrowth, activeProjects, totalStaked });
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0-1 overall scroll progress
  const [isVisible, setIsVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const prevIndexRef = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = undefined;

      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / docHeight, 1);
      setProgress(scrollProgress);

      // Find the last tracked section's bottom edge
      const lastSec = document.getElementById(SECTIONS[SECTIONS.length - 1]?.id ?? "");
      const lastBottom = lastSec
        ? lastSec.getBoundingClientRect().bottom + scrollY
        : Infinity;

      // Show spine only between hero (300px) and last section bottom
      setIsVisible(scrollY > 300 && scrollY + window.innerHeight * 0.5 < lastBottom);

      // Find which section is in center of viewport
      const viewCenter = scrollY + window.innerHeight * 0.5;

      let bestIdx = 0;
      let bestDist = Infinity;

      SECTIONS.forEach((sec, i) => {
        const el = document.getElementById(sec.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elCenter = scrollY + rect.top + rect.height / 2;
        const dist = Math.abs(viewCenter - elCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });

      if (bestIdx !== prevIndexRef.current) {
        setTransitioning(true);
        setTimeout(() => setTransitioning(false), 400);
        prevIndexRef.current = bestIdx;
      }
      setActiveIndex(bestIdx);
    });
  }, []);

  useEffect(() => {
    // Check prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const section = SECTIONS[activeIndex];

  // Calculate dot position along the line (maps to overall scroll)
  const dotTop = `${8 + progress * 84}%`; // moves within 8%~92% range

  return (
    <div
      className="fixed left-6 top-0 h-screen z-50 flex-col items-center pointer-events-none hidden lg:flex"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Vertical line */}
      <div className="relative w-[2px] h-full">
        {/* Background track */}
        <div className="absolute inset-0 bg-white/[0.06] rounded-full" />

        {/* Progress fill */}
        <div
          className="absolute top-0 left-0 w-full rounded-full transition-all duration-700 ease-out"
          style={{
            height: `${progress * 100}%`,
            background: `linear-gradient(to bottom, transparent, ${section.color})`,
            opacity: 0.5,
          }}
        />

        {/* Moving dot indicator */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full transition-all duration-500 ease-out"
          style={{
            top: dotTop,
            backgroundColor: section.color,
            boxShadow: `0 0 16px ${section.glowColor}, 0 0 40px ${section.glowColor}`,
          }}
        >
          {/* Pulse ring */}
          <div
            className="absolute inset-[-6px] rounded-full animate-live-pulse"
            style={{
              border: `1px solid ${section.color}`,
              opacity: 0.4,
            }}
          />
        </div>

        {/* Section markers */}
        {SECTIONS.map((sec, i) => {
          const markerPos = `${8 + (i / (SECTIONS.length - 1)) * 84}%`;
          const isActive = i === activeIndex;
          return (
            <div
              key={sec.id}
              className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
              style={{ top: markerPos }}
            >
              <div
                className="w-[6px] h-[6px] rounded-full transition-all duration-500"
                style={{
                  backgroundColor: isActive ? sec.color : "rgba(255,255,255,0.15)",
                  transform: isActive ? "scale(1.5)" : "scale(1)",
                  boxShadow: isActive ? `0 0 8px ${sec.glowColor}` : "none",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Floating label card (attached to moving dot) */}
      <div
        className="absolute left-8 transition-all duration-500 ease-out"
        style={{
          top: dotTop,
          transform: "translateY(-50%)",
          opacity: transitioning ? 0 : 1,
        }}
      >
        <div
          className="flex flex-col gap-0.5 pl-3 border-l-2 transition-all duration-500"
          style={{ borderColor: section.color }}
        >
          <span
            className="text-[10px] font-orbitron tracking-[0.15em] uppercase transition-colors duration-500"
            style={{ color: section.color }}
          >
            {section.label}
          </span>
          <span
            className="text-[18px] font-orbitron font-bold text-white tracking-wider transition-all duration-500"
            style={{
              textShadow: `0 0 20px ${section.glowColor}`,
            }}
          >
            {section.value}
          </span>
        </div>
      </div>
    </div>
  );
}
