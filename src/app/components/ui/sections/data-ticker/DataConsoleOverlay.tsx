"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import LazyWebGL from "../../LazyWebGL";
import { Canvas, useFrame, RootState } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Mesh, CanvasTexture, RepeatWrapping, AdditiveBlending, DoubleSide, Group } from "three";
import { motion } from "framer-motion";
import Link from "next/link";

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
   2. Metric Panel — Plasma Core style
   Radial glow, rotating conic ring, breathing animation
   ═══════════════════════════════════════════════ */

const plasmaKeyframes = `
@keyframes plasmaBreathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}
@keyframes plasmaRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;

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
      initial={{ opacity: 0, x: side === "left" ? -16 : 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.12, ease: "easeOut" }}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        width: "clamp(160px, 14vw, 210px)",
        height: "clamp(140px, 13vw, 180px)",
        borderRadius: 16,
        background: "radial-gradient(ellipse at center, rgba(42, 114, 229, 0.3) 0%, rgba(42, 114, 229, 0.05) 40%, transparent 70%)",
        animation: "plasmaBreathe 3s ease-in-out infinite",
        animationDelay: `${index * 0.4}s`,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: plasmaKeyframes }} />

      {/* Rotating conic energy ring (glow behind card) */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: -2,
          borderRadius: 16,
          background: "conic-gradient(from 0deg, #2A72E5, #00e5ff, #2A72E5)",
          opacity: 0.4,
          filter: "blur(8px)",
          animation: "plasmaRotate 4s linear infinite",
          zIndex: 0,
        }}
      />

      {/* Inner solid fill */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 2,
          borderRadius: 14,
          background: "#050a14",
          zIndex: 0,
        }}
      />

      {/* Value */}
      <div
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(18px, 1.8vw, 28px)",
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1.1,
          marginBottom: 8,
          position: "relative",
          zIndex: 1,
          textShadow:
            "0 0 10px rgba(42, 114, 229, 1), 0 0 20px rgba(42, 114, 229, 0.8), 0 0 40px rgba(42, 114, 229, 0.6), 0 0 60px rgba(42, 114, 229, 0.4)",
        }}
      >
        {item.prefix}
        {item.value}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: "clamp(8px, 0.65vw, 11px)",
          color: "#7a8ca8",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          position: "relative",
          zIndex: 1,
        }}
      >
        {item.label}
      </div>

      {/* Change indicator */}
      {item.change && (
        <div
          style={{
            marginTop: 4,
            fontSize: "clamp(10px, 0.85vw, 13px)",
            fontWeight: 700,
            color: item.change.startsWith("+") ? "#00ff88" : "#ef4444",
            fontFamily: "'Share Tech Mono', monospace",
            position: "relative",
            zIndex: 1,
            textShadow: item.change.startsWith("+")
              ? "0 0 8px rgba(0, 255, 136, 0.4)"
              : "0 0 8px rgba(239, 68, 68, 0.4)",
          }}
        >
          {item.change}
        </div>
      )}
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
      <Link
        href="/about/reports"
        style={{
          fontSize: "clamp(8px, 0.7vw, 11px)",
          color: "rgba(0, 229, 255, 0.5)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          textDecoration: "none",
          borderLeft: "1px solid rgba(0, 229, 255, 0.15)",
          paddingLeft: 12,
          transition: "color 0.2s, text-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#00e5ff";
          e.currentTarget.style.textShadow = "0 0 8px rgba(0, 229, 255, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(0, 229, 255, 0.5)";
          e.currentTarget.style.textShadow = "none";
        }}
      >
        Biweekly Reports &rarr;
      </Link>
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
        bottom: "clamp(20px, 4vh, 50px)",
        left: "clamp(20px, 8vw, 120px)",
        right: "clamp(20px, 8vw, 120px)",
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
   Mobile Overlay — simplified, no 3D
   ═══════════════════════════════════════════════ */

function DataConsoleMobileOverlay({ items }: { items: TickerItem[] }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between py-8 px-5 gap-4">
      {/* Title */}
      <div className="flex flex-col items-center gap-1">
        <div
          style={{
            fontSize: 10,
            color: "rgba(140, 200, 255, 0.5)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          System Status: <span style={{ color: "#22c55e" }}>Nominal</span>
        </div>
        <div
          style={{
            fontSize: 16,
            color: "#00e5ff",
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textShadow: "0 0 14px rgba(0, 229, 255, 0.5)",
          }}
        >
          Live Data Console
        </div>
        <Link
          href="/about/reports"
          style={{
            fontSize: 9,
            color: "rgba(0, 229, 255, 0.5)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textDecoration: "none",
            marginTop: 4,
          }}
        >
          Biweekly Reports &rarr;
        </Link>
      </div>

      {/* Metrics 2-column grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-xs flex-1 content-start">
        {items.map((item) => (
          <div
            key={item.label}
            className="relative flex flex-col items-center justify-center py-3 px-2"
            style={{
              background: "rgba(5, 10, 20, 0.85)",
              border: "1px solid rgba(42, 114, 229, 0.25)",
              borderRadius: 8,
              minHeight: 72,
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute pointer-events-none"
              style={{
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(42, 114, 229, 0.6), rgba(0, 229, 255, 0.4), rgba(42, 114, 229, 0.6))",
                borderRadius: "8px 8px 0 0",
              }}
            />
            <div
              style={{
                fontSize: 9,
                color: "rgba(140, 200, 255, 0.6)",
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 4,
                textAlign: "center",
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#fff",
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 900,
                lineHeight: 1,
                textShadow:
                  "0 0 8px rgba(42, 114, 229, 0.8), 0 0 20px rgba(42, 114, 229, 0.4)",
              }}
            >
              {item.prefix}
              {item.value}
            </div>
            {item.change && (
              <div
                style={{
                  marginTop: 3,
                  fontSize: 10,
                  fontWeight: 700,
                  color: item.change.startsWith("+") ? "#00ff88" : "#ef4444",
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                {item.change}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom ticker — works on mobile as-is */}
      <div className="w-full">
        <BottomTicker items={items} />
      </div>
    </div>
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
      {/* ── Mobile layout (below md) ── */}
      <div className="block md:hidden w-full h-full">
        <DataConsoleMobileOverlay items={items} />
      </div>

      {/* ── Desktop layout (md and above) ── */}
      <div className="hidden md:block w-full h-full">
        <div className="absolute inset-0">
          {/* Header bar */}
          <HeaderBar />

          {/* Bottom fade — blend into black below */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-30"
            style={{
              height: "22%",
              background:
                "linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.2) 70%, transparent 100%)",
            }}
          />

          {/* Central holographic sphere */}
          <LazyWebGL>
            <HoloSphere />
          </LazyWebGL>

          {/* Left metric panels */}
          <div
            className="absolute z-10 flex flex-col"
            style={{
              left: "clamp(20px, 8vw, 120px)",
              top: "46%",
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
              top: "46%",
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
      </div>
    </div>
  );
}
