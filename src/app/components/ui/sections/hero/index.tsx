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
  // Set 대신 Map을 사용하여 조회/삭제 성능 향상
  const [animatingCells, setAnimatingCells] = React.useState<
    Map<number, boolean>
  >(new Map());
  const [debug, setDebug] = React.useState({ x: 0, y: 0, cell: -1 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 애니메이션 설정
  // React.useEffect(() => {
  //   const centerIndex = 579; // 중심 셀
  //   const row = Math.floor(centerIndex / 40);
  //   const col = centerIndex % 40;

  //   const animate = () => {
  //     const nearbyIndices = [];
  //     // 20x20 범위 계산
  //     for (let i = Math.max(0, row - 10); i < Math.min(40, row + 10); i++) {
  //       for (let j = Math.max(0, col - 10); j < Math.min(40, col + 10); j++) {
  //         nearbyIndices.push(i * 40 + j);
  //       }
  //     }

  //     // 랜덤하게 3개의 셀 선택
  //     const selectedIndices = nearbyIndices
  //       .sort(() => Math.random() - 0.5)
  //       .slice(0, 3);

  //     setAnimatingCells((prev) => {
  //       const next = new Map(prev);
  //       selectedIndices.forEach((idx) => next.set(idx, true));
  //       return next;
  //     });
  //   };

  //   // 0.1초마다 애니메이션 실행
  //   intervalRef.current = setInterval(animate, 1500);

  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current);
  //     }
  //   };
  // }, []);

  // // 메모이제이션된 핸들러
  const handleCellHover = React.useCallback(
    (e: React.MouseEvent, index: number) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setAnimatingCells((prev) => {
        const next = new Map(prev);
        next.set(index, true);
        return next;
      });
      setDebug({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        cell: index,
      });
    },
    []
  );

  const handleAnimationEnd = React.useCallback((index: number) => {
    setAnimatingCells((prev) => {
      const next = new Map(prev);
      next.delete(index);
      return next;
    });
  }, []);

  // 메모이제이션된 그리드 셀 렌더링
  const renderGridCells = React.useMemo(
    () =>
      Array.from({ length: 40 * 40 }).map((_, i) => (
        <div
          key={i}
          className="relative w-full h-full border border-gray-500/20"
          style={{
            transform: "scale(1)",
            transformOrigin: "center center",
          }}
          onMouseEnter={(e) => handleCellHover(e, i)}
        >
          {animatingCells.has(i) && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: "rotateZ(45deg) rotateX(-55deg) translateY(-100px)",
                transformOrigin: "center center",
              }}
            >
              <div
                className="animate-pillar"
                onAnimationEnd={() => handleAnimationEnd(i)}
              >
                <Pillar />
              </div>
            </div>
          )}
          {i === 579 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: "rotateZ(45deg) rotateX(-55deg) translateY(-100px)",
                transformOrigin: "center center",
              }}
            >
              <div
                className="animate-pillar"
                onAnimationEnd={() => handleAnimationEnd(i)}
              >
                <Pillar />
              </div>
            </div>
          )}
        </div>
      )),
    [animatingCells]
  );

  return (
    <div className="h-[860px] w-full overflow-hidden relative bg-white">
      {/* <div className="w-full h-full absolute top-0 left-0">
        <Image
          src={GridImage}
          alt="grid"
          className="w-full h-full object-cover"
        />
      </div> */}

      <div className="absolute left-0 top-0 w-[200%] h-[200%]">
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: "repeat(40, 82.6px)",
            gridTemplateRows: "repeat(40, 82.6px)",
            transform: "rotateX(55deg) rotateZ(-45deg) translateY(-90%)",
            transformStyle: "preserve-3d",
            perspective: "2000px",
            transformOrigin: "center center",
            position: "relative",
            top: "-29px",
            left: "calc(5% - 90px)",
            gap: 0,
          }}
        >
          {renderGridCells}
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
