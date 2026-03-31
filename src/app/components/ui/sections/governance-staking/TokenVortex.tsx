"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree, RootState } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  IcosahedronGeometry,
  ShaderMaterial,
  AdditiveBlending,
  DoubleSide,
  BackSide,
  Mesh,
} from "three";

/* ═══════════════════════════════════════════════
   Resize helper (preserved exactly)
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
   HexShield — main mesh with per-cell pulsing shader
   IcosahedronGeometry detail=3 gives ~320 triangular
   faces that visually approximate hex tessellation.
   ═══════════════════════════════════════════════ */

const hexShieldVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;

  void main() {
    vNormal    = normalize(normalMatrix * normal);
    vLocalPos  = position;
    vec4 wp    = modelMatrix * vec4(position, 1.0);
    vWorldPos  = wp.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const hexShieldFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vLocalPos;

  // Cheap hash for per-cell variation
  float hash(vec3 p) {
    p = fract(p * vec3(127.1, 311.7, 74.7));
    p += dot(p, p.yxz + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  void main() {
    // Fresnel — edges brighter
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);

    // Cell id from quantised position (simulates hex cells)
    vec3 cellPos = floor(vLocalPos * 3.5);
    float cellId = hash(cellPos);

    // Independent per-cell pulse (0.25 – 1.0 range)
    float pulse = 0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * (1.0 + cellId * 2.0) + cellId * 6.283));

    // Edge wireframe glow: detect near-edge triangles via barycentrics
    // We approximate edge proximity using fwidth on local pos
    float edgeFactor = length(fwidth(vLocalPos)) * 40.0;
    edgeFactor = clamp(edgeFactor, 0.0, 1.0);

    // Combine layers
    float alpha = uOpacity * (fresnel * 0.7 + pulse * 0.3 + edgeFactor * 0.25);
    alpha = clamp(alpha, 0.0, 0.85);

    gl_FragColor = vec4(uColor * (0.6 + pulse * 0.4 + fresnel * 0.8), alpha);
  }
`;

function HexShield() {
  const meshRef = useRef<Mesh>(null!);

  const geometry = useMemo(() => new IcosahedronGeometry(2.0, 3), []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: hexShieldVert,
        fragmentShader: hexShieldFrag,
        uniforms: {
          uTime:    { value: 0 },
          uColor:   { value: [0.0, 0.898, 1.0] }, // #00e5ff
          uOpacity: { value: 0.32 },
        },
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        side: DoubleSide,
      }),
    [],
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.06;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      scale={[1.0, 0.75, 1.0]}
    />
  );
}

/* ═══════════════════════════════════════════════
   ShieldWireframe — wireframe overlay on same geo
   ═══════════════════════════════════════════════ */

const wireVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vec4 wp   = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const wireFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;

  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 1.8);
    float pulse = 0.5 + 0.5 * sin(uTime * 0.8);
    float alpha = (0.10 + fresnel * 0.12) * (0.75 + pulse * 0.25);
    gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 0.35));
  }
`;

function ShieldWireframe() {
  const meshRef = useRef<Mesh>(null!);

  const geometry = useMemo(() => new IcosahedronGeometry(2.0, 3), []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: wireVert,
        fragmentShader: wireFrag,
        uniforms: {
          uTime:  { value: 0 },
          uColor: { value: [0.0, 0.898, 1.0] },
        },
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        wireframe: true,
      }),
    [],
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015;
      meshRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.06;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      scale={[1.01, 0.758, 1.01]}
    />
  );
}

/* ═══════════════════════════════════════════════
   ShieldGlow — outer atmosphere halo, BackSide
   ═══════════════════════════════════════════════ */

const glowVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vec4 wp   = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;

  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    // BackSide: normal points inward, so flip for fresnel
    float rim = pow(1.0 - abs(dot(-vNormal, viewDir)), 2.2);
    float pulse = 0.85 + 0.15 * sin(uTime * 0.6);
    float alpha = rim * 0.13 * pulse;
    gl_FragColor = vec4(uColor, clamp(alpha, 0.0, 0.18));
  }
`;

function ShieldGlow() {
  const meshRef = useRef<Mesh>(null!);

  const geometry = useMemo(() => new IcosahedronGeometry(2.0, 2), []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: glowVert,
        fragmentShader: glowFrag,
        uniforms: {
          uTime:  { value: 0 },
          uColor: { value: [0.0, 0.898, 1.0] },
        },
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        side: BackSide,
      }),
    [],
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      scale={[1.25, 0.94, 1.25]}
    />
  );
}

/* ═══════════════════════════════════════════════
   Combined scene
   ═══════════════════════════════════════════════ */

function ShieldScene() {
  return (
    <>
      <ShieldGlow />
      <HexShield />
      <ShieldWireframe />
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
        left: "5%",
        right: "5%",
        top: "5%",
        bottom: "10%",
        zIndex: 5,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
        onCreated={handleCreated}
      >
        <ResizeHelper />
        <ShieldScene />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.4}
            luminanceSmoothing={0.85}
            intensity={0.6}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
