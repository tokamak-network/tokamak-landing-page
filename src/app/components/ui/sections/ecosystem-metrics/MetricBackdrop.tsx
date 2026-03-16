"use client";

import { useRef, useEffect, useCallback } from "react";
import type { CardRect, Object3DRenderer, RenderContext } from "./objects/types";
import { createTorusRenderer } from "./objects/torusRenderer";
import { createSphereRenderer } from "./objects/sphereRenderer";
import { createStackedRingsRenderer } from "./objects/stackedRingsRenderer";
import { createOrbitRenderer } from "./objects/orbitRenderer";
import { createNodeGraphRenderer } from "./objects/nodeGraphRenderer";
import { createParticleStreamRenderer } from "./objects/particleStreamRenderer";

/**
 * MetricBackdrop — single canvas behind all 6 metric cards.
 * Renders one 3D object per card, with hover-reactive animations.
 *
 * - Uses ResizeObserver to track card positions
 * - Uses IntersectionObserver for viewport visibility
 * - Detects hover via mouse position vs card rects (no MetricCard changes needed)
 * - prefers-reduced-motion: renders single static frame
 * - Mobile (<=800px): returns null
 */
export default function MetricBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const visibleRef = useRef(false);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const cardRectsRef = useRef<CardRect[]>([]);
  const hoverIndexRef = useRef(-1);
  const hoverTRef = useRef<number[]>([0, 0, 0, 0, 0, 0]);
  const renderersRef = useRef<Object3DRenderer[] | null>(null);
  const isMobileRef = useRef(false);

  // Lazily initialize renderers
  const getRenderers = useCallback((): Object3DRenderer[] => {
    if (!renderersRef.current) {
      renderersRef.current = [
        createTorusRenderer(),
        createSphereRenderer(),
        createStackedRingsRenderer(),
        createOrbitRenderer(),
        createNodeGraphRenderer(),
        createParticleStreamRenderer(),
      ];
    }
    return renderersRef.current;
  }, []);

  /* ── Render frame ─────────────────────────────────── */

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const time = Date.now() * 0.001;
    const cards = cardRectsRef.current;
    const mouse = mouseRef.current;
    const renderers = getRenderers();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    // Detect hovered card from mouse position
    let hovIdx = -1;
    for (let i = 0; i < cards.length; i++) {
      const c = cards[i];
      if (
        mouse.x >= c.x &&
        mouse.x <= c.x + c.w &&
        mouse.y >= c.y &&
        mouse.y <= c.y + c.h
      ) {
        hovIdx = i;
        break;
      }
    }
    hoverIndexRef.current = hovIdx;

    // Smooth hover transition per card
    const hoverT = hoverTRef.current;
    for (let i = 0; i < 6; i++) {
      const target = i === hovIdx ? 1 : 0;
      hoverT[i] += (target - hoverT[i]) * 0.08;
      if (Math.abs(hoverT[i] - target) < 0.001) hoverT[i] = target;
    }

    // Render each object behind its card
    for (let i = 0; i < Math.min(cards.length, renderers.length); i++) {
      const card = cards[i];
      if (card.w === 0 || card.h === 0) continue;

      const rc: RenderContext = {
        ctx,
        card,
        time,
        hovered: hovIdx === i,
        hoverT: hoverT[i],
      };

      renderers[i].render(rc);
    }

    ctx.restore();
  }, [getRenderers]);

  /* ── Animation loop ───────────────────────────────── */

  const loop = useCallback(() => {
    if (visibleRef.current) {
      renderFrame();
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [renderFrame]);

  /* ── Setup ────────────────────────────────────────── */

  useEffect(() => {
    // Check mobile
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth <= 800;
    };
    checkMobile();

    if (isMobileRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* ── Resize & card tracking ─── */

    const updateCards = () => {
      const parentRect = parent.getBoundingClientRect();
      const cards = parent.querySelectorAll<HTMLElement>("[data-metric-index]");
      const rects: CardRect[] = [];

      cards.forEach((el) => {
        const r = el.getBoundingClientRect();
        rects.push({
          x: r.left - parentRect.left,
          y: r.top - parentRect.top,
          w: r.width,
          h: r.height,
        });
      });

      cardRectsRef.current = rects;
    };

    const resize = () => {
      checkMobile();
      if (isMobileRef.current) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      updateCards();

      if (motionQuery.matches) {
        renderFrame();
      }
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    /* ── Visibility ─── */

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(parent);

    /* ── Mouse tracking (canvas-local coords) ─── */

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    // Listen on parent so hover works through pointer-events-none canvas
    parent.addEventListener("mousemove", handleMouse);
    parent.addEventListener("mouseleave", handleMouseLeave);

    /* ── Start animation ─── */

    if (!motionQuery.matches) {
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      resizeObserver.disconnect();
      io.disconnect();
      parent.removeEventListener("mousemove", handleMouse);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [renderFrame, loop]);

  // Mobile: render nothing
  if (typeof window !== "undefined" && window.innerWidth <= 800) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none hidden [@media(min-width:801px)]:block"
      aria-hidden="true"
    />
  );
}
