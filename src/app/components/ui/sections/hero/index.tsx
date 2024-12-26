"use client";

import * as React from "react";
// import { HeroSection } from "./Hero";
import { Pillar } from "./Pillar";
import "./pillar.css";
import GridImage from "@/assets/images/bg.svg";
import Image from "next/image";
import { useRef } from "react";

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
  const [activeCell, setActiveCell] = React.useState<number | null>(null);
  const [debug, setDebug] = React.useState({ x: 0, y: 0, cell: -1 });

  const handleCellHover = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setActiveCell(index);
    setDebug({ x, y, cell: index });
  };

  return (
    <div className="h-[860px] w-full overflow-hidden relative bg-white">
      {/* Grid Image Layer */}
      <div className="w-full h-full absolute top-0 left-0">
        <Image
          src={GridImage}
          alt="grid"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Pillar Grid Layer */}
      <div className="absolute left-0 top-0 w-[200%] h-[200%]">
        {" "}
        {/* 컨테이너 크기 더 증가 */}
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: "repeat(40, 82.6px)", // 열 수 증가
            gridTemplateRows: "repeat(40, 82.6px)", // 행 수 증가
            transform: "rotateX(55deg) rotateZ(-45deg) translateY(-90%)", // translateY 추가
            transformStyle: "preserve-3d",
            perspective: "2000px",
            transformOrigin: "center center",
            position: "relative",
            top: "-29px", // top 값 조정
            left: "calc(5% - 90px)",
            gap: 0,
          }}
        >
          {Array.from({ length: 40 * 40 }).map(
            (
              _,
              i // 그리드 셀 수 증가
            ) => (
              <div
                key={i}
                className="relative w-full h-full border border-red-500/20"
                style={{
                  transform: "scale(1)",
                  transformOrigin: "center center",
                }}
                onMouseEnter={(e) => handleCellHover(e, i)}
                onMouseLeave={() => setActiveCell(null)}
              >
                {/* {activeCell === i && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform:
                        "rotateZ(45deg) rotateX(-55deg) translateY(-100px)",
                      transformOrigin: "center center",
                    }}
                  >
                    <div className="animate-pillar">
                      <Pillar />
                    </div>
                  </div>
                )} */}
                {i === 501 && ( // 첫 번째 셀에만 Pillar 표시
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform:
                        "rotateZ(45deg) rotateX(-55deg) translateY(-100px)",
                      transformOrigin: "center center",
                    }}
                  >
                    <div className="animate-pillar">
                      <Pillar />
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Debug Info */}
      <div className="fixed top-4 left-4 bg-black/80 text-white p-2 rounded z-50">
        <div>X: {debug.x.toFixed(2)}</div>
        <div>Y: {debug.y.toFixed(2)}</div>
        <div>Cell: {debug.cell}</div>
        <div>Grid Columns: {GRID_COLUMNS}</div>
        <div>Grid Rows: {GRID_ROWS}</div>
      </div>
    </div>
  );
};
//
