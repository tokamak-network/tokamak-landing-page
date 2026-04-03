"use client";

import { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Mesh, Texture, CanvasTexture, MeshBasicMaterial } from "three";
import {
  FACE_ORDER,
  getTexturePath,
  INNER_COLOR,
  CELL_DATA_MAP,
  getOverlayTransform,
} from "./constants";
import type { CubeData } from "./useCubeData";

interface CubeCellProps {
  position: [number, number, number];
  gx: number;
  gy: number;
  gz: number;
  textureMap: Map<string, Texture>;
  cubeData: CubeData;
  onCellClick: (
    face: string,
    row: number,
    col: number,
    category: string
  ) => void;
}

/**
 * Draw animated data overlay onto canvas.
 * Called at ~15fps in useFrame for smooth flowing effect.
 */
function drawDataCanvas(
  canvas: HTMLCanvasElement,
  label: string,
  value: string,
  time: number,
  hovered: boolean
) {
  const S = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, S, S);

  // ── Dark backdrop ──
  const bgAlpha = hovered ? 0.82 : 0.65;
  ctx.fillStyle = `rgba(6, 8, 16, ${bgAlpha})`;
  ctx.beginPath();
  ctx.roundRect(6, 6, S - 12, S - 12, 14);
  ctx.fill();

  // ── Flowing scan-line gradient ──
  const scanY = ((time * 50) % (S + 60)) - 30;
  const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
  grad.addColorStop(0, "rgba(99, 102, 241, 0)");
  grad.addColorStop(0.5, `rgba(99, 102, 241, ${hovered ? 0.22 : 0.1})`);
  grad.addColorStop(1, "rgba(99, 102, 241, 0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(6, 6, S - 12, S - 12, 14);
  ctx.fill();

  // ── Border with pulse ──
  const borderAlpha = hovered
    ? 0.25 + Math.sin(time * 3) * 0.1
    : 0.08 + Math.sin(time * 2) * 0.04;
  ctx.strokeStyle = `rgba(99, 102, 241, ${borderAlpha})`;
  ctx.lineWidth = hovered ? 1.5 : 1;
  ctx.beginPath();
  ctx.roundRect(6, 6, S - 12, S - 12, 14);
  ctx.stroke();

  // ── Label ──
  ctx.fillStyle = `rgba(180, 200, 255, ${hovered ? 0.85 : 0.55})`;
  ctx.font = "600 17px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, S / 2, S / 2 - 30);

  // ── Value (subtle pulse) ──
  const vPulse = hovered ? 1.0 : 0.97 + Math.sin(time * 1.5) * 0.03;
  const fSize = Math.round(38 * vPulse);
  ctx.fillStyle = hovered ? "#ffffff" : "rgba(255,255,255,0.88)";
  ctx.font = `bold ${fSize}px sans-serif`;
  ctx.fillText(value, S / 2, S / 2 + 20);

  // ── Live dot ──
  const dotPulse = 0.5 + Math.sin(time * 3) * 0.5;
  ctx.fillStyle = `rgba(74, 222, 128, ${dotPulse})`;
  ctx.beginPath();
  ctx.arc(S / 2 - 18, S / 2 + 54, 3.5, 0, Math.PI * 2);
  ctx.fill();
  // Glow ring
  ctx.strokeStyle = `rgba(74, 222, 128, ${dotPulse * 0.3})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(S / 2 - 18, S / 2 + 54, 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = `rgba(74, 222, 128, ${0.4 + dotPulse * 0.3})`;
  ctx.font = "11px sans-serif";
  ctx.fillText("LIVE", S / 2 + 4, S / 2 + 58);
}

export default function CubeCell({
  position,
  gx,
  gy,
  gz,
  textureMap,
  cubeData,
  onCellClick,
}: CubeCellProps) {
  const meshRef = useRef<Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  const scaleRef = useRef(1);
  const overlayOpacityRef = useRef(0);
  const overlayMatRef = useRef<MeshBasicMaterial>(null!);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const lastDrawFrame = useRef(-1);

  // Keep hovered in ref for useFrame access without re-render deps
  hoveredRef.current = hovered;

  // Resolve textures for each of 6 faces
  const faceTextures = useMemo(() => {
    return FACE_ORDER.map((face) => {
      const path = getTexturePath(face, gx, gy, gz);
      return path ? textureMap.get(path) ?? null : null;
    });
  }, [gx, gy, gz, textureMap]);

  // Find data entry for this cell
  const cellMeta = useMemo(() => {
    const checks = [
      { face: "top", condition: gy === 2, row: 2 - gz, col: gx },
      { face: "front", condition: gz === 2, row: 2 - gy, col: gx },
      { face: "right", condition: gx === 2, row: 2 - gy, col: gz },
    ];
    for (const c of checks) {
      if (c.condition) {
        const key = `${c.face}-${c.row}-${c.col}`;
        const entry = CELL_DATA_MAP[key];
        if (entry) return { key, entry };
      }
    }
    return null;
  }, [gx, gy, gz]);

  const hasData = cellMeta !== null;

  // Stable canvas + texture refs (created once, drawn in useFrame)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasTexRef = useRef<CanvasTexture | null>(null);

  // Keep formatted value in ref for useFrame
  const formattedRef = useRef({ label: "", value: "" });
  useEffect(() => {
    if (cellMeta) {
      const raw = cubeData[cellMeta.entry.metricKey] ?? 0;
      formattedRef.current = {
        label: cellMeta.entry.label,
        value: cellMeta.entry.format(raw),
      };
    }
  }, [cellMeta, cubeData]);

  // Lazily create canvas + texture
  if (hasData && !canvasRef.current) {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    canvasRef.current = c;
    canvasTexRef.current = new CanvasTexture(c);
  }

  // Dispose texture on unmount to free GPU memory
  useEffect(() => {
    return () => {
      if (canvasTexRef.current) {
        canvasTexRef.current.dispose();
        canvasTexRef.current = null;
      }
    };
  }, []);

  const overlayTransform = useMemo(() => {
    if (!cellMeta) return null;
    return getOverlayTransform(cellMeta.entry.primaryFace);
  }, [cellMeta]);

  // Animation loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Scale animation
    const scaleTarget = hoveredRef.current ? 1.08 : 1.0;
    scaleRef.current += (scaleTarget - scaleRef.current) * 0.15;
    if (meshRef.current) {
      const s = scaleRef.current;
      meshRef.current.scale.set(s, s, s);
    }

    if (!hasData) return;

    // Update canvas at ~15fps
    const frame = Math.floor(t * 15);
    if (frame !== lastDrawFrame.current && canvasRef.current && canvasTexRef.current) {
      lastDrawFrame.current = frame;
      drawDataCanvas(
        canvasRef.current,
        formattedRef.current.label,
        formattedRef.current.value,
        t,
        hoveredRef.current
      );
      canvasTexRef.current.needsUpdate = true;
    }

    // Overlay opacity: always visible at base, brighter on hover
    if (overlayMatRef.current) {
      const basePulse = 0.38 + Math.sin(t * 1.2) * 0.06;
      const target = hoveredRef.current ? 0.92 : basePulse;
      overlayOpacityRef.current +=
        (target - overlayOpacityRef.current) * 0.1;
      overlayMatRef.current.opacity = overlayOpacityRef.current;
    }
  });

  const handlePointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!pointerDownPos.current) return;
      const dx = e.clientX - pointerDownPos.current.x;
      const dy = e.clientY - pointerDownPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      pointerDownPos.current = null;

      if (dist < 5 && e.face) {
        const normal = e.face.normal;
        let faceName = "";
        let row = 0;
        let col = 0;

        if (Math.abs(normal.x) > 0.5) {
          faceName = normal.x > 0 ? "right" : "left";
          row = 2 - gy;
          col = normal.x > 0 ? gz : 2 - gz;
        } else if (Math.abs(normal.y) > 0.5) {
          faceName = normal.y > 0 ? "top" : "bottom";
          row = normal.y > 0 ? 2 - gz : gz;
          col = gx;
        } else {
          faceName = normal.z > 0 ? "front" : "back";
          row = 2 - gy;
          col = normal.z > 0 ? gx : 2 - gx;
        }

        const key = `${faceName}-${row}-${col}`;
        const dataEntry = CELL_DATA_MAP[key];
        const category = dataEntry?.category ?? faceName;
        onCellClick(faceName, row, col, category);
      }
    },
    [gx, gy, gz, onCellClick]
  );

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <boxGeometry args={[1, 1, 1]} />
        {faceTextures.map((tex, i) =>
          tex ? (
            <meshStandardMaterial key={i} attach={`material-${i}`} map={tex} />
          ) : (
            <meshStandardMaterial
              key={i}
              attach={`material-${i}`}
              color={INNER_COLOR}
            />
          )
        )}
      </mesh>

      {/* Data overlay - always visible with flowing animation */}
      {hasData && overlayTransform && canvasTexRef.current && (
        <mesh
          position={overlayTransform.position}
          rotation={overlayTransform.rotation}
        >
          <planeGeometry args={[0.94, 0.94]} />
          <meshBasicMaterial
            ref={overlayMatRef}
            map={canvasTexRef.current}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
