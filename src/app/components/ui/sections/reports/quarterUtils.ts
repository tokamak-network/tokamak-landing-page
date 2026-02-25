import type { ReportSummary } from "./types";

export type Quarter = 1 | 2 | 3 | 4;

export interface QuarterGroup {
  year: number;
  quarter: Quarter;
  label: string;
  reports: ReportSummary[];
}

export function getQuarter(month: number): Quarter {
  if (month < 1 || month > 12) {
    throw new RangeError(`Invalid month: ${month}. Expected 1-12.`);
  }
  return Math.ceil(month / 3) as Quarter;
}

export function groupByQuarter(reports: ReportSummary[]): QuarterGroup[] {
  const grouped = new Map<string, QuarterGroup>();

  for (const report of reports) {
    const quarter = getQuarter(report.month);
    const key = `${report.year}-Q${quarter}`;

    const existing = grouped.get(key);
    if (existing) {
      grouped.set(key, {
        ...existing,
        reports: [...existing.reports, report],
      });
    } else {
      grouped.set(key, {
        year: report.year,
        quarter,
        label: `${report.year} Q${quarter}`,
        reports: [report],
      });
    }
  }

  return [...grouped.values()].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.quarter - a.quarter;
  });
}
