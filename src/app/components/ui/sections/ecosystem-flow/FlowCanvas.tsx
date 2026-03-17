"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { FlowCategory } from "./index";

/* ── Types ─────────────────────────────────────────── */

interface Pt { x: number; y: number; }

interface StrandInfo {
  catIdx: number;
  catName: string;
  repoName: string;
  color: string;
  linesChanged: number;
  isActive: boolean;
  width: number;
}

/* ── Helpers ───────────────────────────────────────── */

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

/** Evaluate a point along a two-segment (upper+lower) bezier path. t: 0→1 */
function evalTwoSeg(
  p: { upper: { p0: Pt; cp1: Pt; cp2: Pt; p3: Pt }; lower: { p0: Pt; cp1: Pt; cp2: Pt; p3: Pt } },
  t: number,
): Pt {
  const SPLIT = 0.35; // upper segment occupies 0→35%, lower 35%→100%
  if (t <= SPLIT) {
    const localT = t / SPLIT;
    return bezier(p.upper.p0, p.upper.cp1, p.upper.cp2, p.upper.p3, localT);
  }
  const localT = (t - SPLIT) / (1 - SPLIT);
  return bezier(p.lower.p0, p.lower.cp1, p.lower.cp2, p.lower.p3, localT);
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

/* ── Constants ─────────────────────────────────────── */

const CANVAS_HEIGHT = 1000;
const TEXT_Y = 0.11;
const JUNCTION_Y = 0.38;       // convergence point
const END_Y = 0.78;

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
  const strandsRef = useRef<StrandInfo[]>([]);
  const pathsRef = useRef<{ upper: { p0: Pt; cp1: Pt; cp2: Pt; p3: Pt }; lower: { p0: Pt; cp1: Pt; cp2: Pt; p3: Pt } }[]>([]);
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
    const endCY = h * END_Y;

    // Measure text width
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
    const textBottom = textY + fontSize * 0.35;

    // Sort categories by total lines
    const catEntries = categories
      .map((cat, i) => ({
        cat, idx: i,
        total: cat.repos.reduce((s, r) => s + r.linesChanged, 0),
      }))
      .sort((a, b) => b.total - a.total);

    const maxTotal = Math.max(1, ...catEntries.map((e) => e.total));
    const spread = w * 0.85;
    const count = catEntries.length;
    // Two-segment paths: upper (text → junction) + lower (junction → endpoint)
    const paths: { upper: { p0: Pt; cp1: Pt; cp2: Pt; p3: Pt }; lower: { p0: Pt; cp1: Pt; cp2: Pt; p3: Pt } }[] = [];
    const strands: StrandInfo[] = [];

    const junctionX = cx;
    const junctionY = h * JUNCTION_Y;

    // Build one strand per repo, grouped by category
    let strandIdx = 0;
    catEntries.forEach((entry, sortedIdx) => {
      const { cat, idx: ci } = entry;
      const catRepos = cat.repos;
      const repoCount = catRepos.length;

      catRepos.forEach((repo, ri) => {
        const activity = repo.linesChanged / maxTotal;
        const width = 0.6 + activity * 2.5;

        // Start X: distribute proportionally along text width
        const globalT = count <= 1 ? 0.5 : (strandIdx / Math.max(1, categories.reduce((s, c) => s + c.repos.length, 0) - 1));
        const startX = textLeft + globalT * textW;
        const startY = textBottom;

        // End X: fan out by category, then sub-spread within category
        const catT = count <= 1 ? 0.5 : sortedIdx / (count - 1);
        const catCenterX = cx - spread / 2 + catT * spread;
        const repoSpreadW = spread / count * 0.7;
        const repoT = repoCount <= 1 ? 0 : (ri / (repoCount - 1) - 0.5);
        const endX = catCenterX + repoT * repoSpreadW;
        const xNorm = ((catT + repoT * 0.05) - 0.5) * 2;
        const endY = endCY + xNorm * xNorm * h * 0.025;

        // Upper segment: text spread → junction (converge)
        const u_cp1x = startX;
        const u_cp1y = startY + (junctionY - startY) * 0.45;
        const u_cp2x = junctionX + (startX - junctionX) * 0.15;
        const u_cp2y = startY + (junctionY - startY) * 0.75;

        // Lower segment: junction → endpoint (fan out)
        const l_cp1x = junctionX + (endX - junctionX) * 0.1;
        const l_cp1y = junctionY + (endY - junctionY) * 0.3;
        const l_cp2x = endX + (junctionX - endX) * 0.08;
        const l_cp2y = junctionY + (endY - junctionY) * 0.7;

        paths.push({
          upper: { p0: { x: startX, y: startY }, cp1: { x: u_cp1x, y: u_cp1y }, cp2: { x: u_cp2x, y: u_cp2y }, p3: { x: junctionX, y: junctionY } },
          lower: { p0: { x: junctionX, y: junctionY }, cp1: { x: l_cp1x, y: l_cp1y }, cp2: { x: l_cp2x, y: l_cp2y }, p3: { x: endX, y: endY } },
        });

        strands.push({
          catIdx: ci,
          catName: cat.name,
          repoName: repo.name,
          color: cat.color,
          linesChanged: repo.linesChanged,
          isActive: repo.isActive,
          width: Math.max(0.6, width),
        });

        strandIdx++;
      });
    });

    pathsRef.current = paths;
    strandsRef.current = strands;

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
    const paths = pathsRef.current;
    const strands = strandsRef.current;

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

    // Hovered category (nearest strand endpoint)
    const mouse = mouseRef.current;
    let hoveredCat = -1;
    if (mouse.x > 0 && mouse.y > 0) {
      let minDist = 120;
      strands.forEach((strand, si) => {
        const p = paths[si];
        if (!p) return;
        const ep = p.lower.p3;
        const dx = mouse.x - ep.x, dy = mouse.y - ep.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minDist) { minDist = d; hoveredCat = strand.catIdx; }
      });
    }

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

    // ── Video-masked text + strands ──
    const STEPS = 80;
    const maxStep = STEPS;
    const hasVideo = videoReadyRef.current && videoRef.current;

    if (hasVideo) {
      const video = videoRef.current!;
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

        // 1) Draw text as white mask shape
        octx.textAlign = "center";
        octx.textBaseline = "middle";
        octx.fillStyle = "white";
        octx.font = `900 ${mainFontSize}px 'Orbitron', sans-serif`;
        octx.fillText("TOKAMAK NETWORK", cx, textCenterY);

        // 2) Draw strands as white mask shapes (so video fills them too)
        if (maxStep >= 2 && paths.length > 0) {
          strands.forEach((strand, si) => {
            const pathData = paths[si];
            if (!pathData) return;
            const isHovered = hoveredCat === -1 || hoveredCat === strand.catIdx;
            const alpha = isHovered ? 0.9 : 0.12;

            for (let s = 0; s < maxStep - 1; s++) {
              const t1 = s / STEPS;
              const t2 = (s + 1) / STEPS;
              const pt1 = evalTwoSeg(pathData, t1);
              const pt2 = evalTwoSeg(pathData, t2);

              let segAlpha = alpha;
              if (t1 < 0.1) segAlpha *= t1 / 0.1;
              if (t1 > 0.9) segAlpha *= (1 - t1) / 0.1;

              octx.beginPath();
              octx.moveTo(pt1.x, pt1.y);
              octx.lineTo(pt2.x, pt2.y);
              octx.strokeStyle = `rgba(255,255,255,${segAlpha})`;
              octx.lineWidth = strand.width + 1;
              octx.lineCap = "round";
              octx.stroke();
            }
          });
        }

        // 3) Apply video as texture via source-in
        octx.globalCompositeOperation = "source-in";
        const vAspect = video.videoWidth / (video.videoHeight || 1);
        const vw = w * 1.6;
        const vh = vw / vAspect;
        // Center video vertically across full canvas for strand coverage
        const vCenterY = h * 0.4;
        octx.drawImage(video, cx - vw / 2, vCenterY - vh / 2, vw, vh);
        octx.globalCompositeOperation = "source-over";
        octx.restore();
        ctx.drawImage(osc, 0, 0, w, h);
      }

      // Neon glow on text
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

    // ── Strand color tint overlay (on top of video texture) ──
    if (maxStep >= 2 && paths.length > 0) {
      strands.forEach((strand, si) => {
        const pathData = paths[si];
        if (!pathData) return;

        const isHovered = hoveredCat === -1 || hoveredCat === strand.catIdx;
        const [r1, g1, b1] = hexToRgb(strand.color);

        // Glow layer for hovered active strands
        if (isHovered && strand.isActive) {
          ctx.beginPath();
          const gFirst = evalTwoSeg(pathData, 0);
          ctx.moveTo(gFirst.x, gFirst.y);
          for (let s = 1; s <= maxStep; s++) {
            const pt = evalTwoSeg(pathData, s / STEPS);
            ctx.lineTo(pt.x, pt.y);
          }
          ctx.strokeStyle = `rgba(${r1},${g1},${b1},0.08)`;
          ctx.lineWidth = strand.width + 4;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.stroke();
        }

        // Subtle color tint over the video-textured strands
        const tintAlpha = isHovered ? 0.18 : 0.02;
        for (let s = 0; s < maxStep - 1; s++) {
          const t1 = s / STEPS;
          const t2 = (s + 1) / STEPS;
          const pt1 = evalTwoSeg(pathData, t1);
          const pt2 = evalTwoSeg(pathData, t2);

          const colorT = t1;
          const [cr, cg, cb] = lerpColor([180, 220, 255], [r1, g1, b1], colorT * 0.8);

          let segAlpha = tintAlpha;
          if (t1 < 0.1) segAlpha *= t1 / 0.1;
          if (t1 > 0.9) segAlpha *= (1 - t1) / 0.1;

          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${segAlpha})`;
          ctx.lineWidth = strand.width;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      });
    }

    // ── Category labels at strand endpoints ──
    {
      const labelAlpha = 1;
      const drawnCats = new Set<number>();

      strands.forEach((strand) => {
        if (drawnCats.has(strand.catIdx)) return;
        drawnCats.add(strand.catIdx);

        // Collect all strands in this category to compute average endpoint
        const catStrands = strands
          .map((s, i) => ({ s, i }))
          .filter(({ s }) => s.catIdx === strand.catIdx);

        // Average endpoint position
        let sumX = 0, sumY = 0;
        catStrands.forEach(({ i }) => {
          const p = paths[i];
          if (p) { sumX += p.lower.p3.x; sumY += p.lower.p3.y; }
        });
        const avgX = sumX / catStrands.length;
        const avgY = sumY / catStrands.length;

        // Stats
        const repoCount = new Set(catStrands.map(({ s }) => s.repoName)).size;
        const totalLines = catStrands.reduce((sum, { s }) => sum + s.linesChanged, 0);
        const activeCount = catStrands.filter(({ s }) => s.isActive).length;

        const isHovered = hoveredCat === -1 || hoveredCat === strand.catIdx;
        const a = isHovered ? labelAlpha : labelAlpha * 0.25;
        const [r, g, b] = hexToRgb(strand.color);

        // Node glow
        const nodeGlow = Math.sin(time * 2 + strand.catIdx) * 0.2 + 0.8;
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(avgX, avgY, 20 * nodeGlow, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.06})`;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(avgX, avgY, 10, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.12})`;
          ctx.fill();
        }

        // Core node dot
        ctx.beginPath();
        ctx.arc(avgX, avgY, isHovered ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.9})`;
        ctx.fill();
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(avgX, avgY, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${a * 0.9})`;
          ctx.fill();
        }

        // Category name
        const labelY = avgY + 18;
        ctx.font = "700 13px 'Orbitron', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.fillText(strand.catName.toUpperCase(), avgX, labelY);

        // Repo count + lines changed
        ctx.font = "500 11px 'Orbitron', sans-serif";
        ctx.fillStyle = `rgba(220,220,220,${a * 0.65})`;
        ctx.fillText(`${repoCount} repos`, avgX, labelY + 18);

        if (totalLines > 0) {
          ctx.font = "400 10px sans-serif";
          ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.5})`;
          ctx.fillText(`${formatNum(totalLines)} lines`, avgX, labelY + 33);
        }

        // Active indicator
        if (isHovered && activeCount > 0) {
          ctx.font = "400 10px sans-serif";
          ctx.fillStyle = `rgba(34,197,94,${a * 0.6})`;
          ctx.fillText(`${activeCount} active`, avgX, labelY + 47);
        }
      });
    }

    ctx.restore();
  }, [totalRepos, totalCommits]);

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
