import type { Object3DRenderer, Vec3 } from "./types";
import { rotateX, rotateY, rotateZ, project, vec3 } from "./math";

/**
 * Total Staked — 5 stacked tilted rings
 * Each ring rotates at different speed, hover spreads them apart
 */
export function createStackedRingsRenderer(): Object3DRenderer {
  const ringCount = 5;
  const segments = 48;
  const ringRadius = 35;

  // Pre-compute unit circle points
  const circlePoints: Vec3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    circlePoints.push(vec3(Math.cos(a) * ringRadius, 0, Math.sin(a) * ringRadius));
  }

  // Per-ring config: tilt, rotation speed, y offset
  const rings = Array.from({ length: ringCount }, (_, i) => ({
    tiltX: 0.15 + i * 0.08,
    tiltZ: (i - 2) * 0.06,
    speed: 0.2 + i * 0.08,
    baseY: (i - 2) * 8, // stacked spacing
  }));

  return {
    render(rc) {
      const { ctx, card, time, hoverT } = rc;
      const cx = card.x + card.w / 2;
      const cy = card.y + card.h / 2;
      const sc = Math.min(card.w, card.h) / 120;
      const alpha = 0.4 + hoverT * 0.15;

      // Hover spreads rings apart
      const spreadFactor = 1 + hoverT * 0.6;

      ctx.save();
      ctx.strokeStyle = "#0077ff";
      ctx.lineWidth = 0.8;

      for (const ring of rings) {
        const yOffset = ring.baseY * spreadFactor;
        const rotAngle = time * ring.speed;

        const pts = circlePoints.map((cp) => {
          let v = vec3(cp.x, cp.y + yOffset, cp.z);
          v = rotateX(v, ring.tiltX);
          v = rotateZ(v, ring.tiltZ);
          v = rotateY(v, rotAngle);
          return project(v, cx, cy, sc);
        });

        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          const pt = pts[i];
          ctx.globalAlpha = alpha * pt.depth * 0.8;
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      ctx.restore();
    },
  };
}
