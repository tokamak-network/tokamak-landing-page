"use client";

import { Suspense, useState, useCallback, useMemo, useRef } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader, Texture, Group } from "three";
import RubiksCube from "./RubiksCube";
import CubeOverlay from "./CubeOverlay";
import { BG_COLOR, getAllTexturePaths } from "./constants";
import { useCubeData } from "./useCubeData";

interface SelectedCell {
  face: string;
  row: number;
  col: number;
  category: string;
}

const ALL_PATHS = getAllTexturePaths();

function CubeWithTextures({
  onCellClick,
}: {
  onCellClick: (
    face: string,
    row: number,
    col: number,
    category: string
  ) => void;
}) {
  const textures = useLoader(TextureLoader, ALL_PATHS);
  const cubeData = useCubeData();
  const groupRef = useRef<Group>(null!);
  const [cubeHovered, setCubeHovered] = useState(false);
  const rotSpeedRef = useRef(0);

  const textureMap = useMemo(() => {
    const map = new Map<string, Texture>();
    ALL_PATHS.forEach((path, i) => {
      map.set(path, textures[i]);
    });
    return map;
  }, [textures]);

  useFrame((_, delta) => {
    const target = cubeHovered ? 0 : 0.35;
    rotSpeedRef.current += (target - rotSpeedRef.current) * 0.05;
    if (groupRef.current) {
      groupRef.current.rotation.y += rotSpeedRef.current * delta;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => setCubeHovered(true)}
      onPointerOut={() => setCubeHovered(false)}
    >
      <RubiksCube
        textureMap={textureMap}
        cubeData={cubeData}
        onCellClick={onCellClick}
      />
    </group>
  );
}

export default function RubiksCubeScene() {
  const [selected, setSelected] = useState<SelectedCell | null>(null);
  const cubeData = useCubeData();

  const handleCellClick = useCallback(
    (face: string, row: number, col: number, category: string) => {
      setSelected({ face, row, col, category });
    },
    []
  );

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: BG_COLOR,
        position: "relative",
      }}
    >
      <Canvas
        camera={{ position: [4, 3, 4], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={0.7} />
        <directionalLight position={[-3, -2, -4]} intensity={0.2} />
        <Suspense fallback={null}>
          <CubeWithTextures onCellClick={handleCellClick} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.1}
        />
      </Canvas>

      {selected && (
        <CubeOverlay
          face={selected.face}
          row={selected.row}
          col={selected.col}
          category={selected.category}
          cubeData={cubeData}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
