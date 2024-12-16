import { NavigationBar } from "./components/ui/header";
import { Hero } from "./components/ui/sections/hero";
import { Partners } from "./components/ui/sections/partners";
import { Protocols } from "./components/ui/sections/protocols";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full font-[Proxima_Nova]">
      <NavigationBar />
      <Hero />
      <Partners />
      <Protocols />
    </div>
  );
}
