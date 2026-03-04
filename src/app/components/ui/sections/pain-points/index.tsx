"use client";

import { useEffect, useRef, useState } from "react";

interface PainPoint {
  icon: string;
  title: string;
  description: string;
}

const PAIN_POINTS: PainPoint[] = [
  {
    icon: "🔗",
    title: "Shared Congestion",
    description:
      "Your users compete with every other app on the same chain. Traffic spikes elsewhere slow your app down.",
  },
  {
    icon: "⚙️",
    title: "One-Size-Fits-All",
    description:
      "Generic L2s force you to compromise on throughput, cost, or privacy. Your app deserves tailored infrastructure.",
  },
  {
    icon: "⏳",
    title: "Months to Launch",
    description:
      "Setting up L2 infrastructure takes engineering teams months of configuration, testing, and deployment.",
  },
];

function PainPointCard({
  point,
  index,
}: {
  point: PainPoint;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col items-start p-8 bg-white/[0.04] border border-white/[0.08] rounded-2xl transition-all duration-700"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0)"
          : "translateY(30px)",
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <span className="text-[32px] mb-4">{point.icon}</span>
      <h3 className="text-[20px] font-[500] text-white mb-3">
        {point.title}
      </h3>
      <p className="text-[15px] text-white/60 font-[300] leading-relaxed">
        {point.description}
      </p>
    </div>
  );
}

export default function PainPoints() {
  return (
    <section
      id="pain-points"
      className="w-full flex justify-center bg-[#1C1C1C] px-6 py-[100px] [@media(max-width:700px)]:py-[60px]"
    >
      <div className="w-full max-w-[1200px]">
        <h2 className="text-[14px] uppercase tracking-[3px] text-[#0078FF] font-[500] mb-4 text-center">
          The Problem
        </h2>
        <p className="text-[28px] [@media(max-width:700px)]:text-[22px] text-white/80 font-[300] text-center mb-[60px] max-w-[600px] mx-auto leading-snug">
          Building on shared L2s means accepting trade-offs
        </p>
        <div className="grid [@media(min-width:1200px)]:grid-cols-3 [@media(min-width:700px)_and_(max-width:1199px)]:grid-cols-2 [@media(max-width:699px)]:grid-cols-1 gap-6">
          {PAIN_POINTS.map((point, i) => (
            <PainPointCard key={point.title} point={point} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
