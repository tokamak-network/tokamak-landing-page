"use client";

import type { ReportSummary } from "./types";
import ReportCard from "./ReportCard";
import ReportsPageLayout from "./ReportsPageLayout";

export default function ReportsListing({
  reports,
}: {
  reports: ReportSummary[];
}) {
  return (
    <ReportsPageLayout
      title={
        <>
          Development
          <span className="font-[400] [@media(max-width:650px)]:block">
            {" "}
            Reports
          </span>
        </>
      }
      subtitle="Biweekly engineering progress across all Tokamak Network repositories"
      contentClassName="max-w-[800px]"
    >
      <div className="flex flex-col gap-[16px]">
        {reports.length === 0 ? (
          <div className="text-center py-[60px] text-[#808992] text-[16px]">
            No reports available yet.
          </div>
        ) : (
          reports.map((report) => (
            <ReportCard key={report.slug} report={report} />
          ))
        )}
      </div>
    </ReportsPageLayout>
  );
}
