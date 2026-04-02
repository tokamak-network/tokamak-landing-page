import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import { FALLBACK_REPORT } from "@/app/lib/reports/constants";

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

export interface EcosystemCategory {
  name: string;
  repoCount: number;
  repos: {
    name: string;
    description: string;
    githubUrl: string;
    activity: string;
    linesAdded: number;
    linesDeleted: number;
  }[];
}

export interface EcosystemData {
  categories: EcosystemCategory[];
  activeProjects: number;
  totalCategories: number;
  codeChanges: number;
  netGrowth: number;
}

export const FALLBACK_CATEGORIES: EcosystemCategory[] = [
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

const FALLBACK_DATA: EcosystemData = {
  categories: FALLBACK_CATEGORIES,
  activeProjects: FALLBACK_CATEGORIES.reduce((sum, c) => sum + c.repoCount, 0),
  totalCategories: FALLBACK_CATEGORIES.length,
  codeChanges: parseNum(FALLBACK_REPORT.codeChanges),
  netGrowth: parseNum(FALLBACK_REPORT.netGrowth),
};

export async function getEcosystemData(): Promise<EcosystemData> {
  try {
    const metas = listReports();
    if (metas.length === 0) throw new Error("No reports");

    const latest = metas[0];
    const filePath = getReportPath(latest.slug);
    if (!filePath) throw new Error("No report file");

    const detail = parseReportDetail(filePath, latest);

    const categories: EcosystemCategory[] =
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

    // activeProjects is computed from category sum (not detail.stats?.activeRepos)
    const activeProjects = categories.reduce((sum, c) => sum + c.repoCount, 0);

    return {
      categories,
      activeProjects,
      totalCategories: categories.length,
      codeChanges: parseNum(detail.stats?.linesChanged) || parseNum(FALLBACK_REPORT.codeChanges),
      netGrowth: parseNum(detail.stats?.netGrowth) || parseNum(FALLBACK_REPORT.netGrowth),
    };
  } catch {
    return FALLBACK_DATA;
  }
}
