import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import { FALLBACK_REPORT } from "@/app/lib/reports/constants";
import ShowcaseOverlay from "./ShowcaseOverlay";

function parseNum(s: string | undefined): number {
  if (!s) return 0;
  return parseInt(s.replace(/,/g, ""), 10) || 0;
}

const SHORT_NAMES: Record<string, string> = {
  "Platform & Services": "Platform",
  "Core Infrastructure": "Infra",
  "AI & Machine Learning": "AI / ML",
  "Privacy & ZK": "ZK",
  "Research & Education": "Lab",
  "Automation & Tooling": "Tool",
  "DeFi & Staking": "DeFi",
  "Gaming & Social": "Social",
  "Data & Analytics": "Analytics",
};

// Default categories when no report data available
const FALLBACK_CATEGORIES = [
  { name: "Platform", repoCount: 10, repos: [] },
  { name: "Infra", repoCount: 4, repos: [] },
  { name: "AI / ML", repoCount: 4, repos: [] },
  { name: "ZK", repoCount: 4, repos: [] },
  { name: "Lab", repoCount: 5, repos: [] },
  { name: "Tool", repoCount: 8, repos: [] },
  { name: "DeFi", repoCount: 5, repos: [] },
  { name: "Social", repoCount: 3, repos: [] },
  { name: "Governance", repoCount: 2, repos: [] },
  { name: "Analytics", repoCount: 3, repos: [] },
];

async function getShowcaseData() {
  try {
    const metas = listReports();
    if (metas.length === 0) throw new Error("No reports");

    const latest = metas[0];
    const filePath = getReportPath(latest.slug);
    if (!filePath) throw new Error("No report file");

    const detail = parseReportDetail(filePath, latest);

    const categories =
      detail.ecosystemLandscape?.categories?.map((c) => ({
        name: SHORT_NAMES[c.name] ?? c.name,
        repoCount: c.repoCount,
        repos: c.repos.map((r) => ({
          name: r.name,
          description: r.description,
          githubUrl: r.githubUrl,
          activity: r.activity,
          linesAdded: r.linesAdded ?? 0,
          linesDeleted: r.linesDeleted ?? 0,
        })),
      })) ?? FALLBACK_CATEGORIES;

    return {
      categories,
      activeProjects: parseNum(detail.stats?.activeRepos) || parseNum(FALLBACK_REPORT.activeProjects),
      codeChanges: parseNum(detail.stats?.linesChanged) || parseNum(FALLBACK_REPORT.codeChanges),
      netGrowth: parseNum(detail.stats?.netGrowth) || parseNum(FALLBACK_REPORT.netGrowth),
    };
  } catch {
    return {
      categories: FALLBACK_CATEGORIES,
      activeProjects: parseNum(FALLBACK_REPORT.activeProjects),
      codeChanges: parseNum(FALLBACK_REPORT.codeChanges),
      netGrowth: parseNum(FALLBACK_REPORT.netGrowth),
    };
  }
}

export default async function TowerShowcase() {
  const data = await getShowcaseData();

  return (
    <ShowcaseOverlay
      categories={data.categories}
      activeProjects={data.activeProjects}
      codeChanges={data.codeChanges}
      netGrowth={data.netGrowth}
    />
  );
}
