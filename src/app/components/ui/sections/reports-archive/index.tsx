import { ArrowUpRight } from "lucide-react";
import type { ReportSummary } from "@/app/lib/reports/types";
import SubpageHero from "@/app/components/ui/sections/subpage-hero";

const MONO_STYLE = { fontFamily: "var(--font-geist-mono), monospace" } as const;
const SANS_STYLE = {
  fontFamily: "var(--font-geist-sans), sans-serif",
} as const;

function CornerBrackets() {
  return (
    <>
      <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-[#4A8EFA]/55 pointer-events-none z-10" />
      <span className="absolute top-2 right-2 w-3 h-3 border-r border-t border-[#4A8EFA]/55 pointer-events-none z-10" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-[#4A8EFA]/55 pointer-events-none z-10" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-[#4A8EFA]/55 pointer-events-none z-10" />
    </>
  );
}

function ReportPill() {
  return (
    <span
      className="px-2 py-0.5 border bg-[#040814]/85 text-[9px] tracking-[0.32em] uppercase backdrop-blur-sm"
      style={{
        ...MONO_STYLE,
        color: "#7AB0FF",
        borderColor: "rgba(122,176,255,0.4)",
      }}
    >
      Report
    </span>
  );
}

function formatNum(s: string): string {
  const n = parseFloat(s.replace(/,/g, ""));
  if (!Number.isFinite(n)) return s;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return s;
}

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function getReportNum(r: ReportSummary): string | null {
  return r.reportNumber ? String(r.reportNumber).padStart(2, "0") : null;
}

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span
        className="text-white tracking-tight leading-none mb-2 tabular-nums"
        style={{
          ...SANS_STYLE,
          fontWeight: 700,
          fontSize: "clamp(20px, 2vw, 28px)",
        }}
      >
        {value}
      </span>
      <span
        className="text-[9px] tracking-[0.32em] uppercase text-white/50"
        style={MONO_STYLE}
      >
        {label}
      </span>
    </div>
  );
}

function NumberStamp({
  num,
  size,
}: {
  num: string | null;
  size: "lg" | "md";
}) {
  if (!num) return null;
  const fontSize =
    size === "lg" ? "clamp(120px, 14vw, 200px)" : "clamp(48px, 5vw, 72px)";
  return (
    <div
      className="text-[#9EC4FF] leading-[0.85] tracking-[-0.06em] select-none"
      style={{
        ...SANS_STYLE,
        fontWeight: 900,
        fontSize,
        textShadow: "0 0 30px rgba(42,114,229,0.5)",
      }}
    >
      #{num}
    </div>
  );
}

function NumberStampVisual({
  num,
  size,
}: {
  num: string | null;
  size: "lg" | "md";
}) {
  return (
    <div
      className={`relative ${
        size === "lg" ? "aspect-[4/3] lg:aspect-auto lg:h-full" : "aspect-[16/9]"
      } overflow-hidden flex items-center justify-center`}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.10] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(74,142,250,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(74,142,250,0.5) 1px, transparent 1px)",
          backgroundSize: size === "lg" ? "26px 26px" : "20px 20px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 40%, rgba(42,114,229,0.30) 0%, transparent 65%)",
        }}
      />
      <NumberStamp num={num} size={size} />
    </div>
  );
}

function Sparkline({
  id,
  values,
}: {
  id: string;
  values: number[];
}) {
  if (values.length < 2) {
    return (
      <div
        className="h-full flex items-center text-[9px] text-white/30 tracking-[0.3em] uppercase"
        style={MONO_STYLE}
      >
        Need 2+ reports
      </div>
    );
  }
  const W = 240;
  const H = 56;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = values.length > 1 ? W / (values.length - 1) : W;
  const pts = values.map((v, i) => {
    const x = i * stepX;
    const y = H - ((v - min) / range) * (H - 6) - 3;
    return [x, y] as const;
  });
  const linePath = pts
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${W} ${H} L 0 ${H} Z`;
  const [lastX, lastY] = pts[pts.length - 1];
  const gradId = `sparkfill-${id}`;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A8EFA" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#4A8EFA" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke="#4A8EFA"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={lastX} cy={lastY} r={5} fill="#7AB0FF" opacity={0.25} />
      <circle cx={lastX} cy={lastY} r={2.5} fill="#7AB0FF" />
    </svg>
  );
}

function MetricCard({
  id,
  label,
  values,
}: {
  id: string;
  label: string;
  values: number[];
}) {
  const current = values[values.length - 1] ?? 0;
  return (
    <div className="relative bg-[#040814] border border-[#4A8EFA]/22 p-4 lg:p-5 overflow-hidden">
      <CornerBrackets />
      <div className="mb-3">
        <span
          className="text-[10px] tracking-[0.32em] uppercase text-white/55"
          style={MONO_STYLE}
        >
          {label}
        </span>
      </div>
      <div className="mb-3">
        <span
          className="text-white tracking-tight tabular-nums leading-none"
          style={{
            ...SANS_STYLE,
            fontWeight: 800,
            fontSize: "clamp(22px, 2.2vw, 32px)",
          }}
        >
          {formatNum(String(current))}
        </span>
      </div>
      <div className="h-12 lg:h-14">
        <Sparkline id={id} values={values} />
      </div>
    </div>
  );
}

function MetricsOverview({ reports }: { reports: ReportSummary[] }) {
  // reports come newest-first; sparkline reads left=old → right=new
  const chrono = [...reports].reverse();
  const metrics = [
    {
      id: "lines",
      label: "Lines Changed",
      values: chrono.map((r) => parseNum(r.stats.linesChanged)),
    },
    {
      id: "net",
      label: "Net Growth",
      values: chrono.map((r) => parseNum(r.stats.netGrowth)),
    },
    {
      id: "repos",
      label: "Active Repos",
      values: chrono.map((r) => parseNum(r.stats.activeRepos)),
    },
  ];
  return (
    <section className="mb-12 lg:mb-16">
      <div className="flex items-center gap-4 mb-6">
        <span aria-hidden className="block h-px w-8 bg-white/20" />
        <span
          className="text-[10px] tracking-[0.4em] uppercase text-white/55"
          style={MONO_STYLE}
        >
          OVERVIEW · TRENDS
        </span>
        <span aria-hidden className="block h-px flex-1 bg-white/8" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.id} {...m} />
        ))}
      </div>
    </section>
  );
}

function FeaturedCard({ report }: { report: ReportSummary }) {
  const num = getReportNum(report);
  return (
    <a
      href={`/reports/${report.slug}.html`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] overflow-hidden bg-[#040814] border border-[#4A8EFA]/22 hover:border-[#4A8EFA]/55 transition-colors mb-12 lg:mb-16"
    >
      <NumberStampVisual num={num} size="lg" />
      <div className="relative p-6 lg:p-10 flex flex-col justify-between min-h-[280px]">
        <CornerBrackets />
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <ReportPill />
          <span
            className="text-[9px] tracking-[0.3em] uppercase text-white/55"
            style={MONO_STYLE}
          >
            {report.dateLabel}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h2
            className="text-white tracking-tight leading-[1.12] mb-6"
            style={{
              ...SANS_STYLE,
              fontWeight: 700,
              fontSize: "clamp(22px, 2.4vw, 36px)",
            }}
          >
            {report.executiveHeadline || report.dateLabel}
          </h2>
          <div className="grid grid-cols-3 gap-6 mt-4 pt-6 border-t border-white/10">
            <StatTile value={formatNum(report.stats.commits)} label="Commits" />
            <StatTile
              value={formatNum(report.stats.linesChanged)}
              label="Lines Changed"
            />
            <StatTile
              value={formatNum(report.stats.contributors)}
              label="Contributors"
            />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <span
            className="text-[11px] tracking-[0.3em] uppercase text-[#7AB0FF] group-hover:text-[#A6C8FF] transition-colors"
            style={MONO_STYLE}
          >
            Read full report
          </span>
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </a>
  );
}

function GridCard({ report }: { report: ReportSummary }) {
  const num = getReportNum(report);
  return (
    <a
      href={`/reports/${report.slug}.html`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden bg-[#040814] border border-[#4A8EFA]/22 hover:border-[#4A8EFA]/55 transition-colors"
    >
      <NumberStampVisual num={num} size="md" />
      <div className="relative p-4 lg:p-5 flex flex-col">
        <CornerBrackets />
        <div className="flex items-center justify-between mb-3 gap-2">
          <ReportPill />
          <span
            className="text-[9px] tracking-[0.3em] uppercase text-white/45"
            style={MONO_STYLE}
          >
            {report.dateLabel}
          </span>
        </div>
        <h3
          className="text-white tracking-tight leading-[1.18] line-clamp-2 mb-4 pr-8"
          style={{
            ...SANS_STYLE,
            fontWeight: 700,
            fontSize: "clamp(15px, 1.1vw, 17px)",
          }}
        >
          {report.executiveHeadline || report.dateLabel}
        </h3>
        <div
          className="flex items-center gap-3 text-[10px] tracking-[0.2em] uppercase text-white/55"
          style={MONO_STYLE}
        >
          <span className="tabular-nums">
            {formatNum(report.stats.commits)} commits
          </span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">
            {formatNum(report.stats.linesChanged)} lines
          </span>
        </div>
        <span className="absolute right-3 bottom-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight size={11} />
        </span>
      </div>
    </a>
  );
}

function ReportsTable({ reports }: { reports: ReportSummary[] }) {
  return (
    <div className="relative bg-[#040814] border border-[#4A8EFA]/22 overflow-x-auto">
      <CornerBrackets />
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr
            className="text-left text-[9px] tracking-[0.32em] uppercase text-white/55 border-b border-white/10"
            style={MONO_STYLE}
          >
            <th className="py-4 px-4 lg:px-6 font-normal">#</th>
            <th className="py-4 px-4 lg:px-6 font-normal">Period</th>
            <th className="py-4 px-4 lg:px-6 font-normal text-right">
              Lines Changed
            </th>
            <th className="py-4 px-4 lg:px-6 font-normal text-right">
              Net Growth
            </th>
            <th className="py-4 px-4 lg:px-6 font-normal text-right">
              Active Repos
            </th>
            <th className="py-4 px-4 lg:px-6 font-normal text-right sr-only">
              View
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, idx) => {
            const num = getReportNum(r);
            const href = `/reports/${r.slug}.html`;
            return (
              <tr
                key={r.slug}
                className={`group border-b border-white/5 hover:bg-[#2A72E5]/[0.08] transition-colors ${
                  idx % 2 === 1 ? "bg-white/[0.012]" : ""
                }`}
              >
                <td className="py-3.5 px-4 lg:px-6">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#7AB0FF] hover:text-[#A6C8FF] tabular-nums"
                    style={MONO_STYLE}
                  >
                    {num ? `#${num}` : "—"}
                  </a>
                </td>
                <td
                  className="py-3.5 px-4 lg:px-6 text-white/85"
                  style={SANS_STYLE}
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    {r.dateLabel}
                  </a>
                </td>
                <td
                  className="py-3.5 px-4 lg:px-6 text-right text-white/80 tabular-nums"
                  style={MONO_STYLE}
                >
                  {r.stats.linesChanged}
                </td>
                <td
                  className="py-3.5 px-4 lg:px-6 text-right text-white/80 tabular-nums"
                  style={MONO_STYLE}
                >
                  {r.stats.netGrowth}
                </td>
                <td
                  className="py-3.5 px-4 lg:px-6 text-right text-white/80 tabular-nums"
                  style={MONO_STYLE}
                >
                  {r.stats.activeRepos}
                </td>
                <td className="py-3.5 px-4 lg:px-6 text-right">
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${r.dateLabel}`}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/8 text-white/55 hover:bg-white hover:text-black transition-all"
                  >
                    <ArrowUpRight size={11} />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-[#02040a] text-white" style={SANS_STYLE}>
      <SubpageHero
        eyebrow="REPORTS · ARCHIVE"
        titleStart="No reports"
        titleAccent="yet."
        subhead="Check back when the first biweekly report ships."
      />
    </div>
  );
}

export default function ReportsArchive({
  reports,
}: {
  reports: ReportSummary[];
}) {
  if (reports.length === 0) {
    return <EmptyState />;
  }

  const featured = reports[0];
  const gridReports = reports.slice(1, 4); // next 3 most recent

  return (
    <div className="bg-[#02040a] text-white" style={SANS_STYLE}>
      <SubpageHero
        eyebrow="REPORTS · ARCHIVE"
        titleStart="Engineering"
        titleAccent="Reports."
        subhead="Biweekly snapshots of development across every Tokamak Network repository."
        videoMp4="/videos/stats.mp4"
      />

      <section className="relative max-w-[1280px] mx-auto px-6 sm:px-12 lg:px-16 pt-12 lg:pt-16 pb-24 lg:pb-32">
        {/* Overview — sparkline trends across all reports */}
        {reports.length >= 2 && <MetricsOverview reports={reports} />}

        {/* Featured */}
        <FeaturedCard report={featured} />

        {/* Grid — next 3 most recent */}
        {gridReports.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 mb-16 lg:mb-24">
            {gridReports.map((r) => (
              <GridCard key={r.slug} report={r} />
            ))}
          </div>
        )}

        {/* Table — full archive */}
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span aria-hidden className="block h-px w-8 bg-white/20" />
            <span
              className="text-[10px] tracking-[0.4em] uppercase text-white/55"
              style={MONO_STYLE}
            >
              FULL ARCHIVE · {String(reports.length).padStart(2, "0")}
            </span>
            <span aria-hidden className="block h-px flex-1 bg-white/8" />
          </div>
          <ReportsTable reports={reports} />
        </div>
      </section>
    </div>
  );
}
