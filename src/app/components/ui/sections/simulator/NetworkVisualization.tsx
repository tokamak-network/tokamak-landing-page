"use client";

import { useEffect, useRef } from "react";

const NODE_COUNT = 12;
const ANIMATION_SPEED = 0.001;

interface Node {
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  readonly speed: number;
  readonly offset: number;
}

function createNodes(): readonly Node[] {
  return Array.from({ length: NODE_COUNT }, (_, i) => ({
    x: 0.15 + Math.random() * 0.7,
    y: 0.15 + Math.random() * 0.7,
    radius: 3 + Math.random() * 3,
    speed: 0.3 + Math.random() * 0.7,
    offset: (i * Math.PI * 2) / NODE_COUNT,
  }));
}

export default function NetworkVisualization({
  isDeploying,
}: {
  readonly isDeploying: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<readonly Node[]>(createNodes());
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    function animate() {
      if (!canvas || !ctx) return;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const time = frameRef.current * ANIMATION_SPEED;
      frameRef.current += 1;

      const nodes = nodesRef.current;
      const positions = nodes.map((node) => ({
        x: (node.x + Math.sin(time * node.speed + node.offset) * 0.03) * width,
        y:
          (node.y + Math.cos(time * node.speed + node.offset) * 0.03) * height,
        radius: node.radius,
      }));

      // Draw connections
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.min(width, height) * 0.4;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isDeploying ? 0.4 : 0.15);
            ctx.beginPath();
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[j].x, positions[j].y);
            ctx.strokeStyle = isDeploying
              ? `rgba(0, 120, 255, ${alpha})`
              : `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const pos of positions) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDeploying
          ? "rgba(0, 120, 255, 0.6)"
          : "rgba(255, 255, 255, 0.3)";
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, pos.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = isDeploying
          ? "rgba(0, 120, 255, 0.1)"
          : "rgba(255, 255, 255, 0.05)";
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    });

    resizeObserver.observe(canvas);
    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [isDeploying]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
