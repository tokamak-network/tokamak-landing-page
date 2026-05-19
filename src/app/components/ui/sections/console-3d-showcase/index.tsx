"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  OrbitControls,
  Center,
  Html,
  Bounds,
} from "@react-three/drei";
import { Group, MathUtils, Mesh } from "three";
import { CONSOLE_PRODUCTS, type ConsoleProduct } from "../console-showcase/products";

// Set to true to enable OrbitControls + visible clickzone helpers for
// measuring button coordinates visually.
const DEBUG = false;

export default function Console3DShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const product = CONSOLE_PRODUCTS[activeIndex];
  const total = CONSOLE_PRODUCTS.length;

  const swap = (nextIndex: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setActiveIndex(((nextIndex % total) + total) % total);
      setTransitioning(false);
    }, 150);
  };
  const prev = () => swap(activeIndex - 1);
  const next = () => swap(activeIndex + 1);
  const shuffle = () => swap(Math.floor(Math.random() * total));
  const launch = () =>
    window.open(product.url, "_blank", "noopener,noreferrer");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Enter") launch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <section className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center py-12">
      <div className="mb-6 text-center px-4">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] tracking-[0.5em] text-cyan-300/85 font-mono uppercase">
            Pick a Product · 3D
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
        </div>
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05]"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          The{" "}
          <span className="text-cyan-300 drop-shadow-[0_0_24px_rgba(0,229,255,0.35)]">
            Tokamak
          </span>{" "}
          Console
        </h2>
        <p className="mt-3 text-white/55 font-mono text-xs">
          Click buttons · ← → keyboard · Enter to launch
        </p>
      </div>

      <div className="w-full max-w-[1200px] aspect-[4/3] sm:aspect-[16/9]">
        <Canvas camera={{ position: [0, 0, 3], fov: 40 }} shadows>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[3, 5, 4]}
              intensity={1.2}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight
              position={[-3, 2, 3]}
              intensity={0.4}
              color="#aacdff"
            />
            <Environment preset="studio" />

            <Bounds fit clip observe margin={1.2}>
              <Center>
                <Console
                  product={product}
                  transitioning={transitioning}
                  activeIndex={activeIndex}
                  total={total}
                  onPrev={prev}
                  onNext={next}
                  onShuffle={shuffle}
                  onLaunch={launch}
                />
              </Center>
            </Bounds>

            {!DEBUG && <CameraTilt />}
            {DEBUG && (
              <OrbitControls enablePan enableZoom enableRotate />
            )}
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
}

function CameraTilt() {
  useFrame((state) => {
    const targetX = state.pointer.x * 0.4;
    const targetY = state.pointer.y * 0.25;
    state.camera.position.x = MathUtils.lerp(state.camera.position.x, targetX, 0.06);
    state.camera.position.y = MathUtils.lerp(state.camera.position.y, targetY, 0.06);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

function Console({
  product,
  transitioning,
  activeIndex,
  total,
  onPrev,
  onNext,
  onShuffle,
  onLaunch,
}: {
  product: ConsoleProduct;
  transitioning: boolean;
  activeIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onLaunch: () => void;
}) {
  const { scene } = useGLTF("/3d/console.glb");
  const groupRef = useRef<Group>(null);

  // Gentle hover bob
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.7) * 0.015;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} rotation={[0, -Math.PI / 2, 0]} />

      {/* Display content overlay — positioned over the screen area of the console */}
      <Html
        position={[0, 0.18, 0.05]}
        center
        style={{
          width: "210px",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <DisplayContent
          product={product}
          transitioning={transitioning}
          index={activeIndex}
          total={total}
        />
      </Html>

      {/* Button clickzones — invisible 3D spheres over the painted buttons */}
      <ClickZone
        position={[-0.13, -0.13, 0.06]}
        color="#3b82f6"
        onClick={onPrev}
        label="PREV"
      />
      <ClickZone
        position={[-0.05, -0.13, 0.06]}
        color="#eab308"
        onClick={onShuffle}
        label="SHUFFLE"
      />
      <ClickZone
        position={[0.03, -0.13, 0.06]}
        color="#ef4444"
        onClick={onNext}
        label="NEXT"
      />
      <ClickZone
        position={[0.18, -0.13, 0.06]}
        color="#facc15"
        onClick={onLaunch}
        label="LAUNCH"
        radius={0.05}
      />
    </group>
  );
}

function ClickZone({
  position,
  color,
  onClick,
  label,
  radius = 0.05,
}: {
  position: [number, number, number];
  color: string;
  onClick: () => void;
  label: string;
  radius?: number;
}) {
  const ref = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  useFrame(() => {
    if (!ref.current) return;
    // Light pulse on hover
    const targetOpacity = pressed ? 0.85 : hovered ? 0.45 : DEBUG ? 0.25 : 0;
    const mat = ref.current.material as { opacity?: number };
    if (mat && typeof mat.opacity === "number") {
      mat.opacity = MathUtils.lerp(mat.opacity, targetOpacity, 0.2);
    }
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerDown={(e) => {
        e.stopPropagation();
        setPressed(true);
        onClick();
      }}
      onPointerUp={() => setPressed(false)}
      onPointerEnter={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
        document.body.style.cursor = "auto";
      }}
      aria-label={label}
    >
      <sphereGeometry args={[radius, 32, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}

function DisplayContent({
  product,
  transitioning,
  index,
  total,
}: {
  product: ConsoleProduct;
  transitioning: boolean;
  index: number;
  total: number;
}) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-md border border-cyan-400/30"
      style={{
        background: "linear-gradient(180deg, rgba(2,8,18,0.92) 0%, rgba(2,8,18,0.95) 100%)",
        boxShadow: `0 0 24px ${product.color}33`,
        height: "180px",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0, 229, 255, 0.4) 4px, transparent 5px)",
        }}
      />
      <div
        className="relative h-full flex flex-col justify-between p-3 transition-opacity duration-150"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-[8px] tracking-[0.3em] font-mono"
            style={{
              color: product.color,
              textShadow: `0 0 6px ${product.color}`,
            }}
          >
            {product.category}
          </span>
          <span className="text-[8px] tracking-[0.2em] font-mono text-cyan-300/80">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-col items-center text-center">
          <h3
            className="text-[22px] font-bold text-white leading-[1.0]"
            style={{
              fontFamily: "Orbitron, sans-serif",
              textShadow: `0 0 10px ${product.color}aa, 0 0 24px ${product.color}66`,
            }}
          >
            {product.name}
          </h3>
          <p className="mt-1.5 text-[10px] text-white/75 font-mono">
            {product.tagline}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{
                background: product.color,
                boxShadow: `0 0 6px ${product.color}`,
              }}
            />
            <span className="text-[7px] tracking-[0.25em] font-mono text-white/60">
              LIVE
            </span>
          </span>
          <span
            className="text-[8px] font-mono tracking-[0.2em]"
            style={{ color: product.color }}
          >
            {product.metric}
          </span>
        </div>
      </div>
    </div>
  );
}

useGLTF.preload("/3d/console.glb");
