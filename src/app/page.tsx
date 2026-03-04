import Header from "./components/ui/header";
import { Protocols } from "./components/ui/sections/protocols";
import DeveloperCta from "./components/ui/sections/developer-cta";
import LatestFeed from "./components/ui/sections/latest-feed";
import Footer from "./components/ui/footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full font-[Proxima_Nova] bg-[#1C1C1C]">
      <Header />
      {/* Placeholder for version-specific Hero */}
      <div className="w-full h-[400px] bg-[#1C1C1C] flex items-center justify-center">
        <h1 className="text-white text-[36px] font-[100] text-center px-6">
          L2 On-Demand, <span className="font-[600]">Tailored for Ethereum</span>
        </h1>
      </div>
      <DeveloperCta />
      <Protocols />
      <LatestFeed />
      <Footer />
    </div>
  );
}
