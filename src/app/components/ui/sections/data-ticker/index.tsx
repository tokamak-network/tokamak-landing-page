import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportSummary } from "@/app/lib/reports/parseReport";
import { FALLBACK_REPORT } from "@/app/lib/reports/constants";
import { fetchPriceDatas } from "@/app/api/price";
import TickerClient from "./TickerClient";

interface TickerItem {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  change?: string; // e.g. "+2.3%"
}

export { type TickerItem };

export async function getTickerData(): Promise<TickerItem[]> {
  try {
    const [priceData, reportStats] = await Promise.all([
      fetchPriceDatas().catch(() => null),
      Promise.resolve((() => {
        const metas = listReports();
        if (metas.length === 0) return null;
        const latest = metas[0];
        const filePath = getReportPath(latest.slug);
        if (!filePath) return null;
        return parseReportSummary(filePath, latest);
      })()),
    ]);

    const items: TickerItem[] = [];

    if (priceData) {
      items.push(
        { label: "TON", value: priceData.tonPrice.current.usd.toFixed(2), prefix: "$" },
        { label: "MARKET CAP", value: `$${(priceData.marketCap / 1e6).toFixed(1)}M` },
        { label: "24H VOLUME", value: `$${(priceData.tradingVolumeUSD / 1e6).toFixed(1)}M` },
      );
    }

    if (reportStats) {
      items.push(
        { label: "CODE CHANGES", value: reportStats.stats.linesChanged, suffix: "lines" },
        { label: "ACTIVE PROJECTS", value: reportStats.stats.activeRepos },
      );
      if (reportStats.stats.netGrowth && reportStats.stats.netGrowth !== "0") {
        items.push({ label: "NET GROWTH", value: reportStats.stats.netGrowth });
      }
    }

    // Fallback if nothing loaded
    if (items.length === 0) {
      return [
        { label: "TON", value: "1.20", prefix: "$" },
        { label: "MARKET CAP", value: "$70M" },
        { label: "24H VOLUME", value: "$1.2M" },
        { label: "CODE CHANGES", value: FALLBACK_REPORT.codeChanges, suffix: "lines" },
        { label: "ACTIVE PROJECTS", value: FALLBACK_REPORT.activeProjects },
      ];
    }

    return items;
  } catch {
    return [
      { label: "TON", value: "1.20", prefix: "$" },
      { label: "MARKET CAP", value: "$70M" },
      { label: "24H VOLUME", value: "$1.2M" },
      { label: "CODE CHANGES", value: FALLBACK_REPORT.codeChanges, suffix: "lines" },
      { label: "ACTIVE PROJECTS", value: FALLBACK_REPORT.activeProjects },
    ];
  }
}

export default async function DataTicker() {
  const items = await getTickerData();
  return <TickerClient items={items} />;
}
