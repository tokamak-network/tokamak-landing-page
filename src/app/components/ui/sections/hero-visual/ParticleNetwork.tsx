"use client";

import { useEffect, useRef, useCallback } from "react";

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  speed: number;
  phase: number;
  brightness: number;
}

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const isVisibleRef = useRef(true);
  const lastMouseUpdate = useRef(0);
  const prefersReducedMotion = useRef(false);

  const initNodes = useCallback((width: number, height: number) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const nodeCount = isMobile ? 18 : 35;
    const nodes: Node[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const x = Math.random();
      const y = Math.random();
      nodes.push({
        x: x * width,
        y: y * height,
        baseX: x,
        baseY: y,
        radius: 3 + Math.random() * 5,
        speed: 0.0002 + Math.random() * 0.0003,
        phase: Math.random() * Math.PI * 2,
        brightness: 0.3 + Math.random() * 0.7,
      });
    }

    nodesRef.current = nodes;
  }, []);

  const drawNetwork = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number
  ) => {
    ctx.clearRect(0, 0, width, height);

    const nodes = nodesRef.current;
    const mouse = mouseRef.current;
    const connectionDistance = 150;

    // Update and draw nodes
    nodes.forEach((node) => {
      if (!prefersReducedMotion.current) {
        // Sinusoidal movement
        const offsetX = Math.sin(time * node.speed + node.phase) * 30;
        const offsetY = Math.cos(time * node.speed + node.phase * 1.5) * 30;
        node.x = node.baseX * width + offsetX;
        node.y = node.baseY * height + offsetY;
      } else {
        // Static position
        node.x = node.baseX * width;
        node.y = node.baseY * height;
      }

      // Mouse interaction
      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);
      const isNearMouse = distToMouse < 150;

      const scale = isNearMouse ? 1.5 : 1;
      const brightness = isNearMouse ? 1 : node.brightness;

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 119, 255, ${brightness})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const alpha = (1 - distance / connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 119, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastMouseUpdate.current < 16) return; // Throttle to ~60fps

    lastMouseUpdate.current = now;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check for reduced motion preference
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      prefersReducedMotion.current = mediaQuery.matches;
    }

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      initNodes(width, height);
    };

    resizeCanvas();

    // ResizeObserver for responsive sizing
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);

    // IntersectionObserver to pause when not visible
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    intersectionObserver.observe(canvas);

    // Animation loop
    const startTime = Date.now();
    const animate = (): void => {
      if (isVisibleRef.current) {
        const time = Date.now() - startTime;
        drawNetwork(ctx, width, height, time);
      }

      if (!prefersReducedMotion.current || isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    // Start animation only if motion is allowed
    if (!prefersReducedMotion.current) {
      animate();
    } else {
      // Render static frame
      drawNetwork(ctx, width, height, 0);
    }

    // Mouse events
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initNodes, drawNetwork, handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}
