"use client";

import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
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
    <div className="h-[1px] bg-gradient-to-r from-transparent via-[#434347] to-transparent my-[8px]" />
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
            {" "}Report
          </span>
          {report.reportNumber != null && (
            <span className="font-[400]"> #{report.reportNumber}</span>
          )}
        </>
      }
      subtitle={report.dateLabel}
      contentClassName="max-w-[1100px]"
    >
      <div className="flex flex-col gap-[40px]">
        {/* BACK LINK */}
        <Link
          href="/about/reports"
          className="inline-flex items-center gap-[6px] text-[14px] text-[#929298] hover:text-[#0078FF]
            bg-[#2a2a2e] hover:bg-surface-light px-[14px] py-[6px]
            transition-colors duration-200 self-start"
        >
          <ArrowLeft className="w-4 h-4" />
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
            <EcosystemLandscape data={report.ecosystemLandscape} repos={report.repos} />
          </>
        )}

        {/* CATEGORY FOCUS & SYNERGIES */}
        {report.categoryFocus && report.categoryFocus.length > 0 && (
          <>
            <GradientDivider />
            <CategoryFocusSynergies items={report.categoryFocus} repos={report.repos} />
          </>
        )}

        <GradientDivider />

        {/* REPO CARDS */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <h2 className="text-[20px] font-[600] text-white">
              Repository Details
            </h2>
            <span className="text-[13px] text-[#929298]">
              {report.repos.length} repositories
            </span>
          </div>
          <RepoCardGrid repos={report.repos} categoryMap={categoryMap} />
        </div>
      </div>
    </ReportsPageLayout>
  );
}
