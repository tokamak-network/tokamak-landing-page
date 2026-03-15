"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Roller from "@/app/components/shared/roller/Roller";
import MiniSparkline from "./MiniSparkline";

interface HeroContentProps {
  codeChanges: number;
  netGrowth: number;
  activeProjects: number;
  totalStaked: number;
}

export default function HeroContent({
  codeChanges: initialCodeChanges,
  netGrowth: initialNetGrowth,
  activeProjects: initialActiveProjects,
  totalStaked: initialTotalStaked,
}: HeroContentProps) {
  const [codeChanges, setCodeChanges] = useState(initialCodeChanges);
  const [netGrowth, setNetGrowth] = useState(initialNetGrowth);
  const [activeProjects, setActiveProjects] = useState(initialActiveProjects);
  const [totalStaked, setTotalStaked] = useState(initialTotalStaked);

  // Periodic micro-increments
  useEffect(() => {
    const interval = setInterval(() => {
      setCodeChanges((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setNetGrowth((prev) => prev + Math.floor(Math.random() * 3) + 1);
      setActiveProjects((prev) => {
        const change = Math.random();
        if (change < 0.3) return prev + 1;
        if (change > 0.7) return Math.max(1, prev - 1);
        return prev;
      });
      setTotalStaked((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-16"
    >
      {/* Top: Split layout — text left, video right */}
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left: Text */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <motion.h1
            variants={itemVariants}
            className="font-orbitron text-[48px] md:text-[64px] lg:text-[72px] font-[900] text-white uppercase leading-[0.95] tracking-tight"
          >
            Building
            <br />
            Unstoppable
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-[18px] md:text-[20px] text-[#929298] max-w-[460px] mx-auto lg:mx-0"
          >
            The Tokamak Network ecosystem never sleeps
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2"
          >
            <button className="px-8 py-4 bg-[#0077ff] text-white font-semibold text-[15px] hover:bg-[#0066dd] transition-colors duration-200 flex items-center justify-center gap-2 group">
              Explore Ecosystem
              <span className="inline-block transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </button>

            <button className="px-8 py-4 border border-[#333] text-[#c5c5ca] font-semibold text-[15px] hover:border-[#0077ff] hover:text-white transition-all duration-200">
              Read Docs
            </button>
          </motion.div>
        </div>

        {/* Right: Video — borderless, blends with background */}
        <motion.div
          variants={itemVariants}
          className="flex-shrink-0 w-[320px] h-[320px] md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] relative"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/tokamak-network-logo.png"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          {/* Soft edge fade to blend with background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: "inset 0 0 60px 30px #000",
            }}
          />
        </motion.div>
      </div>

      {/* Bottom: 4 counters in a row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[#1a1a1d]"
      >
        {/* Counter 1: Code Changes */}
        <div className="bg-black p-6 space-y-2">
          <div className="font-orbitron text-white">
            <Roller
              value={codeChanges}
              fontSize={36}
              align="left"
              rollDuration={0.8}
            />
          </div>
          <div className="text-[#929298] text-[11px] font-[700] uppercase tracking-[0.12em]">
            Code Changes
          </div>
          <MiniSparkline color="#22c55e" phase={0} width={100} height={24} />
        </div>

        {/* Counter 2: Net Growth */}
        <div className="bg-black p-6 space-y-2">
          <div className="font-orbitron text-white">
            <Roller
              value={netGrowth}
              fontSize={36}
              align="left"
              rollDuration={0.8}
            />
          </div>
          <div className="text-[#929298] text-[11px] font-[700] uppercase tracking-[0.12em]">
            Net Growth
          </div>
          <MiniSparkline color="#3b82f6" phase={0.25} width={100} height={24} />
        </div>

        {/* Counter 3: Active Projects */}
        <div className="bg-black p-6 space-y-2">
          <div className="font-orbitron text-white">
            <Roller
              value={activeProjects}
              fontSize={36}
              align="left"
              rollDuration={0.8}
            />
          </div>
          <div className="text-[#929298] text-[11px] font-[700] uppercase tracking-[0.12em]">
            Active Projects
          </div>
          <MiniSparkline color="#a855f7" phase={0.5} width={100} height={24} />
        </div>

        {/* Counter 4: Total Staked */}
        <div className="bg-black p-6 space-y-2">
          <div className="font-orbitron text-white">
            <Roller
              value={totalStaked}
              suffix=" TON"
              suffixPosition="back"
              fontSize={36}
              align="left"
              rollDuration={0.8}
            />
          </div>
          <div className="text-[#929298] text-[11px] font-[700] uppercase tracking-[0.12em]">
            Total Staked
          </div>
          <MiniSparkline color="#f59e0b" phase={0.75} width={100} height={24} />
        </div>
      </motion.div>
    </motion.div>
  );
}
