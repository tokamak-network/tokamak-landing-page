import { type EcosystemCategory } from "@/app/lib/ecosystem-data";

interface Props {
  categories: EcosystemCategory[];
}

interface ProjectTile {
  name: string;
  description: string;
  githubUrl: string;
  activity: string;
  category: string;
  linesAdded: number;
  bgImage: string;
  size: "1x1" | "2x1" | "2x2";
}

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

const FALLBACK_BG = "/cards/bg-tool-a.png";

function aggregateTiles(categories: EcosystemCategory[]): ProjectTile[] {
  const tiles: ProjectTile[] = [];
  for (const cat of categories) {
    const bg = CATEGORY_BG[cat.name] ?? FALLBACK_BG;
    for (const repo of cat.repos) {
      tiles.push({
        name: repo.name,
        description: repo.description,
        githubUrl: repo.githubUrl,
        activity: repo.activity,
        category: cat.name,
        linesAdded: repo.linesAdded ?? 0,
        bgImage: bg,
        size: "1x1",
      });
    }
  }

  // Sort by linesAdded descending — biggest projects get prominent tiles
  tiles.sort((a, b) => b.linesAdded - a.linesAdded);

  // Assign sizes based on rank
  tiles.forEach((tile, i) => {
    if (i < 2) tile.size = "2x2";
    else if (i < 8) tile.size = "2x1";
    else tile.size = "1x1";
  });

  return tiles;
}

export default function ProjectBento({ categories }: Props) {
  const tiles = aggregateTiles(categories);

  return (
    <section
      className="relative w-full bg-black py-20 sm:py-28 px-6"
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
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.05]">
          {tiles.length}{" "}
          <span className="text-white/55">active repositories</span>
        </h2>
        <p
          className="mt-4 text-sm text-white/45 max-w-md mx-auto"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Sized by code activity in the latest reporting window.
        </p>
      </div>

      {/* Bento grid */}
      <div className="mx-auto" style={{ maxWidth: "1500px" }}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            gridAutoRows: "140px",
            gridAutoFlow: "dense",
            gap: "12px",
          }}
        >
          {tiles.map((tile) => (
            <ProjectCard key={tile.name} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ tile }: { tile: ProjectTile }) {
  const spans: Record<ProjectTile["size"], string> = {
    "1x1": "col-span-1 row-span-1",
    "2x1": "col-span-2 row-span-1",
    "2x2": "col-span-2 row-span-2",
  };

  return (
    <a
      href={tile.githubUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative rounded-xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#4A8EFA]/55 transition-all ${spans[tile.size]}`}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 transition-all duration-500 group-hover:scale-105"
        style={{
          backgroundImage: `url(${tile.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.45,
        }}
      />
      {/* Hover brightness boost */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          backgroundImage: `url(${tile.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "screen",
          opacity: 0,
        }}
      />

      {/* Dark gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/15 group-hover:from-black/75 transition-all" />

      {/* Activity dot — top right */}
      <span
        className="absolute top-3 right-3 z-10 h-1.5 w-1.5 rounded-full"
        style={{
          background:
            tile.activity === "high"
              ? "#4ade80"
              : tile.activity === "medium"
              ? "#facc15"
              : "rgba(255,255,255,0.3)",
          boxShadow:
            tile.activity === "high"
              ? "0 0 6px #4ade80"
              : tile.activity === "medium"
              ? "0 0 4px #facc15"
              : "none",
        }}
      />

      {/* Content — bottom-left */}
      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end z-10">
        <div
          className="text-[9px] tracking-[0.3em] uppercase text-[#7AB0FF]/80 mb-1.5"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {tile.category}
        </div>
        <h3
          className={`text-white font-semibold leading-tight mb-1 group-hover:text-[#7AB0FF] transition-colors line-clamp-1 ${
            tile.size === "2x2"
              ? "text-lg sm:text-xl lg:text-2xl"
              : tile.size === "2x1"
              ? "text-base sm:text-lg"
              : "text-sm"
          }`}
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {tile.name}
        </h3>
        {tile.size !== "1x1" && tile.description && (
          <p
            className={`text-white/55 leading-snug ${
              tile.size === "2x2" ? "text-sm line-clamp-3" : "text-xs line-clamp-2"
            }`}
          >
            {tile.description}
          </p>
        )}
      </div>

      {/* Corner brackets — only on active hover for FUI feel */}
      <span className="absolute top-2 left-2 h-3 w-3 border-l-2 border-t-2 border-[#4A8EFA]/0 group-hover:border-[#4A8EFA]/80 transition-all pointer-events-none" />
      <span className="absolute bottom-2 right-2 h-3 w-3 border-r-2 border-b-2 border-[#4A8EFA]/0 group-hover:border-[#4A8EFA]/80 transition-all pointer-events-none" />
    </a>
  );
}
