"use client";

import { useEffect, useState } from "react";

export default function ZkHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black flex flex-col">
      {/* Header — top zone, clearly separated */}
      <header className="relative z-10 px-6 sm:px-10 lg:px-16 pt-6 sm:pt-8 flex items-center justify-between flex-shrink-0">
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

      {/* Text zone — middle, centered horizontally, distinct from video */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-10 sm:py-14 lg:py-16 text-center max-w-6xl mx-auto flex-shrink-0">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-5 sm:mb-7">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] tracking-[0.5em] text-cyan-300/85 font-mono uppercase">
            Zero-Knowledge Privacy Layer
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-5 tracking-tight"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          Privacy{" "}
          <span className="text-cyan-300 drop-shadow-[0_0_28px_rgba(0,229,255,0.45)]">
            by Proof
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-base lg:text-lg text-white/70 font-mono max-w-2xl mx-auto mb-7 leading-relaxed">
          Multiple assets in. One verifiable proof out.
          <br className="hidden sm:block" />
          <span className="text-white/45 text-xs sm:text-sm">
            The future of confidential blockchain transactions.
          </span>
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            className="px-6 sm:px-7 py-2.5 sm:py-3 bg-cyan-500/10 border border-cyan-400/70 text-cyan-300 font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:bg-cyan-500/20 hover:border-cyan-400 transition-all shadow-[0_0_24px_rgba(0,229,255,0.15)] hover:shadow-[0_0_40px_rgba(0,229,255,0.3)]"
          >
            Get Started →
          </button>
          <button
            type="button"
            className="px-6 sm:px-7 py-2.5 sm:py-3 border border-white/20 text-white/70 font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:border-white/45 hover:text-white/95 transition-all"
          >
            Documentation
          </button>
        </div>
      </div>

      {/* Video zone — bottom, naturally fading into background */}
      <div
        className="relative w-full"
        style={{ height: "min(60vh, 720px)" }}
      >
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            maskImage:
              "radial-gradient(ellipse 85% 100% at 50% 45%, black 50%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 100% at 50% 45%, black 50%, transparent 100%)",
          }}
        >
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
        </div>
      </div>
    </section>
  );
}
