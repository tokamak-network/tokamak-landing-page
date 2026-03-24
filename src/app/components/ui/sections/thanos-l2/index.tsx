"use client";

import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════
   Pipeline Node
   ═══════════════════════════════════════════════ */

const PIPELINE_STEPS = [
  { id: "sequencer", label: "SEQUENCER" },
  { id: "batcher", label: "BATCHER" },
  { id: "proposer", label: "PROPOSER" },
  { id: "l1", label: "L1" },
] as const;

function PipelineNode({
  label,
  index,
}: {
  label: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.12 }}
      className="flex items-center gap-0"
    >
      {/* Node */}
      <div className="relative flex items-center justify-center">
        {/* Hexagon shape via clip-path */}
        <div
          className="flex items-center justify-center"
          style={{
            width: "clamp(56px, 6vw, 80px)",
            height: "clamp(48px, 5vw, 68px)",
            background:
              "linear-gradient(180deg, rgba(0, 229, 255, 0.15) 0%, rgba(0, 229, 255, 0.05) 100%)",
            clipPath:
              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
            border: "none",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              clipPath:
                "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
              boxShadow: "inset 0 0 20px rgba(0, 229, 255, 0.2)",
            }}
          />
          <span
            style={{
              fontSize: "clamp(7px, 0.7vw, 10px)",
              color: "#00e5ff",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.1em",
              fontWeight: 700,
              textShadow: "0 0 8px rgba(0, 229, 255, 0.5)",
              position: "relative",
              zIndex: 2,
            }}
          >
            {label}
          </span>
        </div>

        {/* Hex border overlay (SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 86.6"
          preserveAspectRatio="none"
        >
          <polygon
            points="25,0 75,0 100,43.3 75,86.6 25,86.6 0,43.3"
            fill="none"
            stroke="rgba(0, 229, 255, 0.5)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Arrow connector (except after last node) */}
      {index < PIPELINE_STEPS.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.3, delay: 0.7 + index * 0.12 }}
          className="flex items-center"
          style={{ width: "clamp(24px, 3vw, 48px)", originX: 0 }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background:
                "linear-gradient(90deg, rgba(0, 229, 255, 0.6), rgba(0, 229, 255, 0.3))",
              boxShadow: "0 0 6px rgba(0, 229, 255, 0.3)",
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "4px solid transparent",
              borderBottom: "4px solid transparent",
              borderLeft: "6px solid rgba(0, 229, 255, 0.6)",
              filter: "drop-shadow(0 0 4px rgba(0, 229, 255, 0.4))",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Metric Panel — FUI style
   ═══════════════════════════════════════════════ */

function MetricPanel({
  label,
  value,
  index,
  side,
}: {
  label: string;
  value: string;
  index: number;
  side: "left" | "right";
}) {
  const CHAMFER = 10;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
      className="relative"
      style={{
        width: "clamp(130px, 12vw, 180px)",
        padding: "clamp(10px, 1vw, 16px) clamp(12px, 1.2vw, 18px)",
        background:
          "linear-gradient(180deg, rgba(4, 14, 28, 0.8) 0%, rgba(2, 8, 18, 0.75) 100%)",
        clipPath: `polygon(0 0, calc(100% - ${CHAMFER}px) 0, 100% ${CHAMFER}px, 100% 100%, 0 100%)`,
        backdropFilter: "blur(10px)",
        boxShadow:
          "0 2px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 229, 255, 0.06), inset 0 1px 0 rgba(0, 229, 255, 0.15)",
      }}
    >
      {/* Top glow line */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -1,
          left: 0,
          right: CHAMFER,
          height: 2,
          background: "rgba(0, 229, 255, 0.4)",
          boxShadow: "0 0 8px rgba(0, 229, 255, 0.4), 0 0 16px rgba(0, 229, 255, 0.15)",
        }}
      />

      {/* SVG border */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <polygon
          points={`1,1 calc(100% - ${CHAMFER}px),1 100%,${CHAMFER + 1} 100%,100% 1,100%`}
          fill="none"
          stroke="rgba(0, 229, 255, 0.2)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Label */}
      <div
        className="uppercase font-bold tracking-wider"
        style={{
          fontSize: "clamp(8px, 0.65vw, 11px)",
          color: "rgba(0, 229, 255, 0.7)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.14em",
          paddingBottom: "clamp(4px, 0.4vw, 8px)",
          marginBottom: "clamp(4px, 0.4vw, 8px)",
          borderBottom: "1px solid rgba(0, 229, 255, 0.1)",
          position: "relative",
          zIndex: 2,
          textShadow: "0 0 6px rgba(0, 229, 255, 0.3)",
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        className="font-bold"
        style={{
          fontSize: "clamp(18px, 2vw, 30px)",
          color: "#fff",
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: "0.02em",
          lineHeight: 1.1,
          textShadow:
            "0 0 16px rgba(0, 229, 255, 0.2), 0 0 32px rgba(0, 229, 255, 0.06)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {value}
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 5%, rgba(0, 229, 255, 0.05) 50%, transparent 95%)",
            animation: "scanDown 8s linear infinite",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   CTA Button
   ═══════════════════════════════════════════════ */

function LaunchCTA() {
  return (
    <motion.a
      href="https://rolluphub.tokamak.network/"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="relative inline-flex items-center justify-center group cursor-pointer"
      style={{
        padding: "clamp(10px, 1vw, 16px) clamp(28px, 3vw, 48px)",
        background:
          "linear-gradient(180deg, rgba(0, 229, 255, 0.12) 0%, rgba(0, 229, 255, 0.04) 100%)",
        border: "1px solid rgba(0, 229, 255, 0.4)",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "clamp(11px, 1vw, 15px)",
        color: "#00e5ff",
        letterSpacing: "0.2em",
        fontWeight: 700,
        textTransform: "uppercase",
        textDecoration: "none",
        textShadow: "0 0 10px rgba(0, 229, 255, 0.5)",
        boxShadow:
          "0 0 20px rgba(0, 229, 255, 0.1), inset 0 0 20px rgba(0, 229, 255, 0.05)",
        transition: "all 0.3s ease",
      }}
      whileHover={{
        boxShadow:
          "0 0 30px rgba(0, 229, 255, 0.25), inset 0 0 30px rgba(0, 229, 255, 0.1)",
        borderColor: "rgba(0, 229, 255, 0.7)",
      }}
    >
      {/* Corner brackets */}
      <span
        className="absolute top-0 left-0 w-2 h-2 pointer-events-none"
        style={{
          borderTop: "1.5px solid rgba(0, 229, 255, 0.7)",
          borderLeft: "1.5px solid rgba(0, 229, 255, 0.7)",
        }}
      />
      <span
        className="absolute top-0 right-0 w-2 h-2 pointer-events-none"
        style={{
          borderTop: "1.5px solid rgba(0, 229, 255, 0.7)",
          borderRight: "1.5px solid rgba(0, 229, 255, 0.7)",
        }}
      />
      <span
        className="absolute bottom-0 left-0 w-2 h-2 pointer-events-none"
        style={{
          borderBottom: "1.5px solid rgba(0, 229, 255, 0.7)",
          borderLeft: "1.5px solid rgba(0, 229, 255, 0.7)",
        }}
      />
      <span
        className="absolute bottom-0 right-0 w-2 h-2 pointer-events-none"
        style={{
          borderBottom: "1.5px solid rgba(0, 229, 255, 0.7)",
          borderRight: "1.5px solid rgba(0, 229, 255, 0.7)",
        }}
      />
      Launch Your L2
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════
   Header Bar
   ═══════════════════════════════════════════════ */

function HeaderBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="absolute z-20 flex items-center justify-center gap-4"
      style={{
        top: "clamp(30px, 6vh, 60px)",
        left: 0,
        right: 0,
      }}
    >
      <span
        style={{
          fontSize: "clamp(8px, 0.7vw, 11px)",
          color: "rgba(140, 200, 255, 0.5)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Thanos L2
        <span style={{ margin: "0 8px", opacity: 0.3 }}>|</span>
        OP Stack Infrastructure
        <span style={{ margin: "0 8px", opacity: 0.3 }}>|</span>
        Status: <span style={{ color: "#22c55e" }}>Operational</span>
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Main Export — Thanos L2 Floor Overlay
   ═══════════════════════════════════════════════ */

export default function ThanosL2Overlay() {
  return (
    <div className="absolute inset-0">
      {/* Header */}
      <HeaderBar />

      {/* Pipeline — centered */}
      <div
        className="absolute z-10 flex items-center justify-center"
        style={{
          left: 0,
          right: 0,
          top: "50%",
          transform: "translateY(-65%)",
        }}
      >
        <div className="flex items-center">
          {PIPELINE_STEPS.map((step, i) => (
            <PipelineNode key={step.id} label={step.label} index={i} />
          ))}
        </div>
      </div>

      {/* Left metrics */}
      <div
        className="absolute z-10 flex flex-col"
        style={{
          left: "clamp(16px, 6vw, 100px)",
          top: "50%",
          transform: "translateY(-50%)",
          gap: "clamp(8px, 1vw, 14px)",
        }}
      >
        <MetricPanel label="Bridge Time" value="<3 MIN" index={0} side="left" />
        <MetricPanel label="Gas Reduction" value="90%+" index={1} side="left" />
      </div>

      {/* Right metrics */}
      <div
        className="absolute z-10 flex flex-col"
        style={{
          right: "clamp(16px, 6vw, 100px)",
          top: "50%",
          transform: "translateY(-50%)",
          gap: "clamp(8px, 1vw, 14px)",
        }}
      >
        <MetricPanel label="Block Time" value="1.2s" index={2} side="right" />
        <MetricPanel
          label="On-Demand"
          value="DEPLOY"
          index={3}
          side="right"
        />
      </div>

      {/* CTA — bottom center */}
      <div
        className="absolute z-10 flex justify-center"
        style={{
          left: 0,
          right: 0,
          bottom: "clamp(30px, 8vh, 80px)",
        }}
      >
        <LaunchCTA />
      </div>
    </div>
  );
}
