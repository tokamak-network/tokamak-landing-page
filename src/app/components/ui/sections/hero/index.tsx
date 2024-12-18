"use client";

import * as React from "react";
import { HeroSection } from "./Hero";
import { Pillar } from "./Pillar";
import "./pillar.css";

const PATTERN_SIZE = 118; // px
const VISIBLE_HEIGHT = 860; // px
const VISIBLE_WIDTH = Math.ceil(1400); // 기본값 1920px
// 보이는 영역보다 약간 더 크게 그려서 여유를 둠
const CONTAINER_WIDTH = Math.ceil(VISIBLE_WIDTH * 1.2);
const CONTAINER_HEIGHT = Math.ceil(VISIBLE_HEIGHT * 2.5);

// 그리드 셀 개수 계산
const GRID_COLUMNS = Math.ceil(CONTAINER_WIDTH / PATTERN_SIZE);
const GRID_ROWS = Math.ceil(CONTAINER_HEIGHT / PATTERN_SIZE);
const GRID_ITEMS_COUNT = GRID_COLUMNS * GRID_ROWS;

export const Hero: React.FC = () => {
  const [hoverStates, setHoverStates] = React.useState<{
    [key: number]: number;
  }>({});

  return (
    <div className="h-[860px] w-full overflow-hidden relative bg-white">
      <div
        className="w-full h-[2000px] bg-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          perspective: "1000px",
          transform: `translate(-50%, -50%) rotateX(65deg)`, // 그리드 레이어 회전 활성화
          transformOrigin: "center center",
        }}
      >
        <div
          className="w-full h-full"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${PATTERN_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, ${PATTERN_SIZE}px)`,
          }}
        >
          {Array.from({ length: GRID_ITEMS_COUNT }).map((_, i) => (
            <div
              key={i}
              className="relative"
              style={{
                background: `
                  linear-gradient(45deg, transparent 49.5%, #e0e0e0 49.5%, #e0e0e0 50.5%, transparent 50.5%),
                  linear-gradient(135deg, transparent 49.5%, #e0e0e0 49.5%, #e0e0e0 50.5%, transparent 50.5%)
                `,
                backgroundSize: `${PATTERN_SIZE}px ${PATTERN_SIZE}px`,
                width: "100%",
                height: "100%",
              }}
            />
          ))}
        </div>
      </div>

      {/* Pillar 애니메이션을 위한 별도 레이어 */}
      <div className="absolute left-0 top-0 w-full h-full">
        <div className="grid grid-cols-[repeat(auto-fill,120px)] grid-rows-[repeat(auto-fill,120px)] w-full h-full">
          {Array.from({ length: GRID_ITEMS_COUNT }).map((_, i) => {
            const columnIndex = i % GRID_COLUMNS;
            const rowIndex = Math.floor(i / GRID_COLUMNS);
            const translateX =
              columnIndex === 0
                ? -32
                : columnIndex < 3
                ? -36
                : columnIndex < 6
                ? -42
                : columnIndex < 8
                ? -45
                : columnIndex < 10
                ? -50
                : columnIndex < 12
                ? -53
                : -55; // 짝수/홀수 열에 따라 다른 값 적용

            return (
              <div
                key={i}
                className="relative group"
                onMouseEnter={() => {
                  setHoverStates((prev) => ({
                    ...prev,
                    [i]: (prev[i] || 0) + 1,
                  }));
                }}
              >
                <div
                  className="absolute left-1/2 top-1/2 z-10 opacity-0 group-hover:opacity-100"
                  style={{
                    transform: `translate(${translateX}px, -50%)`,
                  }}
                >
                  <div
                    className="group-hover:animate-pillar"
                    key={hoverStates[i]}
                  >
                    <Pillar />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ perspective: "1000px" }}
      >
        <Pillar />
      </div> */}
    </div>
  );
};
//
