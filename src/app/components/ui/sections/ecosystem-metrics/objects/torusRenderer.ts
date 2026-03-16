import type { Object3DRenderer, Vec3 } from "./types";
import { rotateX, rotateY, project, vec3 } from "./math";

/**
 * TON Price — Rotating torus wireframe
 * R=40 (major), r=12 (minor), 24x12 segments
 */
export function createTorusRenderer(): Object3DRenderer {
  const R = 40;
  const r = 12;
  const segsU = 24;
  const segsV = 12;

  // Pre-compute torus vertices
  const verts: Vec3[] = [];
  for (let i = 0; i <= segsU; i++) {
    const u = (i / segsU) * Math.PI * 2;
    for (let j = 0; j <= segsV; j++) {
      const v = (j / segsV) * Math.PI * 2;
      verts.push(
        vec3(
          (R + r * Math.cos(v)) * Math.cos(u),
          (R + r * Math.cos(v)) * Math.sin(u),
          r * Math.sin(v),
        ),
      );
    }
  }

  // Build edge index pairs (along u and v)
  const edges: [number, number][] = [];
  for (let i = 0; i < segsU; i++) {
    for (let j = 0; j < segsV; j++) {
      const a = i * (segsV + 1) + j;
      const b = a + 1;
      const c = (i + 1) * (segsV + 1) + j;
      edges.push([a, b]); // along v
      edges.push([a, c]); // along u
    }
  }

  return {
    render(rc) {
      const { ctx, card, time, hoverT } = rc;
      const cx = card.x + card.w / 2;
      const cy = card.y + card.h / 2;
      const sc = Math.min(card.w, card.h) / 120;
      const speed = 0.3 + hoverT * 0.5;
      const angleY = time * speed;
      const angleX = 0.4;
      const alpha = 0.4 + hoverT * 0.15;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "#0077ff";
      ctx.lineWidth = 0.8;

      // Project all vertices
      const projected = verts.map((v) => {
        let p = rotateX(v, angleX);
        p = rotateY(p, angleY);
        return project(p, cx, cy, sc);
      });

      // Draw edges
      for (const [a, b] of edges) {
        const pa = projected[a];
        const pb = projected[b];
        const depthAlpha = (pa.depth + pb.depth) / 2;
        ctx.globalAlpha = alpha * depthAlpha * 0.7;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      ctx.restore();
    },
  };
}
