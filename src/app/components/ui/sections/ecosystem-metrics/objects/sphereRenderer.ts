import type { Object3DRenderer, Vec3 } from "./types";
import { rotateX, rotateY, project, vec3 } from "./math";

/**
 * Market Cap — Wireframe sphere with breathing animation
 * 16 meridians x 8 parallels, radius oscillates 35-42
 */
export function createSphereRenderer(): Object3DRenderer {
  const meridians = 16;
  const parallels = 8;

  // Generate unit sphere vertices for meridians and parallels
  function buildSphere(radius: number): { meridianPaths: Vec3[][]; parallelPaths: Vec3[][] } {
    const meridianPaths: Vec3[][] = [];
    const parallelPaths: Vec3[][] = [];

    // Meridians (longitude lines)
    for (let i = 0; i < meridians; i++) {
      const lon = (i / meridians) * Math.PI * 2;
      const path: Vec3[] = [];
      for (let j = 0; j <= parallels * 2; j++) {
        const lat = (j / (parallels * 2)) * Math.PI - Math.PI / 2;
        path.push(
          vec3(
            radius * Math.cos(lat) * Math.cos(lon),
            radius * Math.sin(lat),
            radius * Math.cos(lat) * Math.sin(lon),
          ),
        );
      }
      meridianPaths.push(path);
    }

    // Parallels (latitude lines)
    for (let j = 1; j < parallels; j++) {
      const lat = (j / parallels) * Math.PI - Math.PI / 2;
      const path: Vec3[] = [];
      const steps = 32;
      for (let i = 0; i <= steps; i++) {
        const lon = (i / steps) * Math.PI * 2;
        path.push(
          vec3(
            radius * Math.cos(lat) * Math.cos(lon),
            radius * Math.sin(lat),
            radius * Math.cos(lat) * Math.sin(lon),
          ),
        );
      }
      parallelPaths.push(path);
    }

    return { meridianPaths, parallelPaths };
  }

  return {
    render(rc) {
      const { ctx, card, time, hoverT } = rc;
      const cx = card.x + card.w / 2;
      const cy = card.y + card.h / 2;
      const sc = Math.min(card.w, card.h) / 120;
      const alpha = 0.4 + hoverT * 0.15;

      // Breathing radius
      const breath = Math.sin(time * 0.8) * 0.5 + 0.5; // 0-1
      const radius = 35 + breath * 7 + hoverT * 5;

      const { meridianPaths, parallelPaths } = buildSphere(radius);

      const angleY = time * 0.15;
      const angleX = 0.3;

      ctx.save();
      ctx.strokeStyle = "#0077ff";
      ctx.lineWidth = 0.6;

      const drawPath = (path: Vec3[]) => {
        const pts = path.map((v) => {
          let p = rotateX(v, angleX);
          p = rotateY(p, angleY);
          return project(p, cx, cy, sc);
        });

        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) {
          const pt = pts[i];
          ctx.globalAlpha = alpha * pt.depth * 0.7;
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      };

      meridianPaths.forEach(drawPath);
      parallelPaths.forEach(drawPath);

      ctx.restore();
    },
  };
}
