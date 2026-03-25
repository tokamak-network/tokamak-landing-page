import Header from "./components/ui/header";
import IntroSequence from "./components/ui/sections/intro-sequence";
import TorusHero from "./components/ui/sections/torus-hero";
import VolumetricLight from "./components/ui/sections/torus-hero/VolumetricLight";
import TowerFloor from "./components/ui/sections/tower-floor";
import FloorIndicator from "./components/ui/sections/tower-floor/FloorIndicator";
import TowerShowcase from "./components/ui/sections/tower-showcase";
import DataConsoleContent from "./components/ui/sections/data-ticker/DataConsoleContent";
import ThanosL2Overlay from "./components/ui/sections/thanos-l2";
import EcosystemFlow from "./components/ui/sections/ecosystem-flow";
import ActivityStream from "./components/ui/sections/activity-stream";
import RepoLeaderboard from "./components/ui/sections/repo-leaderboard";
import DeveloperCta from "./components/ui/sections/developer-cta";
import LatestFeed from "./components/ui/sections/latest-feed";
import Footer from "./components/ui/footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <IntroSequence videoSrc="/intro-video.mp4" />
      <Header />

      {/* Tower upper section — light curtain spans hero + showcase floor */}
      <div className="relative overflow-visible">
        <TorusHero />
        <VolumetricLight />

        {/* Floor transition indicator */}
        <FloorIndicator floor={3} label="Ecosystem Showcase" />

        {/* Tower Floor 3 (Top): Ecosystem Showcase — illuminated by torus */}
        <TowerFloor
          bgImage="/tower/floor-1-showcase.png"
          bgAlt="Tower top floor — ecosystem showcase with 10 category pedestals"
          isFirst
        >
          <TowerShowcase />
        </TowerFloor>
      </div>

      {/* Floor transition indicator */}
      <FloorIndicator floor={2} label="Live Data Console" />

      {/* Tower Floor 2 (Mid): Live Data Console */}
      <TowerFloor
        bgImage="/tower/floor-2-dataconsole.png"
        bgAlt="Tower floor 2 — live data console command center"
      >
        <DataConsoleContent />
      </TowerFloor>

      {/* Floor transition indicator */}
      <FloorIndicator floor={1} label="Thanos L2" />

      {/* Tower Floor 1 (Bottom): Thanos L2 Infrastructure */}
      <TowerFloor
        bgImage="/tower/floor-3-thanos.png"
        bgAlt="Tower floor 3 — Thanos L2 infrastructure launch platform"
        isLast
      >
        <ThanosL2Overlay />
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
