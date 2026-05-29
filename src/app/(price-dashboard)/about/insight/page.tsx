import type { Metadata } from "next";
import InsightArchive from "@/app/components/ui/sections/insight-archive";

export const metadata: Metadata = {
  title: "Insights — Tokamak Network",
  description:
    "Technical articles, research notes, and ecosystem updates from Tokamak Network.",
  alternates: { canonical: "/about/insight" },
};

// Static shell — Medium posts are fetched client-side via /api/medium, so the
// page has no server data dependency and need not be dynamic.

export default function InsightPage() {
  return <InsightArchive />;
}
