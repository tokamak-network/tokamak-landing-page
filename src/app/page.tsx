import Header from "./components/ui/header";
import SimulatorHero from "./components/ui/sections/simulator";
import EcosystemDashboard from "./components/ui/sections/dashboard";
import UseCases from "./components/ui/sections/use-cases";
import DeveloperCta from "./components/ui/sections/developer-cta";
import LatestFeed from "./components/ui/sections/latest-feed";
import Footer from "./components/ui/footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full font-display bg-[#0a0a0a] mesh-gradient relative">
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern pointer-events-none opacity-50 z-0" />
      <Header />
      <SimulatorHero />
      <EcosystemDashboard />
      <UseCases />
      <DeveloperCta />
      <LatestFeed />
      <Footer />
    </div>
  );
}
