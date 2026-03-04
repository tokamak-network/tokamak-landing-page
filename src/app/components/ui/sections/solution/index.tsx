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
    { label: "YOUR APP", color: "#0077FF" },
    { label: "TOKAMAK SDK", color: "#0077FF" },
    { label: "CUSTOM L2", color: "#0077FF" },
    { label: "ETHEREUM", color: "#627EEA" },
  ];

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-2 [@media(max-width:700px)]:flex-col py-8"
    >
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center gap-2 [@media(max-width:700px)]:flex-col">
          <div
            className="px-6 py-3 border text-[14px] font-[700] text-white uppercase tracking-[0.06em] transition-all duration-500"
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
              className="text-[#434347] text-[18px] [@media(max-width:700px)]:rotate-90 transition-opacity duration-500"
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
    <section className="relative z-10 w-full flex justify-center bg-black px-6 py-[160px] [@media(max-width:700px)]:py-[80px]">
      <div ref={ref} className="w-full max-w-[1280px]">
        <h2 className="text-[12px] uppercase tracking-[0.08em] text-primary font-[700] mb-4 text-center">
          The Solution
        </h2>
        <p
          className="text-[38px] [@media(max-width:700px)]:text-[28px] text-white font-[900] text-center mb-[20px] max-w-[700px] mx-auto leading-tight tracking-[0.04em] uppercase transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          Launch a Tailored L2 in Minutes
        </p>
        <p className="text-[16px] text-[#929298] text-center mb-[40px] max-w-[500px] mx-auto">
          From your application to Ethereum, in one seamless flow.
        </p>

        <ArchitectureDiagram />

        <div className="grid [@media(min-width:1200px)]:grid-cols-3 [@media(min-width:700px)_and_(max-width:1199px)]:grid-cols-2 [@media(max-width:699px)]:grid-cols-1 gap-6 mt-[60px]">
          {DIFFERENTIATORS.map((d, i) => (
            <div
              key={d.title}
              className="flex flex-col items-start p-8 card-charcoal"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 150 + 400}ms`,
              }}
            >
              <div className="w-2 h-2 bg-primary mb-4" />
              <h3 className="text-[18px] font-[900] text-white mb-2 uppercase tracking-[0.04em]">
                {d.title}
              </h3>
              <p className="text-[14px] text-[#929298] leading-relaxed">
                {d.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
