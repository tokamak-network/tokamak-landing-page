export const dynamic = "force-dynamic";

import ZkHero from "../components/ui/sections/zk-hero";
import ConsoleShowcase from "../components/ui/sections/console-showcase";
import DioramaShowcase from "../components/ui/sections/diorama-showcase";
import LiveShowcase from "../components/ui/sections/live-showcase";

export default function ZkPreviewPage() {
  return (
    <main className="bg-black min-h-screen text-white">
      <ZkHero />
      <ConsoleShowcase />
      <DioramaShowcase />
      <LiveShowcase />
    </main>
  );
}
