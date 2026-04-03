"use client";

import { useEffect, useRef, useState } from "react";
import type { FlowCategory } from "./index";

interface NetworkGraphProps {
  categories: FlowCategory[];
  totalRepos: number;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

interface Pulse {
  nodeIndex: number;
  progress: number; // 0 to 1
  startTime: number;
  duration: number;
  size: number;
  brightness: number;
}

interface CategoryNode {
  x: number;
  y: number;
  radius: number;
  color: string;
  name: string;
  linesChanged: number;
  topRepo: string;
  repoCount: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function NetworkGraph({ categories, totalRepos }: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pulsesRef = useRef<Pulse[]>([]);
  const startTimeRef = useRef<number>(Date.now());
  const isVisibleRef = useRef<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    // Resize handler
    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    // Intersection observer for performance
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    // Calculate node positions and sizes
    const isMobile = window.innerWidth < 768;
    const canvasWidth = canvas.width / dpr;
    const canvasHeight = canvas.height / dpr;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const centerRadius = 45;
    const orbitRadius = isMobile ? 120 : 180;

    // Calculate node sizes based on linesChanged
    const allLinesChanged = categories.map((cat) =>
      cat.repos.reduce((sum, repo) => sum + repo.linesChanged, 0)
    );
    const maxLines = Math.max(...allLinesChanged, 1);
    const minLines = Math.min(...allLinesChanged.filter((l) => l > 0), 0);

    const nodes: CategoryNode[] = categories.map((cat, i) => {
      const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
      const totalLines = cat.repos.reduce(
        (sum, repo) => sum + repo.linesChanged,
        0
      );
      const normalizedSize =
        totalLines > 0
          ? (totalLines - minLines) / (maxLines - minLines)
          : 0;
      const radius = 18 + normalizedSize * 20; // 18-38px

      const topRepo =
        cat.repos.length > 0
          ? cat.repos.reduce((prev, curr) =>
              curr.linesChanged > prev.linesChanged ? curr : prev
            ).name
          : "—";

      return {
        x: centerX + Math.cos(angle) * orbitRadius,
        y: centerY + Math.sin(angle) * orbitRadius,
        radius,
        color: cat.color,
        name: cat.name,
        linesChanged: totalLines,
        topRepo,
        repoCount: cat.repos.length,
      };
    });

    // Initialize pulses
    const initializePulses = () => {
      pulsesRef.current = [];
      for (let i = 0; i < categories.length; i++) {
        // 2-3 pulses per line
        const pulseCount = 2 + Math.floor(Math.random());
        for (let j = 0; j < pulseCount; j++) {
          pulsesRef.current.push({
            nodeIndex: i,
            progress: (j / pulseCount) + Math.random() * 0.1,
            startTime: Date.now() - Math.random() * 3000,
            duration: 2500 + Math.random() * 1000,
            size: 2.5 + Math.random() * 1,
            brightness: 0.7 + Math.random() * 0.3,
          });
        }
      }
    };

    initializePulses();

    // Mouse move handler for hover
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Adjust for orbit rotation
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const rotationAngle = (elapsed / 120) * Math.PI * 2;

      let foundNode: number | null = null;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2 + rotationAngle;
        const nodeX = centerX + Math.cos(angle) * orbitRadius;
        const nodeY = centerY + Math.sin(angle) * orbitRadius;
        const dist = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
        if (dist <= node.radius * 1.5) {
          foundNode = i;
          break;
        }
      }
      setHoveredNode(foundNode);
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;

      // Clear canvas
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Orbit rotation (1 full rotation per 120 seconds)
      const rotationAngle = (elapsed / 120) * Math.PI * 2;

      // Draw inter-node connections (faint structural lines)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const angle1 = (i / categories.length) * Math.PI * 2 - Math.PI / 2 + rotationAngle;
        const angle2 = ((i + 1) / categories.length) * Math.PI * 2 - Math.PI / 2 + rotationAngle;
        const x1 = centerX + Math.cos(angle1) * orbitRadius;
        const y1 = centerY + Math.sin(angle1) * orbitRadius;
        const x2 = centerX + Math.cos(angle2) * orbitRadius;
        const y2 = centerY + Math.sin(angle2) * orbitRadius;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Draw connection lines from center to nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2 + rotationAngle;
        const nodeX = centerX + Math.cos(angle) * orbitRadius;
        const nodeY = centerY + Math.sin(angle) * orbitRadius;

        const opacity = hoveredNode === i ? 0.4 : 0.2;
        const rgb = hexToRgb(node.color);
        ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nodeX, nodeY);
        ctx.stroke();
      }

      // Update and draw pulses
      pulsesRef.current = pulsesRef.current.filter((pulse) => {
        const pulseElapsed = now - pulse.startTime;
        pulse.progress = pulseElapsed / pulse.duration;

        if (pulse.progress >= 1) {
          // Respawn pulse
          pulse.startTime = now;
          pulse.progress = 0;
          pulse.duration = 2500 + Math.random() * 1000;
          pulse.size = 2.5 + Math.random() * 1;
          pulse.brightness = 0.7 + Math.random() * 0.3;
        }

        const node = nodes[pulse.nodeIndex];
        const angle = (pulse.nodeIndex / categories.length) * Math.PI * 2 - Math.PI / 2 + rotationAngle;
        const nodeX = centerX + Math.cos(angle) * orbitRadius;
        const nodeY = centerY + Math.sin(angle) * orbitRadius;

        const pulseX = centerX + (nodeX - centerX) * pulse.progress;
        const pulseY = centerY + (nodeY - centerY) * pulse.progress;

        const rgb = hexToRgb(node.color);
        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${pulse.brightness})`;
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, pulse.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      // Maintain max 30 pulses
      if (pulsesRef.current.length > 30) {
        pulsesRef.current = pulsesRef.current.slice(-30);
      }

      // Draw center node (Tokamak)
      const breathScale = 0.97 + Math.sin(elapsed * 2) * 0.03;
      const breathOpacity = 0.3 + Math.sin(elapsed * 2) * 0.1;

      // Glow
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        centerRadius * breathScale * 2
      );
      gradient.addColorStop(0, `rgba(0, 119, 255, ${breathOpacity})`);
      gradient.addColorStop(1, "rgba(0, 119, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(
        centerX - centerRadius * 2,
        centerY - centerRadius * 2,
        centerRadius * 4,
        centerRadius * 4
      );

      // Center circle
      ctx.fillStyle = "#0077ff";
      ctx.beginPath();
      ctx.arc(centerX, centerY, centerRadius * breathScale, 0, Math.PI * 2);
      ctx.fill();

      // Center label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px 'Orbitron', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("TOKAMAK", centerX, centerY);

      // Draw category nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const angle = (i / categories.length) * Math.PI * 2 - Math.PI / 2 + rotationAngle;
        const nodeX = centerX + Math.cos(angle) * orbitRadius;
        const nodeY = centerY + Math.sin(angle) * orbitRadius;

        const isHovered = hoveredNode === i;
        const scale = isHovered ? 1.3 : 1;
        const glowIntensity = isHovered ? 0.4 : 0.2;

        // Node glow
        const rgb = hexToRgb(node.color);
        const nodeGradient = ctx.createRadialGradient(
          nodeX,
          nodeY,
          0,
          nodeX,
          nodeY,
          node.radius * scale * 2
        );
        nodeGradient.addColorStop(
          0,
          `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${glowIntensity})`
        );
        nodeGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = nodeGradient;
        ctx.fillRect(
          nodeX - node.radius * 2,
          nodeY - node.radius * 2,
          node.radius * 4,
          node.radius * 4
        );

        // Node circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, node.radius * scale, 0, Math.PI * 2);
        ctx.fill();

        // Node labels
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px 'Orbitron', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(node.name, nodeX, nodeY + node.radius * scale + 8);

        ctx.fillStyle = "#9ca3af";
        ctx.font = "9px 'Orbitron', sans-serif";
        ctx.fillText(formatNum(node.linesChanged), nodeX, nodeY + node.radius * scale + 22);

        // Hover tooltip
        if (isHovered) {
          const tooltipY = nodeY - node.radius * scale - 35;
          const tooltipX = nodeX;

          ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
          ctx.fillRect(tooltipX - 60, tooltipY, 120, 30);

          ctx.strokeStyle = node.color;
          ctx.lineWidth = 1;
          ctx.strokeRect(tooltipX - 60, tooltipY, 120, 30);

          ctx.fillStyle = "#ffffff";
          ctx.font = "9px 'Orbitron', sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.fillText(`${node.repoCount} repos`, tooltipX, tooltipY + 4);
          ctx.fillStyle = "#9ca3af";
          ctx.font = "8px 'Orbitron', sans-serif";
          ctx.fillText(
            node.topRepo.length > 18 ? node.topRepo.slice(0, 18) + "..." : node.topRepo,
            tooltipX,
            tooltipY + 16
          );
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [categories, hoveredNode]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[1200px] mx-auto"
      style={{ willChange: "transform" }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-[300px] md:h-[500px]"
      />
    </div>
  );
}
