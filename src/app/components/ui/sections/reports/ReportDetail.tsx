"use client";

import { useMemo } from "react";
import type { ReportDetail as ReportDetailType, RepoCategoryInfo } from "./types";
import StatsBar from "./StatsBar";
import ExecutiveSummary from "./ExecutiveSummary";
import EcosystemLandscape from "./EcosystemLandscape";
import CategoryFocusSynergies from "./CategoryFocusSynergies";
import RepoCardGrid from "./RepoCardGrid";
import ReportsPageLayout from "./ReportsPageLayout";
import Link from "next/link";

function GradientDivider() {
  return (
    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#e0e0e0] to-transparent my-[8px]" />
  );
}

export default function ReportDetail({
  report,
}: {
  report: ReportDetailType;
}) {
  const categoryMap = useMemo(() => {
    if (!report.ecosystemLandscape) return undefined;
    const map = new Map<string, RepoCategoryInfo>();
    for (const cat of report.ecosystemLandscape.categories) {
      for (const repo of cat.repos) {
        map.set(repo.name, { label: cat.name, color: cat.color, icon: cat.icon });
      }
    }
    return map;
  }, [report.ecosystemLandscape]);

  return (
    <ReportsPageLayout
      title={
        <>
          Biweekly
          <span className="font-[400] [@media(max-width:650px)]:block">
            {" "}
            Report
          </span>
        </>
      }
      subtitle={report.dateLabel}
      contentClassName="max-w-[1100px]"
    >
      <div className="flex flex-col gap-[40px]">
        {/* BACK LINK */}
        <Link
          href="/about/reports"
          className="inline-flex items-center gap-[6px] text-[14px] text-[#808992] hover:text-[#0078FF]
            bg-[#f5f5f5] hover:bg-[#e8e8e8] rounded-full px-[14px] py-[6px]
            transition-colors duration-200 self-start"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All Reports
        </Link>

        {/* STATS BAR - hero total lines changed */}
        <StatsBar stats={report.stats} variant="cards" />

        <GradientDivider />

        {/* EXECUTIVE SUMMARY */}
        <ExecutiveSummary
          headline={report.executiveHeadline}
          narrative={report.executiveNarrative}
        />

        {/* ECOSYSTEM LANDSCAPE */}
        {report.ecosystemLandscape && (
          <>
            <GradientDivider />
            <EcosystemLandscape data={report.ecosystemLandscape} />
          </>
        )}

        {/* CATEGORY FOCUS & SYNERGIES */}
        {report.categoryFocus && report.categoryFocus.length > 0 && (
          <>
            <GradientDivider />
            <CategoryFocusSynergies items={report.categoryFocus} />
          </>
        )}

        <GradientDivider />

        {/* REPO CARDS */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <h2 className="text-[20px] font-[600] text-[#1C1C1C]">
              Repository Details
            </h2>
            <span className="text-[13px] text-[#808992]">
              {report.repos.length} repositories
            </span>
          </div>
          <RepoCardGrid repos={report.repos} categoryMap={categoryMap} />
        </div>
      </div>
    </ReportsPageLayout>
  );
}
