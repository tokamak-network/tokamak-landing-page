import Link from "next/link";
import type { ReportSummary } from "./types";

function formatInlineStats(stats: ReportSummary["stats"]): string {
  return `${stats.commits} commits · ${stats.activeRepos} repos · ${stats.contributors} contributors`;
}

export default function ReportCard({ report }: { report: ReportSummary }) {
  return (
    <Link
      href={`/about/reports/${report.slug}`}
      className="relative block pl-[19px] pr-[24px] py-[20px] rounded-[12px] border border-[#DEDEDE] bg-white
        hover:border-[#0078FF] hover:shadow-[0_4px_20px_rgba(0,120,255,0.08)]
        transition-all duration-200 group overflow-hidden"
    >
      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#0078FF] opacity-0 group-hover:opacity-100 transition-all duration-200" />

      <div className="flex flex-col gap-[8px]">
        <div className="flex items-center justify-between">
          <span className="text-[18px] [@media(max-width:640px)]:text-[16px] font-[600] text-[#1C1C1C] group-hover:text-[#0078FF] transition-colors duration-200">
            {report.dateLabel}
          </span>
          <svg
            aria-hidden="true"
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

        <p className="text-[13px] text-[#808992] leading-[1.4]">
          {formatInlineStats(report.stats)}
        </p>

        {report.executiveHeadline && (
          <p className="text-[14px] text-[#666] leading-[1.5] line-clamp-2">
            {report.executiveHeadline}
          </p>
        )}
      </div>
    </Link>
  );
}
