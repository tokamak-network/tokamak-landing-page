import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import { parseNum } from "@/app/lib/utils/format";
import type { RepoCardData, ReportDetail } from "@/app/components/ui/sections/reports/types";
import RepoShowcaseClient from "./RepoShowcaseClient";
import type { ShowcaseRepo } from "./RepoShowcaseClient";

const TOP_N = 6;

function totalCodeChanges(repo: RepoCardData): number {
  return Math.abs(parseNum(repo.stats.linesAdded)) +
    Math.abs(parseNum(repo.stats.linesDeleted));
}

function buildCategoryMap(
  detail: ReportDetail,
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

function getShowcaseData(): {
  repos: ShowcaseRepo[];
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

  const repos: ShowcaseRepo[] = topRepos.map((repo) => {
    const cat = categoryMap.get(repo.repoName);
    return {
      repoName: repo.repoName,
      githubUrl: repo.githubUrl,
      description: repo.description,
      linesAdded: repo.stats.linesAdded,
      linesDeleted: repo.stats.linesDeleted,
      netLines: repo.stats.netLines,
      category: cat?.label,
      categoryColor: cat?.color,
      accomplishments: repo.accomplishments,
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

export default function RepoShowcase() {
  const { repos, reportLabel, reportHref } = getShowcaseData();

  return (
    <RepoShowcaseClient
      repos={repos}
      reportLabel={reportLabel}
      reportHref={reportHref}
    />
  );
}
