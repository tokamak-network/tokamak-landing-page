import * as React from "react";
import { HeroSection } from "./Hero";
import { Pillar } from "./Pillar";

export const Hero: React.FC = () => {
  return (
    <div className="h-[860px] w-full overflow-hidden relative bg-white">
      <div
        className="w-full h-[2000px] bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          perspective: "1000px",
          transform: `translate(-50%, -50%) rotateX(65deg)`,
          transformOrigin: "center center",
        }}
      >
        <div className="grid grid-cols-[repeat(auto-fill,120px)] grid-rows-[repeat(auto-fill,120px)] w-full h-full">
          {Array.from({ length: Math.ceil((2000 * 2000) / (120 * 120)) }).map(
            (_, i) => (
              <div
                key={i}
                className=" relative group"
                style={{
                  transformStyle: "preserve-3d",
                  background: `
              linear-gradient(135deg, transparent 49.5%, #e0e0e0 49.75%, #e0e0e0 50.25%, transparent 50.5%),
              linear-gradient(45deg, transparent 49.5%, #e0e0e0 49.75%, #e0e0e0 50.25%, transparent 50.5%)
            `,
                }}
              ></div>
            )
          )}
        </div>
      </div>

      {/* <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <HeroSection />
      </div> */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ perspective: "1000px" }}
      >
        <Pillar />
      </div>
    </div>
  );
};
//
