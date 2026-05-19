"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TokamakSymbol from "@/assets/images/Tokamak_Symbol.svg";

export default function ZkHero() {
  const [mounted, setMounted] = useState(false);

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

      {/* Header — floating pill nav */}
      <header className="relative z-20 px-6 sm:px-10 lg:px-16 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Logo pill */}
        <Link
          href="/"
          aria-label="Tokamak Network"
          className="flex items-center justify-center h-11 w-11 rounded-full bg-[#0c1220]/95 border border-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_22px_rgba(0,0,0,0.6)] hover:border-[#4A8EFA]/60 transition-colors"
        >
          <Image
            src={TokamakSymbol}
            alt="Tokamak"
            width={22}
            height={15}
            className="h-auto w-[22px]"
            priority
          />
        </Link>

        {/* Nav pills */}
        <nav className="hidden md:flex items-center gap-1.5">
          {["Ecosystem", "Docs", "Governance"].map((label) => (
            <a
              key={label}
              href="#"
              className="px-5 py-2.5 rounded-full bg-[#0c1220]/95 border border-white/[0.14] text-[11px] tracking-[0.25em] uppercase text-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_22px_rgba(0,0,0,0.55)] hover:text-[#7AB0FF] hover:border-[#4A8EFA]/55 transition-all"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {label}
            </a>
          ))}
          <a
            href="#"
            className="px-5 py-2.5 rounded-full bg-[#2A72E5]/18 border border-[#4A8EFA]/55 text-[11px] tracking-[0.25em] uppercase text-[#7AB0FF] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_22px_rgba(42,114,229,0.28)] hover:bg-[#2A72E5]/30 hover:border-[#4A8EFA] transition-all"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Launch App
          </a>
        </nav>
      </header>

      {/* Title — left-aligned */}
      <div className="relative z-20 px-6 sm:px-10 lg:px-16 pt-10 sm:pt-16 lg:pt-24 max-w-2xl text-left">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5 sm:mb-7">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
          <span
            className="text-[10px] sm:text-[11px] tracking-[0.5em] text-[#7AB0FF]/90 uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Zero-Knowledge Privacy Layer
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.05] mb-5 tracking-tight">
          Privacy{" "}
          <span className="text-[#7AB0FF] drop-shadow-[0_0_28px_rgba(42,114,229,0.55)]">
            by Proof
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-base lg:text-lg text-white/70 max-w-xl mb-7 leading-relaxed">
          Multiple assets in. One verifiable proof out.
          <br className="hidden sm:block" />
          <span className="text-white/45 text-xs sm:text-sm">
            The future of confidential blockchain transactions.
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
