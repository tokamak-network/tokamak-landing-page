export const dynamic = "force-dynamic";

import Header from "./components/ui/header";
import ZkHero from "./components/ui/sections/zk-hero";
import ProductShowcase from "./components/ui/sections/product-showcase";
import { getTickerData } from "./components/ui/sections/data-ticker";
import TickerClient from "./components/ui/sections/data-ticker/TickerClient";
import { getEcosystemData } from "@/app/lib/ecosystem-data";
import ProjectBento from "./components/ui/sections/project-bento";
import StakingGovernance from "./components/ui/sections/staking-governance";
import LatestFeed from "./components/ui/sections/latest-feed";
import Community from "./components/ui/sections/community";
import Footer from "./components/ui/footer";
import SectionHud from "./components/ui/section-hud";
import { listReports } from "@/app/lib/reports/listReports";

const SECTIONS = [
  { id: "hero", label: "Intro", index: 1 },
  { id: "production", label: "Live Production", index: 2 },
  { id: "ecosystem", label: "Ecosystem", index: 3 },
  { id: "governance", label: "Governance", index: 4 },
  { id: "feed", label: "Latest", index: 5 },
];
const TOTAL = SECTIONS.length;

export default async function Home() {
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
      <Header />
      <div data-section="hero">
        <ZkHero />
      </div>
      <TickerClient items={tickerItems} />
      <div data-section="production">
        <ProductShowcase />
      </div>
      <div data-section="ecosystem">
        <ProjectBento
          categories={ecosystemData.categories}
          latestReportHref={latestReportHref}
        />
      </div>
      <div data-section="governance">
        <StakingGovernance />
      </div>
      <div data-section="feed">
        <LatestFeed />
      </div>
      <div data-section="community">
        <Community />
      </div>
      <Footer />
      <SectionHud sections={SECTIONS} total={TOTAL} />
    </main>
  );
}
