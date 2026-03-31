"use client";

import { useRef, useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
}

interface Props {
  color: string;
  active: boolean;
}

export default function ParticleOverlay({ color, active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const visibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Parse hex color to RGB
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const spawn = () => {
      if (particlesRef.current.length > 80) return;
      const side = Math.random();
      let x: number, y: number, vx: number, vy: number;

      if (side < 0.5) {
        // Rise from bottom
        x = Math.random() * W();
        y = H() + 10;
        vx = (Math.random() - 0.5) * 0.4;
        vy = -(0.3 + Math.random() * 0.8);
      } else {
        // Drift from sides
        x = Math.random() < 0.5 ? -10 : W() + 10;
        y = Math.random() * H();
        vx = x < 0 ? 0.3 + Math.random() * 0.5 : -(0.3 + Math.random() * 0.5);
        vy = (Math.random() - 0.5) * 0.3;
      }

      particlesRef.current.push({
        x,
        y,
        vx,
        vy,
        size: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6,
        decay: 0.001 + Math.random() * 0.003,
      });
    };

    let frame = 0;
    const animate = () => {
      if (!visibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const w = W();
      const h = H();
      ctx.clearRect(0, 0, w, h);

      if (active && frame % 3 === 0) {
        spawn();
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;
        if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) return false;

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        grad.addColorStop(0, `rgba(${r},${g},${b},${p.alpha * 0.8})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${p.alpha * 0.2})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(p.x - p.size * 4, p.y - p.size * 4, p.size * 8, p.size * 8);

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();

        return true;
      });

      frame++;
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
  }, [color, active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
