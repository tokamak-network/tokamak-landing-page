"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Html, Environment } from "@react-three/drei";
import { Group, MathUtils } from "three";
import { CONSOLE_PRODUCTS, type ConsoleProduct } from "../console-showcase/products";

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
  const launch = () => window.open(product.url, "_blank", "noopener,noreferrer");

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
      {/* Section header */}
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

      {/* 3D scene */}
      <div className="w-full max-w-[1100px] aspect-[1374/773]">
        <Canvas
          camera={{ position: [0, 0, 6.5], fov: 35 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[3, 5, 4]}
              intensity={1.1}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-3, 2, 2]} intensity={0.3} color="#aacdff" />
            <Environment preset="studio" />

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

            <CameraTilt />

            {/* Ground shadow plane */}
            <mesh
              position={[0, -2.5, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              receiveShadow
            >
              <planeGeometry args={[10, 10]} />
              <shadowMaterial transparent opacity={0.35} />
            </mesh>
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
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Gentle hover bob
    groupRef.current.position.y =
      Math.sin(performance.now() * 0.0008) * 0.04;
    groupRef.current.rotation.y += delta * 0.03 - delta * 0.03; // no spin (placeholder)
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <RoundedBox
        args={[3.2, 4.0, 0.5]}
        radius={0.18}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#1a1a22" roughness={0.55} metalness={0.25} />
      </RoundedBox>

      {/* Chrome bezel around display */}
      <RoundedBox
        args={[2.5, 1.7, 0.05]}
        radius={0.08}
        smoothness={4}
        position={[0, 0.85, 0.27]}
        castShadow
      >
        <meshStandardMaterial color="#3a3a44" roughness={0.3} metalness={0.85} />
      </RoundedBox>

      {/* Display screen (dark CRT background) */}
      <mesh position={[0, 0.85, 0.31]}>
        <planeGeometry args={[2.3, 1.55]} />
        <meshStandardMaterial
          color="#040a14"
          emissive="#001a26"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Display content — Html overlay anchored to display plane */}
      <Html
        position={[0, 0.85, 0.32]}
        center
        style={{
          width: "340px",
          height: "230px",
          pointerEvents: "none",
        }}
      >
        <DisplayContent
          product={product}
          transitioning={transitioning}
          index={activeIndex}
          total={total}
        />
      </Html>

      {/* Cartridge slot on top */}
      <RoundedBox
        args={[0.6, 0.5, 0.18]}
        radius={0.04}
        position={[0, 2.25, 0.05]}
        castShadow
      >
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={0.6}
          metalness={0.4}
          roughness={0.3}
          toneMapped={false}
        />
      </RoundedBox>
      {/* Engraved label area (chrome strip) */}
      <RoundedBox
        args={[1.0, 0.18, 0.02]}
        radius={0.02}
        position={[0, 1.85, 0.27]}
      >
        <meshStandardMaterial color="#3a3a44" metalness={0.9} roughness={0.25} />
      </RoundedBox>

      {/* Memory card on side */}
      <RoundedBox
        args={[0.18, 0.55, 0.08]}
        radius={0.02}
        position={[1.75, 0.7, 0.1]}
        castShadow
      >
        <meshStandardMaterial color="#7c3aed" metalness={0.3} roughness={0.4} />
      </RoundedBox>

      {/* Action buttons row */}
      <Button3D position={[-0.65, -0.7, 0.3]} color="#3b82f6" onClick={onPrev} label="PREV" />
      <Button3D position={[-0.25, -0.7, 0.3]} color="#eab308" onClick={onShuffle} label="SHUFFLE" />
      <Button3D position={[0.15, -0.7, 0.3]} color="#ef4444" onClick={onNext} label="NEXT" />

      {/* Big LAUNCH button */}
      <Button3D
        position={[1.0, -0.7, 0.32]}
        color="#facc15"
        onClick={onLaunch}
        label="LAUNCH"
        radius={0.32}
        depth={0.18}
      />

      {/* D-pad arrow base (decorative) */}
      <RoundedBox
        args={[0.5, 0.25, 0.06]}
        radius={0.04}
        position={[0, -1.65, 0.28]}
      >
        <meshStandardMaterial color="#ff6b35" metalness={0.2} roughness={0.5} />
      </RoundedBox>

      {/* Footer label strip */}
      <RoundedBox
        args={[1.4, 0.18, 0.02]}
        radius={0.02}
        position={[0, -1.25, 0.27]}
      >
        <meshStandardMaterial color="#2a2a32" metalness={0.5} roughness={0.4} />
      </RoundedBox>
    </group>
  );
}

function Button3D({
  position,
  color,
  onClick,
  label,
  radius = 0.18,
  depth = 0.12,
}: {
  position: [number, number, number];
  color: string;
  onClick: () => void;
  label: string;
  radius?: number;
  depth?: number;
}) {
  const groupRef = useRef<Group>(null);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const baseZ = position[2];

  useFrame(() => {
    if (!groupRef.current) return;
    const target = pressed ? baseZ - depth * 0.45 : baseZ;
    groupRef.current.position.z = MathUtils.lerp(
      groupRef.current.position.z,
      target,
      0.3
    );
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
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
        castShadow
        aria-label={label}
      >
        <cylinderGeometry args={[radius, radius, depth, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={pressed ? 0.7 : hovered ? 0.35 : 0.1}
          metalness={0.35}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>
      {/* Glow halo when hovered */}
      {hovered && (
        <mesh position={[0, 0, depth * 0.4]} rotation={[0, 0, 0]}>
          <ringGeometry args={[radius * 1.05, radius * 1.5, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
      )}
    </group>
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
      className="relative w-full h-full overflow-hidden rounded-lg"
      style={{
        background: "linear-gradient(180deg, #050d18 0%, #020812 100%)",
      }}
    >
      {/* CRT scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 4px, rgba(0, 229, 255, 0.3) 5px, transparent 6px)",
        }}
      />
      <div
        className="relative h-full flex flex-col justify-between px-6 py-5 transition-opacity duration-150"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-[14px] tracking-[0.3em] font-mono"
            style={{ color: product.color, textShadow: `0 0 8px ${product.color}` }}
          >
            {product.category}
          </span>
          <span className="text-[14px] tracking-[0.2em] font-mono text-cyan-300/80">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <h3
            className="text-[48px] font-bold text-white leading-[1.0]"
            style={{
              fontFamily: "Orbitron, sans-serif",
              textShadow: `0 0 12px ${product.color}aa, 0 0 32px ${product.color}66`,
            }}
          >
            {product.name}
          </h3>
          <p className="mt-3 text-[18px] text-white/75 font-mono">
            {product.tagline}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full animate-pulse"
              style={{
                background: product.color,
                boxShadow: `0 0 8px ${product.color}`,
              }}
            />
            <span className="text-[13px] tracking-[0.25em] font-mono text-white/60">
              LIVE
            </span>
          </span>
          <span
            className="text-[14px] font-mono tracking-[0.2em]"
            style={{ color: product.color }}
          >
            {product.metric}
          </span>
        </div>
      </div>

      {transitioning && (
        <div className="absolute inset-0 bg-cyan-300/40 mix-blend-screen" />
      )}
    </div>
  );
}
