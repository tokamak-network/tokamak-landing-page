"use client";

/**
 * 3D cylindrical light curtain wall that drapes down from the torus ring,
 * extending past the hero into the sections below — acting as illumination.
 * Rotates in sync with the Three.js torus (0.15 rad/s).
 */

const BEAM_COUNT = 120;
const ROTATION_PERIOD = ((2 * Math.PI) / 0.15).toFixed(2); // ~41.89s

// Pre-compute beam data deterministically (no Math.random for SSR safety)
const beams = Array.from({ length: BEAM_COUNT }, (_, i) => {
  const angle = (i / BEAM_COUNT) * 360;
  const opacity = 0.18 + Math.sin(i * 1.7) * 0.08;
  const width = 2.5 + Math.sin(i * 2.3) * 1.2;
  return { angle, opacity, width };
});

// Wider glow beams every 4th beam
const glowBeams = beams.filter((_, i) => i % 4 === 0);

export default function VolumetricLight() {
  return (
    <div
      className="absolute inset-x-0 top-0 pointer-events-none"
      style={{ height: "280vh", zIndex: 10 }}
    >
      {/* Wide ambient downward glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: "0",
          width: "100vw",
          height: "100%",
          background:
            "radial-gradient(ellipse at 50% 8%, rgba(42, 114, 229, 0.12) 0%, rgba(42, 114, 229, 0.04) 25%, transparent 50%)",
        }}
      />

      {/* 3D perspective container — positioned at torus center */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "12%",
          width: 0,
          height: 0,
          perspective: "900px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Rotating cylinder — synced with Three.js torus rotation */}
        <div
          style={{
            transformStyle: "preserve-3d" as React.CSSProperties["transformStyle"],
            animation: `torusCurtainSpin ${ROTATION_PERIOD}s linear infinite`,
          }}
        >
          {/* Dense sharp beams — 120 total */}
          {beams.map((beam, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${-beam.width / 2}px`,
                top: 0,
                width: `${beam.width}px`,
                height: "220vh",
                transform: `rotateY(${beam.angle}deg) translateZ(min(32vw, 420px))`,
                background: `linear-gradient(to bottom, rgba(42, 114, 229, ${beam.opacity * 1.8}) 0%, rgba(42, 114, 229, ${beam.opacity}) 15%, rgba(42, 114, 229, ${beam.opacity * 0.5}) 35%, rgba(42, 114, 229, ${beam.opacity * 0.2}) 55%, rgba(42, 114, 229, ${beam.opacity * 0.05}) 75%, transparent 90%)`,
                backfaceVisibility: "hidden",
              }}
            />
          ))}

          {/* Wider soft glow beams — every 4th beam */}
          {glowBeams.map((beam, i) => (
            <div
              key={`glow-${i}`}
              style={{
                position: "absolute",
                left: "-10px",
                top: 0,
                width: "20px",
                height: "200vh",
                transform: `rotateY(${beam.angle}deg) translateZ(min(32vw, 420px))`,
                background: `linear-gradient(to bottom, rgba(42, 114, 229, 0.1) 0%, rgba(42, 114, 229, 0.05) 30%, rgba(42, 114, 229, 0.02) 60%, transparent 85%)`,
                filter: "blur(6px)",
                backfaceVisibility: "hidden",
              }}
            />
          ))}

          {/* Extra bright accent beams — every 10th beam */}
          {beams
            .filter((_, i) => i % 10 === 0)
            .map((beam, i) => (
              <div
                key={`accent-${i}`}
                style={{
                  position: "absolute",
                  left: "-2px",
                  top: 0,
                  width: "4px",
                  height: "180vh",
                  transform: `rotateY(${beam.angle}deg) translateZ(min(32vw, 420px))`,
                  background: `linear-gradient(to bottom, rgba(42, 114, 229, 0.5) 0%, rgba(42, 114, 229, 0.25) 20%, rgba(42, 114, 229, 0.08) 50%, transparent 80%)`,
                  backfaceVisibility: "hidden",
                }}
              />
            ))}
        </div>
      </div>

      {/* Ring glow halo at torus position */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: "8%",
          width: "55vw",
          height: "8vh",
          background:
            "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 25%, rgba(42, 114, 229, 0.15) 45%, rgba(42, 114, 229, 0.04) 70%, transparent 95%)",
        }}
      />

      {/* Downward cone glow — illumination on floor below */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: "30%",
          width: "60vw",
          height: "70vh",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(42, 114, 229, 0.06) 0%, rgba(42, 114, 229, 0.02) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}
