import Header from "./components/ui/header";
<<<<<<< HEAD
import { Protocols } from "./components/ui/sections/protocols";
import DeveloperCta from "./components/ui/sections/developer-cta";
import LatestFeed from "./components/ui/sections/latest-feed";
=======
<<<<<<< Updated upstream
import { Hero } from "./components/ui/sections/hero";
import { Protocols } from "./components/ui/sections/protocols";
import GettingStarted from "./components/ui/sections/getting-started";
import Insight from "./components/ui/sections/insight";
import NewsLetter from "./components/ui/sections/news-letter";
=======
import HeroB from "./components/ui/sections/hero-b";
import PainPoints from "./components/ui/sections/pain-points";
import Solution from "./components/ui/sections/solution";
import ProofWall from "./components/ui/sections/proof-wall";
import ProtocolsHighlight from "./components/ui/sections/protocols-highlight";
import DeveloperCta from "./components/ui/sections/developer-cta";
import LatestFeed from "./components/ui/sections/latest-feed";
>>>>>>> Stashed changes
>>>>>>> b86ce50 (feat: implement Approach B — Storytelling + Activity Proof homepage)
import Footer from "./components/ui/footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full font-[Proxima_Nova] bg-[#1C1C1C]">
      <Header />
<<<<<<< HEAD
      {/* Placeholder for version-specific Hero */}
      <div className="w-full h-[400px] bg-[#1C1C1C] flex items-center justify-center">
        <h1 className="text-white text-[36px] font-[100] text-center px-6">
          L2 On-Demand, <span className="font-[600]">Tailored for Ethereum</span>
        </h1>
      </div>
      <DeveloperCta />
      <Protocols />
      <LatestFeed />
=======
<<<<<<< Updated upstream
      <Hero />
      <Carousel />
      <GettingStarted />
      <Protocols />
      <Insight />
      <NewsLetter />
=======
      <HeroB />
      <PainPoints />
      <Solution />
      <ProofWall />
      <ProtocolsHighlight />
      <DeveloperCta />
      <LatestFeed />
>>>>>>> Stashed changes
>>>>>>> b86ce50 (feat: implement Approach B — Storytelling + Activity Proof homepage)
      <Footer />
    </div>
  );
}
