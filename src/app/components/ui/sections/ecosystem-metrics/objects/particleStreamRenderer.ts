import type { Object3DRenderer } from "./types";

/**
 * Code Changes — Downward particle stream (80 particles)
 * Continuous flow with tails, hover accelerates + flashes
 */
export function createParticleStreamRenderer(): Object3DRenderer {
  const count = 80;

  // Initialize particles with random positions in a column
  const particles = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 60,
    y: (Math.random() - 0.5) * 100,
    speed: 0.3 + Math.random() * 0.7,
    size: 0.8 + Math.random() * 1.5,
    alpha: 0.3 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
    isGreen: Math.random() > 0.5,
  }));

  return {
    render(rc) {
      const { ctx, card, time, hoverT } = rc;
      const cx = card.x + card.w / 2;
      const cy = card.y + card.h / 2;
      const halfH = card.h * 0.4;
      const alpha = 0.4 + hoverT * 0.15;
      const speedMul = 1 + hoverT * 1.5;

      ctx.save();

      for (const p of particles) {
        // Update position (downward flow)
        p.y += p.speed * speedMul;

        // Wrap around
        if (p.y > halfH) {
          p.y = -halfH;
          p.x = (Math.random() - 0.5) * 60;
        }

        // Horizontal drift
        const drift = Math.sin(time * 0.5 + p.phase) * 3;
        const px = cx + p.x + drift;
        const py = cy + p.y;

        // Fade at edges
        const edgeFade = 1 - Math.abs(p.y) / halfH;
        const a = alpha * p.alpha * edgeFade;

        const color = p.isGreen ? "#22c55e" : "#0077ff";
        const glowColor = p.isGreen ? "#22c55e" : "#00ddff";

        // Flash effect on hover
        const flash = hoverT > 0 ? Math.sin(time * 8 + p.phase) * 0.3 * hoverT : 0;

        // Glow
        ctx.globalAlpha = a * 0.3 + flash;
        ctx.fillStyle = glowColor;
        ctx.beginPath();
        ctx.arc(px, py, p.size + 2, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.globalAlpha = a + flash;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Tail (2 segments up)
        for (let t = 1; t <= 2; t++) {
          const ty = py - t * 4;
          const ta = a * (1 - t / 3);
          ctx.globalAlpha = ta;
          ctx.beginPath();
          ctx.arc(px, ty, p.size * (1 - t * 0.2), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    },
  };
}
