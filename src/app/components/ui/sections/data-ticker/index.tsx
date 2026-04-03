import { getEcosystemData } from "@/app/lib/ecosystem-data";
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

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

export async function getTickerData(): Promise<TickerItem[]> {
  try {
    const [priceData, ecoData] = await Promise.all([
      fetchPriceDatas().catch(() => null),
      getEcosystemData(),
    ]);

    const items: TickerItem[] = [];

    if (priceData) {
      items.push(
        { label: "TON", value: priceData.tonPrice.current.usd.toFixed(2), prefix: "$" },
        { label: "MARKET CAP", value: priceData.marketCap >= 1e6 ? `$${(priceData.marketCap / 1e6).toFixed(1)}M` : `$${priceData.marketCap.toLocaleString()}` },
        { label: "24H VOLUME", value: priceData.tradingVolumeUSD >= 1e6 ? `$${(priceData.tradingVolumeUSD / 1e6).toFixed(1)}M` : `$${priceData.tradingVolumeUSD.toLocaleString()}` },
      );
    }

    items.push(
      { label: "CODE CHANGES", value: formatNum(ecoData.codeChanges), prefix: "+" },
      { label: "ACTIVE PROJECTS", value: String(ecoData.activeProjects) },
    );
    if (ecoData.netGrowth && ecoData.netGrowth !== 0) {
      items.push({ label: "NET GROWTH", value: formatNum(ecoData.netGrowth) });
    }

    return items;
  } catch {
    return [
      { label: "TON", value: "1.20", prefix: "$" },
      { label: "MARKET CAP", value: "$70M" },
      { label: "24H VOLUME", value: "$1.2M" },
      { label: "CODE CHANGES", value: "0", prefix: "+" },
      { label: "ACTIVE PROJECTS", value: "0" },
    ];
  }
}

export default async function DataTicker() {
  const items = await getTickerData();
  return <TickerClient items={items} />;
}
