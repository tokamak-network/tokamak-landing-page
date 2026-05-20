export const dynamic = "force-dynamic";

import ZkHero from "../components/ui/sections/zk-hero";
import ProductShowcase from "../components/ui/sections/product-showcase";
import { getTickerData } from "../components/ui/sections/data-ticker";
import TickerClient from "../components/ui/sections/data-ticker/TickerClient";
import { getEcosystemData } from "@/app/lib/ecosystem-data";
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
      <EcosystemFan categories={ecosystemData.categories} />
    </main>
  );
}
