"use client";

import HeroContent from "./HeroContent";

interface HeroVisualProps {
  codeChanges: number;
  netGrowth: number;
  activeProjects: number;
  totalStaked: number;
}

export default function HeroVisual({
  codeChanges,
  netGrowth,
  activeProjects,
  totalStaked,
}: HeroVisualProps) {
  return (
    <section
      id="hero-visual"
      className="relative z-10 w-full min-h-screen flex items-center overflow-hidden bg-black"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      <div className="relative z-[2] w-full max-w-[1280px] mx-auto px-6 py-[120px] md:py-[160px]">
        <HeroContent
          codeChanges={codeChanges}
          netGrowth={netGrowth}
          activeProjects={activeProjects}
          totalStaked={totalStaked}
        />
      </div>
    </section>
  );
}
