import type { Object3DRenderer, Vec3 } from "./types";
import { rotateX, rotateY, project, vec3 } from "./math";

/**
 * Circulating Supply — Orbital ring with 16 particles + tails
 */
export function createOrbitRenderer(): Object3DRenderer {
  const particleCount = 16;
  const orbitRadius = 38;
  const segments = 64;
  const tailLength = 6;

  // Pre-compute orbit ring points
  const ringPoints: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    ringPoints.push(vec3(Math.cos(a) * orbitRadius, 0, Math.sin(a) * orbitRadius));
  }

  // Particle initial angles (evenly distributed with jitter)
  const particleAngles = Array.from({ length: particleCount }, (_, i) => {
    return (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
  });

  return {
    render(rc) {
      const { ctx, card, time, hoverT } = rc;
      const cx = card.x + card.w / 2;
      const cy = card.y + card.h / 2;
      const sc = Math.min(card.w, card.h) / 120;
      const alpha = 0.4 + hoverT * 0.15;

      const tiltX = 0.5;
      const rotY = time * 0.1;
      const orbitSpeed = 0.4 + hoverT * 0.4;

      ctx.save();

      // Draw orbit ring
      ctx.strokeStyle = "#0077ff";
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = alpha * 0.5;

      const ringPts = ringPoints.map((v) => {
        let p = rotateX(v, tiltX);
        p = rotateY(p, rotY);
        return project(p, cx, cy, sc);
      });

      ctx.beginPath();
      for (let i = 0; i < ringPts.length; i++) {
        if (i === 0) ctx.moveTo(ringPts[i].x, ringPts[i].y);
        else ctx.lineTo(ringPts[i].x, ringPts[i].y);
      }
      ctx.stroke();

      // Draw particles with tails
      for (let pi = 0; pi < particleCount; pi++) {
        const baseAngle = particleAngles[pi] + time * orbitSpeed;

        for (let t = 0; t <= tailLength; t++) {
          const angle = baseAngle - t * 0.08;
          const v = vec3(
            Math.cos(angle) * orbitRadius,
            0,
            Math.sin(angle) * orbitRadius,
          );
          let p = rotateX(v, tiltX);
          p = rotateY(p, rotY);
          const pt = project(p, cx, cy, sc);

          const tailFade = 1 - t / tailLength;
          const size = (2.5 - t * 0.3) * pt.depth;
          const a = alpha * tailFade * pt.depth;

          if (t === 0) {
            // Head particle - brighter
            ctx.globalAlpha = a;
            ctx.fillStyle = "#00ddff";
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
            ctx.fill();

            // Glow
            ctx.globalAlpha = a * 0.3;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, size + 3, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Tail particles
            ctx.globalAlpha = a * 0.6;
            ctx.fillStyle = "#0077ff";
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, Math.max(0.5, size), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
    },
  };
}
