"use client";

import { useEffect, useRef, useState } from "react";

interface Differentiator {
  title: string;
  description: string;
}

const DIFFERENTIATORS: Differentiator[] = [
  {
    title: "Dedicated Throughput",
    description: "Your L2, your capacity. No competing with other apps for blockspace.",
  },
  {
    title: "Custom Configuration",
    description: "Tailor VM type, privacy settings, and gas parameters to your needs.",
  },
  {
    title: "Ethereum-grade Security",
    description: "Inherit Ethereum's battle-tested security while running your own chain.",
  },
];

function ArchitectureDiagram() {
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
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const steps = [
    { label: "Your App", color: "#0078FF" },
    { label: "Tokamak SDK", color: "#0078FF" },
    { label: "Custom L2", color: "#0078FF" },
    { label: "Ethereum", color: "#627EEA" },
  ];

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-2 [@media(max-width:700px)]:flex-col py-8"
    >
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2 [@media(max-width:700px)]:flex-col">
          <div
            className="px-6 py-3 rounded-xl border text-[14px] font-[500] text-white transition-all duration-500"
            style={{
              borderColor: step.color,
              backgroundColor: `${step.color}15`,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${i * 200}ms`,
            }}
          >
            {step.label}
          </div>
          {i < steps.length - 1 && (
            <span
              className="text-white/30 text-[18px] [@media(max-width:700px)]:rotate-90 transition-opacity duration-500"
              style={{
                opacity: isVisible ? 1 : 0,
                transitionDelay: `${i * 200 + 100}ms`,
              }}
            >
              →
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function Solution() {
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
    <section className="w-full flex justify-center bg-[#1C1C1C] px-6 py-[100px] [@media(max-width:700px)]:py-[60px]">
      <div ref={ref} className="w-full max-w-[1200px]">
        <h2 className="text-[14px] uppercase tracking-[3px] text-[#0078FF] font-[500] mb-4 text-center">
          The Solution
        </h2>
        <p
          className="text-[32px] [@media(max-width:700px)]:text-[24px] text-white font-[400] text-center mb-[20px] max-w-[700px] mx-auto leading-snug transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          Tokamak lets you launch a tailored L2 in minutes.
        </p>
        <p className="text-[16px] text-white/50 font-[300] text-center mb-[40px] max-w-[500px] mx-auto">
          From your application to Ethereum, in one seamless flow.
        </p>

        <ArchitectureDiagram />

        <div className="grid grid-cols-3 [@media(max-width:900px)]:grid-cols-1 gap-6 mt-[60px]">
          {DIFFERENTIATORS.map((d, i) => (
            <div
              key={d.title}
              className="flex flex-col items-start p-6 transition-all duration-700"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 150 + 400}ms`,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-[#0078FF] mb-4" />
              <h3 className="text-[18px] font-[500] text-white mb-2">
                {d.title}
              </h3>
              <p className="text-[14px] text-white/50 font-[300] leading-relaxed">
                {d.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
