import Header from "./components/ui/header";
import IntroSequence from "./components/ui/sections/intro-sequence";
import TorusHero from "./components/ui/sections/torus-hero";
import VolumetricLight from "./components/ui/sections/torus-hero/VolumetricLight";
import TowerFloor from "./components/ui/sections/tower-floor";
import FloorIndicator from "./components/ui/sections/tower-floor/FloorIndicator";
import TowerShowcase from "./components/ui/sections/tower-showcase";
import DataConsoleContent from "./components/ui/sections/data-ticker/DataConsoleContent";
import ThanosL2Overlay from "./components/ui/sections/thanos-l2";
import GovernanceStakingOverlay from "./components/ui/sections/governance-staking";
import TowerFoundation from "./components/ui/sections/tower-foundation";
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

      {/* Tower Floor 1: Thanos L2 Infrastructure */}
      <TowerFloor
        bgImage="/tower/floor-thanos-l2.png"
        bgAlt="Tower floor 1 — Thanos L2 infrastructure launch platform"
      >
        <ThanosL2Overlay />
      </TowerFloor>

      {/* Floor transition indicator */}
      <FloorIndicator floor={0} label="Governance & Staking" />

      {/* Tower Floor 0 (Bottom): Governance & Staking */}
      <TowerFloor
        bgImage="/tower/floor-governance-staking.png"
        bgAlt="Tower floor 0 — governance voting chamber and staking crystal matrix"
        isLast
      >
        <GovernanceStakingOverlay />
      </TowerFloor>

      {/* Floor transition indicator */}
      <FloorIndicator floor={-1} label="Foundation · Built on Ethereum" />

      {/* Foundation — Footer with Ethereum base */}
      <TowerFoundation />
    </main>
  );
}
