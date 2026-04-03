"use client";

/**
 * Isometric grid base that provides the "floor" feeling.
 * Draws a perspective grid with glowing accent lines.
 */
export default function IsometricBase({ accent = "#00e5ff" }: { accent?: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.15 }}
    >
      <defs>
        <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0" />
          <stop offset="40%" stopColor={accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Horizontal lines (perspective converging toward center) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const y = 400 + i * 50;
        return (
          <line
            key={`h-${i}`}
            x1={100}
            y1={y}
            x2={1820}
            y2={y}
            stroke="url(#gridFade)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Vertical lines */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = 160 + i * 85;
        return (
          <line
            key={`v-${i}`}
            x1={x}
            y1={400}
            x2={x}
            y2={1000}
            stroke="url(#gridFade)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Structural frame pillars */}
      {[200, 960, 1720].map((x, i) => (
        <g key={`pillar-${i}`}>
          <rect
            x={x - 4}
            y={200}
            width={8}
            height={700}
            fill="none"
            stroke={accent}
            strokeWidth="1"
            opacity="0.3"
          />
          {/* Pillar glow */}
          <line
            x1={x}
            y1={200}
            x2={x}
            y2={900}
            stroke={accent}
            strokeWidth="2"
            opacity="0.1"
          />
        </g>
      ))}

      {/* Top beam */}
      <line x1={200} y1={280} x2={1720} y2={280} stroke={accent} strokeWidth="1" opacity="0.2" />
      {/* Bottom beam */}
      <line x1={200} y1={860} x2={1720} y2={860} stroke={accent} strokeWidth="1" opacity="0.2" />

      {/* Corner brackets */}
      {[
        [180, 260],
        [1740, 260],
        [180, 880],
        [1740, 880],
      ].map(([x, y], i) => (
        <g key={`corner-${i}`}>
          <path
            d={
              i < 2
                ? `M${x - 20},${y + 20} L${x},${y} L${x + 20},${y + 20}`
                : `M${x - 20},${y - 20} L${x},${y} L${x + 20},${y - 20}`
            }
            fill="none"
            stroke={accent}
            strokeWidth="1.5"
            opacity="0.4"
          />
        </g>
      ))}
    </svg>
  );
}
