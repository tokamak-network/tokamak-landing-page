"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLOORS } from "./floors";
import FloorSection from "./FloorSection";
import FloorIndicator from "./FloorIndicator";

gsap.registerPlugin(ScrollTrigger);

export default function TowerExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ready, setReady] = useState(false);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    setReady(true);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf as Parameters<typeof gsap.ticker.remove>[0]);
    };
  }, []);

  // Track active floor
  useEffect(() => {
    if (!ready) return;

    const triggers = FLOORS.map((floor, i) => {
      return ScrollTrigger.create({
        trigger: `[data-floor="${floor.id}"]`,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => setActiveIndex(i),
        onEnterBack: () => setActiveIndex(i),
      });
    });

    return () => triggers.forEach((t) => t.kill());
  }, [ready]);

  // Hero parallax: zoom in + fade out as user scrolls down
  useEffect(() => {
    if (!ready) return;
    const hero = heroRef.current;
    const heroImage = heroImageRef.current;
    const heroContent = heroContentRef.current;
    if (!hero || !heroImage) return;

    const ctx = gsap.context(() => {
      gsap.to(heroImage, {
        scale: 1.3,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
      if (heroContent) {
        gsap.to(heroContent, {
          y: -100,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "50% top",
            scrub: 0.5,
          },
        });
      }
    }, hero);

    return () => ctx.revert();
  }, [ready]);

  // Navigate to a floor
  const handleNavigate = useCallback(
    (index: number) => {
      const target = document.querySelector(
        `[data-floor="${FLOORS[index].id}"]`
      );
      if (target && lenisRef.current) {
        lenisRef.current.scrollTo(target as HTMLElement, { offset: 0 });
      }
    },
    []
  );

  return (
    <div ref={containerRef} className="relative bg-black">
      {/* Tower header */}
      <div ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Full tower concept as background */}
        <div
          ref={heroImageRef}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: "url(/tower/tower-concept.png)",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
            transform: "scale(1.05)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black z-[1]" />
        {/* Radial glow at center */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,229,255,0.06) 0%, transparent 70%)",
          }}
        />

        {/* Hero text */}
        <div ref={heroContentRef} className="relative z-10 text-center space-y-6 px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#00e5ff]" />
            <span className="text-[#00e5ff] text-xs font-mono tracking-[0.4em] uppercase">
              Explore the Reactor
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#00e5ff]" />
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05]">
            Tokamak
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #00e5ff, #0077ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Tower
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            Scroll down to explore each level of the Tokamak Network reactor
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 animate-bounce">
          <span className="text-white/30 text-xs font-mono tracking-[0.3em] uppercase">
            Scroll
          </span>
          <svg
            width="16"
            height="24"
            viewBox="0 0 16 24"
            fill="none"
            className="text-white/30"
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

      {/* Floor sections */}
      {FLOORS.map((floor, i) => (
        <FloorSection
          key={floor.id}
          floor={floor}
          index={i}
          total={FLOORS.length}
        />
      ))}

      {/* Floor indicator (side nav) */}
      <FloorIndicator
        floors={FLOORS}
        activeIndex={activeIndex}
        onNavigate={handleNavigate}
      />

      {/* Top label badge */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500">
        <div
          className="px-5 py-1.5 rounded-full border backdrop-blur-md transition-all duration-500"
          style={{
            borderColor: `${FLOORS[activeIndex].accent}30`,
            backgroundColor: `${FLOORS[activeIndex].accent}10`,
          }}
        >
          <span
            className="text-xs font-mono tracking-[0.3em] uppercase transition-colors duration-500"
            style={{ color: FLOORS[activeIndex].accent }}
          >
            {FLOORS[activeIndex].label}
          </span>
        </div>
      </div>
    </div>
  );
}
