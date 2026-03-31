"use client";

import { useRef, useEffect, useState } from "react";

interface FloorIndicatorProps {
  floor: number;
  label?: string;
}

/**
 * Full-screen cyberpunk floor transition indicator.
 * Reveals with scroll-triggered animation when entering viewport.
 */
export default function FloorIndicator({ floor, label }: FloorIndicatorProps) {
  const floorNum = String(floor).padStart(2, "0");
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full flex items-center justify-center overflow-hidden bg-black"
      style={{ height: "100vh", scrollSnapAlign: "start" }}
    >
      {/* Vertical guide lines removed — caused visible border artifacts */}

      {/* Center content */}
      <div
        className="relative flex flex-col items-center gap-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition:
            "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Floor label */}
        <span
          className="uppercase tracking-[0.35em] font-bold"
          style={{
            fontSize: "clamp(12px, 1.5vw, 22px)",
            color: "#00e5ff",
            fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
            textShadow:
              "0 0 15px rgba(0, 229, 255, 0.6), 0 0 40px rgba(0, 229, 255, 0.2)",
          }}
        >
          Floor {floorNum}
        </span>

        {/* Sub-label */}
        {label && (
          <span
            className="uppercase tracking-[0.2em]"
            style={{
              fontSize: "clamp(9px, 0.9vw, 13px)",
              color: "rgba(140, 200, 255, 0.5)",
              fontFamily: "'Share Tech Mono', monospace",
              marginTop: -4,
              opacity: visible ? 1 : 0,
              transition: "opacity 0.6s ease 0.25s",
            }}
          >
            {label}
          </span>
        )}

        {/* Horizontal cyan line — expands from center */}
        <div
          style={{
            width: "clamp(200px, 40vw, 500px)",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6) 20%, #00e5ff 50%, rgba(0, 229, 255, 0.6) 80%, transparent)",
            boxShadow:
              "0 0 8px rgba(0, 229, 255, 0.4), 0 0 20px rgba(0, 229, 255, 0.15)",
            transform: visible ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
          }}
        />

        {/* Down chevron */}
        <svg
          width="20"
          height="12"
          viewBox="0 0 20 12"
          fill="none"
          style={{
            marginTop: 2,
            filter: "drop-shadow(0 0 6px rgba(0, 229, 255, 0.5))",
            animation: visible ? "chevronBounce 2s ease-in-out infinite" : "none",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s ease 0.4s",
          }}
        >
          <path
            d="M2 2 L10 10 L18 2"
            stroke="#00e5ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Subtle radial glow at center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0, 229, 255, 0.04) 0%, transparent 70%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 1s ease 0.2s",
        }}
      />

      {/* Aurora light curtain — volumetric glow from above */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 1.2s ease 0.3s" }}
      >
        {/* Primary curtain — wide soft wash */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "70%",
            background:
              "linear-gradient(180deg, rgba(42, 114, 229, 0.08) 0%, rgba(42, 114, 229, 0.04) 30%, rgba(42, 114, 229, 0.015) 60%, transparent 100%)",
            filter: "blur(30px)",
          }}
        />
        {/* Secondary curtain — narrower, offset */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "25%",
            width: "30%",
            height: "60%",
            background:
              "linear-gradient(180deg, rgba(0, 119, 255, 0.06) 0%, rgba(0, 119, 255, 0.02) 50%, transparent 100%)",
            filter: "blur(20px)",
          }}
        />
        {/* Tertiary — right side accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: "20%",
            width: "25%",
            height: "55%",
            background:
              "linear-gradient(180deg, rgba(42, 114, 229, 0.05) 0%, rgba(42, 114, 229, 0.015) 50%, transparent 100%)",
            filter: "blur(25px)",
          }}
        />
      </div>
    </div>
  );
}
