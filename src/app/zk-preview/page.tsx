export const dynamic = "force-dynamic";

import ZkHero from "../components/ui/sections/zk-hero";
import ProductShowcase from "../components/ui/sections/product-showcase";

export default function ZkPreviewPage() {
  return (
    <main className="bg-black min-h-screen text-white">
      <ZkHero />
      <ProductShowcase />
    </main>
  );
}
