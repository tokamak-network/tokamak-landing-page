"use client";

import { motion, useMotionValue } from "framer-motion";
import { useState } from "react";
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

const MOBILE_METRICS = [
  { label: "Customizable", value: "STACK" },
  { label: "Deploy Time", value: "<5 MIN" },
  { label: "OP Stack", value: "BASE" },
  { label: "Architecture", value: "MODULAR" },
] as const;

const mobileKeyframes = `
@keyframes scanSweep {
  0%   { top: -2px; opacity: 0.6; }
  80%  { opacity: 0.3; }
  100% { top: 100%; opacity: 0; }
}
@keyframes gridFade {
  0%, 100% { opacity: 0.03; }
  50%       { opacity: 0.07; }
}
@keyframes swipeHint {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50%       { transform: translateY(-6px); opacity: 1; }
}
`;

function ThanosL2MobileOverlay() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const dragY = useMotionValue(0);

  function handleDragEnd(_: unknown, info: { offset: { y: number }; velocity: { y: number } }) {
    if (info.offset.y > 60 || info.velocity.y > 300) {
      setSheetOpen(false);
    } else if (info.offset.y < -40 || info.velocity.y < -300) {
      setSheetOpen(true);
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: mobileKeyframes }} />

      {/* ── Scan-line sweep ── */}
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          height: 2,
          background: "linear-gradient(90deg, transparent, #00e5ff, transparent)",
          boxShadow: "0 0 8px rgba(0, 229, 255, 0.8)",
          animation: "scanSweep 6s linear infinite",
          zIndex: 5,
        }}
      />

      {/* ── FUI grid overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          animation: "gridFade 4s ease-in-out infinite",
          zIndex: 2,
        }}
      />

      {/* ── Initial state: title + badges ── */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
        animate={{ opacity: sheetOpen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Title block */}
        <div className="flex flex-col items-center gap-1 px-5 text-center">
          <div
            style={{
              fontSize: 9,
              color: "rgba(0, 229, 255, 0.6)",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            Thanos L2 · OP Stack
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#fff",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textShadow: "0 0 20px rgba(0, 229, 255, 0.5), 0 0 40px rgba(0, 229, 255, 0.2)",
              lineHeight: 1.2,
            }}
          >
            On-Demand L2<br />for Ethereum
          </div>
        </div>

        {/* 2 key metric badges */}
        <div className="flex gap-3 mt-6">
          {[
            { value: "< 1s", label: "Finality" },
            { value: "99.9%", label: "Uptime" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="relative flex flex-col items-center justify-center px-4 py-2"
              style={{
                background: "rgba(5, 10, 20, 0.75)",
                border: "1px solid rgba(0, 229, 255, 0.35)",
                backdropFilter: "blur(8px)",
                minWidth: 90,
                minHeight: 52,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 pointer-events-none"
                style={{ height: 1, background: "rgba(0, 229, 255, 0.5)" }}
              />
              <div
                style={{
                  fontSize: 18,
                  color: "#fff",
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  textShadow: "0 0 12px rgba(0, 229, 255, 0.6)",
                  lineHeight: 1,
                }}
              >
                {badge.value}
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: "rgba(0, 229, 255, 0.7)",
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginTop: 3,
                }}
              >
                {badge.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Backdrop when sheet is open ── */}
      <motion.div
        className="absolute inset-0 z-20"
        animate={{ opacity: sheetOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "rgba(2, 6, 14, 0.6)",
          backdropFilter: "blur(4px)",
          pointerEvents: sheetOpen ? "auto" : "none",
        }}
        onClick={() => setSheetOpen(false)}
      />

      {/* ── Bottom sheet ── */}
      <motion.div
        className="absolute left-0 right-0 bottom-0 z-30 flex flex-col"
        animate={{ y: sheetOpen ? 0 : "85%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.3 }}
        style={{
          y: dragY,
          background: "rgba(5, 10, 20, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(0, 229, 255, 0.3)",
          borderLeft: "1px solid rgba(0, 229, 255, 0.1)",
          borderRight: "1px solid rgba(0, 229, 255, 0.1)",
          borderRadius: "12px 12px 0 0",
          paddingBottom: "env(safe-area-inset-bottom, 16px)",
        }}
        onDragEnd={handleDragEnd}
        onTap={() => { if (!sheetOpen) setSheetOpen(true); }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.7), transparent)",
          }}
        />

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: "rgba(0, 229, 255, 0.35)",
            }}
          />
        </div>

        {/* Swipe-up hint (visible when closed) */}
        <motion.div
          className="flex flex-col items-center pb-2"
          animate={{ opacity: sheetOpen ? 0 : 1 }}
          transition={{ duration: 0.2 }}
          style={{ pointerEvents: "none" }}
        >
          <div
            style={{
              animation: "swipeHint 1.8s ease-in-out infinite",
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Chevron up */}
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M1 9L8 2L15 9" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div
              style={{
                fontSize: 8,
                color: "rgba(0, 229, 255, 0.6)",
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Swipe up
            </div>
          </div>
        </motion.div>

        {/* Sheet content (metrics + CTA) */}
        <motion.div
          className="flex flex-col items-center px-5 gap-4"
          animate={{ opacity: sheetOpen ? 1 : 0 }}
          transition={{ duration: 0.25, delay: sheetOpen ? 0.1 : 0 }}
          style={{ paddingBottom: 24 }}
        >
          {/* 2×2 metrics grid */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {MOBILE_METRICS.map((m) => (
              <div
                key={m.label}
                className="relative flex flex-col items-center justify-center py-3 px-2"
                style={{
                  background: "rgba(2, 10, 22, 0.9)",
                  border: "1px solid rgba(0, 229, 255, 0.18)",
                  minHeight: 64,
                }}
              >
                <div
                  className="absolute pointer-events-none"
                  style={{ top: 0, left: 0, right: 0, height: 1, background: "rgba(0, 229, 255, 0.4)" }}
                />
                <div
                  style={{
                    fontSize: 8,
                    color: "rgba(0, 229, 255, 0.65)",
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
                    fontSize: 18,
                    color: "#fff",
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700,
                    lineHeight: 1,
                    textShadow: "0 0 10px rgba(0, 229, 255, 0.3)",
                  }}
                >
                  {m.value}
                </div>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <a
            href="https://rolluphub.tokamak.network/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center w-full max-w-xs"
            style={{
              padding: "14px 32px",
              minHeight: 48,
              background: "linear-gradient(180deg, rgba(0, 40, 60, 0.95) 0%, rgba(5, 25, 50, 0.95) 100%)",
              border: "1.5px solid rgba(0, 229, 255, 0.8)",
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 12,
              color: "#fff",
              letterSpacing: "0.18em",
              fontWeight: 700,
              textTransform: "uppercase",
              textDecoration: "none",
              textShadow: "0 0 14px rgba(0, 229, 255, 0.8)",
              boxShadow: "0 0 24px rgba(0, 229, 255, 0.25), inset 0 0 20px rgba(0, 229, 255, 0.08)",
            }}
          >
            Deploy Your Appchain
          </a>

          {/* Sub-tagline */}
          <div
            style={{
              fontSize: 9,
              color: "rgba(160, 210, 255, 0.45)",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Fast · Secure · Fully Customizable
          </div>
        </motion.div>
      </motion.div>
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
    </div>
  );
}
