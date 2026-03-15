"use client";

import { useMemo, useId } from "react";

interface MiniSparklineProps {
  data?: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Phase offset to differentiate multiple sparklines (0-1) */
  phase?: number;
}

/**
 * Generate asymmetric wave data that visually appears to trend upward.
 * Uses longer rise phases and shorter dip phases so the visible window
 * mostly shows "going up" at any given moment.
 */
function generateWaveData(
  count: number,
  phase: number
): number[] {
  const data: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const offset = phase * Math.PI * 2;

    // Primary wave — slow rise, quick dip (asymmetric)
    const raw = Math.sin(t * 3 + offset);
    const asymmetric = raw >= 0 ? raw : raw * 0.25;

    // Secondary wobble for natural feel
    const wobble = Math.sin(t * 7.3 + offset * 1.5) * 0.12;

    // Tertiary micro-variation
    const micro = Math.sin(t * 13.1 + offset * 2.7) * 0.06;

    data.push(0.45 + asymmetric * 0.35 + wobble + micro);
  }
  return data;
}

export default function MiniSparkline({
  width = 100,
  height = 24,
  color = "#22c55e",
  phase = 0,
}: MiniSparklineProps) {
  const gradId = useId();
  const segmentPoints = 80;

  // Generate one cycle of seamless wave data (identical start & end)
  const waveData = useMemo(
    () => generateWaveData(segmentPoints, phase),
    [phase]
  );

  // Double the data for seamless infinite scroll
  const allData = useMemo(() => [...waveData, ...waveData], [waveData]);

  // Total SVG width = 2x visible width (scroll first half, then reset)
  const totalWidth = width * 2;
  const stepX = totalWidth / (allData.length - 1);

  // Build SVG path
  const linePoints = allData
    .map((v, i) => {
      const x = i * stepX;
      const y = height - v * height * 0.85; // leave small top/bottom margin
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const fillPath = `M 0,${height} L ${linePoints
    .split(" ")
    .map((p, i) => {
      const [x, y] = p.split(",");
      return `${i === 0 ? "" : "L "}${x},${y}`;
    })
    .join(" ")} L ${totalWidth},${height} Z`;

  return (
    <div
      style={{ width, height, overflow: "hidden" }}
      className="relative"
    >
      <svg
        width={totalWidth}
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
        style={{
          animation: `sparkline-scroll 6s linear infinite`,
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Fill area */}
        <path d={fillPath} fill={`url(#${gradId})`} />

        {/* Line */}
        <polyline
          points={linePoints}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
