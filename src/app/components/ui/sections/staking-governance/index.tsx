"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface Metric {
  label: string;
  value: string;
  suffix?: string;
}

interface Proposal {
  id: string;
  title?: string;
  status: string;
  votes?: string;
  totalVotes?: number;
  votingStart?: string | null;
  createdDate?: string | null;
}

interface LiveData {
  staking: Metric[];
  governance: Metric[];
  stakeRatio: number | null;
  totalSupply: number;
  recentProposals: Proposal[];
  committeeSize: number;
  loaded: boolean;
}

const FALLBACK_STAKING: Metric[] = [
  { label: "Total Staked", value: "—", suffix: "TON" },
  { label: "Staking APR", value: "—", suffix: "%" },
  { label: "Operators", value: "—" },
];

const FALLBACK_GOV: Metric[] = [
  { label: "Total Agendas", value: "—" },
  { label: "Committee", value: "—", suffix: "members" },
  { label: "Treasury", value: "—", suffix: "TON" },
];

const STAKING_URL = "https://github.com/tokamak-network/TokamakStaking";
const DAO_URL = "https://github.com/tokamak-network/TokamakDAO";

const STATUS_COLOR: Record<string, { dot: string; text: string }> = {
  voting: { dot: "#4ade80", text: "Voting" },
  notice: { dot: "#facc15", text: "Notice" },
  pending: { dot: "#facc15", text: "Pending" },
  passed: { dot: "#7AB0FF", text: "Passed" },
  ended: { dot: "rgba(255,255,255,0.45)", text: "Ended" },
  executed: { dot: "#7AB0FF", text: "Executed" },
  rejected: { dot: "#f87171", text: "Rejected" },
};

function formatStaked(n: number): string {
  if (!Number.isFinite(n)) return "—";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function useGovernanceStakingMetrics(): LiveData {
  const [data, setData] = useState<LiveData>({
    staking: FALLBACK_STAKING,
    governance: FALLBACK_GOV,
    stakeRatio: null,
    totalSupply: 0,
    recentProposals: [],
    committeeSize: 0,
    loaded: false,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/governance-staking", { cache: "no-store" });
        if (!res.ok) throw new Error("API error");
        const d = await res.json();
        if (cancelled) return;

        const stakeRatio =
          d.staking.totalSupply > 0
            ? (d.staking.totalStaked / d.staking.totalSupply) * 100
            : null;

        const committeeActive = Array.isArray(d.committee)
          ? d.committee.length
          : 0;
        const treasuryTon = d.treasury?.totalTonEquivalent ?? 0;

        const recentProposals: Proposal[] = Array.isArray(d.governance.proposals)
          ? d.governance.proposals.slice(0, 3)
          : [];

        setData({
          staking: [
            {
              label: "Total Staked",
              value: formatStaked(d.staking.totalStaked),
              suffix: "TON",
            },
            {
              label: "Staking APR",
              value: d.staking.apr.toFixed(1),
              suffix: "%",
            },
            {
              label: "Operators",
              value: String(d.staking.operatorCount),
            },
          ],
          governance: [
            {
              label: "Total Agendas",
              value: String(d.governance.totalAgendas),
            },
            {
              label: "Committee",
              value: String(committeeActive),
              suffix: "members",
            },
            {
              label: "Treasury",
              value: formatStaked(treasuryTon),
              suffix: "TON",
            },
          ],
          stakeRatio,
          totalSupply: d.staking.totalSupply ?? 0,
          recentProposals,
          committeeSize: Number(d.governance.maxMember) || 0,
          loaded: true,
        });
      } catch (err) {
        console.error("[StakingGovernance] live data fetch failed:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

export default function StakingGovernance() {
  const [mounted, setMounted] = useState(false);
  const { staking, governance, stakeRatio, totalSupply, recentProposals, committeeSize } =
    useGovernanceStakingMetrics();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="relative w-full lg:min-h-screen bg-black overflow-hidden flex items-start lg:items-center"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* Background video — large, centered, slightly overflowing the cards */}
      {mounted && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <div
            className="relative w-[min(1280px,95vw)] aspect-square sm:aspect-[16/10] max-h-[min(820px,80vh)]"
            style={{
              maskImage:
                "radial-gradient(ellipse 75% 80% at 50% 50%, black 20%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.18) 78%, transparent 95%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 75% 80% at 50% 50%, black 20%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.18) 78%, transparent 95%)",
            }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                mixBlendMode: "lighten",
                filter: "contrast(1.1) brightness(0.78) saturate(1.05)",
                opacity: 0.9,
              }}
            >
              <source src="/governance/voting-cascade.webm" type="video/webm" />
              <source src="/governance/voting-cascade.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {/* Dot grid — sits above the video so the blue light tints the dots */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(122,176,255,0.22) 1px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
            <span
              className="text-[10px] sm:text-[11px] tracking-[0.5em] text-[#7AB0FF]/90 uppercase"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              Governance & Staking
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.05] tracking-tight">
            Powered by{" "}
            <span className="text-[#7AB0FF] drop-shadow-[0_0_24px_rgba(42,114,229,0.55)]">
              participation
            </span>
            .
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 max-w-5xl mx-auto">
          <StakingChannelCard
            metrics={staking}
            ratio={stakeRatio}
            totalSupply={totalSupply}
          />
          <GovernanceChannelCard
            metrics={governance}
            proposals={recentProposals}
            committeeSize={committeeSize}
          />
        </div>
      </div>
    </section>
  );
}

const MONO = "var(--font-geist-mono), monospace";

/* ─────────────────────────────────────────────────────────────────────
   Big channel cards — Staking + Governance
   ───────────────────────────────────────────────────────────────────── */

interface CardShellProps {
  href: string;
  typeLabel: string;
  typeColor: string;
  title: string;
  tagline: string;
  metrics: Metric[];
  children: React.ReactNode;
}

function ChannelCardShell({
  href,
  typeLabel,
  typeColor,
  title,
  tagline,
  metrics,
  children,
}: CardShellProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden bg-[#040814]/85 border border-[#4A8EFA]/25 hover:border-[#4A8EFA]/55 transition-all min-h-[560px] sm:min-h-0 sm:aspect-[5/4] lg:aspect-[1/1] hover:shadow-[0_0_40px_rgba(42,114,229,0.18)]"
    >
      {/* Corner brackets */}
      <span className="absolute top-2 left-2 w-4 h-4 border-l border-t border-[#4A8EFA]/65 pointer-events-none z-10" />
      <span className="absolute top-2 right-2 w-4 h-4 border-r border-t border-[#4A8EFA]/65 pointer-events-none z-10" />
      <span className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-[#4A8EFA]/65 pointer-events-none z-10" />
      <span className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-[#4A8EFA]/65 pointer-events-none z-10" />

      {/* Background blueprint grid + glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(74,142,250,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(74,142,250,0.45) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage:
            "radial-gradient(ellipse 70% 80% at 50% 40%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 80% at 50% 40%, black 30%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 30%, rgba(42,114,229,0.18) 0%, transparent 65%)",
        }}
      />

      {/* Top row: arrow + type pill */}
      <div className="relative z-20 flex items-start justify-between px-4 pt-4 sm:px-5 sm:pt-5 pointer-events-none">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
          <ArrowUpRight size={14} />
        </span>
        <span
          className="px-2.5 py-0.5 border bg-[#040814]/85 text-[10px] tracking-[0.32em] uppercase backdrop-blur-sm"
          style={{
            fontFamily: MONO,
            color: typeColor,
            borderColor: `${typeColor}66`,
          }}
        >
          {typeLabel}
        </span>
      </div>

      {/* Hero zone — fills remaining space */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-5 py-3 min-h-0 overflow-hidden">
        {children}
      </div>

      {/* Bottom block: metric chips + title + tagline */}
      <div className="relative z-20 px-4 pb-4 sm:px-5 sm:pb-5 bg-gradient-to-t from-black via-black/92 to-transparent pt-6">
        {/* Metric chips */}
        <div className="grid grid-cols-3 gap-3 mb-3 pb-3 border-b border-white/12">
          {metrics.map((m) => (
            <div key={m.label}>
              <div
                className="text-[8.5px] tracking-[0.28em] uppercase text-white/40 mb-1"
                style={{ fontFamily: MONO }}
              >
                {m.label}
              </div>
              <div className="text-base sm:text-lg text-white font-semibold tracking-tight leading-none">
                {m.value}
                {m.suffix && (
                  <span
                    className="ml-1 text-[10px] text-white/45 font-normal"
                    style={{ fontFamily: MONO }}
                  >
                    {m.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Big title */}
        <div
          className="text-white uppercase leading-[0.9] tracking-[-0.04em]"
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(28px, 2.6vw, 42px)",
          }}
        >
          {title}
        </div>
        <div
          className="mt-1.5 text-[10px] tracking-[0.22em] uppercase text-white/55"
          style={{ fontFamily: MONO }}
        >
          {tagline}
        </div>
      </div>
    </a>
  );
}

/* ── Staking card — hero is big stake-ratio % + gauge ── */
function StakingChannelCard({
  metrics,
  ratio,
  totalSupply,
}: {
  metrics: Metric[];
  ratio: number | null;
  totalSupply: number;
}) {
  const filled = Math.min(Math.max(ratio ?? 0, 0), 100);
  return (
    <ChannelCardShell
      href={STAKING_URL}
      typeLabel="Stake"
      typeColor="#7AB0FF"
      title="Staking"
      tagline="Secure the network · Earn rewards"
      metrics={metrics}
    >
      <div className="w-full flex flex-col items-center justify-center">
        {/* Big % */}
        <div
          className="text-[#9EC4FF] leading-none tracking-[-0.05em] select-none"
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(56px, 6.8vw, 92px)",
            textShadow: "0 0 36px rgba(42,114,229,0.55)",
          }}
        >
          {ratio !== null ? `${ratio.toFixed(1)}%` : "—"}
        </div>
        <div
          className="mt-2 text-[10px] tracking-[0.32em] uppercase text-[#7AB0FF]/80"
          style={{ fontFamily: MONO }}
        >
          Stake Ratio
        </div>
        {/* Gauge */}
        <div className="w-full max-w-[280px] mt-5">
          <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#2A72E5] via-[#4A8EFA] to-[#7AB0FF] shadow-[0_0_18px_rgba(42,114,229,0.6)] transition-all duration-1000"
              style={{ width: `${filled}%` }}
            />
            <div
              className="absolute inset-y-0 left-0 rounded-full opacity-70 animate-pulse"
              style={{
                width: `${filled}%`,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
              }}
            />
          </div>
          <div
            className="flex items-center justify-between mt-2 text-[9px] tracking-[0.18em] uppercase text-white/40"
            style={{ fontFamily: MONO }}
          >
            <span>0</span>
            <span>
              {totalSupply > 0 ? `${formatStaked(totalSupply)} TON` : "—"}
            </span>
          </div>
        </div>
      </div>
    </ChannelCardShell>
  );
}

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatMonthYear(iso: string | null | undefined): string | null {
  if (!iso) return null;
  // iso shape: "YYYY-MM-DD"
  const [yStr, mStr] = iso.split("-");
  const y = Number(yStr);
  const m = Number(mStr);
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return null;
  return `${MONTH_SHORT[m - 1]} ${y}`;
}

/* ── Governance card — hero is big totalAgendas + recent agenda list ── */
function GovernanceChannelCard({
  metrics,
  proposals,
  committeeSize,
}: {
  metrics: Metric[];
  proposals: Proposal[];
  committeeSize: number;
}) {
  // metrics[0] = Total Agendas (number)
  const totalAgendasValue = metrics[0]?.value ?? "—";

  return (
    <ChannelCardShell
      href={DAO_URL}
      typeLabel="Vote"
      typeColor="#7AB0FF"
      title="Governance"
      tagline="Shape the protocol · Vote onchain"
      metrics={metrics}
    >
      <div className="w-full flex flex-col items-center justify-center gap-4">
        {/* Big agenda count */}
        <div className="flex items-baseline gap-3">
          <div
            className="text-[#9EC4FF] leading-none tracking-[-0.05em] select-none"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(56px, 6.8vw, 92px)",
              textShadow: "0 0 36px rgba(42,114,229,0.55)",
            }}
          >
            {totalAgendasValue}
          </div>
          <div
            className="text-[10px] tracking-[0.32em] uppercase text-[#7AB0FF]/80 pb-3"
            style={{ fontFamily: MONO }}
          >
            Agendas
          </div>
        </div>
        {/* Recent agenda list (compact, max 3) */}
        <div className="w-full max-w-[300px]">
          <div
            className="flex items-center justify-between mb-2 text-[9px] tracking-[0.32em] uppercase text-white/45"
            style={{ fontFamily: MONO }}
          >
            <span>Recent</span>
            <span className="inline-flex items-center gap-1.5 text-[#7AB0FF]/75">
              <span className="inline-block h-1 w-1 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80] animate-pulse" />
              Live
            </span>
          </div>
          <ul className="space-y-1">
            {proposals.length === 0
              ? [0, 1, 2].map((i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/[0.02] border border-white/[0.05]"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/15" />
                    <span
                      className="text-[10px] tracking-[0.18em] text-white/30"
                      style={{ fontFamily: MONO }}
                    >
                      Loading…
                    </span>
                  </li>
                ))
              : proposals.slice(0, 3).map((p) => {
                  const s = STATUS_COLOR[p.status?.toLowerCase()] ?? {
                    dot: "#7AB0FF",
                    text: p.status || "—",
                  };
                  const when =
                    formatMonthYear(p.votingStart) ??
                    formatMonthYear(p.createdDate);
                  const votedLabel =
                    committeeSize > 0 && typeof p.totalVotes === "number"
                      ? `${p.totalVotes}/${committeeSize}`
                      : null;
                  const metaBits = [when, votedLabel].filter(
                    Boolean
                  ) as string[];
                  return (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded bg-white/[0.03] border border-white/[0.06]"
                    >
                      <span
                        className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: s.dot,
                          boxShadow: `0 0 6px ${s.dot}`,
                        }}
                      />
                      <span
                        className="text-[10px] tracking-[0.18em] text-white/85 font-semibold flex-shrink-0"
                        style={{ fontFamily: MONO }}
                      >
                        {p.id}
                      </span>
                      {metaBits.length > 0 && (
                        <span
                          className="text-[9px] tracking-[0.14em] text-white/45 truncate"
                          style={{ fontFamily: MONO }}
                        >
                          {metaBits.join(" · ")}
                        </span>
                      )}
                      <span
                        className="text-[9px] tracking-[0.18em] uppercase ml-auto flex-shrink-0"
                        style={{ color: s.dot, fontFamily: MONO }}
                      >
                        {s.text}
                      </span>
                    </li>
                  );
                })}
          </ul>
        </div>
      </div>
    </ChannelCardShell>
  );
}
