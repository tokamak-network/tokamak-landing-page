"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  x: number; // percentage position
  y: number;
  width: number;
  height: number;
  title: string;
  color: string;
  delay?: number;
  children?: React.ReactNode;
}

/**
 * An interactive holographic screen that responds to hover.
 * Drawn with CSS — no image assets.
 */
export default function HoloScreen({
  x,
  y,
  width,
  height,
  title,
  color,
  delay = 0,
  children,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Staggered entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      ref={ref}
      className="absolute cursor-pointer transition-all duration-500"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: visible
          ? hovered
            ? "scale(1.05) translateY(-8px)"
            : "scale(1) translateY(0)"
          : "scale(0.8) translateY(30px)",
        opacity: visible ? 1 : 0,
        zIndex: hovered ? 30 : 20,
        perspective: "800px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Screen frame */}
      <div
        className="relative w-full h-full rounded-sm overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${color}08, ${color}15, ${color}05)`,
          border: `1px solid ${color}${hovered ? "60" : "30"}`,
          boxShadow: hovered
            ? `0 0 30px ${color}30, 0 0 60px ${color}15, inset 0 0 30px ${color}10`
            : `0 0 15px ${color}10, inset 0 0 15px ${color}05`,
          backdropFilter: "blur(8px)",
          transition: "all 0.4s ease",
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center gap-2 px-3 py-1.5"
          style={{
            borderBottom: `1px solid ${color}20`,
            background: `linear-gradient(90deg, ${color}15, transparent)`,
          }}
        >
          {/* Status dot */}
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 6px ${color}`,
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <span
            className="text-[10px] font-mono tracking-wider uppercase"
            style={{ color: `${color}cc` }}
          >
            {title}
          </span>
        </div>

        {/* Content area */}
        <div className="p-3 h-[calc(100%-28px)] flex flex-col justify-between">
          {children || <DefaultContent color={color} hovered={hovered} />}
        </div>

        {/* Scan line animation on hover */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${color}08 50%, transparent 100%)`,
              animation: "scanDown 2s linear infinite",
            }}
          />
        )}

        {/* Corner accents */}
        <svg
          className="absolute top-0 left-0 w-4 h-4 pointer-events-none"
          viewBox="0 0 16 16"
        >
          <path d="M0,8 L0,0 L8,0" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
        </svg>
        <svg
          className="absolute top-0 right-0 w-4 h-4 pointer-events-none"
          viewBox="0 0 16 16"
        >
          <path d="M8,0 L16,0 L16,8" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-4 h-4 pointer-events-none"
          viewBox="0 0 16 16"
        >
          <path d="M0,8 L0,16 L8,16" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
        </svg>
        <svg
          className="absolute bottom-0 right-0 w-4 h-4 pointer-events-none"
          viewBox="0 0 16 16"
        >
          <path d="M8,16 L16,16 L16,8" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
        </svg>
      </div>

      {/* Reflection/glow below */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-3/4 h-4 rounded-full"
        style={{
          background: `radial-gradient(ellipse, ${color}${hovered ? "20" : "08"} 0%, transparent 70%)`,
          filter: "blur(4px)",
          transition: "all 0.4s ease",
        }}
      />
    </div>
  );
}

function DefaultContent({ color, hovered }: { color: string; hovered: boolean }) {
  return (
    <>
      {/* Fake chart bars */}
      <div className="flex items-end gap-1 h-1/2 px-1">
        {[40, 65, 35, 80, 55, 70, 45, 90, 60, 50, 75, 85].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm transition-all duration-300"
            style={{
              height: `${hovered ? h : h * 0.6}%`,
              background: `linear-gradient(to top, ${color}${hovered ? "80" : "40"}, ${color}10)`,
              transitionDelay: `${i * 30}ms`,
            }}
          />
        ))}
      </div>

      {/* Fake data rows */}
      <div className="space-y-1 mt-2">
        {[0.7, 0.5, 0.4].map((w, i) => (
          <div
            key={i}
            className="h-[3px] rounded-full"
            style={{
              width: `${w * 100}%`,
              background: `linear-gradient(to right, ${color}30, transparent)`,
            }}
          />
        ))}
      </div>
    </>
  );
}
