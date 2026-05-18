"use client";

import { useEffect, useState } from "react";

export default function ZkHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background video */}
      {mounted && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero/bg-stage.jpeg"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero/zk-engine.webm" type="video/webm" />
          <source src="/hero/zk-engine.mp4" type="video/mp4" />
        </video>
      )}

      {/* Top dark gradient for header + hero text contrast */}
      <div className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-black/90 via-black/55 to-transparent pointer-events-none" />

      {/* Bottom subtle gradient for grounding */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Top header bar */}
      <header className="relative z-20 px-6 sm:px-10 lg:px-16 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff]" />
          <span className="font-mono text-sm tracking-[0.4em] text-white/90">
            TOKAMAK
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-mono text-[11px] tracking-[0.3em] uppercase text-white/60">
          <a href="#" className="hover:text-white/95 transition-colors">
            Ecosystem
          </a>
          <a href="#" className="hover:text-white/95 transition-colors">
            Docs
          </a>
          <a href="#" className="hover:text-white/95 transition-colors">
            Governance
          </a>
          <a
            href="#"
            className="px-4 py-2 border border-white/25 text-white/80 hover:border-cyan-400/70 hover:text-cyan-300 transition-all"
          >
            Launch App
          </a>
        </nav>
      </header>

      {/* Hero text — centered, positioned in upper area */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-16 mt-10 sm:mt-14 lg:mt-16 text-center max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] tracking-[0.5em] text-cyan-300/85 font-mono uppercase">
            Zero-Knowledge Privacy Layer
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
        </div>

        {/* Title */}
        <h1
          className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white leading-[1.02] mb-6 tracking-tight"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          Privacy{" "}
          <span className="text-cyan-300 drop-shadow-[0_0_32px_rgba(0,229,255,0.45)]">
            by Proof
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-base sm:text-lg lg:text-xl text-white/75 font-mono max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
          Multiple assets in. One verifiable proof out.
          <br className="hidden sm:block" />
          <span className="text-white/50 text-sm sm:text-base">
            The future of confidential blockchain transactions.
          </span>
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            className="px-6 sm:px-8 py-3 bg-cyan-500/10 border border-cyan-400/70 text-cyan-300 font-mono text-xs sm:text-sm tracking-[0.25em] uppercase hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-[0_0_24px_rgba(0,229,255,0.15)] hover:shadow-[0_0_40px_rgba(0,229,255,0.3)]"
          >
            Get Started →
          </button>
          <button
            type="button"
            className="px-6 sm:px-8 py-3 border border-white/20 text-white/70 font-mono text-xs sm:text-sm tracking-[0.25em] uppercase hover:border-white/45 hover:text-white/95 transition-all"
          >
            Documentation
          </button>
        </div>
      </div>

      {/* Scroll hint at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
        <span className="text-cyan-400/55 font-mono text-[9px] tracking-[0.4em]">
          SCROLL
        </span>
        <span className="h-6 w-px bg-gradient-to-b from-cyan-400/60 to-transparent" />
      </div>
    </section>
  );
}
