"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Section {
  label: string;
  title: string;
  description: string;
  metric?: { value: string; unit: string };
}

const SECTIONS: Section[] = [
  {
    label: "IGNITION",
    title: "Powering Ethereum\nLayer 2",
    description:
      "Tokamak Network harnesses the energy of decentralized staking to fuel a next-generation Layer 2 ecosystem.",
    metric: { value: "14", unit: "Active Projects" },
  },
  {
    label: "CONFINEMENT",
    title: "On-Demand\nRollup Creation",
    description:
      "Launch your own OP Stack-based L2 chain in minutes. Thanos provides modular, production-ready rollup infrastructure.",
    metric: { value: "1.2s", unit: "Block Time" },
  },
  {
    label: "PLASMA STABILITY",
    title: "Seigniorage\nStaking",
    description:
      "TON stakers earn seigniorage rewards while securing the network. A self-sustaining plasma of economic incentives.",
    metric: { value: "42M+", unit: "TON Staked" },
  },
  {
    label: "ENERGY RELEASE",
    title: "Cross-Chain\nBridge",
    description:
      "Seamless asset transfers between L1 and L2. Cross-trade protocol enables trustless, fast bridging across chains.",
    metric: { value: "<3min", unit: "Bridge Time" },
  },
  {
    label: "FUSION COMPLETE",
    title: "The Future\nis On-Chain",
    description:
      "DAO governance, DeFi protocols, and developer tools — all powered by the Tokamak fusion reactor.",
  },
];

export default function ScrollVideoSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let ctx: gsap.Context;

    const setup = () => {
      ctx = gsap.context(() => {
        // Video scroll scrub
        gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: (self) => {
              if (video.duration) {
                video.currentTime = self.progress * video.duration;
              }
              // Update progress bar
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleY(${self.progress})`;
              }
              // Update active section
              const idx = Math.min(
                Math.floor(self.progress * SECTIONS.length),
                SECTIONS.length - 1
              );
              setActiveIndex(idx);
            },
          },
        });

        // Animate each section text
        SECTIONS.forEach((_, i) => {
          const sectionEl = container.querySelector(
            `[data-section="${i}"]`
          );
          if (!sectionEl) return;

          // Fade in
          gsap.fromTo(
            sectionEl,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              scrollTrigger: {
                trigger: sectionEl,
                start: "top 80%",
                end: "top 40%",
                scrub: true,
              },
            }
          );

          // Fade out (except last)
          if (i < SECTIONS.length - 1) {
            gsap.fromTo(
              sectionEl,
              { opacity: 1 },
              {
                opacity: 0,
                duration: 0.5,
                scrollTrigger: {
                  trigger: sectionEl,
                  start: "bottom 60%",
                  end: "bottom 20%",
                  scrub: true,
                },
              }
            );
          }
        });

        // Animate metrics
        container.querySelectorAll("[data-metric]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              scrollTrigger: {
                trigger: el,
                start: "top 75%",
                end: "top 50%",
                scrub: true,
              },
            }
          );
        });
      }, container);
    };

    const onCanPlay = () => {
      setVideoReady(true);
      // Pause video — we control it via scroll
      video.pause();
      setup();
    };

    if (video.readyState >= 3) {
      onCanPlay();
    } else {
      video.addEventListener("canplaythrough", onCanPlay, { once: true });
    }

    return () => {
      ctx?.revert();
      video.removeEventListener("canplaythrough", onCanPlay);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${SECTIONS.length * 100}vh` }}
    >
      {/* Sticky video background */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: videoReady ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Grain overlay */}
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        {/* Progress indicator (left side) */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20">
          <div className="relative w-[2px] h-40 bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 w-full h-full origin-top bg-[#0077FF]"
              style={{ transform: "scaleY(0)" }}
            />
          </div>
          {SECTIONS.map((s, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "bg-[#0077FF] scale-150 shadow-[0_0_8px_rgba(0,119,255,0.6)]"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              onClick={() => {
                const target =
                  containerRef.current?.querySelector(
                    `[data-section="${i}"]`
                  );
                target?.scrollIntoView({ behavior: "smooth" });
              }}
              aria-label={s.label}
            />
          ))}
        </div>

        {/* Section label badge */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <div className="px-4 py-1.5 rounded-full border border-[#0077FF]/30 bg-[#0077FF]/10 backdrop-blur-sm">
            <span className="text-[#0077FF] text-xs font-orbitron tracking-[0.3em] uppercase">
              {SECTIONS[activeIndex].label}
            </span>
          </div>
        </div>

        {/* Active section content overlay */}
        <div className="absolute inset-0 flex items-center z-10 pointer-events-none">
          <div className="max-w-7xl mx-auto w-full px-16">
            {/* This is the always-visible overlay synced with scroll */}
          </div>
        </div>
      </div>

      {/* Scrollable section triggers */}
      {SECTIONS.map((section, i) => (
        <div
          key={i}
          data-section={i}
          className="absolute flex items-center"
          style={{
            top: `${i * 100}vh`,
            height: "100vh",
            left: 0,
            right: 0,
          }}
        >
          <div className="max-w-7xl mx-auto w-full px-16 grid grid-cols-2 gap-16 items-center">
            {/* Text content — left side */}
            <div className="space-y-6">
              <p className="text-[#0077FF] font-orbitron text-sm tracking-[0.2em] uppercase">
                {section.label}
              </p>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] whitespace-pre-line">
                {section.title}
              </h2>
              <p className="text-lg text-[#c5c5ca] leading-relaxed max-w-md">
                {section.description}
              </p>
            </div>

            {/* Metric — right side */}
            <div className="flex justify-end">
              {section.metric && (
                <div
                  data-metric
                  className="text-right space-y-2"
                >
                  <div className="text-7xl md:text-8xl font-orbitron font-bold text-white">
                    {section.metric.value}
                  </div>
                  <div className="text-sm font-orbitron tracking-[0.2em] text-[#0077FF] uppercase">
                    {section.metric.unit}
                  </div>
                  <div className="mt-4 h-[1px] w-32 ml-auto bg-gradient-to-l from-[#0077FF] to-transparent" />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Scroll hint at the very start */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs font-orbitron tracking-widest uppercase">
            Scroll to explore
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            className="opacity-50"
          >
            <rect
              x="1"
              y="1"
              width="14"
              height="22"
              rx="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="8" cy="8" r="2" fill="currentColor">
              <animate
                attributeName="cy"
                values="8;16;8"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>
    </div>
  );
}
