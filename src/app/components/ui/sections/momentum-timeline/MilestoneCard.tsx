"use client";

import { motion } from "framer-motion";

interface MilestoneCardProps {
  title: string;
  value: string;
  description: string;
  isActive: boolean;
  index: number;
}

export default function MilestoneCard({
  title,
  value,
  description,
  isActive,
  index,
}: MilestoneCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.3, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex flex-col items-center text-center px-6 py-8 min-w-[200px] transition-all duration-500 ${
        isActive ? "scale-100" : "scale-90"
      }`}
    >
      <span className="text-[11px] font-[700] text-primary uppercase tracking-[0.1em] mb-3">
        {title}
      </span>
      <span
        className={`text-[36px] md:text-[48px] font-[900] font-orbitron tracking-wider transition-colors duration-500 ${
          isActive ? "text-white" : "text-[#333]"
        }`}
      >
        {value}
      </span>
      <span className="text-[13px] text-[#929298] mt-2 max-w-[180px]">
        {description}
      </span>
    </motion.div>
  );
}
