"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { FlowCategory } from "./index";

/* ── Types ─────────────────────────────────────────── */

interface Pt { x: number; y: number; }

interface StreamParticle {
  catIdx: number;
  x: number; y: number;
  t: number;        // bezier progress 0→1
  speed: number;
  size: number;
  alpha: number;
  offset: number;   // perpendicular offset
}

/** Background curtain particle — white/gray, falls straight down */
interface RainParticle {
  x: number; y: number;
  speed: number;
  size: number;
  alpha: number;
  startX: number;   // original x (reset target)
}

interface OrbData {
  x: number; y: number;
  radius: number;
  color: string;
  name: string;
  totalLines: number;
  repoCount: number;
}

/* ── Helpers ───────────────────────────────────────── */

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)];
}

function lerpColor(c1: [number, number, number], c2: [number, number, number], t: number): [number, number, number] {
  return [Math.round(c1[0] + (c2[0] - c1[0]) * t), Math.round(c1[1] + (c2[1] - c1[1]) * t), Math.round(c1[2] + (c2[2] - c1[2]) * t)];
}

function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const m = 1 - t;
  return {
    x: m * m * m * p0.x + 3 * m * m * t * p1.x + 3 * m * t * t * p2.x + t * t * t * p3.x,
    y: m * m * m * p0.y + 3 * m * m * t * p1.y + 3 * m * t * t * p2.y + t * t * t * p3.y,
  };
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

/* ── Constants ─────────────────────────────────────── */

const CANVAS_HEIGHT = 1000;
const TEXT_Y = 0.11;
const ORB_Y = 0.78;
const STREAM_PARTICLES = 6000;
const RAIN_PARTICLES = 3000;    // background curtain

/* ── Component ─────────────────────────────────────── */

export default function FlowCanvas({
  categories,
  totalRepos,
  totalCommits,
}: {
  categories: FlowCategory[];
  totalRepos: number;
  totalCommits: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbsRef = useRef<OrbData[]>([]);
  const streamRef = useRef<StreamParticle[]>([]);
  const rainRef = useRef<RainParticle[]>([]);
  const pathsRef = useRef<{ p0: Pt; cp1: Pt; cp2: Pt; p3: Pt }[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoReadyRef = useRef(false);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const mouseRef = useRef<Pt>({ x: -9999, y: -9999 });
  const rafRef = useRef<number | undefined>(undefined);
  const visibleRef = useRef(false);
  const textWidthRef = useRef(0);
  const [, setTick] = useState(0);

  /* ── Build layout ─────────────────────────────────── */

  const buildLayout = useCallback((w: number, h: number) => {
    const cx = w / 2;
    const textY = h * TEXT_Y;
    const orbCY = h * ORB_Y;

    // Measure text width for rain curtain
    const tmpCanvas = document.createElement("canvas");
    const tmpCtx = tmpCanvas.getContext("2d")!;
    const maxW = w * 0.88;
    tmpCtx.font = "900 100px 'Orbitron', sans-serif";
    const measured = tmpCtx.measureText("TOKAMAK NETWORK").width;
    const fontSize = Math.min(90, Math.floor((maxW / measured) * 100));
    tmpCtx.font = `900 ${fontSize}px 'Orbitron', sans-serif`;
    const textW = tmpCtx.measureText("TOKAMAK NETWORK").width;
    textWidthRef.current = textW;

    const textLeft = cx - textW / 2;
    const textRight = cx + textW / 2;
    const textBottom = textY + fontSize * 0.35;

    // Sort categories by total lines
    const catEntries = categories
      .map((cat, i) => ({
        cat, idx: i,
        total: cat.repos.reduce((s, r) => s + r.linesChanged, 0),
      }))
      .sort((a, b) => b.total - a.total);

    const maxTotal = Math.max(1, ...catEntries.map((e) => e.total));
    const orbSpread = w * 0.85;
    const count = catEntries.length;
    const orbs: OrbData[] = [];
    const paths: { p0: Pt; cp1: Pt; cp2: Pt; p3: Pt }[] = new Array(categories.length);

    catEntries.forEach((entry, sortedIdx) => {
      const { cat, idx: ci, total } = entry;
      const t = count <= 1 ? 0.5 : sortedIdx / (count - 1);
      const orbX = cx - orbSpread / 2 + t * orbSpread;
      const xNorm = (t - 0.5) * 2;
      const orbY = orbCY + xNorm * xNorm * h * 0.025;
      const activity = total / maxTotal;
      const radius = 42 + activity * 35;

      orbs.push({ x: orbX, y: orbY, radius, color: cat.color, name: cat.name, totalLines: total, repoCount: cat.repos.length });

      // Bezier: start spread across full text width, smoothly curve toward orbs
      // Start X: distribute across text proportionally
      const startT = count <= 1 ? 0.5 : sortedIdx / (count - 1);
      const startX = textLeft + startT * textW;
      const startY = textBottom;

      // cp1: gentle pull, keep near starting x to avoid over-convergence
      const cp1x = startX + (orbX - startX) * 0.15;
      const cp1y = startY + (orbY - startY) * 0.25;
      // cp2: approach orb more directly
      const cp2x = orbX + (startX - orbX) * 0.08;
      const cp2y = startY + (orbY - startY) * 0.7;

      paths[ci] = { p0: { x: startX, y: startY }, cp1: { x: cp1x, y: cp1y }, cp2: { x: cp2x, y: cp2y }, p3: { x: orbX, y: orbY } };
    });

    orbsRef.current = orbs;
    pathsRef.current = paths;

    // Build stream particles
    const particles: StreamParticle[] = [];
    const perCat = Math.floor(STREAM_PARTICLES / categories.length);
    categories.forEach((_, ci) => {
      for (let i = 0; i < perCat; i++) {
        particles.push({
          catIdx: ci, x: 0, y: 0,
          t: Math.random(),
          speed: rand(0.0015, 0.006),
          size: rand(1.2, 3.8),
          alpha: rand(0.3, 1.0),
          offset: rand(-35, 35),
        });
      }
    });
    streamRef.current = particles;

    // Build rain curtain particles (from full text width, straight down)
    const rain: RainParticle[] = [];
    for (let i = 0; i < RAIN_PARTICLES; i++) {
      const rx = textLeft + Math.random() * textW;
      rain.push({
        x: rx,
        y: textBottom + Math.random() * (h - textBottom),
        speed: rand(0.5, 2.5),
        size: rand(0.8, 2.5),
        alpha: rand(0.06, 0.35),
        startX: rx,
      });
    }
    rainRef.current = rain;

    setTick((t) => t + 1);
  }, [categories]);

  /* ── Load hero video ─────────────────────────── */

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/hero-video.mp4";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.addEventListener("canplay", () => {
      videoRef.current = video;
      videoReadyRef.current = true;
      video.play().catch(() => {});
    });
    video.load();
    return () => { video.pause(); video.src = ""; };
  }, []);

  /* ── Render frame ──────────────────────────────── */

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const progress = progressRef.current;
    const time = Date.now() * 0.001;
    const orbs = orbsRef.current;
    const paths = pathsRef.current;
    const stream = streamRef.current;
    const rain = rainRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const revealT = Math.min(progress * 1.5, 1);
    const textCenterY = h * TEXT_Y;
    const cx = w / 2;

    // ── Font sizing (single line) ──
    const maxTextWidth = w * 0.88;
    ctx.font = `900 100px 'Orbitron', sans-serif`;
    const fullMeasure = ctx.measureText("TOKAMAK NETWORK").width;
    const mainFontSize = Math.min(90, Math.floor((maxTextWidth / fullMeasure) * 100));
    const textBottom = textCenterY + mainFontSize * 0.35;

    // Hovered orb
    const mouse = mouseRef.current;
    let hoveredOrb = -1;
    orbs.forEach((orb, i) => {
      const dx = mouse.x - orb.x, dy = mouse.y - orb.y;
      if (Math.sqrt(dx * dx + dy * dy) < orb.radius + 20) hoveredOrb = i;
    });

    // ── ECOSYSTEM label ──
    if (revealT > 0.05) {
      const ecoA = Math.min((revealT - 0.05) / 0.15, 1);
      const ecoY = textCenterY - mainFontSize * 0.45 - 22;
      ctx.save();
      ctx.font = "600 12px 'Orbitron', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "0.2em";
      const ecoW = ctx.measureText("ECOSYSTEM").width;
      ctx.strokeStyle = `rgba(0,119,255,${0.25 * ecoA})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - ecoW / 2 - 45, ecoY); ctx.lineTo(cx - ecoW / 2 - 10, ecoY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + ecoW / 2 + 10, ecoY); ctx.lineTo(cx + ecoW / 2 + 45, ecoY); ctx.stroke();
      ctx.fillStyle = `rgba(0,119,255,${0.55 * ecoA})`;
      ctx.fillText("ECOSYSTEM", cx, ecoY);
      ctx.letterSpacing = "0px";
      ctx.font = "400 11px sans-serif";
      ctx.fillStyle = `rgba(140,150,170,${0.45 * ecoA})`;
      ctx.fillText(`${totalRepos} repositories · ${totalCommits.toLocaleString("en-US")} commits`, cx, ecoY + 18);
      ctx.restore();
    }

    // ── Video-masked "TOKAMAK NETWORK" (single line) ──
    if (videoReadyRef.current && videoRef.current) {
      const video = videoRef.current;
      if (!offscreenRef.current) offscreenRef.current = document.createElement("canvas");
      const osc = offscreenRef.current;
      if (osc.width !== canvas.width || osc.height !== canvas.height) {
        osc.width = canvas.width;
        osc.height = canvas.height;
      }
      const octx = osc.getContext("2d");
      if (octx) {
        octx.clearRect(0, 0, osc.width, osc.height);
        octx.save();
        octx.scale(dpr, dpr);
        octx.textAlign = "center";
        octx.textBaseline = "middle";
        octx.fillStyle = "white";
        octx.font = `900 ${mainFontSize}px 'Orbitron', sans-serif`;
        octx.fillText("TOKAMAK NETWORK", cx, textCenterY);
        octx.globalCompositeOperation = "source-in";
        const vAspect = video.videoWidth / (video.videoHeight || 1);
        const vw = w * 1.6;
        const vh = vw / vAspect;
        octx.drawImage(video, cx - vw / 2, textCenterY - vh / 2, vw, vh);
        octx.globalCompositeOperation = "source-over";
        octx.restore();
        ctx.drawImage(osc, 0, 0, w, h);
      }

      // Neon glow
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `900 ${mainFontSize}px 'Orbitron', sans-serif`;
      ctx.strokeStyle = "rgba(0,119,255,0.25)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(0,150,255,0.6)";
      ctx.shadowBlur = 30;
      ctx.strokeText("TOKAMAK NETWORK", cx, textCenterY);
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    // ── Background rain curtain ──
    if (revealT > 0.1) {
      const rainA = Math.min((revealT - 0.1) / 0.2, 1);
      rain.forEach((p) => {
        p.y += p.speed;
        // Slight horizontal drift
        p.x += Math.sin(time * 0.5 + p.startX * 0.01) * 0.15;
        if (p.y > h + 10) {
          p.y = textBottom + rand(-5, 5);
          p.x = p.startX + rand(-3, 3);
        }
        const fadeTop = Math.min((p.y - textBottom) / 40, 1);
        const fadeBot = Math.max(1 - (p.y - (h - 60)) / 60, 0);
        const a = p.alpha * rainA * fadeTop * (p.y > h - 60 ? fadeBot : 1);
        if (a < 0.01) return;

        // Soft glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,200,220,${a * 0.1})`;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,215,235,${a})`;
        ctx.fill();
      });
    }

    // ── Stream particles (colored, bezier paths) ──
    if (revealT > 0.15 && paths.length > 0) {
      const sA = Math.min((revealT - 0.15) / 0.2, 1);
      const whiteRgb: [number, number, number] = [180, 220, 255];

      stream.forEach((p) => {
        const path = paths[p.catIdx];
        const cat = categories[p.catIdx];
        if (!path || !cat) return;

        p.t += p.speed;
        if (p.t > 1) {
          p.t = rand(-0.15, 0.05);
          p.offset = rand(-20, 20);
          p.alpha = rand(0.35, 1.0);
          p.size = rand(1.0, 3.2);
        }
        if (p.t < 0) return;

        const pt = bezier(path.p0, path.cp1, path.cp2, path.p3, p.t);
        // Perpendicular offset
        const eps = 0.01;
        const pt2 = bezier(path.p0, path.cp1, path.cp2, path.p3, Math.min(p.t + eps, 1));
        const dx = pt2.x - pt.x, dy = pt2.y - pt.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len, ny = dx / len;
        const offFade = 1 - p.t * p.t * 0.6;
        p.x = pt.x + nx * p.offset * offFade;
        p.y = pt.y + ny * p.offset * offFade;

        // Color: white→category
        const catRgb = hexToRgb(cat.color);
        const cT = Math.min(p.t * 1.8, 1);
        const [cr, cg, cb] = lerpColor(whiteRgb, catRgb, cT);

        let a = p.alpha * sA;
        if (p.t < 0.05) a *= p.t / 0.05;
        if (p.t > 0.7) a *= 0.7 + (p.t - 0.7) / 0.3 * 0.8;

        // Outer glow (much larger for thick stream look)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a * 0.06})`;
        ctx.fill();
        // Mid glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a * 0.18})`;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${a})`;
        ctx.fill();
        // Hot center
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a * 0.45})`;
        ctx.fill();
      });
    }

    // ── Orbs ──
    if (revealT > 0.3 && orbs.length > 0) {
      const oA = Math.min((revealT - 0.3) / 0.3, 1);

      orbs.forEach((orb, i) => {
        const [r, g, b] = hexToRgb(orb.color);
        const isH = hoveredOrb === i;
        const pulse = Math.sin(time * 2 + i * 0.7) * 0.08 + 0.92;
        const dR = orb.radius * pulse * (isH ? 1.15 : 1);

        // L1: large ambient
        const aR = dR * 5.5;
        const ag = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, aR);
        ag.addColorStop(0, `rgba(${r},${g},${b},${0.25 * oA})`);
        ag.addColorStop(0.2, `rgba(${r},${g},${b},${0.12 * oA})`);
        ag.addColorStop(0.5, `rgba(${r},${g},${b},${0.04 * oA})`);
        ag.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(orb.x, orb.y, aR, 0, Math.PI * 2); ctx.fillStyle = ag; ctx.fill();

        // L2: mid glow
        const mR = dR * 2;
        const mg = ctx.createRadialGradient(orb.x, orb.y, dR * 0.5, orb.x, orb.y, mR);
        mg.addColorStop(0, `rgba(${r},${g},${b},${0.3 * oA})`);
        mg.addColorStop(0.5, `rgba(${r},${g},${b},${0.1 * oA})`);
        mg.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath(); ctx.arc(orb.x, orb.y, mR, 0, Math.PI * 2); ctx.fillStyle = mg; ctx.fill();

        // L3: body
        const bg = ctx.createRadialGradient(orb.x - dR * 0.3, orb.y - dR * 0.3, dR * 0.1, orb.x + dR * 0.1, orb.y + dR * 0.1, dR * 1.1);
        bg.addColorStop(0, `rgba(255,255,255,${0.5 * oA})`);
        bg.addColorStop(0.15, `rgba(${Math.min(r + 80, 255)},${Math.min(g + 80, 255)},${Math.min(b + 80, 255)},${0.75 * oA})`);
        bg.addColorStop(0.4, `rgba(${r},${g},${b},${0.9 * oA})`);
        bg.addColorStop(0.7, `rgba(${r >> 1},${g >> 1},${b >> 1},${0.7 * oA})`);
        bg.addColorStop(1, `rgba(${r >> 2},${g >> 2},${b >> 2},${0.4 * oA})`);
        ctx.beginPath(); ctx.arc(orb.x, orb.y, dR, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();

        // L4: specular
        const sg = ctx.createRadialGradient(orb.x - dR * 0.35, orb.y - dR * 0.35, 0, orb.x - dR * 0.15, orb.y - dR * 0.15, dR * 0.6);
        sg.addColorStop(0, `rgba(255,255,255,${0.65 * oA})`);
        sg.addColorStop(0.4, `rgba(255,255,255,${0.15 * oA})`);
        sg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath(); ctx.arc(orb.x, orb.y, dR, 0, Math.PI * 2); ctx.fillStyle = sg; ctx.fill();

        // L5: rim
        const rg = ctx.createRadialGradient(orb.x + dR * 0.3, orb.y + dR * 0.3, 0, orb.x + dR * 0.2, orb.y + dR * 0.2, dR * 0.5);
        rg.addColorStop(0, `rgba(${Math.min(r + 60, 255)},${Math.min(g + 60, 255)},${Math.min(b + 60, 255)},${0.22 * oA})`);
        rg.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath(); ctx.arc(orb.x, orb.y, dR, 0, Math.PI * 2); ctx.fillStyle = rg; ctx.fill();

        // L6: edge ring
        ctx.beginPath(); ctx.arc(orb.x, orb.y, dR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${Math.min(r + 40, 255)},${Math.min(g + 40, 255)},${Math.min(b + 40, 255)},${0.35 * oA})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = `rgba(${r},${g},${b},${0.6 * oA})`;
        ctx.shadowBlur = 18;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Labels
        const lY = orb.y + dR + 20;
        ctx.font = "700 11px 'Orbitron', sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        ctx.fillStyle = `rgba(${Math.min(r + 40, 255)},${Math.min(g + 40, 255)},${Math.min(b + 40, 255)},${oA * 0.95})`;
        ctx.fillText(orb.name, orb.x, lY);
        ctx.font = "500 10px 'Orbitron', sans-serif";
        ctx.fillStyle = `rgba(220,220,220,${oA * 0.7})`;
        ctx.fillText(formatNum(orb.totalLines), orb.x, lY + 16);
        if (isH) {
          ctx.font = "400 10px sans-serif";
          ctx.fillStyle = `rgba(255,255,255,${oA * 0.55})`;
          ctx.fillText(`${orb.repoCount} repos`, orb.x, lY + 30);
        }
      });
    }

    ctx.restore();
  }, [categories, totalRepos, totalCommits]);

  /* ── Animation loop ────────────────────────────── */

  const loop = useCallback(() => {
    if (visibleRef.current) render();
    rafRef.current = requestAnimationFrame(loop);
  }, [render]);

  /* ── Setup ─────────────────────────────────────── */

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const motionQ = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = CANVAS_HEIGHT;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      buildLayout(w, h);
      if (motionQ.matches) { progressRef.current = 1; render(); }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(([e]) => { visibleRef.current = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(container);

    const onScroll = () => {
      const rect = container.getBoundingClientRect();
      const vH = window.innerHeight;
      progressRef.current = Math.max(0, Math.min(1, (vH - rect.top) / (vH + rect.height)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);

    if (!motionQ.matches) rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect(); io.disconnect();
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [buildLayout, render, loop]);

  return (
    <div ref={containerRef} className="w-full max-w-[1280px] px-6">
      <canvas ref={canvasRef} className="w-full cursor-crosshair" style={{ height: CANVAS_HEIGHT }} />
    </div>
  );
}
