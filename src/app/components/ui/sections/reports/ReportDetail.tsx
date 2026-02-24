"use client";

import type { ReportDetail as ReportDetailType } from "./types";
import StatsBar from "./StatsBar";
import ExecutiveSummary from "./ExecutiveSummary";
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
  return (
    <ReportsPageLayout
      title={
        <>
          Development
          <span className="font-[400] [@media(max-width:650px)]:block">
            {" "}
            Report
          </span>
        </>
      }
      subtitle={report.dateLabel}
      contentClassName="max-w-[900px]"
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

        {/* STATS BAR - hero code changes */}
        <StatsBar stats={report.stats} variant="cards" />

        <GradientDivider />

        {/* EXECUTIVE SUMMARY */}
        <ExecutiveSummary
          headline={report.executiveHeadline}
          narrative={report.executiveNarrative}
        />

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
          <RepoCardGrid repos={report.repos} />
        </div>
      </div>
    </ReportsPageLayout>
  );
}
