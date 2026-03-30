"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree, RootState } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
} from "three";

/* ═══════════════════════════════════════════════
   Resize helper
   ═══════════════════════════════════════════════ */

function ResizeHelper() {
  const { gl, camera, size } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const parent = canvas.parentElement;
    if (!parent) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          gl.setSize(width, height);
          if ("aspect" in camera) {
            (camera as { aspect: number }).aspect = width / height;
          }
          if ("updateProjectionMatrix" in camera) {
            (camera as { updateProjectionMatrix: () => void }).updateProjectionMatrix();
          }
        }
      }
    });

    observer.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && size.width <= 300) {
      gl.setSize(rect.width, rect.height);
      if ("aspect" in camera) {
        (camera as { aspect: number }).aspect = rect.width / rect.height;
      }
      if ("updateProjectionMatrix" in camera) {
        (camera as { updateProjectionMatrix: () => void }).updateProjectionMatrix();
      }
    }

    return () => observer.disconnect();
  }, [gl, camera, size]);

  return null;
}

/* ═══════════════════════════════════════════════
   Inward Spiral — tokens converging to center
   Two streams: left (indigo) and right (cyan)
   ═══════════════════════════════════════════════ */

const SPIRAL_COUNT = 250;

function SpiralStream({ direction }: { direction: 1 | -1 }) {
  const pointsRef = useRef<Points>(null!);

  const { angles, radii, speeds, yOffsets, phases } = useMemo(() => {
    const angles = new Float32Array(SPIRAL_COUNT);
    const radii = new Float32Array(SPIRAL_COUNT);
    const speeds = new Float32Array(SPIRAL_COUNT);
    const yOffsets = new Float32Array(SPIRAL_COUNT);
    const phases = new Float32Array(SPIRAL_COUNT);

    for (let i = 0; i < SPIRAL_COUNT; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 0.3 + Math.random() * 3.0;
      speeds[i] = 0.3 + Math.random() * 0.8;
      yOffsets[i] = (Math.random() - 0.5) * 2.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { angles, radii, speeds, yOffsets, phases };
  }, []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(SPIRAL_COUNT * 3);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position");
    const t = clock.getElapsedTime();

    for (let i = 0; i < SPIRAL_COUNT; i++) {
      // Spiral inward over time, then reset
      const age = (t * speeds[i] + phases[i]) % 6.0;
      const progress = age / 6.0; // 0 → 1 (outer → center)
      const r = radii[i] * (1 - progress * 0.85); // shrink toward center

      // Rotate with direction
      const angle = angles[i] + t * speeds[i] * direction * 1.5;

      const x = Math.cos(angle) * r * 1.2; // wider horizontally
      const z = Math.sin(angle) * r * 0.6;
      const y = yOffsets[i] * (1 - progress * 0.7) +
        Math.sin(t * 0.8 + phases[i]) * 0.1 * (1 - progress);

      posAttr.setXYZ(i, x, y, z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color={direction === 1 ? "#6688ff" : "#00e5ff"}
        size={0.035}
        transparent
        opacity={0.65}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   Core pulse — bright center where tokens converge
   ═══════════════════════════════════════════════ */

const CORE_COUNT = 60;

function CorePulse() {
  const pointsRef = useRef<Points>(null!);

  const { basePositions, phases } = useMemo(() => {
    const basePositions = new Float32Array(CORE_COUNT * 3);
    const phases = new Float32Array(CORE_COUNT);

    for (let i = 0; i < CORE_COUNT; i++) {
      // Tight cluster around center
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 0.05 + Math.random() * 0.25;

      basePositions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      basePositions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.6;
      basePositions[i * 3 + 2] = Math.cos(phi) * r * 0.4;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { basePositions, phases };
  }, []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(CORE_COUNT * 3);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position");
    const t = clock.getElapsedTime();

    // Pulsing scale
    const pulse = 1 + Math.sin(t * 2.0) * 0.3;

    for (let i = 0; i < CORE_COUNT; i++) {
      const jitter = Math.sin(t * 3 + phases[i]) * 0.05;
      posAttr.setXYZ(
        i,
        basePositions[i * 3] * pulse + jitter,
        basePositions[i * 3 + 1] * pulse + Math.sin(t * 2.5 + phases[i]) * 0.03,
        basePositions[i * 3 + 2] * pulse,
      );
    }

    posAttr.needsUpdate = true;

    // Pulse material opacity
    const mat = pointsRef.current.material;
    if ("opacity" in mat) {
      (mat as { opacity: number }).opacity = 0.6 + Math.sin(t * 2.0) * 0.3;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.06}
        transparent
        opacity={0.8}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   Reward Ejection — particles burst outward from core
   ═══════════════════════════════════════════════ */

const EJECT_COUNT = 40;

function RewardEjection() {
  const pointsRef = useRef<Points>(null!);

  const { angles, speeds, phases, yOffsets } = useMemo(() => {
    const angles = new Float32Array(EJECT_COUNT);
    const speeds = new Float32Array(EJECT_COUNT);
    const phases = new Float32Array(EJECT_COUNT);
    const yOffsets = new Float32Array(EJECT_COUNT);

    for (let i = 0; i < EJECT_COUNT; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.5 + Math.random() * 1.0;
      phases[i] = Math.random() * 4.0; // stagger ejection timing
      yOffsets[i] = (Math.random() - 0.5) * 0.5;
    }

    return { angles, speeds, phases, yOffsets };
  }, []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(EJECT_COUNT * 3);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position");
    const t = clock.getElapsedTime();

    for (let i = 0; i < EJECT_COUNT; i++) {
      const age = (t * speeds[i] + phases[i]) % 4.0;
      const progress = age / 4.0;

      // Only visible in ejection phase (first 40% of cycle)
      if (progress > 0.4) {
        posAttr.setXYZ(i, 0, -10, 0); // hide off-screen
        continue;
      }

      const ejectProgress = progress / 0.4; // 0 → 1
      const r = ejectProgress * 2.5;
      const fade = 1 - ejectProgress; // dim as it travels

      const x = Math.cos(angles[i]) * r * 1.3;
      const y = yOffsets[i] + Math.sin(angles[i] * 2 + t) * 0.1 * fade;
      const z = Math.sin(angles[i]) * r * 0.5;

      posAttr.setXYZ(i, x, y, z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#22ffaa"
        size={0.04}
        transparent
        opacity={0.5}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   Orbital Ring — a ring of particles orbiting the core
   ═══════════════════════════════════════════════ */

const RING_COUNT = 80;

function OrbitalRing() {
  const pointsRef = useRef<Points>(null!);

  const { phases } = useMemo(() => {
    const phases = new Float32Array(RING_COUNT);
    for (let i = 0; i < RING_COUNT; i++) {
      phases[i] = (i / RING_COUNT) * Math.PI * 2;
    }
    return { phases };
  }, []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(RING_COUNT * 3);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position");
    const t = clock.getElapsedTime();

    const ringRadius = 0.8 + Math.sin(t * 0.5) * 0.15;

    for (let i = 0; i < RING_COUNT; i++) {
      const angle = phases[i] + t * 0.6;
      const wobble = Math.sin(t * 1.5 + phases[i] * 3) * 0.05;

      const x = Math.cos(angle) * ringRadius * 1.4;
      const y = wobble + Math.sin(angle * 2 + t) * 0.08;
      const z = Math.sin(angle) * ringRadius * 0.5;

      posAttr.setXYZ(i, x, y, z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#00e5ff"
        size={0.025}
        transparent
        opacity={0.45}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   Ambient dust — soft sparkles
   ═══════════════════════════════════════════════ */

const DUST_COUNT = 100;

function AmbientDust() {
  const pointsRef = useRef<Points>(null!);

  const { basePositions, phases, speeds } = useMemo(() => {
    const basePositions = new Float32Array(DUST_COUNT * 3);
    const phases = new Float32Array(DUST_COUNT);
    const speeds = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      basePositions[i * 3] = (Math.random() - 0.5) * 8;
      basePositions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      basePositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.15 + Math.random() * 0.3;
    }

    return { basePositions, phases, speeds };
  }, []);

  const geometry = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position");
    const t = clock.getElapsedTime();

    for (let i = 0; i < DUST_COUNT; i++) {
      posAttr.setXYZ(
        i,
        basePositions[i * 3] + Math.sin(t * 0.2 + phases[i]) * 0.1,
        basePositions[i * 3 + 1] + Math.sin(t * speeds[i] + phases[i]) * 0.15,
        basePositions[i * 3 + 2],
      );
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#8ab4f8"
        size={0.018}
        transparent
        opacity={0.25}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   Combined 3D scene
   ═══════════════════════════════════════════════ */

function VortexScene() {
  return (
    <>
      {/* Two spiral streams converging (left=indigo, right=cyan) */}
      <SpiralStream direction={1} />
      <SpiralStream direction={-1} />

      {/* Bright pulsing core at center */}
      <CorePulse />

      {/* Orbital ring around core */}
      <OrbitalRing />

      {/* Reward particles ejected outward */}
      <RewardEjection />

      {/* Background dust */}
      <AmbientDust />
    </>
  );
}

/* ═══════════════════════════════════════════════
   Main Export
   ═══════════════════════════════════════════════ */

export default function TokenVortex() {
  const handleCreated = useCallback((state: RootState) => {
    state.gl.setClearColor(0x000000, 0);
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
      className="absolute pointer-events-none"
      style={{
        left: "10%",
        right: "10%",
        top: "10%",
        bottom: "10%",
        zIndex: 5,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        onCreated={handleCreated}
      >
        <ResizeHelper />
        <VortexScene />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            intensity={1.5}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
