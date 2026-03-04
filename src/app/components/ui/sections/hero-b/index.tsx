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
    <section className="relative w-full min-h-[600px] flex items-center justify-center bg-gradient-to-b from-[#e6f0ff] to-white overflow-hidden px-6">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#0078FF]/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[900px] text-center flex flex-col items-center gap-8 py-[120px] [@media(max-width:700px)]:py-[80px]">
        <h1 className="text-[48px] md:text-[72px] [@media(max-width:700px)]:text-[36px] leading-[1.1] font-[900] tracking-tight text-slate-900">
          Every app deserves its own L2.
        </h1>
        <h2 className="text-[24px] md:text-[30px] [@media(max-width:700px)]:text-[20px] font-[500] text-[#0078FF]">
          Building one shouldn&apos;t take months.
        </h2>

        <div className="flex gap-4 pt-4 [@media(max-width:500px)]:flex-col [@media(max-width:500px)]:w-full">
          <a
            href={LINKS.ROLLUP_HUB}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#0078FF] text-white text-[16px] font-[700] rounded-full hover:bg-[#0062d1] hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            Start Building
          </a>
          <button
            onClick={scrollToPainPoints}
            className="px-8 py-3.5 border-2 border-slate-200 bg-transparent text-slate-900 text-[16px] font-[700] rounded-full hover:border-slate-300 hover:bg-slate-50 transition-all"
          >
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
}
