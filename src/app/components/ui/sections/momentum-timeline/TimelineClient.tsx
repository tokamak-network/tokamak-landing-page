"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MilestoneCard from "./MilestoneCard";

gsap.registerPlugin(ScrollTrigger);

interface TimelineClientProps {
  currentCodeChanges: string;
  currentNetGrowth: string;
}

interface Milestone {
  title: string;
  value: string;
  description: string;
  position: number;
}

export default function TimelineClient({
  currentCodeChanges,
}: TimelineClientProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const currentValue = parseInt(currentCodeChanges.replace(/,/g, ""));

  const milestones: Milestone[] = useMemo(
    () => [
      { title: "LAUNCH", value: "0", description: "Genesis block", position: 0 },
      {
        title: "1M LINES",
        value: "1,000,000",
        description: "Code milestone",
        position: 0.25,
      },
      {
        title: "50 PROJECTS",
        value: "50",
        description: "Ecosystem growth",
        position: 0.5,
      },
      {
        title: "3M NET GROWTH",
        value: "3,000,000",
        description: "Net lines added",
        position: 0.75,
      },
      {
        title: "NOW",
        value: currentCodeChanges,
        description: "And counting...",
        position: 1,
      },
    ],
    [currentCodeChanges]
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const checkReducedMotion = () => {
      setPrefersReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };

    checkMobile();
    checkReducedMotion();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=200%",
          onUpdate: (self) => {
            const progress = self.progress;

            // Update progress bar width
            if (progressBarRef.current) {
              gsap.to(progressBarRef.current, {
                width: `${progress * 100}%`,
                duration: 0.1,
              });
            }

            // Update counter
            if (counterRef.current) {
              const displayValue = Math.floor(progress * currentValue);
              counterRef.current.textContent = displayValue.toLocaleString();
            }

            // Update active milestone
            let newActiveMilestone = 0;
            for (let i = milestones.length - 1; i >= 0; i--) {
              if (progress >= milestones[i].position) {
                newActiveMilestone = i;
                break;
              }
            }
            setActiveMilestone(newActiveMilestone);
          },
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [isMobile, prefersReducedMotion, currentValue, milestones]);

  if (isMobile) {
    return (
      <div className="w-full py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="h-[2px] w-8 bg-primary"></div>
              <h2 className="text-[11px] font-[700] text-primary uppercase tracking-[0.1em]">
                MOMENTUM
              </h2>
              <div className="h-[2px] w-8 bg-primary"></div>
            </div>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <MilestoneCard
                key={index}
                title={milestone.title}
                value={milestone.value}
                description={milestone.description}
                isActive={true}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-[2px] w-8 bg-primary"></div>
            <h2 className="text-[11px] font-[700] text-primary uppercase tracking-[0.1em]">
              MOMENTUM
            </h2>
            <div className="h-[2px] w-8 bg-primary"></div>
          </div>
        </div>

        {/* Center Counter */}
        <div className="mb-20">
          <div
            ref={counterRef}
            className="text-[80px] md:text-[120px] font-[900] font-orbitron text-white tracking-wider"
          >
            0
          </div>
          <div className="text-center text-[13px] text-[#929298] mt-2">
            Total code changes
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative w-full max-w-6xl px-8">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-8 right-8 h-[4px] bg-[#1a1a1a] transform -translate-y-1/2">
            {/* Active Progress */}
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-[#00d4ff] transition-all duration-100"
              style={{ width: "0%" }}
            ></div>

            {/* Milestone Dots */}
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${milestone.position * 100}%` }}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                    index <= activeMilestone
                      ? "bg-primary border-primary shadow-[0_0_12px_rgba(0,122,255,0.8)]"
                      : "bg-[#1a1a1a] border-[#333]"
                  }`}
                ></div>
              </div>
            ))}
          </div>

          {/* Milestone Cards */}
          <div className="relative flex justify-between items-center mt-24">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex-shrink-0">
                <MilestoneCard
                  title={milestone.title}
                  value={milestone.value}
                  description={milestone.description}
                  isActive={index <= activeMilestone}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
