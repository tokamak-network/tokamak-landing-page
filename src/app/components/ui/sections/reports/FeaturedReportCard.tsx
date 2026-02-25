import Link from "next/link";
import type { ReportSummary } from "./types";
import StatsBar from "./StatsBar";

export default function FeaturedReportCard({
  report,
}: {
  report: ReportSummary;
}) {
  return (
    <Link
      href={`/about/reports/${report.slug}`}
      className="block rounded-[16px] border border-[#0078FF]/20 bg-[#0078FF]/[0.02]
        p-[28px] [@media(max-width:640px)]:p-[20px]
        hover:border-[#0078FF]/40 hover:shadow-[0_4px_24px_rgba(0,120,255,0.08)]
        transition-all duration-200 group"
    >
      <div className="flex items-center gap-[8px] mb-[16px]">
        <span className="w-[8px] h-[8px] rounded-full bg-[#0078FF]" />
        <span className="text-[11px] font-[700] text-[#0078FF] uppercase tracking-[0.05em]">
          Latest Report
        </span>
      </div>

      <h3 className="text-[22px] [@media(max-width:640px)]:text-[18px] font-[600] text-[#1C1C1C] group-hover:text-[#0078FF] transition-colors duration-200 mb-[4px]">
        Biweekly{report.reportNumber != null && (
          <span className="text-[#0078FF] font-[700]"> #{report.reportNumber}</span>
        )}
      </h3>
      <p className="text-[15px] text-[#808992] mb-[8px]">{report.dateLabel}</p>

      {report.executiveHeadline && (
        <p className="text-[15px] text-[#444] leading-[1.5] mb-[20px] line-clamp-2">
          {report.executiveHeadline}
        </p>
      )}

      <div className="bg-[#f8f9fa] rounded-[8px] p-[16px] [@media(max-width:640px)]:p-[12px] mb-[20px]">
        <StatsBar stats={report.stats} />
      </div>

      <div className="flex justify-end items-center gap-[6px] text-[14px] font-[500] text-[#0078FF] group-hover:gap-[10px] transition-all duration-200">
        Read Full Report
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
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
    </Link>
  );
}
