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
    <section className="relative w-full min-h-[600px] flex items-center justify-center bg-gradient-to-b from-[#0a0e1a] to-[#1C1C1C] overflow-hidden px-6">
      {/* Subtle background grid effect */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-[800px] text-center flex flex-col items-center gap-8 py-[120px] [@media(max-width:700px)]:py-[80px]">
        <h1 className="text-[48px] [@media(max-width:700px)]:text-[32px] leading-[1.2] font-[300] text-white">
          Every app deserves its own L2.
          <br />
          <span className="font-[500]">
            But building one shouldn&apos;t take months.
          </span>
        </h1>

        <p className="text-[18px] [@media(max-width:700px)]:text-[16px] text-white/60 max-w-[560px] font-[300] leading-relaxed">
          Tokamak Network lets you launch a dedicated, customizable L2 on
          Ethereum — in minutes, not months.
        </p>

        <div className="flex gap-4 mt-4 [@media(max-width:500px)]:flex-col [@media(max-width:500px)]:w-full">
          <a
            href={LINKS.ROLLUP_HUB}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[#0078FF] text-white text-[16px] font-[500] rounded-full hover:bg-[#0062d1] transition-colors"
          >
            Start Building
          </a>
          <button
            onClick={scrollToPainPoints}
            className="px-8 py-3 border border-white/30 text-white/80 text-[16px] font-[400] rounded-full hover:border-white/60 hover:text-white transition-colors"
          >
            See How It Works ↓
          </button>
        </div>
      </div>
    </section>
  );
}
