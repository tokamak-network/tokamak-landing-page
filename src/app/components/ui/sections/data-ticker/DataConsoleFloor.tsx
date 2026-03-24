import { getTickerData } from "./index";
import ConceptSwitcher from "./concepts/ConceptSwitcher";

export default async function DataConsoleFloor() {
  const items = await getTickerData();

  return (
    <div className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Concept switcher — three data console designs */}
        <ConceptSwitcher items={items} />

        {/* Top edge fade */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none z-40"
          style={{
            height: "18%",
            background:
              "linear-gradient(180deg, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 65%, transparent 100%)",
          }}
        />
        {/* Bottom edge fade */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-40"
          style={{
            height: "18%",
            background:
              "linear-gradient(0deg, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 65%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
