"use client";

import { useState } from "react";
import IsometricBase from "./IsometricBase";
import TorusReactor from "./TorusReactor";
import HoloScreen from "./HoloScreen";
import EnergyConduit from "./EnergyConduit";

/**
 * Top floor: Fusion Core command deck.
 * Central torus reactor dome + 5 monitor screens + light beams + antennas.
 */
export default function FloorReactorTop() {
  const [coreActive, setCoreActive] = useState(true);

  return (
    <div className="absolute inset-0">
      <IsometricBase accent="#00e5ff" />

      {/* Central torus reactor */}
      <TorusReactor
        x={50}
        y={40}
        size={40}
        color="#00e5ff"
        ringColor="#00bcd4"
        label="Fusion Core — 42M TON"
      />

      {/* Light beams from reactor */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
        <defs>
          <linearGradient id="beam1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3">
              <animate attributeName="stopOpacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Downward light beams from reactor */}
        <polygon points="42%,52% 35%,95% 45%,95%" fill="url(#beam1)" />
        <polygon points="58%,52% 55%,95% 65%,95%" fill="url(#beam1)" />
        <polygon points="50%,55% 47%,95% 53%,95%" fill="url(#beam1)" opacity="0.5" />
      </svg>

      {/* Energy conduits from reactor to screens */}
      <EnergyConduit x1={35} y1={40} x2={12} y2={30} color="#00e5ff" />
      <EnergyConduit x1={65} y1={40} x2={82} y2={30} color="#00e5ff" />
      <EnergyConduit x1={35} y1={50} x2={12} y2={65} color="#00e5ff" />
      <EnergyConduit x1={65} y1={50} x2={82} y2={65} color="#00e5ff" />

      {/* Monitor screens around reactor */}
      <HoloScreen x={2} y={15} width={12} height={30} title="Plasma Temp" color="#00e5ff" delay={300}>
        <MetricDisplay label="CORE TEMP" value="15.2M" unit="°K" color="#00e5ff" />
      </HoloScreen>

      <HoloScreen x={86} y={15} width={12} height={30} title="Mag Field" color="#00e5ff" delay={500}>
        <MetricDisplay label="FIELD STRENGTH" value="5.7" unit="Tesla" color="#00e5ff" />
      </HoloScreen>

      <HoloScreen x={2} y={55} width={12} height={30} title="Output" color="#00bcd4" delay={700}>
        <MetricDisplay label="POWER OUT" value="840" unit="MW" color="#00bcd4" />
      </HoloScreen>

      <HoloScreen x={86} y={55} width={12} height={30} title="Staking" color="#00bcd4" delay={900}>
        <MetricDisplay label="STAKED" value="42M+" unit="TON" color="#00bcd4" />
      </HoloScreen>

      {/* Antenna array at top */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 1, opacity: 0.3 }}>
        {/* Antennas */}
        {[30, 40, 50, 60, 70].map((x, i) => (
          <g key={i}>
            <line x1={`${x}%`} y1="5%" x2={`${x}%`} y2="18%" stroke="#00e5ff" strokeWidth="1" />
            <circle cx={`${x}%`} cy="5%" r="2" fill="#00e5ff" opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.6;0.2;0.6"
                dur={`${2 + i * 0.4}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
        {/* Cross beam */}
        <line x1="28%" y1="12%" x2="72%" y2="12%" stroke="#00e5ff" strokeWidth="0.5" />
      </svg>

      {/* Engine nozzles (bottom corners) */}
      <EngineNozzle x={8} y={80} />
      <EngineNozzle x={88} y={80} />
    </div>
  );
}

function MetricDisplay({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) {
  return (
    <div className="flex flex-col h-full justify-center items-center text-center">
      <div className="text-[8px] font-mono tracking-wider" style={{ color: `${color}80` }}>
        {label}
      </div>
      <div className="text-lg font-mono font-bold mt-1" style={{ color }}>
        {value}
      </div>
      <div className="text-[8px] font-mono" style={{ color: `${color}60` }}>
        {unit}
      </div>
    </div>
  );
}

function EngineNozzle({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="30" fill="none" stroke="#00e5ff" strokeWidth="2" opacity="0.3" />
        <circle cx="40" cy="40" r="20" fill="none" stroke="#00e5ff" strokeWidth="1.5" opacity="0.4">
          <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="40" r="8" fill="#00e5ff" opacity="0.15">
          <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
