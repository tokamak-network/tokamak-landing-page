"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { FlowCategory } from "./index";

/* ────────────────────────────────────────────
   Utilities
   ──────────────────────────────────────────── */

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

function fibonacciSphere(count: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push(
      new THREE.Vector3(
        Math.cos(theta) * radiusAtY,
        y,
        Math.sin(theta) * radiusAtY
      )
    );
  }
  return points;
}

function createArc(
  from: THREE.Vector3,
  to: THREE.Vector3,
  sphereRadius: number,
  bulge = 0.3
): THREE.QuadraticBezierCurve3 {
  const mid = new THREE.Vector3()
    .addVectors(from, to)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(sphereRadius * (1 + bulge));
  return new THREE.QuadraticBezierCurve3(from, mid, to);
}

/** Create a canvas texture with text for labeling nodes */
function makeTextSprite(
  text: string,
  fontSize: number,
  color: string,
  bold = false
): THREE.Sprite {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const font = `${bold ? "bold " : ""}${fontSize}px Orbitron, system-ui, sans-serif`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const w = Math.ceil(metrics.width) + 16;
  const h = fontSize + 12;
  canvas.width = w * 2;
  canvas.height = h * 2;
  ctx.scale(2, 2);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(mat);
  const aspect = w / h;
  const scale = 0.35;
  sprite.scale.set(scale * aspect, scale, 1);
  return sprite;
}

/* ────────────────────────────────────────────
   Build the scene graph
   ──────────────────────────────────────────── */

interface SceneData {
  scene: THREE.Scene;
  mainGroup: THREE.Group;
  wireframe: THREE.LineSegments;
  pulses: {
    mesh: THREE.InstancedMesh;
    data: { curve: THREE.QuadraticBezierCurve3; speed: number; offset: number }[];
  };
  arcs: THREE.Line[];
}

function buildScene(categories: FlowCategory[], totalRepos: number): SceneData {
  const scene = new THREE.Scene();
  const mainGroup = new THREE.Group();
  scene.add(mainGroup);

  const SPHERE_RADIUS = 1.5;

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
  const point1 = new THREE.PointLight(0xffffff, 0.8);
  point1.position.set(5, 5, 5);
  scene.add(point1);
  const point2 = new THREE.PointLight(0x0077ff, 0.3);
  point2.position.set(-3, -3, 2);
  scene.add(point2);

  // ── Wireframe Globe ──
  const icoGeo = new THREE.IcosahedronGeometry(SPHERE_RADIUS, 2);
  const wireGeo = new THREE.WireframeGeometry(icoGeo);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x0077ff,
    opacity: 0.08,
    transparent: true,
  });
  const wireframe = new THREE.LineSegments(wireGeo, wireMat);
  mainGroup.add(wireframe);

  // ── Atmosphere glow ──
  const atmosGeo = new THREE.SphereGeometry(SPHERE_RADIUS * 1.15, 32, 32);
  const atmosMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(0x0077ff) } },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
        gl_FragColor = vec4(uColor, intensity * 0.4);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
  });
  mainGroup.add(new THREE.Mesh(atmosGeo, atmosMat));

  // ── Center node ──
  const centerGeo = new THREE.SphereGeometry(0.15, 32, 32);
  const centerMat = new THREE.MeshStandardMaterial({
    color: 0x0077ff,
    emissive: 0x0077ff,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.5,
  });
  mainGroup.add(new THREE.Mesh(centerGeo, centerMat));

  // Center label
  const centerLabel = makeTextSprite("TOKAMAK", 28, "#ffffff", true);
  centerLabel.position.set(0, -0.28, 0);
  mainGroup.add(centerLabel);
  const repoLabel = makeTextSprite(`${totalRepos} Projects`, 20, "#9ca3af");
  repoLabel.position.set(0, -0.45, 0);
  mainGroup.add(repoLabel);

  // ── Category nodes on sphere ──
  const nodePositions = fibonacciSphere(categories.length).map((p) =>
    p.multiplyScalar(SPHERE_RADIUS)
  );

  const totalLines = categories.map((cat) =>
    cat.repos.reduce((s, r) => s + r.linesChanged, 0)
  );
  const maxLines = Math.max(...totalLines, 1);

  categories.forEach((cat, i) => {
    const pos = nodePositions[i];
    const normalized = totalLines[i] / maxLines;
    const nodeRadius = 0.06 + normalized * 0.1;

    // Glow sphere
    const glowGeo = new THREE.SphereGeometry(nodeRadius * 1.8, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: cat.color,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.copy(pos);
    mainGroup.add(glow);

    // Main sphere
    const nodeGeo = new THREE.SphereGeometry(nodeRadius, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: cat.color,
      emissive: new THREE.Color(cat.color),
      emissiveIntensity: 0.3,
      roughness: 0.4,
      metalness: 0.3,
    });
    const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
    nodeMesh.position.copy(pos);
    mainGroup.add(nodeMesh);

    // Name label
    const nameSprite = makeTextSprite(cat.name, 20, "#ffffff", true);
    nameSprite.position.set(pos.x, pos.y - nodeRadius - 0.15, pos.z);
    mainGroup.add(nameSprite);

    // Lines changed label
    const linesSprite = makeTextSprite(
      formatNum(totalLines[i]),
      16,
      "#9ca3af"
    );
    linesSprite.position.set(pos.x, pos.y - nodeRadius - 0.32, pos.z);
    mainGroup.add(linesSprite);
  });

  // ── Arcs: center → nodes ──
  const center = new THREE.Vector3(0, 0, 0);
  const allArcs: THREE.Line[] = [];
  const allPulseData: { curve: THREE.QuadraticBezierCurve3; speed: number; offset: number }[] = [];

  nodePositions.forEach((pos, i) => {
    const curve = createArc(center, pos, SPHERE_RADIUS, 0.25);
    const points = curve.getPoints(64);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
    const arcMat = new THREE.LineDashedMaterial({
      color: categories[i].color,
      opacity: 0.35,
      transparent: true,
      dashSize: 0.08,
      gapSize: 0.04,
    });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    arcLine.computeLineDistances();
    mainGroup.add(arcLine);
    allArcs.push(arcLine);

    // Pulses per arc
    const pulseCount = Math.max(1, Math.min(3, Math.ceil(totalLines[i] / 100000)));
    for (let j = 0; j < pulseCount; j++) {
      allPulseData.push({
        curve,
        speed: 0.15 + Math.random() * 0.15,
        offset: j / pulseCount + Math.random() * 0.1,
      });
    }
  });

  // ── Cross arcs between adjacent nodes ──
  for (let i = 0; i < nodePositions.length; i++) {
    const next = (i + 1) % nodePositions.length;
    const dist = nodePositions[i].distanceTo(nodePositions[next]);
    if (dist < SPHERE_RADIUS * 2.5) {
      const curve = createArc(nodePositions[i], nodePositions[next], SPHERE_RADIUS, 0.25);
      const pts = curve.getPoints(64);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineDashedMaterial({
        color: categories[i].color,
        opacity: 0.2,
        transparent: true,
        dashSize: 0.08,
        gapSize: 0.04,
      });
      const line = new THREE.Line(geo, mat);
      line.computeLineDistances();
      mainGroup.add(line);
      allArcs.push(line);
    }
  }

  // ── Instanced pulses ──
  const pulseGeo = new THREE.SphereGeometry(1, 8, 8);
  const pulseMat = new THREE.MeshBasicMaterial({
    color: 0x0077ff,
    transparent: true,
    opacity: 0.9,
  });
  const pulseMesh = new THREE.InstancedMesh(pulseGeo, pulseMat, allPulseData.length);
  mainGroup.add(pulseMesh);

  // ── Star field ──
  const starCount = 200;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 5 + Math.random() * 2;
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    starPos[i * 3 + 2] = r * Math.cos(phi);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.015,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
  });
  const stars = new THREE.Points(starGeo, starMat);
  mainGroup.add(stars);

  return {
    scene,
    mainGroup,
    wireframe,
    pulses: { mesh: pulseMesh, data: allPulseData },
    arcs: allArcs,
  };
}

/* ────────────────────────────────────────────
   Main Component (raw Three.js)
   ──────────────────────────────────────────── */

interface EcosystemGlobeProps {
  categories: FlowCategory[];
  totalRepos: number;
}

export default function EcosystemGlobe({
  categories,
  totalRepos,
}: EcosystemGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Renderer ──
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      // WebGL not available (e.g. headless browser, old GPU)
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── Camera ──
    const rect = container.getBoundingClientRect();
    const camera = new THREE.PerspectiveCamera(45, rect.width / rect.height, 0.1, 100);
    camera.position.set(0, 0, 4);

    // ── Scene ──
    const sceneData = buildScene(categories, totalRepos);

    // ── Controls ──
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = false;
    controls.minPolarAngle = Math.PI * 0.3;
    controls.maxPolarAngle = Math.PI * 0.7;
    controls.rotateSpeed = 0.5;
    controls.dampingFactor = 0.1;
    controls.enableDamping = true;

    // ── Sizing ──
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ── Visibility (perf) ──
    let isVisible = true;
    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(container);

    // ── Animation ──
    const clock = new THREE.Clock();
    const dummy = new THREE.Object3D();
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slow rotation
      sceneData.mainGroup.rotation.y += delta * 0.05;
      sceneData.wireframe.rotation.y += delta * 0.02;

      // Animate dash offsets
      sceneData.arcs.forEach((arc) => {
        const mat = arc.material as THREE.LineDashedMaterial & { dashOffset: number };
        mat.dashOffset -= delta * 0.5;
      });

      // Animate pulses
      const { mesh, data } = sceneData.pulses;
      for (let i = 0; i < data.length; i++) {
        const p = data[i];
        const progress = ((elapsed * p.speed + p.offset) % 1 + 1) % 1;
        const point = p.curve.getPoint(progress);
        dummy.position.copy(point);
        const scale = 0.03 + Math.sin(progress * Math.PI) * 0.02;
        dummy.scale.setScalar(scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;

      controls.update();
      renderer.render(sceneData.scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [categories, totalRepos]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[1200px] mx-auto relative"
      style={{ height: 600 }}
    >
      {/* Bottom gradient overlay for blending with page */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </div>
  );
}
