"use client";

import { useFocus } from "@/context/FocusContext";
import { CLIP_PATHS } from "@/app/constants/styles";
import type { ReportDetail as ReportDetailType } from "./types";
import StatsBar from "./StatsBar";
import ExecutiveSummary from "./ExecutiveSummary";
import RepoCardGrid from "./RepoCardGrid";
import Link from "next/link";

export default function ReportDetail({
  report,
}: {
  report: ReportDetailType;
}) {
  const { isFocused } = useFocus();

  return (
    <div className="w-full h-full text-[#1C1C1C]">
      {/* TOP AREA FOR CLIP PATH */}
      <div className="relative w-full h-[134px] bg-[#1c1c1c]">
        <div
          style={{
            clipPath: CLIP_PATHS.bottomCutCorners,
            backgroundColor: "white",
          }}
          className="absolute inset-0 bg-white"
        ></div>
      </div>

      {/* DARK HERO BANNER */}
      <div
        className="flex justify-center w-full py-[60px] [@media(max-width:650px)]:py-[30px] px-[24px] bg-[#1C1C1C]
        [@media(max-width:650px)]:min-h-[157px]"
      >
        <div className="flex flex-col justify-between items-center text-white text-center gap-y-[9px]">
          <span className="text-[30px] leading-[30px] [@media(max-width:650px)]:text-[24px] [@media(max-width:650px)]:leading-[24px] font-[100]">
            Development
            <span className="font-[400] [@media(max-width:650px)]:block">
              {" "}
              Report
            </span>
          </span>
          <span className="text-[15px] [@media(max-width:650px)]:text-[12px] font-[100]">
            {report.dateLabel}
          </span>
        </div>
      </div>

      {/* WHITE CONTENT AREA */}
      <div
        className="relative bg-[#1c1c1c]"
        style={{
          background: isFocused
            ? "linear-gradient(to bottom, transparent 50%, #0078ff 50%)"
            : "",
        }}
      >
        <div
          className="flex flex-col items-center pt-[60px] pb-[120px] relative bg-white"
          style={{
            clipPath: CLIP_PATHS.polygon,
          }}
        >
          <div className="w-full max-w-[900px] px-[24px] flex flex-col gap-[32px]">
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
        </div>
      </div>
    </div>
  );
}
