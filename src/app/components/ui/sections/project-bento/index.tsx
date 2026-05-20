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

/** A handful of vibrant palettes to cycle through on color-block tiles. */
const PALETTES = [
  { bg: "#FFFFFF", fg: "#0A0A14", accent: "#2A72E5" }, // 0 white card
  { bg: "#2A72E5", fg: "#FFFFFF", accent: "#00E5FF" }, // 1 tokamak blue
  { bg: "#00E5FF", fg: "#0A0A14", accent: "#2A72E5" }, // 2 cyan pop
  { bg: "#FACC15", fg: "#0A0A14", accent: "#2A72E5" }, // 3 gold
  { bg: "#EC4899", fg: "#FFFFFF", accent: "#FACC15" }, // 4 magenta
  { bg: "#22C55E", fg: "#0A0A14", accent: "#0A0A14" }, // 5 lime
];

function aggregateRepos(categories: EcosystemCategory[]): RepoData[] {
  const all: RepoData[] = [];
  for (const cat of categories) {
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

/** Build a hand-rhythmed mix of tile kinds + sizes interleaved with specials. */
function buildTiles(repos: RepoData[]): Tile[] {
  const tiles: Tile[] = [];
  const totalRepos = repos.length;

  // Pre-decide which repos get video tiles (top 2)
  const videoMap: Record<string, string> = {
    toki: "/showcase/toki.mp4",
    tokagent: "/showcase/tokagent.mp4",
  };

  repos.forEach((repo, i) => {
    const isTop2 = i < 2;
    const isTop6 = i < 6;
    let size: TileSize;
    if (isTop2) size = "2x2";
    else if (isTop6) size = "2x1";
    else size = "1x1";

    // Decide tile kind
    const video = videoMap[repo.name];
    const styleSeed = (i * 13 + repo.name.length) % 6;

    let tile: Tile;
    if (video) {
      tile = { kind: "project-video", size: "2x2", project: repo, video };
    } else if (isTop2 || (styleSeed === 0 && !isTop6)) {
      tile = { kind: "project-text", size, project: repo, palette: i % PALETTES.length };
    } else {
      tile = { kind: "project-image", size, project: repo };
    }
    tiles.push(tile);

    // Insert specials at key positions to break up rhythm
    if (i === 2) {
      tiles.push({ kind: "wordmark", size: "2x2" });
    } else if (i === 5) {
      tiles.push({
        kind: "statement",
        size: "2x1",
        text: "Privacy by mathematics, not by trust.",
        palette: 0,
      });
    } else if (i === 9) {
      tiles.push({
        kind: "metric",
        size: "1x1",
        value: String(totalRepos),
        label: "active repos",
        palette: 1,
      });
    } else if (i === 13) {
      tiles.push({
        kind: "statement",
        size: "2x1",
        text: "Multiple assets in. One proof out.",
        palette: 4,
      });
    } else if (i === 17) {
      tiles.push({
        kind: "cta",
        size: "2x1",
        text: "Explore on GitHub →",
      });
    } else if (i === 22) {
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

export default function ProjectBento({ categories }: Props) {
  const repos = aggregateRepos(categories);
  const tiles = buildTiles(repos);

  return (
    <section
      className="relative w-full bg-black py-20 sm:py-28 px-4 sm:px-6"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
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

      {/* Bento grid */}
      <div className="mx-auto" style={{ maxWidth: "1500px" }}>
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
            <TileRender key={i} tile={tile} />
          ))}
        </div>
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

/* ──────────────────────────────────────────────────────────
   Project tiles
   ────────────────────────────────────────────────────────── */

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
      <div>
        <h3
          className="leading-[0.92] tracking-[-0.03em] uppercase break-words"
          style={{
            fontWeight: 900,
            fontSize: tile.size === "2x2" ? "clamp(28px, 3.6vw, 56px)" : tile.size === "2x1" ? "clamp(22px, 2.6vw, 38px)" : "clamp(16px, 1.7vw, 22px)",
          }}
        >
          {tile.project.name}
        </h3>
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
            fontSize: tile.size === "2x2" ? "clamp(20px, 2.4vw, 32px)" : tile.size === "2x1" ? "clamp(16px, 1.8vw, 22px)" : "clamp(13px, 1.2vw, 16px)",
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

/* ──────────────────────────────────────────────────────────
   Special tiles
   ────────────────────────────────────────────────────────── */

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
        style={{
          fontWeight: 900,
          fontSize: "clamp(40px, 5vw, 88px)",
        }}
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
        style={{
          fontWeight: 900,
          fontSize: "clamp(20px, 2.4vw, 36px)",
        }}
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
      style={{ background: "#0A0A14", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.12)" }}
    >
      <h3
        className="leading-[0.96] tracking-[-0.03em] uppercase"
        style={{ fontWeight: 900, fontSize: "clamp(22px, 2.6vw, 38px)" }}
      >
        {tile.text}
      </h3>
      <span
        className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-black transition-transform group-hover:translate-x-1"
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
    </a>
  );
}

/* ──────────────────────────────────────────────────────────
   Shared bits
   ────────────────────────────────────────────────────────── */

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
