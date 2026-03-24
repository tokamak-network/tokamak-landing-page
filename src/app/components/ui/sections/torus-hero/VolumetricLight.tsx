"use client";

import { useEffect, useRef } from "react";

/**
 * Plasma Aurora Curtain — aurora wave bundles projected from actual 3D torus
 * ring positions using the same camera/perspective as the Three.js scene.
 * Projection uses viewport dimensions (not 280vh canvas) to match Three.js exactly.
 */

const WAVE_COUNT = 7;
const CURTAIN_COPIES = 6;

// ── Three.js camera & torus constants (must match TorusScene) ──
const CAM_POS = [0, -1, 6] as const;
const CAM_TARGET = [0, 0, 0] as const;
const CAM_FOV = 55;
const TORUS_CENTER_Y = 2.2;
const TORUS_RADIUS = 3.5;

// ── View matrix vectors (precomputed) ──
const fwd = (() => {
  const dx = CAM_TARGET[0] - CAM_POS[0];
  const dy = CAM_TARGET[1] - CAM_POS[1];
  const dz = CAM_TARGET[2] - CAM_POS[2];
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  return [dx / len, dy / len, dz / len];
})();
const right = (() => {
  // cross(fwd, worldUp=[0,1,0]) = [-fz, 0, fx]
  const x = -fwd[2], z = fwd[0];
  const len = Math.sqrt(x * x + z * z);
  return [x / len, 0, z / len];
})();
const up = [
  right[1] * fwd[2] - right[2] * fwd[1],
  right[2] * fwd[0] - right[0] * fwd[2],
  right[0] * fwd[1] - right[1] * fwd[0],
];
const tanHalfFov = Math.tan((CAM_FOV / 2) * (Math.PI / 180));

/** Project 3D world point → pixel coords using viewport dimensions */
function projectToPixels(
  px: number, py: number, pz: number,
  vw: number, vh: number, // viewport width/height in px
) {
  const rx = px - CAM_POS[0];
  const ry = py - CAM_POS[1];
  const rz = pz - CAM_POS[2];

  const vz = rx * fwd[0] + ry * fwd[1] + rz * fwd[2];
  if (vz < 0.01) return null;

  const vx = rx * right[0] + ry * right[1] + rz * right[2];
  const vy = rx * up[0] + ry * up[1] + rz * up[2];

  const aspect = vw / vh;
  const ndcX = vx / (vz * tanHalfFov * aspect);
  const ndcY = -vy / (vz * tanHalfFov);

  return {
    x: (ndcX * 0.5 + 0.5) * vw,
    y: (ndcY * 0.5 + 0.5) * vh,
    depth: vz,
  };
}

interface Wave {
  frequency: number;
  amplitude: number;
  speed: number;
  phase: number;
  opacity: number;
  width: number;
  hue: number;
  lightness: number;
}

const waves: Wave[] = [
  { frequency: 0.003, amplitude: 120, speed: 0.008, phase: 0, opacity: 0.07, width: 350, hue: 220, lightness: 55 },
  { frequency: 0.005, amplitude: 80, speed: 0.012, phase: 1.2, opacity: 0.09, width: 220, hue: 225, lightness: 50 },
  { frequency: 0.004, amplitude: 100, speed: 0.006, phase: 2.5, opacity: 0.12, width: 160, hue: 215, lightness: 60 },
  { frequency: 0.007, amplitude: 60, speed: 0.015, phase: 0.8, opacity: 0.10, width: 120, hue: 230, lightness: 45 },
  { frequency: 0.006, amplitude: 90, speed: 0.010, phase: 3.7, opacity: 0.14, width: 80, hue: 218, lightness: 55 },
  { frequency: 0.009, amplitude: 40, speed: 0.018, phase: 1.9, opacity: 0.08, width: 200, hue: 235, lightness: 50 },
  { frequency: 0.008, amplitude: 50, speed: 0.014, phase: 4.2, opacity: 0.11, width: 100, hue: 222, lightness: 58 },
];


export default function VolumetricLight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0, vh: 0 }); // w, h = canvas; vh = viewport height
  const rotationRef = useRef(0);
  const lastFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { w: rect.width, h: rect.height, vh: window.innerHeight };
    };

    resize();
    window.addEventListener("resize", resize);
    lastFrameRef.current = performance.now();

    const animate = (now: number) => {
      const { w, h, vh } = sizeRef.current;
      if (w === 0) { animRef.current = requestAnimationFrame(animate); return; }

      const delta = Math.min((now - lastFrameRef.current) / 1000, 0.1);
      lastFrameRef.current = now;
      rotationRef.current += 0.15 * delta;
      const rotation = rotationRef.current;

      timeRef.current += 1;
      const t = timeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Project torus center (using viewport dimensions for correct projection)
      const torusProj = projectToPixels(0, TORUS_CENTER_Y, 0, w, vh);
      const tcx = torusProj ? torusProj.x : w / 2;
      const tcy = torusProj ? torusProj.y : vh * 0.18;
      const refDepth = torusProj ? torusProj.depth : 6.5;

      // ── Soft ambient glow under torus ──
      const coneGrd = ctx.createRadialGradient(tcx, tcy, w * 0.05, tcx, tcy + h * 0.3, h * 0.9);
      coneGrd.addColorStop(0, "rgba(42, 114, 229, 0.08)");
      coneGrd.addColorStop(0.3, "rgba(42, 114, 229, 0.04)");
      coneGrd.addColorStop(0.6, "rgba(42, 114, 229, 0.01)");
      coneGrd.addColorStop(1, "transparent");
      ctx.fillStyle = coneGrd;
      ctx.fillRect(0, 0, w, h);

      // ── Continuous glow fill connecting all ring points ──
      const glowPoints: { x: number; y: number }[] = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2 + rotation;
        const p = projectToPixels(
          TORUS_RADIUS * Math.cos(a), TORUS_CENTER_Y, TORUS_RADIUS * Math.sin(a),
          w, vh,
        );
        if (p) glowPoints.push({ x: p.x, y: p.y });
      }
      if (glowPoints.length > 2) {
        ctx.beginPath();
        ctx.moveTo(glowPoints[0].x, glowPoints[0].y);
        for (const gp of glowPoints) ctx.lineTo(gp.x, gp.y);
        ctx.lineTo(glowPoints[glowPoints.length - 1].x, h);
        ctx.lineTo(glowPoints[0].x, h);
        ctx.closePath();

        const fillGrd = ctx.createLinearGradient(0, tcy, 0, tcy + h * 0.6);
        fillGrd.addColorStop(0, "rgba(42, 114, 229, 0.06)");
        fillGrd.addColorStop(0.15, "rgba(42, 114, 229, 0.035)");
        fillGrd.addColorStop(0.4, "rgba(42, 114, 229, 0.015)");
        fillGrd.addColorStop(0.7, "rgba(42, 114, 229, 0.005)");
        fillGrd.addColorStop(1, "transparent");
        ctx.fillStyle = fillGrd;
        ctx.fill();
      }

      // ── Aurora curtain copies at 3D-projected ring positions ──
      const copies: { ex: number; ey: number; depth: number; ci: number }[] = [];
      for (let ci = 0; ci < CURTAIN_COPIES; ci++) {
        const angle = (ci / CURTAIN_COPIES) * Math.PI * 2 + rotation;
        const p = projectToPixels(
          TORUS_RADIUS * Math.cos(angle), TORUS_CENTER_Y, TORUS_RADIUS * Math.sin(angle),
          w, vh,
        );
        if (p) copies.push({ ex: p.x, ey: p.y, depth: p.depth, ci });
      }
      copies.sort((a, b) => b.depth - a.depth); // back first (painter's order)

      for (const copy of copies) {
        const { ex: emitX, ey: emitY, depth, ci } = copy;

        const depthRatio = refDepth / depth;
        const depthDim = Math.min(depthRatio * depthRatio, 1.0);
        const perspectiveScale = depthRatio;
        const drift = (emitX - tcx) / w * 0.25;
        const copyPhaseOffset = ci * 1.3;

        // Start ribbons above emitY (hidden behind torus) so no hard edge visible
        const hideOffset = 40 * perspectiveScale;
        const startY = emitY - hideOffset;

        for (let wi = 0; wi < WAVE_COUNT; wi++) {
          const wave = waves[wi];
          const phase = wave.phase + t * wave.speed + copyPhaseOffset;

          ctx.beginPath();
          const steps = Math.ceil(h / 4);
          const totalDrop = h - startY;
          const bundleWidth = w * 0.10 * perspectiveScale;

          // Left edge
          for (let s = 0; s <= steps; s++) {
            const progress = s / steps;
            const y = startY + progress * totalDrop;
            const sf = 0.3 + progress * 0.7;
            const wo =
              Math.sin(y * wave.frequency + phase) * wave.amplitude * perspectiveScale * (0.3 + progress * 0.7) +
              Math.sin(y * wave.frequency * 1.7 + phase * 0.6) * wave.amplitude * 0.3 * progress * perspectiveScale;
            const d = drift * progress * w * 0.5;
            const x = emitX + d + wo - bundleWidth * sf * 0.5;
            if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          // Right edge
          for (let s = steps; s >= 0; s--) {
            const progress = s / steps;
            const y = startY + progress * totalDrop;
            const sf = 0.3 + progress * 0.7;
            const wo =
              Math.sin(y * wave.frequency + phase) * wave.amplitude * perspectiveScale * (0.3 + progress * 0.7) +
              Math.sin(y * wave.frequency * 1.7 + phase * 0.6) * wave.amplitude * 0.3 * progress * perspectiveScale;
            const rw = wave.width * perspectiveScale * (0.5 + progress * 0.5);
            const d = drift * progress * w * 0.5;
            const x = emitX + d + wo + rw - bundleWidth * sf * 0.5;
            ctx.lineTo(x, y);
          }

          ctx.closePath();
          const opMul = depthDim;
          // Fade: transparent at top (hidden behind torus) → peak at emitY → fade to bottom
          const fadeInEnd = hideOffset / totalDrop; // fraction where emitY sits
          const grd = ctx.createLinearGradient(0, startY, 0, h);
          grd.addColorStop(0, "transparent");
          grd.addColorStop(fadeInEnd * 0.5, `hsla(${wave.hue}, 80%, ${wave.lightness}%, ${wave.opacity * 0.5 * opMul})`);
          grd.addColorStop(fadeInEnd, `hsla(${wave.hue}, 80%, ${wave.lightness}%, ${wave.opacity * 1.8 * opMul})`);
          grd.addColorStop(fadeInEnd + 0.08, `hsla(${wave.hue}, 75%, ${wave.lightness}%, ${wave.opacity * 1.4 * opMul})`);
          grd.addColorStop(Math.min(fadeInEnd + 0.25, 0.95), `hsla(${wave.hue}, 70%, ${wave.lightness}%, ${wave.opacity * opMul})`);
          grd.addColorStop(Math.min(fadeInEnd + 0.5, 0.97), `hsla(${wave.hue}, 65%, ${wave.lightness}%, ${wave.opacity * 0.4 * opMul})`);
          grd.addColorStop(Math.min(fadeInEnd + 0.75, 0.98), `hsla(${wave.hue}, 60%, ${wave.lightness}%, ${wave.opacity * 0.1 * opMul})`);
          grd.addColorStop(1, "transparent");
          ctx.fillStyle = grd;
          ctx.fill();
        }
      }

      // ── Soft light mist between curtain bundles ──
      // Draw blurred gradient blobs between adjacent emitter positions
      for (let ci = 0; ci < CURTAIN_COPIES; ci++) {
        const a1 = (ci / CURTAIN_COPIES) * Math.PI * 2 + rotation;
        const a2 = ((ci + 1) / CURTAIN_COPIES) * Math.PI * 2 + rotation;
        const aMid = (a1 + a2) / 2;

        const p = projectToPixels(
          TORUS_RADIUS * Math.cos(aMid), TORUS_CENTER_Y, TORUS_RADIUS * Math.sin(aMid),
          w, vh,
        );
        if (!p) continue;

        const depthDim = Math.min((refDepth / p.depth) ** 2, 1);
        const mistW = w * 0.08 * (refDepth / p.depth);
        const mistH = vh * 0.5;

        // Slow vertical drift animation
        const yShift = Math.sin(t * 0.003 + ci * 2.1) * vh * 0.02;

        const mistGrd = ctx.createRadialGradient(
          p.x, p.y + mistH * 0.3 + yShift, 0,
          p.x, p.y + mistH * 0.3 + yShift, mistH * 0.6,
        );
        mistGrd.addColorStop(0, `rgba(42, 114, 229, ${0.04 * depthDim})`);
        mistGrd.addColorStop(0.3, `rgba(42, 114, 229, ${0.025 * depthDim})`);
        mistGrd.addColorStop(0.7, `rgba(42, 114, 229, ${0.01 * depthDim})`);
        mistGrd.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.ellipse(p.x, p.y + mistH * 0.3 + yShift, mistW, mistH * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = mistGrd;
        ctx.fill();
      }


      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-x-0 top-0 pointer-events-none"
      style={{ width: "100%", height: "280vh", zIndex: 10 }}
    />
  );
}
