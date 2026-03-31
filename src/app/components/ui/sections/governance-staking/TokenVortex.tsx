"use client";

import { useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════
   Plasma Vortex — 2D Canvas particle system
   Particles orbit around the reactor vessel
   in toroidal flow with trailing streaks.
   Direct port of plasma-vortex-demo.html.
   ═══════════════════════════════════════════════ */

const DOT_COUNT = 400;
const TRAIL_COUNT = 200;

interface Dot {
  phase: number;
  speed: number;
  orbitRadius: number;
  yOffset: number;
  yAmp: number;
  brightness: number;
  size: number;
}

interface Trail {
  phase: number;
  speed: number;
  orbitRadius: number;
  yOffset: number;
  yAmp: number;
  brightness: number;
  size: number;
  tailLen: number;
}

function createDots(): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < DOT_COUNT; i++) {
    dots.push({
      phase: Math.random() * Math.PI * 2,
      speed: 0.15 + Math.random() * 0.45,
      orbitRadius: 120 + Math.random() * 160,
      yOffset: (Math.random() - 0.5) * 200,
      yAmp: 20 + Math.random() * 40,
      brightness: 0.3 + Math.random() * 0.7,
      size: 1.5 + Math.random() * 2.5,
    });
  }
  return dots;
}

function createTrails(): Trail[] {
  const trails: Trail[] = [];
  for (let i = 0; i < TRAIL_COUNT; i++) {
    trails.push({
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.6,
      orbitRadius: 100 + Math.random() * 180,
      yOffset: (Math.random() - 0.5) * 180,
      yAmp: 15 + Math.random() * 30,
      brightness: 0.15 + Math.random() * 0.4,
      size: 0.5 + Math.random() * 1.2,
      tailLen: 3 + Math.floor(Math.random() * 5),
    });
  }
  return trails;
}

export default function TokenVortex() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>(createDots());
  const trailsRef = useRef<Trail[]>(createTrails());
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use CSS pixel dimensions (not DPR-multiplied canvas pixels)
    const W = sizeRef.current.w || canvas.clientWidth;
    const H = sizeRef.current.h || canvas.clientHeight;

    timeRef.current += 0.016;
    const time = timeRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cx = W / 2;
    const cy = H * 0.46;

    // Scale factor relative to a 1280-wide reference
    const scale = W / 1280;

    const dots = dotsRef.current;
    const trails = trailsRef.current;

    // Collect all renderables for back-to-front sorting
    type Renderable =
      | { type: "dot"; x: number; y: number; z: number; size: number; brightness: number }
      | { type: "trail"; positions: { x: number; y: number; z: number }[]; z: number; size: number; brightness: number };

    const sortable: Renderable[] = [];

    // Main dot particles
    for (const p of dots) {
      const t = time * p.speed + p.phase;
      const r = p.orbitRadius * scale;
      const x = cx + Math.cos(t) * r;
      const z = Math.sin(t) * r;
      const y = cy + (p.yOffset + Math.sin(t * 0.7 + p.phase * 3) * p.yAmp) * scale;
      sortable.push({ type: "dot", x, y, z, size: p.size * scale, brightness: p.brightness });
    }

    // Trail particles
    for (const p of trails) {
      const t = time * p.speed + p.phase;
      const positions: { x: number; y: number; z: number }[] = [];
      const r = p.orbitRadius * scale;
      for (let k = 0; k < p.tailLen; k++) {
        const tt = t - k * 0.04;
        const px = cx + Math.cos(tt) * r;
        const pz = Math.sin(tt) * r;
        const py = cy + (p.yOffset + Math.sin(tt * 0.7 + p.phase * 3) * p.yAmp) * scale;
        positions.push({ x: px, y: py, z: pz });
      }
      sortable.push({ type: "trail", positions, z: positions[0].z, size: p.size * scale, brightness: p.brightness });
    }

    // Sort back-to-front
    sortable.sort((a, b) => a.z - b.z);

    // Draw
    for (const item of sortable) {
      const maxR = 200 * scale;
      const depthFactor = 0.15 + 0.85 * Math.max(0, Math.min(1, (item.z + maxR) / (maxR * 1.75)));
      const alpha = item.brightness * depthFactor;

      if (item.type === "dot") {
        const r = item.size * (0.7 + depthFactor * 0.5);

        // Radial glow
        const gradient = ctx.createRadialGradient(item.x, item.y, 0, item.x, item.y, r * 3);
        gradient.addColorStop(0, `rgba(0, 229, 255, ${alpha * 0.9})`);
        gradient.addColorStop(0.4, `rgba(0, 229, 255, ${alpha * 0.4})`);
        gradient.addColorStop(1, "rgba(0, 229, 255, 0)");
        ctx.beginPath();
        ctx.arc(item.x, item.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Bright core
        ctx.beginPath();
        ctx.arc(item.x, item.y, r * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 240, 255, ${alpha * 0.8})`;
        ctx.fill();
      } else {
        const positions = item.positions;
        for (let k = 0; k < positions.length; k++) {
          const fade = 1 - k / positions.length;
          const pos = positions[k];
          const dF = 0.15 + 0.85 * Math.max(0, Math.min(1, (pos.z + maxR) / (maxR * 1.75)));
          const a = alpha * fade * dF;
          const r = Math.max(item.size * fade * (0.7 + dF * 0.3), 0.3);

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 229, 255, ${a})`;
          ctx.fill();
        }
      }
    }

    // Subtle central glow pulse
    const pulse = 0.7 + 0.3 * Math.sin(time * 0.8);
    const glowR = 80 * scale;
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
    coreGrad.addColorStop(0, `rgba(0, 229, 255, ${0.06 * pulse})`);
    coreGrad.addColorStop(0.5, `rgba(0, 180, 220, ${0.03 * pulse})`);
    coreGrad.addColorStop(1, "rgba(0, 229, 255, 0)");
    ctx.fillStyle = coreGrad;
    ctx.fillRect(cx - glowR, cy - glowR, glowR * 2, glowR * 2);

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      sizeRef.current = { w: rect.width, h: rect.height };
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
    };
  }, [draw]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        inset: 0,
        zIndex: 5,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
