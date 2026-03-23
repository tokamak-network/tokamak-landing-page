import Header from "./components/ui/header";
import TorusHero from "./components/ui/sections/torus-hero";
import VolumetricLight from "./components/ui/sections/torus-hero/VolumetricLight";
import TowerFloor from "./components/ui/sections/tower-floor";
import TowerShowcase from "./components/ui/sections/tower-showcase";
import DataTicker from "./components/ui/sections/data-ticker";
import EcosystemMetrics from "./components/ui/sections/ecosystem-metrics";
import EcosystemFlow from "./components/ui/sections/ecosystem-flow";
import ActivityStream from "./components/ui/sections/activity-stream";
import RepoLeaderboard from "./components/ui/sections/repo-leaderboard";
import DeveloperCta from "./components/ui/sections/developer-cta";
import LatestFeed from "./components/ui/sections/latest-feed";
import Footer from "./components/ui/footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Header />

      {/* Tower upper section — light curtain spans hero + showcase floor */}
      <div className="relative overflow-visible">
        <TorusHero />
        <VolumetricLight />

        {/* Tower Floor 1 (Top): Ecosystem Showcase — illuminated by torus */}
        <TowerFloor
          bgImage="/tower/floor-1-showcase.png"
          bgAlt="Tower top floor — ecosystem showcase with 10 category pedestals"
          isFirst
          showConnector={false}
        >
          <TowerShowcase />
        </TowerFloor>
      </div>

      {/* Tower Floor 2: Data Ticker */}
      <TowerFloor
        bgImage="/tower/floor-2-ticker.png"
        bgAlt="Tower floor 2 — live data ticker console"
      >
        <DataTicker />
      </TowerFloor>

      {/* Tower Floor 3: Ecosystem Metrics */}
      <TowerFloor
        bgImage="/tower/floor-3-metrics.png"
        bgAlt="Tower floor 3 — ecosystem metrics display"
      >
        <EcosystemMetrics />
      </TowerFloor>

      <EcosystemFlow />
      <ActivityStream />
      <RepoLeaderboard />
      <DeveloperCta />
      <LatestFeed />
      <Footer />
    </main>
  );
}
