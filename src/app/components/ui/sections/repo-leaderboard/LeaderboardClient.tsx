"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  computeTreemapLayout,
  type TreemapCategory,
  type TreemapRect,
  type TreemapRepo,
} from "./treemapLayout";

// ── Helpers ──────────────────────────────────────────────────────────

function formatCompact(num: number): string {
  const abs = Math.abs(num);
  const sign = num >= 0 ? "+" : "-";
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
  return `${sign}${abs}`;
}

function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

/** Convert hex to rgba */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ── Tooltip ──────────────────────────────────────────────────────────

function Tooltip({
  repo,
  categoryColor,
  anchorX,
  anchorY,
  containerW,
}: {
  readonly repo: TreemapRepo;
  readonly categoryColor: string;
  readonly anchorX: number;
  readonly anchorY: number;
  readonly containerW: number;
}) {
  const flipX = anchorX > containerW * 0.6;

  return (
    <motion.div
      className="pointer-events-none absolute z-50"
      style={{
        left: flipX ? undefined : anchorX + 16,
        right: flipX ? containerW - anchorX + 16 : undefined,
        top: Math.max(8, anchorY - 40),
      }}
      initial={{ opacity: 0, scale: 0.9, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="rounded-lg border px-5 py-4 shadow-2xl backdrop-blur-md"
        style={{
          minWidth: 220,
          backgroundColor: "rgba(10, 10, 10, 0.92)",
          borderColor: hexToRgba(categoryColor, 0.3),
          boxShadow: `0 0 30px ${hexToRgba(categoryColor, 0.15)}, 0 20px 40px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Header with glow dot */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: categoryColor,
              boxShadow: `0 0 8px ${categoryColor}`,
            }}
          />
          <div className="text-[13px] font-[700] text-white uppercase tracking-[0.04em]">
            {repo.repoName}
          </div>
        </div>

        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between">
            <span className="text-[#666]">Lines Added</span>
            <span className="text-[#22c55e] font-[700]">+{formatNumber(repo.linesAdded)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666]">Net Growth</span>
            <span className="text-[#22c55e] font-[700]">
              +{formatNumber(repo.netGrowth)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666]">Commits</span>
            <span className="text-white font-[700]">{repo.commits}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Desktop Treemap ──────────────────────────────────────────────────

function TreemapDesktop({
  rects,
  maxAbsGrowth,
  isVisible,
  maxLinesChanged,
}: {
  readonly rects: TreemapRect[];
  readonly maxAbsGrowth: number;
  readonly isVisible: boolean;
  readonly maxLinesChanged: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<{
    repo: TreemapRepo;
    categoryColor: string;
    x: number;
    y: number;
  } | null>(null);
  const [containerW, setContainerW] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerW(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const categoryRects = rects.filter((r) => !r.repo);
  const repoRects = rects.filter((r) => !!r.repo);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, repo: TreemapRepo, categoryColor: string) => {
      const container = containerRef.current;
      if (!container) return;
      const bounds = container.getBoundingClientRect();
      setHovered({
        repo,
        categoryColor,
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => setHovered(null), []);

  return (
    <div
      ref={containerRef}
      className="relative w-full hidden [@media(min-width:801px)]:block"
      style={{ aspectRatio: "16 / 10", maxHeight: 560 }}
    >
      {/* Inner container — clipped for rounded corners, grid, fade */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          backgroundColor: "#050505",
          boxShadow: "0 0 80px rgba(0,0,0,0.6), inset 0 0 80px rgba(0,0,0,0.3)",
        }}
      >
        {/* Subtle grid lines background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Category borders + labels (inside clipped area) */}
        {categoryRects.map((cat) => {
          const catPxW = (cat.w / 100) * containerW;
          const catPxH = (cat.h / 100) * (containerW * (10 / 16));
          const isNarrow = catPxW < 80 || catPxH < 40;

          return (
            <div
              key={`cat-border-${cat.categoryName}`}
              className="absolute pointer-events-none overflow-hidden"
              style={{
                left: `${cat.x}%`,
                top: `${cat.y}%`,
                width: `${cat.w}%`,
                height: `${cat.h}%`,
                border: `1.5px solid ${hexToRgba(cat.categoryColor, 0.4)}`,
                zIndex: 5,
              }}
            >
              {/* Category label — clipped within category bounds */}
              <span
                className="absolute top-0 left-0 truncate"
                style={{
                  maxWidth: "100%",
                  padding: isNarrow ? "2px 5px" : "3px 10px",
                  fontSize: isNarrow ? 8 : 9,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background: `linear-gradient(135deg, ${cat.categoryColor}, ${hexToRgba(cat.categoryColor, 0.7)})`,
                  color: "#000",
                  borderBottomRightRadius: 6,
                  lineHeight: 1.2,
                  zIndex: 6,
                }}
              >
                {cat.categoryName}
              </span>
              {/* Corner accent */}
              {!isNarrow && (
                <span
                  className="absolute bottom-0 right-0 w-3 h-3"
                  style={{
                    borderBottom: `2px solid ${cat.categoryColor}`,
                    borderRight: `2px solid ${cat.categoryColor}`,
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Repo blocks */}
        {repoRects.map((rect, i) => {
          const repo = rect.repo!;
          const intensity =
            maxAbsGrowth > 0
              ? Math.min(Math.abs(repo.netGrowth) / maxAbsGrowth, 1)
              : 0;
          const activityRatio =
            maxLinesChanged > 0
              ? Math.min(repo.linesChanged / maxLinesChanged, 1)
              : 0;

          const isPositive = repo.netGrowth >= 0;
          const baseGreen = `rgba(34, 197, 94, ${0.06 + intensity * 0.3})`;
          const baseRed = `rgba(239, 68, 68, ${0.06 + intensity * 0.3})`;
          const bgColor = isPositive ? baseGreen : baseRed;

          const highlightColor = isPositive
            ? `rgba(34, 197, 94, ${0.02 + intensity * 0.12})`
            : `rgba(239, 68, 68, ${0.02 + intensity * 0.12})`;

          const pxW = (rect.w / 100) * containerW;
          const pxH = (rect.h / 100) * (containerW * (10 / 16));
          const isLarge = pxW >= 100 && pxH >= 56;
          const isMedium = !isLarge && pxW >= 50 && pxH >= 32;
          const isSmall = !isLarge && !isMedium && (pxW >= 28 || pxH >= 20);
          const isHovered = hovered?.repo.repoName === repo.repoName;

          const glowColor = isPositive
            ? "rgba(34, 197, 94, 0.25)"
            : "rgba(239, 68, 68, 0.25)";

          return (
            <motion.a
              key={repo.repoName}
              href={repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute flex flex-col items-center justify-center overflow-hidden cursor-pointer"
              style={{
                left: `${rect.x}%`,
                top: `${rect.y}%`,
                width: `${rect.w}%`,
                height: `${rect.h}%`,
                background: `radial-gradient(ellipse at 30% 20%, ${highlightColor}, ${bgColor})`,
                borderTop: `1px solid ${hexToRgba(rect.categoryColor, 0.15)}`,
                borderLeft: `1px solid ${hexToRgba(rect.categoryColor, 0.1)}`,
                borderRight: `1px solid rgba(0,0,0,0.3)`,
                borderBottom: `1px solid rgba(0,0,0,0.3)`,
                zIndex: isHovered ? 4 : 2,
                boxShadow: isHovered
                  ? `inset 0 0 30px ${glowColor}, 0 8px 32px rgba(0,0,0,0.6)`
                  : "none",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isVisible
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{
                delay: i * 0.02,
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
              }}
              whileHover={{
                y: -2,
                transition: { duration: 0.2 },
              }}
              onMouseMove={(e) => handleMouseMove(e, repo, rect.categoryColor)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Scanline effect for large blocks */}
              {isLarge && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)",
                  }}
                />
              )}

              {/* Activity pulse for high-activity repos */}
              {activityRatio > 0.5 && isLarge && (
                <div
                  className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
                  style={{
                    backgroundColor: isPositive ? "#22c55e" : "#ef4444",
                    boxShadow: `0 0 6px ${isPositive ? "#22c55e" : "#ef4444"}`,
                  }}
                />
              )}

              {/* Labels — 3 tiers so every block shows something */}
              {isLarge && (
                <>
                  <span className="text-[13px] font-[800] text-white/90 leading-tight text-center px-2 truncate max-w-full tracking-[0.02em]">
                    {repo.repoName}
                  </span>
                  <span
                    className={`text-[18px] font-[900] font-orbitron mt-1 ${
                      isPositive ? "text-[#22c55e]" : "text-[#ef4444]"
                    }`}
                    style={{
                      textShadow: `0 0 12px ${isPositive ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
                    }}
                  >
                    {formatCompact(repo.netGrowth)}
                  </span>
                  <span className="text-[9px] text-white/30 font-[600] mt-1 uppercase tracking-[0.1em]">
                    {formatNumber(repo.linesChanged)} lines
                  </span>
                </>
              )}
              {isMedium && (
                <>
                  <span className="text-[10px] font-[700] text-white/80 leading-tight text-center px-1 truncate max-w-full">
                    {repo.repoName.replace(/^tokamak-/, "")}
                  </span>
                  <span
                    className={`text-[11px] font-[800] mt-0.5 ${
                      isPositive ? "text-[#22c55e]" : "text-[#ef4444]"
                    }`}
                  >
                    {formatCompact(repo.netGrowth)}
                  </span>
                </>
              )}
              {isSmall && (
                <span
                  className={`text-[9px] font-[800] ${
                    isPositive ? "text-[#22c55e]/80" : "text-[#ef4444]/80"
                  }`}
                >
                  {formatCompact(repo.netGrowth)}
                </span>
              )}
            </motion.a>
          );
        })}

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-[6]" />
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <Tooltip
            repo={hovered.repo}
            categoryColor={hovered.categoryColor}
            anchorX={hovered.x}
            anchorY={hovered.y}
            containerW={containerW}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Mobile Category Bars ─────────────────────────────────────────────

function MobileCategoryBar({
  category,
  maxAbsGrowth,
  isVisible,
  index,
}: {
  readonly category: TreemapCategory;
  readonly maxAbsGrowth: number;
  readonly isVisible: boolean;
  readonly index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const totalLines = category.repos.reduce((s, r) => s + r.linesChanged, 0);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, x: -20 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Category label */}
      <button
        className="w-full flex items-center gap-2.5 mb-2 text-left group"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span
          className="inline-block w-3 h-3 rounded-sm shrink-0"
          style={{
            backgroundColor: category.color,
            boxShadow: `0 0 8px ${hexToRgba(category.color, 0.4)}`,
          }}
        />
        <span className="text-[12px] font-[700] text-white/70 uppercase tracking-[0.06em] flex-1 group-hover:text-white/90 transition-colors">
          {category.name}
        </span>
        <span className="text-[10px] text-[#929298] mr-1">
          {category.repos.length} repos
        </span>
        <motion.span
          className="text-[10px] text-[#666]"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </button>

      {/* Stacked bar */}
      <div
        className="flex w-full h-[52px] rounded-lg overflow-hidden"
        style={{
          border: `1px solid ${hexToRgba(category.color, 0.2)}`,
          boxShadow: `inset 0 0 20px rgba(0,0,0,0.3), 0 0 20px ${hexToRgba(category.color, 0.05)}`,
        }}
      >
        {category.repos.map((repo) => {
          const fraction = totalLines > 0 ? repo.linesChanged / totalLines : 0;
          const intensity =
            maxAbsGrowth > 0
              ? Math.min(Math.abs(repo.netGrowth) / maxAbsGrowth, 1)
              : 0;
          const isPositive = repo.netGrowth >= 0;
          const bg = isPositive
            ? `rgba(34, 197, 94, ${0.1 + intensity * 0.35})`
            : `rgba(239, 68, 68, ${0.1 + intensity * 0.35})`;

          return (
            <a
              key={repo.repoName}
              href={repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center overflow-hidden text-center relative group/bar"
              style={{
                flexGrow: fraction * 1000,
                flexShrink: 0,
                flexBasis: 0,
                backgroundColor: bg,
                borderRight: `1px solid rgba(0,0,0,0.3)`,
                minWidth: 4,
              }}
            >
              {fraction > 0.15 && (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-[700] text-white/80 truncate px-1">
                    {repo.repoName.replace(/^tokamak-/, "")}
                  </span>
                  <span
                    className={`text-[9px] font-[700] ${
                      isPositive ? "text-[#22c55e]" : "text-[#ef4444]"
                    }`}
                  >
                    {formatCompact(repo.netGrowth)}
                  </span>
                </div>
              )}
            </a>
          );
        })}
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="mt-2 flex flex-col gap-1.5 pl-4 mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {category.repos.map((repo) => {
              const isPositive = repo.netGrowth >= 0;
              return (
                <a
                  key={repo.repoName}
                  href={repo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 px-4 bg-[#0a0a0a] border border-[#1a1a1a] hover:bg-[#111] transition-colors rounded-lg"
                  style={{
                    borderLeft: `3px solid ${isPositive ? "#22c55e" : "#ef4444"}`,
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-[700] text-white truncate">
                      {repo.repoName}
                    </div>
                    <div className="text-[10px] text-[#929298] mt-0.5">
                      {formatNumber(repo.linesChanged)} lines &middot;{" "}
                      {repo.commits} commits
                    </div>
                  </div>
                  <span
                    className={`text-[13px] font-[800] shrink-0 ml-3 font-orbitron ${
                      isPositive ? "text-[#22c55e]" : "text-[#ef4444]"
                    }`}
                  >
                    {formatCompact(repo.netGrowth)}
                  </span>
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────

function Legend() {
  return (
    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 mb-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm bg-[#22c55e]/30 border border-[#22c55e]/50" />
        <span className="text-[10px] text-[#929298] uppercase tracking-[0.08em] font-[600]">
          Growth
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm border border-[#333] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
        <span className="text-[10px] text-[#929298] uppercase tracking-[0.08em] font-[600]">
          Size = Lines Changed
        </span>
      </div>
    </div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────

interface LeaderboardClientProps {
  categories: TreemapCategory[];
  activeRepos: string;
  reportLabel: string;
  reportHref: string;
}

export default function LeaderboardClient({
  categories,
  activeRepos,
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
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const rects = useMemo(() => computeTreemapLayout(categories), [categories]);

  const maxAbsGrowth = useMemo(() => {
    let max = 0;
    for (const cat of categories) {
      for (const repo of cat.repos) {
        const abs = Math.abs(repo.netGrowth);
        if (abs > max) max = abs;
      }
    }
    return max;
  }, [categories]);

  const maxLinesChanged = useMemo(() => {
    let max = 0;
    for (const cat of categories) {
      for (const repo of cat.repos) {
        if (repo.linesChanged > max) max = repo.linesChanged;
      }
    }
    return max;
  }, [categories]);

  const totalLines = useMemo(
    () =>
      categories.reduce(
        (s, c) => s + c.repos.reduce((rs, r) => rs + r.linesChanged, 0),
        0,
      ),
    [categories],
  );

  if (categories.length === 0) return null;

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
          Ecosystem Activity
        </motion.p>
        <p className="text-[16px] text-[#929298] text-center mb-6 max-w-[600px] mx-auto">
          Repository activity across categories, sized by lines changed and
          colored by net growth.
        </p>

        {/* Summary stats */}
        <motion.div
          className="flex justify-center gap-10 mb-[60px]"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="text-center">
            <div className="text-[24px] font-orbitron font-[900] text-white">
              {activeRepos}
            </div>
            <div className="text-[10px] text-[#666] uppercase tracking-[0.1em] font-[600] mt-1">
              Active Projects
            </div>
          </div>
          <div className="w-px bg-[#1a1a1a]" />
          <div className="text-center">
            <div className="text-[24px] font-orbitron font-[900] text-white">
              {categories.length}
            </div>
            <div className="text-[10px] text-[#666] uppercase tracking-[0.1em] font-[600] mt-1">
              Categories
            </div>
          </div>
          <div className="w-px bg-[#1a1a1a]" />
          <div className="text-center">
            <div className="text-[24px] font-orbitron font-[900] text-white">
              {formatCompact(totalLines).replace("+", "")}
            </div>
            <div className="text-[10px] text-[#666] uppercase tracking-[0.1em] font-[600] mt-1">
              Lines Changed
            </div>
          </div>
        </motion.div>

        {/* Desktop: Treemap */}
        <TreemapDesktop
          rects={rects}
          maxAbsGrowth={maxAbsGrowth}
          maxLinesChanged={maxLinesChanged}
          isVisible={isVisible}
        />

        {/* Mobile: Category bars */}
        <div className="[@media(min-width:801px)]:hidden flex flex-col gap-5">
          {categories.map((cat, i) => (
            <MobileCategoryBar
              key={cat.name}
              category={cat}
              maxAbsGrowth={maxAbsGrowth}
              isVisible={isVisible}
              index={i}
            />
          ))}
        </div>

        {/* Legend */}
        <Legend />

        {/* Footer link */}
        <div className="text-center mt-6">
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
