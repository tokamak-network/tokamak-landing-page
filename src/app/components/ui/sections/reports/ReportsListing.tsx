"use client";

import type { ReportSummary } from "./types";
import { groupByYear } from "./yearUtils";
import FeaturedReportCard from "./FeaturedReportCard";
import ArchiveReportRow from "./ArchiveReportRow";
import YearDivider from "./YearDivider";
import ReportsPageLayout from "./ReportsPageLayout";

const TITLE = (
  <>
    Biweekly
    <span className="font-[400] [@media(max-width:650px)]:block">
      {" "}
      Reports
    </span>
  </>
);

const SUBTITLE =
  "Biweekly engineering progress across all Tokamak Network repositories";

export default function ReportsListing({
  reports,
}: {
  reports: ReportSummary[];
}) {
  if (reports.length === 0) {
    return (
      <ReportsPageLayout
        title={TITLE}
        subtitle={SUBTITLE}
        contentClassName="max-w-[800px]"
      >
        <div className="text-center py-[60px] text-[#929298] text-[16px]">
          No reports available yet.
        </div>
      </ReportsPageLayout>
    );
  }

  const [featured, ...archiveReports] = reports;
  const archiveGroups = groupByYear(archiveReports);

  return (
    <ReportsPageLayout
      title={TITLE}
      subtitle={SUBTITLE}
      contentClassName="max-w-[800px]"
    >
      <FeaturedReportCard report={featured} />

      {archiveGroups.map((group) => (
        <div key={group.year}>
          <YearDivider year={group.year} />
          <div className="border border-[#434347] overflow-hidden">
            {group.reports.map((report) => (
              <ArchiveReportRow key={report.slug} report={report} />
            ))}
          </div>
        </div>
      ))}
    </ReportsPageLayout>
  );
}
