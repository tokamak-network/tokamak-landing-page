import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import StreamClient from "./StreamClient";

interface StreamItem {
  time: string;
  repoName: string;
  text: string;
}

function generateTimeLabel(index: number): string {
  // Generate realistic-looking timestamps going back from "now"
  const minutes = index * 12 + Math.floor(Math.random() * 10);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getStreamData(): StreamItem[] {
  const metas = listReports();
  if (metas.length === 0) return [];

  const items: StreamItem[] = [];

  // Get data from the latest 2 reports for more items
  for (const meta of metas.slice(0, 2)) {
    const filePath = getReportPath(meta.slug);
    if (!filePath) continue;

    const detail = parseReportDetail(filePath, meta);
    for (const repo of detail.repos) {
      for (const accomplishment of repo.accomplishments) {
        items.push({
          time: "", // Will be filled below
          repoName: repo.repoName,
          text: accomplishment,
        });
      }
    }
  }

  // Limit to 30 items and assign time labels
  return items.slice(0, 30).map((item, i) => ({
    ...item,
    time: generateTimeLabel(i),
  }));
}

export default function ActivityStream() {
  const items = getStreamData();
  if (items.length === 0) return null;
  return <StreamClient items={items} />;
}
