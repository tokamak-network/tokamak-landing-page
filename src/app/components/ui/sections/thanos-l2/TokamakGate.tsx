"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
} from "three";
import { RootState } from "@react-three/fiber";

/* ══════════════════════════════════════════════
   Resize helper
   ══════════════════════════════════════════════ */
function ResizeHelper() {
  const { gl, camera } = useThree();
  useEffect(() => {
    const parent = gl.domElement.parentElement;
    if (!parent) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        if (width > 0 && height > 0) {
          gl.setSize(width, height);
          if ("aspect" in camera && "updateProjectionMatrix" in camera) {
            (camera as unknown as { aspect: number; updateProjectionMatrix: () => void }).aspect = width / height;
            (camera as unknown as { aspect: number; updateProjectionMatrix: () => void }).updateProjectionMatrix();
          }
        }
      }
    });
    obs.observe(parent);
    return () => obs.disconnect();
  }, [gl, camera]);
  return null;
}

/* ══════════════════════════════════════════════
   Hex grid procedural texture
   ══════════════════════════════════════════════ */
function createHexTexture(): CanvasTexture {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);

  const hexR = 20;
  const hexH = hexR * Math.sqrt(3);
  ctx.strokeStyle = "rgba(0, 229, 255, 0.6)";
  ctx.lineWidth = 1.2;

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

/* ═══════════════════════════════════════════
   Torus constants
   ═══════════════════════════════════════════ */
const TORUS_R = 0.65;
const TORUS_r = 0.2;

/* ══════════════════════════════════════════════
   HexShell — hex grid texture on torus (outer shell)
   ══════════════════════════════════════════════ */
function HexShell() {
  const meshRef = useRef<Mesh>(null);
  const tex = useMemo(() => createHexTexture(), []);

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[TORUS_R, TORUS_r, 48, 96]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.22}
        side={DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════
   WireframeTorus — cyan wireframe (slightly smaller, inside hex)
   ══════════════════════════════════════════════ */
function WireframeTorus() {
  return (
    <mesh>
      <torusGeometry args={[TORUS_R, TORUS_r * 0.92, 32, 64]} />
      <meshBasicMaterial
        color="#00e5ff"
        wireframe
        transparent
        opacity={0.12}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════
   Inner solid torus — dim fill for depth
   ══════════════════════════════════════════════ */
function InnerTorus() {
  return (
    <mesh>
      <torusGeometry args={[TORUS_R, TORUS_r * 0.88, 32, 64]} />
      <meshBasicMaterial
        color="#041828"
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════
   Surface Particles — scattered on torus surface
   ══════════════════════════════════════════════ */
function SurfaceParticles() {
  const ref = useRef<ThreePoints>(null);

  const geo = useMemo(() => {
    const count = 500;
    const R = TORUS_R;
    const r = TORUS_r;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      positions[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
      positions[i * 3 + 1] = r * Math.sin(v);
      positions[i * 3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        color="#00e5ff"
        size={0.018}
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════
   Equator ring — bright glow ring at torus center plane
   ══════════════════════════════════════════════ */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function EquatorRing() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[TORUS_R - 0.02, TORUS_R + 0.06, 128]} />
      <meshBasicMaterial
        color="#00e5ff"
        transparent
        opacity={0.35}
        side={DoubleSide}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════
   Ambient Particles — floating motes across section
   ══════════════════════════════════════════════ */
function AmbientParticles() {
  const ref = useRef<ThreePoints>(null);
  const geo = useMemo(() => {
    const count = 120;
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
   Orbital Rings — concentric energy rings around torus
   ══════════════════════════════════════════════ */
function OrbitalRings() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.03 * delta;
    }
  });

  return (
    <group ref={groupRef}>
      {[
        { r: 1.1, tilt: [Math.PI / 2, 0, 0] as [number, number, number], op: 0.25, color: "#00e5ff" },
        { r: 1.25, tilt: [Math.PI / 2, 0, Math.PI / 8] as [number, number, number], op: 0.12, color: "#2a72e5" },
        { r: 1.4, tilt: [Math.PI / 2, 0, Math.PI / 4] as [number, number, number], op: 0.06, color: "#00e5ff" },
      ].map((ring, i) => (
        <mesh key={i} rotation={ring.tilt}>
          <torusGeometry args={[ring.r, 0.006, 8, 256]} />
          <meshBasicMaterial color={ring.color} transparent opacity={ring.op} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════
   Core Glow — lights at torus center
   ══════════════════════════════════════════════ */
function CoreGlow() {
  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#00e5ff" distance={5} />
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#2a72e5" distance={7} />
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.9} />
      </mesh>
    </>
  );
}

/* ══════════════════════════════════════════════
   Scene — rotating torus group
   ══════════════════════════════════════════════ */
function TorusScene() {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y += 0.08 * delta;
      // Gentle horizontal wobble for dynamic 3D feel
      groupRef.current.rotation.x = 0.5 + Math.sin(t * 0.4) * 0.15;
      groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.1;
    }
  });

  return (
    <>
      <ResizeHelper />
      <ambientLight intensity={0.08} />
      <CoreGlow />
      <group ref={groupRef} position={[0, 0.5, 0]}>
        {/* Initial tilt applied via useFrame */}
        <group>
          <InnerTorus />
          <WireframeTorus />
          <HexShell />
          <SurfaceParticles />
        </group>
      </group>
      <OrbitalRings />
      <AmbientParticles />
    </>
  );
}

/* ══════════════════════════════════════════════
   Exported client component
   ══════════════════════════════════════════════ */
export default function TokamakGate() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <div
      id="tokamak-gate"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 5 }}
    >
      <Canvas
        camera={{ position: [0, 1.0, 4], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        onCreated={handleCreated}
      >
        <TorusScene />
      </Canvas>
    </div>
  );
}
