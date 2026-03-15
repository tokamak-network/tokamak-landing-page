import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import { parseNum } from "@/app/lib/utils/format";
import type { RepoCardData, ReportDetail } from "@/app/components/ui/sections/reports/types";
import LeaderboardClient from "./LeaderboardClient";
import type { LeaderboardRepo } from "./LeaderboardClient";

const TOP_N = 10;

function totalCodeChanges(repo: RepoCardData): number {
  return (
    Math.abs(parseNum(repo.stats.linesAdded)) +
    Math.abs(parseNum(repo.stats.linesDeleted))
  );
}

function buildCategoryMap(
  detail: ReportDetail
): Map<string, { label: string; color: string }> {
  const map = new Map<string, { label: string; color: string }>();
  if (!detail.ecosystemLandscape) return map;

  for (const cat of detail.ecosystemLandscape.categories) {
    for (const repo of cat.repos) {
      map.set(repo.name, { label: cat.name, color: cat.color });
    }
  }
  return map;
}

function getLeaderboardData(): {
  repos: LeaderboardRepo[];
  reportLabel: string;
  reportHref: string;
} {
  const metas = listReports();
  if (metas.length === 0) {
    return { repos: [], reportLabel: "", reportHref: "/about/reports" };
  }

  const latest = metas[0];
  const filePath = getReportPath(latest.slug);
  if (!filePath) {
    return { repos: [], reportLabel: "", reportHref: "/about/reports" };
  }

  const detail = parseReportDetail(filePath, latest);
  const categoryMap = buildCategoryMap(detail);

  const topRepos = [...detail.repos]
    .sort((a, b) => totalCodeChanges(b) - totalCodeChanges(a))
    .slice(0, TOP_N);

  const repos: LeaderboardRepo[] = topRepos.map((repo, i) => {
    const cat = categoryMap.get(repo.repoName);
    const added = Math.abs(parseNum(repo.stats.linesAdded));
    const deleted = Math.abs(parseNum(repo.stats.linesDeleted));
    return {
      rank: i + 1,
      repoName: repo.repoName,
      githubUrl: repo.githubUrl,
      category: cat?.label,
      categoryColor: cat?.color,
      linesChanged: added + deleted,
      netGrowth: parseNum(repo.stats.netLines),
      isActive: added + deleted > 0,
    };
  });

  const reportLabel = latest.reportNumber
    ? `Biweekly #${latest.reportNumber}`
    : latest.dateLabel;

  return {
    repos,
    reportLabel,
    reportHref: `/about/reports/${latest.slug}`,
  };
}

export default function RepoLeaderboard() {
  const { repos, reportLabel, reportHref } = getLeaderboardData();

  return (
    <LeaderboardClient
      repos={repos}
      reportLabel={reportLabel}
      reportHref={reportHref}
    />
  );
}
