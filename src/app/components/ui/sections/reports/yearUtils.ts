import type { ReportSummary } from "./types";

export interface YearGroup {
  year: number;
  reports: ReportSummary[];
}

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function groupByYear(reports: ReportSummary[]): YearGroup[] {
  const grouped = new Map<number, ReportSummary[]>();

  for (const report of reports) {
    const existing = grouped.get(report.year);
    if (existing) {
      grouped.set(report.year, [...existing, report]);
    } else {
      grouped.set(report.year, [report]);
    }
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, yearReports]) => ({ year, reports: yearReports }));
}

export function formatShortDate(report: ReportSummary): string {
  const month = SHORT_MONTHS[report.month - 1];
  if (!month) return `${report.startDay} — ${report.endDay}`;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${month} ${pad(report.startDay)} — ${pad(report.endDay)}`;
}

export function formatCompactStats(stats: ReportSummary["stats"]): string {
  return `${stats.linesChanged} lines changed · ${stats.activeRepos} projects`;
}
