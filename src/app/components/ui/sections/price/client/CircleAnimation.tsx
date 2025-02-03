"use client";

import CircleImage from "@/assets/images/price/circle.svg";
import HalfCircleImage from "@/assets/images/price/half_circle.svg";

import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useIsMobile } from "@/app/hooks/layout/useIsMobile";

const CircleComponent = () => {
  const leftControls = useAnimationControls();
  const rightControls = useAnimationControls();

  const { isMobile: isMd } = useIsMobile(995);
  const { isMobile: isSm } = useIsMobile(500);

  const traslateXPoint = useMemo(() => {
    if (isSm) return 160;
    if (isMd) return 180;
    return 235;
  }, [isMd, isSm]);

  useEffect(() => {
    let isAnimating = true;

    const animate = async () => {
      try {
        // 초기 상태를 motion 컴포넌트의 initial prop으로 이동
        while (isAnimating) {
          // 회전 애니메이션
          await Promise.all([
            leftControls.start({
              rotate: 360,
              transition: { duration: 4, ease: "linear" },
            }),
            rightControls.start({
              rotate: -360,
              transition: { duration: 4, ease: "linear" },
            }),
          ]);

          if (!isAnimating) break;

          // 이동 애니메이션
          await Promise.all([
            leftControls.start({
              translateX: traslateXPoint,
              transition: { duration: 1, ease: "linear" },
            }),
            rightControls.start({
              translateX: -traslateXPoint,
              transition: { duration: 1, ease: "linear" },
            }),
          ]);

          if (!isAnimating) break;

          // 초기 상태로 리셋 (start를 사용하여 즉시 변경)
          await Promise.all([
            leftControls.start({
              rotate: 180,
              translateX: 0,
              transition: { duration: 0 },
            }),
            rightControls.start({
              rotate: 0,
              translateX: 0,
              transition: { duration: 0 },
            }),
          ]);
        }
      } catch (error) {
        console.error("Animation error:", error);
      }
    };

    // 컴포넌트가 마운트된 후 애니메이션 시작
    const timeoutId = setTimeout(animate, 100);

    return () => {
      isAnimating = false;
      clearTimeout(timeoutId);
      leftControls.stop();
      rightControls.stop();
    };
  }, [leftControls, rightControls, traslateXPoint]);

  return (
    <div className="relative flex animate-[spin_20s_linear_infinite]">
      {/* 왼쪽 원 */}
      <div className="relative left-0 price-md:w-[225px] max-[995px]:min-[500px]:w-[180px] max-[499px]:w-[160px] price-md:h-[225px] max-[995px]:min-[500px]:h-[180px] max-[499px]:h-[160px]">
        <div className="absolute inset-0">
          <Image src={CircleImage} alt="circle animation" />
        </div>
        <motion.div
          className="absolute inset-0"
          initial={{ rotate: 180, translateX: 0 }}
          animate={leftControls}
          style={{
            zIndex: 100,
            transformOrigin: "center",
          }}
        >
          <Image src={HalfCircleImage} alt="circle animation" />
        </motion.div>
      </div>

      {/* 오른쪽 원 */}
      <div className="relative price-md:w-[225px] max-[995px]:min-[500px]:w-[180px] max-[499px]:w-[160px] price-md:h-[225px] max-[995px]:min-[500px]:h-[180px] max-[499px]:h-[160px]">
        <div className="absolute">
          <Image src={CircleImage} alt="circle animation" />
        </div>
        <motion.div
          className="absolute inset-0"
          initial={{ rotate: 0, translateX: 0 }}
          animate={rightControls}
          style={{ zIndex: 100, transformOrigin: "center" }}
        >
          <Image src={HalfCircleImage} alt="circle animation" />
        </motion.div>
      </div>
    </div>
  );
};

export default function CircleAnimation() {
  return (
    <div
      className="w-full price-md:max-w-[500px] max-[995px]:min-[500px]:max-w-[360px]
      max-[499px]:max-w-[320px] 
     max-[995px]:min-[500px]:mt-[114px] max-[499px]:mt-[104px]
      "
    >
      <CircleComponent />
    </div>
  );
}
