import Header from "./components/ui/header";
import HeroC from "./components/ui/sections/hero-c";
import NetworkDashboard from "./components/ui/sections/dashboard/NetworkDashboard";
import ActivityFeed from "./components/ui/sections/activity-feed";
import { ProtocolsC } from "./components/ui/sections/protocols/ProtocolsC";
import DeveloperCta from "./components/ui/sections/developer-cta";
import Footer from "./components/ui/footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full font-display bg-[#0a0a0a]">
      <Header />
      <HeroC />
      <NetworkDashboard />

      {/* Activity Feed + Protocols side-by-side */}
      <section className="w-full flex justify-center px-6 [@media(max-width:1000px)]:px-4 pb-12">
        <div className="w-full max-w-[1200px] grid grid-cols-1 [@media(min-width:1024px)]:grid-cols-3 gap-8">
          <div className="[@media(min-width:1024px)]:col-span-2">
            <ActivityFeed />
          </div>
          <ProtocolsC />
        </div>
      </section>

      <DeveloperCta />
      <Footer />
    </div>
  );
}
