"use client";

import { useEffect, useState, useRef } from "react";
import HeroOverlay from "./HeroOverlay";
import ScrollIndicator from "./ScrollIndicator";
import TorusScene from "./TorusScene";

export default function TorusHero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      {/* 3D Torus — full screen canvas, torus looms from above */}
      <div className="absolute inset-0">
        {mounted && <TorusScene scrollProgress={scrollProgress} />}
      </div>

      {/* Hero text + CTA */}
      <HeroOverlay scrollProgress={scrollProgress} />

      {/* Scroll indicator */}
      <ScrollIndicator scrollProgress={scrollProgress} />
    </section>
  );
}
