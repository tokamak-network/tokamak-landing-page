import type { Metadata } from "next";
import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportSummary } from "@/app/lib/reports/parseReport";
import ReportsListing from "@/app/components/ui/sections/reports/ReportsListing";
import type { ReportSummary } from "@/app/components/ui/sections/reports/types";

export const metadata: Metadata = {
  title: "Biweekly Reports | Tokamak Network",
  description:
    "Biweekly engineering progress across all Tokamak Network repositories",
};

export default function ReportsPage() {
  const metas = listReports();

  const reports: ReportSummary[] = metas
    .map((meta) => {
      const filePath = getReportPath(meta.slug);
      if (!filePath) return null;
      return parseReportSummary(filePath, meta);
    })
    .filter((r): r is ReportSummary => r !== null);

  return <ReportsListing reports={reports} />;
}
