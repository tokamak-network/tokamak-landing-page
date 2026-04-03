"use client";

import { motion } from "framer-motion";
import { LINKS } from "@/app/constants/links";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroOverlay({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  const opacity = 1 - scrollProgress * 2;
  const translateY = -scrollProgress * 80;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-end pb-[18vh] md:pb-[15vh]"
      style={{ zIndex: 2 }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
        style={{
          opacity: Math.max(opacity, 0),
          transform: `translateY(${translateY}px)`,
        }}
      >
        <motion.h1
          variants={itemVariants}
          className="font-orbitron text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] font-[900] text-white uppercase leading-[0.95] tracking-tight"
        >
          TOKAMAK
          <br />
          <span className="text-[#0077ff]">NETWORK</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mt-5 text-[16px] sm:text-[18px] md:text-[20px] text-[#929298] max-w-[520px] mx-auto"
        >
          Every application deserves its own Layer 2
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href={LINKS.ROLLUP_HUB}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#0077ff] text-white font-semibold text-[15px] hover:bg-[#0066dd] transition-colors duration-200 flex items-center justify-center gap-2 group"
          >
            Launch Your L2
            <span className="inline-block transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </a>

          <a
            href={LINKS.DOCS}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-[#333] text-[#c5c5ca] font-semibold text-[15px] hover:border-[#0077ff] hover:text-white transition-all duration-200 flex items-center justify-center"
          >
            Read Docs
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
