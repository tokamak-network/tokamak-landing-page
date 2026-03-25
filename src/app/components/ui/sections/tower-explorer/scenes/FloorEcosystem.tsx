"use client";

import IsometricBase from "./IsometricBase";
import HoloScreen from "./HoloScreen";
import EnergyConduit from "./EnergyConduit";

const SCREENS = [
  { x: 3, y: 28, w: 14, h: 45, title: "Staking", color: "#00e5ff", delay: 200 },
  { x: 19, y: 24, w: 14, h: 50, title: "Token Swap UI", color: "#00e5ff", delay: 400 },
  { x: 35, y: 20, w: 14, h: 55, title: "Bridge Transfer", color: "#b388ff", delay: 600 },
  { x: 51, y: 22, w: 14, h: 52, title: "Governance", color: "#b388ff", delay: 800 },
  { x: 67, y: 26, w: 14, h: 48, title: "Rollup Deploy", color: "#00e5ff", delay: 1000 },
  { x: 83, y: 30, w: 14, h: 42, title: "Analytics", color: "#eeff41", delay: 1200 },
];

/**
 * Ecosystem monitoring floor with 6 holographic screens.
 * Matches the floor-ecosystem-1.png concept.
 */
export default function FloorEcosystem() {
  return (
    <div className="absolute inset-0">
      <IsometricBase accent="#00e5ff" />

      {/* Energy conduits connecting screens */}
      <EnergyConduit x1={16} y1={50} x2={26} y2={48} color="#00e5ff" />
      <EnergyConduit x1={32} y1={48} x2={42} y2={46} color="#b388ff" />
      <EnergyConduit x1={48} y1={46} x2={58} y2={48} color="#b388ff" />
      <EnergyConduit x1={64} y1={48} x2={74} y2={50} color="#00e5ff" />
      <EnergyConduit x1={80} y1={50} x2={90} y2={52} color="#eeff41" />

      {/* Central data bus (horizontal) */}
      <EnergyConduit x1={5} y1={75} x2={95} y2={75} color="#00e5ff" thickness={1} />

      {/* Vertical conduits from screens to data bus */}
      {SCREENS.map((s, i) => (
        <EnergyConduit
          key={`vc-${i}`}
          x1={s.x + s.w / 2}
          y1={s.y + s.h}
          x2={s.x + s.w / 2}
          y2={75}
          color={s.color}
          thickness={1}
        />
      ))}

      {/* Holographic screens */}
      {SCREENS.map((s, i) => (
        <HoloScreen
          key={i}
          x={s.x}
          y={s.y}
          width={s.w}
          height={s.h}
          title={s.title}
          color={s.color}
          delay={s.delay}
        >
          <ScreenContent type={s.title} color={s.color} />
        </HoloScreen>
      ))}

      {/* Floor status indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-6 z-10">
        {["ONLINE", "6 PANELS ACTIVE", "SYNC OK"].map((text, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]"
              style={{
                boxShadow: "0 0 4px #00e5ff",
                animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
              }}
            />
            <span className="text-[10px] font-mono tracking-wider text-[#00e5ff]/60 uppercase">
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenContent({ type, color }: { type: string; color: string }) {
  if (type === "Staking") {
    return (
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-1">
          <div className="text-[9px] font-mono" style={{ color: `${color}99` }}>
            TOTAL STAKED
          </div>
          <div className="text-sm font-mono font-bold" style={{ color }}>
            42,391,582
          </div>
          <div className="text-[8px] font-mono" style={{ color: `${color}60` }}>
            TON
          </div>
        </div>
        {/* Mini line chart */}
        <svg viewBox="0 0 100 30" className="w-full h-8">
          <polyline
            points="0,25 10,22 20,18 30,20 40,15 50,12 60,14 70,8 80,10 90,5 100,7"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.7"
          />
          <polyline
            points="0,25 10,22 20,18 30,20 40,15 50,12 60,14 70,8 80,10 90,5 100,7"
            fill={`${color}15`}
            stroke="none"
          />
        </svg>
      </div>
    );
  }

  if (type === "Governance") {
    return (
      <div className="flex flex-col h-full justify-between">
        <div className="text-[9px] font-mono" style={{ color: `${color}99` }}>
          ACTIVE PROPOSALS
        </div>
        {/* Voting bars */}
        <div className="space-y-2">
          {[
            { label: "TIP-42", pct: 78 },
            { label: "TIP-43", pct: 45 },
            { label: "TIP-44", pct: 92 },
          ].map((v, i) => (
            <div key={i} className="space-y-0.5">
              <div className="flex justify-between text-[8px] font-mono" style={{ color: `${color}80` }}>
                <span>{v.label}</span>
                <span>{v.pct}%</span>
              </div>
              <div className="w-full h-1 rounded-full" style={{ background: `${color}15` }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${v.pct}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}60)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "Analytics") {
    return (
      <div className="flex flex-col h-full justify-between">
        <div className="text-[9px] font-mono" style={{ color: `${color}99` }}>
          NETWORK METRICS
        </div>
        <div className="grid grid-cols-2 gap-1">
          {[
            { label: "TPS", val: "847" },
            { label: "GAS", val: "0.01" },
            { label: "NODES", val: "124" },
            { label: "UPTIME", val: "99.9%" },
          ].map((m, i) => (
            <div
              key={i}
              className="text-center py-1 rounded-sm"
              style={{ background: `${color}10`, border: `1px solid ${color}15` }}
            >
              <div className="text-[8px] font-mono" style={{ color: `${color}60` }}>
                {m.label}
              </div>
              <div className="text-[10px] font-mono font-bold" style={{ color }}>
                {m.val}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: chart bars
  return null;
}
