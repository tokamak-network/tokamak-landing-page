import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportSummary } from "@/app/lib/reports/parseReport";
import LatestFeedClient from "./LatestFeedClient";
import type { FeedItem } from "./types";
import type { ReportSummary } from "@/app/lib/reports/types";

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
    href: `/reports/${report.slug}.html`,
    thumbnail: "/images/biweekly-report-thumbnail.png",
    statsSummary: statsPreview || undefined,
    dateLabel: report.dateLabel,
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
      className="relative w-full bg-black py-20 sm:py-28 px-4 sm:px-6"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* Header — matches ProjectBento / EcosystemFan eyebrow + title style */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
          <span
            className="text-[10px] sm:text-[11px] tracking-[0.5em] text-[#7AB0FF]/85 uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Latest Updates
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
        </div>
        <h2
          className="text-4xl sm:text-6xl lg:text-7xl text-white tracking-[-0.04em] leading-[0.95]"
          style={{ fontWeight: 900 }}
        >
          News, research, and{" "}
          <em className="not-italic text-[#7AB0FF]">development</em>.
        </h2>
      </div>

      <div className="mx-auto w-full max-w-[1280px]">
        <LatestFeedClient reportItems={reportItems} />
      </div>
    </section>
  );
}
