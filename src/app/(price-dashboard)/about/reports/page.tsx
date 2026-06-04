import type { Metadata } from "next";
import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportSummary } from "@/app/lib/reports/parseReport";
import type { ReportSummary } from "@/app/lib/reports/types";
import ReportsArchive from "@/app/components/ui/sections/reports-archive";

export const metadata: Metadata = {
  title: "Engineering Reports — Tokamak Network",
  description:
    "Biweekly engineering progress reports covering development activity across every Tokamak Network repository.",
  alternates: { canonical: "/about/reports" },
};

// Reports are local files resolved at build — prerender statically (re-deploy
// adds new ones, per the biweekly workflow). Refresh hourly just in case.
export const revalidate = 3600;

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
