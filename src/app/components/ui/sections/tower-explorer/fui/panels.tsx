"use client";

/**
 * Collection of data panel content components for the FUI dashboard.
 * Each renders inside a FuiPanel.
 */

// ─── Donut / Arc Gauge ───
export function DonutChart({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 36;
  const filled = (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <svg viewBox="0 0 80 80" className="w-full max-w-[64px]">
        <circle cx="40" cy="40" r="36" fill="none" stroke={`${color}15`} strokeWidth="5" />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          opacity="0.7"
        >
          <animate attributeName="stroke-dasharray" from={`0 ${circumference}`} to={`${filled} ${circumference}`} dur="1.5s" fill="freeze" />
        </circle>
        <text x="40" y="38" textAnchor="middle" fill={color} fontSize="14" fontFamily="monospace" fontWeight="bold">
          {value}%
        </text>
        <text x="40" y="52" textAnchor="middle" fill={`${color}80`} fontSize="6" fontFamily="monospace">
          {label}
        </text>
      </svg>
    </div>
  );
}

// ─── Bar Chart ───
export function BarChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[2px] h-full px-1 pt-1">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all duration-500"
          style={{
            height: `${(v / max) * 100}%`,
            background: `linear-gradient(to top, ${color}70, ${color}20)`,
            animationDelay: `${i * 60}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Line Chart ───
export function LineChart({ data, color, label }: { data: number[]; color: string; label?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 80 - 10;
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="flex flex-col h-full">
      {label && (
        <div className="text-[8px] font-mono mb-1" style={{ color: `${color}80` }}>
          {label}
        </div>
      )}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="flex-1 w-full">
        <polyline points={areaPoints} fill={`${color}08`} stroke="none" />
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
        {/* Latest point dot */}
        {data.length > 0 && (
          <circle
            cx="100"
            cy={100 - ((data[data.length - 1] - min) / range) * 80 - 10}
            r="2"
            fill={color}
          >
            <animate attributeName="r" values="2;3.5;2" dur="1.5s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </div>
  );
}

// ─── Network Graph ───
export function NetworkGraph({ color }: { color: string }) {
  const nodes = [
    { x: 50, y: 30 }, { x: 25, y: 15 }, { x: 75, y: 15 },
    { x: 15, y: 45 }, { x: 85, y: 45 }, { x: 25, y: 70 },
    { x: 75, y: 70 }, { x: 50, y: 85 }, { x: 40, y: 50 },
    { x: 60, y: 50 },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 8], [0, 9], [1, 3], [2, 4],
    [3, 5], [4, 6], [5, 7], [6, 7], [8, 9], [8, 5], [9, 6],
  ];

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x} y1={nodes[a].y}
          x2={nodes[b].x} y2={nodes[b].y}
          stroke={color} strokeWidth="0.5" opacity="0.3"
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={i === 0 ? 4 : 2} fill={color} opacity={i === 0 ? 0.6 : 0.4}>
            {i === 0 && <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />}
          </circle>
        </g>
      ))}
    </svg>
  );
}

// ─── Data Rows (key-value list) ───
export function DataRows({ rows, color }: { rows: { key: string; value: string }[]; color: string }) {
  return (
    <div className="space-y-1 h-full flex flex-col justify-center">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-between items-center text-[8px] font-mono">
          <span style={{ color: `${color}70` }}>{row.key}</span>
          <span style={{ color }}>{row.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Progress Bars ───
export function ProgressBars({
  items,
  color,
}: {
  items: { label: string; value: number }[];
  color: string;
}) {
  return (
    <div className="space-y-1.5 h-full flex flex-col justify-center">
      {items.map((item, i) => (
        <div key={i}>
          <div className="flex justify-between text-[7px] font-mono mb-0.5">
            <span style={{ color: `${color}80` }}>{item.label}</span>
            <span style={{ color }}>{item.value}%</span>
          </div>
          <div className="w-full h-1 rounded-full" style={{ background: `${color}15` }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${item.value}%`,
                background: `linear-gradient(90deg, ${color}80, ${color})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Status Grid (mini metrics) ───
export function StatusGrid({
  items,
  color,
}: {
  items: { label: string; value: string }[];
  color: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-1 h-full content-center">
      {items.map((item, i) => (
        <div
          key={i}
          className="text-center py-1 rounded-sm"
          style={{ background: `${color}08`, border: `1px solid ${color}12` }}
        >
          <div className="text-[7px] font-mono" style={{ color: `${color}60` }}>
            {item.label}
          </div>
          <div className="text-[10px] font-mono font-bold" style={{ color }}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Waveform / Audio-style bars ───
export function Waveform({ color, bars = 20 }: { color: string; bars?: number }) {
  return (
    <div className="flex items-center gap-[1px] h-full px-1">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 30;
        return (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              background: `${color}${Math.round(40 + Math.random() * 40).toString(16)}`,
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Radar/Spider Chart ───
export function RadarChart({ values, color }: { values: number[]; color: string }) {
  const n = values.length;
  const cx = 50, cy = 50, r = 38;

  const polyPoints = values
    .map((v, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const d = (v / 100) * r;
      return `${cx + Math.cos(angle) * d},${cy + Math.sin(angle) * d}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Grid rings */}
      {[0.33, 0.66, 1].map((s, i) => (
        <polygon
          key={i}
          points={Array.from({ length: n })
            .map((_, j) => {
              const angle = (j / n) * Math.PI * 2 - Math.PI / 2;
              return `${cx + Math.cos(angle) * r * s},${cy + Math.sin(angle) * r * s}`;
            })
            .join(" ")}
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          opacity="0.2"
        />
      ))}
      {/* Axes */}
      {Array.from({ length: n }).map((_, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={cx + Math.cos(angle) * r}
            y2={cy + Math.sin(angle) * r}
            stroke={color} strokeWidth="0.3" opacity="0.2"
          />
        );
      })}
      {/* Data polygon */}
      <polygon points={polyPoints} fill={`${color}15`} stroke={color} strokeWidth="1" opacity="0.7" />
      {/* Data points */}
      {values.map((v, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const d = (v / 100) * r;
        return (
          <circle key={i} cx={cx + Math.cos(angle) * d} cy={cy + Math.sin(angle) * d} r="2" fill={color} opacity="0.8" />
        );
      })}
    </svg>
  );
}
