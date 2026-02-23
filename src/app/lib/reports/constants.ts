import type { ReportStats } from "@/app/components/ui/sections/reports/types";

export const SLUG_PATTERN = /^report-(\d{4})-(\d{2})-(\d{2})-(\d{2})$/;

export const SLUG_VALIDATION_PATTERN = /^report-\d{4}-\d{2}-\d{2}-\d{2}$/;

export const DEFAULT_STATS: ReportStats = {
  commits: "0",
  linesChanged: "0",
  activeRepos: "0",
  contributors: "0",
  netGrowth: "0",
};
