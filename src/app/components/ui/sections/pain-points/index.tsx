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
      "Stop competing for block space and paying unpredictable gas fees during network spikes.",
  },
  {
    icon: "⚙️",
    title: "One-Size-Fits-All",
    description:
      "Standard networks limit your ability to customize gas tokens, consensus, or privacy.",
  },
  {
    icon: "⏳",
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
      className="flex flex-col items-start p-8 bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-700 hover:-translate-y-1"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? "translateY(0)"
          : "translateY(30px)",
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <span className="text-[32px] mb-4">{point.icon}</span>
      <h3 className="text-[20px] font-[700] text-[#e63946] mb-3">
        {point.title}
      </h3>
      <p className="text-[15px] text-slate-600 leading-relaxed">
        {point.description}
      </p>
    </div>
  );
}

export default function PainPoints() {
  return (
    <section
      id="pain-points"
      className="w-full flex justify-center bg-slate-50 px-6 py-[100px] [@media(max-width:700px)]:py-[60px]"
    >
      <div className="w-full max-w-[1200px]">
        <h2 className="text-[36px] md:text-[40px] [@media(max-width:700px)]:text-[28px] font-[700] tracking-tight text-slate-900 text-center mb-4">
          The limits of current infrastructure
        </h2>
        <p className="text-[18px] text-slate-600 text-center mb-[60px] max-w-[600px] mx-auto leading-snug">
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
