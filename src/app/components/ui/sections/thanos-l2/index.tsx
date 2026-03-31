"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import LazyWebGL from "../../LazyWebGL";

const TokamakGate = dynamic(() => import("./TokamakGate"), { ssr: false });

/* ═══════════════════════════════════════════════
   Feature Pillar — Stack / SDK / Modular
   ═══════════════════════════════════════════════ */

const PILLARS = [
  { id: "stack", label: "STACK", title: "Custom Config", desc: "Your own optimized chain setup" },
  { id: "sdk", label: "SDK", title: "One-Click Deploy", desc: "Launch an L2 in minutes" },
  { id: "modular", label: "MODULAR", title: "Plug & Extend", desc: "Open modular architecture" },
] as const;

function FeaturePillar({ pillar, index }: { pillar: typeof PILLARS[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 + index * 0.15 }}
      className="relative flex flex-col items-center justify-center"
      style={{
        width: "clamp(120px, 11vw, 170px)",
        padding: "clamp(10px, 1vw, 16px) clamp(8px, 0.8vw, 14px)",
        background: "rgba(2, 10, 22, 0.9)",
        border: "1px solid rgba(0, 229, 255, 0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6), transparent)",
        }}
      />
      <span
        style={{
          fontSize: "clamp(9px, 0.7vw, 11px)",
          color: "#00e5ff",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.2em",
          fontWeight: 700,
          marginBottom: "clamp(4px, 0.4vw, 8px)",
        }}
      >
        {pillar.label}
      </span>
      <span
        style={{
          fontSize: "clamp(11px, 0.95vw, 15px)",
          color: "#fff",
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textAlign: "center",
          lineHeight: 1.25,
          marginBottom: "clamp(3px, 0.3vw, 6px)",
          textShadow: "0 0 14px rgba(0, 229, 255, 0.25)",
        }}
      >
        {pillar.title}
      </span>
      <span
        style={{
          fontSize: "clamp(8px, 0.6vw, 10px)",
          color: "rgba(160, 210, 255, 0.55)",
          fontFamily: "'Share Tech Mono', monospace",
          textAlign: "center",
          lineHeight: 1.3,
          letterSpacing: "0.02em",
        }}
      >
        {pillar.desc}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Cascade Card — Energy Cascade style side metric
   ═══════════════════════════════════════════════ */

const cascadeKeyframes = `
@keyframes cascadePulse {
  0%, 100% { opacity: 0.15; transform: scaleX(0.4); }
  50% { opacity: 0.8; transform: scaleX(1); }
}`;

function CascadeCard({
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
      initial={{ opacity: 0, x: side === "left" ? -16 : 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.12 }}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        width: "clamp(140px, 12vw, 195px)",
        height: "clamp(120px, 11vw, 165px)",
        background: "rgba(5, 10, 20, 0.95)",
        border: "1px solid rgba(42, 114, 229, 0.3)",
        borderRadius: 8,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: cascadeKeyframes }} />
      {/* Cascade bars */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${15 + i * 15}%`,
            height: 3,
            background: "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.7), transparent)",
            boxShadow: "0 0 12px rgba(0, 229, 255, 0.5)",
            animation: `cascadePulse 2s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      {/* Value */}
      <div
        style={{
          fontSize: "clamp(20px, 2.2vw, 34px)",
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 900,
          color: "#fff",
          textShadow:
            "0 0 12px rgba(0, 229, 255, 1), 0 0 24px rgba(0, 229, 255, 0.7), 0 0 36px rgba(0, 229, 255, 0.5)",
          zIndex: 1,
          marginBottom: 6,
        }}
      >
        {value}
      </div>
      {/* Label */}
      <div
        style={{
          fontSize: "clamp(8px, 0.65vw, 11px)",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "rgba(122, 140, 168, 0.9)",
          fontFamily: "'Share Tech Mono', monospace",
          zIndex: 1,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Launch CTA — prominent deploy button
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
        padding: "clamp(16px, 1.6vw, 22px) clamp(48px, 5vw, 72px)",
        background: "linear-gradient(180deg, rgba(0, 40, 60, 0.95) 0%, rgba(5, 25, 50, 0.95) 100%)",
        border: "2px solid rgba(0, 229, 255, 0.9)",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "clamp(13px, 1.2vw, 17px)",
        color: "#fff",
        letterSpacing: "0.18em",
        fontWeight: 700,
        textTransform: "uppercase",
        textDecoration: "none",
        textShadow: "0 0 20px rgba(0, 229, 255, 1), 0 0 40px rgba(0, 229, 255, 0.6)",
        boxShadow:
          "0 0 40px rgba(0, 229, 255, 0.35), 0 0 80px rgba(0, 229, 255, 0.15), 0 0 120px rgba(0, 229, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.2), inset 0 0 30px rgba(0, 229, 255, 0.15)",
        transition: "all 0.3s ease",
      }}
      whileHover={{
        boxShadow:
          "0 0 40px rgba(0, 229, 255, 0.4), 0 0 80px rgba(0, 229, 255, 0.2), 0 0 120px rgba(0, 229, 255, 0.1), inset 0 0 40px rgba(0, 229, 255, 0.15)",
        borderColor: "#00e5ff",
        background: "linear-gradient(180deg, rgba(0, 229, 255, 0.35) 0%, rgba(42, 114, 229, 0.2) 100%)",
      }}
    >
      {/* Pulsing glow overlay — strong pulse */}
      <span
        className="absolute pointer-events-none"
        style={{
          inset: "-12px -24px",
          background: "radial-gradient(ellipse at center, rgba(0, 229, 255, 0.5) 0%, rgba(0, 229, 255, 0.15) 50%, transparent 75%)",
          animation: "ctaGlow 2s ease-in-out infinite",
          borderRadius: 8,
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ctaGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
      `}} />
      {/* Corner brackets */}
      {[
        { top: -1, left: -1, borderTop: "2px solid #00e5ff", borderLeft: "2px solid #00e5ff" },
        { top: -1, right: -1, borderTop: "2px solid #00e5ff", borderRight: "2px solid #00e5ff" },
        { bottom: -1, left: -1, borderBottom: "2px solid #00e5ff", borderLeft: "2px solid #00e5ff" },
        { bottom: -1, right: -1, borderBottom: "2px solid #00e5ff", borderRight: "2px solid #00e5ff" },
      ].map((s, i) => (
        <span key={i} className="absolute w-3 h-3 pointer-events-none" style={s as React.CSSProperties} />
      ))}
      <span style={{ position: "relative", zIndex: 1 }}>Deploy Your Appchain</span>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════
   Header — title and tagline
   ═══════════════════════════════════════════════ */

function HeaderBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="absolute z-20 flex flex-col items-center"
      style={{ top: "clamp(28px, 5.5vh, 55px)", left: 0, right: 0 }}
    >
      <div
        style={{
          fontSize: "clamp(8px, 0.65vw, 11px)",
          color: "rgba(0, 229, 255, 0.5)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginBottom: "clamp(4px, 0.5vw, 8px)",
        }}
      >
        Thanos L2 · OP Stack
      </div>
      <div
        style={{
          fontSize: "clamp(14px, 1.4vw, 22px)",
          color: "#fff",
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textShadow: "0 0 20px rgba(0, 229, 255, 0.3)",
          textAlign: "center",
        }}
      >
        On-Demand L2 for Ethereum
      </div>
      <div
        style={{
          fontSize: "clamp(7px, 0.55vw, 10px)",
          color: "rgba(160, 210, 255, 0.5)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.12em",
          marginTop: "clamp(3px, 0.3vw, 6px)",
        }}
      >
        Fast · Secure · Fully Customizable
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Bottom Control Panel — pillars + CTA
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
        background: "linear-gradient(180deg, transparent 0%, rgba(2, 8, 18, 0.7) 50%, rgba(2, 8, 18, 0.85) 100%)",
        padding: "clamp(30px, 4vh, 55px) clamp(20px, 4vw, 60px) clamp(16px, 2vh, 28px)",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Feature pillars */}
        <div className="flex items-stretch justify-center gap-3">
          {PILLARS.map((p, i) => (
            <FeaturePillar key={p.id} pillar={p} index={i} />
          ))}
        </div>
        {/* CTA */}
        <LaunchCTA />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Mobile Overlay — simplified, no 3D
   ═══════════════════════════════════════════════ */

const THANOS_TERMINAL_KEYFRAMES = `
@keyframes thanosBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
@keyframes thanosStatusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
@keyframes thanosFadeInLine {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

const TERMINAL_LINES: { type: string; text?: string; dim?: string; highlight?: string }[] = [
  { type: "cmd", text: "$ thanos deploy --chain my-l2" },
  { type: "blank" },
  { type: "step", text: "[1/4] Initializing OP Stack config..." },
  { type: "ok", text: "\u2713 Config loaded", dim: "(0.8s)" },
  { type: "step", text: "[2/4] Setting up sequencer node..." },
  { type: "ok", text: "\u2713 Sequencer online", dim: "(1.2s)" },
  { type: "step", text: "[3/4] Deploying bridge contracts..." },
  { type: "ok", text: "\u2713 Bridge deployed at", highlight: "0x7a2f...e4b1" },
  { type: "step", text: "[4/4] Running health checks..." },
  { type: "ok", text: "\u2713 All systems operational" },
];

const DEPLOY_RESULT: { label: string; value: string; isHighlight?: boolean }[] = [
  { label: "Chain ID:", value: "111551119999", isHighlight: true },
  { label: "RPC:", value: "https://rpc.my-l2.tokamak.network" },
  { label: "Explorer:", value: "https://explorer.my-l2.tokamak.network" },
  { label: "Time:", value: "4m 23s", isHighlight: true },
];

const SPEC_ITEMS: { value: string; label: string; smallFont?: boolean }[] = [
  { value: "100%", label: "Open Source" },
  { value: "CUSTOM", label: "Config", smallFont: true },
  { value: "MODULAR", label: "Architecture", smallFont: true },
];

function ThanosL2MobileOverlay() {
  const termRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = termRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={termRef} className="absolute inset-0 flex flex-col px-3 py-8 gap-3 overflow-y-auto">
      <style dangerouslySetInnerHTML={{ __html: THANOS_TERMINAL_KEYFRAMES }} />

      {/* ── Top label ── */}
      <div
        style={{
          fontSize: 9,
          color: "rgba(0, 229, 255, 0.6)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          paddingLeft: 4,
        }}
      >
        THANOS L2 &middot; DEPLOY
      </div>

      {/* ── Terminal window ── */}
      <div
        style={{
          background: "rgba(0, 8, 16, 0.98)",
          border: "1px solid rgba(0, 229, 255, 0.3)",
          overflow: "hidden",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 14px",
            gap: 8,
            background: "rgba(0, 229, 255, 0.06)",
            borderBottom: "1px solid rgba(0, 229, 255, 0.15)",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
          <span
            style={{
              fontSize: 10,
              color: "rgba(140, 200, 255, 0.4)",
              fontFamily: "'Share Tech Mono', monospace",
              marginLeft: 8,
            }}
          >
            thanos-cli v2.1.0
          </span>
        </div>

        {/* Terminal body */}
        <div
          style={{
            padding: 16,
            flex: 1,
            fontSize: 12,
            lineHeight: 1.9,
            color: "rgba(200, 225, 255, 0.85)",
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          {TERMINAL_LINES.map((line, i) => (
            <div
              key={i}
              style={{
                opacity: visible ? undefined : 0,
                animation: visible ? `thanosFadeInLine 0.3s ease ${i * 0.4}s both` : "none",
              }}
            >
              {line.type === "blank" && <br />}
              {line.type === "cmd" && (
                <>
                  <span style={{ color: "#00e5ff" }}>$</span>{" "}
                  <span style={{ color: "#fff", fontWeight: 700 }}>
                    {line.text?.replace("$ ", "")}
                  </span>
                </>
              )}
              {line.type === "step" && (
                <span style={{ color: "rgba(140, 200, 255, 0.4)" }}>{line.text}</span>
              )}
              {line.type === "ok" && (
                <>
                  <span style={{ color: "#22c55e" }}>{line.text}</span>
                  {line.dim && (
                    <span style={{ color: "rgba(140, 200, 255, 0.4)" }}> {line.dim}</span>
                  )}
                  {line.highlight && (
                    <span style={{ color: "#f59e0b", fontWeight: 700 }}> {line.highlight}</span>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Deploy result */}
          <div style={{
            opacity: visible ? undefined : 0,
            animation: visible ? `thanosFadeInLine 0.3s ease ${TERMINAL_LINES.length * 0.4}s both` : "none",
          }}>
            <br />
            <span style={{ color: "#22c55e", fontWeight: 700 }}>&#9670; Chain deployed successfully!</span>
            <br />
            {DEPLOY_RESULT.map((r) => (
              <div key={r.label}>
                <span style={{ color: "rgba(140, 200, 255, 0.4)" }}>{"  "}{r.label}</span>{" "}
                <span style={{ color: r.isHighlight ? "#f59e0b" : "rgba(200, 225, 255, 0.85)", fontWeight: r.isHighlight ? 700 : 400 }}>
                  {r.value}
                </span>
              </div>
            ))}
            <br />
            <span style={{ color: "#00e5ff" }}>$</span>{" "}
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 14,
                background: "#00e5ff",
                animation: "thanosBlink 1s step-end infinite",
                verticalAlign: "text-bottom",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Live status ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "rgba(0, 229, 255, 0.05)",
          border: "1px solid rgba(0, 229, 255, 0.15)",
          padding: "12px 14px",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 8px rgba(34, 197, 94, 0.5)",
            animation: "thanosStatusPulse 2s ease infinite",
          }}
        />
        <div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 11, fontWeight: 700, color: "#22c55e" }}>
            CHAIN LIVE
          </div>
          <div style={{ fontSize: 9, color: "rgba(140, 200, 255, 0.4)", marginTop: 2, fontFamily: "'Share Tech Mono', monospace" }}>
            Block #1,247 &middot; 2.0s block time
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 14,
            fontWeight: 900,
            color: "#00e5ff",
            textShadow: "0 0 8px rgba(0, 229, 255, 0.4)",
          }}
        >
          &lt;5m
        </div>
      </div>

      {/* ── Spec stats row ── */}
      <div style={{ display: "flex", gap: 4 }}>
        {SPEC_ITEMS.map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              background: "rgba(0, 8, 20, 0.95)",
              border: "1px solid rgba(0, 229, 255, 0.12)",
              padding: "12px 8px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.4), transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 229, 255, 0.02) 3px, rgba(0, 229, 255, 0.02) 4px)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: s.smallFont ? 13 : 16,
                fontWeight: 900,
                color: "#00e5ff",
                textShadow: "0 0 10px rgba(0, 229, 255, 0.5)",
                position: "relative",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 7,
                color: "rgba(140, 200, 255, 0.5)",
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 4,
                position: "relative",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA button ── */}
      <a
        href="https://rolluphub.tokamak.network/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "14px 24px",
          minHeight: 48,
          background: "linear-gradient(180deg, rgba(0, 40, 60, 0.9), rgba(5, 25, 50, 0.9))",
          border: "1px solid rgba(0, 229, 255, 0.6)",
          fontFamily: "'Orbitron', sans-serif",
          fontSize: 11,
          color: "#fff",
          letterSpacing: "0.18em",
          fontWeight: 700,
          textTransform: "uppercase",
          textDecoration: "none",
          textShadow: "0 0 10px rgba(0, 229, 255, 0.8)",
          boxShadow: "0 0 20px rgba(0, 229, 255, 0.15)",
        }}
      >
        Deploy Your Appchain
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
          <HeaderBar />

          {/* 3D holographic torus — pure mesh */}
          <LazyWebGL style={{ position: "absolute", inset: 0 }}>
            <TokamakGate />
          </LazyWebGL>

          {/* Left specs */}
          <div
            className="absolute z-10 flex flex-col"
            style={{
              left: "clamp(16px, 5vw, 70px)",
              top: "46%",
              transform: "translateY(-50%)",
              gap: "clamp(6px, 0.7vw, 10px)",
            }}
          >
            <CascadeCard label="Infrastructure" value="OP" index={0} side="left" />
            <CascadeCard label="Deploy Time" value="<5m" index={1} side="left" />
          </div>

          {/* Right specs */}
          <div
            className="absolute z-10 flex flex-col"
            style={{
              right: "clamp(16px, 5vw, 70px)",
              top: "46%",
              transform: "translateY(-50%)",
              gap: "clamp(6px, 0.7vw, 10px)",
            }}
          >
            <CascadeCard label="Modular Design" value="MOD" index={2} side="right" />
            <CascadeCard label="Entry Barrier" value="LOW" index={3} side="right" />
          </div>

          {/* Bottom — feature pillars + CTA */}
          <BottomControlPanel />
      </div>
    </div>
  );
}
