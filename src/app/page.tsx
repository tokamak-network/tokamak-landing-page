import Header from "./components/ui/header";
import { Hero } from "./components/ui/sections/hero";
import { Protocols } from "./components/ui/sections/protocols";
import GettingStarted from "./components/ui/sections/getting-started";
import Insight from "./components/ui/sections/insight";
import NewsLetter from "./components/ui/sections/news-letter";
import Footer from "./components/ui/footer";
import { Carousel } from "./components/ui/sections/carousel";

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full font-[Proxima_Nova] bg-[#1C1C1C]">
      <Header />
      <Hero />
      <Carousel />
      <GettingStarted />
      <Protocols />
      <Insight />
      <NewsLetter />
      <Footer />
    </div>
  );
}
