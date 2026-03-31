"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import LazyWebGL from "../../LazyWebGL";

const TokenVortex = dynamic(() => import("./TokenVortex"), { ssr: false });

/* ═══════════════════════════════════════════════
   Keyframes — cascade pulse + CTA glow + scan sweep
   ═══════════════════════════════════════════════ */

const GLOBAL_KEYFRAMES = `
@keyframes cascadePulse {
  0%, 100% { opacity: 0.12; transform: scaleX(0.35); }
  50% { opacity: 0.75; transform: scaleX(1); }
}
@keyframes ctaGlowPulse {
  0%, 100% { opacity: 0.35; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}
`;

/* ═══════════════════════════════════════════════
   Proposal data & staking data
   ═══════════════════════════════════════════════ */

const PROPOSALS = [
  { id: "TIP-42", title: "L2 Fee Adjustment", status: "active", votes: "67%" },
  { id: "TIP-41", title: "Reward Distribution", status: "passed", votes: "89%" },
  { id: "TIP-40", title: "Protocol Upgrade v3", status: "passed", votes: "94%" },
] as const;

const STAKING_METRICS = [
  { label: "Total Staked", value: "42.8M", suffix: "TON" },
  { label: "Staking APR", value: "8.2", suffix: "%" },
  { label: "Validators", value: "127", suffix: "" },
] as const;

const GOV_STATS = [
  { label: "Active Props", value: "3" },
  { label: "Total Voters", value: "2,841" },
  { label: "Quorum", value: "45%" },
] as const;

/* ═══════════════════════════════════════════════
   Header Bar — reactor control room style with scan line
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
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_KEYFRAMES }} />
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
        Reactor Core · Governance &amp; Staking
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
        Network Power &amp; Consensus Layer
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
        Secure · Decentralized · On-Chain
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Reactor Log Card — proposal styled as cascade card
   ═══════════════════════════════════════════════ */

function ReactorLogCard({
  proposal,
  index,
}: {
  proposal: (typeof PROPOSALS)[number];
  index: number;
}) {
  const isActive = proposal.status === "active";
  const voteNum = parseInt(proposal.votes);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.12 }}
      className="relative flex flex-col justify-between overflow-hidden"
      style={{
        width: "clamp(150px, 13vw, 205px)",
        padding: "clamp(10px, 1vw, 14px) clamp(12px, 1.1vw, 16px)",
        background: isActive
          ? "rgba(0, 10, 20, 0.80)"
          : "rgba(5, 10, 20, 0.80)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: isActive
          ? "1px solid rgba(0, 229, 255, 0.35)"
          : "1px solid rgba(42, 114, 229, 0.25)",
        borderRadius: 6,
      }}
    >
      {/* Cascade pulse bars */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${18 + i * 18}%`,
            height: 2,
            background: isActive
              ? "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.65), transparent)"
              : "linear-gradient(90deg, transparent, rgba(42, 114, 229, 0.5), transparent)",
            boxShadow: isActive
              ? "0 0 10px rgba(0, 229, 255, 0.4)"
              : "0 0 8px rgba(42, 114, 229, 0.3)",
            animation: "cascadePulse 2.2s ease-in-out infinite",
            animationDelay: `${i * 0.22}s`,
          }}
        />
      ))}

      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: 2,
          background: isActive
            ? "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.8), transparent)"
            : "linear-gradient(90deg, transparent, rgba(42, 114, 229, 0.5), transparent)",
          boxShadow: isActive ? "0 0 12px rgba(0, 229, 255, 0.5)" : "none",
        }}
      />

      {/* Proposal ID */}
      <div
        style={{
          fontSize: "clamp(7px, 0.55vw, 9px)",
          color: isActive ? "#00e5ff" : "rgba(0, 229, 255, 0.45)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.18em",
          fontWeight: 700,
          zIndex: 1,
          textShadow: isActive ? "0 0 8px rgba(0, 229, 255, 0.5)" : "none",
        }}
      >
        {proposal.id}
        <span
          style={{
            marginLeft: 8,
            color: isActive ? "#22c55e" : "rgba(140, 200, 255, 0.35)",
            textShadow: "none",
          }}
        >
          ▸ {proposal.status.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "clamp(9px, 0.75vw, 12px)",
          color: "rgba(255, 255, 255, 0.85)",
          fontFamily: "'Share Tech Mono', monospace",
          marginTop: "clamp(4px, 0.4vw, 6px)",
          lineHeight: 1.3,
          zIndex: 1,
        }}
      >
        {proposal.title}
      </div>

      {/* Vote bar + percentage */}
      <div style={{ marginTop: "clamp(8px, 0.8vw, 12px)", zIndex: 1 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
          <span
            style={{
              fontSize: "clamp(6px, 0.5vw, 8px)",
              color: "rgba(122, 140, 168, 0.8)",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Votes
          </span>
          <span
            style={{
              fontSize: "clamp(12px, 1.1vw, 18px)",
              color: "#fff",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              textShadow: isActive
                ? "0 0 12px rgba(0, 229, 255, 1), 0 0 24px rgba(0, 229, 255, 0.6)"
                : "0 0 8px rgba(0, 229, 255, 0.3)",
            }}
          >
            {proposal.votes}
          </span>
        </div>
        {/* Animated vote bar */}
        <div
          style={{
            height: 3,
            background: "rgba(0, 229, 255, 0.08)",
            borderRadius: 2,
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${voteNum}%` }}
            transition={{ duration: 1.5, delay: 0.9 + index * 0.15, ease: "easeOut" }}
            style={{
              height: "100%",
              background: isActive
                ? "linear-gradient(90deg, #00e5ff, #2A72E5)"
                : "rgba(0, 229, 255, 0.3)",
              borderRadius: 2,
              boxShadow: isActive ? "0 0 8px rgba(0, 229, 255, 0.5)" : "none",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Power Output Card — staking metric as cascade card
   ═══════════════════════════════════════════════ */

function PowerOutputCard({
  metric,
  index,
}: {
  metric: (typeof STAKING_METRICS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.5 + index * 0.12 }}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        width: "clamp(140px, 12vw, 195px)",
        height: "clamp(110px, 10vw, 150px)",
        background: "rgba(5, 10, 20, 0.80)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(42, 114, 229, 0.3)",
        borderRadius: 8,
      }}
    >
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
            animation: "cascadePulse 2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}

      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6), transparent)",
        }}
      />

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
          marginBottom: 4,
          letterSpacing: "0.02em",
        }}
      >
        {metric.value}
        {metric.suffix && (
          <span
            style={{
              fontSize: "0.45em",
              color: "rgba(0, 229, 255, 0.7)",
              marginLeft: 4,
              letterSpacing: "0.08em",
            }}
          >
            {metric.suffix}
          </span>
        )}
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
        {metric.label}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Governance Stats Row — compact pillars
   ═══════════════════════════════════════════════ */

function GovernanceStatsRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.0 }}
      className="flex items-stretch justify-center"
      style={{ gap: "clamp(4px, 0.5vw, 8px)" }}
    >
      {GOV_STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="relative flex flex-col items-center justify-center"
          style={{
            padding: "clamp(8px, 0.8vw, 12px) clamp(10px, 1vw, 16px)",
            background: "rgba(2, 10, 22, 0.9)",
            border: "1px solid rgba(0, 229, 255, 0.2)",
            minWidth: "clamp(60px, 5.5vw, 90px)",
          }}
        >
          {/* Top accent */}
          <div
            className="absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.5), transparent)",
            }}
          />
          <motion.span
            animate={{
              textShadow: [
                "0 0 6px rgba(0, 229, 255, 0.1)",
                "0 0 14px rgba(0, 229, 255, 0.35)",
                "0 0 6px rgba(0, 229, 255, 0.1)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            style={{
              fontSize: "clamp(13px, 1.3vw, 20px)",
              color: "#fff",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {stat.value}
          </motion.span>
          <span
            style={{
              fontSize: "clamp(6px, 0.5vw, 9px)",
              color: "rgba(140, 200, 255, 0.5)",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginTop: 4,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Energy Flow Lines — radiating outward from center
   ═══════════════════════════════════════════════ */

function EnergyFlowLines() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
      {/* Horizontal lines — radiating left and right from center */}
      {[38, 50, 62].map((top, i) => (
        <div key={`h-${i}`}>
          {/* Left ray — center to left */}
          <div
            className="absolute overflow-hidden"
            style={{
              top: `${top}%`,
              left: "10%",
              width: "35%",
              height: 1,
              background: "rgba(0, 229, 255, 0.05)",
            }}
          >
            <motion.div
              animate={{ x: ["0%", "-120%"] }}
              transition={{
                duration: 3.5 + i,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.6,
              }}
              style={{
                width: "30%",
                height: "100%",
                background:
                  "linear-gradient(270deg, rgba(0, 229, 255, 0.45), transparent)",
                boxShadow: "0 0 8px rgba(0, 229, 255, 0.2)",
              }}
            />
          </div>
          {/* Right ray — center to right */}
          <div
            className="absolute overflow-hidden"
            style={{
              top: `${top}%`,
              right: "10%",
              width: "35%",
              height: 1,
              background: "rgba(0, 229, 255, 0.05)",
            }}
          >
            <motion.div
              animate={{ x: ["0%", "120%"] }}
              transition={{
                duration: 3.5 + i,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.6 + 0.3,
              }}
              style={{
                width: "30%",
                height: "100%",
                background:
                  "linear-gradient(90deg, rgba(0, 229, 255, 0.45), transparent)",
                boxShadow: "0 0 8px rgba(0, 229, 255, 0.2)",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Reactor CTA Buttons — primary with strong glow pulse
   ═══════════════════════════════════════════════ */

function ReactorCTAPrimary() {
  return (
    <motion.a
      href="https://staking.tokamak.network"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.1 }}
      className="relative inline-flex items-center justify-center cursor-pointer"
      style={{
        padding: "clamp(14px, 1.4vw, 20px) clamp(40px, 4vw, 60px)",
        background: "linear-gradient(180deg, rgba(0, 40, 60, 0.95) 0%, rgba(5, 25, 50, 0.95) 100%)",
        border: "2px solid rgba(0, 229, 255, 0.9)",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "clamp(12px, 1.1vw, 16px)",
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
      {/* Pulsing glow overlay */}
      <span
        className="absolute pointer-events-none"
        style={{
          inset: "-10px -20px",
          background:
            "radial-gradient(ellipse at center, rgba(0, 229, 255, 0.5) 0%, rgba(0, 229, 255, 0.15) 50%, transparent 75%)",
          animation: "ctaGlowPulse 2s ease-in-out infinite",
          borderRadius: 8,
        }}
      />
      {/* Corner brackets */}
      {[
        { top: -1, left: -1, borderTop: "2px solid #00e5ff", borderLeft: "2px solid #00e5ff" },
        { top: -1, right: -1, borderTop: "2px solid #00e5ff", borderRight: "2px solid #00e5ff" },
        { bottom: -1, left: -1, borderBottom: "2px solid #00e5ff", borderLeft: "2px solid #00e5ff" },
        { bottom: -1, right: -1, borderBottom: "2px solid #00e5ff", borderRight: "2px solid #00e5ff" },
      ].map((s, i) => (
        <span key={i} className="absolute w-3 h-3 pointer-events-none" style={s as React.CSSProperties} />
      ))}
      <span style={{ position: "relative", zIndex: 1 }}>Stake TON</span>
    </motion.a>
  );
}

function ReactorCTASecondary() {
  return (
    <motion.a
      href="https://dao.tokamak.network"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="relative inline-flex items-center justify-center cursor-pointer"
      style={{
        padding: "clamp(14px, 1.4vw, 20px) clamp(40px, 4vw, 60px)",
        background: "linear-gradient(180deg, rgba(10, 20, 50, 0.9) 0%, rgba(5, 15, 40, 0.9) 100%)",
        border: "2px solid rgba(42, 114, 229, 0.6)",
        fontFamily: "'Orbitron', sans-serif",
        fontSize: "clamp(12px, 1.1vw, 16px)",
        color: "#8cc8ff",
        letterSpacing: "0.18em",
        fontWeight: 700,
        textTransform: "uppercase",
        textDecoration: "none",
        textShadow: "0 0 14px rgba(42, 114, 229, 0.6)",
        boxShadow:
          "0 0 25px rgba(42, 114, 229, 0.2), inset 0 1px 0 rgba(140, 200, 255, 0.1)",
        transition: "all 0.3s ease",
      }}
      whileHover={{
        boxShadow:
          "0 0 35px rgba(42, 114, 229, 0.35), inset 0 0 30px rgba(42, 114, 229, 0.1)",
        borderColor: "rgba(42, 114, 229, 0.9)",
      }}
    >
      {/* Corner brackets */}
      {[
        { top: -1, left: -1, borderTop: "2px solid rgba(42, 114, 229, 0.8)", borderLeft: "2px solid rgba(42, 114, 229, 0.8)" },
        { top: -1, right: -1, borderTop: "2px solid rgba(42, 114, 229, 0.8)", borderRight: "2px solid rgba(42, 114, 229, 0.8)" },
        { bottom: -1, left: -1, borderBottom: "2px solid rgba(42, 114, 229, 0.8)", borderLeft: "2px solid rgba(42, 114, 229, 0.8)" },
        { bottom: -1, right: -1, borderBottom: "2px solid rgba(42, 114, 229, 0.8)", borderRight: "2px solid rgba(42, 114, 229, 0.8)" },
      ].map((s, i) => (
        <span key={i} className="absolute w-3 h-3 pointer-events-none" style={s as React.CSSProperties} />
      ))}
      <span style={{ position: "relative", zIndex: 1 }}>Vote Now</span>
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════
   Bottom Control Panel — stats row + CTA buttons
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
        padding: "clamp(28px, 3.5vh, 50px) clamp(20px, 4vw, 60px) clamp(16px, 2vh, 28px)",
      }}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Governance stats compact pillars */}
        <GovernanceStatsRow />
        {/* CTA buttons */}
        <div className="flex items-center gap-4">
          <ReactorCTAPrimary />
          <ReactorCTASecondary />
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Mobile Overlay — simplified, flat, no 3D
   ═══════════════════════════════════════════════ */

function GovernanceStakingMobileOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-5 py-8 gap-5 overflow-y-auto">
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_KEYFRAMES }} />

      {/* Title */}
      <div className="flex flex-col items-center gap-1">
        <div
          style={{
            fontSize: 9,
            color: "rgba(0, 229, 255, 0.5)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          Reactor Core
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#fff",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textShadow: "0 0 14px rgba(0, 229, 255, 0.4)",
            textAlign: "center",
          }}
        >
          Governance &amp; Staking
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#22c55e",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.12em",
          }}
        >
          ● REACTOR ONLINE
        </div>
      </div>

      {/* Reactor Log — proposals */}
      <div className="w-full max-w-xs flex flex-col gap-2">
        <div
          style={{
            fontSize: 9,
            color: "rgba(0, 229, 255, 0.7)",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 2,
          }}
        >
          Reactor Log
        </div>
        {PROPOSALS.map((proposal) => {
          const isActive = proposal.status === "active";
          return (
            <div
              key={proposal.id}
              className="relative flex items-center justify-between px-3 py-2"
              style={{
                background: isActive
                  ? "rgba(0, 10, 20, 0.95)"
                  : "rgba(5, 10, 20, 0.9)",
                border: isActive
                  ? "1px solid rgba(0, 229, 255, 0.3)"
                  : "1px solid rgba(42, 114, 229, 0.2)",
                minHeight: 44,
              }}
            >
              <div
                className="absolute pointer-events-none"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: isActive
                    ? "rgba(0, 229, 255, 0.5)"
                    : "rgba(42, 114, 229, 0.3)",
                }}
              />
              <div className="flex flex-col gap-0.5">
                <span
                  style={{
                    fontSize: 9,
                    color: isActive ? "#00e5ff" : "rgba(0, 229, 255, 0.45)",
                    fontFamily: "'Share Tech Mono', monospace",
                    letterSpacing: "0.12em",
                  }}
                >
                  {proposal.id}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255, 255, 255, 0.85)",
                    fontFamily: "'Share Tech Mono', monospace",
                  }}
                >
                  {proposal.title}
                </span>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span
                  style={{
                    fontSize: 15,
                    color: "#fff",
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700,
                    textShadow: isActive ? "0 0 10px rgba(0, 229, 255, 0.6)" : "none",
                  }}
                >
                  {proposal.votes}
                </span>
                <span
                  style={{
                    fontSize: 8,
                    color: isActive ? "#22c55e" : "rgba(140, 200, 255, 0.4)",
                    fontFamily: "'Share Tech Mono', monospace",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {proposal.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Power Output — staking metrics */}
      <div className="w-full max-w-xs flex flex-col gap-2">
        <div
          style={{
            fontSize: 9,
            color: "rgba(0, 229, 255, 0.7)",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: 2,
          }}
        >
          Power Output
        </div>
        <div className="grid grid-cols-3 gap-2">
          {STAKING_METRICS.map((metric) => (
            <div
              key={metric.label}
              className="relative flex flex-col items-center justify-center py-3"
              style={{
                background: "rgba(5, 10, 20, 0.95)",
                border: "1px solid rgba(42, 114, 229, 0.25)",
                minHeight: 60,
              }}
            >
              <div
                className="absolute pointer-events-none"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "rgba(0, 229, 255, 0.35)",
                }}
              />
              <div
                style={{
                  fontSize: 16,
                  color: "#fff",
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  lineHeight: 1,
                  textShadow: "0 0 10px rgba(0, 229, 255, 0.4)",
                }}
              >
                {metric.value}
              </div>
              {metric.suffix && (
                <div
                  style={{
                    fontSize: 8,
                    color: "rgba(0, 229, 255, 0.6)",
                    fontFamily: "'Share Tech Mono', monospace",
                    letterSpacing: "0.08em",
                    marginTop: 2,
                  }}
                >
                  {metric.suffix}
                </div>
              )}
              <div
                style={{
                  fontSize: 7,
                  color: "rgba(122, 140, 168, 0.8)",
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginTop: 3,
                  textAlign: "center",
                  lineHeight: 1.2,
                  padding: "0 4px",
                }}
              >
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex items-center gap-3">
        <a
          href="https://staking.tokamak.network"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center justify-center"
          style={{
            padding: "12px 24px",
            minHeight: 44,
            background:
              "linear-gradient(180deg, rgba(0, 40, 60, 0.9) 0%, rgba(5, 25, 50, 0.9) 100%)",
            border: "1px solid rgba(0, 229, 255, 0.6)",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 11,
            color: "#fff",
            letterSpacing: "0.18em",
            fontWeight: 700,
            textTransform: "uppercase",
            textDecoration: "none",
            textShadow: "0 0 10px rgba(0, 229, 255, 0.8)",
            boxShadow: "0 0 20px rgba(0, 229, 255, 0.2)",
          }}
        >
          Stake TON
        </a>
        <a
          href="https://dao.tokamak.network"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center"
          style={{
            padding: "12px 24px",
            minHeight: 44,
            background:
              "linear-gradient(180deg, rgba(10, 20, 50, 0.9) 0%, rgba(5, 15, 40, 0.9) 100%)",
            border: "1px solid rgba(42, 114, 229, 0.5)",
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 11,
            color: "#8cc8ff",
            letterSpacing: "0.18em",
            fontWeight: 700,
            textTransform: "uppercase",
            textDecoration: "none",
            textShadow: "0 0 8px rgba(42, 114, 229, 0.5)",
          }}
        >
          Vote Now
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Export — Governance & Staking Overlay
   ═══════════════════════════════════════════════ */

export default function GovernanceStakingOverlay() {
  return (
    <div className="absolute inset-0">
      {/* ── Mobile layout (below md) ── */}
      <div className="block md:hidden w-full h-full">
        <GovernanceStakingMobileOverlay />
      </div>

      {/* ── Desktop layout (md and above) ── */}
      <div className="hidden md:block w-full h-full">
        <div className="absolute inset-0">
          <HeaderBar />

          {/* 3D Token Vortex — center focal element */}
          <LazyWebGL style={{ position: "absolute", inset: 0 }}>
            <TokenVortex />
          </LazyWebGL>

          {/* Energy flow lines — radiating from center */}
          <EnergyFlowLines />

          {/* Concentric pulse rings — energy radiating outward from reactor core */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`pulse-${i}`}
                className="absolute"
                style={{
                  left: "50%",
                  top: "46%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  border: "1px solid rgba(0, 229, 255, 0.4)",
                  boxShadow:
                    "0 0 8px rgba(0, 229, 255, 0.15), inset 0 0 8px rgba(0, 229, 255, 0.05)",
                }}
                animate={{
                  width: ["8%", "70%"],
                  height: ["5%", "55%"],
                  opacity: [0.6, 0],
                  borderColor: [
                    "rgba(0, 229, 255, 0.4)",
                    "rgba(0, 229, 255, 0)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: i * 1.3,
                }}
              />
            ))}
          </div>

          {/* Occlusion layer — same bg image on top of particles, center masked out.
              Pillars and structural elements cover particles for depth/parallax effect. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 7,
              maskImage:
                "radial-gradient(ellipse 38% 40% at 50% 46%, transparent 50%, black 68%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 38% 40% at 50% 46%, transparent 50%, black 68%)",
            }}
          >
            <Image
              src="/tower/floor-governance-staking.png"
              alt=""
              fill
              className="object-cover md:object-contain"
              sizes="(max-width: 1400px) 100vw, 1400px"
            />
          </div>

          {/* Left — Reactor Log (proposal cascade cards) */}
          <div
            className="absolute z-10 flex flex-col"
            style={{
              left: "clamp(16px, 5vw, 70px)",
              top: "46%",
              transform: "translateY(-50%)",
              gap: "clamp(6px, 0.7vw, 10px)",
            }}
          >
            {PROPOSALS.map((proposal, i) => (
              <ReactorLogCard key={proposal.id} proposal={proposal} index={i} />
            ))}
          </div>

          {/* Right — Power Output (staking cascade cards) */}
          <div
            className="absolute z-10 flex flex-col"
            style={{
              right: "clamp(16px, 5vw, 70px)",
              top: "46%",
              transform: "translateY(-50%)",
              gap: "clamp(6px, 0.7vw, 10px)",
            }}
          >
            {STAKING_METRICS.map((metric, i) => (
              <PowerOutputCard key={metric.label} metric={metric} index={i} />
            ))}
          </div>

          {/* Bottom — governance stats + CTA buttons */}
          <BottomControlPanel />
        </div>
      </div>
    </div>
  );
}
