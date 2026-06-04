import type { MetadataRoute } from "next";
import { listReports } from "@/app/lib/reports/listReports";

const BASE = "https://tokamak.network";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about/price`, changeFrequency: "hourly", priority: 0.8 },
    { url: `${BASE}/about/insight`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/about/reports`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/about/partners`, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Biweekly report HTML files served from /public/reports.
  const reports: MetadataRoute.Sitemap = listReports().map((r) => ({
    url: `${BASE}/reports/${r.slug}.html`,
    lastModified: new Date(r.year, r.month - 1, r.endDay),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticPages, ...reports];
}
