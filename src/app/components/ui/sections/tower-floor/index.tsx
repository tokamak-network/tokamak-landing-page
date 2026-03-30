"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

interface TowerFloorProps {
  /** Background image path from /public */
  bgImage: string;
  /** Alt text for the background image */
  bgAlt: string;
  /** Content to overlay on the floor */
  children: React.ReactNode;
  /** Whether this is the first floor (no top fade) */
  isFirst?: boolean;
  /** Whether this is the last floor (stronger bottom fade) */
  isLast?: boolean;
}

export default function TowerFloor({
  bgImage,
  bgAlt,
  children,
  isFirst = false,
  isLast = false,
}: TowerFloorProps) {
  const stickyRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative" style={{ height: "200vh" }}>
      {/* Sticky viewport — fills screen, stays in place while scrolling */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-black"
      >
        <div
          className="relative w-full max-w-[1400px] mx-auto px-4"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "scale(1)" : "scale(0.97)",
            transition:
              "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="relative w-full h-[70vh] md:h-auto md:aspect-video">
            <Image
              src={bgImage}
              alt={bgAlt}
              fill
              className="object-cover md:object-contain"
              sizes="(max-width: 1400px) 100vw, 1400px"
              priority={isFirst}
            />

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              {children}
            </div>
          </div>
        </div>

        {/* Top edge fade — blend from black/hero into the floor */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: isFirst ? "25%" : "18%",
            background: isFirst
              ? "linear-gradient(180deg, black 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, transparent 100%)"
              : "linear-gradient(180deg, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 65%, transparent 100%)",
          }}
        />

        {/* Bottom edge fade — blend floor into black */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: isLast ? "25%" : "18%",
            background:
              "linear-gradient(0deg, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 65%, transparent 100%)",
          }}
        />

        {/* Left edge fade — blend image into black */}
        <div
          className="absolute top-0 bottom-0 left-0 pointer-events-none"
          style={{
            width: "18%",
            background:
              "linear-gradient(90deg, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 65%, transparent 100%)",
          }}
        />

        {/* Right edge fade — blend image into black */}
        <div
          className="absolute top-0 bottom-0 right-0 pointer-events-none"
          style={{
            width: "18%",
            background:
              "linear-gradient(270deg, black 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 65%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
