"use client";

import { useState } from "react";

/**
 * Final floor: Dramatic torus capsule with plasma energy.
 * Full SVG/CSS illustration inspired by torus-hero.png.
 */
export default function FloorFusion() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Starfield background */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <circle
            key={i}
            cx={`${Math.random() * 100}%`}
            cy={`${Math.random() * 100}%`}
            r={Math.random() * 1.5 + 0.3}
            fill="white"
            opacity={Math.random() * 0.5 + 0.1}
          >
            <animate
              attributeName="opacity"
              values={`${Math.random() * 0.3 + 0.1};${Math.random() * 0.5 + 0.3};${Math.random() * 0.3 + 0.1}`}
              dur={`${2 + Math.random() * 4}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* Downward light beams */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        <defs>
          <linearGradient id="fusionBeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.15">
              <animate attributeName="stopOpacity" values="0.15;0.05;0.15" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points="35%,60% 20%,100% 40%,100%" fill="url(#fusionBeam)" />
        <polygon points="50%,60% 42%,100% 58%,100%" fill="url(#fusionBeam)" opacity="0.8" />
        <polygon points="65%,60% 60%,100% 80%,100%" fill="url(#fusionBeam)" />
      </svg>

      {/* Central torus capsule */}
      <div
        className="relative cursor-pointer"
        style={{
          width: "60%",
          maxWidth: "700px",
          aspectRatio: "2.5/1",
          zIndex: 10,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg
          viewBox="0 0 700 280"
          className="w-full h-full"
          style={{
            filter: hovered
              ? "drop-shadow(0 0 40px rgba(0,229,255,0.4))"
              : "drop-shadow(0 0 20px rgba(0,229,255,0.15))",
            transition: "filter 0.5s ease",
          }}
        >
          <defs>
            {/* Capsule housing gradient */}
            <linearGradient id="capsuleHousing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a2a3a" />
              <stop offset="50%" stopColor="#0a1520" />
              <stop offset="100%" stopColor="#1a2a3a" />
            </linearGradient>

            {/* Plasma energy gradient */}
            <radialGradient id="plasmaCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e040fb" stopOpacity="0.7">
                <animate attributeName="stopColor" values="#e040fb;#00e5ff;#e040fb" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="40%" stopColor="#00e5ff" stopOpacity="0.5">
                <animate attributeName="stopColor" values="#00e5ff;#e040fb;#00e5ff" dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#0a1520" stopOpacity="0.8" />
            </radialGradient>

            {/* Energy swirl */}
            <filter id="turbulence">
              <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="1">
                <animate attributeName="seed" from="1" to="10" dur="5s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale={hovered ? "30" : "15"} />
            </filter>
          </defs>

          {/* Outer housing */}
          <rect
            x="40"
            y="30"
            width="620"
            height="220"
            rx="110"
            fill="url(#capsuleHousing)"
            stroke="#00e5ff"
            strokeWidth={hovered ? "2" : "1"}
            opacity="0.8"
          />

          {/* Inner frame */}
          <rect
            x="70"
            y="50"
            width="560"
            height="180"
            rx="90"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="0.5"
            opacity="0.3"
          />

          {/* Plasma viewport */}
          <rect
            x="100"
            y="60"
            width="500"
            height="160"
            rx="80"
            fill="url(#plasmaCore)"
            filter="url(#turbulence)"
          />

          {/* Viewport glass reflection */}
          <rect
            x="100"
            y="60"
            width="500"
            height="80"
            rx="80"
            fill="white"
            opacity="0.03"
          />

          {/* Housing segments/rivets */}
          {[150, 250, 350, 450, 550].map((x, i) => (
            <g key={i}>
              <line x1={x} y1="30" x2={x} y2="250" stroke="#00e5ff" strokeWidth="0.5" opacity="0.15" />
              <circle cx={x} cy="35" r="3" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.3" />
              <circle cx={x} cy="245" r="3" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.3" />
            </g>
          ))}

          {/* Side mechanical details */}
          {/* Left end */}
          <rect x="15" y="80" width="35" height="120" rx="5" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.3" />
          <rect x="20" y="90" width="25" height="100" rx="3" fill="#00e5ff" opacity="0.05" />
          {/* Right end */}
          <rect x="650" y="80" width="35" height="120" rx="5" fill="none" stroke="#00e5ff" strokeWidth="1" opacity="0.3" />
          <rect x="655" y="90" width="25" height="100" rx="3" fill="#00e5ff" opacity="0.05" />

          {/* Energy pulse ring */}
          <ellipse cx="350" cy="140" rx="200" ry="60" fill="none" stroke="#00e5ff" strokeWidth="2" opacity={hovered ? "0.5" : "0.2"}>
            <animate attributeName="rx" values="180;220;180" dur="3s" repeatCount="indefinite" />
            <animate attributeName="ry" values="55;65;55" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values={hovered ? "0.5;0.2;0.5" : "0.2;0.08;0.2"} dur="3s" repeatCount="indefinite" />
          </ellipse>
        </svg>

        {/* Hover label */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -bottom-10 text-center transition-all duration-400"
          style={{
            opacity: hovered ? 1 : 0,
            transform: `translateX(-50%) translateY(${hovered ? 0 : 10}px)`,
          }}
        >
          <span
            className="text-sm font-mono tracking-wider uppercase px-4 py-1.5 rounded-full"
            style={{
              color: "#00e5ff",
              background: "#00e5ff10",
              border: "1px solid #00e5ff30",
              textShadow: "0 0 10px #00e5ff40",
            }}
          >
            Tokamak Reactor — Fusion Complete
          </span>
        </div>
      </div>
    </div>
  );
}
