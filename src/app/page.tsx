import { NavigationBar } from "./components/ui/header";
import { Hero } from "./components/ui/sections/hero";
import { Partners } from "./components/ui/sections/partners";
import { Protocols } from "./components/ui/sections/protocols";
import GettingStarted from "./components/ui/sections/getting-started";
import Insight from "./components/ui/sections/insight";
import NewsLetter from "./components/ui/sections/news-letter";
import Footer from "./components/ui/footer";
export default function Home() {
  return (
    <div className="flex flex-col items-center w-full font-[Proxima_Nova] bg-[#1C1C1C]">
      <NavigationBar />
      <Hero />
      <Partners />
      <GettingStarted />
      <Protocols />
      <Insight />
      <NewsLetter />
      <Footer />
    </div>
  );
}
