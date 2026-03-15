import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import { parseNum } from "@/app/lib/utils/format";
import FlowCanvas from "./FlowCanvas";

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

  const categories: FlowCategory[] = landscape.categories.map((cat) => ({
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
      className="relative z-10 w-full flex flex-col items-center bg-black"
    >
      {/* Section header */}
      <div className="pt-[120px] pb-[40px] px-6 text-center">
        <h2 className="text-[38px] md:text-[48px] font-[900] text-white tracking-[0.06em] uppercase mb-3">
          Ecosystem
        </h2>
        <div className="w-10 h-[3px] bg-primary mx-auto mb-5" />
        <p className="text-[16px] text-[#929298] max-w-[500px] mx-auto">
          {totalRepos} repositories across {categories.length} categories —{" "}
          {totalCommits.toLocaleString("en-US")} commits and counting
        </p>
      </div>

      {/* Flow visualization */}
      <FlowCanvas categories={categories} />
    </section>
  );
}
