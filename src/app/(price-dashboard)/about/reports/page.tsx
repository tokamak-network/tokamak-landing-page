import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportSummary } from "@/app/lib/reports/parseReport";
import type { ReportSummary } from "@/app/lib/reports/types";
import ReportsArchive from "@/app/components/ui/sections/reports-archive";

export const dynamic = "force-dynamic";

export default function ReportsPage() {
  const metas = listReports();
  const reports: ReportSummary[] = metas
    .map((meta) => {
      const filePath = getReportPath(meta.slug);
      if (!filePath) return null;
      return parseReportSummary(filePath, meta);
    })
    .filter((r): r is ReportSummary => r !== null);

  return <ReportsArchive reports={reports} />;
}
