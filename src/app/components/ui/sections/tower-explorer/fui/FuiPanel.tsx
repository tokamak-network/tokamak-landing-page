"use client";

import { useState, type ReactNode } from "react";

interface Props {
  title: string;
  color: string;
  children: ReactNode;
  width?: string;
  height?: string;
  className?: string;
}

/**
 * Reusable FUI (Fantasy UI) panel with frame, header, corner brackets.
 */
export default function FuiPanel({
  title,
  color,
  children,
  width = "100%",
  height = "100%",
  className = "",
}: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      style={{ width, height }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-full h-full rounded-sm overflow-hidden cursor-default transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}06, ${color}10, ${color}04)`,
          border: `1px solid ${color}${hovered ? "50" : "25"}`,
          boxShadow: hovered
            ? `0 0 20px ${color}20, inset 0 0 20px ${color}08`
            : `inset 0 0 10px ${color}04`,
        }}
      >
        {/* Header bar */}
        <div
          className="flex items-center gap-2 px-2.5 py-1"
          style={{
            borderBottom: `1px solid ${color}18`,
            background: `linear-gradient(90deg, ${color}12, transparent)`,
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 4px ${color}`,
              animation: "pulse 2.5s ease-in-out infinite",
            }}
          />
          <span
            className="text-[9px] font-mono tracking-wider uppercase"
            style={{ color: `${color}bb` }}
          >
            {title}
          </span>
        </div>

        {/* Content */}
        <div className="p-2 h-[calc(100%-24px)] overflow-hidden">
          {children}
        </div>

        {/* Corner brackets */}
        {[
          "top-0 left-0",
          "top-0 right-0 -scale-x-100",
          "bottom-0 left-0 -scale-y-100",
          "bottom-0 right-0 -scale-x-100 -scale-y-100",
        ].map((pos, i) => (
          <svg
            key={i}
            className={`absolute ${pos} w-3 h-3 pointer-events-none`}
            viewBox="0 0 12 12"
          >
            <path d="M0,6 L0,0 L6,0" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
          </svg>
        ))}

        {/* Hover scan line */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${color}06 50%, transparent 100%)`,
              animation: "scanDown 2.5s linear infinite",
            }}
          />
        )}
      </div>
    </div>
  );
}
