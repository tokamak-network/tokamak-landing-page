import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportSummary } from "@/app/lib/reports/parseReport";
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
      className="relative z-10 w-full flex justify-center px-6 pt-[110px] pb-[160px] [@media(max-width:640px)]:py-[80px] overflow-hidden bg-black"
      data-snap-section
      style={{ minHeight: "100vh", scrollSnapAlign: "start" }}
    >
      {/* ── Background layers ── */}

      {/* Subtle grid — same density as tower floors */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,229,255,0.008) 3px, rgba(0,229,255,0.008) 4px)",
        }}
      />

      {/* Center radial glow — soft, does not compete with cards */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,229,255,0.035) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 50% 45%, rgba(0,229,255,0.02) 0%, transparent 40%)
          `,
        }}
      />

      {/* ── Edge fades — left/right only, no top/bottom to keep buttons visible ── */}
      <div
        className="absolute top-0 bottom-0 left-0 pointer-events-none"
        style={{
          width: "18%",
          background: "linear-gradient(90deg, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 65%, transparent 100%)",
        }}
      />
      <div
        className="absolute top-0 bottom-0 right-0 pointer-events-none"
        style={{
          width: "18%",
          background: "linear-gradient(270deg, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 65%, transparent 100%)",
        }}
      />

      <div className="w-full max-w-[1280px] flex flex-col items-center">
        {/* Section label */}
        <span
          className="text-[11px] uppercase tracking-[0.2em] mb-4 block"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "rgba(0,229,255,0.6)",
          }}
        >
          INTEL FEED // LIVE
        </span>

        <h2
          className="text-[38px] md:text-[48px] font-[900] uppercase tracking-[0.06em] mb-4 text-center"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            color: "#ffffff",
            textShadow: "0 0 30px rgba(0,229,255,0.5), 0 0 60px rgba(0,229,255,0.2)",
          }}
        >
          Latest Updates
        </h2>

        {/* Scan-line separator */}
        <div className="relative w-40 h-[2px] mx-auto mb-5">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent, #00e5ff, transparent)",
              boxShadow: "0 0 8px rgba(0,229,255,0.8)",
            }}
          />
        </div>

        <p
          className="text-[14px] mb-[80px] text-center tracking-[0.06em]"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "rgba(140,200,255,0.55)",
          }}
        >
          News, research, and development updates from Tokamak Network
        </p>

        <LatestFeedClient reportItems={reportItems} />
      </div>

      {/* Bottom border line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(0,229,255,0.4) 30%, rgba(0,229,255,0.6) 50%, rgba(0,229,255,0.4) 70%, transparent 100%)",
        }}
      />
    </section>
  );
}
