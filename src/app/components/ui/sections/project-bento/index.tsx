"use client";

import { useState, useEffect, useMemo } from "react";
import { type EcosystemCategory } from "@/app/lib/ecosystem-data";

interface Props {
  categories: EcosystemCategory[];
}

interface RepoData {
  name: string;
  description: string;
  githubUrl: string;
  activity: string;
  category: string;
  linesAdded: number;
}

type TileSize = "1x1" | "2x1" | "1x2" | "2x2";

type Tile =
  | { kind: "project-text"; size: TileSize; project: RepoData; palette: number }
  | { kind: "project-image"; size: TileSize; project: RepoData }
  | { kind: "project-video"; size: TileSize; project: RepoData; video: string }
  | { kind: "wordmark"; size: TileSize }
  | { kind: "statement"; size: TileSize; text: string; palette: number }
  | { kind: "metric"; size: TileSize; value: string; label: string; palette: number }
  | { kind: "cta"; size: TileSize; text: string };

const CATEGORY_BG: Record<string, string> = {
  Platform: "/cards/bg-platform-a.png",
  Infra: "/cards/bg-infra-a.png",
  "AI / ML": "/cards/bg-ai-a.png",
  ZK: "/cards/bg-zk-a.png",
  Lab: "/cards/bg-lab-a.png",
  Tool: "/cards/bg-tool-a.png",
  DeFi: "/cards/bg-defi-a.png",
  Social: "/cards/bg-social-a.png",
  Governance: "/cards/bg-governance-a.png",
  Analytics: "/cards/bg-analytics-a.png",
};

const PALETTES = [
  { bg: "#FFFFFF", fg: "#0A0A14" },
  { bg: "#2A72E5", fg: "#FFFFFF" },
  { bg: "#00E5FF", fg: "#0A0A14" },
  { bg: "#FACC15", fg: "#0A0A14" },
  { bg: "#EC4899", fg: "#FFFFFF" },
  { bg: "#22C55E", fg: "#0A0A14" },
];

const STATEMENT_POOL = [
  "Privacy by mathematics, not by trust.",
  "Multiple assets in. One proof out.",
  "Zero-knowledge. Infinitely verifiable.",
  "Compute privately. Verify publicly.",
  "The proof is in the math.",
  "Trustless. Verifiable. Private.",
];

const METRIC_POOL: { value: string; label: string }[] = [
  { value: "39", label: "active repos" },
  { value: "9", label: "categories" },
  { value: "10K+", label: "commits" },
  { value: "LIVE", label: "mainnet" },
  { value: "24/7", label: "uptime" },
  { value: "∞", label: "verifiability" },
];

const CTA_POOL = ["Explore on GitHub →", "Read the docs →", "Join the network →"];

const VIDEO_MAP: Record<string, string> = {
  toki: "/showcase/toki.mp4",
  tokagent: "/showcase/tokagent.mp4",
};

const CELLS_PER_PAGE = 30; // 6 cols × 5 rows worth of space per page
const AUTO_ROTATE_MS = 8500;

function sizeCells(s: TileSize): number {
  return s === "2x2" ? 4 : s === "1x1" ? 1 : 2;
}

function aggregateRepos(categories: EcosystemCategory[], filter: string): RepoData[] {
  const all: RepoData[] = [];
  for (const cat of categories) {
    if (filter !== "All" && cat.name !== filter) continue;
    for (const repo of cat.repos) {
      all.push({
        name: repo.name,
        description: repo.description,
        githubUrl: repo.githubUrl,
        activity: repo.activity,
        category: cat.name,
        linesAdded: repo.linesAdded ?? 0,
      });
    }
  }
  return all.sort((a, b) => b.linesAdded - a.linesAdded);
}

function buildTiles(repos: RepoData[], totalReposCount: number): Tile[] {
  const tiles: Tile[] = [];
  repos.forEach((repo, i) => {
    const video = VIDEO_MAP[repo.name];
    const isTop2 = i < 2;
    const isTop6 = i < 6;
    const size: TileSize = isTop2 ? "2x2" : isTop6 ? "2x1" : "1x1";
    const styleSeed = (i * 13 + repo.name.length) % 6;

    let tile: Tile;
    if (video) {
      tile = { kind: "project-video", size: "2x2", project: repo, video };
    } else if (isTop2 || (styleSeed === 0 && !isTop6)) {
      tile = {
        kind: "project-text",
        size,
        project: repo,
        palette: i % PALETTES.length,
      };
    } else {
      tile = { kind: "project-image", size, project: repo };
    }
    tiles.push(tile);

    // Inject specials at certain ranks (only for unfiltered / large sets)
    if (i === 2 && repos.length > 5) {
      tiles.push({ kind: "wordmark", size: "2x2" });
    } else if (i === 5 && repos.length > 8) {
      tiles.push({
        kind: "statement",
        size: "2x1",
        text: STATEMENT_POOL[0],
        palette: 0,
      });
    } else if (i === 9 && repos.length > 12) {
      tiles.push({
        kind: "metric",
        size: "1x1",
        value: String(totalReposCount),
        label: "active repos",
        palette: 1,
      });
    } else if (i === 13 && repos.length > 16) {
      tiles.push({
        kind: "statement",
        size: "2x1",
        text: STATEMENT_POOL[1],
        palette: 4,
      });
    } else if (i === 17 && repos.length > 20) {
      tiles.push({ kind: "cta", size: "2x1", text: CTA_POOL[0] });
    } else if (i === 22 && repos.length > 25) {
      tiles.push({
        kind: "metric",
        size: "1x1",
        value: "9",
        label: "categories",
        palette: 2,
      });
    }
  });
  return tiles;
}

/** Split flat tile list into pages, each ~CELLS_PER_PAGE cells worth. */
function paginate(tiles: Tile[]): Tile[][] {
  if (tiles.length === 0) return [[]];
  const pages: Tile[][] = [];
  let cur: Tile[] = [];
  let cells = 0;
  for (const t of tiles) {
    const c = sizeCells(t.size);
    if (cells + c > CELLS_PER_PAGE && cur.length > 0) {
      pages.push(cur);
      cur = [];
      cells = 0;
    }
    cur.push(t);
    cells += c;
  }
  if (cur.length > 0) pages.push(cur);
  return pages;
}

/** Pad a short page with dummy specials until it has roughly CELLS_PER_PAGE cells. */
function padPage(page: Tile[], seedOffset: number): Tile[] {
  let cells = page.reduce((s, t) => s + sizeCells(t.size), 0);
  let idx = 0;
  const out = [...page];
  while (cells < CELLS_PER_PAGE) {
    const remaining = CELLS_PER_PAGE - cells;
    const tile = makeFiller(seedOffset + idx, remaining);
    out.push(tile);
    cells += sizeCells(tile.size);
    idx++;
    if (idx > 30) break; // safety
  }
  return out;
}

function makeFiller(seed: number, remaining: number): Tile {
  const variant = seed % 5;
  if (variant === 0 && remaining >= 2) {
    return {
      kind: "statement",
      size: "2x1",
      text: STATEMENT_POOL[seed % STATEMENT_POOL.length],
      palette: seed % PALETTES.length,
    };
  }
  if (variant === 1) {
    const m = METRIC_POOL[seed % METRIC_POOL.length];
    return {
      kind: "metric",
      size: "1x1",
      value: m.value,
      label: m.label,
      palette: seed % PALETTES.length,
    };
  }
  if (variant === 2 && remaining >= 2) {
    return { kind: "cta", size: "2x1", text: CTA_POOL[seed % CTA_POOL.length] };
  }
  if (variant === 3 && remaining >= 2) {
    return {
      kind: "statement",
      size: "2x1",
      text: STATEMENT_POOL[(seed + 2) % STATEMENT_POOL.length],
      palette: (seed + 3) % PALETTES.length,
    };
  }
  return {
    kind: "metric",
    size: "1x1",
    value: METRIC_POOL[(seed + 1) % METRIC_POOL.length].value,
    label: METRIC_POOL[(seed + 1) % METRIC_POOL.length].label,
    palette: (seed + 4) % PALETTES.length,
  };
}

export default function ProjectBento({ categories }: Props) {
  const [selectedCat, setSelectedCat] = useState<string>("All");
  const [page, setPage] = useState(0);
  const [hovering, setHovering] = useState(false);

  const categoryNames = useMemo(
    () => ["All", ...categories.map((c) => c.name)],
    [categories]
  );

  const totalRepos = useMemo(
    () => categories.reduce((s, c) => s + c.repoCount, 0),
    [categories]
  );

  const pages = useMemo(() => {
    const filtered = aggregateRepos(categories, selectedCat);
    const tiles = buildTiles(filtered, totalRepos);
    const raw = paginate(tiles);
    return raw.map((p, i) => padPage(p, i * 7));
  }, [categories, selectedCat, totalRepos]);

  const totalPages = pages.length;

  useEffect(() => {
    setPage(0);
  }, [selectedCat]);

  useEffect(() => {
    if (hovering || totalPages <= 1) return;
    const t = setInterval(() => {
      setPage((p) => (p + 1) % totalPages);
    }, AUTO_ROTATE_MS);
    return () => clearInterval(t);
  }, [hovering, totalPages]);

  return (
    <section
      className="relative w-full bg-black py-20 sm:py-28 px-4 sm:px-6"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
          <span
            className="text-[10px] sm:text-[11px] tracking-[0.5em] text-[#7AB0FF]/85 uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            All Projects
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
        </div>
        <h2
          className="text-4xl sm:text-6xl lg:text-7xl text-white tracking-[-0.04em] leading-[0.95]"
          style={{ fontWeight: 900 }}
        >
          The whole <em className="not-italic text-[#7AB0FF]">network</em>,
          <br />
          at a glance.
        </h2>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 max-w-4xl mx-auto">
        {categoryNames.map((cat) => {
          const active = cat === selectedCat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] tracking-[0.22em] uppercase font-semibold transition-all
                ${
                  active
                    ? "bg-white text-black"
                    : "bg-white/[0.04] border border-white/15 text-white/70 hover:border-[#4A8EFA]/55 hover:text-white"
                }`}
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sliding pages */}
      <div className="mx-auto" style={{ maxWidth: "1500px" }}>
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${page * 100}%)`,
              width: `${totalPages * 100}%`,
            }}
          >
            {pages.map((tiles, pi) => (
              <div
                key={pi}
                className="w-full flex-shrink-0"
                style={{ width: `${100 / totalPages}%` }}
              >
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
                    gridAutoRows: "150px",
                    gridAutoFlow: "dense",
                    gap: "10px",
                  }}
                >
                  {tiles.map((tile, i) => (
                    <TileRender key={`${pi}-${i}`} tile={tile} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
              aria-label="Previous"
              className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/15 hover:border-[#4A8EFA]/55 text-white/80 transition-all flex items-center justify-center"
            >
              <span className="text-base leading-none">←</span>
            </button>
            <div className="flex items-center gap-1.5">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={`Page ${i + 1}`}
                  className="block h-1 rounded-full transition-all"
                  style={{
                    width: i === page ? "28px" : "5px",
                    background:
                      i === page
                        ? "rgba(255,255,255,0.95)"
                        : "rgba(255,255,255,0.3)",
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => (p + 1) % totalPages)}
              aria-label="Next"
              className="h-9 w-9 rounded-full bg-white/[0.06] border border-white/15 hover:border-[#4A8EFA]/55 text-white/80 transition-all flex items-center justify-center"
            >
              <span className="text-base leading-none">→</span>
            </button>
            <span
              className="ml-3 text-[10px] tracking-[0.25em] uppercase text-white/45"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {String(page + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function spanClass(size: TileSize): string {
  switch (size) {
    case "1x1":
      return "col-span-1 row-span-1";
    case "2x1":
      return "col-span-2 row-span-1";
    case "1x2":
      return "col-span-1 row-span-2";
    case "2x2":
      return "col-span-2 row-span-2";
  }
}

function TileRender({ tile }: { tile: Tile }) {
  const span = spanClass(tile.size);

  switch (tile.kind) {
    case "project-text":
      return <ProjectTextTile tile={tile} span={span} />;
    case "project-image":
      return <ProjectImageTile tile={tile} span={span} />;
    case "project-video":
      return <ProjectVideoTile tile={tile} span={span} />;
    case "wordmark":
      return <WordmarkTile span={span} />;
    case "statement":
      return <StatementTile tile={tile} span={span} />;
    case "metric":
      return <MetricTile tile={tile} span={span} />;
    case "cta":
      return <CtaTile tile={tile} span={span} />;
  }
}

function ProjectTextTile({
  tile,
  span,
}: {
  tile: Extract<Tile, { kind: "project-text" }>;
  span: string;
}) {
  const p = PALETTES[tile.palette];
  return (
    <a
      href={tile.project.githubUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`${span} relative rounded-2xl overflow-hidden group flex flex-col justify-between p-5 sm:p-6 transition-transform hover:scale-[1.01]`}
      style={{ background: p.bg, color: p.fg }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-[9px] tracking-[0.32em] uppercase font-semibold"
          style={{ fontFamily: "var(--font-geist-mono), monospace", opacity: 0.6 }}
        >
          {tile.project.category}
        </span>
        <ActivityDot activity={tile.project.activity} />
      </div>
      <h3
        className="leading-[0.92] tracking-[-0.03em] uppercase break-words"
        style={{
          fontWeight: 900,
          fontSize:
            tile.size === "2x2"
              ? "clamp(28px, 3.6vw, 56px)"
              : tile.size === "2x1"
              ? "clamp(22px, 2.6vw, 38px)"
              : "clamp(16px, 1.7vw, 22px)",
        }}
      >
        {tile.project.name}
      </h3>
    </a>
  );
}

function ProjectImageTile({
  tile,
  span,
}: {
  tile: Extract<Tile, { kind: "project-image" }>;
  span: string;
}) {
  const bg = CATEGORY_BG[tile.project.category] ?? "/cards/bg-tool-a.png";
  return (
    <a
      href={tile.project.githubUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`${span} relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#4A8EFA]/55 transition-all`}
    >
      <div
        className="absolute inset-0 transition-all duration-500 group-hover:scale-105"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.55,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/75 transition-all" />
      <ActivityDot activity={tile.project.activity} className="absolute top-3 right-3 z-10" />
      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end z-10">
        <div
          className="text-[9px] tracking-[0.3em] uppercase text-[#7AB0FF]/80 mb-1"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {tile.project.category}
        </div>
        <h3
          className="text-white leading-tight tracking-[-0.02em] uppercase line-clamp-2 group-hover:text-[#7AB0FF] transition-colors"
          style={{
            fontWeight: 800,
            fontSize:
              tile.size === "2x2"
                ? "clamp(20px, 2.4vw, 32px)"
                : tile.size === "2x1"
                ? "clamp(16px, 1.8vw, 22px)"
                : "clamp(13px, 1.2vw, 16px)",
          }}
        >
          {tile.project.name}
        </h3>
      </div>
    </a>
  );
}

function ProjectVideoTile({
  tile,
  span,
}: {
  tile: Extract<Tile, { kind: "project-video" }>;
  span: string;
}) {
  return (
    <a
      href={tile.project.githubUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`${span} relative rounded-2xl overflow-hidden group cursor-pointer border border-[#4A8EFA]/30 hover:border-[#4A8EFA]/70 transition-all`}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "contrast(1.1) brightness(0.65) saturate(0.95)" }}
      >
        <source src={tile.video} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <ActivityDot activity={tile.project.activity} className="absolute top-3 right-3 z-10" />
      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end z-10">
        <div
          className="text-[9px] tracking-[0.3em] uppercase text-[#7AB0FF] mb-2"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {tile.project.category} · Live Feed
        </div>
        <h3
          className="text-white leading-[0.92] tracking-[-0.03em] uppercase"
          style={{ fontWeight: 900, fontSize: "clamp(28px, 3.4vw, 52px)" }}
        >
          {tile.project.name}
        </h3>
        {tile.project.description && (
          <p className="text-xs sm:text-sm text-white/70 mt-2 line-clamp-2 max-w-md">
            {tile.project.description}
          </p>
        )}
      </div>
    </a>
  );
}

function WordmarkTile({ span }: { span: string }) {
  return (
    <div
      className={`${span} relative rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4`}
      style={{ background: "#FFFFFF", color: "#0A0A14" }}
    >
      <div
        className="text-[9px] tracking-[0.5em] uppercase mb-2"
        style={{ fontFamily: "var(--font-geist-mono), monospace", color: "#2A72E5" }}
      >
        Tokamak Network
      </div>
      <div
        className="leading-none tracking-[-0.06em] text-center"
        style={{ fontWeight: 900, fontSize: "clamp(40px, 5vw, 88px)" }}
      >
        tokamak
      </div>
      <div
        className="mt-3 text-[10px] tracking-[0.4em] uppercase"
        style={{ fontFamily: "var(--font-geist-mono), monospace", color: "rgba(0,0,0,0.45)" }}
      >
        zk · l2 · privacy
      </div>
    </div>
  );
}

function StatementTile({
  tile,
  span,
}: {
  tile: Extract<Tile, { kind: "statement" }>;
  span: string;
}) {
  const p = PALETTES[tile.palette];
  return (
    <div
      className={`${span} relative rounded-2xl overflow-hidden flex items-center px-6 sm:px-8`}
      style={{ background: p.bg, color: p.fg }}
    >
      <h3
        className="leading-[0.96] tracking-[-0.03em]"
        style={{ fontWeight: 900, fontSize: "clamp(20px, 2.4vw, 36px)" }}
      >
        {tile.text}
      </h3>
    </div>
  );
}

function MetricTile({
  tile,
  span,
}: {
  tile: Extract<Tile, { kind: "metric" }>;
  span: string;
}) {
  const p = PALETTES[tile.palette];
  return (
    <div
      className={`${span} relative rounded-2xl overflow-hidden flex flex-col justify-between p-5`}
      style={{ background: p.bg, color: p.fg }}
    >
      <div
        className="text-[9px] tracking-[0.32em] uppercase font-semibold opacity-65"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {tile.label}
      </div>
      <div
        className="leading-none tracking-[-0.06em]"
        style={{ fontWeight: 900, fontSize: "clamp(48px, 5.5vw, 84px)" }}
      >
        {tile.value}
      </div>
    </div>
  );
}

function CtaTile({
  tile,
  span,
}: {
  tile: Extract<Tile, { kind: "cta" }>;
  span: string;
}) {
  return (
    <a
      href="https://github.com/tokamak-network"
      target="_blank"
      rel="noopener noreferrer"
      className={`${span} relative rounded-2xl overflow-hidden flex items-center justify-between px-6 sm:px-8 transition-all hover:scale-[1.01] group`}
      style={{
        background: "#0A0A14",
        color: "#FFFFFF",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <h3
        className="leading-[0.96] tracking-[-0.03em] uppercase"
        style={{ fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 38px)" }}
      >
        {tile.text}
      </h3>
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-black transition-transform group-hover:translate-x-1">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 7h8m0 0L7 3m4 4l-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}

function ActivityDot({
  activity,
  className = "",
}: {
  activity: string;
  className?: string;
}) {
  const color =
    activity === "high"
      ? "#4ade80"
      : activity === "medium"
      ? "#facc15"
      : "rgba(255,255,255,0.3)";
  const glow =
    activity === "high"
      ? "0 0 6px #4ade80"
      : activity === "medium"
      ? "0 0 4px #facc15"
      : "none";
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${className}`}
      style={{ background: color, boxShadow: glow }}
    />
  );
}
