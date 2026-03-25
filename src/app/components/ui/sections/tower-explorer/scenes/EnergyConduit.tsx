"use client";

interface Props {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  animated?: boolean;
  thickness?: number;
}

/**
 * Animated energy conduit line connecting objects.
 * Flowing particle effect along the path.
 */
export default function EnergyConduit({
  x1,
  y1,
  x2,
  y2,
  color = "#00e5ff",
  animated = true,
  thickness = 2,
}: Props) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
    >
      <defs>
        <linearGradient
          id={`conduit-${x1}-${y1}-${x2}-${y2}`}
          x1={`${x1}%`}
          y1={`${y1}%`}
          x2={`${x2}%`}
          y2={`${y2}%`}
        >
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="20%" stopColor={color} stopOpacity="0.6" />
          <stop offset="80%" stopColor={color} stopOpacity="0.6" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Base line */}
      <line
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        stroke={`${color}30`}
        strokeWidth={thickness}
      />

      {/* Glow line */}
      <line
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        stroke={`url(#conduit-${x1}-${y1}-${x2}-${y2})`}
        strokeWidth={thickness + 1}
        opacity="0.4"
      />

      {/* Flowing particle */}
      {animated && (
        <circle r="3" fill={color} opacity="0.8">
          <animate
            attributeName="cx"
            values={`${x1}%;${x2}%;${x1}%`}
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values={`${y1}%;${y2}%;${y1}%`}
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0.8;0"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
}
