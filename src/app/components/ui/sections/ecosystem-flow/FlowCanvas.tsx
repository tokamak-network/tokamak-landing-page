"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FlowCategory, FlowRepo } from "./index";

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

const MOBILE_BP = 640;
const TEXT_Y = 0.11;
const JUNCTION_Y = 0.38;       // convergence point
const END_Y = 0.78;

/* ── Component ─────────────────────────────────────── */

export default function FlowCanvas({
  categories,
  activeProjects,
  codeChanges,
}: {
  categories: FlowCategory[];
  activeProjects: number;
  codeChanges: number;
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
  const mainFontSizeRef = useRef(90);
  const catLabelsRef = useRef<{ catIdx: number; x: number; y: number; w: number; h: number; dotX: number; dotY: number }[]>([]);
  const popupHoverRef = useRef(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, setTick] = useState(0);
  const [popup, setPopup] = useState<{
    catIdx: number;
    catName: string;
    color: string;
    repos: FlowRepo[];
    x: number;
    y: number;
  } | null>(null);

  /* ── Build layout ─────────────────────────────────── */

  const buildLayout = useCallback((w: number, h: number) => {
    const cx = w / 2;
    const textY = h * TEXT_Y;
    const endCY = h * END_Y;

    // Measure text width
    const tmpCanvas = document.createElement("canvas");
    const tmpCtx = tmpCanvas.getContext("2d")!;
    const maxW = w * 0.92;
    tmpCtx.font = "900 100px 'Orbitron', sans-serif";
    const measured = tmpCtx.measureText("TOKAMAK NETWORK").width;
    const fontSize = Math.min(90, Math.floor((maxW / measured) * 100));
    tmpCtx.font = `900 ${fontSize}px 'Orbitron', sans-serif`;
    const textW = tmpCtx.measureText("TOKAMAK NETWORK").width;
    textWidthRef.current = textW;
    mainFontSizeRef.current = fontSize;

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
    const spread = w * 0.95;
    const count = catEntries.length;
    const paths: { upper: { p0: Pt; cp1: Pt; cp2: Pt; p3: Pt }; lower: { p0: Pt; cp1: Pt; cp2: Pt; p3: Pt } }[] = [];
    const strands: StrandInfo[] = [];

    const junctionX = cx;
    const junctionY = h * JUNCTION_Y;

    let strandIdx = 0;
    const totalStrands = catEntries.reduce((s, e) => s + e.cat.repos.length, 0);
    catEntries.forEach((entry, sortedIdx) => {
      const { cat, idx: ci } = entry;
      const catRepos = cat.repos;
      const repoCount = catRepos.length;

      catRepos.forEach((repo, ri) => {
        const activity = repo.linesChanged / maxTotal;
        const width = 0.6 + activity * 2.5;

        const globalT = count <= 1 ? 0.5 : (strandIdx / Math.max(1, totalStrands - 1));
        const startX = textLeft + globalT * textW;
        const startY = textBottom;

        const catT = count <= 1 ? 0.5 : sortedIdx / (count - 1);
        const catCenterX = cx - spread / 2 + catT * spread;
        const repoSpreadW = spread / count * 0.7;
        const repoT = repoCount <= 1 ? 0 : (ri / (repoCount - 1) - 0.5);
        const endX = catCenterX + repoT * repoSpreadW;
        const xNorm = ((catT + repoT * 0.05) - 0.5) * 2;
        const endY = endCY + xNorm * xNorm * h * 0.025;

        const u_cp1x = startX;
        const u_cp1y = startY + (junctionY - startY) * 0.45;
        const u_cp2x = junctionX + (startX - junctionX) * 0.15;
        const u_cp2y = startY + (junctionY - startY) * 0.75;
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
    video.src = "/flow-video.mp4";
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
    const isMobile = w < MOBILE_BP;

    // ── Font sizing (cached from buildLayout) ──
    const mainFontSize = mainFontSizeRef.current;

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
      const ecoY = textCenterY - mainFontSize * 0.45 - 40;
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
      ctx.fillText(`${activeProjects} active projects · ${codeChanges.toLocaleString("en-US")} code changes`, cx, ecoY + 18);
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

    // ── Category dots + hover labels at strand endpoints (desktop only) ──
    if (!isMobile) {
      // First pass: collect per-category info
      const catMap = new Map<number, {
        catIdx: number; catName: string; color: string;
        avgX: number; avgY: number;
        repoCount: number; totalLines: number; activeCount: number;
      }>();

      strands.forEach((strand) => {
        if (catMap.has(strand.catIdx)) return;
        const catStrands = strands
          .map((s, i) => ({ s, i }))
          .filter(({ s }) => s.catIdx === strand.catIdx);

        let sumX = 0, sumY = 0;
        catStrands.forEach(({ i }) => {
          const p = paths[i];
          if (p) { sumX += p.lower.p3.x; sumY += p.lower.p3.y; }
        });

        catMap.set(strand.catIdx, {
          catIdx: strand.catIdx,
          catName: strand.catName,
          color: strand.color,
          avgX: sumX / catStrands.length,
          avgY: sumY / catStrands.length,
          repoCount: new Set(catStrands.map(({ s }) => s.repoName)).size,
          totalLines: catStrands.reduce((sum, { s }) => sum + s.linesChanged, 0),
          activeCount: catStrands.filter(({ s }) => s.isActive).length,
        });
      });

      const cats = Array.from(catMap.values()).sort((a, b) => a.avgX - b.avgX);

      // Collision-aware label Y offsets (push apart if too close on X)
      const LABEL_H = 65;
      const MIN_X_GAP = 90;
      const labelOffsets: number[] = new Array(cats.length).fill(0);

      for (let i = 1; i < cats.length; i++) {
        const dx = Math.abs(cats[i].avgX - cats[i - 1].avgX);
        if (dx < MIN_X_GAP) {
          // Alternate: push current one down if previous was up (or vice versa)
          labelOffsets[i] = labelOffsets[i - 1] <= 0 ? LABEL_H : -LABEL_H * 0.5;
        }
      }

      // Store label hit areas for click detection
      const pillW = 130;
      catLabelsRef.current = cats.map((cat, ci) => {
        const lx = Math.max(pillW / 2 + 4, Math.min(w - pillW / 2 - 4, cat.avgX));
        const ly = cat.avgY + 14;
        const pillH = 60;
        const offsetY = labelOffsets[ci];
        const pillY = cat.avgY + 34 + offsetY - 4;
        return {
          catIdx: cat.catIdx,
          x: lx - pillW / 2,
          y: Math.min(ly - 4, pillY),
          w: pillW,
          h: Math.max(pillY + pillH, ly + 22) - Math.min(ly - 4, pillY),
          dotX: cat.avgX,
          dotY: cat.avgY,
        };
      });

      // Draw all categories
      cats.forEach((cat, ci) => {
        const [r, g, b] = hexToRgb(cat.color);
        const isHovered = hoveredCat === cat.catIdx;
        const isNoneHovered = hoveredCat === -1;

        // Always draw: colored dot with subtle pulse
        const pulse = Math.sin(time * 2 + cat.catIdx) * 0.2 + 0.8;
        const dotR = isHovered ? 6 : 4;
        const dotA = isHovered ? 1 : (isNoneHovered ? 0.7 : 0.2);

        // Outer glow (always, subtle)
        ctx.beginPath();
        ctx.arc(cat.avgX, cat.avgY, dotR + 8 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${dotA * 0.06})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(cat.avgX, cat.avgY, dotR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${dotA * 0.9})`;
        ctx.fill();

        // Bright center
        ctx.beginPath();
        ctx.arc(cat.avgX, cat.avgY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${dotA * 0.7})`;
        ctx.fill();

        // Background pill width (used for label truncation + pill rendering)
        const pillW = 130;

        // Clamp label X so pill doesn't go outside canvas
        const labelX = Math.max(pillW / 2 + 4, Math.min(w - pillW / 2 - 4, cat.avgX));

        // Category name — use shorter word if full name overflows
        ctx.font = "700 18px 'Orbitron', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const nameA = isHovered ? 1 : (isNoneHovered ? 0.8 : 0.15);
        ctx.fillStyle = `rgba(${r},${g},${b},${nameA})`;
        const fullName = cat.catName.toUpperCase();
        const maxLabelW = pillW - 12;
        let displayName = fullName;
        if (ctx.measureText(fullName).width > maxLabelW) {
          const parts = fullName.split(/\s*&\s*/);
          if (parts.length >= 2) {
            displayName = parts[0].length <= parts[1].length ? parts[0] : parts[1];
          } else {
            displayName = fullName.split(/\s+/)[0];
          }
        }
        ctx.fillText(displayName, labelX, cat.avgY + 14);

        // Detail label with collision offset
        const fade = isHovered ? 1 : (isNoneHovered ? 0.7 : 0.1);
        const offsetY = labelOffsets[ci];
        const labelY = cat.avgY + 34 + offsetY;
        const pillH = 60;
        const pillX = labelX - pillW / 2;
        const pillY = labelY - 4;
        ctx.beginPath();
        ctx.roundRect(pillX, pillY, pillW, pillH, 6);
        ctx.fillStyle = `rgba(${r},${g},${b},${0.08 * fade})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${r},${g},${b},${0.2 * fade})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Repo count
        ctx.font = "600 15px 'Orbitron', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = `rgba(255,255,255,${0.9 * fade})`;
        ctx.fillText(`${cat.repoCount} repos`, labelX, labelY + 2);

        // Lines changed
        if (cat.totalLines > 0) {
          ctx.font = "400 16px sans-serif";
          ctx.fillStyle = `rgba(${r},${g},${b},${0.7 * fade})`;
          ctx.fillText(`${formatNum(cat.totalLines)} lines`, labelX, labelY + 22);
        }

        // Active count
        if (cat.activeCount > 0) {
          ctx.font = "400 14px sans-serif";
          ctx.fillStyle = `rgba(34,197,94,${0.7 * fade})`;
          ctx.fillText(`${cat.activeCount} active`, labelX, labelY + 40);
        }
      });
    }

    ctx.restore();
  }, [activeProjects, codeChanges]);

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
      const h = w < MOBILE_BP ? 700 : 1000;
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
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      mouseRef.current = { x: mx, y: my };

      // Hit-test category labels for hover popup
      const scaleX = (canvas.width / (window.devicePixelRatio || 1)) / r.width;
      const scaleY = (canvas.height / (window.devicePixelRatio || 1)) / r.height;
      const cx = mx * scaleX;
      const cy = my * scaleY;

      const hit = catLabelsRef.current.find(
        (l) => cx >= l.x && cx <= l.x + l.w && cy >= l.y && cy <= l.y + l.h,
      );
      if (hit) {
        // Cancel any pending close
        if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
        const cat = categories[hit.catIdx];
        if (cat && popup?.catIdx !== hit.catIdx) {
          const dotCssX = hit.dotX / scaleX;
          const dotCssY = hit.dotY / scaleY;
          setPopup({
            catIdx: hit.catIdx,
            catName: cat.name,
            color: cat.color,
            repos: [...cat.repos].sort((a, b) => b.linesChanged - a.linesChanged),
            x: dotCssX,
            y: dotCssY,
          });
        }
      } else if (popup && !popupHoverRef.current) {
        // Delay close so user can move mouse to popup
        if (!closeTimerRef.current) {
          closeTimerRef.current = setTimeout(() => {
            if (!popupHoverRef.current) setPopup(null);
            closeTimerRef.current = null;
          }, 200);
        }
      }
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
      if (!popupHoverRef.current) {
        closeTimerRef.current = setTimeout(() => {
          if (!popupHoverRef.current) setPopup(null);
          closeTimerRef.current = null;
        }, 200);
      }
    };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("mouseleave", onLeave);

    if (!motionQ.matches) rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect(); io.disconnect();
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, [buildLayout, render, loop, categories, popup]);

  // Pre-compute category stats for mobile HTML cards
  const catStats = categories
    .map((cat) => {
      const totalLines = cat.repos.reduce((s, r) => s + r.linesChanged, 0);
      const activeCount = cat.repos.filter((r) => r.isActive).length;
      return { name: cat.name, color: cat.color, repoCount: cat.repos.length, totalLines, activeCount };
    })
    .sort((a, b) => b.totalLines - a.totalLines);

  return (
    <div ref={containerRef} className="w-full max-w-[1440px] px-0 sm:px-2">
      <div className="relative">
        <canvas ref={canvasRef} className="w-full cursor-crosshair" />

        {/* Category detail popup (hover) */}
        <AnimatePresence>
          {popup && (
            <motion.div
              data-flow-popup
              key={popup.catIdx}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-[280px] rounded-lg border bg-[#0a0a0a]/95 backdrop-blur-md shadow-2xl pointer-events-auto"
              onMouseEnter={() => {
                popupHoverRef.current = true;
                if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
              }}
              onMouseLeave={() => {
                popupHoverRef.current = false;
                setPopup(null);
              }}
              style={{
                left: Math.min(
                  Math.max(8, popup.x - 140),
                  (containerRef.current?.clientWidth ?? 600) - 288,
                ),
                bottom: (canvasRef.current?.clientHeight ?? 800) - popup.y + 12,
                borderColor: popup.color + "40",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center gap-2.5 px-4 py-3 border-b"
                style={{
                  borderColor: popup.color + "30",
                  background: popup.color + "0c",
                }}
              >
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: popup.color, boxShadow: `0 0 8px ${popup.color}80` }}
                />
                <span
                  className="text-[13px] font-[800] uppercase tracking-[0.06em] text-white/90"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {popup.catName}
                </span>
                <span className="ml-auto text-[11px] text-white/40">
                  {popup.repos.length} repos
                </span>
              </div>

              {/* Repo list — grows upward */}
              <div className="flex flex-col">
                {popup.repos.map((repo) => {
                  const isPositive = repo.netGrowth >= 0;
                  return (
                    <a
                      key={repo.name}
                      href={`https://github.com/tokamak-network/${repo.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2 border-b border-white/5 shrink-0 cursor-pointer transition-colors hover:bg-white/[0.06]"
                    >
                      <div className="min-w-0 flex-1 mr-3">
                        <p className="text-[12px] font-[600] text-white/80 truncate group-hover:text-white">
                          {repo.name}
                        </p>
                        <p className="text-[10px] text-white/40 mt-0.5">
                          {formatNum(repo.linesChanged)} lines
                          {repo.isActive && (
                            <span className="text-green-400/60 ml-1">&bull; active</span>
                          )}
                        </p>
                      </div>
                      <span
                        className="text-[12px] font-[800] shrink-0"
                        style={{
                          fontFamily: "'Orbitron', sans-serif",
                          color: isPositive ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {isPositive ? "+" : ""}{formatNum(repo.netGrowth)}
                      </span>
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile: category cards below canvas */}
      <div className="grid grid-cols-2 gap-2 px-4 pt-2 pb-4 sm:hidden">
        {catStats.map((cat) => (
          <div
            key={cat.name}
            className="flex items-start gap-2.5 rounded-lg px-3 py-2.5"
            style={{ background: `${cat.color}0a`, borderLeft: `2px solid ${cat.color}40` }}
          >
            <div
              className="mt-1 h-2 w-2 shrink-0 rounded-full"
              style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}60` }}
            />
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-white/80" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                {cat.name}
              </p>
              <p className="mt-0.5 text-[10px] text-white/50">
                {cat.repoCount} repos &middot; {formatNum(cat.totalLines)} lines
                {cat.activeCount > 0 && (
                  <span className="text-green-400/70"> &middot; {cat.activeCount} active</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
