"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Settings, Clock } from "lucide-react";
import type { ReactNode } from "react";

interface PainPoint {
  icon: ReactNode;
  accentColor: string;
  title: string;
  description: string;
}

const PAIN_POINTS: PainPoint[] = [
  {
    icon: <Link2 size={24} />,
    accentColor: "#FF4444",
    title: "Shared Congestion",
    description:
      "Stop competing for block space and paying unpredictable gas fees during network spikes.",
  },
  {
    icon: <Settings size={24} />,
    accentColor: "#FF8844",
    title: "One-Size-Fits-All",
    description:
      "Standard networks limit your ability to customize gas tokens, consensus, or privacy.",
  },
  {
    icon: <Clock size={24} />,
    accentColor: "#FFAA00",
    title: "Months to Launch",
    description:
      "Building an L2 from scratch takes massive engineering resources and time.",
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
      className="flex flex-col items-start p-8 card-charcoal"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div
        className="w-12 h-12 flex items-center justify-center mb-5"
        style={{ backgroundColor: `${point.accentColor}20`, color: point.accentColor }}
      >
        {point.icon}
      </div>
      <h3
        className="text-[18px] font-[900] uppercase tracking-[0.06em] mb-3"
        style={{ color: point.accentColor }}
      >
        {point.title}
      </h3>
      <p className="text-[15px] text-[#c5c5ca] leading-relaxed">
        {point.description}
      </p>
    </div>
  );
}

export default function PainPoints() {
  return (
    <section
      id="pain-points"
      className="relative z-10 w-full flex justify-center bg-black px-6 py-[160px] [@media(max-width:700px)]:py-[80px]"
    >
      <div className="w-full max-w-[1280px]">
        <h2 className="text-[38px] md:text-[48px] [@media(max-width:700px)]:text-[32px] font-[900] tracking-[0.06em] uppercase text-white text-center mb-4">
          The Limits
        </h2>
        <p className="text-[16px] text-[#929298] text-center mb-[80px] max-w-[600px] mx-auto">
          Why deploying your own L2 is the right choice for your application.
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
