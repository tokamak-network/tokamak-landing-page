"use client";

import IsometricBase from "./IsometricBase";
import TorusReactor from "./TorusReactor";
import HoloScreen from "./HoloScreen";
import EnergyConduit from "./EnergyConduit";

/**
 * Bottom reactor floor with central torus (orange rings) + 4 energy conduits.
 * Matches tower-bot.png concept.
 */
export default function FloorReactorBot() {
  return (
    <div className="absolute inset-0">
      <IsometricBase accent="#ff6d00" />

      {/* Central torus reactor with orange rings */}
      <TorusReactor
        x={50}
        y={45}
        size={45}
        color="#ff6d00"
        ringColor="#ffab40"
        label="Cross-Chain Bridge Core"
      />

      {/* 4 Energy conduits going to corners */}
      <EnergyConduit x1={35} y1={35} x2={10} y2={15} color="#ff6d00" thickness={3} />
      <EnergyConduit x1={65} y1={35} x2={90} y2={15} color="#ff6d00" thickness={3} />
      <EnergyConduit x1={35} y1={55} x2={10} y2={80} color="#ffab40" thickness={3} />
      <EnergyConduit x1={65} y1={55} x2={90} y2={80} color="#ffab40" thickness={3} />

      {/* Monitor screens on the walls */}
      <HoloScreen x={3} y={8} width={11} height={22} title="L1 → L2" color="#00e5ff" delay={300}>
        <BridgeDirection from="Ethereum" to="Thanos" color="#00e5ff" />
      </HoloScreen>
      <HoloScreen x={86} y={8} width={11} height={22} title="L2 → L1" color="#00e5ff" delay={500}>
        <BridgeDirection from="Thanos" to="Ethereum" color="#00e5ff" />
      </HoloScreen>
      <HoloScreen x={3} y={68} width={11} height={22} title="Liquidity" color="#ffab40" delay={700}>
        <LiquidityGauge color="#ffab40" />
      </HoloScreen>
      <HoloScreen x={86} y={68} width={11} height={22} title="Bridge Txs" color="#ffab40" delay={900}>
        <BridgeTxList color="#ffab40" />
      </HoloScreen>

      {/* Mechanical pipes (drawn with SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2, opacity: 0.25 }}>
        {/* Horizontal pipes */}
        <rect x="5%" y="48%" width="25%" height="4%" rx="2" fill="none" stroke="#ff6d00" strokeWidth="1.5" />
        <rect x="70%" y="48%" width="25%" height="4%" rx="2" fill="none" stroke="#ff6d00" strokeWidth="1.5" />

        {/* Vertical supports */}
        {[15, 25, 75, 85].map((x, i) => (
          <rect
            key={i}
            x={`${x - 0.5}%`}
            y="10%"
            width="1%"
            height="80%"
            fill="none"
            stroke="#ff6d00"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}

        {/* Control boxes */}
        {[
          [15, 30],
          [85, 30],
          [15, 65],
          [85, 65],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect
              x={`${x - 2}%`}
              y={`${y - 2}%`}
              width="4%"
              height="4%"
              fill={`#ff6d0010`}
              stroke="#ff6d00"
              strokeWidth="1"
              opacity="0.5"
            />
            {/* Status light */}
            <circle cx={`${x}%`} cy={`${y}%`} r="3" fill="#ff6d00" opacity="0.4">
              <animate attributeName="opacity" values="0.4;0.15;0.4" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}

function BridgeDirection({ from, to, color }: { from: string; to: string; color: string }) {
  return (
    <div className="flex flex-col h-full justify-between items-center text-center">
      <div className="text-[8px] font-mono" style={{ color: `${color}80` }}>{from}</div>
      <svg width="30" height="24" viewBox="0 0 30 24">
        <line x1="15" y1="2" x2="15" y2="18" stroke={color} strokeWidth="1.5" />
        <polygon points="10,14 15,22 20,14" fill={color} opacity="0.6" />
        {/* Animated dot flowing */}
        <circle r="2" fill={color}>
          <animate attributeName="cy" values="4;18;4" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="cx" values="15;15;15" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
      <div className="text-[8px] font-mono" style={{ color: `${color}80` }}>{to}</div>
    </div>
  );
}

function LiquidityGauge({ color }: { color: string }) {
  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="text-[8px] font-mono mb-1" style={{ color: `${color}80` }}>TVL</div>
      <div className="text-sm font-mono font-bold" style={{ color }}>$2.4M</div>
      <svg viewBox="0 0 60 60" className="w-10 h-10 mt-1">
        <circle cx="30" cy="30" r="22" fill="none" stroke={`${color}20`} strokeWidth="4" />
        <circle
          cx="30"
          cy="30"
          r="22"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${0.75 * 138} ${138}`}
          strokeLinecap="round"
          transform="rotate(-90, 30, 30)"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

function BridgeTxList({ color }: { color: string }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="text-[8px] font-mono" style={{ color: `${color}80` }}>RECENT</div>
      <div className="space-y-0.5">
        {["0x4a..2f", "0xb7..e1", "0x1c..8d"].map((tx, i) => (
          <div key={i} className="flex items-center gap-1 text-[7px] font-mono" style={{ color: `${color}60` }}>
            <div className="w-1 h-1 rounded-full" style={{ background: color }} />
            <span>{tx}</span>
            <span className="ml-auto">{(i + 1) * 0.8}m</span>
          </div>
        ))}
      </div>
    </div>
  );
}
