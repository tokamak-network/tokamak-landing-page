"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface RepoData {
  name: string;
  description: string;
  githubUrl: string;
  activity: string;
  linesAdded: number;
  linesDeleted: number;
}

interface CategoryData {
  name: string;
  repoCount: number;
  repos: RepoData[];
}

interface ShowcaseOverlayProps {
  categories: CategoryData[];
  activeProjects: number;
  codeChanges: number;
  netGrowth: number;
}

const formatLines = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

export default function ShowcaseOverlay({
  categories,
  activeProjects,
  codeChanges,
  netGrowth,
}: ShowcaseOverlayProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const formatNum = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  const handlePedestalClick = useCallback((idx: number) => {
    setSelectedIdx((prev) => (prev === idx ? null : idx));
    setPage(0);
  }, []);

  const selectedCat = selectedIdx !== null ? categories[selectedIdx] : null;

  const pedestals = [
    { badgeLeft: 11.5, badgeTop: 31,   labelLeft: 12.5, labelTop: 57.5 },  // cab 1 ✅
    { badgeLeft: 20.5, badgeTop: 29,   labelLeft: 21,   labelTop: 53 },    // cab 2
    { badgeLeft: 28.5, badgeTop: 26,   labelLeft: 29,   labelTop: 49.5 },  // cab 3
    { badgeLeft: 36.5, badgeTop: 24,   labelLeft: 36.5, labelTop: 47 },    // cab 4
    { badgeLeft: 44.5, badgeTop: 23,   labelLeft: 44.5, labelTop: 46 },    // cab 5
    { badgeLeft: 53.5, badgeTop: 23,   labelLeft: 53.5, labelTop: 46 },    // cab 6 ✅
    { badgeLeft: 62,   badgeTop: 24,   labelLeft: 62,   labelTop: 47 },    // cab 7 ✅
    { badgeLeft: 69.5, badgeTop: 26,   labelLeft: 69,   labelTop: 49.5 },  // cab 8
    { badgeLeft: 77,   badgeTop: 29,   labelLeft: 76.5, labelTop: 53 },    // cab 9
    { badgeLeft: 84.5, badgeTop: 31,   labelLeft: 83.5, labelTop: 57.5 },  // cab 10
  ];

  return (
    <div className="absolute inset-0">
      {categories.slice(0, 10).map((cat, i) => {
        const pos = pedestals[i];
        if (!pos) return null;
        const isSelected = selectedIdx === i;

        return (
          <div key={cat.name}>
            {/* ── Clickable pedestal area ── */}
            <button
              onClick={() => handlePedestalClick(i)}
              className="absolute cursor-pointer"
              style={{
                left: `${pos.badgeLeft}%`,
                top: `${pos.badgeTop}%`,
                transform: "translateX(-50%)",
                width: "clamp(56px, 7.5vw, 110px)",
                height: `${(pos.labelTop - pos.badgeTop) + 10}%`,
                zIndex: 3,
                background: "transparent",
                border: "none",
                padding: 0,
              }}
              aria-label={`View ${cat.name} projects`}
            />

            {/* ── Speech-bubble badge with 3D asset ── */}
            <div
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                left: `${pos.badgeLeft}%`,
                top: `${pos.badgeTop}%`,
                transform: "translateX(-50%)",
                width: "clamp(56px, 7.5vw, 110px)",
                aspectRatio: "1.79",
                zIndex: 2,
                filter: isSelected ? "brightness(1.4)" : undefined,
                transition: "filter 0.2s ease",
              }}
            >
              <Image
                src="/tower/badge-bubble.png"
                alt=""
                fill
                className="object-contain"
                sizes="110px"
              />
              <span
                className="relative text-white font-bold leading-none"
                style={{
                  fontSize: "clamp(14px, 2vw, 28px)",
                  fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
                  letterSpacing: "1px",
                  textShadow:
                    "0 0 8px rgba(42, 114, 229, 0.7), 0 0 20px rgba(42, 114, 229, 0.4)",
                  zIndex: 3,
                  marginBottom: "clamp(4px, 0.5vw, 8px)",
                }}
              >
                {cat.repoCount}
              </span>
            </div>

            {/* ── Category name label ── */}
            <div
              className="absolute text-center pointer-events-none"
              style={{
                left: `${pos.labelLeft}%`,
                top: `${pos.labelTop}%`,
                transform: "translateX(-50%)",
                width: "clamp(55px, 7.5vw, 110px)",
                zIndex: 2,
              }}
            >
              <span
                className="uppercase font-bold leading-tight block"
                style={{
                  fontSize: "clamp(6px, 0.8vw, 11px)",
                  color: isSelected
                    ? "rgba(0, 229, 255, 1)"
                    : "rgba(160, 215, 255, 0.95)",
                  fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
                  letterSpacing: "0.06em",
                  textShadow: isSelected
                    ? "0 0 10px rgba(0, 229, 255, 0.8), 0 0 20px rgba(42, 114, 229, 0.4)"
                    : "0 0 6px rgba(42, 114, 229, 0.5), 0 0 12px rgba(42, 114, 229, 0.2)",
                  lineHeight: 1.25,
                  transition: "color 0.2s ease, text-shadow 0.2s ease",
                }}
              >
                {cat.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* ── Bottom ticker strip ── */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center"
        style={{
          top: "76%",
          gap: "clamp(10px, 2vw, 32px)",
          zIndex: 2,
        }}
      >
        {[
          { value: activeProjects, label: "Active Projects" },
          { value: formatNum(codeChanges), label: "Code Changes" },
          { value: formatNum(netGrowth), label: "Net Growth" },
        ].map((item, i) => (
          <span key={item.label} className="flex items-center" style={{ gap: "clamp(10px, 2vw, 32px)" }}>
            {i > 0 && (
              <span
                className="font-bold"
                style={{
                  fontSize: "clamp(9px, 1.3vw, 18px)",
                  color: "rgba(42, 114, 229, 0.6)",
                  fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
                }}
              >
                {"//"} {/* Comments inside children section should be in braces */}
              </span>
            )}
            <span
              className="font-bold uppercase"
              style={{
                fontSize: "clamp(9px, 1.3vw, 18px)",
                color: "#00e5ff",
                fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
                letterSpacing: "0.15em",
                textShadow:
                  "0 0 12px rgba(0, 229, 255, 0.6), 0 0 30px rgba(42, 114, 229, 0.4)",
              }}
            >
              {item.value} {item.label}
            </span>
          </span>
        ))}
      </div>

      {/* ── Category detail panel ── */}
      <AnimatePresence>
        {selectedCat && selectedIdx !== null && (
          <motion.div
            key={selectedCat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 flex flex-col m-auto"
            style={{
              width: "clamp(340px, 55vw, 640px)",
              height: "fit-content",
              zIndex: 60,
              background:
                "linear-gradient(180deg, rgba(8, 20, 50, 0.95) 0%, rgba(5, 12, 30, 0.98) 100%)",
              borderRadius: "12px",
              border: "1px solid rgba(42, 114, 229, 0.4)",
              boxShadow:
                "0 0 30px rgba(42, 114, 229, 0.3), 0 0 60px rgba(42, 114, 229, 0.1), inset 0 1px 0 rgba(100, 180, 255, 0.1)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Panel header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{
                borderBottom: "1px solid rgba(42, 114, 229, 0.25)",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="font-bold uppercase"
                  style={{
                    fontSize: "clamp(11px, 1.1vw, 16px)",
                    color: "#00e5ff",
                    fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
                    letterSpacing: "0.1em",
                    textShadow: "0 0 8px rgba(0, 229, 255, 0.4)",
                  }}
                >
                  {selectedCat.name}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "rgba(42, 114, 229, 0.3)",
                    color: "rgba(160, 215, 255, 0.9)",
                    border: "1px solid rgba(42, 114, 229, 0.3)",
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "clamp(9px, 0.8vw, 12px)",
                  }}
                >
                  {selectedCat.repoCount} repos
                </span>
              </div>
              <button
                onClick={() => setSelectedIdx(null)}
                className="text-gray-400 hover:text-white transition-colors"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  lineHeight: 1,
                  padding: "4px",
                }}
                aria-label="Close panel"
              >
                &times;
              </button>
            </div>

            {/* Repo list */}
            <div className="px-4 py-2">
              {selectedCat.repos.length === 0 ? (
                <div
                  className="py-4 text-center"
                  style={{
                    color: "rgba(140, 180, 220, 0.6)",
                    fontSize: "clamp(10px, 0.9vw, 13px)",
                    fontFamily: "'Share Tech Mono', monospace",
                  }}
                >
                  No project data available
                </div>
              ) : (
                (() => {
                  const sorted = [...selectedCat.repos].sort(
                    (a, b) =>
                      b.linesAdded + b.linesDeleted - (a.linesAdded + a.linesDeleted)
                  );
                  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
                  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

                  return (
                    <>
                      {paged.map((repo) => {
                        const net = repo.linesAdded - repo.linesDeleted;
                        return (
                          <a
                            key={repo.name}
                            href={
                              repo.githubUrl ||
                              `https://github.com/tokamak-network/${repo.name}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between py-2 group"
                            style={{
                              borderBottom: "1px solid rgba(42, 114, 229, 0.1)",
                              textDecoration: "none",
                            }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="shrink-0 rounded-full"
                                style={{
                                  width: 6,
                                  height: 6,
                                  background:
                                    repo.activity === "high"
                                      ? "#00ff88"
                                      : repo.activity === "medium"
                                      ? "#ffaa00"
                                      : "#555",
                                  boxShadow:
                                    repo.activity === "high"
                                      ? "0 0 6px rgba(0, 255, 136, 0.5)"
                                      : undefined,
                                }}
                              />
                              <div className="min-w-0">
                                <span
                                  className="block truncate font-semibold group-hover:text-cyan-300 transition-colors"
                                  style={{
                                    color: "rgba(200, 225, 255, 0.95)",
                                    fontSize: "clamp(10px, 0.9vw, 14px)",
                                    fontFamily: "'Share Tech Mono', monospace",
                                  }}
                                >
                                  {repo.name}
                                </span>
                                {repo.description && (
                                  <span
                                    className="block truncate"
                                    style={{
                                      color: "rgba(140, 170, 210, 0.6)",
                                      fontSize: "clamp(8px, 0.7vw, 11px)",
                                      fontFamily: "'Share Tech Mono', monospace",
                                      marginTop: 1,
                                    }}
                                  >
                                    {repo.description}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 ml-3">
                              <span
                                style={{
                                  color: "rgba(140, 200, 255, 0.7)",
                                  fontSize: "clamp(9px, 0.75vw, 12px)",
                                  fontFamily: "'Share Tech Mono', monospace",
                                }}
                              >
                                {formatLines(repo.linesAdded + repo.linesDeleted)}
                              </span>
                              <span
                                className="font-semibold"
                                style={{
                                  color: net >= 0 ? "#00ff88" : "#ff5555",
                                  fontSize: "clamp(9px, 0.75vw, 12px)",
                                  fontFamily: "'Share Tech Mono', monospace",
                                  minWidth: "clamp(40px, 4vw, 60px)",
                                  textAlign: "right",
                                }}
                              >
                                {net >= 0 ? "+" : ""}
                                {formatLines(net)}
                              </span>
                            </div>
                          </a>
                        );
                      })}

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div
                          className="flex items-center justify-center gap-3 pt-3 mt-1"
                          style={{
                            borderTop: "1px solid rgba(42, 114, 229, 0.15)",
                          }}
                        >
                          <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: page === 0 ? "default" : "pointer",
                              color: page === 0 ? "rgba(100, 140, 180, 0.3)" : "#00e5ff",
                              fontSize: "clamp(10px, 0.9vw, 14px)",
                              fontFamily: "'Orbitron', monospace",
                              padding: "2px 8px",
                            }}
                          >
                            &lt;
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setPage(i)}
                              style={{
                                background: i === page ? "rgba(42, 114, 229, 0.4)" : "none",
                                border: i === page ? "1px solid rgba(42, 114, 229, 0.6)" : "1px solid transparent",
                                borderRadius: 4,
                                cursor: "pointer",
                                color: i === page ? "#00e5ff" : "rgba(140, 200, 255, 0.5)",
                                fontSize: "clamp(9px, 0.8vw, 12px)",
                                fontFamily: "'Orbitron', monospace",
                                padding: "2px 8px",
                                minWidth: 28,
                              }}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page === totalPages - 1}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: page === totalPages - 1 ? "default" : "pointer",
                              color: page === totalPages - 1 ? "rgba(100, 140, 180, 0.3)" : "#00e5ff",
                              fontSize: "clamp(10px, 0.9vw, 14px)",
                              fontFamily: "'Orbitron', monospace",
                              padding: "2px 8px",
                            }}
                          >
                            &gt;
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background overlay to close panel on outside click */}
      {selectedIdx !== null && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 59, background: "rgba(0, 0, 0, 0.6)" }}
          onClick={() => setSelectedIdx(null)}
        />
      )}
    </div>
  );
}
