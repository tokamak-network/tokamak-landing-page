"use client";

interface FloorIndicatorProps {
  floor: number;
  label?: string;
}

/**
 * Full-screen cyberpunk floor transition indicator.
 * Minimal HUD: horizontal cyan line + "FLOOR XX" text + down chevron.
 */
export default function FloorIndicator({ floor, label }: FloorIndicatorProps) {
  const floorNum = String(floor).padStart(2, "0");

  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden bg-black"
      style={{ height: "40vh" }}
    >
      {/* Thin vertical guide lines on edges */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: "12%",
          width: 1,
          background:
            "linear-gradient(180deg, transparent 5%, rgba(42, 114, 229, 0.12) 30%, rgba(42, 114, 229, 0.12) 70%, transparent 95%)",
        }}
      />
      <div
        className="absolute top-0 bottom-0"
        style={{
          right: "12%",
          width: 1,
          background:
            "linear-gradient(180deg, transparent 5%, rgba(42, 114, 229, 0.12) 30%, rgba(42, 114, 229, 0.12) 70%, transparent 95%)",
        }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-4">
        {/* Floor label */}
        <span
          className="uppercase tracking-[0.35em] font-bold"
          style={{
            fontSize: "clamp(12px, 1.5vw, 22px)",
            color: "#00e5ff",
            fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
            textShadow:
              "0 0 15px rgba(0, 229, 255, 0.6), 0 0 40px rgba(0, 229, 255, 0.2)",
          }}
        >
          Floor {floorNum}
        </span>

        {/* Sub-label */}
        {label && (
          <span
            className="uppercase tracking-[0.2em]"
            style={{
              fontSize: "clamp(9px, 0.9vw, 13px)",
              color: "rgba(140, 200, 255, 0.5)",
              fontFamily: "'Share Tech Mono', monospace",
              marginTop: -4,
            }}
          >
            {label}
          </span>
        )}

        {/* Horizontal cyan line */}
        <div
          style={{
            width: "clamp(200px, 40vw, 500px)",
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6) 20%, #00e5ff 50%, rgba(0, 229, 255, 0.6) 80%, transparent)",
            boxShadow:
              "0 0 8px rgba(0, 229, 255, 0.4), 0 0 20px rgba(0, 229, 255, 0.15)",
          }}
        />

        {/* Down chevron */}
        <svg
          width="20"
          height="12"
          viewBox="0 0 20 12"
          fill="none"
          style={{
            marginTop: 2,
            filter: "drop-shadow(0 0 6px rgba(0, 229, 255, 0.5))",
            animation: "chevronBounce 2s ease-in-out infinite",
          }}
        >
          <path
            d="M2 2 L10 10 L18 2"
            stroke="#00e5ff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Subtle radial glow at center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(0, 229, 255, 0.04) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
