"use client";

import { LINKS } from "@/app/constants/links";

export default function HeroB() {
  const scrollToPainPoints = () => {
    const el = document.getElementById("pain-points");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full min-h-[700px] flex items-center justify-center bg-black overflow-hidden px-6">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="relative z-10 max-w-[900px] text-center flex flex-col items-center gap-8 py-[200px] [@media(max-width:700px)]:py-[120px]">
        <h1 className="text-[54px] md:text-[80px] [@media(max-width:700px)]:text-[40px] leading-[1.05] font-[900] tracking-[0.06em] uppercase text-white">
          Every App Deserves Its Own L2.
        </h1>
        <h2 className="text-[20px] md:text-[26px] [@media(max-width:700px)]:text-[18px] font-[500] text-primary uppercase tracking-[0.04em]">
          Building one shouldn&apos;t take months.
        </h2>

        <div className="flex gap-4 pt-6 [@media(max-width:500px)]:flex-col [@media(max-width:500px)]:w-full">
          <a
            href={LINKS.ROLLUP_HUB}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-[16px] bg-primary text-black text-[14px] font-[700] uppercase tracking-[0.06em]
              hover:-translate-y-1 transition-all duration-300"
          >
            Start Building
          </a>
          <button
            onClick={scrollToPainPoints}
            className="px-10 py-[16px] bg-surface text-white text-[14px] font-[700] uppercase tracking-[0.06em]
              hover:-translate-y-1 transition-all duration-300"
          >
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
}
