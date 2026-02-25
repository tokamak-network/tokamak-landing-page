import { describe, it, expect } from "vitest";
import { groupByYear, formatShortDate, formatCompactStats } from "../yearUtils";
import type { ReportSummary } from "../types";

function makeSummary(
  overrides: Partial<ReportSummary> & Pick<ReportSummary, "slug" | "year" | "month">
): ReportSummary {
  return {
    startDay: 1,
    endDay: 14,
    dateLabel: "Jan 01 — 14, 2026",
    stats: {
      commits: "1,000",
      linesChanged: "+2.0M",
      activeRepos: "40",
      contributors: "10",
      netGrowth: "+1.0M",
    },
    executiveHeadline: "",
    ...overrides,
  };
}

describe("groupByYear", () => {
  const reports: ReportSummary[] = [
    makeSummary({ slug: "report-2026-02-01-15", year: 2026, month: 2 }),
    makeSummary({ slug: "report-2026-01-15-31", year: 2026, month: 1 }),
    makeSummary({ slug: "report-2025-12-16-27", year: 2025, month: 12 }),
    makeSummary({ slug: "report-2025-11-01-15", year: 2025, month: 11 }),
    makeSummary({ slug: "report-2024-06-01-14", year: 2024, month: 6 }),
  ];

  it("groups reports by year", () => {
    const groups = groupByYear(reports);
    expect(groups).toHaveLength(3);
    expect(groups[0].year).toBe(2026);
    expect(groups[0].reports).toHaveLength(2);
    expect(groups[1].year).toBe(2025);
    expect(groups[1].reports).toHaveLength(2);
    expect(groups[2].year).toBe(2024);
    expect(groups[2].reports).toHaveLength(1);
  });

  it("sorts years newest-first", () => {
    const groups = groupByYear(reports);
    const years = groups.map((g) => g.year);
    expect(years).toEqual([2026, 2025, 2024]);
  });

  it("preserves report order within each year", () => {
    const groups = groupByYear(reports);
    const slugs2026 = groups[0].reports.map((r) => r.slug);
    expect(slugs2026).toEqual([
      "report-2026-02-01-15",
      "report-2026-01-15-31",
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(groupByYear([])).toEqual([]);
  });

  it("handles single report", () => {
    const single = [makeSummary({ slug: "report-2026-01-01-14", year: 2026, month: 1 })];
    const groups = groupByYear(single);
    expect(groups).toHaveLength(1);
    expect(groups[0].year).toBe(2026);
    expect(groups[0].reports).toHaveLength(1);
  });

  it("does not mutate the input array", () => {
    const input = [...reports];
    groupByYear(input);
    expect(input.map((r) => r.slug)).toEqual(reports.map((r) => r.slug));
  });
});

describe("formatShortDate", () => {
  it("formats a standard date range", () => {
    const report = makeSummary({ slug: "report-2026-02-01-15", year: 2026, month: 2, startDay: 1, endDay: 15 });
    expect(formatShortDate(report)).toBe("Feb 01 — 15");
  });

  it("pads single-digit days", () => {
    const report = makeSummary({ slug: "report-2026-01-01-09", year: 2026, month: 1, startDay: 1, endDay: 9 });
    expect(formatShortDate(report)).toBe("Jan 01 — 09");
  });

  it("handles December", () => {
    const report = makeSummary({ slug: "report-2025-12-16-27", year: 2025, month: 12, startDay: 16, endDay: 27 });
    expect(formatShortDate(report)).toBe("Dec 16 — 27");
  });
});

describe("formatCompactStats", () => {
  it("formats stats inline", () => {
    const stats = {
      commits: "2,161",
      linesChanged: "+4.9M",
      activeRepos: "67",
      contributors: "16",
      netGrowth: "+3.0M",
    };
    expect(formatCompactStats(stats)).toBe("+4.9M code changes · 67 projects");
  });
});
