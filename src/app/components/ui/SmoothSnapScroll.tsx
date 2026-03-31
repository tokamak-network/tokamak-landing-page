"use client";

import { useEffect, useRef, useCallback, useState } from "react";

const SCROLL_DURATION = 1400;
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
    const all: HTMLElement[] = [];
    const walk = (el: Element) => {
      if (el instanceof HTMLElement) {
        const snap = el.style.scrollSnapAlign;
        if (snap && snap !== "none") {
          all.push(el);
        }
      }
      for (const child of el.children) {
        walk(child);
      }
    };
    walk(document.body);
    return all;
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

  const scrollToSection = useCallback((direction: 1 | -1) => {
    const sections = getSections();
    if (sections.length === 0) return;

    const idx = findClosestIndex(sections);
    const nextIdx = Math.max(0, Math.min(sections.length - 1, idx + direction));
    if (nextIdx === idx) return;

    isAnimating.current = true;
    cooldownUntil.current = Date.now() + COOLDOWN + SCROLL_DURATION;
    lastDirection.current = direction;
    // Offset by 50px so content doesn't sit right behind the header
    const target = Math.max(0, sections[nextIdx].offsetTop - 50);
    smoothScrollTo(target);
  }, [getSections, findClosestIndex, smoothScrollTo]);

  /* ── Desktop only: wheel, keyboard, NO touch ── */
  useEffect(() => {
    if (isMobile) return; // CSS scroll-snap handles mobile

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

  return null;
}
