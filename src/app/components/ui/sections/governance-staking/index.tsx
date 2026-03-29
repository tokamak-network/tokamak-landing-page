"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const ParticleBridge = dynamic(() => import("./ParticleBridge"), { ssr: false });

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
      style={{ top: "clamp(30px, 6vh, 60px)", left: 0, right: 0 }}
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
        Governance & Staking
        <span style={{ margin: "0 8px", opacity: 0.3 }}>|</span>
        Network Security
        <span style={{ margin: "0 8px", opacity: 0.3 }}>|</span>
        Status: <span style={{ color: "#22c55e" }}>Active</span>
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Section Label with animated scan line
   ═══════════════════════════════════════════════ */

function SectionLabel({
  label,
  side,
}: {
  label: string;
  side: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="absolute z-20"
      style={{
        top: "clamp(60px, 13vh, 110px)",
        ...(side === "left"
          ? { left: "clamp(30px, 8vw, 120px)" }
          : { right: "clamp(30px, 8vw, 120px)" }),
      }}
    >
      <span
        style={{
          fontSize: "clamp(10px, 0.9vw, 14px)",
          color: "rgba(0, 229, 255, 0.7)",
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 700,
          textShadow: "0 0 12px rgba(0, 229, 255, 0.4)",
        }}
      >
        {label}
      </span>
      {/* Animated scan line */}
      <div
        className="relative overflow-hidden"
        style={{
          marginTop: 6,
          height: 1,
          width: "clamp(60px, 8vw, 120px)",
          background: "rgba(0, 229, 255, 0.15)",
        }}
      >
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.8), transparent)",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Floating Proposal Card — with hover bob animation
   ═══════════════════════════════════════════════ */

const PROPOSALS = [
  { id: "TIP-42", title: "L2 Fee Adjustment", status: "active", votes: "67%" },
  { id: "TIP-41", title: "Reward Distribution", status: "passed", votes: "89%" },
  { id: "TIP-40", title: "Protocol Upgrade v3", status: "passed", votes: "94%" },
] as const;

function ProposalCard({
  proposal,
  index,
}: {
  proposal: (typeof PROPOSALS)[number];
  index: number;
}) {
  const CHAMFER = 8;
  const isActive = proposal.status === "active";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateZ: -4 + index * 4 }}
      animate={{
        opacity: 1,
        y: [0, -4, 0],
        rotateZ: -4 + index * 4,
      }}
      transition={{
        opacity: { duration: 0.5, delay: 0.6 + index * 0.15 },
        y: {
          duration: 3 + index * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.3,
        },
        rotateZ: { duration: 0.5, delay: 0.6 + index * 0.15 },
      }}
      className="relative"
      style={{
        width: "clamp(130px, 12vw, 180px)",
        padding: "clamp(10px, 1vw, 14px)",
        background: isActive
          ? "linear-gradient(180deg, rgba(0, 229, 255, 0.12) 0%, rgba(4, 14, 28, 0.9) 100%)"
          : "linear-gradient(180deg, rgba(4, 14, 28, 0.85) 0%, rgba(2, 8, 18, 0.8) 100%)",
        clipPath: `polygon(0 0, calc(100% - ${CHAMFER}px) 0, 100% ${CHAMFER}px, 100% 100%, ${CHAMFER}px 100%, 0 calc(100% - ${CHAMFER}px))`,
        backdropFilter: "blur(10px)",
        boxShadow: isActive
          ? "0 2px 20px rgba(0, 229, 255, 0.15), inset 0 1px 0 rgba(0, 229, 255, 0.25)"
          : "0 2px 20px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(0, 229, 255, 0.1)",
      }}
    >
      {/* Pulsing top accent line for active proposals */}
      <motion.div
        className="absolute pointer-events-none"
        animate={
          isActive
            ? { opacity: [0.4, 0.8, 0.4] }
            : {}
        }
        transition={
          isActive
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
        style={{
          top: -1,
          left: 0,
          right: CHAMFER,
          height: 2,
          background: isActive
            ? "rgba(0, 229, 255, 0.6)"
            : "rgba(0, 229, 255, 0.25)",
          boxShadow: isActive
            ? "0 0 12px rgba(0, 229, 255, 0.5)"
            : "0 0 6px rgba(0, 229, 255, 0.2)",
        }}
      />

      {/* ID */}
      <div
        style={{
          fontSize: "clamp(7px, 0.55vw, 9px)",
          color: isActive ? "#00e5ff" : "rgba(0, 229, 255, 0.5)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.15em",
          fontWeight: 700,
          textShadow: isActive ? "0 0 8px rgba(0, 229, 255, 0.4)" : "none",
        }}
      >
        {proposal.id}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "clamp(9px, 0.75vw, 12px)",
          color: "rgba(255, 255, 255, 0.85)",
          fontFamily: "'Share Tech Mono', monospace",
          marginTop: 4,
          lineHeight: 1.3,
        }}
      >
        {proposal.title}
      </div>

      {/* Status + Votes */}
      <div
        className="flex items-center justify-between"
        style={{ marginTop: 8 }}
      >
        <span
          style={{
            fontSize: "clamp(6px, 0.5vw, 8px)",
            color: isActive ? "#22c55e" : "rgba(140, 200, 255, 0.4)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {proposal.status}
        </span>
        <span
          style={{
            fontSize: "clamp(10px, 0.85vw, 14px)",
            color: "#fff",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            textShadow: "0 0 8px rgba(0, 229, 255, 0.3)",
          }}
        >
          {proposal.votes}
        </span>
      </div>

      {/* Animated vote bar */}
      <div
        style={{
          marginTop: 6,
          height: 2,
          background: "rgba(0, 229, 255, 0.1)",
          borderRadius: 1,
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: proposal.votes }}
          transition={{ duration: 1.5, delay: 0.8 + index * 0.15, ease: "easeOut" }}
          style={{
            height: "100%",
            background: isActive
              ? "linear-gradient(90deg, #00e5ff, #2A72E5)"
              : "rgba(0, 229, 255, 0.3)",
            borderRadius: 1,
            boxShadow: isActive
              ? "0 0 8px rgba(0, 229, 255, 0.4)"
              : "none",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Governance Seal — rotating mandala beneath cards
   ═══════════════════════════════════════════════ */

function GovernanceSeal() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="absolute z-[3] pointer-events-none"
      style={{
        left: "clamp(20px, 5vw, 80px)",
        top: "50%",
        transform: "translateY(-50%)",
        width: "clamp(180px, 18vw, 280px)",
        height: "clamp(180px, 18vw, 280px)",
      }}
    >
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full"
        style={{
          border: "1px solid rgba(0, 229, 255, 0.15)",
          boxShadow: "0 0 20px rgba(0, 229, 255, 0.05)",
        }}
      />

      {/* Middle counter-rotating ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full"
        style={{
          inset: "12%",
          border: "1px solid rgba(0, 229, 255, 0.12)",
        }}
      >
        {/* Tick marks */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              width: 1,
              height: "8%",
              background: `rgba(0, 229, 255, ${i % 3 === 0 ? 0.4 : 0.15})`,
              transformOrigin: "50% 0",
              transform: `translate(-50%, 0) rotate(${i * 30}deg) translateY(-${50}%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Inner pulsing ring */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{
          inset: "25%",
          border: "1px solid rgba(0, 229, 255, 0.2)",
          boxShadow:
            "0 0 30px rgba(0, 229, 255, 0.08), inset 0 0 30px rgba(0, 229, 255, 0.04)",
        }}
      />

      {/* Center dot */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute rounded-full"
        style={{
          inset: "46%",
          background: "rgba(0, 229, 255, 0.5)",
          boxShadow: "0 0 15px rgba(0, 229, 255, 0.4)",
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Crystal Hex Cell — pulsing staking indicator
   ═══════════════════════════════════════════════ */

function CrystalHexCell({
  index,
  brightness,
}: {
  index: number;
  brightness: "high" | "medium" | "low";
}) {
  const colors = {
    high: { bg: "rgba(0, 229, 255, 0.25)", border: "rgba(0, 229, 255, 0.5)", glow: "rgba(0, 229, 255, 0.3)" },
    medium: { bg: "rgba(0, 139, 158, 0.15)", border: "rgba(0, 139, 158, 0.35)", glow: "rgba(0, 139, 158, 0.15)" },
    low: { bg: "rgba(10, 20, 35, 0.6)", border: "rgba(0, 229, 255, 0.1)", glow: "none" },
  };
  const c = colors[brightness];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: [1, brightness === "high" ? 1.05 : 1.02, 1],
      }}
      transition={{
        opacity: { duration: 0.4, delay: 0.4 + index * 0.06 },
        scale: {
          duration: 2 + index * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.2,
        },
      }}
      style={{
        width: "clamp(32px, 3vw, 46px)",
        height: "clamp(36px, 3.4vw, 52px)",
        background: c.bg,
        clipPath:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        position: "relative",
        boxShadow: brightness !== "low" ? `0 0 12px ${c.glow}` : "none",
      }}
    >
      {/* Inner crystal glow */}
      {brightness !== "low" && (
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{
            duration: 1.5 + index * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.15,
          }}
          className="absolute"
          style={{
            inset: "15%",
            background: `radial-gradient(ellipse at center, ${c.border}, transparent)`,
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        />
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Crystal Matrix — honeycomb grid
   ═══════════════════════════════════════════════ */

const CRYSTAL_GRID: ("high" | "medium" | "low")[][] = [
  ["high", "medium", "high", "low", "high"],
  ["medium", "high", "low", "high", "medium"],
  ["high", "low", "high", "medium", "high"],
  ["low", "high", "medium", "high", "low"],
];

function CrystalMatrix() {
  return (
    <div
      className="absolute z-10"
      style={{
        right: "clamp(20px, 5vw, 80px)",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <div className="flex flex-col items-end" style={{ gap: "clamp(2px, 0.2vw, 4px)" }}>
        {CRYSTAL_GRID.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex"
            style={{
              gap: "clamp(2px, 0.2vw, 4px)",
              marginRight: rowIdx % 2 === 1 ? "clamp(16px, 1.5vw, 23px)" : 0,
            }}
          >
            {row.map((brightness, colIdx) => (
              <CrystalHexCell
                key={`${rowIdx}-${colIdx}`}
                index={rowIdx * 5 + colIdx}
                brightness={brightness}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Staking Metric — with animated value counter
   ═══════════════════════════════════════════════ */

const STAKING_METRICS = [
  { label: "Total Staked", value: "42.8M", suffix: "TON" },
  { label: "Staking APR", value: "8.2", suffix: "%" },
  { label: "Validators", value: "127", suffix: "" },
] as const;

function StakingMetric({
  metric,
  index,
}: {
  metric: (typeof STAKING_METRICS)[number];
  index: number;
}) {
  const CHAMFER = 10;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
      className="relative"
      style={{
        width: "clamp(120px, 11vw, 170px)",
        padding: "clamp(10px, 1vw, 14px) clamp(12px, 1.1vw, 16px)",
        background:
          "linear-gradient(180deg, rgba(4, 14, 28, 0.85) 0%, rgba(2, 8, 18, 0.8) 100%)",
        clipPath: `polygon(0 0, calc(100% - ${CHAMFER}px) 0, 100% ${CHAMFER}px, 100% 100%, 0 100%)`,
        backdropFilter: "blur(10px)",
        boxShadow:
          "0 2px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 229, 255, 0.06), inset 0 1px 0 rgba(0, 229, 255, 0.15)",
      }}
    >
      {/* Animated top accent with sweep */}
      <div className="absolute pointer-events-none overflow-hidden" style={{ top: -1, left: 0, right: CHAMFER, height: 2 }}>
        <div style={{ width: "100%", height: "100%", background: "rgba(0, 229, 255, 0.3)" }} />
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "40%",
            height: "100%",
            background: "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.9), transparent)",
            boxShadow: "0 0 10px rgba(0, 229, 255, 0.6)",
          }}
        />
      </div>

      {/* Label */}
      <div
        className="uppercase font-bold tracking-wider"
        style={{
          fontSize: "clamp(7px, 0.6vw, 10px)",
          color: "rgba(0, 229, 255, 0.7)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.14em",
          paddingBottom: "clamp(4px, 0.4vw, 6px)",
          marginBottom: "clamp(4px, 0.4vw, 6px)",
          borderBottom: "1px solid rgba(0, 229, 255, 0.1)",
          textShadow: "0 0 6px rgba(0, 229, 255, 0.3)",
        }}
      >
        {metric.label}
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <motion.span
          className="font-bold"
          animate={{ textShadow: [
            "0 0 16px rgba(0, 229, 255, 0.15)",
            "0 0 24px rgba(0, 229, 255, 0.35)",
            "0 0 16px rgba(0, 229, 255, 0.15)",
          ]}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
          style={{
            fontSize: "clamp(16px, 1.8vw, 28px)",
            color: "#fff",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: "0.02em",
            lineHeight: 1.1,
          }}
        >
          {metric.value}
        </motion.span>
        {metric.suffix && (
          <span
            style={{
              fontSize: "clamp(8px, 0.7vw, 11px)",
              color: "rgba(0, 229, 255, 0.5)",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.1em",
            }}
          >
            {metric.suffix}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Governance Stats Row
   ═══════════════════════════════════════════════ */

function GovernanceStats() {
  const stats = [
    { label: "Active Proposals", value: "3" },
    { label: "Total Voters", value: "2,841" },
    { label: "Quorum", value: "45%" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.0 }}
      className="flex gap-4"
    >
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex flex-col items-center">
          <motion.span
            animate={{
              textShadow: [
                "0 0 6px rgba(0, 229, 255, 0.1)",
                "0 0 14px rgba(0, 229, 255, 0.3)",
                "0 0 6px rgba(0, 229, 255, 0.1)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            style={{
              fontSize: "clamp(14px, 1.4vw, 22px)",
              color: "#fff",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
            }}
          >
            {stat.value}
          </motion.span>
          <span
            style={{
              fontSize: "clamp(6px, 0.5vw, 9px)",
              color: "rgba(140, 200, 255, 0.5)",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 2,
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
   CTA Buttons
   ═══════════════════════════════════════════════ */

function CTAButton({
  label,
  href,
  variant = "primary",
  delay,
}: {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
  delay: number;
}) {
  const isPrimary = variant === "primary";

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative inline-flex items-center justify-center cursor-pointer"
      style={{
        padding: "clamp(8px, 0.8vw, 12px) clamp(20px, 2.2vw, 36px)",
        background: isPrimary
          ? "linear-gradient(180deg, rgba(0, 229, 255, 0.12) 0%, rgba(0, 229, 255, 0.04) 100%)"
          : "linear-gradient(180deg, rgba(42, 114, 229, 0.1) 0%, rgba(42, 114, 229, 0.03) 100%)",
        border: isPrimary
          ? "1px solid rgba(0, 229, 255, 0.4)"
          : "1px solid rgba(42, 114, 229, 0.3)",
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "clamp(9px, 0.75vw, 12px)",
        color: isPrimary ? "#00e5ff" : "#8cc8ff",
        letterSpacing: "0.18em",
        fontWeight: 700,
        textTransform: "uppercase",
        textDecoration: "none",
        textShadow: isPrimary
          ? "0 0 10px rgba(0, 229, 255, 0.5)"
          : "0 0 8px rgba(42, 114, 229, 0.3)",
        boxShadow: isPrimary
          ? "0 0 20px rgba(0, 229, 255, 0.1), inset 0 0 20px rgba(0, 229, 255, 0.05)"
          : "0 0 15px rgba(42, 114, 229, 0.08)",
        transition: "all 0.3s ease",
      }}
      whileHover={{
        boxShadow: isPrimary
          ? "0 0 30px rgba(0, 229, 255, 0.25), inset 0 0 30px rgba(0, 229, 255, 0.1)"
          : "0 0 25px rgba(42, 114, 229, 0.2), inset 0 0 20px rgba(42, 114, 229, 0.08)",
        borderColor: isPrimary
          ? "rgba(0, 229, 255, 0.7)"
          : "rgba(42, 114, 229, 0.6)",
      }}
    >
      {/* Corner brackets */}
      {[
        "top-0 left-0 border-t border-l",
        "top-0 right-0 border-t border-r",
        "bottom-0 left-0 border-b border-l",
        "bottom-0 right-0 border-b border-r",
      ].map((pos) => (
        <span
          key={pos}
          className={`absolute w-2 h-2 pointer-events-none ${pos}`}
          style={{
            borderColor: isPrimary
              ? "rgba(0, 229, 255, 0.7)"
              : "rgba(42, 114, 229, 0.5)",
            borderWidth: 1.5,
          }}
        />
      ))}
      {label}
    </motion.a>
  );
}

/* ═══════════════════════════════════════════════
   Energy Flow Lines — CSS animated connection
   ═══════════════════════════════════════════════ */

function EnergyFlowLines() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
      {[35, 50, 65].map((top, i) => (
        <div
          key={i}
          className="absolute overflow-hidden"
          style={{
            top: `${top}%`,
            left: "20%",
            right: "20%",
            height: 1,
            background: "rgba(0, 229, 255, 0.05)",
          }}
        >
          <motion.div
            animate={{ x: ["100%", "-100%"] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.7,
            }}
            style={{
              width: "30%",
              height: "100%",
              background:
                "linear-gradient(270deg, transparent, rgba(0, 229, 255, 0.4), transparent)",
              boxShadow: "0 0 8px rgba(0, 229, 255, 0.2)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Export — Governance & Staking Overlay
   ═══════════════════════════════════════════════ */

export default function GovernanceStakingOverlay() {
  return (
    <div className="absolute inset-0">
      <HeaderBar />

      {/* Section labels */}
      <SectionLabel label="Governance" side="left" />
      <SectionLabel label="Staking" side="right" />

      {/* 3D Particle Bridge — center focal element */}
      <ParticleBridge />

      {/* CSS Energy flow lines */}
      <EnergyFlowLines />

      {/* Governance seal — rotating mandala */}
      <GovernanceSeal />

      {/* Left — Floating proposal cards */}
      <div
        className="absolute z-10 flex flex-col items-center"
        style={{
          left: "clamp(30px, 8vw, 120px)",
          top: "46%",
          transform: "translateY(-50%)",
          gap: "clamp(6px, 0.6vw, 10px)",
        }}
      >
        <div
          className="flex flex-col"
          style={{ gap: "clamp(6px, 0.6vw, 10px)" }}
        >
          {PROPOSALS.map((proposal, i) => (
            <ProposalCard key={proposal.id} proposal={proposal} index={i} />
          ))}
        </div>
        <div style={{ marginTop: "clamp(8px, 1vw, 16px)" }}>
          <GovernanceStats />
        </div>
      </div>

      {/* Right — Crystal matrix + staking metrics */}
      <div
        className="absolute z-10 flex items-center"
        style={{
          right: "clamp(16px, 4vw, 60px)",
          top: "46%",
          transform: "translateY(-50%)",
          gap: "clamp(10px, 1.2vw, 20px)",
        }}
      >
        {/* Staking metrics */}
        <div className="flex flex-col" style={{ gap: "clamp(8px, 1vw, 14px)" }}>
          {STAKING_METRICS.map((metric, i) => (
            <StakingMetric key={metric.label} metric={metric} index={i} />
          ))}
        </div>

        {/* Crystal hex grid */}
        <CrystalMatrix />
      </div>

      {/* Bottom CTAs */}
      <div
        className="absolute z-10 flex items-center justify-center gap-4"
        style={{ left: 0, right: 0, bottom: "clamp(30px, 6vh, 60px)" }}
      >
        <CTAButton
          label="Stake TON"
          href="https://staking.tokamak.network"
          variant="primary"
          delay={1.2}
        />
        <CTAButton
          label="Vote Now"
          href="https://dao.tokamak.network"
          variant="secondary"
          delay={1.3}
        />
      </div>
    </div>
  );
}
