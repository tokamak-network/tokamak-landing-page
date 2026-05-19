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

/**
 * Format a number for ticker display:
 * - Up to 100,000,000 (1억): show the full number with comma separators
 *   and up to 2 decimal places.
 * - 100M and above: abbreviate with "M" suffix, 2 decimals.
 */
function formatNum(n: number): string {
  if (n >= 100_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
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
        {
          label: "TON",
          value: priceData.tonPrice.current.usd.toFixed(2),
          prefix: "$",
        },
        {
          label: "MARKET CAP",
          value: formatNum(priceData.marketCap),
          prefix: "$",
        },
        {
          label: "24H VOLUME",
          value: formatNum(priceData.tradingVolumeUSD),
          prefix: "$",
        },
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
      { label: "MARKET CAP", value: "70,000,000", prefix: "$" },
      { label: "24H VOLUME", value: "1,200,000", prefix: "$" },
      { label: "CODE CHANGES", value: "0", prefix: "+" },
      { label: "ACTIVE PROJECTS", value: "0" },
    ];
  }
}

export default async function DataTicker() {
  const items = await getTickerData();
  return <TickerClient items={items} />;
}
