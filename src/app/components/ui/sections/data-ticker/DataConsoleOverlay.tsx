"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, RootState } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Mesh, CanvasTexture, RepeatWrapping, AdditiveBlending, DoubleSide, Group } from "three";
import { motion } from "framer-motion";

interface TickerItem {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  change?: string;
}

/* ═══════════════════════════════════════════════
   1. Holographic Sphere (R3F 3D)
   ═══════════════════════════════════════════════ */

/** Procedural hex grid texture for the sphere surface */
function createHexTexture(): CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Transparent base
  ctx.clearRect(0, 0, size, size);

  // Draw hex grid
  const hexR = 28;
  const hexH = hexR * Math.sqrt(3);

  ctx.strokeStyle = "rgba(0, 229, 255, 0.7)";
  ctx.lineWidth = 1.2;

  for (let row = -2; row < size / hexH + 2; row++) {
    for (let col = -2; col < size / (hexR * 1.5) + 2; col++) {
      const cx = col * hexR * 3 + (row % 2 === 0 ? 0 : hexR * 1.5);
      const cy = row * hexH;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = cx + hexR * Math.cos(angle);
        const hy = cy + hexR * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  // Add some bright nodes at hex centers
  ctx.fillStyle = "rgba(0, 229, 255, 0.5)";
  for (let row = 0; row < size / hexH; row++) {
    for (let col = 0; col < size / (hexR * 1.5); col++) {
      if (Math.random() > 0.85) {
        const cx = col * hexR * 3 + (row % 2 === 0 ? 0 : hexR * 1.5);
        const cy = row * hexH;
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
}

/** Rotating wireframe + hex sphere */
function HoloSphereMesh() {
  const groupRef = useRef<Group>(null!);
  const hexMeshRef = useRef<Mesh>(null);

  const hexTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return createHexTexture();
  }, []);

  useEffect(() => {
    return () => { hexTexture?.dispose(); };
  }, [hexTexture]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.12 * delta;
      groupRef.current.rotation.x += 0.03 * delta;
    }
  });

  if (!hexTexture) return null;

  return (
    <group ref={groupRef}>
      {/* Hex textured sphere — semi-transparent overlay that blends with bg sphere */}
      <mesh ref={hexMeshRef}>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshBasicMaterial
          map={hexTexture}
          transparent
          opacity={0.3}
          blending={AdditiveBlending}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Inner wireframe — subtle rotating grid visible through bg sphere */}
      <mesh scale={0.96}>
        <sphereGeometry args={[2.2, 20, 12]} />
        <meshBasicMaterial
          color="#00e5ff"
          wireframe
          transparent
          opacity={0.05}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Equator ring — adds moving ring on top of static bg */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.008, 8, 128]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.25}
          blending={AdditiveBlending}
        />
      </mesh>

      {/* Second ring (tilted) */}
      <mesh rotation={[Math.PI / 2.5, 0.4, 0]}>
        <torusGeometry args={[2.5, 0.006, 8, 128]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.15}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function HoloSphere() {
  const handleCreated = useCallback((state: RootState) => {
    const canvas = state.gl.domElement;
    const wrapper = canvas.parentElement;
    if (wrapper) {
      wrapper.style.position = "absolute";
      wrapper.style.top = "0";
      wrapper.style.left = "0";
      wrapper.style.width = "100%";
      wrapper.style.height = "100%";
    }
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
  }, []);

  return (
    <div
      className="absolute"
      style={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "clamp(250px, 35vw, 450px)",
        height: "clamp(250px, 35vw, 450px)",
        zIndex: 5,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        onCreated={handleCreated}
      >
        <HoloSphereMesh />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={1.5}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   2. Metric Panel — concept shot style
   ═══════════════════════════════════════════════ */

const CHAMFER = 14;
const CORNER_SIZE = 8; // FUI corner bracket length

function MetricPanel({
  item,
  index,
  side,
}: {
  item: TickerItem;
  index: number;
  side: "left" | "right";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1, ease: "easeOut" }}
      className="relative"
      style={{
        width: "clamp(170px, 16vw, 240px)",
        padding: "clamp(14px, 1.4vw, 22px) clamp(16px, 1.5vw, 22px)",
        background:
          "linear-gradient(180deg, rgba(4, 14, 28, 0.75) 0%, rgba(2, 8, 18, 0.7) 100%)",
        clipPath: `polygon(0 0, calc(100% - ${CHAMFER}px) 0, 100% ${CHAMFER}px, 100% 100%, 0 100%)`,
        backdropFilter: "blur(12px)",
        boxShadow:
          "0 4px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 229, 255, 0.06), inset 0 1px 0 rgba(0, 229, 255, 0.15)",
      }}
    >
      {/* SVG border + corner brackets + chamfer outline */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        style={{ zIndex: 1 }}
      >
        {/* Full border following chamfer shape */}
        <polygon
          points={`1,1 calc(100% - ${CHAMFER}px),1 100%,${CHAMFER + 1} 100%,100% 1,100%`}
          fill="none"
          stroke="rgba(0, 229, 255, 0.25)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {/* Bright top edge with glow */}
        <line
          x1="0"
          y1="1"
          x2={`calc(100% - ${CHAMFER}px)`}
          y2="1"
          stroke="rgba(0, 229, 255, 0.7)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {/* Chamfer diagonal bright edge */}
        <line
          x1={`calc(100% - ${CHAMFER}px)`}
          y1="1"
          x2="100%"
          y2={`${CHAMFER + 1}`}
          stroke="rgba(0, 229, 255, 0.5)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {/* Corner brackets — bottom-left */}
        <polyline
          points={`1,calc(100% - ${CORNER_SIZE}px) 1,100% ${CORNER_SIZE + 1},100%`}
          fill="none"
          stroke="rgba(0, 229, 255, 0.5)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {/* Corner brackets — bottom-right */}
        <polyline
          points={`calc(100% - ${CORNER_SIZE}px),100% 100%,100% 100%,calc(100% - ${CORNER_SIZE}px)`}
          fill="none"
          stroke="rgba(0, 229, 255, 0.5)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        {/* Corner brackets — top-left */}
        <polyline
          points={`${CORNER_SIZE + 1},1 1,1 1,${CORNER_SIZE + 1}`}
          fill="none"
          stroke="rgba(0, 229, 255, 0.5)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Top edge glow line (visible bloom above card) */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: -1,
          left: 0,
          right: CHAMFER,
          height: 2,
          background: "rgba(0, 229, 255, 0.5)",
          boxShadow:
            "0 0 8px rgba(0, 229, 255, 0.5), 0 0 20px rgba(0, 229, 255, 0.2)",
          zIndex: 3,
        }}
      />

      {/* Label */}
      <div
        className="uppercase font-bold tracking-wider"
        style={{
          fontSize: "clamp(9px, 0.8vw, 13px)",
          color: "rgba(0, 229, 255, 0.8)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.16em",
          paddingBottom: "clamp(6px, 0.6vw, 10px)",
          marginBottom: "clamp(6px, 0.6vw, 10px)",
          borderBottom: "1px solid rgba(0, 229, 255, 0.12)",
          position: "relative",
          zIndex: 2,
          textShadow: "0 0 6px rgba(0, 229, 255, 0.3)",
        }}
      >
        {item.label}
      </div>

      {/* Value */}
      <div
        className="font-bold"
        style={{
          fontSize: "clamp(24px, 2.8vw, 42px)",
          color: "#fff",
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: "0.02em",
          lineHeight: 1.1,
          textShadow:
            "0 0 20px rgba(0, 229, 255, 0.2), 0 0 40px rgba(0, 229, 255, 0.08)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {item.prefix}
        {item.value}
      </div>

      {/* Change indicator in brackets */}
      {item.change && (
        <div
          className="font-bold"
          style={{
            marginTop: "clamp(5px, 0.5vw, 8px)",
            fontSize: "clamp(10px, 0.9vw, 14px)",
            color: item.change.startsWith("+") ? "#22c55e" : "#ef4444",
            fontFamily: "'Share Tech Mono', monospace",
            position: "relative",
            zIndex: 2,
            textShadow: item.change.startsWith("+")
              ? "0 0 8px rgba(34, 197, 94, 0.4)"
              : "0 0 8px rgba(239, 68, 68, 0.4)",
          }}
        >
          [{item.change}]
        </div>
      )}

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 5%, rgba(0, 229, 255, 0.06) 50%, transparent 95%)",
            animation: "scanDown 8s linear infinite",
          }}
        />
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   4. Header Bar
   ═══════════════════════════════════════════════ */
function HeaderBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        }) + " UTC",
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="absolute z-20 flex items-center justify-center gap-4"
      style={{
        top: "clamp(40px, 8vh, 80px)",
        left: 0,
        right: 0,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          fontSize: "clamp(8px, 0.7vw, 11px)",
          color: "rgba(140, 200, 255, 0.5)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Live Data Console
        <span style={{ margin: "0 8px", opacity: 0.3 }}>|</span>
        System Status:{" "}
        <span style={{ color: "#22c55e" }}>Nominal</span>
      </span>
      <span
        style={{
          fontSize: "clamp(8px, 0.7vw, 11px)",
          color: "rgba(0, 229, 255, 0.4)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.1em",
        }}
      >
        {time}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   5. Bottom Ticker (carousel with shadow edges)
   ═══════════════════════════════════════════════ */

function TickerItemSpan({ item }: { item: TickerItem }) {
  return (
    <span
      className="inline-flex items-baseline gap-2 whitespace-nowrap shrink-0"
      style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "clamp(14px, 1.3vw, 20px)",
        padding: "0 clamp(12px, 1.2vw, 20px)",
      }}
    >
      <span
        style={{
          color: "#00e5ff",
          fontWeight: 700,
          textShadow: "0 0 8px rgba(0, 229, 255, 0.4)",
        }}
      >
        ${item.label}
      </span>
      <span
        style={{
          color: "#fff",
          fontWeight: 700,
          textShadow: "0 0 6px rgba(255, 255, 255, 0.15)",
        }}
      >
        {item.prefix}
        {item.value}
      </span>
      {item.change && (
        <span
          style={{
            color: item.change.startsWith("+") ? "#22c55e" : "#ef4444",
            fontWeight: 600,
            textShadow: item.change.startsWith("+")
              ? "0 0 8px rgba(34, 197, 94, 0.4)"
              : "0 0 8px rgba(239, 68, 68, 0.4)",
          }}
        >
          {item.change}
        </span>
      )}
      <span style={{ color: "rgba(255,255,255,0.08)", margin: "0 4px" }}>
        {"//"}
      </span>
    </span>
  );
}

function BottomTicker({ items }: { items: TickerItem[] }) {
  // Duplicate items once — animation translates -50% for seamless loop
  const doubled = [...items, ...items];

  const tickerHeight = "clamp(32px, 3.5vh, 48px)";

  const scrollContent = (
    <div className="flex items-center h-full animate-infinite-scroll w-max">
      {doubled.map((item, i) => (
        <TickerItemSpan key={`t-${i}`} item={item} />
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="absolute z-20"
      style={{
        bottom: "clamp(30px, 6vh, 70px)",
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        width: "clamp(500px, 70vw, 1000px)",
      }}
    >
      {/* Main ticker row */}
      <div
        className="relative"
        style={{
          height: tickerHeight,
          overflow: "hidden",
          borderTop: "1px solid rgba(0, 229, 255, 0.15)",
          borderBottom: "1px solid rgba(0, 229, 255, 0.08)",
        }}
      >
        {/* Left shadow fade */}
        <div
          className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{
            width: 100,
            background:
              "linear-gradient(90deg, rgba(3, 8, 16, 1) 0%, transparent 100%)",
          }}
        />
        {/* Right shadow fade */}
        <div
          className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
          style={{
            width: 100,
            background:
              "linear-gradient(270deg, rgba(3, 8, 16, 1) 0%, transparent 100%)",
          }}
        />
        {scrollContent}
      </div>

      {/* Floor reflection — flipped copy with gradient fade-out */}
      <div
        className="relative pointer-events-none"
        style={{
          height: tickerHeight,
          overflow: "hidden",
          transform: "scaleY(-1)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 80%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 80%)",
          opacity: 0.35,
        }}
      >
        {/* Duplicate the same scrolling content, flipped */}
        <div className="flex items-center h-full animate-infinite-scroll w-max">
          {doubled.map((item, i) => (
            <TickerItemSpan key={`r-${i}`} item={item} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Main Export
   ═══════════════════════════════════════════════ */
export default function DataConsoleOverlay({ items }: { items: TickerItem[] }) {
  const mid = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, mid);
  const rightItems = items.slice(mid);

  return (
    <div className="absolute inset-0">
      {/* Header bar */}
      <HeaderBar />

      {/* Central holographic sphere */}
      <HoloSphere />

      {/* Left metric panels */}
      <div
        className="absolute z-10 flex flex-col"
        style={{
          left: "clamp(20px, 8vw, 120px)",
          top: "50%",
          transform: "translateY(-50%)",
          gap: "clamp(8px, 1vw, 14px)",
        }}
      >
        {leftItems.map((item, i) => (
          <MetricPanel key={item.label} item={item} index={i} side="left" />
        ))}
      </div>

      {/* Right metric panels */}
      <div
        className="absolute z-10 flex flex-col"
        style={{
          right: "clamp(20px, 8vw, 120px)",
          top: "50%",
          transform: "translateY(-50%)",
          gap: "clamp(8px, 1vw, 14px)",
        }}
      >
        {rightItems.map((item, i) => (
          <MetricPanel
            key={item.label}
            item={item}
            index={i + mid}
            side="right"
          />
        ))}
      </div>

      {/* Bottom ticker carousel */}
      <BottomTicker items={items} />
    </div>
  );
}
