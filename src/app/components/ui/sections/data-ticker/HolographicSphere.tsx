"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  Mesh,
  Points as ThreePoints,
  BufferGeometry,
  Float32BufferAttribute,
  AdditiveBlending,
  Group,
  CanvasTexture,
  DoubleSide,
  RepeatWrapping,
  SphereGeometry,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  Vector3,
  Color,
} from "three";

/* ══════════════════════════════════════════════
   Resize helper (same pattern as TorusScene)
   ══════════════════════════════════════════════ */
function ResizeHelper() {
  const { gl, camera } = useThree();
  useEffect(() => {
    const parent = gl.domElement.parentElement;
    if (!parent) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        gl.setSize(width, height);
        (camera as any).aspect = width / height;
        (camera as any).updateProjectionMatrix();
      }
    });
    obs.observe(parent);
    return () => obs.disconnect();
  }, [gl, camera]);
  return null;
}

/* ══════════════════════════════════════════════
   Hexagon grid outer shell — procedural texture
   ══════════════════════════════════════════════ */
function createHexTexture(): CanvasTexture {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;

  ctx.clearRect(0, 0, size, size);

  // Draw hex grid
  const hexR = 24;
  const hexH = hexR * Math.sqrt(3);
  ctx.strokeStyle = "rgba(0, 229, 255, 0.5)";
  ctx.lineWidth = 1;

  for (let row = -1; row < size / hexH + 1; row++) {
    for (let col = -1; col < size / (hexR * 1.5) + 1; col++) {
      const cx = col * hexR * 3;
      const cy = row * hexH + (col % 2 === 0 ? 0 : hexH / 2);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const x = cx + hexR * Math.cos(angle);
        const y = cy + hexR * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  const tex = new CanvasTexture(c);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
}

function HexShell() {
  const meshRef = useRef<Mesh>(null);
  const tex = useMemo(() => createHexTexture(), []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.06 * delta;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.15}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════
   Inner wireframe globe (lat/lon grid)
   ══════════════════════════════════════════════ */
function WireframeGlobe() {
  const ref = useRef<Group>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 0.1 * delta;
    }
  });

  return (
    <group ref={ref}>
      {/* Lat-lon wireframe */}
      <mesh>
        <sphereGeometry args={[1.3, 36, 18]} />
        <meshBasicMaterial
          color="#00e5ff"
          wireframe
          transparent
          opacity={0.18}
        />
      </mesh>
      {/* Solid dim inner sphere for subtle fill */}
      <mesh>
        <sphereGeometry args={[1.28, 32, 32]} />
        <meshBasicMaterial
          color="#041020"
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════
   Equator glow ring
   ══════════════════════════════════════════════ */
function EquatorRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.35, 1.42, 128]} />
      <meshBasicMaterial
        color="#00e5ff"
        transparent
        opacity={0.5}
        side={DoubleSide}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════
   Orbital rings (multiple concentric, with tick marks texture)
   ══════════════════════════════════════════════ */
function createRingTexture(): CanvasTexture {
  const w = 1024;
  const h = 16;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  // Main line
  ctx.strokeStyle = "rgba(0, 229, 255, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h / 2);
  ctx.lineTo(w, h / 2);
  ctx.stroke();

  // Tick marks
  ctx.strokeStyle = "rgba(0, 229, 255, 0.6)";
  ctx.lineWidth = 1;
  const tickCount = 120;
  for (let i = 0; i < tickCount; i++) {
    const x = (i / tickCount) * w;
    const isMajor = i % 10 === 0;
    const tickH = isMajor ? 6 : 3;
    ctx.beginPath();
    ctx.moveTo(x, h / 2 - tickH);
    ctx.lineTo(x, h / 2 + tickH);
    ctx.stroke();
  }

  const tex = new CanvasTexture(c);
  tex.wrapS = RepeatWrapping;
  return tex;
}

function OrbitalRings() {
  const groupRef = useRef<Group>(null);
  const ringTex = useMemo(() => createRingTexture(), []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.03 * delta;
    }
  });

  const rings = [
    { inner: 3.2, outer: 3.25, opacity: 0.3, color: "#00e5ff" },
    { inner: 3.5, outer: 3.53, opacity: 0.15, color: "#2a72e5" },
    { inner: 3.8, outer: 3.82, opacity: 0.08, color: "#00e5ff" },
    { inner: 4.1, outer: 4.12, opacity: 0.04, color: "#2a72e5" },
  ];

  return (
    <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
      {rings.map((r, i) => (
        <mesh key={i}>
          <ringGeometry args={[r.inner, r.outer, 256]} />
          <meshBasicMaterial
            color={r.color}
            transparent
            opacity={r.opacity}
            side={DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════
   Floating data panels — bar charts, binary, node graphs
   Rendered as canvas textures on small planes,
   positioned on the sphere surface, rotating with it
   ══════════════════════════════════════════════ */

function createBarChartTexture(): CanvasTexture {
  const w = 200;
  const h = 120;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  // Title
  ctx.font = "bold 10px monospace";
  ctx.fillStyle = "rgba(0, 229, 255, 0.8)";
  ctx.fillText("INDEX +3.4%", 8, 14);

  // Bars
  const barCount = 12;
  const barW = 10;
  const gap = 4;
  const baseY = h - 10;
  for (let i = 0; i < barCount; i++) {
    const barH = 15 + Math.random() * 60;
    const x = 8 + i * (barW + gap);
    ctx.fillStyle =
      i >= barCount - 3
        ? "rgba(0, 229, 255, 0.7)"
        : "rgba(42, 114, 229, 0.5)";
    ctx.fillRect(x, baseY - barH, barW, barH);
  }

  // Border frame
  ctx.strokeStyle = "rgba(0, 229, 255, 0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(2, 2, w - 4, h - 4);

  return new CanvasTexture(c);
}

function createBinaryTexture(): CanvasTexture {
  const w = 160;
  const h = 120;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  ctx.font = "10px monospace";
  const lines = [
    "010101  010101",
    "010101  010101",
    "3A4F    3A4F",
    "010101  0",
    "19C2    19C2",
    "3A4F",
    "010101  010101",
    "19C2    19C2",
  ];

  lines.forEach((line, i) => {
    const alpha = 0.4 + Math.random() * 0.4;
    ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
    ctx.fillText(line, 8, 16 + i * 13);
  });

  ctx.strokeStyle = "rgba(0, 229, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.strokeRect(2, 2, w - 4, h - 4);

  return new CanvasTexture(c);
}

function createNodeGraphTexture(): CanvasTexture {
  const w = 160;
  const h = 120;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  // Generate random nodes
  const nodes: { x: number; y: number }[] = [];
  for (let i = 0; i < 8; i++) {
    nodes.push({
      x: 20 + Math.random() * (w - 40),
      y: 20 + Math.random() * (h - 40),
    });
  }

  // Draw connections
  ctx.strokeStyle = "rgba(42, 114, 229, 0.4)";
  ctx.lineWidth = 1;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      if (Math.sqrt(dx * dx + dy * dy) < 80) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  nodes.forEach((n) => {
    ctx.fillStyle = "rgba(0, 229, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = "rgba(0, 229, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.strokeRect(2, 2, w - 4, h - 4);

  return new CanvasTexture(c);
}

function createSmallStatsTexture(): CanvasTexture {
  const w = 140;
  const h = 90;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);

  ctx.font = "bold 10px monospace";
  ctx.fillStyle = "rgba(0, 229, 255, 0.9)";
  const data = [
    "NNC: 145.22",
    "NET: 212.80",
    "BTC: 64,150",
  ];
  data.forEach((line, i) => {
    ctx.fillText(line, 8, 20 + i * 18);
  });

  // Mini chart line
  ctx.strokeStyle = "rgba(0, 229, 255, 0.6)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  const pts = [70, 65, 72, 58, 50, 55, 45, 48, 40];
  pts.forEach((y, i) => {
    const x = 8 + i * 14;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.strokeStyle = "rgba(0, 229, 255, 0.2)";
  ctx.strokeRect(2, 2, w - 4, h - 4);

  return new CanvasTexture(c);
}

interface DataPanelConfig {
  texture: CanvasTexture;
  position: [number, number, number];
  scale: [number, number, number];
}

function DataPanels() {
  const groupRef = useRef<Group>(null);

  const panels = useMemo<DataPanelConfig[]>(() => {
    return [
      // Left bar chart
      {
        texture: createBarChartTexture(),
        position: [-1.6, 0.6, 1.2] as [number, number, number],
        scale: [1.1, 0.7, 1] as [number, number, number],
      },
      // Right bar chart (smaller)
      {
        texture: createBarChartTexture(),
        position: [1.5, 0.8, 1.0] as [number, number, number],
        scale: [0.8, 0.5, 1] as [number, number, number],
      },
      // Left binary
      {
        texture: createBinaryTexture(),
        position: [-0.8, 0.9, 1.6] as [number, number, number],
        scale: [0.7, 0.55, 1] as [number, number, number],
      },
      // Right stats
      {
        texture: createSmallStatsTexture(),
        position: [1.7, 0.5, 0.7] as [number, number, number],
        scale: [0.7, 0.45, 1] as [number, number, number],
      },
      // Bottom-left node graph
      {
        texture: createNodeGraphTexture(),
        position: [-1.5, -0.5, 1.0] as [number, number, number],
        scale: [0.8, 0.6, 1] as [number, number, number],
      },
      // Bottom-right binary
      {
        texture: createBinaryTexture(),
        position: [0.9, -0.6, 1.4] as [number, number, number],
        scale: [0.65, 0.5, 1] as [number, number, number],
      },
      // Back-left node graph
      {
        texture: createNodeGraphTexture(),
        position: [-1.0, 0.2, -1.5] as [number, number, number],
        scale: [0.7, 0.5, 1] as [number, number, number],
      },
      // Back-right stats
      {
        texture: createSmallStatsTexture(),
        position: [1.2, -0.3, -1.2] as [number, number, number],
        scale: [0.6, 0.4, 1] as [number, number, number],
      },
    ];
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.06 * delta;
    }
  });

  return (
    <group ref={groupRef}>
      {panels.map((panel, i) => (
        <mesh key={i} position={panel.position} scale={panel.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={panel.texture}
            transparent
            opacity={0.75}
            side={DoubleSide}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════
   Surface particles (on hex shell)
   ══════════════════════════════════════════════ */
function SurfaceParticles() {
  const ref = useRef<ThreePoints>(null);

  const geo = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += 0.06 * delta;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#00e5ff"
        size={0.015}
        transparent
        opacity={0.4}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════
   Ambient dust
   ══════════════════════════════════════════════ */
function AmbientParticles() {
  const ref = useRef<ThreePoints>(null);
  const geo = useMemo(() => {
    const count = 150;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.015;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#2a72e5"
        size={0.012}
        transparent
        opacity={0.25}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════
   Core glow
   ══════════════════════════════════════════════ */
function CoreGlow() {
  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={2} color="#00e5ff" distance={10} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#2a72e5" distance={15} />
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.9} />
      </mesh>
    </>
  );
}

/* ══════════════════════════════════════════════
   Scene composition
   ══════════════════════════════════════════════ */
function SphereScene() {
  return (
    <>
      <ResizeHelper />
      <ambientLight intensity={0.05} />
      <CoreGlow />
      <WireframeGlobe />
      <EquatorRing />
      <HexShell />
      <DataPanels />
      <OrbitalRings />
      <SurfaceParticles />
      <AmbientParticles />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          intensity={2.0}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

/* ══════════════════════════════════════════════
   Exported client component
   ══════════════════════════════════════════════ */
export default function HolographicSphere() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0.3, 7], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <SphereScene />
      </Canvas>
    </div>
  );
}
