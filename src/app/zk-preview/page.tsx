export const dynamic = "force-dynamic";

import ZkHero from "../components/ui/sections/zk-hero";
import ProductShowcase from "../components/ui/sections/product-showcase";
import { getTickerData } from "../components/ui/sections/data-ticker";
import TickerClient from "../components/ui/sections/data-ticker/TickerClient";
import { getEcosystemData } from "@/app/lib/ecosystem-data";
import ProjectBento from "../components/ui/sections/project-bento";
import EcosystemFan from "../components/ui/sections/ecosystem-fan";

export default async function ZkPreviewPage() {
  const [tickerItems, ecosystemData] = await Promise.all([
    getTickerData(),
    getEcosystemData(),
  ]);

  return (
    <main className="bg-black min-h-screen text-white">
      <ZkHero />
      <TickerClient items={tickerItems} />
      <ProductShowcase />
      <ProjectBento categories={ecosystemData.categories} />
      <EcosystemFan categories={ecosystemData.categories} />
    </main>
  );
}
