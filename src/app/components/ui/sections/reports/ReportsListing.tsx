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
          <div className="border-b border-[#EDEDF0] mb-[24px]">
            <div className="flex gap-[4px] overflow-x-auto" role="tablist" aria-label="Filter reports by quarter">
              {groups.map((group) => {
                const isActive = group.label === selectedLabel;
                return (
                  <button
                    key={group.label}
                    onClick={() => setSelectedLabel(group.label)}
                    role="tab"
                    aria-selected={isActive}
                    className={`relative px-[16px] py-[10px] text-[14px] font-[500] transition-all duration-200
                      ${
                        isActive
                          ? "text-[#0078FF]"
                          : "text-[#808992] hover:text-[#1C1C1C]"
                      }`}
                  >
                    {group.label}
                    <span
                      className={`ml-[6px] text-[12px] font-[400] ${
                        isActive ? "text-[#0078FF]" : "text-[#808992]"
                      }`}
                    >
                      ({group.reports.length})
                    </span>
                    <span
                      className={`absolute bottom-0 left-[16px] right-[16px] h-[2px] bg-[#0078FF] rounded-full transition-all duration-200
                        ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-[16px]" role="tabpanel">
            {selectedGroup?.reports.map((report) => (
              <ReportCard key={report.slug} report={report} />
            ))}
          </div>
        </>
      )}
    </ReportsPageLayout>
  );
}
