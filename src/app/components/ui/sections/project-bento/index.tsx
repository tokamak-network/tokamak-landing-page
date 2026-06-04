"use client";

import { useState, useMemo, useEffect } from "react";
import { type EcosystemCategory } from "@/app/lib/ecosystem-data";
import { SHOWCASE_CLIPS, type ShowcaseClip } from "../product-showcase/clips";
import LazyVideo from "@/app/components/shared/LazyVideo";

/** Every bento video ships a sibling `<name>-poster.jpg` next to the .mp4. */
const posterFor = (src: string) => src.replace(/\.mp4$/, "-poster.jpg");

interface Props {
  categories: EcosystemCategory[];
  latestReportHref?: string;
}

interface RepoData {
  name: string;
  description: string;
  githubUrl: string;
  activity: string;
  category: string;
  linesAdded: number;
  /** 0-based index within the repo's ecosystem category (assigned at aggregate time). */
  categoryIndex: number;
}

type TileSize = "1x1" | "2x1" | "1x2" | "2x2";

type Tile =
  | { kind: "project-text"; size: TileSize; project: RepoData; palette: number }
  | { kind: "project-image"; size: TileSize; project: RepoData }
  | { kind: "project-video"; size: TileSize; project: RepoData; video: string }
  | { kind: "production"; size: TileSize; clip: ShowcaseClip }
  | { kind: "wordmark"; size: TileSize }
  | { kind: "statement"; size: TileSize; text: string; palette: number; href?: string; eyebrow?: string }
  | { kind: "metric"; size: TileSize; value: string; label: string; palette: number }
  | { kind: "cta"; size: TileSize; text: string; href?: string; eyebrow?: string }
  | {
      kind: "filler-video";
      size: TileSize;
      video: string;
      caption?: string;
      /** Optional big overlay (mutually exclusive with caption usage). */
      overlayTitle?: string;
      overlaySubtitle?: string;
      href?: string;
    };

/**
 * Background image pool per ecosystem category. When a category has more
 * than one image, `pickCategoryBg` hashes the repo name to deterministically
 * pick one — so the same repo always renders with the same background.
 */
const CATEGORY_BG_POOL: Record<string, string[]> = {
  Platform: [
    "/cards/bg-platform-a.jpeg",
    "/cards/bg-platform-b.jpeg",
    "/cards/bg-platform-c.jpeg",
    "/cards/bg-platform-d.jpeg",
    "/cards/bg-platform-e.jpeg",
    "/cards/bg-platform-f.jpeg",
    "/cards/bg-platform-g.jpeg",
  ],
  Infra: [
    "/cards/bg-infra-a.jpeg",
    "/cards/bg-infra-b.jpeg",
    "/cards/bg-infra-c.jpeg",
  ],
  "AI / ML": ["/cards/bg-ai-a.jpeg"],
  ZK: ["/cards/bg-zk-a.jpeg"],
  Lab: ["/cards/bg-lab-a.jpeg"],
  Tool: ["/cards/bg-tool-a.jpeg"],
  DeFi: ["/cards/bg-defi-a.jpeg", "/cards/bg-defi-b.jpeg"],
  Social: ["/cards/bg-social-a.jpeg"],
  Governance: ["/cards/bg-governance-a.jpeg"],
  Analytics: ["/cards/bg-analytics-a.jpeg"],
};

const CATEGORY_BG_FALLBACK = "/cards/bg-tool-a.jpeg";

function pickCategoryBg(category: string, categoryIndex: number): string {
  const pool = CATEGORY_BG_POOL[category];
  if (!pool || pool.length === 0) return CATEGORY_BG_FALLBACK;
  if (pool.length === 1) return pool[0];
  // Round-robin across the pool by the repo's category-local index so that
  // every image in the pool is used as soon as the category has enough repos.
  return pool[categoryIndex % pool.length];
}

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
  { value: "39", label: "active projects" },
  { value: "9", label: "categories" },
  { value: "10K+", label: "commits" },
  { value: "24/7", label: "uptime" },
  { value: "∞", label: "verifiability" },
];

const CTA_POOL = ["Explore on GitHub →", "Read the docs →", "Join the network →"];

const FILLER_VIDEO_POOL: { src: string; caption: string }[] = [
  { src: "/intro-video.mp4", caption: "Particles · Distribution" },
  { src: "/showcase/fillers/blue-liquid.mp4", caption: "Energy · Flow" },
  { src: "/showcase/fillers/nebula.mp4", caption: "Cosmos · Network" },
];

const VIDEO_MAP: Record<string, string> = {
  toki: "/showcase/toki.mp4",
  tokagent: "/showcase/tokagent.mp4",
};

function sizeCells(s: TileSize): number {
  return s === "2x2" ? 4 : s === "1x1" ? 1 : 2;
}

/**
 * Repo names (from ecosystem-data) that should be hidden from the regular
 * grid because they're already represented as a production showcase tile.
 * Includes both the showcase id and any divergent ecosystem-data repo name.
 */
const PRODUCTION_REPO_NAMES = new Set<string>([
  ...SHOWCASE_CLIPS.map((c) => c.id.toLowerCase()),
  "tokamak-rollup-hub-v2", // rolluphub showcase ↔ ecosystem repo
]);

/**
 * Maps each production showcase clip to its corresponding ecosystem category.
 * Used to filter production cards when a category chip is selected — e.g.,
 * selecting "AI / ML" shows tokagent but hides toki/tonnel.
 */
const PRODUCTION_ECOSYSTEM_CATEGORY: Record<string, string> = {
  toki: "Platform",
  tokagent: "AI / ML",
  tonnel: "ZK",
  rolluphub: "Infra",
};

/**
 * Repo-name → live product URL overrides. When set, the regular grid card
 * for the repo links to the production site instead of the repo's GitHub
 * page. Keys are matched case-insensitively against ecosystem-data names.
 */
const PROJECT_LIVE_URL: Record<string, string> = {
  "tokamon-io": "https://tokamon.io/",
  tokamon: "https://tokamon-go.web.app/",
};

function projectLinkFor(repo: RepoData): string {
  return (
    PROJECT_LIVE_URL[repo.name.toLowerCase()] || repo.githubUrl || "#"
  );
}

function aggregateRepos(categories: EcosystemCategory[], filter: string): RepoData[] {
  const all: RepoData[] = [];
  const categoryCounter: Record<string, number> = {};
  for (const cat of categories) {
    if (filter !== "All" && cat.name !== filter) continue;
    for (const repo of cat.repos) {
      // Skip repos that are already represented as production showcase tiles
      if (PRODUCTION_REPO_NAMES.has(repo.name.toLowerCase())) continue;
      const idx = categoryCounter[cat.name] ?? 0;
      categoryCounter[cat.name] = idx + 1;
      all.push({
        name: repo.name,
        description: repo.description,
        githubUrl: repo.githubUrl,
        activity: repo.activity,
        category: cat.name,
        linesAdded: repo.linesAdded ?? 0,
        categoryIndex: idx,
      });
    }
  }
  return all.sort((a, b) => b.linesAdded - a.linesAdded);
}

function buildTiles(repos: RepoData[]): Tile[] {
  // Pure repo tiles — specials are woven in by the caller so the same set
  // of special cards (wordmark, statements, filler videos, CTAs) shows up
  // for both "All" and individual category filters.
  return repos.map((repo, i) => {
    const video = VIDEO_MAP[repo.name];
    const isWide = i < 8;
    const size: TileSize = isWide ? "2x1" : "1x1";
    const styleSeed = (i * 13 + repo.name.length) % 6;

    if (video) {
      return { kind: "project-video", size: "2x2", project: repo, video };
    }
    if (styleSeed === 0) {
      return {
        kind: "project-text",
        size,
        project: repo,
        palette: i % PALETTES.length,
      };
    }
    return { kind: "project-image", size, project: repo };
  });
}

/** Specials shown across every view (All + each category filter). */
function buildSpecials(latestReportHref?: string): Tile[] {
  return [
    { kind: "wordmark", size: "2x2" },
    {
      kind: "statement",
      size: "2x1",
      text: STATEMENT_POOL[0],
      palette: 0,
    },
    { kind: "filler-video", size: "2x2", video: FILLER_VIDEO_POOL[0].src },
    {
      kind: "statement",
      size: "2x1",
      text: "Sourced from the latest biweekly report.",
      palette: 4,
      eyebrow: "Live data",
      href: latestReportHref,
    },
    {
      kind: "statement",
      size: "2x1",
      text: "Built in the open.",
      palette: 1,
    },
    {
      kind: "statement",
      size: "2x1",
      text: "Launch your own L2.",
      palette: 3,
      eyebrow: "Build",
      href: "https://rolluphub.tokamak.network/",
    },
    {
      kind: "metric",
      size: "1x1",
      value: "2017",
      label: "EST.",
      palette: 0,
    },
    {
      kind: "filler-video",
      size: "2x2",
      video: FILLER_VIDEO_POOL[2].src,
      overlayTitle: "Explore on GitHub",
      href: "https://github.com/tokamak-network",
    },
  ];
}

const GRID_COLS = 6;

/**
 * Pad a tile list so the final grid is a complete rectangle:
 *   1. Reach at least minCells with a mix of filler tiles.
 *   2. Round the total cell count up to a multiple of GRID_COLS using
 *      1x1 fillers so the final row is fully filled.
 */
function padTiles(tiles: Tile[], minCells: number): Tile[] {
  let cells = tiles.reduce((s, t) => s + sizeCells(t.size), 0);
  let idx = 0;
  const out = [...tiles];

  while (cells < minCells) {
    const remaining = minCells - cells;
    const tile = makeFiller(idx, remaining);
    out.push(tile);
    cells += sizeCells(tile.size);
    idx++;
    if (idx > 60) break;
  }

  // Round up to a perfect multiple of GRID_COLS with 1x1 fillers so the
  // final row is always completely filled. Dense auto-flow then backfills
  // any gaps left by 2x2/2x1 tiles at row edges.
  while (cells % GRID_COLS !== 0) {
    out.push(makeSmallFiller(idx));
    cells += 1;
    idx++;
    if (idx > 200) break;
  }

  return out;
}

/**
 * Style fingerprint used to detect visually similar adjacent tiles.
 * Tiles with the same key (e.g., two Platform background images side by
 * side, or two yellow palette statements) should be spaced apart.
 */
function tileStyleKey(tile: Tile): string {
  switch (tile.kind) {
    case "project-text":
      return `text-${tile.palette}`;
    case "project-image":
      return `image-${tile.project.category}`;
    case "project-video":
      return `video`;
    case "production":
      return `prod-${tile.clip.id}`;
    case "wordmark":
      return `wordmark`;
    case "statement":
      return `statement-${tile.palette}`;
    case "metric":
      return `metric-${tile.palette}`;
    case "cta":
      return `cta`;
    case "filler-video":
      return `filler`;
  }
}

/**
 * Greedy pass: when two adjacent tiles share the same style fingerprint,
 * swap the second one with the next equally-sized tile that breaks the
 * sequence. Same-size constraint keeps the grid layout stable.
 */
function avoidAdjacentDupes(tiles: Tile[]): Tile[] {
  const out = [...tiles];
  for (let i = 1; i < out.length; i++) {
    const prevKey = tileStyleKey(out[i - 1]);
    if (tileStyleKey(out[i]) !== prevKey) continue;
    for (let j = i + 1; j < out.length; j++) {
      if (out[j].size !== out[i].size) continue;
      const swapKey = tileStyleKey(out[j]);
      if (swapKey === prevKey) continue;
      // Also avoid creating a new dup at position j with its new neighbors.
      const nextKey = i + 1 < out.length ? tileStyleKey(out[i + 1]) : null;
      if (swapKey === nextKey) continue;
      [out[i], out[j]] = [out[j], out[i]];
      break;
    }
  }
  return out;
}

function makeSmallFiller(seed: number): Tile {
  const m = METRIC_POOL[seed % METRIC_POOL.length];
  return {
    kind: "metric",
    size: "1x1",
    value: m.value,
    label: m.label,
    palette: (seed + 2) % PALETTES.length,
  };
}

function makeFiller(seed: number, remaining: number): Tile {
  const variant = seed % 7;
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
  if (variant === 2 && remaining >= 4) {
    const v = FILLER_VIDEO_POOL[seed % FILLER_VIDEO_POOL.length];
    return { kind: "filler-video", size: "2x2", video: v.src, caption: v.caption };
  }
  if (variant === 3 && remaining >= 2) {
    return { kind: "cta", size: "2x1", text: CTA_POOL[seed % CTA_POOL.length] };
  }
  if (variant === 4 && remaining >= 2) {
    const v = FILLER_VIDEO_POOL[(seed + 1) % FILLER_VIDEO_POOL.length];
    return { kind: "filler-video", size: "2x1", video: v.src, caption: v.caption };
  }
  if (variant === 5 && remaining >= 2) {
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

export default function ProjectBento({ categories, latestReportHref }: Props) {
  const [selectedCat, setSelectedCat] = useState<string>("All");
  // SSR-safe: start with original order, then shuffle after mount so the
  // featured production card varies between page loads.
  const [shuffledClips, setShuffledClips] = useState<ShowcaseClip[]>(SHOWCASE_CLIPS);

  useEffect(() => {
    const arr = [...SHOWCASE_CLIPS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledClips(arr);
  }, []);

  const categoryNames = useMemo(
    () => ["All", ...categories.map((c) => c.name)],
    [categories]
  );

  const tiles = useMemo(() => {
    const filtered = aggregateRepos(categories, selectedCat);
    const built = buildTiles(filtered);
    const specials = buildSpecials(latestReportHref);

    // Filter production clips by selected category (when not "All"), then
    // pad with undefined so the woven layout slots remain stable.
    const visibleClips =
      selectedCat === "All"
        ? shuffledClips
        : shuffledClips.filter(
            (c) => PRODUCTION_ECOSYSTEM_CATEGORY[c.id] === selectedCat
          );
    const [first, second, third, fourth] = visibleClips;
    const prodTile = (clip: ShowcaseClip): Tile => ({
      kind: "production" as const,
      size: "2x2" as const,
      clip,
    });
    const [
      wordmark,
      statementPrivacy,
      fillerIntro,
      biweeklyCta,
      statementOpen,
      launchL2,
      estMetric,
      fillerNebula,
    ] = specials;

    // Weave production cards + specials across the repo tile list. The
    // splice points are deliberate so the same set of special cards appears
    // in every view (All + each category) but distributed across the grid.
    // If `built` is short (small category), trailing slices come back empty
    // and the specials simply collapse together — still uniform across views.
    const woven: Tile[] = [
      ...(first ? [prodTile(first)] : []),
      ...built.slice(0, 3),
      wordmark,
      ...built.slice(3, 5),
      statementPrivacy,
      ...built.slice(5, 7),
      fillerIntro,
      ...built.slice(7, 9),
      ...(second ? [prodTile(second)] : []),
      ...built.slice(9, 11),
      biweeklyCta,
      ...built.slice(11, 13),
      statementOpen,
      ...built.slice(13, 15),
      launchL2,
      ...built.slice(15, 17),
      estMetric,
      ...built.slice(17, 19),
      ...(third ? [prodTile(third)] : []),
      ...built.slice(19, 21),
      fillerNebula,
      ...built.slice(21, 24),
      ...(fourth ? [prodTile(fourth)] : []),
      ...built.slice(24),
    ];

    return avoidAdjacentDupes(padTiles(woven, 30));
  }, [categories, selectedCat, shuffledClips, latestReportHref]);

  return (
    <section
      className="relative w-full bg-black py-20 sm:py-28 px-4 sm:px-6"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
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

      {/* Full bento grid — no pagination, scrolls naturally with page */}
      <div className="mx-auto" style={{ maxWidth: "1500px" }}>
        <div
          className="grid grid-cols-3 sm:grid-cols-6 [grid-auto-rows:120px] sm:[grid-auto-rows:140px] lg:[grid-auto-rows:150px] [grid-auto-flow:dense] gap-2 sm:gap-2.5"
        >
          {tiles.map((tile, i) => (
            <TileRender key={i} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function spanClass(size: TileSize): string {
  // Mobile (grid-cols-3) ladder of sizes:
  //   1x1 → 1 col (small)
  //   2x1 → 2 cols (mid — pairs with a 1x1 on its right)
  //   2x2 → full row (hero, takes all 3 cols)
  //   1x2 → 1 col tall
  // On sm+ (grid-cols-6) they revert to their natural spans.
  switch (size) {
    case "1x1":
      return "col-span-1 row-span-1";
    case "2x1":
      return "col-span-2 row-span-1";
    case "1x2":
      return "col-span-1 row-span-2";
    case "2x2":
      return "col-span-3 row-span-2 sm:col-span-2";
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
    case "production":
      return <ProductionTile tile={tile} span={span} />;
    case "wordmark":
      return <WordmarkTile span={span} />;
    case "statement":
      return <StatementTile tile={tile} span={span} />;
    case "metric":
      return <MetricTile tile={tile} span={span} />;
    case "cta":
      return <CtaTile tile={tile} span={span} />;
    case "filler-video":
      return <FillerVideoTile tile={tile} span={span} />;
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
      href={projectLinkFor(tile.project)}
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
        <div className="flex items-center gap-2">
          <ExternalLinkIcon className="opacity-50 group-hover:opacity-100 transition-opacity" />
          <ActivityDot activity={tile.project.activity} />
        </div>
      </div>
      <div>
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
        {tile.project.description && (
          <p
            className={tile.size === "1x1" ? "mt-1 line-clamp-1" : "mt-2 line-clamp-2"}
            style={{
              fontSize:
                tile.size === "2x2" ? "13px" : tile.size === "1x1" ? "10px" : "12px",
              opacity: 0.72,
              lineHeight: 1.35,
            }}
          >
            {tile.project.description}
          </p>
        )}
      </div>
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
  const bg = pickCategoryBg(tile.project.category, tile.project.categoryIndex);
  return (
    <a
      href={projectLinkFor(tile.project)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${span} relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#4A8EFA]/55 transition-all`}
    >
      {/* Native lazy-loading: off-screen card backgrounds (a few MB each) are
          not fetched until the tile nears the viewport, so they don't compete
          with the hero on initial load. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={bg}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-55 transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/75 transition-all" />
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2 text-white">
        <ExternalLinkIcon className="opacity-55 group-hover:opacity-100 transition-opacity" />
        <ActivityDot activity={tile.project.activity} />
      </div>
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
        {tile.project.description && (
          <p
            className={`text-white/70 ${tile.size === "1x1" ? "mt-1 line-clamp-1" : "mt-1.5 line-clamp-2"}`}
            style={{
              fontSize:
                tile.size === "2x2" ? "13px" : tile.size === "1x1" ? "10px" : "12px",
              lineHeight: 1.35,
            }}
          >
            {tile.project.description}
          </p>
        )}
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
      href={projectLinkFor(tile.project)}
      target="_blank"
      rel="noopener noreferrer"
      className={`${span} relative rounded-2xl overflow-hidden group cursor-pointer border border-[#4A8EFA]/30 hover:border-[#4A8EFA]/70 transition-all`}
    >
      <LazyVideo
        src={tile.video}
        poster={posterFor(tile.video)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: "contrast(1.1) brightness(0.65) saturate(0.95)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2 text-white">
        <ExternalLinkIcon className="opacity-55 group-hover:opacity-100 transition-opacity" />
        <ActivityDot activity={tile.project.activity} />
      </div>
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

function ProductionTile({
  tile,
  span,
}: {
  tile: Extract<Tile, { kind: "production" }>;
  span: string;
}) {
  const { clip } = tile;
  const hasVideo = Boolean(clip.videoMp4);
  return (
    <a
      href={clip.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${span} relative rounded-2xl overflow-hidden group cursor-pointer border border-[#4A8EFA]/30 hover:border-[#4A8EFA]/70 transition-all`}
    >
      {hasVideo ? (
        // key={clip.id} remounts LazyVideo when the production card at this grid
        // slot changes (e.g., after the mount-time shuffle), so the new clip's
        // source is picked up instead of the previous one continuing to play.
        <LazyVideo
          key={clip.id}
          src={clip.videoMp4 as string}
          poster={clip.poster}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "contrast(1.1) brightness(0.65) saturate(0.95)" }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 90% at 50% 40%, ${clip.color}55 0%, ${clip.color}22 40%, #0A0A14 80%)`,
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* "Live" indicator pill */}
      <div
        className="absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-sm border border-white/15"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full animate-pulse"
          style={{ background: clip.color, boxShadow: `0 0 8px ${clip.color}` }}
        />
        <span className="text-[9px] tracking-[0.32em] uppercase text-white/85 font-semibold">
          Live
        </span>
      </div>

      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end z-10">
        <div
          className="text-[9px] tracking-[0.3em] uppercase mb-2"
          style={{
            color: clip.color,
            fontFamily: "var(--font-geist-mono), monospace",
            textShadow: `0 0 10px ${clip.color}88`,
          }}
        >
          {clip.category}
        </div>
        <h3
          className="text-white leading-[0.92] tracking-[-0.03em] uppercase"
          style={{ fontWeight: 900, fontSize: "clamp(28px, 3.4vw, 52px)" }}
        >
          {clip.name}
        </h3>
        <p className="text-xs sm:text-sm text-white/70 mt-2 line-clamp-2 max-w-md">
          {clip.description}
        </p>
      </div>
    </a>
  );
}

function WordmarkTile({ span }: { span: string }) {
  return (
    <div
      className={`${span} relative rounded-2xl overflow-hidden flex flex-col items-center justify-center text-center p-6`}
      style={{ background: "#FFFFFF", color: "#0A0A14" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/tokamak-symbol.svg"
        alt="Tokamak Network"
        className="mb-4"
        style={{ width: "clamp(38px, 4.2vw, 64px)", height: "auto" }}
      />
      <h3
        className="leading-[0.9] tracking-[-0.04em] uppercase"
        style={{ fontWeight: 900, fontSize: "clamp(28px, 3.4vw, 52px)" }}
      >
        Tokamak
        <br />
        Network
      </h3>
      <div
        className="mt-4 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] tracking-[0.32em] uppercase font-semibold"
        style={{ fontFamily: "var(--font-geist-mono), monospace", color: "#2A72E5" }}
      >
        <span>privacy</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <span>zk</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <span>custom L2</span>
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
  const Wrapper = tile.href ? "a" : "div";
  const wrapperProps = tile.href
    ? {
        href: tile.href,
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {};
  const arrowBg = p.fg;
  const arrowFg = p.bg;
  return (
    <Wrapper
      {...wrapperProps}
      className={`${span} relative rounded-2xl overflow-hidden flex items-center justify-between gap-4 px-6 sm:px-8 ${tile.href ? "transition-transform hover:scale-[1.01] group" : ""}`}
      style={{ background: p.bg, color: p.fg }}
    >
      <div className="min-w-0 flex-1">
        {tile.eyebrow && (
          <div
            className="text-[9px] sm:text-[10px] tracking-[0.42em] uppercase font-semibold mb-2 opacity-70"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {tile.eyebrow}
          </div>
        )}
        <h3
          className="leading-[0.96] tracking-[-0.03em]"
          style={{
            fontWeight: 900,
            fontSize: tile.eyebrow
              ? "clamp(18px, 2vw, 30px)"
              : "clamp(20px, 2.4vw, 36px)",
          }}
        >
          {tile.text}
        </h3>
      </div>
      {tile.href && (
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-transform group-hover:translate-x-1 flex-shrink-0"
          style={{ background: arrowBg, color: arrowFg }}
        >
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
      )}
    </Wrapper>
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
      className={`${span} relative rounded-2xl overflow-hidden flex flex-col justify-between p-3 sm:p-5`}
      style={{ background: p.bg, color: p.fg }}
    >
      <div
        className="text-[8px] sm:text-[9px] tracking-[0.28em] sm:tracking-[0.32em] uppercase font-semibold opacity-65"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {tile.label}
      </div>
      <div
        className="leading-none tracking-[-0.06em] break-all"
        style={{ fontWeight: 900, fontSize: "clamp(26px, 6.5vw, 84px)" }}
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
  const href = tile.href || "https://github.com/tokamak-network";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${span} relative rounded-2xl overflow-hidden flex items-center justify-between gap-4 px-6 sm:px-7 transition-all hover:scale-[1.01] group`}
      style={{
        background: "#0A0A14",
        color: "#FFFFFF",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div className="min-w-0 flex-1">
        {tile.eyebrow && (
          <div
            className="text-[9px] sm:text-[10px] tracking-[0.42em] uppercase text-[#7AB0FF]/85 font-semibold mb-1.5"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {tile.eyebrow}
          </div>
        )}
        <h3
          className="leading-[1.02] tracking-[-0.02em]"
          style={{
            fontWeight: 800,
            fontSize: tile.eyebrow
              ? "clamp(15px, 1.6vw, 22px)"
              : "clamp(22px, 2.6vw, 38px)",
            textTransform: tile.eyebrow ? "none" : "uppercase",
          }}
        >
          {tile.text}
        </h3>
      </div>
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-black transition-transform group-hover:translate-x-1 flex-shrink-0">
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

function FillerVideoTile({
  tile,
  span,
}: {
  tile: Extract<Tile, { kind: "filler-video" }>;
  span: string;
}) {
  const hasOverlay = Boolean(tile.overlayTitle || tile.overlaySubtitle);
  const Wrapper = tile.href ? "a" : "div";
  const wrapperProps = tile.href
    ? {
        href: tile.href,
        target: "_blank" as const,
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`${span} relative rounded-2xl overflow-hidden group border border-white/10 ${tile.href ? "hover:border-[#4A8EFA]/55 transition-all" : ""}`}
    >
      <LazyVideo
        src={tile.video}
        poster={posterFor(tile.video)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: hasOverlay
            ? "contrast(1.1) brightness(0.55) saturate(0.95)"
            : "contrast(1.08) brightness(0.78) saturate(0.95)",
        }}
      />

      {/* Gradient for readability — heavier when there's an overlay */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          hasOverlay
            ? "bg-gradient-to-t from-black/75 via-black/30 to-black/15"
            : "bg-gradient-to-t from-black/55 via-transparent to-transparent"
        }`}
      />

      {/* Caption — small label */}
      {tile.caption && (
        <div
          className="absolute right-4 top-4 text-[9px] tracking-[0.32em] uppercase text-white/65 font-semibold pointer-events-none"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {tile.caption}
        </div>
      )}

      {/* Big overlay content — layout differs for CTA (vertical) vs metric (horizontal) */}
      {hasOverlay && !tile.href && (
        // METRIC variant: horizontal layout — subtitle left, huge number right.
        // Works for 2x1 cards (~150px tall) where vertical stacking overflows.
        <div className="absolute inset-0 flex items-center justify-between gap-4 px-5 sm:px-7 z-10 pointer-events-none">
          {tile.overlaySubtitle && (
            <div
              className="text-[11px] sm:text-[13px] tracking-[0.42em] uppercase text-white/85 font-semibold max-w-[40%] leading-tight"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {tile.overlaySubtitle}
            </div>
          )}
          {tile.overlayTitle && (
            <div
              className="text-white leading-[0.85] tracking-[-0.05em] uppercase text-right"
              style={{
                fontWeight: 900,
                fontSize:
                  tile.size === "2x2"
                    ? "clamp(56px, 8vw, 120px)"
                    : "clamp(52px, 6.5vw, 96px)",
              }}
            >
              {tile.overlayTitle}
            </div>
          )}
        </div>
      )}
      {hasOverlay && tile.href && (
        // CTA variant: each word on its own line stacked at the bottom-left;
        // arrow pinned to the bottom-right corner.
        <div className="absolute inset-0 z-10 pointer-events-none">
          {tile.overlaySubtitle && (
            <div
              className="absolute top-5 sm:top-7 left-5 sm:left-7 right-5 sm:right-7 text-[11px] sm:text-[13px] tracking-[0.42em] uppercase text-white/85 font-semibold"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {tile.overlaySubtitle}
            </div>
          )}
          {tile.overlayTitle && (
            <div
              className="absolute left-5 sm:left-7 bottom-5 sm:bottom-7 text-white tracking-[-0.03em] uppercase"
              style={{
                fontWeight: 900,
                fontSize: tile.size === "2x2" ? "50px" : "clamp(40px, 5vw, 72px)",
                lineHeight: tile.size === "2x2" ? 1.05 : 0.88,
              }}
            >
              {tile.overlayTitle.split(/\s+/).map((word, i) => (
                <div key={i}>{word}</div>
              ))}
            </div>
          )}
          <span className="absolute right-5 sm:right-7 bottom-5 sm:bottom-7 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-black transition-transform group-hover:translate-x-1">
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
        </div>
      )}
    </Wrapper>
  );
}

/** Diagonal "external link" arrow — small click-affordance for repo tiles. */
function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={className}
    >
      <path
        d="M4 8L8 4M8 4H5M8 4V7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
