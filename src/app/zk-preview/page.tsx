export const dynamic = "force-dynamic";

import ZkHero from "../components/ui/sections/zk-hero";
import LiveShowcase from "../components/ui/sections/live-showcase";

export default function ZkPreviewPage() {
  return (
    <main className="bg-black min-h-screen text-white">
      <ZkHero />
      <LiveShowcase />
    </main>
  );
}
