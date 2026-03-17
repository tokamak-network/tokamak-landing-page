"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Bug,
  RefreshCw,
  FlaskConical,
  FileText,
  Server,
  GitCommit,
} from "lucide-react";
import type { StreamItem } from "./index";

// ── Badge config ─────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  StreamItem["type"],
  { label: string; color: string; icon: React.ReactNode }
> = {
  feat: {
    label: "Feature",
    color: "#22c55e",
    icon: <Sparkles size={13} />,
  },
  fix: {
    label: "Fix",
    color: "#ef4444",
    icon: <Bug size={13} />,
  },
  refactor: {
    label: "Refactor",
    color: "#f59e0b",
    icon: <RefreshCw size={13} />,
  },
  test: {
    label: "Test",
    color: "#8b5cf6",
    icon: <FlaskConical size={13} />,
  },
  docs: {
    label: "Docs",
    color: "#0ea5e9",
    icon: <FileText size={13} />,
  },
  infra: {
    label: "Infra",
    color: "#64748b",
    icon: <Server size={13} />,
  },
};

// ── Timeline item ────────────────────────────────────────────────────

function TimelineItem({
  item,
  isLast,
}: {
  readonly item: StreamItem;
  readonly isLast: boolean;
}) {
  const cfg = TYPE_CONFIG[item.type];

  return (
    <div className="flex gap-0 group">
      {/* Left: time */}
      <div className="w-[72px] shrink-0 pt-[3px] text-right pr-4">
        <span className="text-[12px] text-[#555] font-mono tabular-nums">
          {item.time}
        </span>
      </div>

      {/* Center: line + node */}
      <div className="flex flex-col items-center shrink-0">
        {/* Node */}
        <div
          className="w-[9px] h-[9px] rounded-full border-2 shrink-0 mt-[5px] transition-all duration-200 group-hover:scale-125"
          style={{
            borderColor: cfg.color,
            backgroundColor: "transparent",
            boxShadow: `0 0 6px ${cfg.color}40`,
          }}
        />
        {/* Vertical line */}
        {!isLast && (
          <div className="w-[1px] flex-1 min-h-[24px] bg-[#1a1a1a]" />
        )}
      </div>

      {/* Right: content */}
      <div className="flex-1 pl-4 pb-5 min-w-0">
        {/* Repo name + badge */}
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[13px] font-[700] text-white">
            {item.repoName}
          </span>
          <span
            className="inline-flex items-center gap-1 px-2 py-[2px] rounded text-[11px] font-[700] uppercase tracking-[0.06em]"
            style={{
              backgroundColor: cfg.color + "18",
              color: cfg.color,
              border: `1px solid ${cfg.color}30`,
            }}
          >
            {cfg.icon}
            {cfg.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-[#999] leading-relaxed group-hover:text-[#bbb] transition-colors duration-200">
          {item.text}
        </p>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────

interface StreamClientProps {
  items: StreamItem[];
}

export default function StreamClient({ items }: StreamClientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

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
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Count types for summary
  const typeCounts = items.reduce(
    (acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const sortedTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <section
      id="activity-stream"
      className="relative z-10 w-full flex justify-center bg-surface px-6 py-[80px]"
    >
      <div ref={ref} className="w-full max-w-[1280px] flex flex-col items-center">
        {/* Section header */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-[1px] bg-primary" />
          <span className="text-[12px] text-primary font-[700] uppercase tracking-[0.1em]">
            Development Feed
          </span>
          <div className="w-8 h-[1px] bg-primary" />
        </motion.div>

        <motion.h2
          className="text-[38px] md:text-[48px] [@media(max-width:700px)]:text-[28px] font-[900] text-white tracking-[0.06em] uppercase mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Activity
        </motion.h2>

        <motion.p
          className="text-[16px] text-[#929298] mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Latest development activity across the ecosystem
        </motion.p>

        {/* Type summary pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-[50px]"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {sortedTypes.map(([type, count]) => {
            const cfg = TYPE_CONFIG[type as StreamItem["type"]];
            return (
              <div
                key={type}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
                style={{
                  borderColor: cfg.color + "30",
                  backgroundColor: cfg.color + "08",
                }}
              >
                <span style={{ color: cfg.color }}>{cfg.icon}</span>
                <span
                  className="text-[13px] font-[700]"
                  style={{ color: cfg.color }}
                >
                  {count}
                </span>
                <span className="text-[13px] text-[#666]">{cfg.label}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#1a1a1a]">
            <GitCommit size={13} className="text-[#666]" />
            <span className="text-[13px] font-[700] text-white">
              {items.length}
            </span>
            <span className="text-[13px] text-[#666]">Total</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <div
          className="relative w-full max-w-[720px] h-[440px] [@media(max-width:768px)]:h-[280px] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Top/bottom fade masks */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-surface to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent z-10 pointer-events-none" />

          {/* Scrolling timeline */}
          <div
            className={`flex flex-col animate-scroll-vertical ${isPaused ? "[animation-play-state:paused]" : ""}`}
          >
            {[...items, ...items].map((item, i) => (
              <TimelineItem
                key={`${item.repoName}-${i}`}
                item={item}
                isLast={false}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
