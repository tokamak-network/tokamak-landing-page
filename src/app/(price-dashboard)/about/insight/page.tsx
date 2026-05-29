import InsightArchive from "@/app/components/ui/sections/insight-archive";

// Static shell — Medium posts are fetched client-side via /api/medium, so the
// page has no server data dependency and need not be dynamic.

export default function InsightPage() {
  return <InsightArchive />;
}
