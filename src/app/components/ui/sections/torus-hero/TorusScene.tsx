"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree, RootState } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  Mesh,
  CanvasTexture,
  RepeatWrapping,
  Group,
} from "three";

/**
 * Helical stripe texture matching the Tokamak Network logo:
 * cyan diagonal stripes on dark, wound around the torus tube.
 */
function createHelicalStripeTexture(): CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // White base
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);

  // Cyan helical stripes
  const stripeCount = 14;
  const stripeWidth = size / stripeCount;

  ctx.fillStyle = "#2A72E5";
  for (let i = -stripeCount; i < stripeCount * 2; i++) {
    ctx.beginPath();
    const x0 = i * stripeWidth;
    ctx.moveTo(x0, 0);
    ctx.lineTo(x0 + stripeWidth * 0.45, 0);
    ctx.lineTo(x0 + size + stripeWidth * 0.45, size);
    ctx.lineTo(x0 + size, size);
    ctx.closePath();
    ctx.fill();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  return texture;
}

/** Force renderer to match parent container size */
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
    // Initial size set
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

function TokamakTorus({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<Group>(null!);
  const meshRef = useRef<Mesh>(null!);

  const stripeTexture = useMemo(() => {
    if (typeof document === "undefined") return null;
    return createHelicalStripeTexture();
  }, []);

  useEffect(() => {
    return () => {
      stripeTexture?.dispose();
    };
  }, [stripeTexture]);

  useFrame((_, delta) => {
    // Spin the outer group around world Y axis (horizontal rotation)
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.15 * delta;
      const scale = 1 - scrollProgress * 0.3;
      groupRef.current.scale.setScalar(Math.max(scale, 0.4));
    }
  });

  if (!stripeTexture) return null;

  return (
    <group ref={groupRef} position={[0, 2.2, 0]}>
      {/* Inner group lays the torus flat (XY → XZ plane) */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[3.5, 0.9, 64, 128]} />
          <meshStandardMaterial
            map={stripeTexture}
            emissive="#2A72E5"
            emissiveIntensity={0.8}
            emissiveMap={stripeTexture}
            metalness={0.5}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function TorusScene({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  const handleCreated = useCallback((state: RootState) => {
    const canvas = state.gl.domElement;
    // R3F wraps the canvas in a div — force it to fill
    const wrapper = canvas.parentElement;
    if (wrapper) {
      wrapper.style.position = "absolute";
      wrapper.style.top = "0";
      wrapper.style.left = "0";
      wrapper.style.width = "100%";
      wrapper.style.height = "100%";
    }
    // Also force canvas itself
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
  }, []);

  return (
    <div
      id="torus-canvas-wrapper"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 1 - scrollProgress * 0.7,
      }}
    >
      <Canvas
        camera={{ position: [0, -1, 6], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        onCreated={handleCreated}
      >
        <ResizeHelper />
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 8, 5]} intensity={0.8} />
        {/* Blue light from above — directional to avoid visible orb behind torus */}
        <directionalLight position={[0, 5, 2]} intensity={1.2} color="#2A72E5" />
        <directionalLight position={[0, 3, -2]} intensity={0.6} color="#1a4a8a" />
        <TokamakTorus scrollProgress={scrollProgress} />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
            intensity={1.2}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
