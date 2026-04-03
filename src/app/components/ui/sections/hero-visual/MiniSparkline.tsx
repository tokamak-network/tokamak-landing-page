"use client";

import { useEffect, useRef, useCallback } from "react";

interface MiniSparklineProps {
  data?: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Phase offset to differentiate multiple sparklines (0-1) */
  phase?: number;
}

export default function MiniSparkline({
  width = 100,
  height = 24,
  color = "#22c55e",
  phase = 0,
}: MiniSparklineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const bufRef = useRef<number[]>([]);
  const tRef = useRef(phase * 1000); // time offset by phase

  // Initialize buffer with a gentle upward ramp + noise
  const initBuffer = useCallback(() => {
    const BUF = Math.ceil(width * 2);
    const buf: number[] = [];
    for (let i = 0; i < BUF; i++) {
      // Start low-left, end high-right
      const frac = i / BUF;
      const base = 0.25 + frac * 0.45; // ramp from 0.25 → 0.70
      const noise =
        Math.sin(frac * Math.PI * 6 + phase * 7) * 0.08 +
        Math.sin(frac * Math.PI * 14 + phase * 3) * 0.04;
      buf.push(Math.max(0.05, Math.min(0.95, base + noise)));
    }
    bufRef.current = buf;
  }, [width, phase]);

  useEffect(() => {
    initBuffer();
  }, [initBuffer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // How often (in ms) we shift the buffer left and push a new point
    const SHIFT_INTERVAL = 60; // ~16 pixels/sec scroll speed
    let lastShift = 0;

    const draw = (now: number) => {
      tRef.current = now + phase * 5000;
      const t = tRef.current;
      const buf = bufRef.current;
      if (buf.length === 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Shift buffer and append new upward-trending point
      if (now - lastShift > SHIFT_INTERVAL) {
        lastShift = now;
        buf.shift();

        // New point: base on previous tail (the rightmost value) + small upward bias + noise
        const prev = buf[buf.length - 1] ?? 0.5;
        const wobble =
          Math.sin(t * 0.003) * 0.03 +
          Math.sin(t * 0.0071) * 0.02 +
          Math.sin(t * 0.013) * 0.01;
        const upBias = 0.004; // slight upward drift per tick
        let next = prev + upBias + wobble;

        // Soft clamp: when value gets too high, gently pull it back down
        // (creates natural "consolidation" dips before resuming upward)
        if (next > 0.82) {
          next -= (next - 0.82) * 0.15; // dampening above 0.82
        }
        // When it reaches near top, do a sharper correction to mid-range
        if (next > 0.92) {
          next = 0.55 + Math.random() * 0.1; // reset to mid, simulating a natural pullback
        }
        // Floor
        if (next < 0.15) {
          next = 0.15 + Math.random() * 0.05;
        }

        buf.push(next);
      }

      // Draw
      ctx.clearRect(0, 0, width, height);

      const len = buf.length;
      const step = width / (len - 1);
      const margin = height * 0.08;
      const usable = height - margin * 2;

      // Gradient fill
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, color + "4D"); // 30% opacity
      grad.addColorStop(1, color + "00"); // 0% opacity

      // Line path
      ctx.beginPath();
      for (let i = 0; i < len; i++) {
        const x = i * step;
        const y = margin + (1 - buf[i]) * usable;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      // Stroke
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();

      // Fill area below line
      ctx.lineTo((len - 1) * step, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(rafRef.current);
  }, [width, height, color, phase, initBuffer]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height, display: "block" }}
    />
  );
}
