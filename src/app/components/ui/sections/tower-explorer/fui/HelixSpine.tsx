"use client";

import { useRef, useEffect } from "react";

interface Props {
  scrollProgress: number; // 0–1
  color?: string;
}

/**
 * Central DNA-like double helix spine drawn with Canvas.
 * Rotates and glows based on scroll progress.
 */
export default function HelixSpine({ scrollProgress, color = "#00e5ff" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const timeRef = useRef(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Parse color
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const animate = () => {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.008;

      const cx = w / 2;
      const numNodes = 40;
      const spacing = h / (numNodes - 1);
      const amplitude = Math.min(w * 0.12, 60);
      const twist = scrollProgress * Math.PI * 6 + timeRef.current;

      // Draw connections between strands
      for (let i = 0; i < numNodes; i++) {
        const t = i / (numNodes - 1);
        const y = i * spacing;
        const phase = twist + t * Math.PI * 4;
        const x1 = cx + Math.sin(phase) * amplitude;
        const x2 = cx + Math.sin(phase + Math.PI) * amplitude;

        // Cross connection every 4 nodes
        if (i % 4 === 0) {
          const alpha = 0.15 + Math.abs(Math.sin(phase)) * 0.15;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw strand 1
      ctx.beginPath();
      for (let i = 0; i < numNodes; i++) {
        const t = i / (numNodes - 1);
        const y = i * spacing;
        const phase = twist + t * Math.PI * 4;
        const x = cx + Math.sin(phase) * amplitude;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},0.6)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw strand 2
      ctx.beginPath();
      for (let i = 0; i < numNodes; i++) {
        const t = i / (numNodes - 1);
        const y = i * spacing;
        const phase = twist + t * Math.PI * 4 + Math.PI;
        const x = cx + Math.sin(phase) * amplitude;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},0.4)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw nodes (glowing dots at intersections)
      for (let i = 0; i < numNodes; i++) {
        const t = i / (numNodes - 1);
        const y = i * spacing;
        const phase = twist + t * Math.PI * 4;

        // Strand 1 nodes
        const x1 = cx + Math.sin(phase) * amplitude;
        const depth1 = (Math.sin(phase) + 1) / 2; // 0-1, used for size/brightness
        const size1 = 2 + depth1 * 3;
        const alpha1 = 0.3 + depth1 * 0.5;

        // Glow
        const grad1 = ctx.createRadialGradient(x1, y, 0, x1, y, size1 * 4);
        grad1.addColorStop(0, `rgba(${r},${g},${b},${alpha1 * 0.5})`);
        grad1.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad1;
        ctx.fillRect(x1 - size1 * 4, y - size1 * 4, size1 * 8, size1 * 8);

        // Core dot
        ctx.beginPath();
        ctx.arc(x1, y, size1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha1})`;
        ctx.fill();

        // Strand 2 nodes
        const x2 = cx + Math.sin(phase + Math.PI) * amplitude;
        const depth2 = (Math.sin(phase + Math.PI) + 1) / 2;
        const size2 = 2 + depth2 * 3;
        const alpha2 = 0.3 + depth2 * 0.5;

        const grad2 = ctx.createRadialGradient(x2, y, 0, x2, y, size2 * 4);
        grad2.addColorStop(0, `rgba(${r},${g},${b},${alpha2 * 0.5})`);
        grad2.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad2;
        ctx.fillRect(x2 - size2 * 4, y - size2 * 4, size2 * 8, size2 * 8);

        ctx.beginPath();
        ctx.arc(x2, y, size2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha2})`;
        ctx.fill();
      }

      // Center glow line
      const centerGrad = ctx.createLinearGradient(cx, 0, cx, h);
      centerGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      centerGrad.addColorStop(0.3, `rgba(${r},${g},${b},0.05)`);
      centerGrad.addColorStop(0.5, `rgba(${r},${g},${b},0.08)`);
      centerGrad.addColorStop(0.7, `rgba(${r},${g},${b},0.05)`);
      centerGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = centerGrad;
      ctx.fillRect(cx - 1, 0, 2, h);

      rafRef.current = requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 },
    );
    io.observe(canvas);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [color, scrollProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute left-1/2 -translate-x-1/2 top-0 h-full pointer-events-none"
      style={{ width: "200px", zIndex: 10 }}
    />
  );
}
