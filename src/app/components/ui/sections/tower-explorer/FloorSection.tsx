"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Floor } from "./floors";
import ParticleOverlay from "./ParticleOverlay";
import FloorReactorTop from "./scenes/FloorReactorTop";
import FloorCommand from "./scenes/FloorCommand";
import FloorEcosystem from "./scenes/FloorEcosystem";
import FloorReactorBot from "./scenes/FloorReactorBot";
import FloorFusion from "./scenes/FloorFusion";

gsap.registerPlugin(ScrollTrigger);

/** Map floor IDs to their interactive scene components */
const SCENE_MAP: Record<string, ReactNode> = {
  ignition: <FloorReactorTop />,
  confinement: <FloorCommand />,
  plasma: <FloorEcosystem />,
  energy: <FloorReactorBot />,
  fusion: <FloorFusion />,
};

interface Props {
  floor: Floor;
  index: number;
  total: number;
}

export default function FloorSection({ floor, index, total }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const metricRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const content = contentRef.current;
    const metric = metricRef.current;
    if (!section || !scene) return;

    const ctx = gsap.context(() => {
      // Pin section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=150%",
        pin: true,
        pinSpacing: true,
        onEnter: () => setIsActive(true),
        onLeave: () => setIsActive(false),
        onEnterBack: () => setIsActive(true),
        onLeaveBack: () => setIsActive(false),
      });

      // Subtle scale on scene during scroll
      gsap.fromTo(
        scene,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.8,
          },
        }
      );

      // Content entrance
      if (content) {
        const children = content.children;
        gsap.fromTo(
          children,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: "top 15%",
              scrub: true,
            },
          }
        );
      }

      // Metric slide-in
      if (metric) {
        gsap.fromTo(
          metric,
          { opacity: 0, x: 50, filter: "blur(6px)" },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 45%",
              end: "top 5%",
              scrub: true,
            },
          }
        );
      }

      // Exit
      if (index < total - 1) {
        gsap.to(section, {
          opacity: 0,
          scrollTrigger: {
            trigger: section,
            start: "+=120%",
            end: "+=150%",
            scrub: 0.5,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [index, total]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      data-floor={floor.id}
    >
      {/* Dark base background */}
      <div className="absolute inset-0 bg-[#050a10]" />

      {/* Subtle reference image as ambient layer (very low opacity) */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url(${floor.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px) saturate(0.5)",
        }}
      />

      {/* Interactive scene layer */}
      <div ref={sceneRef} className="absolute inset-0 will-change-transform" style={{ zIndex: 5 }}>
        {SCENE_MAP[floor.id]}
      </div>

      {/* Edge glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 6,
          boxShadow: `inset 0 0 150px 30px ${floor.accent}08, inset 0 -80px 100px -20px ${floor.accent}12, inset 0 1px 0 0 ${floor.accent}10`,
        }}
      />

      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          zIndex: 6,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />

      {/* Particles */}
      <div style={{ zIndex: 7 }}>
        <ParticleOverlay color={floor.accent} active={isActive} />
      </div>

      {/* Text content overlay — positioned at bottom-left */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-7xl mx-auto w-full px-8 md:px-16 pb-12 flex items-end justify-between">
          {/* Text */}
          <div ref={contentRef} className="space-y-3 max-w-lg">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-[1px]"
                style={{ background: `linear-gradient(to right, ${floor.accent}, transparent)` }}
              />
              <span
                className="text-xs font-mono tracking-[0.3em] uppercase"
                style={{ color: floor.accent }}
              >
                {floor.label}
              </span>
            </div>

            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.1] whitespace-pre-line"
              style={{
                textShadow: `0 0 40px ${floor.accent}25, 0 2px 8px rgba(0,0,0,0.9)`,
              }}
            >
              {floor.title}
            </h2>

            <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-md">
              {floor.description}
            </p>

            <div
              className="h-[2px] w-20"
              style={{ background: `linear-gradient(to right, ${floor.accent}, transparent)` }}
            />
          </div>

          {/* Metric — bottom right */}
          <div ref={metricRef}>
            {floor.metric && (
              <div className="text-right space-y-1">
                <div
                  className="text-5xl md:text-6xl lg:text-7xl font-mono font-bold"
                  style={{
                    color: "white",
                    textShadow: `0 0 40px ${floor.accent}30, 0 0 80px ${floor.accent}15`,
                  }}
                >
                  {floor.metric.value}
                </div>
                <div
                  className="text-xs font-mono tracking-[0.2em] uppercase"
                  style={{ color: floor.accent }}
                >
                  {floor.metric.unit}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom gradient for text readability */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background: "linear-gradient(to top, rgba(5,10,16,0.95) 0%, rgba(5,10,16,0.6) 40%, transparent 100%)",
          }}
        />
      </div>

      {/* Floor number */}
      <div className="absolute top-6 right-8 z-20 opacity-10">
        <span className="text-7xl font-mono font-bold text-white/10">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
