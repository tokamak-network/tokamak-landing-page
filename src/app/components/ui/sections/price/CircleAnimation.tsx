import CircleImage from "@/assets/images/price/circle.svg";
import HalfCircleImage from "@/assets/images/price/half_circle.svg";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";
// import styles from "./CircleAnimation.module.css";
// animate - [spin_10s_linear_infinite];
// animate - [spin_5s_linear_infinite];
const CircleComponent = () => {
  const leftControls = useAnimationControls();
  const rightControls = useAnimationControls();

  useEffect(() => {
    const animate = async () => {
      while (true) {
        // 회전 애니메이션 병렬 실행
        await Promise.all([
          leftControls.start({
            rotate: 540, // 180 + 360
            transition: { duration: 4, ease: "linear" },
          }),
          rightControls.start({
            rotate: 360, // 0 + 360
            transition: { duration: 4, ease: "linear" },
          }),
        ]);

        // 이동 애니메이션 병렬 실행
        await Promise.all([
          leftControls.start({
            translateX: 235,
            transition: { duration: 1, ease: "linear" },
          }),
          rightControls.start({
            translateX: -235,
            transition: { duration: 1, ease: "linear" },
          }),
        ]);

        // 초기화 병렬 실행
        await Promise.all([
          leftControls.set({
            rotate: 180,
            translateX: 0,
          }),
          rightControls.set({
            rotate: 0,
            translateX: 0,
          }),
        ]);
      }
    };

    animate();
    return () => {
      leftControls.stop();
      rightControls.stop();
    };
  }, []);

  return (
    <div className="relative flex animate-[spin_10s_linear_infinite]">
      {/* 왼쪽 원 */}
      <div className="relative left-0 w-[225px] h-[225px]">
        <div className="absolute inset-0">
          <Image src={CircleImage} alt="circle animation" />
        </div>
        <motion.div
          className="absolute inset-0"
          animate={leftControls}
          initial={{ rotate: 180 }}
          style={{ zIndex: 100, transformOrigin: "center" }}
        >
          <Image src={HalfCircleImage} alt="circle animation" />
        </motion.div>
      </div>

      {/* 오른쪽 원 */}
      <div className="relative w-[225px] h-[225px]">
        <div className="absolute">
          <Image src={CircleImage} alt="circle animation" />
        </div>
        <motion.div
          className="absolute inset-0"
          animate={rightControls}
          initial={{ rotate: 0 }} // 아래에서 시작
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
    <div className="w-full max-w-[500px] h-[240px] border-red">
      <CircleComponent />
    </div>
  );
}
