"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface TowerFloorProps {
  /** Background image path from /public */
  bgImage: string;
  /** Alt text for the background image */
  bgAlt: string;
  /** Content to overlay on the floor */
  children: React.ReactNode;
  /** Optional extra height for the scroll trigger area */
  scrollHeight?: string;
  /** Whether this is the first floor (connects to hero above) */
  isFirst?: boolean;
  /** Whether to show the connector above this floor */
  showConnector?: boolean;
}

export default function TowerFloor({
  bgImage,
  bgAlt,
  children,
  scrollHeight = "200vh",
  isFirst = false,
  showConnector = true,
}: TowerFloorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Floor slides up and fades in as user scrolls into view
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.85], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.25], [120, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.92, 1, 1, 0.95]);

  // Connector fades in slightly ahead of the floor
  const connectorOpacity = useTransform(scrollYProgress, [0, 0.15, 0.45, 0.8], [0, 1, 1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ minHeight: scrollHeight }}
    >
      {/* Sticky viewport for the floor */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Connector structure image above floor */}
        {showConnector && (
          <motion.div
            className="relative w-full max-w-[1400px] mx-auto px-4"
            style={{ opacity: connectorOpacity }}
          >
            <div className="relative w-full" style={{ aspectRatio: "16/5" }}>
              <Image
                src="/tower/floor-connector.png"
                alt="Tower structural connector"
                fill
                className="object-contain"
                sizes="(max-width: 1400px) 100vw, 1400px"
              />
            </div>
          </motion.div>
        )}

        {/* Main floor content */}
        <motion.div
          className="relative w-full max-w-[1400px] mx-auto px-4"
          style={{ opacity, y, scale }}
        >
          {/* Tower floor background image */}
          <div className="relative w-full aspect-video">
            <Image
              src={bgImage}
              alt={bgAlt}
              fill
              className="object-contain"
              sizes="(max-width: 1400px) 100vw, 1400px"
              priority={isFirst}
            />

            {/* Content overlay — positioned on top of the image */}
            <div className="absolute inset-0 flex items-center justify-center">
              {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
