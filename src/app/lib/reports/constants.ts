import type { ReportStats } from "@/app/components/ui/sections/reports/types";

export const SLUG_PATTERN = /^report-(\d{4})-(\d{2})-(\d{2})-(\d{2})$/;

export const DEFAULT_STATS: ReportStats = {
  commits: "0",
  linesChanged: "0",
  activeRepos: "0",
  contributors: "0",
  netGrowth: "0",
};

/** Fallback values used when no report data is available. Single source of truth. */
export const FALLBACK_REPORT = {
  activeProjects: "49",
  codeChanges: "3,603,187",
  netGrowth: "1,980,785",
} as const;
