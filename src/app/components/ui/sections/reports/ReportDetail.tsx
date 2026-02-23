"use client";

import type { ReportDetail as ReportDetailType } from "./types";
import StatsBar from "./StatsBar";
import ExecutiveSummary from "./ExecutiveSummary";
import RepoCardGrid from "./RepoCardGrid";
import ReportsPageLayout from "./ReportsPageLayout";
import Link from "next/link";

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
      maxWidth="900px"
    >
      <div className="flex flex-col gap-[32px]">
        {/* BACK LINK */}
        <Link
          href="/about/reports"
          className="inline-flex items-center gap-[6px] text-[14px] text-[#808992] hover:text-[#0078FF] transition-colors duration-200 self-start"
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

        {/* EXECUTIVE SUMMARY */}
        <ExecutiveSummary
          headline={report.executiveHeadline}
          narrative={report.executiveNarrative}
        />

        {/* STATS BAR */}
        <div className="py-[20px] px-[24px] [@media(max-width:640px)]:px-[16px] rounded-[12px] bg-[#f8f9fa]">
          <StatsBar stats={report.stats} />
        </div>

        {/* REPO CARDS */}
        <div className="flex flex-col gap-[16px]">
          <h2 className="text-[20px] font-[600] text-[#1C1C1C]">
            Repository Details
          </h2>
          <RepoCardGrid repos={report.repos} />
        </div>
      </div>
    </ReportsPageLayout>
  );
}
