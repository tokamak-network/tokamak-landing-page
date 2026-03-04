import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportSummary } from "@/app/lib/reports/parseReport";
import { CLIP_PATHS } from "@/app/constants/styles";
import LatestFeedClient from "./LatestFeedClient";
import type { FeedItem } from "./types";
import type { ReportSummary } from "@/app/components/ui/sections/reports/types";

function formatNum(n: string): string {
  const num = parseFloat(n.replace(/,/g, ""));
  if (isNaN(num)) return n;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return n;
}

function reportToFeedItem(report: ReportSummary): FeedItem {
  const statsPreview = [
    report.stats.activeRepos !== "0" && `${report.stats.activeRepos} repos`,
    report.stats.linesChanged !== "0" &&
      `${formatNum(report.stats.linesChanged)} code changes`,
  ]
    .filter(Boolean)
    .join(" · ");

  const pad = (n: number) => String(n).padStart(2, "0");
  const dateStr = `${report.year}-${pad(report.month)}-${pad(report.startDay)}`;

  return {
    id: `report-${report.slug}`,
    title: report.reportNumber
      ? `Biweekly #${report.reportNumber}: ${report.executiveHeadline || report.dateLabel}`
      : `Biweekly Report: ${report.dateLabel}`,
    date: dateStr,
    type: "report",
    href: `/about/reports/${report.slug}`,
    statsSummary: statsPreview || undefined,
  };
}

function loadReportFeedItems(): FeedItem[] {
  const metas = listReports();
  const reports: ReportSummary[] = metas
    .map((meta) => {
      const filePath = getReportPath(meta.slug);
      if (!filePath) return null;
      return parseReportSummary(filePath, meta);
    })
    .filter((r): r is ReportSummary => r !== null);

  return reports.map(reportToFeedItem);
}

export default function LatestFeed() {
  const reportItems = loadReportFeedItems();

  return (
    <section
      className="w-full bg-white flex justify-center px-[25px] [@media(max-width:1000px)]:px-[15px] py-[90px] [@media(max-width:640px)]:py-[60px]"
      style={{
        clipPath: CLIP_PATHS.polygon,
        transform: "translateY(1px)",
      }}
    >
      <div className="w-full max-w-[1200px] flex flex-col items-center">
        <h2 className="text-[30px] font-[100] text-[#1C1C1C] mb-[9px] text-center">
          Latest <span className="font-[600]">UPDATES</span>
        </h2>
        <p className="text-[15px] font-[300] text-[#808992] mb-[60px] text-center">
          News, research, and development updates from Tokamak Network
        </p>
        <LatestFeedClient reportItems={reportItems} />
      </div>
    </section>
  );
}
