"use client";

import { useRef, useMemo, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree, RootState } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  BufferGeometry,
  Float32BufferAttribute,
  ShaderMaterial,
  AdditiveBlending,
  Points,
  SphereGeometry,
  Mesh,
  Color,
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
   Plasma Vortex — particles orbiting reactor
   vessel in toroidal flow with trailing streaks
   ═══════════════════════════════════════════════ */

const DOT_COUNT = 400;
const TRAIL_COUNT = 200;
const TRAIL_LEN = 6; // positions per trail

/* ── Main dot particles ── */

const dotVert = /* glsl */ `
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aOrbitRadius;
  attribute float aBrightness;
  attribute float aYOffset;
  attribute float aYAmp;

  uniform float uTime;

  varying float vAlpha;
  varying float vBrightness;

  void main() {
    float t = uTime * aSpeed + aPhase;
    float angle = t;

    float x = cos(angle) * aOrbitRadius;
    float z = sin(angle) * aOrbitRadius;
    float y = aYOffset + sin(t * 0.7 + aPhase * 3.0) * aYAmp;

    vec3 pos = vec3(x, y, z);

    // Depth fade: behind reactor is dimmer, front is brighter
    float depthFade = 0.15 + 0.85 * smoothstep(-2.0, 1.5, pos.z);

    vAlpha = aBrightness * depthFade;
    vBrightness = aBrightness;

    // Size scales with depth
    float size = (3.0 + aBrightness * 4.0) * (0.7 + depthFade * 0.5);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = size * (320.0 / -mvPos.z);
  }
`;

const dotFrag = /* glsl */ `
  uniform vec3 uColor;

  varying float vAlpha;
  varying float vBrightness;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;

    // Radial glow: bright core, soft falloff
    float glow = exp(-d * d * 2.5);
    float core = smoothstep(0.5, 0.0, d);

    // Bright cyan core + softer glow
    vec3 coreColor = mix(uColor, vec3(0.7, 0.94, 1.0), core * 0.6);
    float alpha = vAlpha * (glow * 0.7 + core * 0.3);

    gl_FragColor = vec4(coreColor, alpha);
  }
`;

function DotParticles() {
  const pointsRef = useRef<Points>(null!);

  const { geometry, material } = useMemo(() => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(DOT_COUNT * 3);
    const phases = new Float32Array(DOT_COUNT);
    const speeds = new Float32Array(DOT_COUNT);
    const orbitRadii = new Float32Array(DOT_COUNT);
    const brightnesses = new Float32Array(DOT_COUNT);
    const yOffsets = new Float32Array(DOT_COUNT);
    const yAmps = new Float32Array(DOT_COUNT);

    for (let i = 0; i < DOT_COUNT; i++) {
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.15 + Math.random() * 0.45;
      orbitRadii[i] = 1.0 + Math.random() * 1.4; // match demo: 120-280px → 1.0-2.4 units
      brightnesses[i] = 0.3 + Math.random() * 0.7;
      yOffsets[i] = (Math.random() - 0.5) * 1.8;
      yAmps[i] = 0.15 + Math.random() * 0.35;
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
    }

    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setAttribute("aPhase", new Float32BufferAttribute(phases, 1));
    geo.setAttribute("aSpeed", new Float32BufferAttribute(speeds, 1));
    geo.setAttribute("aOrbitRadius", new Float32BufferAttribute(orbitRadii, 1));
    geo.setAttribute("aBrightness", new Float32BufferAttribute(brightnesses, 1));
    geo.setAttribute("aYOffset", new Float32BufferAttribute(yOffsets, 1));
    geo.setAttribute("aYAmp", new Float32BufferAttribute(yAmps, 1));

    const mat = new ShaderMaterial({
      vertexShader: dotVert,
      fragmentShader: dotFrag,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(0x00e5ff) },
      },
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}

/* ── Trail particles — each trail = TRAIL_LEN fading dots ── */

const trailVert = /* glsl */ `
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aOrbitRadius;
  attribute float aBrightness;
  attribute float aYOffset;
  attribute float aYAmp;
  attribute float aTailIndex; // 0 = head, 1..N = older positions

  uniform float uTime;
  uniform float uTailLen;

  varying float vAlpha;

  void main() {
    float tailFade = 1.0 - aTailIndex / uTailLen;

    float t = uTime * aSpeed + aPhase - aTailIndex * 0.04;
    float angle = t;

    float x = cos(angle) * aOrbitRadius;
    float z = sin(angle) * aOrbitRadius;
    float y = aYOffset + sin(t * 0.7 + aPhase * 3.0) * aYAmp;

    vec3 pos = vec3(x, y, z);

    float depthFade = 0.15 + 0.85 * smoothstep(-2.0, 1.5, pos.z);

    vAlpha = aBrightness * depthFade * tailFade;

    float size = (1.5 + aBrightness * 2.0) * tailFade * (0.7 + depthFade * 0.3);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = max(size * (280.0 / -mvPos.z), 0.5);
  }
`;

const trailFrag = /* glsl */ `
  uniform vec3 uColor;

  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;

    float softness = 1.0 - d * d;
    gl_FragColor = vec4(uColor, vAlpha * softness);
  }
`;

function TrailParticles() {
  const pointsRef = useRef<Points>(null!);

  const { geometry, material } = useMemo(() => {
    const totalPoints = TRAIL_COUNT * TRAIL_LEN;
    const geo = new BufferGeometry();
    const positions = new Float32Array(totalPoints * 3);
    const phases = new Float32Array(totalPoints);
    const speeds = new Float32Array(totalPoints);
    const orbitRadii = new Float32Array(totalPoints);
    const brightnesses = new Float32Array(totalPoints);
    const yOffsets = new Float32Array(totalPoints);
    const yAmps = new Float32Array(totalPoints);
    const tailIndices = new Float32Array(totalPoints);

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const phase = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.6;
      const radius = 0.85 + Math.random() * 1.55;
      const brightness = 0.15 + Math.random() * 0.4;
      const yOff = (Math.random() - 0.5) * 1.6;
      const yAmp = 0.12 + Math.random() * 0.25;

      for (let k = 0; k < TRAIL_LEN; k++) {
        const idx = i * TRAIL_LEN + k;
        phases[idx] = phase;
        speeds[idx] = speed;
        orbitRadii[idx] = radius;
        brightnesses[idx] = brightness;
        yOffsets[idx] = yOff;
        yAmps[idx] = yAmp;
        tailIndices[idx] = k;
        positions[idx * 3] = 0;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = 0;
      }
    }

    geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geo.setAttribute("aPhase", new Float32BufferAttribute(phases, 1));
    geo.setAttribute("aSpeed", new Float32BufferAttribute(speeds, 1));
    geo.setAttribute("aOrbitRadius", new Float32BufferAttribute(orbitRadii, 1));
    geo.setAttribute("aBrightness", new Float32BufferAttribute(brightnesses, 1));
    geo.setAttribute("aYOffset", new Float32BufferAttribute(yOffsets, 1));
    geo.setAttribute("aYAmp", new Float32BufferAttribute(yAmps, 1));
    geo.setAttribute("aTailIndex", new Float32BufferAttribute(tailIndices, 1));

    const mat = new ShaderMaterial({
      vertexShader: trailVert,
      fragmentShader: trailFrag,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(0x00e5ff) },
        uTailLen: { value: TRAIL_LEN },
      },
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
    });

    return { geometry: geo, material: mat };
  }, []);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}

/* ── Subtle core glow at reactor center ── */

const coreVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vNormal   = normalize(normalMatrix * normal);
    vec4 wp   = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coreFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColor;

  varying vec3 vNormal;
  varying vec3 vWorldPos;

  void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float facing = abs(dot(vNormal, viewDir));

    float pulse = 0.7 + 0.3 * sin(uTime * 0.8);
    float alpha = facing * facing * 0.06 * pulse;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

function CoreGlow() {
  const meshRef = useRef<Mesh>(null!);
  const geometry = useMemo(() => new SphereGeometry(0.6, 20, 20), []);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: coreVert,
        fragmentShader: coreFrag,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new Color(0x00e5ff) },
        },
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} />;
}

/* ═══════════════════════════════════════════════
   Combined scene
   ═══════════════════════════════════════════════ */

function VortexScene() {
  return (
    <>
      <DotParticles />
      <TrailParticles />
      <CoreGlow />
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
        <VortexScene />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.5}
            luminanceSmoothing={0.9}
            intensity={0.4}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
