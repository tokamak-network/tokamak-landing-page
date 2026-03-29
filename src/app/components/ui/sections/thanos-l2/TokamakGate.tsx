"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree, RootState } from "@react-three/fiber";
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
   Ambient particles — floating motes across section
   ═══════════════════════════════════════════════ */

const MOTE_COUNT = 150;

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
      radii[i] = 2.0 + Math.random() * 4.0;
      speeds[i] = 0.04 + Math.random() * 0.08;
      yOffsets[i] = (Math.random() - 0.5) * 5.0;
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
      posAttr.setXYZ(
        i,
        Math.cos(angle) * r,
        yOffsets[i] + Math.sin(t * 0.3 + phases[i]) * 0.5,
        Math.sin(angle) * r,
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
        color="#00e5ff"
        size={0.04}
        transparent
        opacity={0.35}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   Main Export — full section particle overlay
   ═══════════════════════════════════════════════ */

export default function TokamakGate() {
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
      id="tokamak-gate"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 6 }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        onCreated={handleCreated}
      >
        <ResizeHelper />
        <AmbientMotes />
      </Canvas>
    </div>
  );
}
