import { useGSAP } from "@gsap/react";

import gsap from "gsap";
import { useRef } from "react";
import {
  specialSlideAnimation,
  tokenSlideAnimation,
  valueWidthAnimation,
} from "../animations/Roller.ani";
import { useFontObserver } from "./useFontFaceObserver";

interface RollerAnimationProps {
  id: string;
  value: number;
  rollDuration: number;
  shiftDuration: number;
  staggering: boolean;
  diff: boolean;
  showAfterFontNameLoaded: string[];
  rollWay: "up" | "down";
}

gsap.registerPlugin(useGSAP);

export function useRollerAnimation(
  {
    id,
    value,
    rollDuration,
    shiftDuration,
    staggering,
    diff,
    rollWay,
    showAfterFontNameLoaded,
  }: RollerAnimationProps,
  dependencies: unknown[] = []
) {
  const isFontLoaded = useFontObserver(showAfterFontNameLoaded);
  const prevValue = useRef(0);
  const prevTokenAmount = useRef(0);

  const getValueDiffIndexes = () => {
    const prevString = prevValue.current.toString().replace(".", "");
    const curString = value.toString().replace(".", "");

    // 첫 번째로 다른 숫자가 나오는 위치 찾기
    const firstDiffIndex = [...curString].findIndex(
      (num, i) => num !== prevString[i]
    );

    if (firstDiffIndex === -1) return [];

    // 첫 번째 다른 숫자부터 끝까지의 모든 인덱스 반환
    return Array.from(
      {
        length: Math.max(prevString.length, curString.length) - firstDiffIndex,
      },
      (_, i) => firstDiffIndex + i
    );
  };

  useGSAP(
    () => {
      if (!isFontLoaded) return;

      const currentTokenAmount = value.toLocaleString().length;
      const valueLengthChanged = prevTokenAmount.current !== currentTokenAmount;

      tokenSlideAnimation(
        id,
        rollDuration,
        staggering,
        rollWay,
        diff ? getValueDiffIndexes() : null
      );
      if (valueLengthChanged) {
        specialSlideAnimation(
          id,
          rollDuration,
          currentTokenAmount > prevTokenAmount.current
        );
      }

      prevTokenAmount.current = currentTokenAmount;
      prevValue.current = value;
    },
    {
      dependencies: [
        value,
        rollDuration,
        rollWay,
        staggering,
        isFontLoaded,
        ...dependencies,
      ],
      revertOnUpdate: true,
    }
  );

  useGSAP(
    () => {
      if (!isFontLoaded) return;

      valueWidthAnimation(id, value, shiftDuration);
    },
    {
      dependencies: [value, shiftDuration, isFontLoaded, ...dependencies],
      revertOnUpdate: false,
    }
  );
}
