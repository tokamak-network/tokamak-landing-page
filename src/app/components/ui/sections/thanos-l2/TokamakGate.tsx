"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree, RootState } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  Group,
  AdditiveBlending,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
} from "three";
import type * as THREE from "three";

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
   Wireframe Torus — full mesh wireframe (complete donut)
   ═══════════════════════════════════════════════ */

function WireframeTorus({
  radius,
  tube,
  radialSegments,
  tubularSegments,
  color,
  opacity,
}: {
  radius: number;
  tube: number;
  radialSegments: number;
  tubularSegments: number;
  color: string;
  opacity: number;
}) {
  return (
    <mesh>
      <torusGeometry args={[radius, tube, radialSegments, tubularSegments]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        wireframe
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}


/* ═══════════════════════════════════════════════
   Orbiting energy ring — thin line ring
   ═══════════════════════════════════════════════ */

function OrbitRing({
  radius,
  tilt,
  speed,
  color,
  opacity,
}: {
  radius: number;
  tilt: [number, number, number];
  speed: number;
  color: string;
  opacity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.z += speed * delta;
  });

  return (
    <mesh ref={meshRef} rotation={tilt}>
      <torusGeometry args={[radius, 0.006, 8, 128]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

/* ═══════════════════════════════════════════════
   Ambient particles — floating motes
   ═══════════════════════════════════════════════ */

const MOTE_COUNT = 200;

function AmbientMotes() {
  const pointsRef = useRef<Points>(null!);

  const { positions, phases, radii, speeds, yOffsets } = useMemo(() => {
    const positions = new Float32Array(MOTE_COUNT * 3);
    const phases = new Float32Array(MOTE_COUNT);
    const radii = new Float32Array(MOTE_COUNT);
    const speeds = new Float32Array(MOTE_COUNT);
    const yOffsets = new Float32Array(MOTE_COUNT);

    for (let i = 0; i < MOTE_COUNT; i++) {
      phases[i] = Math.random() * Math.PI * 2;
      radii[i] = 2.0 + Math.random() * 3.0;
      speeds[i] = 0.1 + Math.random() * 0.2;
      yOffsets[i] = (Math.random() - 0.5) * 2.5;
    }

    return { positions, phases, radii, speeds, yOffsets };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position");
    const t = clock.getElapsedTime();

    for (let i = 0; i < MOTE_COUNT; i++) {
      const angle = t * speeds[i] + phases[i];
      const r = radii[i];
      const x = Math.cos(angle) * r;
      const y = yOffsets[i] + Math.sin(t * 0.5 + phases[i]) * 0.3;
      const z = Math.sin(angle) * r;
      posAttr.setXYZ(i, x, y, z);
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
        size={0.03}
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
   Spark burst — particles shooting outward
   ═══════════════════════════════════════════════ */

const SPARK_COUNT = 60;

function SparkBurst() {
  const pointsRef = useRef<Points>(null!);

  const { positions, velocities, lifetimes, maxLifetimes } = useMemo(() => {
    const positions = new Float32Array(SPARK_COUNT * 3);
    const velocities = new Float32Array(SPARK_COUNT * 3);
    const lifetimes = new Float32Array(SPARK_COUNT);
    const maxLifetimes = new Float32Array(SPARK_COUNT);

    for (let i = 0; i < SPARK_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * 1.0;
      const speed = 0.3 + Math.random() * 1.0;

      velocities[i * 3] = Math.cos(angle) * speed;
      velocities[i * 3 + 1] = elevation * speed * 0.4;
      velocities[i * 3 + 2] = Math.sin(angle) * speed;

      maxLifetimes[i] = 2.0 + Math.random() * 2.5;
      lifetimes[i] = Math.random() * maxLifetimes[i];
    }

    return { positions, velocities, lifetimes, maxLifetimes };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position");

    for (let i = 0; i < SPARK_COUNT; i++) {
      lifetimes[i] += delta;

      if (lifetimes[i] >= maxLifetimes[i]) {
        lifetimes[i] = 0;
        posAttr.setXYZ(i, 0, 0, 0);
        continue;
      }

      const t = lifetimes[i];
      const x = velocities[i * 3] * t;
      const y = velocities[i * 3 + 1] * t;
      const z = velocities[i * 3 + 2] * t;

      posAttr.setXYZ(i, x, y, z);
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
        color="#f59e0b"
        size={0.02}
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   Combined scene — rotating wireframe torus
   with energy effects
   ═══════════════════════════════════════════════ */

function TorusCore() {
  const groupRef = useRef<Group>(null!);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.15 * delta;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Lay flat */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        {/* Primary wireframe — cyan, dense mesh */}
        <WireframeTorus
          radius={2.2}
          tube={0.6}
          radialSegments={24}
          tubularSegments={64}
          color="#00e5ff"
          opacity={0.7}
        />

        {/* Secondary wireframe — finer detail, slightly larger */}
        <WireframeTorus
          radius={2.22}
          tube={0.62}
          radialSegments={12}
          tubularSegments={48}
          color="#2A72E5"
          opacity={0.3}
        />
      </group>

      {/* Orbiting energy rings */}
      <OrbitRing radius={3.0} tilt={[0.3, 0.2, 0]} speed={0.2} color="#00e5ff" opacity={0.25} />
      <OrbitRing radius={3.2} tilt={[0.8, -0.3, 0.4]} speed={-0.15} color="#2A72E5" opacity={0.18} />
      <OrbitRing radius={2.8} tilt={[1.2, 0.5, -0.2]} speed={0.12} color="#f59e0b" opacity={0.12} />

      {/* Particles */}
      <AmbientMotes />
      <SparkBurst />
    </group>
  );
}

/* ═══════════════════════════════════════════════
   Main Export
   ═══════════════════════════════════════════════ */

export default function TokamakGate() {
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
        top: "42%",
        transform: "translate(-50%, -50%)",
        width: "clamp(320px, 50vw, 640px)",
        height: "clamp(320px, 50vw, 640px)",
        zIndex: 5,
      }}
    >
      <Canvas
        camera={{ position: [0, 1.8, 6], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        onCreated={handleCreated}
      >
        <ResizeHelper />
        <TorusCore />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            intensity={2.0}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
