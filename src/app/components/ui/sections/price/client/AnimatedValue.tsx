"use client";

import Roller from "@/app/components/shared/roller/Roller";
import { useRef } from "react";
import { useEffect } from "react";
interface AnimatedValueProps {
  value: string;
}

export function AnimatedValue({ value }: AnimatedValueProps) {

  const prevValueRef = useRef<number>(0);
  const currentValue = Number(value.replace(/,/g, ""));

  useEffect(() => {
    prevValueRef.current = currentValue;
  }, [currentValue]);

  return (
    <div className="h-full">
      <Roller
        value={Number(value.replace(/,/g, ""))}
        rollDuration={2}
        diff={true}
        fontSize={33}
        rollWay={currentValue > prevValueRef.current ? "up" : "down"}
      />
    </div>
  );
}
