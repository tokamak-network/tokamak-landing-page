"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const TokamakGate = dynamic(() => import("./TokamakGate"), { ssr: false });

/* ═══════════════════════════════════════════════
   Pipeline Node — Sequencer → Batcher → Proposer → L1
   ═══════════════════════════════════════════════ */

const PIPELINE_STEPS = [
  { id: "sequencer", label: "SEQUENCER", status: "ACTIVE" },
  { id: "batcher", label: "BATCHER", status: "ACTIVE" },
  { id: "proposer", label: "PROPOSER", status: "ACTIVE" },
  { id: "l1", label: "L1", status: "SYNC" },
] as const;

function PipelineNode({ label, status, index }: { label: string; status: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
      className="flex items-center"
    >
      <div
        className="flex flex-col items-center justify-center"
        style={{
          padding: "clamp(6px, 0.5vw, 10px) clamp(10px, 1vw, 18px)",
          background: "rgba(0, 229, 255, 0.06)",
          border: "1px solid rgba(0, 229, 255, 0.25)",
          minWidth: "clamp(60px, 5vw, 80px)",
        }}
      >
        <span
          style={{
            fontSize: "clamp(7px, 0.6vw, 10px)",
            color: "#00e5ff",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.1em",
            fontWeight: 700,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "clamp(5px, 0.45vw, 7px)",
            color: status === "ACTIVE" ? "#22c55e" : "#00e5ff",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.08em",
            marginTop: 2,
            opacity: 0.7,
          }}
        >
          {status}
        </span>
      </div>

      {index < PIPELINE_STEPS.length - 1 && (
        <div className="flex items-center" style={{ width: "clamp(16px, 1.5vw, 28px)" }}>
          <div
            style={{
              flex: 1,
              height: 1,
              background: "rgba(0, 229, 255, 0.4)",
            }}
          />
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: "3px solid transparent",
              borderBottom: "3px solid transparent",
              borderLeft: "5px solid rgba(0, 229, 255, 0.5)",
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Readout Panel — side metric with console feel
   ═══════════════════════════════════════════════ */

function ReadoutPanel({
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
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
      className="relative"
      style={{
        width: "clamp(110px, 10vw, 160px)",
        background: "rgba(2, 10, 22, 0.92)",
        border: "1px solid rgba(0, 229, 255, 0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "linear-gradient(90deg, rgba(0, 229, 255, 0.6), rgba(0, 229, 255, 0.1))",
        }}
      />
      {/* Label bar */}
      <div
        style={{
          padding: "clamp(5px, 0.5vw, 8px) clamp(8px, 0.8vw, 12px)",
          borderBottom: "1px solid rgba(0, 229, 255, 0.1)",
          background: "rgba(0, 229, 255, 0.04)",
        }}
      >
        <span
          style={{
            fontSize: "clamp(6px, 0.55vw, 9px)",
            color: "rgba(0, 229, 255, 0.7)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      {/* Value */}
      <div style={{ padding: "clamp(8px, 0.8vw, 14px) clamp(8px, 0.8vw, 12px)" }}>
        <div
          style={{
            fontSize: "clamp(18px, 2vw, 30px)",
            color: "#fff",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            lineHeight: 1,
            textShadow: "0 0 20px rgba(0, 229, 255, 0.3)",
          }}
        >
          {value}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Launch CTA — prominent launch button
   ═══════════════════════════════════════════════ */

function LaunchCTA() {
  return (
    <motion.a
      href="https://rolluphub.tokamak.network/"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="relative inline-flex items-center justify-center cursor-pointer"
      style={{
        padding: "clamp(12px, 1.2vw, 18px) clamp(36px, 3.5vw, 56px)",
        background: "linear-gradient(180deg, rgba(0, 229, 255, 0.18) 0%, rgba(0, 229, 255, 0.06) 100%)",
        border: "1px solid rgba(0, 229, 255, 0.5)",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "clamp(11px, 1vw, 15px)",
        color: "#00e5ff",
        letterSpacing: "0.18em",
        fontWeight: 700,
        textTransform: "uppercase",
        textDecoration: "none",
        textShadow: "0 0 14px rgba(0, 229, 255, 0.6)",
        boxShadow:
          "0 0 30px rgba(0, 229, 255, 0.15), 0 0 60px rgba(0, 229, 255, 0.05), inset 0 1px 0 rgba(0, 229, 255, 0.2)",
        transition: "all 0.3s ease",
      }}
      whileHover={{
        boxShadow:
          "0 0 40px rgba(0, 229, 255, 0.3), 0 0 80px rgba(0, 229, 255, 0.1), inset 0 0 30px rgba(0, 229, 255, 0.08)",
        borderColor: "rgba(0, 229, 255, 0.8)",
      }}
    >
      {/* Corner brackets */}
      {[
        { top: -1, left: -1, borderTop: "2px solid #00e5ff", borderLeft: "2px solid #00e5ff" },
        { top: -1, right: -1, borderTop: "2px solid #00e5ff", borderRight: "2px solid #00e5ff" },
        { bottom: -1, left: -1, borderBottom: "2px solid #00e5ff", borderLeft: "2px solid #00e5ff" },
        { bottom: -1, right: -1, borderBottom: "2px solid #00e5ff", borderRight: "2px solid #00e5ff" },
      ].map((s, i) => (
        <span
          key={i}
          className="absolute w-3 h-3 pointer-events-none"
          style={s as React.CSSProperties}
        />
      ))}
      Launch Your L2
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════
   Header Bar — status strip
   ═══════════════════════════════════════════════ */

function HeaderBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="absolute z-20 flex items-center justify-center"
      style={{ top: "clamp(24px, 5vh, 50px)", left: 0, right: 0 }}
    >
      <div
        style={{
          padding: "clamp(6px, 0.6vw, 10px) clamp(20px, 2vw, 36px)",
          background: "rgba(2, 10, 22, 0.8)",
          border: "1px solid rgba(0, 229, 255, 0.15)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span
          style={{
            fontSize: "clamp(8px, 0.65vw, 11px)",
            color: "rgba(140, 200, 255, 0.6)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Thanos L2
          <span style={{ margin: "0 10px", opacity: 0.3 }}>|</span>
          OP Stack Infrastructure
          <span style={{ margin: "0 10px", opacity: 0.3 }}>|</span>
          Status: <span style={{ color: "#22c55e" }}>Operational</span>
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Bottom Control Panel — integrated bar
   ═══════════════════════════════════════════════ */

function BottomControlPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="absolute z-10"
      style={{
        left: 0,
        right: 0,
        bottom: 0,
        background: "linear-gradient(180deg, transparent 0%, rgba(2, 8, 18, 0.85) 30%, rgba(2, 8, 18, 0.95) 100%)",
        padding: "clamp(40px, 5vh, 70px) clamp(20px, 4vw, 60px) clamp(20px, 3vh, 40px)",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Launch CTA */}
        <LaunchCTA />

        {/* Pipeline */}
        <div className="flex items-center">
          {PIPELINE_STEPS.map((step, i) => (
            <PipelineNode key={step.id} label={step.label} status={step.status} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Mobile Overlay — simplified, no 3D
   ═══════════════════════════════════════════════ */

const MOBILE_METRICS = [
  { label: "Bridge Time", value: "<3 MIN" },
  { label: "Gas Reduction", value: "90%+" },
  { label: "Block Time", value: "1.2s" },
  { label: "On-Demand", value: "DEPLOY" },
] as const;

function ThanosL2MobileOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-5 py-8 gap-5">
      <div className="flex flex-col items-center gap-1">
        <div
          style={{
            fontSize: 10,
            color: "rgba(140, 200, 255, 0.5)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Floor 01
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#00e5ff",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textShadow: "0 0 14px rgba(0, 229, 255, 0.5)",
            textAlign: "center",
          }}
        >
          Thanos L2
        </div>
        <div
          style={{
            fontSize: 10,
            color: "rgba(140, 200, 255, 0.5)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          OP Stack Infrastructure
          <span style={{ marginLeft: 8, color: "#22c55e" }}>● Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {MOBILE_METRICS.map((m) => (
          <div
            key={m.label}
            className="relative flex flex-col items-center justify-center py-3 px-2"
            style={{
              background: "linear-gradient(180deg, rgba(4, 14, 28, 0.85) 0%, rgba(2, 8, 18, 0.8) 100%)",
              clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
              border: "1px solid rgba(0, 229, 255, 0.15)",
              minHeight: 64,
            }}
          >
            <div
              className="absolute pointer-events-none"
              style={{ top: -1, left: 0, right: 8, height: 1, background: "rgba(0, 229, 255, 0.4)" }}
            />
            <div
              style={{
                fontSize: 9,
                color: "rgba(0, 229, 255, 0.7)",
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#fff",
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                lineHeight: 1,
                textShadow: "0 0 12px rgba(0, 229, 255, 0.3)",
              }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1">
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center gap-1">
            <div
              style={{
                fontSize: 9,
                color: "#00e5ff",
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: "0.08em",
                padding: "4px 8px",
                border: "1px solid rgba(0, 229, 255, 0.3)",
                background: "rgba(0, 229, 255, 0.06)",
                whiteSpace: "nowrap",
              }}
            >
              {step.label}
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div style={{ width: 12, height: 1, background: "rgba(0, 229, 255, 0.4)" }} />
            )}
          </div>
        ))}
      </div>

      <a
        href="https://rolluphub.tokamak.network/"
        target="_blank"
        rel="noopener noreferrer"
        className="relative inline-flex items-center justify-center"
        style={{
          padding: "12px 32px",
          minHeight: 44,
          background: "linear-gradient(180deg, rgba(0, 229, 255, 0.12) 0%, rgba(0, 229, 255, 0.04) 100%)",
          border: "1px solid rgba(0, 229, 255, 0.4)",
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 12,
          color: "#00e5ff",
          letterSpacing: "0.2em",
          fontWeight: 700,
          textTransform: "uppercase",
          textDecoration: "none",
          textShadow: "0 0 10px rgba(0, 229, 255, 0.5)",
        }}
      >
        Launch Your L2
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Export — Thanos L2 Floor Overlay
   ═══════════════════════════════════════════════ */

export default function ThanosL2Overlay() {
  return (
    <div className="absolute inset-0">
      {/* ── Mobile layout (below md) ── */}
      <div className="block md:hidden w-full h-full">
        <ThanosL2MobileOverlay />
      </div>

      {/* ── Desktop layout (md and above) ── */}
      <div className="hidden md:block w-full h-full">
        <div className="absolute inset-0">
          <HeaderBar />

          {/* 3D holographic torus — pure mesh */}
          <TokamakGate />

          {/* Left readouts */}
          <div
            className="absolute z-10 flex flex-col"
            style={{
              left: "clamp(16px, 5vw, 70px)",
              top: "40%",
              transform: "translateY(-50%)",
              gap: "clamp(6px, 0.8vw, 12px)",
            }}
          >
            <ReadoutPanel label="Bridge Time" value="<3 MIN" index={0} side="left" />
            <ReadoutPanel label="Gas Reduction" value="90%+" index={1} side="left" />
          </div>

          {/* Right readouts */}
          <div
            className="absolute z-10 flex flex-col"
            style={{
              right: "clamp(16px, 5vw, 70px)",
              top: "40%",
              transform: "translateY(-50%)",
              gap: "clamp(6px, 0.8vw, 12px)",
            }}
          >
            <ReadoutPanel label="Block Time" value="1.2s" index={2} side="right" />
            <ReadoutPanel label="On-Demand" value="DEPLOY" index={3} side="right" />
          </div>

          {/* Bottom control panel — gradient fade + CTA + pipeline */}
          <BottomControlPanel />
        </div>
      </div>
    </div>
  );
}
