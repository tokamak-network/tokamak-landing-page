"use client";

import { useState } from "react";

interface Props {
  x: number;
  y: number;
  size: number;
  color?: string;
  ringColor?: string;
  label?: string;
}

/**
 * Interactive torus reactor drawn with SVG.
 * Pulsing rings, energy core, hover interaction.
 */
export default function TorusReactor({
  x,
  y,
  size,
  color = "#00e5ff",
  ringColor = "#ff6d00",
  label = "Plasma Core",
}: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="absolute cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}%`,
        height: `${size * 0.6}%`,
        transform: `translate(-50%, -50%)`,
        zIndex: hovered ? 30 : 15,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        viewBox="0 0 400 240"
        className="w-full h-full"
        style={{
          filter: hovered ? `drop-shadow(0 0 20px ${color}60)` : `drop-shadow(0 0 10px ${color}20)`,
          transition: "filter 0.4s ease",
        }}
      >
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6">
              <animate attributeName="stopOpacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>

          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ringColor} stopOpacity="0.8" />
            <stop offset="50%" stopColor={ringColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={ringColor} stopOpacity="0.8" />
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer housing ellipse */}
        <ellipse
          cx="200"
          cy="120"
          rx="180"
          ry="90"
          fill="none"
          stroke={color}
          strokeWidth={hovered ? "2" : "1"}
          opacity={hovered ? 0.5 : 0.25}
          style={{ transition: "all 0.4s ease" }}
        />

        {/* Inner housing */}
        <ellipse
          cx="200"
          cy="120"
          rx="130"
          ry="65"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Energy core */}
        <ellipse cx="200" cy="120" rx="60" ry="30" fill="url(#coreGlow)" />

        {/* Rotating ring 1 */}
        <ellipse
          cx="200"
          cy="120"
          rx="90"
          ry="45"
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={hovered ? "3" : "2"}
          strokeDasharray="20 10"
          style={{ transition: "stroke-width 0.3s" }}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 200 120"
            to="360 200 120"
            dur="8s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Rotating ring 2 (opposite direction) */}
        <ellipse
          cx="200"
          cy="120"
          rx="110"
          ry="55"
          fill="none"
          stroke={ringColor}
          strokeWidth="1.5"
          strokeDasharray="15 20"
          opacity="0.4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 200 120"
            to="0 200 120"
            dur="12s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Energy sparks */}
        {hovered &&
          Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const rx = 90;
            const ry = 45;
            const cx = 200 + Math.cos(angle) * rx;
            const cy = 120 + Math.sin(angle) * ry;
            return (
              <circle key={i} cx={cx} cy={cy} r="3" fill={color} opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur={`${1 + i * 0.2}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="2;4;2" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            );
          })}

        {/* Connector lines (energy conduits going outward) */}
        {[0, 90, 180, 270].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 200 + Math.cos(rad) * 130;
          const y1 = 120 + Math.sin(rad) * 65;
          const x2 = 200 + Math.cos(rad) * 175;
          const y2 = 120 + Math.sin(rad) * 88;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={color}
              strokeWidth="1.5"
              opacity={hovered ? 0.6 : 0.2}
              style={{ transition: "opacity 0.4s ease" }}
            />
          );
        })}
      </svg>

      {/* Label on hover */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-6 whitespace-nowrap text-center transition-all duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          transform: `translateX(-50%) translateY(${hovered ? 0 : 10}px)`,
        }}
      >
        <span className="text-xs font-mono tracking-wider uppercase px-3 py-1 rounded-full"
          style={{
            color,
            background: `${color}10`,
            border: `1px solid ${color}30`,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
