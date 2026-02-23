import Link from "next/link";
import type { ReportSummary } from "./types";
import StatsBar from "./StatsBar";

export default function ReportCard({ report }: { report: ReportSummary }) {
  return (
    <Link
      href={`/about/reports/${report.slug}`}
      className="block p-[24px] rounded-[12px] border border-[#DEDEDE] bg-white
        hover:border-[#0078FF] hover:shadow-[0_4px_20px_rgba(0,120,255,0.08)]
        transition-all duration-200 group"
    >
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center justify-between">
          <span className="text-[20px] [@media(max-width:640px)]:text-[16px] font-[600] text-[#1C1C1C] group-hover:text-[#0078FF] transition-colors duration-200">
            {report.dateLabel}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-[#808992] group-hover:text-[#0078FF] transition-colors duration-200 flex-shrink-0"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <StatsBar stats={report.stats} compact />

        {report.executiveHeadline && (
          <p className="text-[14px] text-[#444] leading-[1.5] line-clamp-2">
            {report.executiveHeadline}
          </p>
        )}
      </div>
    </Link>
  );
}
