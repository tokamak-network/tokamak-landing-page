import * as React from "react";
import { HeroSection } from "./Hero";
import { Pillar } from "./Pillar";
import "./pillar.css";

export const Hero: React.FC = () => {
  return (
    <div className="h-[860px] w-full overflow-hidden relative bg-white">
      <div
        className="w-full h-[2000px] bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          perspective: "1000px",
          transform: `translate(-50%, -50%) rotateX(65deg)`, // 그리드 레이어 회전 활성화
          transformOrigin: "center center",
        }}
      >
        <div className="grid grid-cols-[repeat(auto-fill,120px)] grid-rows-[repeat(auto-fill,120px)] w-full h-full">
          {/* 그리드 패턴만 표시 */}
          {Array.from({ length: Math.ceil((2000 * 800) / (80 * 80)) }).map(
            (_, i) => (
              <div
                key={i}
                className="relative"
                style={{
                  background: `
                    linear-gradient(135deg, transparent 49.5%, #e0e0e0 49.75%, #e0e0e0 50.25%, transparent 50.5%),
                    linear-gradient(45deg, transparent 49.5%, #e0e0e0 49.75%, #e0e0e0 50.25%, transparent 50.5%)
                  `,
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Pillar 애니메이션을 위한 별도 레이어 */}
      <div className="absolute left-0 top-0 w-full h-full">
        <div className="grid grid-cols-[repeat(auto-fill,120px)] grid-rows-[repeat(auto-fill,120px)] w-full h-full">
          {Array.from({ length: Math.ceil((2000 * 800) / (80 * 80)) }).map(
            (_, i) => (
              <div key={i} className="relative group">
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100">
                  <div className="group-hover:animate-pillar">
                    <Pillar />
                  </div>
                </div>
              </div>
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
