"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface LeaderboardRepo {
  rank: number;
  repoName: string;
  githubUrl: string;
  category?: string;
  categoryColor?: string;
  linesChanged: number;
  netGrowth: number;
  isActive: boolean;
}

interface LeaderboardClientProps {
  repos: LeaderboardRepo[];
  reportLabel: string;
  reportHref: string;
}

function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

function getRankColor(rank: number): { text: string; shadow: string } {
  switch (rank) {
    case 1:
      return { text: "text-[#FFD700]", shadow: "0 0 8px rgba(255, 215, 0, 0.5)" };
    case 2:
      return { text: "text-[#C0C0C0]", shadow: "0 0 8px rgba(192, 192, 192, 0.5)" };
    case 3:
      return { text: "text-[#CD7F32]", shadow: "0 0 8px rgba(205, 127, 50, 0.5)" };
    default:
      return { text: "text-[#929298]", shadow: "none" };
  }
}

function TableRow({
  repo,
  index,
  isVisible,
}: {
  readonly repo: LeaderboardRepo;
  readonly index: number;
  readonly isVisible: boolean;
}) {
  const rankStyle = getRankColor(repo.rank);

  return (
    <motion.a
      href={repo.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="grid grid-cols-[60px,1fr,140px,140px,140px,100px] [@media(max-width:1024px)]:grid-cols-[50px,1fr,120px,100px] [@media(max-width:768px)]:hidden items-center px-6 py-5 bg-[#0a0a0a] hover:bg-[#111] transition-colors duration-200 border-b border-[#1a1a1a]"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      {/* Rank */}
      <div
        className={`text-[18px] font-orbitron font-[700] ${rankStyle.text}`}
        style={{ textShadow: rankStyle.shadow }}
      >
        #{repo.rank}
      </div>

      {/* Repository + Category */}
      <div className="flex flex-col gap-1.5">
        <div className="text-[14px] font-[700] text-white uppercase tracking-[0.04em] group-hover:text-primary transition-colors">
          {repo.repoName}
        </div>
        {repo.category && (
          <span
            className="inline-block w-fit px-2 py-0.5 text-[9px] font-[700] uppercase tracking-[0.06em]"
            style={{
              backgroundColor: `${repo.categoryColor ?? "#0077FF"}20`,
              color: repo.categoryColor ?? "#0077FF",
            }}
          >
            {repo.category}
          </span>
        )}
      </div>

      {/* Category (hidden on tablet) */}
      <div className="[@media(max-width:1024px)]:hidden">
        {repo.category && (
          <span
            className="inline-block px-3 py-1 text-[10px] font-[700] uppercase tracking-[0.06em]"
            style={{
              backgroundColor: `${repo.categoryColor ?? "#0077FF"}20`,
              color: repo.categoryColor ?? "#0077FF",
            }}
          >
            {repo.category}
          </span>
        )}
      </div>

      {/* Lines Changed */}
      <div className="text-[14px] font-orbitron font-[700] text-[#929298]">
        {formatNumber(repo.linesChanged)}
      </div>

      {/* Net Growth */}
      <div
        className={`text-[14px] font-orbitron font-[700] ${
          repo.netGrowth >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"
        }`}
      >
        {repo.netGrowth >= 0 ? "+" : ""}
        {formatNumber(repo.netGrowth)}
      </div>

      {/* Status */}
      <div className="[@media(max-width:1024px)]:hidden flex items-center gap-2">
        {repo.isActive && (
          <>
            <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[10px] font-[700] text-[#22c55e] uppercase tracking-[0.08em]">
              ACTIVE
            </span>
          </>
        )}
      </div>
    </motion.a>
  );
}

function MobileCard({
  repo,
  index,
  isVisible,
}: {
  readonly repo: LeaderboardRepo;
  readonly index: number;
  readonly isVisible: boolean;
}) {
  const rankStyle = getRankColor(repo.rank);

  return (
    <motion.a
      href={repo.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden [@media(max-width:768px)]:flex flex-col p-5 bg-[#0a0a0a] hover:bg-[#111] transition-colors duration-200 border border-[#1a1a1a]"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      {/* Rank badge + repo name */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`shrink-0 w-10 h-10 rounded flex items-center justify-center text-[14px] font-orbitron font-[700] ${rankStyle.text}`}
          style={{ textShadow: rankStyle.shadow, backgroundColor: "#111" }}
        >
          #{repo.rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-[700] text-white uppercase tracking-[0.04em] mb-1.5">
            {repo.repoName}
          </div>
          {repo.category && (
            <span
              className="inline-block px-2 py-0.5 text-[9px] font-[700] uppercase tracking-[0.06em]"
              style={{
                backgroundColor: `${repo.categoryColor ?? "#0077FF"}20`,
                color: repo.categoryColor ?? "#0077FF",
              }}
            >
              {repo.category}
            </span>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] text-[#929298] uppercase tracking-[0.08em] mb-1">
            Lines Changed
          </div>
          <div className="text-[13px] font-orbitron font-[700] text-[#929298]">
            {formatNumber(repo.linesChanged)}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-[#929298] uppercase tracking-[0.08em] mb-1">
            Net Growth
          </div>
          <div
            className={`text-[13px] font-orbitron font-[700] ${
              repo.netGrowth >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"
            }`}
          >
            {repo.netGrowth >= 0 ? "+" : ""}
            {formatNumber(repo.netGrowth)}
          </div>
        </div>
      </div>

      {/* Active indicator */}
      {repo.isActive && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#1a1a1a]">
          <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[10px] font-[700] text-[#22c55e] uppercase tracking-[0.08em]">
            ACTIVE
          </span>
        </div>
      )}
    </motion.a>
  );
}

export default function LeaderboardClient({
  repos,
  reportLabel,
  reportHref,
}: LeaderboardClientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (repos.length === 0) return null;

  return (
    <section
      id="repo-leaderboard"
      className="relative z-10 w-full flex justify-center bg-surface px-6 py-[160px] [@media(max-width:700px)]:py-[80px]"
    >
      <div ref={ref} className="w-full max-w-[1280px]">
        {/* Section header */}
        <h2 className="text-[12px] uppercase tracking-[0.08em] text-primary font-[700] mb-4 text-center">
          Repository Leaderboard
        </h2>
        <motion.p
          className="text-[38px] md:text-[48px] [@media(max-width:700px)]:text-[28px] text-white font-[900] text-center mb-4 leading-tight tracking-[0.04em] uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          Top Contributors
        </motion.p>
        <p className="text-[16px] text-[#929298] text-center mb-[80px] max-w-[600px] mx-auto">
          Repositories ranked by total code changes in the latest biweekly
          report.
        </p>

        {/* Terminal-style table */}
        <div className="bg-[#0a0a0a] overflow-hidden border border-[#1a1a1a]">
          {/* Table header - desktop */}
          <div className="grid grid-cols-[60px,1fr,140px,140px,140px,100px] [@media(max-width:1024px)]:grid-cols-[50px,1fr,120px,100px] [@media(max-width:768px)]:hidden items-center px-6 py-4 bg-[#111] border-b border-[#1a1a1a]">
            <div className="text-[11px] font-[700] text-[#929298] uppercase tracking-[0.08em]">
              Rank
            </div>
            <div className="text-[11px] font-[700] text-[#929298] uppercase tracking-[0.08em]">
              Repository
            </div>
            <div className="text-[11px] font-[700] text-[#929298] uppercase tracking-[0.08em] [@media(max-width:1024px)]:hidden">
              Category
            </div>
            <div className="text-[11px] font-[700] text-[#929298] uppercase tracking-[0.08em]">
              Lines Changed
            </div>
            <div className="text-[11px] font-[700] text-[#929298] uppercase tracking-[0.08em]">
              Net Growth
            </div>
            <div className="text-[11px] font-[700] text-[#929298] uppercase tracking-[0.08em] [@media(max-width:1024px)]:hidden">
              Status
            </div>
          </div>

          {/* Table rows - desktop */}
          {repos.map((repo, i) => (
            <TableRow key={repo.repoName} repo={repo} index={i} isVisible={isVisible} />
          ))}

          {/* Mobile cards */}
          <div className="hidden [@media(max-width:768px)]:flex flex-col gap-3 p-3">
            {repos.map((repo, i) => (
              <MobileCard key={repo.repoName} repo={repo} index={i} isVisible={isVisible} />
            ))}
          </div>
        </div>

        {/* Footer link */}
        <div className="text-center mt-10">
          <a
            href={reportHref}
            className="text-[14px] text-primary hover:text-primary/80 font-[700] uppercase tracking-[0.04em] transition-colors duration-300"
          >
            See full report: {reportLabel} →
          </a>
        </div>
      </div>
    </section>
  );
}
