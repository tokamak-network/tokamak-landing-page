"use client";

import IsometricBase from "./IsometricBase";
import HoloScreen from "./HoloScreen";
import EnergyConduit from "./EnergyConduit";

/**
 * Command center floor with glass dome and 3 main screens.
 * Matches tower-mid.png concept.
 */
export default function FloorCommand() {
  return (
    <div className="absolute inset-0">
      <IsometricBase accent="#00bcd4" />

      {/* Glass dome structure (drawn with SVG arcs) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 3, opacity: 0.4 }}
      >
        <defs>
          <linearGradient id="domeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00bcd4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00bcd4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dome arch */}
        <path
          d="M 25%,65% Q 50%,8% 75%,65%"
          fill="url(#domeGrad)"
          stroke="#00bcd4"
          strokeWidth="1.5"
        />
        {/* Inner arch */}
        <path
          d="M 30%,65% Q 50%,15% 70%,65%"
          fill="none"
          stroke="#00bcd4"
          strokeWidth="0.5"
          opacity="0.5"
        />
        {/* Horizontal ribs */}
        {[30, 40, 50].map((y, i) => (
          <line
            key={i}
            x1={`${32 + i * 2}%`}
            y1={`${y}%`}
            x2={`${68 - i * 2}%`}
            y2={`${y}%`}
            stroke="#00bcd4"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
        {/* Vertical ribs */}
        {[40, 50, 60].map((x, i) => (
          <line
            key={i}
            x1={`${x}%`}
            y1="18%"
            x2={`${x}%`}
            y2="65%"
            stroke="#00bcd4"
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}
      </svg>

      {/* Main command screens (curved arrangement) */}
      <HoloScreen x={22} y={28} width={16} height={40} title="Chain Status" color="#00bcd4" delay={300}>
        <ChainStatus />
      </HoloScreen>

      <HoloScreen x={42} y={22} width={16} height={48} title="Block Explorer" color="#00e5ff" delay={500}>
        <BlockExplorer />
      </HoloScreen>

      <HoloScreen x={62} y={28} width={16} height={40} title="Network Map" color="#00bcd4" delay={700}>
        <NetworkMap />
      </HoloScreen>

      {/* Side panels */}
      <HoloScreen x={3} y={35} width={10} height={25} title="Alerts" color="#ff5252" delay={900}>
        <AlertPanel />
      </HoloScreen>

      <HoloScreen x={87} y={35} width={10} height={25} title="Comms" color="#69f0ae" delay={1100}>
        <CommsPanel />
      </HoloScreen>

      {/* Conduits from side panels to center */}
      <EnergyConduit x1={13} y1={48} x2={22} y2={48} color="#ff5252" />
      <EnergyConduit x1={87} y1={48} x2={78} y2={48} color="#69f0ae" />

      {/* Floor LED strips */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {/* Horizontal LED line at base */}
        <line x1="15%" y1="80%" x2="85%" y2="80%" stroke="#00bcd4" strokeWidth="2" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.15;0.3" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="20%" y1="85%" x2="80%" y2="85%" stroke="#00bcd4" strokeWidth="1" opacity="0.15" />

        {/* Satellite dishes on top */}
        {[25, 42, 58, 75].map((x, i) => (
          <g key={i}>
            <line x1={`${x}%`} y1="5%" x2={`${x}%`} y2="14%" stroke="#00bcd4" strokeWidth="1" opacity="0.3" />
            <path
              d={`M ${x - 2}%,6% Q ${x}%,3% ${x + 2}%,6%`}
              fill="none"
              stroke="#00bcd4"
              strokeWidth="1"
              opacity="0.4"
            />
            <circle cx={`${x}%`} cy="5%" r="1.5" fill="#00bcd4" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.1;0.3" dur={`${3 + i}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ChainStatus() {
  const color = "#00bcd4";
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="text-[9px] font-mono" style={{ color: `${color}99` }}>
        THANOS L2 STATUS
      </div>
      <div className="space-y-1.5">
        {[
          { k: "Block", v: "#4,291,847" },
          { k: "Epoch", v: "1,247" },
          { k: "Finality", v: "2 min" },
          { k: "Sequencer", v: "ACTIVE" },
        ].map((r, i) => (
          <div key={i} className="flex justify-between text-[8px] font-mono" style={{ color: `${color}80` }}>
            <span>{r.k}</span>
            <span style={{ color }}>{r.v}</span>
          </div>
        ))}
      </div>
      <div className="h-0.5 w-full rounded-full" style={{ background: `${color}20` }}>
        <div className="h-full rounded-full" style={{ width: "100%", background: color, animation: "pulse 2s infinite" }} />
      </div>
    </div>
  );
}

function BlockExplorer() {
  const color = "#00e5ff";
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="text-[9px] font-mono" style={{ color: `${color}99` }}>
        RECENT BLOCKS
      </div>
      <div className="space-y-1 flex-1 mt-1 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-1 py-0.5 rounded-sm px-1"
            style={{
              background: i === 0 ? `${color}15` : "transparent",
              border: `1px solid ${i === 0 ? `${color}30` : "transparent"}`,
            }}
          >
            <div className="w-1 h-1 rounded-full" style={{ background: color, opacity: 1 - i * 0.15 }} />
            <span className="text-[7px] font-mono" style={{ color: `${color}${i === 0 ? "cc" : "60"}` }}>
              #{4291847 - i}
            </span>
            <span className="text-[7px] font-mono ml-auto" style={{ color: `${color}40` }}>
              {i * 2}s ago
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworkMap() {
  const color = "#00bcd4";
  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="text-[9px] font-mono mb-2" style={{ color: `${color}99` }}>
        NODE TOPOLOGY
      </div>
      <svg viewBox="0 0 100 80" className="w-full h-16">
        {/* Central node */}
        <circle cx="50" cy="40" r="5" fill={color} opacity="0.4">
          <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
        </circle>
        {/* Surrounding nodes */}
        {[
          [20, 20], [80, 20], [20, 60], [80, 60],
          [50, 10], [50, 70], [10, 40], [90, 40],
        ].map(([cx, cy], i) => (
          <g key={i}>
            <line x1="50" y1="40" x2={cx} y2={cy} stroke={color} strokeWidth="0.5" opacity="0.3" />
            <circle cx={cx} cy={cy} r="2" fill={color} opacity="0.5" />
          </g>
        ))}
      </svg>
      <div className="text-[10px] font-mono font-bold mt-1" style={{ color }}>
        124 Nodes
      </div>
    </div>
  );
}

function AlertPanel() {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="text-[8px] font-mono" style={{ color: "#ff525299" }}>ALERTS</div>
      <div className="text-[10px] font-mono font-bold" style={{ color: "#69f0ae" }}>
        ALL CLEAR
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-[#69f0ae] mx-auto" style={{ boxShadow: "0 0 4px #69f0ae" }} />
    </div>
  );
}

function CommsPanel() {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="text-[8px] font-mono" style={{ color: "#69f0ae99" }}>COMMS</div>
      <div className="space-y-0.5">
        {[1, 0.6, 0.3, 0.8, 0.5].map((h, i) => (
          <div key={i} className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <div
                key={j}
                className="flex-1 h-1 rounded-full"
                style={{
                  background: `#69f0ae${Math.random() > 0.5 ? "60" : "20"}`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
