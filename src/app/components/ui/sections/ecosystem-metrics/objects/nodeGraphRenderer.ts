import type { Object3DRenderer, Vec3 } from "./types";
import { rotateY, rotateZ, project, vec3 } from "./math";

/**
 * Active Projects — Icosahedron graph (12 vertices, 30 edges)
 * Y+Z axis tumble, hover pulses nodes
 */
export function createNodeGraphRenderer(): Object3DRenderer {
  // Icosahedron vertices
  const phi = (1 + Math.sqrt(5)) / 2;
  const s = 30; // scale

  const rawVerts: Vec3[] = [
    vec3(-1, phi, 0),
    vec3(1, phi, 0),
    vec3(-1, -phi, 0),
    vec3(1, -phi, 0),
    vec3(0, -1, phi),
    vec3(0, 1, phi),
    vec3(0, -1, -phi),
    vec3(0, 1, -phi),
    vec3(phi, 0, -1),
    vec3(phi, 0, 1),
    vec3(-phi, 0, -1),
    vec3(-phi, 0, 1),
  ].map((v) => {
    const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    return vec3((v.x / len) * s, (v.y / len) * s, (v.z / len) * s);
  });

  // Icosahedron edges (30 edges from 20 faces)
  const faces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (const [a, b, c] of faces) {
    const pairs: [number, number][] = [[a, b], [b, c], [a, c]];
    for (const [p, q] of pairs) {
      const key = `${Math.min(p, q)}-${Math.max(p, q)}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push([p, q]);
      }
    }
  }

  return {
    render(rc) {
      const { ctx, card, time, hoverT } = rc;
      const cx = card.x + card.w / 2;
      const cy = card.y + card.h / 2;
      const sc = Math.min(card.w, card.h) / 120;
      const alpha = 0.4 + hoverT * 0.15;

      const angleY = time * 0.2;
      const angleZ = time * 0.12;

      // Project vertices
      const projected = rawVerts.map((v) => {
        let p = rotateY(v, angleY);
        p = rotateZ(p, angleZ);
        return project(p, cx, cy, sc);
      });

      ctx.save();

      // Draw edges
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 0.7;

      for (const [a, b] of edges) {
        const pa = projected[a];
        const pb = projected[b];
        ctx.globalAlpha = alpha * ((pa.depth + pb.depth) / 2) * 0.7;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      // Draw nodes
      for (let i = 0; i < projected.length; i++) {
        const pt = projected[i];
        const pulse = hoverT > 0
          ? 1 + Math.sin(time * 4 + i * 0.8) * 0.3 * hoverT
          : 1;
        const nodeSize = 2.5 * pulse * pt.depth;

        // Glow
        ctx.globalAlpha = alpha * pt.depth * 0.3;
        ctx.fillStyle = "#a855f7";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, nodeSize + 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.globalAlpha = alpha * pt.depth;
        ctx.fillStyle = "#c084fc";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    },
  };
}
