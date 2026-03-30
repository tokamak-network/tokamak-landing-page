"use client";

import { useEffect, useRef, useCallback } from "react";

const SCROLL_DURATION = 1400;
const DEBOUNCE_WINDOW = 200;

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

export default function SmoothSnapScroll() {
  const isAnimating = useRef(false);
  const currentIndex = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accumulatedDelta = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const sectionsCache = useRef<HTMLElement[]>([]);

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
    sectionsCache.current = all;
    return all;
  }, []);

  const findClosestIndex = useCallback((sections: HTMLElement[]): number => {
    const scrollY = window.scrollY;
    let closest = 0;
    let minDist = Infinity;
    for (let i = 0; i < sections.length; i++) {
      const dist = Math.abs(scrollY - sections[i].offsetTop);
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
    if (isAnimating.current) return;

    const sections = getSections();
    if (sections.length === 0) return;

    const idx = findClosestIndex(sections);
    currentIndex.current = idx;

    const nextIdx = Math.max(0, Math.min(sections.length - 1, idx + direction));
    if (nextIdx === idx) return;

    currentIndex.current = nextIdx;
    isAnimating.current = true;
    smoothScrollTo(sections[nextIdx].offsetTop);
  }, [getSections, findClosestIndex, smoothScrollTo]);

  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      e.preventDefault();

      if (isAnimating.current) return;

      accumulatedDelta.current += e.deltaY;

      if (wheelTimer.current) {
        clearTimeout(wheelTimer.current);
      }

      wheelTimer.current = setTimeout(() => {
        const delta = accumulatedDelta.current;
        accumulatedDelta.current = 0;

        if (Math.abs(delta) < 10) return;

        const direction: 1 | -1 = delta > 0 ? 1 : -1;
        scrollToSection(direction);
      }, DEBOUNCE_WINDOW);
    }

    function handleKeydown(e: KeyboardEvent) {
      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "];
      if (!keys.includes(e.key)) return;

      e.preventDefault();
      if (isAnimating.current) return;

      const direction: 1 | -1 = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " ? 1 : -1;
      scrollToSection(direction);
    }

    // Touch handling for mobile
    let touchStartY = 0;
    function handleTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e: TouchEvent) {
      if (isAnimating.current) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) < 50) return;

      const direction: 1 | -1 = diff > 0 ? 1 : -1;
      scrollToSection(direction);
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // Initialize: snap to nearest section on load
    const sections = getSections();
    if (sections.length > 0) {
      currentIndex.current = findClosestIndex(sections);
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [getSections, findClosestIndex, scrollToSection]);

  return null;
}
