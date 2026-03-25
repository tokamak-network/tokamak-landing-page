"use client";

import { useState } from "react";

export interface Channel {
  id: string;
  number: string;
  name: string;
  preview?: string;
}

export const CHANNELS: Channel[] = [
  { id: "overview", number: "01", name: "OVERVIEW" },
  { id: "staking", number: "02", name: "STAKING" },
  { id: "bridge", number: "03", name: "BRIDGE" },
  { id: "governance", number: "04", name: "GOVERNANCE" },
  { id: "ecosystem", number: "05", name: "ECOSYSTEM" },
  { id: "developer", number: "06", name: "DEVELOPER" },
];

interface Props {
  activeChannel: number;
  onSelect: (index: number) => void;
}

/**
 * TV Guide channel selection overlay — matches image 3 reference.
 * Renders inside the TV screen area.
 */
export default function ChannelGuide({ activeChannel, onSelect }: Props) {
  const [hoveredChannel, setHoveredChannel] = useState<number | null>(null);

  return (
    <div className="absolute inset-0 flex flex-col font-mono" style={{ color: "#33ff33" }}>
      {/* VHS static top */}
      <div
        className="h-4 w-full opacity-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.08) 1px, rgba(255,255,255,0.08) 2px)",
          animation: "vhsStatic 0.3s steps(3) infinite",
        }}
      />

      {/* Header bar */}
      <div
        className="flex justify-between items-center px-4 py-1.5"
        style={{ borderBottom: "1px solid #33ff3330" }}
      >
        <span className="text-xs tracking-wider" style={{ color: "#33ff3380" }}>
          TV GUIDE
        </span>
        <span className="text-[10px]" style={{ color: "#33ff3360" }}>
          {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()}
          {" — "}
          {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
        </span>
      </div>

      {/* Channel list + Preview layout */}
      <div className="flex-1 flex">
        {/* Channel list */}
        <div className="flex-1 flex flex-col justify-center px-4 py-3 space-y-1">
          {CHANNELS.map((ch, i) => {
            const isActive = i === activeChannel;
            const isHovered = i === hoveredChannel;
            return (
              <button
                key={ch.id}
                className="flex items-center gap-3 px-3 py-1.5 text-left w-full transition-all duration-200"
                style={{
                  background: isActive
                    ? "#33ff3320"
                    : isHovered
                    ? "#33ff3308"
                    : "transparent",
                  border: isActive
                    ? "1px solid #33ff3350"
                    : "1px solid transparent",
                  borderRadius: "2px",
                }}
                onClick={() => onSelect(i)}
                onMouseEnter={() => setHoveredChannel(i)}
                onMouseLeave={() => setHoveredChannel(null)}
              >
                <span className="text-xs" style={{ color: "#33ff3360" }}>
                  [{isActive ? "■" : " "}]
                </span>
                <span
                  className="text-sm md:text-base tracking-wider"
                  style={{
                    color: isActive ? "#33ff33" : "#33ff3380",
                    textShadow: isActive ? "0 0 8px #33ff3340" : "none",
                  }}
                >
                  CH.{ch.number} {ch.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right side: channel number + preview */}
        <div className="w-2/5 flex flex-col items-center justify-center px-4 gap-3">
          {/* Large channel number */}
          <div
            className="text-4xl md:text-5xl font-bold tracking-wider"
            style={{
              color: "#33ff33",
              textShadow: "0 0 15px #33ff3340, 0 0 30px #33ff3315",
            }}
          >
            CH.{CHANNELS[hoveredChannel ?? activeChannel].number}
          </div>
          <div className="text-xs tracking-[0.2em]" style={{ color: "#33ff3380" }}>
            {CHANNELS[hoveredChannel ?? activeChannel].name}
          </div>

          {/* Preview box */}
          <div
            className="w-full aspect-[4/3] rounded-sm mt-2 flex items-center justify-center"
            style={{
              border: "1px solid #33ff3330",
              background: "#0a0a08",
            }}
          >
            <div className="text-center">
              <div className="text-[10px] mb-1" style={{ color: "#33ff3360" }}>
                LIVE PREVIEW
              </div>
              <div className="text-xs" style={{ color: "#33ff3380" }}>
                {CHANNELS[hoveredChannel ?? activeChannel].name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div
        className="flex items-center justify-center gap-6 px-4 py-2"
        style={{ borderTop: "1px solid #33ff3320" }}
      >
        {[
          { label: "UP", key: "▲" },
          { label: "DOWN", key: "▼" },
          { label: "CH±", key: "" },
          { label: "SELECT", key: "↵" },
        ].map((ctrl, i) => (
          <span key={i} className="text-[10px] tracking-wider" style={{ color: "#33ff3350" }}>
            {ctrl.label} {ctrl.key}
          </span>
        ))}
      </div>

      {/* VHS static bottom */}
      <div
        className="h-4 w-full opacity-30"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.08) 1px, rgba(255,255,255,0.08) 2px)",
          animation: "vhsStatic 0.25s steps(4) infinite reverse",
        }}
      />
    </div>
  );
}
