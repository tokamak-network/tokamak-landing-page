import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
        border-b border-[#2a2a2e] last:border-b-0
        hover:bg-surface-light transition-colors duration-150 group"
    >
      <div className="flex flex-col [@media(min-width:640px)]:flex-row [@media(min-width:640px)]:items-center gap-[4px] [@media(min-width:640px)]:gap-[16px] min-w-0">
        <span className="text-[15px] font-[600] text-white whitespace-nowrap group-hover:text-[#0078FF] transition-colors duration-150">
          Biweekly{report.reportNumber != null && (
            <span className="text-[#0078FF] font-[700]"> #{report.reportNumber}</span>
          )}
          <span className="text-[#929298] font-[400] ml-[8px]">{formatShortDate(report)}</span>
        </span>
        <span className="text-[13px] text-[#929298] truncate">
          {formatCompactStats(report.stats)}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-[#434347] group-hover:text-[#0078FF] transition-colors duration-150 flex-shrink-0 ml-[12px]" />
    </Link>
  );
}
