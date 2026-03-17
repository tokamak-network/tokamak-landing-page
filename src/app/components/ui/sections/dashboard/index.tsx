import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportSummary } from "@/app/lib/reports/parseReport";
import { FALLBACK_REPORT } from "@/app/lib/reports/constants";
import { fetchPriceDatas } from "@/app/api/price";
import MetricCard from "./MetricCard";

interface PriceMetrics {
  tonPrice: string;
  marketCap: string;
  volume24h: string;
  tvl: string;
}

const FALLBACK_PRICE: PriceMetrics = {
  tonPrice: "1.20",
  marketCap: "70,000,000",
  volume24h: "500,000",
  tvl: "28,500,000",
};

async function fetchPriceMetrics(): Promise<PriceMetrics> {
  try {
    const data = await fetchPriceDatas();
    return {
      tonPrice: data.tonPrice.current.usd.toFixed(2),
      marketCap: Math.floor(data.marketCap).toLocaleString("en-US"),
      volume24h: Math.floor(data.tradingVolumeUSD).toLocaleString("en-US"),
      tvl: Math.floor(data.stakedVolume).toLocaleString("en-US"),
    };
  } catch {
    return FALLBACK_PRICE;
  }
}

function getLatestReportStats(): {
  activeRepos: string;
  linesChanged: string;
  reportLabel: string;
} | null {
  const metas = listReports();
  if (metas.length === 0) return null;

  const latest = metas[0];
  const filePath = getReportPath(latest.slug);
  if (!filePath) return null;

  const summary = parseReportSummary(filePath, latest);
  if (!summary) return null;

  const reportLabel = latest.reportNumber
    ? `Biweekly #${latest.reportNumber}`
    : latest.dateLabel;

  return {
    activeRepos: summary.stats.activeRepos,
    linesChanged: summary.stats.linesChanged,
    reportLabel,
  };
}

export default async function EcosystemDashboard() {
  const [priceMetrics, reportStats] = await Promise.all([
    fetchPriceMetrics(),
    Promise.resolve(getLatestReportStats()),
  ]);

  const reportLabel = reportStats?.reportLabel ?? "latest report";

  const metrics = [
    {
      label: "TON Price",
      value: priceMetrics.tonPrice,
      description: "Current price on Upbit",
      prefix: "$",
      decimals: 2,
      delay: 0,
    },
    {
      label: "Market Cap",
      value: priceMetrics.marketCap,
      description: "Fully circulating market cap",
      prefix: "$",
      delay: 100,
    },
    {
      label: "24h Volume",
      value: priceMetrics.volume24h,
      description: "Trading volume on Upbit (24h)",
      prefix: "$",
      delay: 200,
    },
    {
      label: "Total Staked",
      value: priceMetrics.tvl,
      description: "TON staked across the network",
      suffix: "TON",
      delay: 300,
    },
    {
      label: "Active Projects",
      value: reportStats?.activeRepos ?? FALLBACK_REPORT.activeProjects,
      description: `Repositories tracked in ${reportLabel}`,
      delay: 400,
    },
    {
      label: "Code Changes",
      value: reportStats?.linesChanged ?? FALLBACK_REPORT.codeChanges,
      description: `Lines changed in ${reportLabel}`,
      delay: 500,
    },
  ];

  return (
    <section className="relative z-10 w-full flex justify-center px-6 pt-[80px] pb-[160px] [@media(max-width:640px)]:py-[60px]">
      <div className="w-full max-w-[1280px] flex flex-col items-center">
        <h2 className="text-[38px] md:text-[48px] font-[900] text-white tracking-[0.06em] uppercase mb-3 text-center">
          Ecosystem
        </h2>
        <div className="w-10 h-[3px] bg-primary mx-auto mb-5" />
        <p className="text-[16px] text-[#929298] mb-[80px] text-center">
          Live metrics from the Tokamak Network ecosystem
        </p>
        <div className="grid grid-cols-3 gap-[1px] w-full [@media(max-width:800px)]:grid-cols-1">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              label={metric.label}
              value={metric.value}
              description={metric.description}
              prefix={metric.prefix}
              suffix={metric.suffix}
              decimals={metric.decimals}
              delay={metric.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
