"use client";

import { useState, useMemo } from "react";
import type { ReportSummary } from "./types";
import { groupByQuarter } from "./quarterUtils";
import ReportCard from "./ReportCard";
import ReportsPageLayout from "./ReportsPageLayout";

export default function ReportsListing({
  reports,
}: {
  reports: ReportSummary[];
}) {
  const groups = useMemo(() => groupByQuarter(reports), [reports]);
  const [selectedLabel, setSelectedLabel] = useState<string>(
    groups[0]?.label ?? ""
  );

  const selectedGroup = useMemo(
    () => groups.find((g) => g.label === selectedLabel) ?? groups[0],
    [groups, selectedLabel]
  );

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
      {reports.length === 0 ? (
        <div className="text-center py-[60px] text-[#808992] text-[16px]">
          No reports available yet.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-[8px] mb-[24px]">
            {groups.map((group) => (
              <button
                key={group.label}
                onClick={() => setSelectedLabel(group.label)}
                aria-pressed={group.label === selectedLabel}
                className={`px-[16px] py-[8px] rounded-[8px] text-[14px] font-[500] transition-colors duration-150
                  ${
                    group.label === selectedLabel
                      ? "bg-[#0078FF] text-white"
                      : "bg-[#F4F4F4] text-[#1C1C1C] hover:bg-[#E8E8E8]"
                  }`}
              >
                {group.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-[16px]">
            {selectedGroup?.reports.map((report) => (
              <ReportCard key={report.slug} report={report} />
            ))}
          </div>
        </>
      )}
    </ReportsPageLayout>
  );
}
