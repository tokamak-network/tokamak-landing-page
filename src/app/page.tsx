import Header from "./components/ui/header";
import SimulatorHero from "./components/ui/sections/simulator";
import EcosystemDashboard from "./components/ui/sections/dashboard";
import UseCases from "./components/ui/sections/use-cases";
import RepoShowcase from "./components/ui/sections/repo-showcase";
import DeveloperCta from "./components/ui/sections/developer-cta";
import LatestFeed from "./components/ui/sections/latest-feed";
import Footer from "./components/ui/footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full font-display bg-black relative grain-overlay">
      <Header />
      <SimulatorHero />
      <EcosystemDashboard />
      <UseCases />
      <RepoShowcase />
      <DeveloperCta />
      <LatestFeed />
      <Footer />
    </div>
  );
}
