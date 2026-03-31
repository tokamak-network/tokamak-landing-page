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
        {item.label}
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
   Mobile Overlay — Layered Reveal (bottom sheet)
   ═══════════════════════════════════════════════ */

const mobileKeyframes = `
@keyframes holoPulse {
  0% { transform: translate(-50%, -50%) scale(0.4); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
}
@keyframes holoPulse2 {
  0% { transform: translate(-50%, -50%) scale(0.4); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
}
@keyframes holoCoreSpin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes swipeHint {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-5px); opacity: 1; }
}`;

function DataConsoleMobileOverlay({ items }: { items: TickerItem[] }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const peekItems = items.slice(0, 2);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: mobileKeyframes }} />

      {/* ── Initial state layer ── */}
      <div className="absolute inset-0 flex flex-col items-center">
        {/* Title block */}
        <div
          className="flex flex-col items-center gap-1"
          style={{ paddingTop: 32, zIndex: 10, position: "relative" }}
        >
          <div
            style={{
              fontSize: 10,
              color: "rgba(140, 200, 255, 0.5)",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            System Status:{" "}
            <span style={{ color: "#22c55e" }}>Nominal</span>
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
        </div>

        {/* CSS holographic pulse sphere */}
        <div
          style={{
            position: "absolute",
            top: "42%",
            left: "50%",
            width: 180,
            height: 180,
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {/* Outer pulse ring 1 */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: "1.5px solid rgba(0, 229, 255, 0.6)",
              animation: "holoPulse 2.4s ease-out infinite",
            }}
          />
          {/* Outer pulse ring 2 (offset) */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 140,
              height: 140,
              borderRadius: "50%",
              border: "1px solid rgba(42, 114, 229, 0.5)",
              animation: "holoPulse2 2.4s ease-out infinite 1.2s",
            }}
          />
          {/* Core spinning ring */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "#00e5ff",
              borderRightColor: "rgba(0, 229, 255, 0.3)",
              animation: "holoCoreSpin 1.8s linear infinite",
              boxShadow: "0 0 12px rgba(0, 229, 255, 0.4)",
            }}
          />
          {/* Inner filled core */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0, 229, 255, 0.35) 0%, rgba(42, 114, 229, 0.15) 60%, transparent 100%)",
              boxShadow:
                "0 0 20px rgba(0, 229, 255, 0.3), 0 0 40px rgba(42, 114, 229, 0.15)",
            }}
          />
        </div>

        {/* Floating metric badges (first 2 items) */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "0 20px",
            zIndex: 6,
            pointerEvents: "none",
          }}
        >
          {peekItems.map((item, i) => (
            <div
              key={item.label}
              style={{
                background: "rgba(5, 10, 20, 0.82)",
                border: "1px solid rgba(42, 114, 229, 0.35)",
                borderRadius: 8,
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 88,
                backdropFilter: "blur(8px)",
                boxShadow:
                  i === 0
                    ? "-4px 0 16px rgba(0, 229, 255, 0.08)"
                    : "4px 0 16px rgba(0, 229, 255, 0.08)",
              }}
            >
              {/* Top accent */}
              <div
                style={{
                  position: "absolute",
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
                  fontSize: 8,
                  color: "rgba(140, 200, 255, 0.6)",
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                  textAlign: "center",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: 17,
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
                    marginTop: 2,
                    fontSize: 9,
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
      </div>

      {/* ── Backdrop (tap to close) ── */}
      {sheetOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0"
          style={{
            background: "rgba(3, 8, 16, 0.55)",
            backdropFilter: "blur(4px)",
            zIndex: 20,
          }}
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* ── Bottom ticker (always visible) ── */}
      <div
        style={{
          position: "absolute",
          bottom: sheetOpen ? "auto" : 20,
          left: 0,
          right: 0,
          zIndex: sheetOpen ? 0 : 15,
          opacity: sheetOpen ? 0 : 1,
          transition: "opacity 0.2s",
          pointerEvents: sheetOpen ? "none" : "auto",
        }}
      >
        <BottomTicker items={items} />
      </div>

      {/* ── Swipe-up / peek indicator ── */}
      <motion.div
        animate={{ opacity: sheetOpen ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          bottom: 68,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 16,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          pointerEvents: sheetOpen ? "none" : "auto",
          cursor: "pointer",
          minHeight: 44,
          justifyContent: "center",
        }}
        onClick={() => setSheetOpen(true)}
      >
        <div
          style={{
            fontSize: 8,
            color: "rgba(0, 229, 255, 0.5)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            animation: "swipeHint 1.8s ease-in-out infinite",
          }}
        >
          View All Metrics
        </div>
        <div
          style={{
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "swipeHint 1.8s ease-in-out infinite 0.2s",
          }}
        >
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <path
              d="M1 8.5L8 1.5L15 8.5"
              stroke="#00e5ff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          </svg>
        </div>
      </motion.div>

      {/* ── Bottom sheet ── */}
      <motion.div
        animate={{ y: sheetOpen ? 0 : "85%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.05, bottom: 0.3 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 60 || info.velocity.y > 300) {
            setSheetOpen(false);
          } else if (info.offset.y < -40 || info.velocity.y < -300) {
            setSheetOpen(true);
          }
        }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 25,
          borderRadius: "16px 16px 0 0",
          background: "rgba(5, 10, 20, 0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(42, 114, 229, 0.2)",
          borderBottom: "none",
          boxShadow:
            "0 -8px 40px rgba(0, 0, 0, 0.6), 0 -2px 0 rgba(0, 229, 255, 0.08)",
          paddingBottom: 24,
          cursor: sheetOpen ? "default" : "pointer",
          touchAction: "none",
        }}
        onClick={() => {
          if (!sheetOpen) setSheetOpen(true);
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 12,
            paddingBottom: 8,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: "rgba(0, 229, 255, 0.25)",
            }}
          />
        </div>

        {/* Sheet header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            paddingBottom: 16,
            borderBottom: "1px solid rgba(42, 114, 229, 0.12)",
            marginBottom: 16,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#00e5ff",
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textShadow: "0 0 10px rgba(0, 229, 255, 0.4)",
            }}
          >
            Live Data Console
          </div>
          <div
            style={{
              fontSize: 9,
              color: "rgba(140, 200, 255, 0.5)",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            System Status:{" "}
            <span style={{ color: "#22c55e" }}>Nominal</span>
          </div>
        </div>

        {/* Metrics 2x2 grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            padding: "0 16px",
            marginBottom: 16,
          }}
        >
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

        {/* Biweekly Reports link */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
            padding: "0 16px",
          }}
        >
          <Link
            href="/about/reports"
            style={{
              fontSize: 10,
              color: "rgba(0, 229, 255, 0.6)",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textDecoration: "none",
              border: "1px solid rgba(0, 229, 255, 0.18)",
              borderRadius: 6,
              padding: "8px 16px",
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              background: "rgba(0, 229, 255, 0.04)",
            }}
          >
            Biweekly Reports &rarr;
          </Link>
        </div>

        {/* Sheet bottom ticker */}
        <div style={{ padding: "0 4px" }}>
          <BottomTicker items={items} />
        </div>
      </motion.div>
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
