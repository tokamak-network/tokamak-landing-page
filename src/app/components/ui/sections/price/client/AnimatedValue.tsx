"use client";

import Roller from "@/app/components/shared/roller/Roller";
import { useRef } from "react";
import { useEffect } from "react";
interface AnimatedValueProps {
  value: string;
  isPrice: boolean;
}

export function AnimatedValue({ value, isPrice }: AnimatedValueProps) {
  const prevValueRef = useRef<number>(0);
  const currentValue = Number(value.replace(/,/g, ""));

  useEffect(() => {
    prevValueRef.current = currentValue;
  }, [currentValue]);

  return (
    <div className="h-full">
      <Roller
        value={
          value.length > 4 ? parseInt(value.replace(/,/g, "")) : Number(value)
        }
        rollDuration={2}
        diff={true}
        fontSize={isPrice ? 42 : 33}
        rollWay={currentValue > prevValueRef.current ? "up" : "down"}
      />
    </div>
  );
}
