"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useTexture } from "@react-three/drei";
import {
  Group,
  Mesh,
  DoubleSide,
  MeshStandardMaterial,
  MeshBasicMaterial,
  AdditiveBlending,
} from "three";
import { COINS, type CoinDef } from "./coins";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

// World layout
const FLOW_RANGE = 9; // -4.5 → +4.5
const FLOW_SPEED = 1.25; // world units / second
const LANE_Y = [1.15, 0, -1.15];
const COIN_RADIUS = 0.4;

function FlowingCoin({
  coin,
  index,
  total,
}: {
  coin: CoinDef;
  index: number;
  total: number;
}) {
  const groupRef = useRef<Group>(null!);
  const preRef = useRef<Group>(null!);
  const coinMatRef = useRef<MeshStandardMaterial>(null!);
  const coinRingMatRef = useRef<MeshBasicMaterial>(null!);
  const glyphRingMatRef = useRef<MeshBasicMaterial>(null!);
  const glyphFillMatRef = useRef<MeshBasicMaterial>(null!);
  const glyphInnerRef = useRef<Mesh>(null!);

  const texture = useTexture(coin.logo);
  const lane = index % LANE_Y.length;
  const baseY = LANE_Y[lane];
  const cycleLen = FLOW_RANGE / FLOW_SPEED; // seconds
  const phaseOffset = (index / total) * cycleLen;

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    const cycleT = (t + phaseOffset) % cycleLen;
    const x = cycleT * FLOW_SPEED - FLOW_RANGE / 2;

    const bob = Math.sin(t * 0.6 + index * 0.7) * 0.05;
    groupRef.current.position.x = x;
    groupRef.current.position.y = baseY + bob;

    // Transformation window: smooth from pre to post across x = -0.45 → +0.45
    const cross = smoothstep(-0.45, 0.45, x);

    // Pre-form fade out
    if (coinMatRef.current) {
      coinMatRef.current.opacity = 1 - cross;
      coinMatRef.current.emissiveIntensity = 0.35 * (1 - cross);
    }
    if (coinRingMatRef.current) {
      coinRingMatRef.current.opacity = (1 - cross) * 0.55;
    }

    // Post-form fade in
    if (glyphRingMatRef.current) glyphRingMatRef.current.opacity = cross * 0.95;
    if (glyphFillMatRef.current) glyphFillMatRef.current.opacity = cross * 0.92;

    // Scale dip at crossing center (bell curve, peak 1 at cross=0.5)
    const dip = 4 * cross * (1 - cross);
    groupRef.current.scale.setScalar(1 - 0.22 * dip);

    // Pre coin slow spin (only when visible)
    if (preRef.current) preRef.current.rotation.z += delta * 0.4 * (1 - cross);
    // Glyph counter-spin
    if (glyphInnerRef.current) glyphInnerRef.current.rotation.z -= delta * 0.9;

    // Edge fade — make coins fade in/out as they enter/exit view
    const edgeFade = smoothstep(-4.5, -3.5, x) * (1 - smoothstep(3.5, 4.5, x));
    if (coinMatRef.current && coinRingMatRef.current && glyphRingMatRef.current && glyphFillMatRef.current) {
      coinMatRef.current.opacity *= edgeFade;
      coinRingMatRef.current.opacity *= edgeFade;
      glyphRingMatRef.current.opacity *= edgeFade;
      glyphFillMatRef.current.opacity *= edgeFade;
    }
  });

  return (
    <group ref={groupRef}>
      {/* PRE-FORM: full-color coin medallion */}
      <group ref={preRef}>
        <mesh>
          <circleGeometry args={[COIN_RADIUS, 64]} />
          <meshStandardMaterial
            ref={coinMatRef}
            map={texture}
            transparent
            side={DoubleSide}
            metalness={0.3}
            roughness={0.35}
            emissive={coin.brandColor}
            emissiveMap={texture}
            emissiveIntensity={0.35}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0, -0.005]}>
          <torusGeometry args={[COIN_RADIUS + 0.07, 0.01, 12, 96]} />
          <meshBasicMaterial
            ref={coinRingMatRef}
            color="#00e5ff"
            toneMapped={false}
            transparent
            opacity={0.55}
          />
        </mesh>
      </group>

      {/* POST-FORM: ZK proof glyph (anonymous, geometric) */}
      <group>
        {/* Dark disc base */}
        <mesh position={[0, 0, -0.002]}>
          <circleGeometry args={[COIN_RADIUS, 64]} />
          <meshBasicMaterial
            ref={glyphFillMatRef}
            color="#04080f"
            transparent
            opacity={0}
          />
        </mesh>
        {/* Thicker cyan outer ring */}
        <mesh>
          <torusGeometry args={[COIN_RADIUS, 0.022, 16, 96]} />
          <meshBasicMaterial
            ref={glyphRingMatRef}
            color="#00e5ff"
            toneMapped={false}
            transparent
            opacity={0}
          />
        </mesh>
        {/* Inner rotating hexagon glyph */}
        <mesh ref={glyphInnerRef} position={[0, 0, 0.002]}>
          <ringGeometry args={[0.06, 0.18, 6]} />
          <meshBasicMaterial
            color="#00e5ff"
            toneMapped={false}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>
    </group>
  );
}

function NeonLine() {
  const coreMatRef = useRef<MeshBasicMaterial>(null!);
  const haloMatRef = useRef<MeshBasicMaterial>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreMatRef.current) {
      coreMatRef.current.opacity = 0.92 + Math.sin(t * 2.5) * 0.06;
    }
    if (haloMatRef.current) {
      haloMatRef.current.opacity = 0.18 + Math.sin(t * 2.5) * 0.04;
    }
  });

  return (
    <group>
      {/* Wide outer halo */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[0.55, 5.6]} />
        <meshBasicMaterial
          ref={haloMatRef}
          color="#00e5ff"
          toneMapped={false}
          transparent
          opacity={0.18}
          blending={AdditiveBlending}
        />
      </mesh>
      {/* Inner halo */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[0.18, 5.4]} />
        <meshBasicMaterial
          color="#00e5ff"
          toneMapped={false}
          transparent
          opacity={0.35}
          blending={AdditiveBlending}
        />
      </mesh>
      {/* Core bright line */}
      <mesh>
        <planeGeometry args={[0.045, 5.2]} />
        <meshBasicMaterial
          ref={coreMatRef}
          color="#aef9ff"
          toneMapped={false}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* End caps */}
      <mesh position={[0, 2.6, 0]}>
        <circleGeometry args={[0.06, 24]} />
        <meshBasicMaterial color="#aef9ff" toneMapped={false} />
      </mesh>
      <mesh position={[0, -2.6, 0]}>
        <circleGeometry args={[0.06, 24]} />
        <meshBasicMaterial color="#aef9ff" toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function ShadowProofScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.75]}
    >
      <ambientLight intensity={0.6} color="#aacdff" />
      <directionalLight position={[2, 3, 5]} intensity={0.6} />

      <NeonLine />

      {COINS.map((coin, i) => (
        <FlowingCoin
          key={coin.id}
          coin={coin}
          index={i}
          total={COINS.length}
        />
      ))}

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.3}
          luminanceSmoothing={0.85}
          intensity={1.0}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
