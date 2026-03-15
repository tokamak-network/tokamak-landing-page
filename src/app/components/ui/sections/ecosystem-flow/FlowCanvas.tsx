"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { FlowCategory } from "./index";

/* ── Types ─────────────────────────────────────────── */

interface Pt {
  x: number;
  y: number;
}

interface FlowStrand {
  catIdx: number;
  repoIdx: number;
  color: string;
  secondaryColor: string;
  catName: string;
  repoName: string;
  linesChanged: number;
  isActive: boolean;
  // Bezier control points
  p0: Pt;
  cp1: Pt;
  cp2: Pt;
  p3: Pt;
  width: number;
  // Endpoint scatter dots
  endDots: { x: number; y: number; r: number; alpha: number }[];
}

interface DustParticle {
  strandIdx: number;
  t: number;
  offset: number; // perpendicular offset from curve
  speed: number;
  size: number;
  alpha: number;
}

interface TextParticle {
  // Target position (text shape)
  tx: number;
  ty: number;
  // Current position
  x: number;
  y: number;
  // Velocity
  vx: number;
  vy: number;
  // Visual
  size: number;
  alpha: number;
  // Drip: some particles fall into strands
  dripping: boolean;
  dripT: number;
  dripStrandIdx: number;
}

/* ── Helpers ───────────────────────────────────────── */

function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const m = 1 - t;
  return {
    x:
      m * m * m * p0.x +
      3 * m * m * t * p1.x +
      3 * m * t * t * p2.x +
      t * t * t * p3.x,
    y:
      m * m * m * p0.y +
      3 * m * m * t * p1.y +
      3 * m * t * t * p2.y +
      t * t * t * p3.y,
  };
}

function bezierTangent(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const m = 1 - t;
  return {
    x:
      3 * m * m * (p1.x - p0.x) +
      6 * m * t * (p2.x - p1.x) +
      3 * t * t * (p3.x - p2.x),
    y:
      3 * m * m * (p1.y - p0.y) +
      6 * m * t * (p2.y - p1.y) +
      3 * t * t * (p3.y - p2.y),
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function lerpColor(
  c1: [number, number, number],
  c2: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * t),
    Math.round(c1[1] + (c2[1] - c1[1]) * t),
    Math.round(c1[2] + (c2[2] - c1[2]) * t),
  ];
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/* color palette for secondary color mixing */
const SECONDARY_COLORS: Record<string, string> = {
  "#0077ff": "#00ddff",
  "#22c55e": "#7cffb2",
  "#a855f7": "#e879f9",
  "#f59e0b": "#fde68a",
  "#ef4444": "#fb923c",
  "#06b6d4": "#67e8f9",
  "#ec4899": "#f9a8d4",
};

function getSecondary(hex: string): string {
  return SECONDARY_COLORS[hex] || "#66ccff";
}

/* ── Constants ─────────────────────────────────────── */

const CANVAS_HEIGHT = 1400;
const TOP_Y = 0.09;
const CAT_Y = 0.40;
const REPO_Y = 0.80;
const STRANDS_PER_REPO_MIN = 3;
const STRANDS_PER_REPO_MAX = 8;
const DUST_COUNT = 300;
const TEXT_PARTICLE_DENSITY = 3; // pixel sampling interval
const TEXT_FONT_SIZE = 72;
const MOUSE_REPEL_RADIUS = 80;
const MOUSE_REPEL_FORCE = 3;
const PARTICLE_RETURN_SPEED = 0.06;
const DRIP_CHANCE = 0.0008; // per-frame chance of a particle dripping

/* ── Component ─────────────────────────────────────── */

export default function FlowCanvas({
  categories,
}: {
  categories: FlowCategory[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strandsRef = useRef<FlowStrand[]>([]);
  const dustRef = useRef<DustParticle[]>([]);
  const textParticlesRef = useRef<TextParticle[]>([]);
  const textBuiltRef = useRef(false);
  const progressRef = useRef(0);
  const mouseRef = useRef<Pt>({ x: -9999, y: -9999 });
  const hoveredCatRef = useRef(-1);
  const rafRef = useRef<number | undefined>(undefined);
  const visibleRef = useRef(false);
  const [, setCanvasWidth] = useState(1280);

  /* ── Build strands layout ─────────────────────────── */

  const buildLayout = useCallback(
    (w: number, h: number) => {
      const cx = w / 2;
      const topY = h * TOP_Y;
      const strands: FlowStrand[] = [];

      const totalRepos = categories.reduce(
        (s, c) => s + c.repos.length,
        0
      );
      const maxLC = Math.max(
        1,
        ...categories.flatMap((c) => c.repos.map((r) => r.linesChanged))
      );

      let repoCounter = 0;

      categories.forEach((cat, ci) => {
        const catCount = categories.length;
        const catSpread = w * 0.6;
        const catX =
          catCount === 1
            ? cx
            : cx - catSpread / 2 + (ci / (catCount - 1)) * catSpread;

        const secondary = getSecondary(cat.color);

        cat.repos.forEach((repo, ri) => {
          const repoSpread = w * 0.9;
          const baseRepoX =
            totalRepos === 1
              ? cx
              : cx -
                repoSpread / 2 +
                (repoCounter / (totalRepos - 1)) * repoSpread;
          const repoY = h * REPO_Y;

          // More strands for more active repos
          const activity = repo.linesChanged / maxLC;
          const strandCount = Math.round(
            STRANDS_PER_REPO_MIN +
              activity * (STRANDS_PER_REPO_MAX - STRANDS_PER_REPO_MIN)
          );

          // Scatter radius at endpoint (more active = wider spread)
          const scatterRadius = 15 + activity * 40;

          for (let si = 0; si < strandCount; si++) {
            // Vary each strand's endpoint position for the scatter effect
            const angle = (si / strandCount) * Math.PI * 2 + rand(-0.3, 0.3);
            const dist = rand(2, scatterRadius);
            const endX = baseRepoX + Math.cos(angle) * dist;
            const endY = repoY + Math.sin(angle) * dist * 0.5;

            // Vary the bundle path slightly per strand
            const bundleJitter = rand(-15, 15);
            const catJitter = rand(-8, 8);

            // Create endpoint scatter dots
            const dotCount = Math.floor(rand(2, 6));
            const endDots: FlowStrand["endDots"] = [];
            for (let d = 0; d < dotCount; d++) {
              const dAngle = rand(0, Math.PI * 2);
              const dDist = rand(3, scatterRadius * 0.8);
              endDots.push({
                x: baseRepoX + Math.cos(dAngle) * dDist,
                y: repoY + Math.sin(dAngle) * dDist * 0.5,
                r: rand(0.8, 2.5),
                alpha: rand(0.3, 0.9),
              });
            }

            strands.push({
              catIdx: ci,
              repoIdx: ri,
              color: cat.color,
              secondaryColor: secondary,
              catName: cat.name,
              repoName: repo.name,
              linesChanged: repo.linesChanged,
              isActive: repo.isActive,
              p0: {
                x: cx + rand(-3, 3),
                y: topY + rand(-2, 2),
              },
              cp1: {
                x: cx + (catX - cx) * 0.15 + bundleJitter,
                y: h * 0.18 + rand(-10, 10),
              },
              cp2: {
                x: catX + (endX - catX) * 0.5 + catJitter,
                y: h * 0.58 + rand(-10, 10),
              },
              p3: { x: endX, y: endY },
              width: 0.4 + activity * 1.2 + rand(0, 0.3),
              endDots: si === 0 ? endDots : [], // only first strand carries dots
            });
          }

          repoCounter++;
        });
      });

      strandsRef.current = strands;

      // Build dust particles
      const dust: DustParticle[] = [];
      for (let i = 0; i < DUST_COUNT; i++) {
        dust.push({
          strandIdx: Math.floor(Math.random() * strands.length),
          t: Math.random(),
          offset: rand(-12, 12),
          speed: 0.001 + Math.random() * 0.003,
          size: rand(0.5, 2.5),
          alpha: rand(0.2, 0.8),
        });
      }
      dustRef.current = dust;

      // Build text particles from "TOKAMAK" text
      buildTextParticles(w, h * TOP_Y, strands);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categories]
  );

  /* ── Text to particles ──────────────────────────── */

  const buildTextParticles = useCallback(
    (canvasW: number, centerY: number, strands: FlowStrand[]) => {
      const offscreen = document.createElement("canvas");
      const oscW = 600;
      const oscH = 120;
      offscreen.width = oscW;
      offscreen.height = oscH;
      const octx = offscreen.getContext("2d");
      if (!octx) return;

      // Render text onto offscreen canvas
      octx.fillStyle = "#fff";
      octx.font = `900 ${TEXT_FONT_SIZE}px 'Orbitron', sans-serif`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText("TOKAMAK", oscW / 2, oscH / 2);

      // Scan pixels to extract particle positions
      const imageData = octx.getImageData(0, 0, oscW, oscH);
      const data = imageData.data;
      const particles: TextParticle[] = [];

      const offsetX = canvasW / 2 - oscW / 2;
      const offsetY = centerY - oscH / 2;

      for (let y = 0; y < oscH; y += TEXT_PARTICLE_DENSITY) {
        for (let x = 0; x < oscW; x += TEXT_PARTICLE_DENSITY) {
          const idx = (y * oscW + x) * 4;
          const alpha = data[idx + 3]; // alpha channel
          if (alpha > 128) {
            const tx = x + offsetX;
            const ty = y + offsetY;
            particles.push({
              tx,
              ty,
              // Start from random scattered positions
              x: tx + rand(-300, 300),
              y: ty + rand(-200, 200),
              vx: 0,
              vy: 0,
              size: rand(1, 2.5),
              alpha: rand(0.5, 1),
              dripping: false,
              dripT: 0,
              dripStrandIdx: Math.floor(Math.random() * Math.max(1, strands.length)),
            });
          }
        }
      }

      textParticlesRef.current = particles;
      textBuiltRef.current = true;
    },
    []
  );

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
    const strands = strandsRef.current;
    const dust = dustRef.current;
    const mouse = mouseRef.current;
    const time = Date.now() * 0.001;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    // Determine hovered category
    let hoveredCat = -1;
    const catCenterY = h * CAT_Y;
    if (
      Math.abs(mouse.y - catCenterY) < h * 0.2 &&
      mouse.x > 0 &&
      mouse.x < w
    ) {
      let minDist = Infinity;
      const catCenters = new Map<number, number[]>();
      strands.forEach((s) => {
        const pt = bezier(s.p0, s.cp1, s.cp2, s.p3, 0.4);
        if (!catCenters.has(s.catIdx)) catCenters.set(s.catIdx, []);
        catCenters.get(s.catIdx)!.push(pt.x);
      });
      catCenters.forEach((xs, idx) => {
        const avgX = xs.reduce((a, b) => a + b, 0) / xs.length;
        const d = Math.abs(mouse.x - avgX);
        if (d < minDist && d < 120) {
          minDist = d;
          hoveredCat = idx;
        }
      });
    }
    hoveredCatRef.current = hoveredCat;

    const revealT = Math.min(progress * 1.5, 1);

    // ── Draw strands with glow ─────────────────────

    strands.forEach((strand) => {
      const isHovered = hoveredCat === -1 || hoveredCat === strand.catIdx;
      const baseAlpha = isHovered ? 0.6 : 0.04;
      const [r1, g1, b1] = hexToRgb(strand.color);
      const [r2, g2, b2] = hexToRgb(strand.secondaryColor);

      const steps = 80;
      const maxStep = Math.floor(revealT * steps);
      if (maxStep < 2) return;

      // Draw glow layer first (wider, softer)
      if (isHovered && strand.isActive) {
        ctx.beginPath();
        const gFirst = bezier(strand.p0, strand.cp1, strand.cp2, strand.p3, 0);
        ctx.moveTo(gFirst.x, gFirst.y);
        for (let s = 1; s <= maxStep; s++) {
          const t = s / steps;
          const pt = bezier(strand.p0, strand.cp1, strand.cp2, strand.p3, t);
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = `rgba(${r1}, ${g1}, ${b1}, ${baseAlpha * 0.15})`;
        ctx.lineWidth = strand.width + 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }

      // Draw the main strand with gradient color shift along path
      // Use small segments for color transition
      for (let s = 0; s < maxStep - 1; s++) {
        const t1 = s / steps;
        const t2 = (s + 1) / steps;
        const pt1 = bezier(strand.p0, strand.cp1, strand.cp2, strand.p3, t1);
        const pt2 = bezier(strand.p0, strand.cp1, strand.cp2, strand.p3, t2);

        // Color shifts from primary to secondary along the path
        const colorT = t1;
        const [cr, cg, cb] = lerpColor([r1, g1, b1], [r2, g2, b2], colorT * 0.6);

        // Fade alpha near start (bundled) and at tip
        let segAlpha = baseAlpha;
        if (t1 < 0.1) segAlpha *= t1 / 0.1;
        if (t1 > 0.9) segAlpha *= (1 - t1) / 0.1;

        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${segAlpha})`;
        ctx.lineWidth = strand.width;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    });

    // ── Draw endpoint scatter dots ───────────────────

    if (revealT > 0.75) {
      const dotAlpha = Math.min((revealT - 0.75) / 0.25, 1);

      strands.forEach((strand) => {
        const isHovered = hoveredCat === -1 || hoveredCat === strand.catIdx;
        if (!isHovered && hoveredCat !== -1) return;

        const [r, g, b] = hexToRgb(strand.color);
        const [r2, g2, b2] = hexToRgb(strand.secondaryColor);

        // Scatter dots at endpoint
        strand.endDots.forEach((dot) => {
          const pulse = Math.sin(time * 2 + dot.x * 0.1) * 0.3 + 0.7;
          const a = dot.alpha * dotAlpha * pulse * (isHovered ? 1 : 0.3);
          const useSecondary = Math.random() > 0.5;
          const [dr, dg, db] = useSecondary ? [r2, g2, b2] : [r, g, b];

          // Glow
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.r + 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dr}, ${dg}, ${db}, ${a * 0.15})`;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dr}, ${dg}, ${db}, ${a})`;
          ctx.fill();
        });

        // Active endpoint core glow
        if (strand.isActive && strand.endDots.length > 0) {
          const pulse = Math.sin(time * 3 + strand.p3.x * 0.05) * 0.3 + 0.7;
          const a = dotAlpha * pulse * (isHovered ? 1 : 0.2);

          // Large outer glow
          ctx.beginPath();
          ctx.arc(strand.p3.x, strand.p3.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.08})`;
          ctx.fill();

          // Core bright dot
          ctx.beginPath();
          ctx.arc(strand.p3.x, strand.p3.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.6})`;
          ctx.fill();
        }
      });
    }

    // ── Draw category labels ────────────────────────

    if (revealT > 0.35) {
      const labelAlpha = Math.min((revealT - 0.35) / 0.2, 1);
      const drawnCats = new Set<number>();

      strands.forEach((strand) => {
        if (drawnCats.has(strand.catIdx)) return;
        drawnCats.add(strand.catIdx);

        const pt = bezier(strand.p0, strand.cp1, strand.cp2, strand.p3, 0.42);
        const catStrands = strands.filter(
          (s) => s.catIdx === strand.catIdx
        );
        const avgX =
          catStrands.reduce(
            (s, l) => s + bezier(l.p0, l.cp1, l.cp2, l.p3, 0.42).x,
            0
          ) / catStrands.length;

        const isHovered =
          hoveredCat === -1 || hoveredCat === strand.catIdx;
        const a = isHovered ? labelAlpha : labelAlpha * 0.15;
        const [r, g, b] = hexToRgb(strand.color);

        // Convergence node glow
        const nodeGlow = Math.sin(time * 2 + strand.catIdx) * 0.2 + 0.8;
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(avgX, pt.y, 18 * nodeGlow, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.06})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(avgX, pt.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.12})`;
          ctx.fill();
        }

        // Core node dot
        ctx.beginPath();
        ctx.arc(avgX, pt.y, isHovered ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.9})`;
        ctx.fill();

        // Bright center
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(avgX, pt.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.9})`;
          ctx.fill();
        }

        // Category name
        ctx.font = "700 15px 'Orbitron', sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.fillText(strand.catName.toUpperCase(), avgX, pt.y - 20);

        // Repo count
        const uniqueRepos = new Set(
          catStrands.map((s) => s.repoName)
        ).size;
        ctx.font = "400 13px sans-serif";
        ctx.fillStyle = `rgba(200, 200, 200, ${a * 0.5})`;
        ctx.fillText(`${uniqueRepos} repos`, avgX, pt.y + 26);
      });
    }

    // ── Draw repo labels at bottom ───────────────────

    if (revealT > 0.8) {
      const labelAlpha = Math.min((revealT - 0.8) / 0.2, 1);

      // Collect unique repos with their positions
      const repoPositions = new Map<
        string,
        { x: number; y: number; color: string; lc: number; catIdx: number; isActive: boolean }
      >();

      strands.forEach((strand) => {
        if (repoPositions.has(strand.repoName)) return;
        repoPositions.set(strand.repoName, {
          x: strand.p3.x,
          y: strand.p3.y,
          color: strand.color,
          lc: strand.linesChanged,
          catIdx: strand.catIdx,
          isActive: strand.isActive,
        });
      });

      repoPositions.forEach((info, name) => {
        const isHovered =
          hoveredCat === -1 || hoveredCat === info.catIdx;

        // Show all labels when hovering, or only active top repos when not hovering
        if (hoveredCat === -1 && !info.isActive) return;

        const a = isHovered ? labelAlpha : labelAlpha * 0.08;
        if (a < 0.05) return;

        const [r, g, b] = hexToRgb(info.color);

        ctx.save();
        ctx.translate(info.x, info.y + 18);
        ctx.rotate(Math.PI / 5.5);
        ctx.font = "600 12px 'Orbitron', sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.85})`;
        ctx.fillText(name, 0, 0);
        if (info.lc > 0) {
          ctx.font = "400 11px sans-serif";
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.6})`;
          ctx.fillText(
            ` ${formatNum(info.lc)}`,
            ctx.measureText(name).width + 4,
            0
          );
        }
        ctx.restore();
      });
    }

    // ── Draw particle typography origin ─────────────

    if (textBuiltRef.current && strands.length > 0) {
      const topPt = strands[0].p0;
      const textParts = textParticlesRef.current;

      // Background glow behind text area
      const glowGrad = ctx.createRadialGradient(
        topPt.x, topPt.y, 0,
        topPt.x, topPt.y, 180
      );
      glowGrad.addColorStop(0, "rgba(0, 119, 255, 0.08)");
      glowGrad.addColorStop(0.5, "rgba(0, 60, 180, 0.03)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.beginPath();
      ctx.arc(topPt.x, topPt.y, 180, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Update and render each text particle
      textParts.forEach((p) => {
        if (p.dripping) {
          // Particle is dripping down into a strand
          const strand = strands[p.dripStrandIdx];
          if (!strand) return;
          p.dripT += 0.008;
          if (p.dripT > 1) {
            // Reset: return to text
            p.dripping = false;
            p.dripT = 0;
            p.x = p.tx + rand(-200, 200);
            p.y = p.ty + rand(-150, 150);
            return;
          }
          const pt = bezier(strand.p0, strand.cp1, strand.cp2, strand.p3, p.dripT * 0.3);
          const [sr, sg, sb] = hexToRgb(strand.color);
          const da = (1 - p.dripT) * 0.7;

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb}, ${da})`;
          ctx.fill();
          return;
        }

        // Mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_REPEL_RADIUS && mDist > 0) {
          const force = (MOUSE_REPEL_RADIUS - mDist) / MOUSE_REPEL_RADIUS * MOUSE_REPEL_FORCE;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        // Return to target position (spring)
        const dxT = p.tx - p.x;
        const dyT = p.ty - p.y;
        p.vx += dxT * PARTICLE_RETURN_SPEED;
        p.vy += dyT * PARTICLE_RETURN_SPEED;

        // Friction
        p.vx *= 0.85;
        p.vy *= 0.85;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Random drip: particle falls into a strand
        if (Math.random() < DRIP_CHANCE && revealT > 0.3) {
          p.dripping = true;
          p.dripT = 0;
          p.dripStrandIdx = Math.floor(Math.random() * strands.length);
        }

        // Distance from target (for glow intensity)
        const distFromTarget = Math.sqrt(dxT * dxT + dyT * dyT);
        const isDisplaced = distFromTarget > 5;

        // Neon glow layer (multiple shadow passes)
        if (!isDisplaced) {
          // Settled particles: blue neon glow
          const flicker = Math.sin(time * 3 + p.tx * 0.05 + p.ty * 0.07) * 0.15 + 0.85;
          const a = p.alpha * flicker * 0.9;

          // Outer glow
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 150, 255, ${a * 0.1})`;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 200, 255, ${a})`;
          ctx.fill();

          // Bright center
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 240, 255, ${a * 0.8})`;
          ctx.fill();
        } else {
          // Displaced particles: whiter, scattered look
          const a = p.alpha * 0.6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(150, 210, 255, ${a})`;
          ctx.fill();
        }
      });

      // Subtitle below the text
      ctx.font = "400 13px 'Orbitron', sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(100, 160, 220, 0.5)";
      ctx.fillText("N E T W O R K", topPt.x, topPt.y + TEXT_FONT_SIZE / 2 + 20);
    }

    // ── Draw dust particles ──────────────────────────

    if (revealT > 0.05) {
      dust.forEach((p) => {
        if (p.t > revealT) return;

        const strand = strands[p.strandIdx];
        if (!strand) return;

        const isHovered =
          hoveredCat === -1 || hoveredCat === strand.catIdx;
        if (!isHovered && hoveredCat !== -1) return;

        const pt = bezier(strand.p0, strand.cp1, strand.cp2, strand.p3, p.t);
        const tan = bezierTangent(
          strand.p0,
          strand.cp1,
          strand.cp2,
          strand.p3,
          p.t
        );

        // Perpendicular offset
        const len = Math.sqrt(tan.x * tan.x + tan.y * tan.y) || 1;
        const nx = -tan.y / len;
        const ny = tan.x / len;

        const px = pt.x + nx * p.offset;
        const py = pt.y + ny * p.offset;

        const [r1, g1, b1] = hexToRgb(strand.color);
        const [r2, g2, b2] = hexToRgb(strand.secondaryColor);
        const colorMix = p.t;
        const [cr, cg, cb] = lerpColor(
          [r1, g1, b1],
          [r2, g2, b2],
          colorMix * 0.5
        );

        const flicker = Math.sin(time * 4 + p.t * 20 + p.offset) * 0.3 + 0.7;
        const a = p.alpha * flicker * (isHovered ? 0.7 : 0.15);

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${a})`;
        ctx.fill();

        // Update particle position
        p.t += p.speed;
        if (p.t > revealT) {
          p.t = 0;
          p.strandIdx = Math.floor(Math.random() * strands.length);
          p.offset = rand(-12, 12);
        }
      });
    }

    ctx.restore();
  }, []);

  /* ── Animation loop ────────────────────────────── */

  const loop = useCallback(() => {
    if (visibleRef.current) {
      render();
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [render]);

  /* ── Setup ─────────────────────────────────────── */

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.clientWidth;
      const h = CANVAS_HEIGHT;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      setCanvasWidth(w);
      buildLayout(w, h);

      if (motionQuery.matches) {
        progressRef.current = 1;
        render();
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Visibility
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    // Scroll progress
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const viewH = window.innerHeight;
      const raw = (viewH - rect.top) / (viewH + rect.height);
      progressRef.current = Math.max(0, Math.min(1, raw));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Mouse
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
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    if (!motionQuery.matches) {
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      resizeObserver.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", handleScroll);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [buildLayout, render, loop]);

  return (
    <div ref={containerRef} className="w-full max-w-[1280px] px-6">
      <canvas
        ref={canvasRef}
        className="w-full cursor-crosshair"
        style={{ height: CANVAS_HEIGHT }}
      />
    </div>
  );
}
