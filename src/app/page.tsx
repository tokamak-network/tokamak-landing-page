import Header from "./components/ui/header";
import HeroC from "./components/ui/sections/hero-c";
import NetworkDashboard from "./components/ui/sections/dashboard/NetworkDashboard";
import ActivityFeed from "./components/ui/sections/activity-feed";
import { ProtocolsC } from "./components/ui/sections/protocols/ProtocolsC";
import DeveloperCta from "./components/ui/sections/developer-cta";
import Footer from "./components/ui/footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full font-[Proxima_Nova] bg-[#1C1C1C]">
      <Header />
      <HeroC />
      <NetworkDashboard />
      <ActivityFeed />
      <ProtocolsC />
      <DeveloperCta />
      <Footer />
    </div>
  );
}
