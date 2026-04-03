"use client";

import React from "react";
import { Texture } from "three";
import { STEP } from "./constants";
import type { CubeData } from "./useCubeData";
import CubeCell from "./CubeCell";

interface RubiksCubeProps {
  textureMap: Map<string, Texture>;
  cubeData: CubeData;
  onCellClick: (
    face: string,
    row: number,
    col: number,
    category: string
  ) => void;
}

export default function RubiksCube({
  textureMap,
  cubeData,
  onCellClick,
}: RubiksCubeProps) {
  const cells: React.ReactElement[] = [];

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      for (let z = 0; z < 3; z++) {
        cells.push(
          <CubeCell
            key={`${x}-${y}-${z}`}
            position={[(x - 1) * STEP, (y - 1) * STEP, (z - 1) * STEP]}
            gx={x}
            gy={y}
            gz={z}
            textureMap={textureMap}
            cubeData={cubeData}
            onCellClick={onCellClick}
          />
        );
      }
    }
  }

  return <group>{cells}</group>;
}
