import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import { parseNum } from "@/app/lib/utils/format";
import LeaderboardClient from "./LeaderboardClient";
import type { TreemapCategory, TreemapRepo } from "./treemapLayout";

function getLeaderboardData(): {
  categories: TreemapCategory[];
  activeRepos: string;
  reportLabel: string;
  reportHref: string;
} {
  const metas = listReports();
  if (metas.length === 0) {
    return { categories: [], activeRepos: "0", reportLabel: "", reportHref: "/about/reports" };
  }

  const latest = metas[0];
  const filePath = getReportPath(latest.slug);
  if (!filePath) {
    return { categories: [], activeRepos: "0", reportLabel: "", reportHref: "/about/reports" };
  }

  const detail = parseReportDetail(filePath, latest);
  if (!detail.ecosystemLandscape) {
    return { categories: [], activeRepos: detail.stats.activeRepos, reportLabel: "", reportHref: "/about/reports" };
  }

  const landscape = detail.ecosystemLandscape;

  const categories: TreemapCategory[] = landscape.categories
    .map((cat) => {
      const repos: TreemapRepo[] = cat.repos
        .map((repo) => {
          const repoCard = detail.repos.find((r) => r.repoName === repo.name);
          const added = repoCard
            ? Math.abs(parseNum(repoCard.stats.linesAdded))
            : 0;
          const deleted = repoCard
            ? Math.abs(parseNum(repoCard.stats.linesDeleted))
            : 0;
          const linesChanged = added + deleted;

          return {
            repoName: repo.name,
            githubUrl: repo.githubUrl,
            description: repoCard?.description || undefined,
            linesChanged,
            linesAdded: added,
            linesDeleted: deleted,
            netGrowth: repoCard ? parseNum(repoCard.stats.netLines) : 0,
            commits: repoCard?.stats.commits ?? "0",
            isActive: linesChanged > 0,
          };
        })
        .filter((r) => r.linesChanged > 0 && r.netGrowth >= 0);

      return {
        name: cat.name,
        color: cat.color || "#0077ff",
        repos,
      };
    })
    .filter((cat) => cat.repos.length > 0);

  const reportLabel = latest.reportNumber
    ? `Biweekly #${latest.reportNumber}`
    : latest.dateLabel;

  return {
    categories,
    activeRepos: detail.stats.activeRepos,
    reportLabel,
    reportHref: `/about/reports/${latest.slug}`,
  };
}

export default function RepoLeaderboard() {
  const { categories, activeRepos, reportLabel, reportHref } = getLeaderboardData();

  return (
    <LeaderboardClient
      categories={categories}
      activeRepos={activeRepos}
      reportLabel={reportLabel}
      reportHref={reportHref}
    />
  );
}
