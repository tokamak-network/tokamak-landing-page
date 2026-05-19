export const dynamic = "force-dynamic";

import ZkHero from "../components/ui/sections/zk-hero";
import ProductShowcase from "../components/ui/sections/product-showcase";
import { getTickerData } from "../components/ui/sections/data-ticker";
import TickerClient from "../components/ui/sections/data-ticker/TickerClient";

export default async function ZkPreviewPage() {
  const tickerItems = await getTickerData();

  return (
    <main className="bg-black min-h-screen text-white">
      <ZkHero />
      <TickerClient items={tickerItems} />
      <ProductShowcase />
    </main>
  );
}
