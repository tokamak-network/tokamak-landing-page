"use client";

import { useEffect, useState } from "react";
import { formatInteger } from "@/app/lib/utils/format";

interface AnimatedValueProps {
  value: string;
}

export function AnimatedValue({ value }: AnimatedValueProps) {
  const [ready, setReady] = useState(false);
  const [prevValue, setPrevValue] = useState<string>("");
  const [currentValue, setCurrentValue] = useState<string>("");

  const digits = Array.from({ length: 15 }, (_, i) => i);

  useEffect(() => {
    if (currentValue !== value) {
      setPrevValue(currentValue);
      setReady(true);
    }
    setCurrentValue(value);

    setTimeout(() => {
      setReady(false);
    }, 1800);
  }, [value]);

  // 변경된 자릿수 확인
  const shouldRoll = (index: number, curr: string, prev: string) => {
    if (!prev) return false;

    // 현재 자릿수부터 오른쪽으로 검사하여
    // 첫 번째로 다른 숫자가 나오는 위치부터 끝까지 롤링
    const firstDiffIndex = [...curr].findIndex((num, i) => num !== prev[i]);
    return index >= firstDiffIndex && firstDiffIndex !== -1;
  };

  return (
    <div className="inline-flex overflow-hidden">
      <style jsx>{`
        .digits {
          float: left;
          position: relative;
          width: inherit;
          height: inherit;
        }
        
        .rolling {
          animation-name: rolling;
          animation-duration: 1.5s;
          animation-timing-function: ease;
          animation-fill-mode: forwards;
        }
        
        .digit-container {
          position: absolute;
          inset-0
          width: 100%;
          height: 100%;
        }
        
        @keyframes rolling {
          0% {
            visibility: visible;
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            visibility: visible;  
          transform: translateY(-765px);
            opacity: 1;
          }
        }
      `}</style>

      {currentValue.split("").map((num, i) => (
        <div
          key={`${i}-${num}`}
          className="digits"
          style={{
            marginLeft: num === "," || num === "." ? "-0.05em" : undefined,
            marginRight: num === "," || num === "." ? "-0.05em" : undefined,
            width: num === "," || num === "." ? "0.3em" : undefined,
            height: "1.5em",
          }}
        >
          <div
            className={`digit-container ${
              currentValue !== prevValue &&
              shouldRoll(i, currentValue, prevValue)
                ? "rolling"
                : ""
            }`}
            style={{
              animationDelay: `${(currentValue.length - i) * 0.2}s`,
              transform: !shouldRoll(i, currentValue, prevValue)
                ? "translateY(-765px)"
                : undefined,
              visibility: !shouldRoll(i, currentValue, prevValue)
                ? "visible"
                : undefined,
            }}
          >
            {[...digits.map(() => Math.floor(Math.random() * 10)), num].map(
              (digit, index) => (
                <div key={index}>{digit}</div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
