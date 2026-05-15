"use client";

import { useEffect, useRef, useCallback, useState } from "react";

const SCROLL_DURATION = 800;
const COOLDOWN = 100;
const TRACKPAD_THRESHOLD = 5;
const MOBILE_BREAKPOINT = 768;

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

export default function SmoothSnapScroll() {
  const isMobile = useIsMobile();
  const isAnimating = useRef(false);
  const cooldownUntil = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const lastDirection = useRef<1 | -1>(1);

  // Edge glow state
  const [glowDirection, setGlowDirection] = useState<"top" | "bottom" | null>(null);
  const glowTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Mobile: enable CSS scroll-snap on <html> ── */
  useEffect(() => {
    const html = document.documentElement;
    if (isMobile) {
      html.style.scrollSnapType = "y mandatory";
    } else {
      html.style.scrollSnapType = "";
    }
    return () => {
      html.style.scrollSnapType = "";
    };
  }, [isMobile]);

  const getSections = useCallback((): HTMLElement[] => {
    return Array.from(
      document.querySelectorAll<HTMLElement>("[data-snap-section]")
    );
  }, []);

  const findClosestIndex = useCallback((sections: HTMLElement[]): number => {
    const scrollY = window.scrollY;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < sections.length; i++) {
      const dist = Math.abs(scrollY - (sections[i].offsetTop - 50));
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    }
    return closest;
  }, []);

  const smoothScrollTo = useCallback((target: number) => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    const start = window.scrollY;
    const distance = target - start;

    if (Math.abs(distance) < 2) {
      isAnimating.current = false;
      return;
    }

    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / SCROLL_DURATION, 1);
      const eased = easeInOutQuart(progress);
      window.scrollTo(0, start + distance * eased);

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(step);
      } else {
        isAnimating.current = false;
        animationFrame.current = null;
      }
    }

    animationFrame.current = requestAnimationFrame(step);
  }, []);

  /* ── Trigger edge glow ── */
  const triggerGlow = useCallback((direction: 1 | -1) => {
    if (glowTimeout.current) clearTimeout(glowTimeout.current);
    setGlowDirection(direction === 1 ? "bottom" : "top");
    glowTimeout.current = setTimeout(() => {
      setGlowDirection(null);
    }, SCROLL_DURATION + 100);
  }, []);

  const scrollToSection = useCallback((direction: 1 | -1) => {
    const sections = getSections();
    if (sections.length === 0) return;

    const idx = findClosestIndex(sections);
    const nextIdx = Math.max(0, Math.min(sections.length - 1, idx + direction));
    if (nextIdx === idx) return;

    isAnimating.current = true;
    cooldownUntil.current = Date.now() + COOLDOWN + SCROLL_DURATION;
    lastDirection.current = direction;

    triggerGlow(direction);

    const target = Math.max(0, sections[nextIdx].offsetTop - 50);
    smoothScrollTo(target);
  }, [getSections, findClosestIndex, smoothScrollTo, triggerGlow]);

  /* ── Desktop only: wheel, keyboard, NO touch ── */
  useEffect(() => {
    if (isMobile) return;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();

      const now = Date.now();
      if (isAnimating.current || now < cooldownUntil.current) return;

      if (Math.abs(e.deltaY) < TRACKPAD_THRESHOLD) return;

      const direction: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      scrollToSection(direction);
    }

    function handleKeydown(e: KeyboardEvent) {
      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "];
      if (!keys.includes(e.key)) return;

      e.preventDefault();
      const now = Date.now();
      if (isAnimating.current || now < cooldownUntil.current) return;

      const direction: 1 | -1 = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " ? 1 : -1;
      scrollToSection(direction);
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeydown);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [isMobile, scrollToSection]);

  /* ── Cleanup glow timeout on unmount ── */
  useEffect(() => {
    return () => {
      if (glowTimeout.current) clearTimeout(glowTimeout.current);
    };
  }, []);

  const glowStyle: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    height: "70px",
    pointerEvents: "none",
    zIndex: 9999,
    transition: `opacity ${glowDirection ? "100ms" : "400ms"} ease`,
    opacity: glowDirection ? 1 : 0,
  };

  return (
    <>
      {/* Edge glow — bottom */}
      <div
        style={{
          ...glowStyle,
          bottom: 0,
          top: "auto",
          background: "linear-gradient(to top, rgba(0,229,255,0.4) 0%, transparent 100%)",
          opacity: glowDirection === "bottom" ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Edge glow — top */}
      <div
        style={{
          ...glowStyle,
          top: 0,
          bottom: "auto",
          background: "linear-gradient(to bottom, rgba(0,229,255,0.4) 0%, transparent 100%)",
          opacity: glowDirection === "top" ? 1 : 0,
        }}
        aria-hidden="true"
      />
    </>
  );
}
