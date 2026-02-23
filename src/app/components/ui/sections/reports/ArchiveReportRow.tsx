import Link from "next/link";
import type { ReportSummary } from "./types";
import { formatShortDate, formatCompactStats } from "./yearUtils";

export default function ArchiveReportRow({
  report,
}: {
  report: ReportSummary;
}) {
  return (
    <Link
      href={`/about/reports/${report.slug}`}
      className="flex items-center justify-between px-[20px] py-[16px]
        border-b border-[#f0f0f0] last:border-b-0
        hover:bg-[#fafafa] transition-colors duration-150 group"
    >
      <div className="flex flex-col [@media(min-width:640px)]:flex-row [@media(min-width:640px)]:items-center gap-[4px] [@media(min-width:640px)]:gap-[16px] min-w-0">
        <span className="text-[15px] font-[600] text-[#1C1C1C] whitespace-nowrap group-hover:text-[#0078FF] transition-colors duration-150">
          {formatShortDate(report)}
        </span>
        <span className="text-[13px] text-[#808992] truncate">
          {formatCompactStats(report.stats)}
        </span>
      </div>
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        className="text-[#C4C4C4] group-hover:text-[#0078FF] transition-colors duration-150 flex-shrink-0 ml-[12px]"
      >
        <path
          d="M7.5 15L12.5 10L7.5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}
