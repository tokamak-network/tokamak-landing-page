import Header from "./components/ui/header";
import HeroB from "./components/ui/sections/hero-b";
import PainPoints from "./components/ui/sections/pain-points";
import Solution from "./components/ui/sections/solution";
import ProductShowroom from "./components/ui/sections/product-showroom";
import ProofWall from "./components/ui/sections/proof-wall";
import ProtocolsHighlight from "./components/ui/sections/protocols-highlight";
import DeveloperCta from "./components/ui/sections/developer-cta";
import LatestFeed from "./components/ui/sections/latest-feed";
import Footer from "./components/ui/footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full font-display bg-black relative grain-overlay">
      <Header />
      <HeroB />
      <PainPoints />
      <Solution />
      <ProductShowroom />
      <ProofWall />
      <ProtocolsHighlight />
      <DeveloperCta />
      <LatestFeed />
      <Footer />
    </div>
  );
}
