"use client";

import { useEffect, useState } from "react";

export default function ZkHero() {
  const [mounted, setMounted] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      className="relative w-full min-h-screen bg-[#02040a] overflow-hidden"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* Shared atmosphere — Tokamak blue glow blooming from bottom-right toward the title */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 70% 75%, rgba(42,114,229,0.22) 0%, rgba(42,114,229,0.10) 30%, rgba(26,79,181,0.04) 60%, transparent 85%)",
        }}
      />

      {/* Title — moderate left padding, wide max-width so right edge overlaps the video */}
      <div className="relative z-20 px-6 sm:px-12 lg:pl-[8%] xl:pl-[10%] lg:pr-0 pt-[214px] sm:pt-[246px] lg:pt-[310px] xl:pt-[342px] max-w-[860px] lg:max-w-[920px] xl:max-w-[1000px] text-left">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5 sm:mb-7">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
          <span
            className="text-[10px] sm:text-[11px] tracking-[0.5em] text-[#7AB0FF]/90 uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Sovereign Privacy Layer
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.05] mb-5 tracking-tight">
          Privacy you{" "}
          <span className="text-[#7AB0FF] drop-shadow-[0_0_28px_rgba(42,114,229,0.55)]">
            own
          </span>
          .
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-base lg:text-lg text-white/70 max-w-xl mb-7 leading-relaxed">
          Real privacy starts with the layer beneath it.
          <br className="hidden sm:block" />
          <span className="text-white/45 text-xs sm:text-sm">
            Own the infrastructure — not a service that rents it to you.
          </span>
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="px-6 sm:px-7 py-2.5 sm:py-3 bg-[#2A72E5]/12 border border-[#4A8EFA]/70 text-[#7AB0FF] text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:bg-[#2A72E5]/25 hover:border-[#4A8EFA] transition-all shadow-[0_0_24px_rgba(42,114,229,0.18)] hover:shadow-[0_0_40px_rgba(42,114,229,0.35)]"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Get Started →
          </button>
          <button
            type="button"
            className="px-6 sm:px-7 py-2.5 sm:py-3 border border-white/20 text-white/70 text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:border-white/45 hover:text-white/95 transition-all"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Documentation
          </button>
        </div>
      </div>

      {/* Video — large, anchored bottom-right; left edge dissolves under the title for shared-canvas feel */}
      <div
        className="relative z-10 w-full mt-10 sm:mt-14 lg:mt-0 lg:absolute lg:bottom-0 lg:right-0 lg:w-[82%] xl:w-[78%]"
        style={{ height: "min(82vh, 900px)" }}
      >
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            maskImage:
              "radial-gradient(ellipse 95% 100% at 75% 50%, black 20%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 75%, transparent 95%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 6%, black 14%, black 68%, rgba(0,0,0,0.3) 88%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 95% 100% at 75% 50%, black 20%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.2) 75%, transparent 95%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 6%, black 14%, black 68%, rgba(0,0,0,0.3) 88%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          {mounted && (
            <video
              autoPlay
              loop
              muted
              playsInline
              onCanPlay={() => setVideoReady(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src="/hero/zk-engine.webm" type="video/webm" />
              <source src="/hero/zk-engine.mp4" type="video/mp4" />
            </video>
          )}
          {/* Loading spinner — shown while the hero video is fetching */}
          {!videoReady && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="h-9 w-9 rounded-full border-2 border-white/15 border-t-[#4A8EFA] animate-spin"
                aria-label="Loading"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
