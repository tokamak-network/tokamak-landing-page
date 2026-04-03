"use client";

import { motion } from "framer-motion";

export default function ScrollIndicator({
  scrollProgress,
}: {
  scrollProgress: number;
}) {
  if (scrollProgress > 0.15) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      style={{ zIndex: 2 }}
    >
      <span className="text-[11px] text-[#929298] uppercase tracking-[0.2em] font-medium">
        Scroll
      </span>
      <motion.div
        className="w-[1px] bg-[#0077ff]"
        animate={{ height: ["16px", "32px", "16px"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
