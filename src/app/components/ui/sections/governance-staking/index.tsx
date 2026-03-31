"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";


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
   Types for live on-chain data
   ═══════════════════════════════════════════════ */

interface Proposal {
  id: string;
  title: string;
  status: string;
  votes: string;
  createdDate?: string | null;
  votingStart?: string | null;
  votingEnd?: string | null;
  totalVotes?: number;
  rawResult?: string;
}

interface StakingMetric {
  label: string;
  value: string;
  suffix: string;
}

interface GovStat {
  label: string;
  value: string;
}

interface CommitteeMember {
  name: string;
  address: string;
  seat: number;
  joinedAt: string | null;
}

interface TreasuryData {
  ton: number;
  wton: number;
  totalTonEquivalent: number;
}

/* ── Fallback data (shown while loading) ── */

const FALLBACK_PROPOSALS: Proposal[] = [
  { id: "#15", title: "Agenda 15", status: "notice", votes: "0%" },
  { id: "#14", title: "Agenda 14", status: "passed", votes: "67%" },
  { id: "#13", title: "Agenda 13", status: "ended", votes: "0%" },
];

const FALLBACK_STAKING: StakingMetric[] = [
  { label: "Total Staked", value: "—", suffix: "TON" },
  { label: "Staking APR", value: "—", suffix: "%" },
  { label: "Operators", value: "—", suffix: "" },
];

const FALLBACK_GOV: GovStat[] = [
  { label: "Total Agendas", value: "—" },
  { label: "Quorum", value: "—" },
  { label: "Committee", value: "—" },
];

const FALLBACK_COMMITTEE: CommitteeMember[] = [
  { name: "—", address: "", seat: 0, joinedAt: null },
  { name: "—", address: "", seat: 1, joinedAt: null },
  { name: "—", address: "", seat: 2, joinedAt: null },
];

const FALLBACK_TREASURY: TreasuryData = { ton: 0, wton: 0, totalTonEquivalent: 0 };

/* ═══════════════════════════════════════════════
   Format large numbers (e.g. 28935300 → "28.9M")
   ═══════════════════════════════════════════════ */

function formatStaked(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

/* ═══════════════════════════════════════════════
   Hook — fetch live governance & staking data
   ═══════════════════════════════════════════════ */

function useGovernanceStakingData() {
  const [proposals, setProposals] = useState<Proposal[]>(FALLBACK_PROPOSALS);
  const [stakingMetrics, setStakingMetrics] = useState<StakingMetric[]>(FALLBACK_STAKING);
  const [govStats, setGovStats] = useState<GovStat[]>(FALLBACK_GOV);
  const [committee, setCommittee] = useState<CommitteeMember[]>(FALLBACK_COMMITTEE);
  const [treasury, setTreasury] = useState<TreasuryData>(FALLBACK_TREASURY);
  const [totalSupply, setTotalSupply] = useState(0);
  const [totalStaked, setTotalStaked] = useState(0);
  const [seigPerBlock, setSeigPerBlock] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/governance-staking", { cache: "no-store" });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();

        if (cancelled) return;

        // Staking metrics
        setStakingMetrics([
          { label: "Total Staked", value: formatStaked(data.staking.totalStaked), suffix: "TON" },
          { label: "Staking APR", value: data.staking.apr.toFixed(1), suffix: "%" },
          { label: "Operators", value: String(data.staking.operatorCount), suffix: "" },
        ]);
        setTotalSupply(data.staking.totalSupply);
        setTotalStaked(data.staking.totalStaked);
        setSeigPerBlock(data.staking.seigPerBlock ?? 0);

        // Proposals (with timestamps)
        setProposals(
          data.governance.proposals.map((p: Proposal) => ({
            id: p.id,
            title: p.title,
            status: p.status,
            votes: p.votes,
            createdDate: p.createdDate,
            votingStart: p.votingStart,
            votingEnd: p.votingEnd,
            totalVotes: p.totalVotes,
            rawResult: p.rawResult,
          }))
        );

        // Gov stats
        setGovStats([
          { label: "Total Agendas", value: String(data.governance.totalAgendas) },
          { label: "Quorum", value: `${data.governance.quorum}/${data.governance.maxMember}` },
          { label: "Committee", value: String(data.governance.maxMember) },
        ]);

        // Committee members
        if (data.committee) setCommittee(data.committee);

        // Treasury
        if (data.treasury) setTreasury(data.treasury);
      } catch (err) {
        console.error("[GovernanceStaking] Failed to fetch live data:", err);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { proposals, stakingMetrics, govStats, committee, treasury, totalSupply, totalStaked, seigPerBlock };
}

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
   DAO Modular Tiles — Style 08
   Treasury tile + Committee tiles + Agenda tiles
   ═══════════════════════════════════════════════ */

const TILE_GLOW_KEYFRAMES = `
@keyframes tileGlow {
  0%, 100% { box-shadow: 0 0 6px rgba(0,229,255,0.12); }
  50% { box-shadow: 0 0 16px rgba(0,229,255,0.35); }
}
@keyframes dotPulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
`;

function formatTreasury(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

function formatJoinLabel(joinedAt: string | null): string {
  if (!joinedAt) return "Founding";
  const joined = new Date(joinedAt);
  const now = new Date();
  const diffMs = now.getTime() - joined.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 30) return `${diffDays}d`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo`;
  return `${Math.floor(diffDays / 365)}yr`;
}

function agendaStatusColor(status: string): { border: string; text: string; dot: string; label: string } {
  switch (status) {
    case "active":
    case "notice":
      return { border: "rgba(245,158,11,0.2)", text: "rgba(245,158,11,0.8)", dot: "rgba(245,158,11,0.7)", label: status === "notice" ? "NOTICE" : "ACTIVE" };
    case "passed":
      return { border: "rgba(34,197,94,0.15)", text: "rgba(34,197,94,0.7)", dot: "rgba(34,197,94,0.5)", label: "ACCEPTED" };
    case "rejected":
      return { border: "rgba(239,68,68,0.15)", text: "rgba(239,68,68,0.6)", dot: "rgba(239,68,68,0.4)", label: "REJECTED" };
    default:
      return { border: "rgba(140,200,255,0.1)", text: "rgba(140,200,255,0.4)", dot: "rgba(140,200,255,0.3)", label: status.toUpperCase() };
  }
}

function DaoModularTiles({
  treasury,
  committee,
  proposals,
  govStats,
}: {
  treasury: TreasuryData;
  committee: CommitteeMember[];
  proposals: Proposal[];
  govStats: GovStat[];
}) {
  const seigAlloc = govStats.find(s => s.label === "Total Agendas");

  return (
    <div
      className="flex flex-col"
      style={{ gap: "clamp(6px, 0.7vw, 9px)", width: "clamp(260px, 23vw, 360px)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: TILE_GLOW_KEYFRAMES }} />

      {/* ── DAO Category Header ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 0.8vw, 12px)",
          marginBottom: "clamp(3px, 0.4vw, 6px)",
        }}
      >
        <div
          style={{
            fontSize: "clamp(12px, 1.05vw, 17px)",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            color: "rgba(0, 229, 255, 0.8)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textShadow: "0 0 10px rgba(0, 229, 255, 0.3)",
          }}
        >
          Governance
        </div>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "linear-gradient(90deg, rgba(0, 229, 255, 0.3), transparent)",
          }}
        />
      </motion.div>

      {/* Treasury Tile */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative overflow-hidden"
        style={{
          padding: "clamp(14px, 1.3vw, 22px) clamp(16px, 1.5vw, 24px)",
          background: "rgba(0, 10, 25, 0.9)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(0, 229, 255, 0.2)",
          borderRadius: 8,
          animation: "tileGlow 3s ease-in-out infinite",
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <div
              style={{
                fontSize: "clamp(8px, 0.65vw, 11px)",
                color: "rgba(0, 229, 255, 0.5)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              DAO Treasury
            </div>
            <div
              style={{
                fontSize: "clamp(24px, 2.4vw, 36px)",
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 900,
                color: "#fff",
                marginTop: 3,
                textShadow: "0 0 15px rgba(0, 229, 255, 0.5)",
              }}
            >
              {treasury.totalTonEquivalent > 0 ? formatTreasury(treasury.totalTonEquivalent) : "—"}
              <span
                style={{
                  fontSize: "0.4em",
                  color: "rgba(0, 229, 255, 0.5)",
                  marginLeft: 4,
                }}
              >
                TON
              </span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "clamp(18px, 1.8vw, 26px)",
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                color: "rgba(0, 229, 255, 0.7)",
              }}
            >
              50%
            </div>
            <div
              style={{
                fontSize: "clamp(7px, 0.55vw, 10px)",
                color: "rgba(140, 200, 255, 0.35)",
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: "0.1em",
              }}
            >
              SEIG ALLOC
            </div>
          </div>
        </div>
      </motion.div>

      {/* Committee Section Label */}
      <div
        style={{
          fontSize: "clamp(8px, 0.6vw, 11px)",
          color: "rgba(0, 229, 255, 0.4)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginTop: "clamp(3px, 0.3vw, 6px)",
        }}
      >
        Committee · {committee.length}/{committee.length} Active
      </div>

      {/* Committee Member Tiles */}
      <div className="flex" style={{ gap: "clamp(5px, 0.5vw, 8px)" }}>
        {committee.map((member, i) => (
          <motion.div
            key={member.seat}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.55 + i * 0.1 }}
            className="relative overflow-hidden"
            style={{
              flex: 1,
              padding: "clamp(10px, 1vw, 16px)",
              background: "rgba(0, 10, 25, 0.9)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(0, 229, 255, 0.15)",
              borderRadius: 8,
              textAlign: "center",
              animation: `tileGlow 3s ease-in-out infinite ${0.5 + i * 0.5}s`,
            }}
          >
            {/* Avatar circle */}
            <div
              style={{
                width: "clamp(26px, 2.3vw, 36px)",
                height: "clamp(26px, 2.3vw, 36px)",
                margin: "0 auto clamp(5px, 0.5vw, 8px)",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(0, 229, 255, 0.15), rgba(42, 114, 229, 0.15))",
                border: "1px solid rgba(0, 229, 255, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(9px, 0.8vw, 13px)",
                  color: "#00e5ff",
                }}
              >
                ●
              </span>
            </div>
            <div
              style={{
                fontSize: "clamp(10px, 0.85vw, 14px)",
                color: "rgba(255, 255, 255, 0.85)",
                fontFamily: "'Share Tech Mono', monospace",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {member.name}
            </div>
            <div
              style={{
                fontSize: "clamp(7px, 0.55vw, 10px)",
                color: "rgba(140, 200, 255, 0.35)",
                fontFamily: "'Share Tech Mono', monospace",
                marginTop: 3,
              }}
            >
              Seat {member.seat} · {formatJoinLabel(member.joinedAt)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Agenda Section Label */}
      <div
        style={{
          fontSize: "clamp(8px, 0.6vw, 11px)",
          color: "rgba(0, 229, 255, 0.4)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginTop: "clamp(3px, 0.3vw, 6px)",
        }}
      >
        Recent Agendas
      </div>

      {/* Agenda Tiles */}
      <div className="flex" style={{ gap: "clamp(5px, 0.5vw, 8px)" }}>
        {proposals.map((proposal, i) => {
          const sc = agendaStatusColor(proposal.status);
          const isNotice = proposal.status === "notice" || proposal.status === "active";
          return (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
              className="relative overflow-hidden"
              style={{
                flex: 1,
                padding: "clamp(10px, 1vw, 16px)",
                background: `rgba(0, 10, 25, 0.9)`,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: `1px solid ${sc.border}`,
                borderRadius: 8,
              }}
            >
              <div className="flex justify-between items-center" style={{ marginBottom: "clamp(3px, 0.4vw, 6px)" }}>
                <span
                  style={{
                    fontSize: "clamp(12px, 1.05vw, 16px)",
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700,
                    color: sc.text,
                  }}
                >
                  {proposal.id}
                </span>
                <span
                  style={{
                    fontSize: "clamp(7px, 0.55vw, 10px)",
                    color: sc.dot,
                    fontFamily: "'Share Tech Mono', monospace",
                    animation: isNotice ? "dotPulse 2s infinite" : "none",
                  }}
                >
                  {isNotice ? "● " : ""}{sc.label}
                </span>
              </div>
              <div
                style={{
                  fontSize: "clamp(8px, 0.6vw, 11px)",
                  color: "rgba(140, 200, 255, 0.3)",
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                {proposal.createdDate
                  ? new Date(proposal.createdDate).toLocaleDateString("en", { month: "short", year: "numeric" })
                  : "—"}
                {proposal.votingStart && proposal.votingEnd
                  ? ` · ${proposal.totalVotes ?? 0}/3 voted`
                  : " · 0/3 voted"}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Agendas + Quorum summary mini-bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.0 }}
        className="flex items-center justify-between"
        style={{
          padding: "clamp(6px, 0.55vw, 9px) clamp(12px, 1.1vw, 16px)",
          background: "rgba(0, 10, 25, 0.7)",
          border: "1px solid rgba(0, 229, 255, 0.08)",
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontSize: "clamp(8px, 0.6vw, 11px)",
            color: "rgba(140, 200, 255, 0.35)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.1em",
          }}
        >
          {seigAlloc ? `${seigAlloc.value} AGENDAS` : "—"} · QUORUM {govStats.find(s => s.label === "Quorum")?.value ?? "—"}
        </span>
        <a
          href="https://github.com/tokamak-network/TokamakDAO"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "clamp(8px, 0.6vw, 11px)",
            color: "rgba(0, 229, 255, 0.5)",
            fontFamily: "'Share Tech Mono', monospace",
            textDecoration: "none",
            letterSpacing: "0.08em",
          }}
        >
          DAO →
        </a>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Staking Modular Tiles — Option A: Big Number Hero + Gauge
   ═══════════════════════════════════════════════ */

const STAKING_GLOW_KEYFRAMES = `
@keyframes greenGlow {
  0%, 100% { box-shadow: 0 0 6px rgba(34,197,94,0.1); }
  50% { box-shadow: 0 0 16px rgba(34,197,94,0.3); }
}
@keyframes gaugeGrow {
  from { width: 0; }
}
`;

function StakingModularTiles({
  stakingMetrics,
  totalSupply,
  totalStaked,
  seigPerBlock,
}: {
  stakingMetrics: StakingMetric[];
  totalSupply: number;
  totalStaked: number;
  seigPerBlock: number;
}) {
  const aprMetric = stakingMetrics.find(m => m.label === "Staking APR");
  const stakedMetric = stakingMetrics.find(m => m.label === "Total Staked");
  const operatorMetric = stakingMetrics.find(m => m.label === "Operators");
  const stakedRatio = totalSupply > 0 ? ((totalStaked / totalSupply) * 100).toFixed(1) : "0";

  return (
    <div
      className="flex flex-col"
      style={{ gap: "clamp(6px, 0.7vw, 9px)", width: "clamp(260px, 23vw, 360px)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: STAKING_GLOW_KEYFRAMES }} />

      {/* ── Staking Category Header ── */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(8px, 0.8vw, 12px)",
          marginBottom: "clamp(3px, 0.4vw, 6px)",
        }}
      >
        <div
          style={{
            fontSize: "clamp(12px, 1.05vw, 17px)",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            color: "rgba(0, 229, 255, 0.8)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textShadow: "0 0 10px rgba(0, 229, 255, 0.3)",
          }}
        >
          Staking
        </div>
        <div
          style={{
            flex: 1,
            height: 1,
            background: "linear-gradient(90deg, rgba(0, 229, 255, 0.3), transparent)",
          }}
        />
      </motion.div>

      {/* APR Hero Tile */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative overflow-hidden"
        style={{
          padding: "clamp(18px, 1.8vw, 28px) clamp(16px, 1.5vw, 24px)",
          background: "rgba(0, 10, 25, 0.9)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(34, 197, 94, 0.2)",
          borderRadius: 8,
          textAlign: "center",
          animation: "greenGlow 3s ease-in-out infinite",
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: -10,
            left: "50%",
            transform: "translateX(-50%)",
            width: "clamp(150px, 15vw, 220px)",
            height: "clamp(80px, 8vw, 120px)",
            background: "radial-gradient(ellipse, rgba(34, 197, 94, 0.08), transparent)",
          }}
        />
        <div
          style={{
            fontSize: "clamp(8px, 0.65vw, 11px)",
            color: "rgba(34, 197, 94, 0.5)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginBottom: "clamp(6px, 0.5vw, 8px)",
            position: "relative",
            fontFamily: "'Share Tech Mono', monospace",
          }}
        >
          Staking APR
        </div>
        <div
          style={{
            fontSize: "clamp(38px, 3.8vw, 56px)",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            color: "#22c55e",
            textShadow: "0 0 20px rgba(34, 197, 94, 0.6), 0 0 40px rgba(34, 197, 94, 0.3)",
            lineHeight: 1,
            position: "relative",
          }}
        >
          {aprMetric?.value ?? "—"}
          <span
            style={{
              fontSize: "0.38em",
              color: "rgba(34, 197, 94, 0.5)",
            }}
          >
            %
          </span>
        </div>
        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.3), transparent)",
            marginTop: "clamp(10px, 1vw, 16px)",
          }}
        />
      </motion.div>

      {/* Total Staked Tile */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.55 }}
        className="relative overflow-hidden"
        style={{
          padding: "clamp(14px, 1.3vw, 20px) clamp(16px, 1.5vw, 24px)",
          background: "rgba(0, 10, 25, 0.9)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(0, 229, 255, 0.2)",
          borderRadius: 8,
          animation: "tileGlow 3s ease-in-out infinite 0.5s",
        }}
      >
        <div
          style={{
            fontSize: "clamp(8px, 0.65vw, 11px)",
            color: "rgba(0, 229, 255, 0.5)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "'Share Tech Mono', monospace",
            marginBottom: "clamp(3px, 0.4vw, 6px)",
          }}
        >
          Total Staked
        </div>
        <div
          style={{
            fontSize: "clamp(24px, 2.4vw, 34px)",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            color: "#fff",
            textShadow: "0 0 15px rgba(0, 229, 255, 0.5)",
          }}
        >
          {stakedMetric?.value ?? "—"}
          <span
            style={{
              fontSize: "0.4em",
              color: "rgba(0, 229, 255, 0.5)",
              marginLeft: 4,
            }}
          >
            TON
          </span>
        </div>
      </motion.div>

      {/* Staked Ratio Gauge */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.65 }}
        style={{
          padding: "clamp(8px, 0.8vw, 13px) clamp(12px, 1.2vw, 18px)",
          background: "rgba(0, 10, 25, 0.7)",
          border: "1px solid rgba(0, 229, 255, 0.1)",
          borderRadius: 6,
        }}
      >
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: "clamp(4px, 0.4vw, 7px)" }}
        >
          <span
            style={{
              fontSize: "clamp(8px, 0.6vw, 11px)",
              color: "rgba(140, 200, 255, 0.4)",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.1em",
            }}
          >
            STAKED / SUPPLY
          </span>
          <span
            style={{
              fontSize: "clamp(10px, 0.9vw, 14px)",
              color: "rgba(0, 229, 255, 0.6)",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
            }}
          >
            {stakedRatio}%
          </span>
        </div>
        <div
          style={{
            height: "clamp(4px, 0.4vw, 6px)",
            background: "rgba(0, 229, 255, 0.06)",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stakedRatio}%` }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #00e5ff, #2A72E5)",
              borderRadius: 3,
              boxShadow: "0 0 6px rgba(0, 229, 255, 0.5)",
            }}
          />
        </div>
      </motion.div>

      {/* Operators + Seig/Block row */}
      <div className="flex" style={{ gap: "clamp(5px, 0.5vw, 8px)" }}>
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.75 }}
          className="relative overflow-hidden"
          style={{
            flex: 1,
            padding: "clamp(10px, 1vw, 14px)",
            background: "rgba(0, 10, 25, 0.9)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(0, 229, 255, 0.15)",
            borderRadius: 8,
            textAlign: "center",
            animation: "tileGlow 3s ease-in-out infinite 1s",
          }}
        >
          <div
            style={{
              fontSize: "clamp(16px, 1.6vw, 24px)",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {operatorMetric?.value ?? "—"}
          </div>
          <div
            style={{
              fontSize: "clamp(7px, 0.55vw, 10px)",
              color: "rgba(140, 200, 255, 0.35)",
              fontFamily: "'Share Tech Mono', monospace",
              marginTop: 3,
              letterSpacing: "0.1em",
            }}
          >
            OPERATORS
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.85 }}
          className="relative overflow-hidden"
          style={{
            flex: 1,
            padding: "clamp(10px, 1vw, 14px)",
            background: "rgba(0, 10, 25, 0.9)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(0, 229, 255, 0.15)",
            borderRadius: 8,
            textAlign: "center",
            animation: "tileGlow 3s ease-in-out infinite 1.5s",
          }}
        >
          <div
            style={{
              fontSize: "clamp(16px, 1.6vw, 24px)",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {seigPerBlock > 0 ? seigPerBlock.toFixed(2) : "—"}
            <span
              style={{
                fontSize: "0.45em",
                color: "rgba(0, 229, 255, 0.5)",
                marginLeft: 3,
              }}
            >
              TON
            </span>
          </div>
          <div
            style={{
              fontSize: "clamp(7px, 0.55vw, 10px)",
              color: "rgba(140, 200, 255, 0.35)",
              fontFamily: "'Share Tech Mono', monospace",
              marginTop: 3,
              letterSpacing: "0.1em",
            }}
          >
            SEIG / BLOCK
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Governance Stats Row — compact pillars
   ═══════════════════════════════════════════════ */

function GovernanceStatsRow({ stats }: { stats: GovStat[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1.0 }}
      className="flex items-stretch justify-center"
      style={{ gap: "clamp(4px, 0.5vw, 8px)" }}
    >
      {stats.map((stat, i) => (
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
   Reactor CTA Buttons — primary with strong glow pulse
   ═══════════════════════════════════════════════ */

function ReactorCTAPrimary() {
  return (
    <motion.a
      href="https://github.com/tokamak-network/TokamakStaking"
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
      href="https://github.com/tokamak-network/TokamakDAO"
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

function BottomControlPanel({ stats }: { stats: GovStat[] }) {
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
        <GovernanceStatsRow stats={stats} />
        {/* CTA buttons */}
        <div className="flex items-center gap-4">
          <ReactorCTASecondary />
          <ReactorCTAPrimary />
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Mobile Overlay — FUI card-based layout, vertical scroll
   ═══════════════════════════════════════════════ */

function GovernanceStakingMobileOverlay({
  proposals,
  stakingMetrics,
  govStats,
  committee,
  treasury,
  totalSupply,
  totalStaked,
  seigPerBlock,
}: {
  proposals: Proposal[];
  stakingMetrics: StakingMetric[];
  govStats: GovStat[];
  committee: CommitteeMember[];
  treasury: TreasuryData;
  totalSupply: number;
  totalStaked: number;
  seigPerBlock: number;
}) {
  const aprMetric = stakingMetrics.find(m => m.label === "Staking APR");
  const stakedMetric = stakingMetrics.find(m => m.label === "Total Staked");
  const operatorMetric = stakingMetrics.find(m => m.label === "Operators");
  const stakedRatio = totalSupply > 0 ? ((totalStaked / totalSupply) * 100).toFixed(1) : "0";
  const seigAlloc = govStats.find(s => s.label === "Total Agendas");

  return (
    <div className="absolute inset-0 flex flex-col px-4 py-6 gap-3 overflow-y-auto">
      <style dangerouslySetInnerHTML={{ __html: TILE_GLOW_KEYFRAMES + STAKING_GLOW_KEYFRAMES }} />

      {/* ══════════════════════════════════════
          STAKING SECTION
          ══════════════════════════════════════ */}

      {/* Staking Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            fontSize: 13,
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            color: "rgba(0,229,255,0.8)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textShadow: "0 0 10px rgba(0,229,255,0.3)",
          }}
        >
          Staking
        </div>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(0,229,255,0.3), transparent)" }} />
      </div>

      {/* APR Hero */}
      <div
        className="relative overflow-hidden"
        style={{
          padding: "20px 16px",
          background: "rgba(0,10,25,0.9)",
          border: "1px solid rgba(34,197,94,0.2)",
          borderRadius: 8,
          textAlign: "center",
          animation: "greenGlow 3s ease-in-out infinite",
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: -10, left: "50%", transform: "translateX(-50%)",
            width: 180, height: 80,
            background: "radial-gradient(ellipse, rgba(34,197,94,0.08), transparent)",
          }}
        />
        <div style={{ fontSize: 9, color: "rgba(34,197,94,0.5)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 6, position: "relative", fontFamily: "'Share Tech Mono', monospace" }}>
          Staking APR
        </div>
        <div style={{ fontSize: 42, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#22c55e", textShadow: "0 0 20px rgba(34,197,94,0.6), 0 0 40px rgba(34,197,94,0.3)", lineHeight: 1, position: "relative" }}>
          {aprMetric?.value ?? "—"}
          <span style={{ fontSize: "0.38em", color: "rgba(34,197,94,0.5)" }}>%</span>
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)", marginTop: 12 }} />
      </div>

      {/* Total Staked */}
      <div
        style={{
          padding: "14px 16px",
          background: "rgba(0,10,25,0.9)",
          border: "1px solid rgba(0,229,255,0.2)",
          borderRadius: 8,
        }}
      >
        <div style={{ fontSize: 9, color: "rgba(0,229,255,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", marginBottom: 4 }}>
          Total Staked
        </div>
        <div style={{ fontSize: 26, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#fff", textShadow: "0 0 15px rgba(0,229,255,0.5)" }}>
          {stakedMetric?.value ?? "—"}
          <span style={{ fontSize: "0.4em", color: "rgba(0,229,255,0.5)", marginLeft: 4 }}>TON</span>
        </div>
      </div>

      {/* Staked Ratio Gauge */}
      <div
        style={{
          padding: "10px 14px",
          background: "rgba(0,10,25,0.7)",
          border: "1px solid rgba(0,229,255,0.1)",
          borderRadius: 6,
        }}
      >
        <div className="flex justify-between items-center" style={{ marginBottom: 5 }}>
          <span style={{ fontSize: 9, color: "rgba(140,200,255,0.4)", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.1em" }}>
            STAKED / SUPPLY
          </span>
          <span style={{ fontSize: 12, color: "rgba(0,229,255,0.6)", fontFamily: "'Orbitron', sans-serif", fontWeight: 700 }}>
            {stakedRatio}%
          </span>
        </div>
        <div style={{ height: 5, background: "rgba(0,229,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stakedRatio}%` }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            style={{ height: "100%", background: "linear-gradient(90deg, #00e5ff, #2A72E5)", borderRadius: 3, boxShadow: "0 0 6px rgba(0,229,255,0.5)" }}
          />
        </div>
      </div>

      {/* Operators + Seig/Block row */}
      <div className="flex" style={{ gap: 6 }}>
        <div
          style={{
            flex: 1, padding: "12px 8px",
            background: "rgba(0,10,25,0.9)",
            border: "1px solid rgba(0,229,255,0.15)",
            borderRadius: 8, textAlign: "center",
          }}
        >
          <div style={{ fontSize: 18, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#fff" }}>
            {operatorMetric?.value ?? "—"}
          </div>
          <div style={{ fontSize: 8, color: "rgba(140,200,255,0.35)", fontFamily: "'Share Tech Mono', monospace", marginTop: 3, letterSpacing: "0.1em" }}>
            OPERATORS
          </div>
        </div>
        <div
          style={{
            flex: 1, padding: "12px 8px",
            background: "rgba(0,10,25,0.9)",
            border: "1px solid rgba(0,229,255,0.15)",
            borderRadius: 8, textAlign: "center",
          }}
        >
          <div style={{ fontSize: 18, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#fff" }}>
            {seigPerBlock > 0 ? seigPerBlock.toFixed(2) : "—"}
            <span style={{ fontSize: "0.45em", color: "rgba(0,229,255,0.5)", marginLeft: 3 }}>TON</span>
          </div>
          <div style={{ fontSize: 8, color: "rgba(140,200,255,0.35)", fontFamily: "'Share Tech Mono', monospace", marginTop: 3, letterSpacing: "0.1em" }}>
            SEIG / BLOCK
          </div>
        </div>
      </div>

      {/* Stake TON CTA */}
      <a
        href="https://github.com/tokamak-network/TokamakStaking"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block", width: "100%", padding: 12,
          background: "linear-gradient(180deg, rgba(0,40,60,0.9), rgba(5,25,50,0.9))",
          border: "1px solid rgba(0,229,255,0.5)",
          fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 700,
          color: "#fff", letterSpacing: "0.15em", textTransform: "uppercase",
          textDecoration: "none", textAlign: "center", borderRadius: 4,
        }}
      >
        Stake TON
      </a>

      {/* ══════════════════════════════════════
          GOVERNANCE SECTION
          ══════════════════════════════════════ */}

      {/* Governance Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
        <div
          style={{
            fontSize: 13,
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            color: "rgba(0,229,255,0.8)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textShadow: "0 0 10px rgba(0,229,255,0.3)",
          }}
        >
          Governance
        </div>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(0,229,255,0.3), transparent)" }} />
      </div>

      {/* Treasury Tile */}
      <div
        style={{
          padding: "14px 16px",
          background: "rgba(0,10,25,0.9)",
          border: "1px solid rgba(0,229,255,0.2)",
          borderRadius: 8,
        }}
      >
        <div className="flex justify-between items-center">
          <div>
            <div style={{ fontSize: 9, color: "rgba(0,229,255,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace" }}>
              DAO Treasury
            </div>
            <div style={{ fontSize: 28, fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#fff", marginTop: 3, textShadow: "0 0 15px rgba(0,229,255,0.5)" }}>
              {treasury.totalTonEquivalent > 0 ? formatTreasury(treasury.totalTonEquivalent) : "—"}
              <span style={{ fontSize: "0.4em", color: "rgba(0,229,255,0.5)", marginLeft: 4 }}>TON</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "rgba(0,229,255,0.7)" }}>
              50%
            </div>
            <div style={{ fontSize: 8, color: "rgba(140,200,255,0.35)", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.1em" }}>
              SEIG ALLOC
            </div>
          </div>
        </div>
      </div>

      {/* Committee Section */}
      <div style={{ fontSize: 9, color: "rgba(0,229,255,0.4)", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        Committee · {committee.length}/{committee.length} Active
      </div>

      <div className="flex" style={{ gap: 6 }}>
        {committee.map((member) => (
          <div
            key={member.seat}
            style={{
              flex: 1, padding: "12px 6px",
              background: "rgba(0,10,25,0.9)",
              border: "1px solid rgba(0,229,255,0.15)",
              borderRadius: 8, textAlign: "center",
            }}
          >
            <div
              style={{
                width: 28, height: 28, margin: "0 auto 6px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(42,114,229,0.15))",
                border: "1px solid rgba(0,229,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 10, color: "#00e5ff" }}>●</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontFamily: "'Share Tech Mono', monospace", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {member.name}
            </div>
            <div style={{ fontSize: 8, color: "rgba(140,200,255,0.35)", fontFamily: "'Share Tech Mono', monospace", marginTop: 3 }}>
              Seat {member.seat} · {formatJoinLabel(member.joinedAt)}
            </div>
          </div>
        ))}
      </div>

      {/* Agenda Section */}
      <div style={{ fontSize: 9, color: "rgba(0,229,255,0.4)", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 2 }}>
        Recent Agendas
      </div>

      <div className="flex flex-col" style={{ gap: 6 }}>
        {proposals.map((proposal) => {
          const sc = agendaStatusColor(proposal.status);
          const isNotice = proposal.status === "notice" || proposal.status === "active";
          return (
            <div
              key={proposal.id}
              style={{
                padding: "12px 14px",
                background: "rgba(0,10,25,0.9)",
                border: `1px solid ${sc.border}`,
                borderRadius: 8,
              }}
            >
              <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: sc.text }}>
                  {proposal.id}
                </span>
                <span style={{ fontSize: 9, color: sc.dot, fontFamily: "'Share Tech Mono', monospace" }}>
                  {isNotice ? "● " : ""}{sc.label}
                </span>
              </div>
              <div style={{ fontSize: 9, color: "rgba(140,200,255,0.3)", fontFamily: "'Share Tech Mono', monospace" }}>
                {proposal.createdDate
                  ? new Date(proposal.createdDate).toLocaleDateString("en", { month: "short", year: "numeric" })
                  : "—"}
                {proposal.votingStart && proposal.votingEnd
                  ? ` · ${proposal.totalVotes ?? 0}/3 voted`
                  : " · 0/3 voted"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "8px 12px",
          background: "rgba(0,10,25,0.7)",
          border: "1px solid rgba(0,229,255,0.08)",
          borderRadius: 6,
        }}
      >
        <span style={{ fontSize: 9, color: "rgba(140,200,255,0.35)", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.1em" }}>
          {seigAlloc ? `${seigAlloc.value} AGENDAS` : "—"} · QUORUM {govStats.find(s => s.label === "Quorum")?.value ?? "—"}
        </span>
        <a
          href="https://github.com/tokamak-network/TokamakDAO"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 9, color: "rgba(0,229,255,0.5)", fontFamily: "'Share Tech Mono', monospace", textDecoration: "none", letterSpacing: "0.08em" }}
        >
          DAO →
        </a>
      </div>

      {/* Vote Now CTA */}
      <a
        href="https://github.com/tokamak-network/TokamakDAO"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block", width: "100%", padding: 12,
          background: "linear-gradient(180deg, rgba(10,20,50,0.9), rgba(5,15,40,0.9))",
          border: "1px solid rgba(42,114,229,0.6)",
          fontFamily: "'Orbitron', sans-serif", fontSize: 12, fontWeight: 700,
          color: "#8cc8ff", letterSpacing: "0.15em", textTransform: "uppercase",
          textDecoration: "none", textAlign: "center", borderRadius: 4,
          marginBottom: 16,
        }}
      >
        Vote Now
      </a>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Main Export — Governance & Staking Overlay
   ═══════════════════════════════════════════════ */

export default function GovernanceStakingOverlay() {
  const { proposals, stakingMetrics, govStats, committee, treasury, totalSupply, totalStaked, seigPerBlock } = useGovernanceStakingData();

  return (
    <div className="absolute inset-0">
      {/* ── Mobile layout (below md) ── */}
      <div className="block md:hidden w-full h-full">
        <GovernanceStakingMobileOverlay
          proposals={proposals}
          stakingMetrics={stakingMetrics}
          govStats={govStats}
          committee={committee}
          treasury={treasury}
          totalSupply={totalSupply}
          totalStaked={totalStaked}
          seigPerBlock={seigPerBlock}
        />
      </div>

      {/* ── Desktop layout (md and above) ── */}
      <div className="hidden md:block w-full h-full">
          <HeaderBar />

          {/* Plasma Vortex — 2D canvas particles orbiting reactor */}
          <TokenVortex />

          {/* Left — DAO Modular Tiles */}
          <div
            className="absolute z-10"
            style={{
              left: "clamp(16px, 5vw, 70px)",
              top: "46%",
              transform: "translateY(-50%)",
            }}
          >
            <DaoModularTiles
              treasury={treasury}
              committee={committee}
              proposals={proposals}
              govStats={govStats}
            />
          </div>

          {/* Right — Staking Modular Tiles */}
          <div
            className="absolute z-10"
            style={{
              right: "clamp(16px, 5vw, 70px)",
              top: "46%",
              transform: "translateY(-50%)",
            }}
          >
            <StakingModularTiles
              stakingMetrics={stakingMetrics}
              totalSupply={totalSupply}
              totalStaked={totalStaked}
              seigPerBlock={seigPerBlock}
            />
          </div>

          {/* Bottom — governance stats + CTA buttons */}
          <BottomControlPanel stats={govStats} />
      </div>
    </div>
  );
}
