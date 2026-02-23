import { describe, it, expect, vi, beforeEach } from "vitest";
import { SLUG_PATTERN, SLUG_VALIDATION_PATTERN } from "../constants";

describe("SLUG_PATTERN", () => {
  it("matches valid slugs and captures groups", () => {
    const match = "report-2026-02-01-15".match(SLUG_PATTERN);
    expect(match).not.toBeNull();
    expect(match![1]).toBe("2026");
    expect(match![2]).toBe("02");
    expect(match![3]).toBe("01");
    expect(match![4]).toBe("15");
  });

  it("rejects invalid slug formats", () => {
    expect("report-2026-02-01".match(SLUG_PATTERN)).toBeNull();
    expect("report-2026-2-01-15".match(SLUG_PATTERN)).toBeNull();
    expect("2026-02-01-15".match(SLUG_PATTERN)).toBeNull();
    expect("report-abcd-02-01-15".match(SLUG_PATTERN)).toBeNull();
    expect("../../../etc/passwd".match(SLUG_PATTERN)).toBeNull();
  });
});

describe("SLUG_VALIDATION_PATTERN", () => {
  it("validates correct slugs", () => {
    expect(SLUG_VALIDATION_PATTERN.test("report-2026-02-01-15")).toBe(true);
    expect(SLUG_VALIDATION_PATTERN.test("report-2025-12-16-31")).toBe(true);
  });

  it("rejects path traversal attempts", () => {
    expect(
      SLUG_VALIDATION_PATTERN.test("../../../etc/passwd")
    ).toBe(false);
    expect(
      SLUG_VALIDATION_PATTERN.test("report-2026-02-01-15/../../../etc/passwd")
    ).toBe(false);
  });

  it("rejects slugs with extra characters", () => {
    expect(
      SLUG_VALIDATION_PATTERN.test("report-2026-02-01-15-extra")
    ).toBe(false);
    expect(
      SLUG_VALIDATION_PATTERN.test("prefix-report-2026-02-01-15")
    ).toBe(false);
  });
});

describe("listReports", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns empty array when reports directory does not exist", async () => {
    vi.doMock("fs", () => ({
      default: {
        existsSync: () => false,
        readdirSync: () => [],
      },
    }));

    const { listReports } = await import("../listReports");
    expect(listReports()).toEqual([]);
  });

  it("parses valid report filenames", async () => {
    vi.doMock("fs", () => ({
      default: {
        existsSync: () => true,
        readdirSync: () => [
          "report-2026-02-01-15.html",
          "report-2026-01-16-31.html",
          "not-a-report.html",
          "readme.txt",
        ],
      },
    }));

    const { listReports } = await import("../listReports");
    const reports = listReports();
    expect(reports).toHaveLength(2);
    expect(reports[0].slug).toBe("report-2026-02-01-15");
    expect(reports[1].slug).toBe("report-2026-01-16-31");
  });

  it("sorts newest first", async () => {
    vi.doMock("fs", () => ({
      default: {
        existsSync: () => true,
        readdirSync: () => [
          "report-2025-12-01-15.html",
          "report-2026-02-01-15.html",
          "report-2026-01-16-31.html",
        ],
      },
    }));

    const { listReports } = await import("../listReports");
    const reports = listReports();
    expect(reports[0].year).toBe(2026);
    expect(reports[0].month).toBe(2);
    expect(reports[2].year).toBe(2025);
  });

  it("generates correct dateLabel", async () => {
    vi.doMock("fs", () => ({
      default: {
        existsSync: () => true,
        readdirSync: () => ["report-2026-02-01-15.html"],
      },
    }));

    const { listReports } = await import("../listReports");
    const reports = listReports();
    expect(reports[0].dateLabel).toBe("February 01 — 15, 2026");
  });

  it("rejects invalid month values", async () => {
    vi.doMock("fs", () => ({
      default: {
        existsSync: () => true,
        readdirSync: () => [
          "report-2026-13-01-15.html",
          "report-2026-00-01-15.html",
        ],
      },
    }));

    const { listReports } = await import("../listReports");
    expect(listReports()).toEqual([]);
  });

  it("rejects invalid day values", async () => {
    vi.doMock("fs", () => ({
      default: {
        existsSync: () => true,
        readdirSync: () => [
          "report-2026-02-00-15.html",
          "report-2026-02-01-32.html",
        ],
      },
    }));

    const { listReports } = await import("../listReports");
    expect(listReports()).toEqual([]);
  });
});

describe("getReportPath", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("returns null for invalid slugs", async () => {
    vi.doMock("fs", () => ({
      default: {
        existsSync: () => true,
      },
    }));

    const { getReportPath } = await import("../listReports");
    expect(getReportPath("../../../etc/passwd")).toBeNull();
    expect(getReportPath("not-valid")).toBeNull();
  });

  it("returns null when file does not exist", async () => {
    vi.doMock("fs", () => ({
      default: {
        existsSync: () => false,
      },
    }));

    const { getReportPath } = await import("../listReports");
    expect(getReportPath("report-2026-02-01-15")).toBeNull();
  });

  it("returns file path for valid existing report", async () => {
    vi.doMock("fs", () => ({
      default: {
        existsSync: () => true,
      },
    }));

    const { getReportPath } = await import("../listReports");
    const result = getReportPath("report-2026-02-01-15");
    expect(result).toContain("report-2026-02-01-15.html");
    expect(result).toContain("public/reports/");
  });
});
