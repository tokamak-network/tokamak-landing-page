import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import { parseNum } from "@/app/lib/utils/format";
import FlowCanvas from "./FlowCanvas";
import GlobeWrapper from "./GlobeWrapper";

export interface FlowRepo {
  name: string;
  linesChanged: number;
  netGrowth: number;
  isActive: boolean;
}

export interface FlowCategory {
  name: string;
  color: string;
  repos: FlowRepo[];
}

function getFlowData(): {
  categories: FlowCategory[];
  totalRepos: number;
  totalCommits: number;
} {
  const metas = listReports();
  if (metas.length === 0) return { categories: [], totalRepos: 0, totalCommits: 0 };

  const latest = metas[0];
  const filePath = getReportPath(latest.slug);
  if (!filePath) return { categories: [], totalRepos: 0, totalCommits: 0 };

  const detail = parseReportDetail(filePath, latest);
  if (!detail.ecosystemLandscape) {
    return { categories: [], totalRepos: 0, totalCommits: 0 };
  }

  const landscape = detail.ecosystemLandscape;

  const rawCategories: FlowCategory[] = landscape.categories.map((cat) => ({
    name: cat.name,
    color: cat.color || "#0077ff",
    repos: cat.repos.map((repo) => {
      const repoCard = detail.repos.find((r) => r.repoName === repo.name);
      const added = repoCard
        ? Math.abs(parseNum(repoCard.stats.linesAdded))
        : 0;
      const deleted = repoCard
        ? Math.abs(parseNum(repoCard.stats.linesDeleted))
        : 0;
      return {
        name: repo.name,
        linesChanged: added + deleted,
        netGrowth: repoCard ? parseNum(repoCard.stats.netLines) : 0,
        isActive: added + deleted > 0,
      };
    }),
  }));

  // Always exactly 10 categories — pad with "Other" if fewer
  const SLOT_COUNT = 10;
  const fillerColors = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981",
    "#06b6d4", "#3b82f6", "#ef4444", "#84cc16", "#f97316",
  ];
  const categories: FlowCategory[] = rawCategories.slice(0, SLOT_COUNT);
  while (categories.length < SLOT_COUNT) {
    const idx = categories.length;
    categories.push({
      name: `Other ${idx - rawCategories.length + 1}`,
      color: fillerColors[idx % fillerColors.length],
      repos: [{ name: "—", linesChanged: 0, netGrowth: 0, isActive: false }],
    });
  }

  return {
    categories,
    totalRepos: landscape.totalRepos,
    totalCommits: landscape.totalCommits,
  };
}

export default function EcosystemFlow() {
  const { categories, totalRepos, totalCommits } = getFlowData();
  if (categories.length === 0) return null;

  return (
    <section
      id="ecosystem-flow"
      className="relative z-10 w-full flex flex-col items-center bg-black pt-[80px]"
    >
      <FlowCanvas categories={categories} />

      {/* 3D Ecosystem Globe — Shopify-style interactive sphere */}
      <GlobeWrapper categories={categories} totalRepos={totalRepos} />
    </section>
  );
}
