import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import ProofWallClient from "./ProofWallClient";
import type { CategoryBarData } from "./CategoryBar";

function buildCategoryData(
  report: ReturnType<typeof parseReportDetail>,
): CategoryBarData[] {
  const landscape = report.ecosystemLandscape;
  if (!landscape) return [];

  return landscape.categories
    .map((cat) => {
      const linesChanged = cat.repos.reduce((sum, repo) => {
        const added = repo.linesAdded ?? 0;
        const deleted = repo.linesDeleted ?? 0;
        return sum + added + deleted;
      }, 0);

      return {
        name: cat.name,
        color: cat.color,
        linesChanged,
      };
    })
    .filter((c) => c.linesChanged > 0)
    .sort((a, b) => b.linesChanged - a.linesChanged);
}

export default function ProofWall() {
  const metas = listReports();
  const latest = metas[0];

  if (!latest) {
    return null;
  }

  const filePath = getReportPath(latest.slug);
  if (!filePath) {
    return null;
  }

  const report = parseReportDetail(filePath, latest);

  const metrics = [
    {
      label: "Total Code Changes",
      value: report.stats.linesChanged || "0",
    },
    {
      label: "Active Projects",
      value: report.stats.activeRepos || "0",
    },
    {
      label: "Biweekly Commits",
      value: report.stats.commits || "0",
    },
  ];

  const categories = buildCategoryData(report);

  return (
    <ProofWallClient
      metrics={metrics}
      categories={categories}
      latestReportSlug={latest.slug}
    />
  );
}
