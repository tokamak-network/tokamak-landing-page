"use client";

import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  scale?: number;
  className?: string;
}

/**
 * Retro CRT TV frame with antenna, knobs, wood panel.
 * The children render inside the "screen" area.
 */
export default function TVFrame({ children, scale = 1, className = "" }: Props) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        transition: "transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Antenna */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-16 flex items-end gap-0">
        <div
          className="w-[2px] h-16 origin-bottom"
          style={{
            background: "linear-gradient(to top, #555, #888)",
            transform: "rotate(-20deg)",
          }}
        />
        <div
          className="w-[2px] h-16 origin-bottom"
          style={{
            background: "linear-gradient(to top, #555, #888)",
            transform: "rotate(20deg)",
          }}
        />
        {/* Antenna tip balls */}
        <div
          className="absolute -top-1 w-2 h-2 rounded-full bg-gray-400"
          style={{ left: "-14px" }}
        />
        <div
          className="absolute -top-1 w-2 h-2 rounded-full bg-gray-400"
          style={{ right: "-14px" }}
        />
      </div>

      {/* TV body */}
      <div
        className="relative rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #4a3728 0%, #3d2e1f 50%, #2e2218 100%)",
          padding: "20px 24px 28px 24px",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Top wood trim */}
        <div
          className="absolute top-0 left-0 right-0 h-3"
          style={{
            background: "linear-gradient(90deg, #5a4433, #6b5240, #5a4433)",
            borderBottom: "1px solid #3d2e1f",
          }}
        />

        {/* Screen bezel */}
        <div
          className="relative rounded-sm overflow-hidden"
          style={{
            border: "3px solid #222",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.8), 0 0 1px #111",
          }}
        >
          {/* The actual screen */}
          <div className="relative aspect-[4/3] bg-[#0a0a08] overflow-hidden">
            {children}

            {/* CRT curvature overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.4) 100%)",
                zIndex: 40,
              }}
            />

            {/* Scan lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
                zIndex: 41,
              }}
            />

            {/* Screen glass reflection */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.01) 100%)",
                zIndex: 42,
              }}
            />
          </div>
        </div>

        {/* Bottom control panel */}
        <div className="flex items-center justify-between mt-3 px-2">
          {/* Brand label */}
          <div className="text-[10px] font-mono tracking-wider text-[#8a7560]">
            TOKAMAK
          </div>

          {/* Knobs */}
          <div className="flex items-center gap-3">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 35%, #777, #444, #333)",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)",
                }}
              >
                {/* Knob indicator line */}
                <div
                  className="w-[1px] h-2 bg-gray-300/50 mx-auto mt-0.5"
                  style={{ transform: `rotate(${i * 45 - 20}deg)` }}
                />
              </div>
            ))}
          </div>

          {/* Channel indicator */}
          <div
            className="px-2 py-0.5 rounded-sm text-[10px] font-mono"
            style={{
              background: "#1a1510",
              color: "#33ff33",
              border: "1px solid #333",
              textShadow: "0 0 4px #33ff3360",
            }}
          >
            CH.01
          </div>
        </div>
      </div>

      {/* VCR unit under TV */}
      <div
        className="mx-6 rounded-b-sm"
        style={{
          height: "20px",
          background: "linear-gradient(180deg, #222, #1a1a1a)",
          borderTop: "1px solid #333",
          boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex items-center justify-center h-full gap-4">
          <div className="w-8 h-1 rounded-full bg-[#111] border border-[#333]" />
          <div className="w-1 h-1 rounded-full bg-red-900" />
        </div>
      </div>
    </div>
  );
}
