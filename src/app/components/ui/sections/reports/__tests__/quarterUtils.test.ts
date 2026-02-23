import { describe, it, expect } from "vitest";
import { getQuarter, groupByQuarter } from "../quarterUtils";
import type { ReportSummary } from "../types";

function makeSummary(
  overrides: Partial<ReportSummary> & Pick<ReportSummary, "slug" | "year" | "month">
): ReportSummary {
  return {
    startDay: 1,
    endDay: 14,
    dateLabel: "Jan 1–14, 2026",
    stats: {
      commits: "0",
      linesChanged: "0",
      activeRepos: "0",
      contributors: "0",
      netGrowth: "0",
    },
    executiveHeadline: "",
    ...overrides,
  };
}

describe("getQuarter", () => {
  it("returns Q1 for months 1-3", () => {
    expect(getQuarter(1)).toBe(1);
    expect(getQuarter(2)).toBe(1);
    expect(getQuarter(3)).toBe(1);
  });

  it("returns Q2 for months 4-6", () => {
    expect(getQuarter(4)).toBe(2);
    expect(getQuarter(5)).toBe(2);
    expect(getQuarter(6)).toBe(2);
  });

  it("returns Q3 for months 7-9", () => {
    expect(getQuarter(7)).toBe(3);
    expect(getQuarter(8)).toBe(3);
    expect(getQuarter(9)).toBe(3);
  });

  it("returns Q4 for months 10-12", () => {
    expect(getQuarter(10)).toBe(4);
    expect(getQuarter(11)).toBe(4);
    expect(getQuarter(12)).toBe(4);
  });

  it("throws RangeError for month 0", () => {
    expect(() => getQuarter(0)).toThrow(RangeError);
  });

  it("throws RangeError for month 13", () => {
    expect(() => getQuarter(13)).toThrow(RangeError);
  });

  it("throws RangeError for negative month", () => {
    expect(() => getQuarter(-1)).toThrow(RangeError);
  });
});

describe("groupByQuarter", () => {
  const reports: ReportSummary[] = [
    makeSummary({ slug: "report-2026-02-10-21", year: 2026, month: 2 }),
    makeSummary({ slug: "report-2026-01-27-07", year: 2026, month: 1 }),
    makeSummary({ slug: "report-2025-12-16-27", year: 2025, month: 12 }),
    makeSummary({ slug: "report-2025-11-04-15", year: 2025, month: 11 }),
    makeSummary({ slug: "report-2025-07-01-12", year: 2025, month: 7 }),
  ];

  it("groups reports into correct quarters", () => {
    const groups = groupByQuarter(reports);
    expect(groups).toHaveLength(3);
    expect(groups[0].label).toBe("2026 Q1");
    expect(groups[0].reports).toHaveLength(2);
    expect(groups[1].label).toBe("2025 Q4");
    expect(groups[1].reports).toHaveLength(2);
    expect(groups[2].label).toBe("2025 Q3");
    expect(groups[2].reports).toHaveLength(1);
  });

  it("sorts groups newest-first", () => {
    const groups = groupByQuarter(reports);
    const labels = groups.map((g) => g.label);
    expect(labels).toEqual(["2026 Q1", "2025 Q4", "2025 Q3"]);
  });

  it("preserves report order within each group", () => {
    const groups = groupByQuarter(reports);
    const q1Slugs = groups[0].reports.map((r) => r.slug);
    expect(q1Slugs).toEqual([
      "report-2026-02-10-21",
      "report-2026-01-27-07",
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(groupByQuarter([])).toEqual([]);
  });

  it("handles single report", () => {
    const single = [makeSummary({ slug: "report-2026-01-01-14", year: 2026, month: 1 })];
    const groups = groupByQuarter(single);
    expect(groups).toHaveLength(1);
    expect(groups[0].label).toBe("2026 Q1");
    expect(groups[0].reports).toHaveLength(1);
  });

  it("does not mutate the input array", () => {
    const input = [...reports];
    groupByQuarter(input);
    expect(input.map((r) => r.slug)).toEqual(reports.map((r) => r.slug));
  });
});
