import fs from "fs";
import path from "path";
import type { ReportMeta } from "@/app/components/ui/sections/reports/types";
import { SLUG_PATTERN } from "./constants";

const REPORTS_DIR = path.join(process.cwd(), "public", "reports");

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function parseSlug(slug: string): ReportMeta | null {
  const match = slug.match(SLUG_PATTERN);
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const startDay = parseInt(match[3], 10);
  const endDay = parseInt(match[4], 10);

  if (month < 1 || month > 12) return null;
  if (startDay < 1 || startDay > 31) return null;
  if (endDay < 1 || endDay > 31) return null;

  const monthName = MONTH_NAMES[month - 1];
  if (!monthName) return null;

  const pad = (n: number) => String(n).padStart(2, "0");
  const dateLabel = `${monthName} ${pad(startDay)} — ${pad(endDay)}, ${year}`;

  return { slug, year, month, startDay, endDay, dateLabel };
}

export function listReports(): ReportMeta[] {
  if (!fs.existsSync(REPORTS_DIR)) return [];

  const files = fs.readdirSync(REPORTS_DIR);

  return files
    .filter((f) => f.endsWith(".html"))
    .map((f) => parseSlug(f.replace(".html", "")))
    .filter((meta): meta is ReportMeta => meta !== null)
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      if (a.month !== b.month) return b.month - a.month;
      return b.startDay - a.startDay;
    });
}

export function getReportPath(slug: string): string | null {
  if (!SLUG_PATTERN.test(slug)) return null;

  const filePath = path.join(REPORTS_DIR, `${slug}.html`);
  if (!fs.existsSync(filePath)) return null;

  return filePath;
}
