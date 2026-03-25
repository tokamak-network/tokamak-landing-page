import Header from "./components/ui/header";
import IntroSequence from "./components/ui/sections/intro-sequence";
import TorusHero from "./components/ui/sections/torus-hero";
import VolumetricLight from "./components/ui/sections/torus-hero/VolumetricLight";
import TowerFloor from "./components/ui/sections/tower-floor";
import FloorIndicator from "./components/ui/sections/tower-floor/FloorIndicator";
import TowerShowcase from "./components/ui/sections/tower-showcase";
import DataConsoleContent from "./components/ui/sections/data-ticker/DataConsoleContent";
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
        isLast
      >
        <DataConsoleContent />
      </TowerFloor>
    </main>
  );
}
