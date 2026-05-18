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

      {/* Subtle gradient overlay for text contrast on left side */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* HTML hero content overlay */}
      <div className="relative z-10 h-full flex items-center px-8 sm:px-12 lg:px-24">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#00e5ff] animate-pulse" />
            <span className="text-[11px] tracking-[0.5em] text-cyan-300/80 font-mono uppercase">
              Tokamak Network · ZK Privacy
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Privacy
            <br />
            <span className="text-cyan-300 drop-shadow-[0_0_24px_rgba(0,229,255,0.4)]">
              by Proof
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg text-white/70 font-mono mb-10 max-w-lg leading-relaxed">
            Multiple assets in.
            <br className="hidden sm:block" />
            One verifiable proof out.
            <br className="hidden sm:block" />
            <span className="text-white/50 text-sm">
              The future of confidential blockchain transactions.
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="px-6 py-3 bg-cyan-500/10 border border-cyan-400/70 text-cyan-300 font-mono text-sm tracking-[0.2em] uppercase hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-[0_0_24px_rgba(0,229,255,0.15)] hover:shadow-[0_0_36px_rgba(0,229,255,0.3)]"
            >
              Get Started →
            </button>
            <button
              type="button"
              className="px-6 py-3 border border-white/20 text-white/70 font-mono text-sm tracking-[0.2em] uppercase hover:border-white/40 hover:text-white/90 transition-all"
            >
              Documentation
            </button>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-cyan-400/50 font-mono text-[10px] tracking-[0.4em]">
        SCROLL ↓
      </div>
    </section>
  );
}
