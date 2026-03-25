"use client";

import { motion } from "framer-motion";

interface TickerItem {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  change?: string;
}

/* ── Icon per metric label ── */
function MetricIcon({ label }: { label: string }) {
  const icons: Record<string, React.ReactNode> = {
    TON: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
        <circle cx="8" cy="8" r="2" fill="#00e5ff" opacity="0.8" />
      </svg>
    ),
    "MARKET CAP": (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 12 L5 7 L8 9 L14 3" stroke="#00e5ff" strokeWidth="1.2" opacity="0.7" />
        <path d="M11 3 L14 3 L14 6" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    TVL: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="8" width="3" height="6" fill="#2a72e5" opacity="0.6" />
        <rect x="6.5" y="5" width="3" height="9" fill="#00e5ff" opacity="0.5" />
        <rect x="11" y="2" width="3" height="12" fill="#00e5ff" opacity="0.7" />
      </svg>
    ),
    CODE: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M5 4 L1 8 L5 12" stroke="#00e5ff" strokeWidth="1.2" opacity="0.6" />
        <path d="M11 4 L15 8 L11 12" stroke="#00e5ff" strokeWidth="1.2" opacity="0.6" />
        <path d="M9 2 L7 14" stroke="#2a72e5" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
    PROJECTS: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
        <rect x="9" y="2" width="5" height="5" rx="1" stroke="#2a72e5" strokeWidth="1" opacity="0.5" />
        <rect x="2" y="9" width="5" height="5" rx="1" stroke="#2a72e5" strokeWidth="1" opacity="0.5" />
        <rect x="9" y="9" width="5" height="5" rx="1" stroke="#00e5ff" strokeWidth="1" opacity="0.6" />
      </svg>
    ),
    "NET GROWTH": (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 13 L8 3" stroke="#22c55e" strokeWidth="1.2" opacity="0.7" />
        <path d="M4 7 L8 3 L12 7" stroke="#22c55e" strokeWidth="1.2" opacity="0.7" />
      </svg>
    ),
  };
  return icons[label] || icons["TON"];
}

/* ── Corner bracket decorations ── */
function CornerBrackets() {
  return (
    <>
      {/* Top-left */}
      <svg
        className="absolute"
        style={{ top: -1, left: -1, width: 12, height: 12 }}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path d="M0 8 L0 0 L8 0" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
      </svg>
      {/* Top-right */}
      <svg
        className="absolute"
        style={{ top: -1, right: -1, width: 12, height: 12 }}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path d="M4 0 L12 0 L12 8" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
      </svg>
      {/* Bottom-left */}
      <svg
        className="absolute"
        style={{ bottom: -1, left: -1, width: 12, height: 12 }}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path d="M0 4 L0 12 L8 12" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
      </svg>
      {/* Bottom-right */}
      <svg
        className="absolute"
        style={{ bottom: -1, right: -1, width: 12, height: 12 }}
        viewBox="0 0 12 12"
        fill="none"
      >
        <path d="M4 12 L12 12 L12 4" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
      </svg>
    </>
  );
}

/* ── Single metric panel ── */
function MetricPanel({
  item,
  index,
  side,
}: {
  item: TickerItem;
  index: number;
  side: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.5,
        delay: 0.3 + index * 0.12,
        ease: "easeOut",
      }}
      className="relative"
      style={{
        width: "clamp(150px, 14vw, 200px)",
        padding: "clamp(10px, 1.2vw, 16px)",
        background:
          "linear-gradient(135deg, rgba(3, 8, 16, 0.85) 0%, rgba(6, 15, 35, 0.75) 100%)",
        border: "1px solid rgba(42, 114, 229, 0.2)",
        borderRadius: 3,
        backdropFilter: "blur(8px)",
        boxShadow:
          "0 0 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(0, 229, 255, 0.05)",
      }}
    >
      <CornerBrackets />

      {/* Label row */}
      <div className="flex items-center gap-1.5 mb-2">
        <MetricIcon label={item.label} />
        <span
          className="uppercase font-bold tracking-wider"
          style={{
            fontSize: "clamp(8px, 0.7vw, 10px)",
            color: "rgba(140, 200, 255, 0.6)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.12em",
          }}
        >
          {item.label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1.5">
        <span
          className="font-bold"
          style={{
            fontSize: "clamp(16px, 1.6vw, 24px)",
            color: "#fff",
            fontFamily: "'Orbitron', monospace",
            letterSpacing: "0.04em",
            textShadow: "0 0 12px rgba(0, 229, 255, 0.3)",
          }}
        >
          {item.prefix}
          {item.value}
        </span>
        {item.suffix && (
          <span
            style={{
              fontSize: "clamp(9px, 0.8vw, 12px)",
              color: "rgba(140, 200, 255, 0.5)",
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            {item.suffix}
          </span>
        )}
      </div>

      {/* Change indicator */}
      {item.change && (
        <span
          className="font-bold mt-1 block"
          style={{
            fontSize: "clamp(9px, 0.8vw, 12px)",
            color: item.change.startsWith("+") ? "#22c55e" : "#ef4444",
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          {item.change}
        </span>
      )}

      {/* Subtle scan line */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ borderRadius: 3 }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 10%, rgba(0, 229, 255, 0.08) 50%, transparent 90%)",
            animation: "scanDown 6s linear infinite",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ── Main exported component ── */
export default function FloatingMetrics({ items }: { items: TickerItem[] }) {
  // Split items: left half and right half
  const mid = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, mid);
  const rightItems = items.slice(mid);

  return (
    <div
      className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
    >
      <div
        className="relative flex items-center justify-between w-full"
        style={{
          maxWidth: "clamp(600px, 80vw, 1100px)",
          padding: "0 clamp(16px, 3vw, 48px)",
        }}
      >
        {/* Left column */}
        <div
          className="flex flex-col"
          style={{ gap: "clamp(8px, 1.2vw, 16px)" }}
        >
          {leftItems.map((item, i) => (
            <MetricPanel
              key={item.label}
              item={item}
              index={i}
              side="left"
            />
          ))}
        </div>

        {/* Center spacer (sphere shows through here) */}
        <div style={{ width: "clamp(120px, 20vw, 280px)" }} />

        {/* Right column */}
        <div
          className="flex flex-col"
          style={{ gap: "clamp(8px, 1.2vw, 16px)" }}
        >
          {rightItems.map((item, i) => (
            <MetricPanel
              key={item.label}
              item={item}
              index={i + mid}
              side="right"
            />
          ))}
        </div>
      </div>

      {/* Center label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="absolute"
        style={{
          bottom: "clamp(60px, 12vh, 120px)",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <span
          className="uppercase font-bold tracking-widest"
          style={{
            fontSize: "clamp(9px, 0.8vw, 12px)",
            color: "rgba(0, 229, 255, 0.4)",
            fontFamily: "'Orbitron', monospace",
            letterSpacing: "0.25em",
          }}
        >
          Live Data Console
        </span>
      </motion.div>
    </div>
  );
}
