"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import HeroOverlay from "./HeroOverlay";
import ScrollIndicator from "./ScrollIndicator";
import TorusScene from "./TorusScene";

export default function TorusHero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Detect intro unmount → trigger fade-in */
  const checkIntro = useCallback(() => {
    if (document.querySelector("[data-intro]")) {
      requestAnimationFrame(checkIntro);
    } else {
      setHeroVisible(true);
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(checkIntro);
  }, [checkIntro]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* 3D Torus — full screen canvas, fades in after intro ends */}
      <div
        className="absolute inset-0"
        style={{
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 1.2s ease-out",
        }}
      >
        {mounted && <TorusScene scrollProgress={scrollProgress} />}
      </div>

      {/* Hero text + CTA */}
      <HeroOverlay scrollProgress={scrollProgress} />

      {/* Scroll indicator */}
      <ScrollIndicator scrollProgress={scrollProgress} />
    </section>
  );
}
