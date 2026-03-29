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
   Resize helper (same pattern as TokamakGate)
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
   Crystal-to-Governance particle stream
   Particles born on the right, drift left, dissolve
   ═══════════════════════════════════════════════ */

const STREAM_COUNT = 180;

function ParticleStream() {
  const pointsRef = useRef<Points>(null!);

  const { positions, velocities, lifetimes, maxLifetimes } =
    useMemo(() => {
      const positions = new Float32Array(STREAM_COUNT * 3);
      const velocities = new Float32Array(STREAM_COUNT * 3);
      const lifetimes = new Float32Array(STREAM_COUNT);
      const maxLifetimes = new Float32Array(STREAM_COUNT);

      for (let i = 0; i < STREAM_COUNT; i++) {
        // Start on the right side
        const startX = 1.5 + Math.random() * 1.5;
        const startY = (Math.random() - 0.5) * 2.5;
        const startZ = (Math.random() - 0.5) * 1.5;

        positions[i * 3] = startX;
        positions[i * 3 + 1] = startY;
        positions[i * 3 + 2] = startZ;

        // Drift leftward with slight randomness
        velocities[i * 3] = -(0.4 + Math.random() * 0.6);
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

        maxLifetimes[i] = 3.0 + Math.random() * 3.0;
        lifetimes[i] = Math.random() * maxLifetimes[i];
      }

      return { positions, velocities, lifetimes, maxLifetimes };
    }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position");

    for (let i = 0; i < STREAM_COUNT; i++) {
      lifetimes[i] += delta;

      if (lifetimes[i] >= maxLifetimes[i]) {
        // Respawn on the right
        lifetimes[i] = 0;
        const startX = 1.5 + Math.random() * 1.5;
        const startY = (Math.random() - 0.5) * 2.5;
        const startZ = (Math.random() - 0.5) * 1.5;
        posAttr.setXYZ(i, startX, startY, startZ);
        continue;
      }

      const t = lifetimes[i];
      const wobble = Math.sin(t * 2 + i) * 0.05;
      const curX = posAttr.getX(i) + velocities[i * 3] * delta;
      const curY =
        posAttr.getY(i) + velocities[i * 3 + 1] * delta + wobble * delta;
      const curZ = posAttr.getZ(i) + velocities[i * 3 + 2] * delta;

      posAttr.setXYZ(i, curX, curY, curZ);
    }

    posAttr.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#00e5ff"
        size={0.04}
        transparent
        opacity={0.7}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   Shard fragments — larger crystalline pieces
   ═══════════════════════════════════════════════ */

const SHARD_COUNT = 40;

function CrystalShards() {
  const pointsRef = useRef<Points>(null!);

  const { positions, velocities, lifetimes, maxLifetimes } = useMemo(() => {
    const positions = new Float32Array(SHARD_COUNT * 3);
    const velocities = new Float32Array(SHARD_COUNT * 3);
    const lifetimes = new Float32Array(SHARD_COUNT);
    const maxLifetimes = new Float32Array(SHARD_COUNT);

    for (let i = 0; i < SHARD_COUNT; i++) {
      positions[i * 3] = 2.0 + Math.random() * 1.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.0;

      velocities[i * 3] = -(0.2 + Math.random() * 0.3);
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.08;

      maxLifetimes[i] = 4.0 + Math.random() * 4.0;
      lifetimes[i] = Math.random() * maxLifetimes[i];
    }

    return { positions, velocities, lifetimes, maxLifetimes };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position");

    for (let i = 0; i < SHARD_COUNT; i++) {
      lifetimes[i] += delta;

      if (lifetimes[i] >= maxLifetimes[i]) {
        lifetimes[i] = 0;
        posAttr.setXYZ(
          i,
          2.0 + Math.random() * 1.0,
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 1.0,
        );
        continue;
      }

      const t = lifetimes[i];
      const tumble = Math.sin(t * 1.5 + i * 0.7) * 0.03;
      posAttr.setXYZ(
        i,
        posAttr.getX(i) + velocities[i * 3] * delta,
        posAttr.getY(i) + velocities[i * 3 + 1] * delta + tumble * delta,
        posAttr.getZ(i) + velocities[i * 3 + 2] * delta,
      );
    }

    posAttr.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#88ddff"
        size={0.07}
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
   Ambient dust — soft sparkles everywhere
   ═══════════════════════════════════════════════ */

const DUST_COUNT = 120;

function AmbientDust() {
  const pointsRef = useRef<Points>(null!);

  const { positions, phases, speeds } = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const phases = new Float32Array(DUST_COUNT);
    const speeds = new Float32Array(DUST_COUNT);

    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.2 + Math.random() * 0.4;
    }

    return { positions, phases, speeds };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position");
    const t = clock.getElapsedTime();

    for (let i = 0; i < DUST_COUNT; i++) {
      const baseY = positions[i * 3 + 1];
      const y = baseY + Math.sin(t * speeds[i] + phases[i]) * 0.15;
      posAttr.setY(i, y);
    }

    posAttr.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute(
      "position",
      new Float32BufferAttribute(new Float32Array(positions), 3),
    );
    return geo;
  }, [positions]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#00e5ff"
        size={0.02}
        transparent
        opacity={0.3}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   Energy conduit lines — connecting right to left
   ═══════════════════════════════════════════════ */

function EnergyConduit({
  yOffset,
  speed,
  opacity,
}: {
  yOffset: number;
  speed: number;
  opacity: number;
}) {
  const meshRef = useRef<Points>(null!);

  const { positions } = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      positions[i * 3] = 3.0 - t * 6.0; // right to left
      positions[i * 3 + 1] = yOffset + Math.sin(t * Math.PI * 2) * 0.2;
      positions[i * 3 + 2] = 0;
    }
    return { positions, count };
  }, [yOffset]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const posAttr = meshRef.current.geometry.getAttribute("position");
    const t = clock.getElapsedTime() * speed;
    const count = 60;

    for (let i = 0; i < count; i++) {
      const frac = i / (count - 1);
      const y =
        yOffset +
        Math.sin(frac * Math.PI * 2 + t) * 0.15 +
        Math.sin(frac * Math.PI * 3 + t * 1.3) * 0.08;
      posAttr.setY(i, y);
    }

    posAttr.needsUpdate = true;
  });

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        color="#00e5ff"
        size={0.02}
        transparent
        opacity={opacity}
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

function BridgeScene() {
  return (
    <>
      <ParticleStream />
      <CrystalShards />
      <AmbientDust />
      <EnergyConduit yOffset={-0.3} speed={0.8} opacity={0.2} />
      <EnergyConduit yOffset={0.5} speed={1.1} opacity={0.15} />
      <EnergyConduit yOffset={-0.8} speed={0.6} opacity={0.12} />
    </>
  );
}

/* ═══════════════════════════════════════════════
   Main Export
   ═══════════════════════════════════════════════ */

export default function ParticleBridge() {
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
        left: "15%",
        right: "15%",
        top: "15%",
        bottom: "15%",
        zIndex: 5,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        onCreated={handleCreated}
      >
        <ResizeHelper />
        <BridgeScene />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.15}
            luminanceSmoothing={0.9}
            intensity={1.2}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
