"use client";

import CircleImage from "@/assets/images/price/circle.svg";
import HalfCircleImage from "@/assets/images/price/half_circle.svg";

import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect, useMemo } from "react";
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

  const resetAnimation = useCallback(() => {
    leftControls.stop();
    rightControls.stop();
    leftControls.set({
      rotate: 180,
      translateX: 0,
    });
    rightControls.set({
      rotate: 0,
      translateX: 0,
    });
  }, [leftControls, rightControls]);

  useEffect(() => {
    resetAnimation();
  }, [traslateXPoint, resetAnimation]);

  useEffect(() => {
    let isSubscribed = true;

    const animate = async () => {
      if (!isSubscribed) return;

      try {
        // First rotation animation
        await Promise.all([
          leftControls.start({
            rotate: [180, 360],
            transition: { duration: 4, ease: "linear" },
          }),
          rightControls.start({
            rotate: -360,
            transition: { duration: 4, ease: "linear" },
          }),
        ]);

        if (!isSubscribed) return;

        // Set right circle position
        await rightControls.start({
          rotate: 180,
          transition: { duration: 0 },
        });

        if (!isSubscribed) return;

        // Translation animation
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

        if (!isSubscribed) return;

        // Reset positions
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

        if (!isSubscribed) return;

        // Continue the animation with requestAnimationFrame
        requestAnimationFrame(animate);
      } catch (error) {
        console.error("Animation error:", error);
      }
    };

    const timeoutId = setTimeout(animate, 500);

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
      leftControls.stop();
      rightControls.stop();
    };
  }, [leftControls, rightControls, traslateXPoint]);

  return (
    <div className="relative flex animate-[spin_20s_linear_infinite]">
      {/* 왼쪽 원 */}
      <div
        className="relative left-0 
                    [@media(min-width:996px)]:w-[225px] [@media(min-width:996px)]:h-[225px]
                    [@media(max-width:995px)]:[@media(min-width:500px)]:w-[180px] [@media(max-width:995px)]:[@media(min-width:500px)]:h-[180px]
                    [@media(max-width:499px)]:w-[160px] [@media(max-width:499px)]:h-[160px]"
      >
        <div className="absolute inset-0">
          <Image src={CircleImage} alt="circle animation" />
        </div>
        <motion.div
          className="absolute inset-0"
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
      <div
        className="relative 
                    [@media(min-width:996px)]:w-[225px] [@media(min-width:996px)]:h-[225px]
                    [@media(max-width:995px)]:[@media(min-width:500px)]:w-[180px] [@media(max-width:995px)]:[@media(min-width:500px)]:h-[180px]
                    [@media(max-width:499px)]:w-[160px] [@media(max-width:499px)]:h-[160px]"
      >
        <div className="absolute">
          <Image src={CircleImage} alt="circle animation" />
        </div>
        <motion.div
          className="absolute inset-0"
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
      className="w-full 
                    [@media(min-width:996px)]:max-w-[500px]
                    [@media(max-width:995px)]:[@media(min-width:500px)]:max-w-[360px] [@media(max-width:995px)]:[@media(min-width:500px)]:mt-[114px]
                    [@media(max-width:499px)]:max-w-[320px] [@media(max-width:499px)]:mt-[104px]"
    >
      <CircleComponent />
    </div>
  );
}
