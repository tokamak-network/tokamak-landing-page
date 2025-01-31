"use client";

import Roller from "@/app/components/shared/roller/Roller";
import AnimatedNumbers from "react-animated-numbers";
interface AnimatedValueProps {
  value: string;
}

export function AnimatedValue({ value }: AnimatedValueProps) {
  // const [ready, setReady] = useState(false);
  // const [prevValue, setPrevValue] = useState<string>("");
  // const [currentValue, setCurrentValue] = useState<string>("");

  // const digits = Array.from({ length: 15 }, (_, i) => i);

  // useEffect(() => {
  //   if (currentValue !== value) {
  //     setPrevValue(currentValue);
  //     setReady(true);
  //   }
  //   setCurrentValue(value);

  //   setTimeout(() => {
  //     setReady(false);
  //   }, 1800);
  // }, [value]);

  // // 변경된 자릿수 확인
  // const shouldRoll = (index: number, curr: string, prev: string) => {
  //   if (!prev) return false;

  //   // 현재 자릿수부터 오른쪽으로 검사하여
  //   // 첫 번째로 다른 숫자가 나오는 위치부터 끝까지 롤링
  //   const firstDiffIndex = [...curr].findIndex((num, i) => num !== prev[i]);
  //   return index >= firstDiffIndex && firstDiffIndex !== -1;
  // };

  console.log("****");
  console.log("value", value);
  console.log("Number(value)", Number(value));

  return (
    <div>
      <Roller
        value={Number(value.replace(/,/g, ""))}
        rollDuration={2}
        diff={true}
      />
    </div>
  );
}
