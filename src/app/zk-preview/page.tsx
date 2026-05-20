export const dynamic = "force-dynamic";

import ZkHero from "../components/ui/sections/zk-hero";
import ProductShowcase from "../components/ui/sections/product-showcase";
import { getTickerData } from "../components/ui/sections/data-ticker";
import TickerClient from "../components/ui/sections/data-ticker/TickerClient";
import { getEcosystemData } from "@/app/lib/ecosystem-data";
import ProjectBento from "../components/ui/sections/project-bento";
import EcosystemFan from "../components/ui/sections/ecosystem-fan";
import { listReports } from "@/app/lib/reports/listReports";

export default async function ZkPreviewPage() {
  const [tickerItems, ecosystemData] = await Promise.all([
    getTickerData(),
    getEcosystemData(),
  ]);

  const reports = listReports();
  const latestReportHref = reports.length > 0
    ? `/reports/${reports[0].slug}.html`
    : undefined;

  return (
    <main className="bg-black min-h-screen text-white">
      <ZkHero />
      <TickerClient items={tickerItems} />
      <ProductShowcase />
      <ProjectBento
        categories={ecosystemData.categories}
        latestReportHref={latestReportHref}
      />
      <EcosystemFan categories={ecosystemData.categories} />
    </main>
  );
}
