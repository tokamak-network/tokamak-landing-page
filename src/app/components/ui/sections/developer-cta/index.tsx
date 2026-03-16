"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, Github, Award, Terminal, ChevronRight } from "lucide-react";
import { LINKS } from "@/app/constants/links";

// ── Data ─────────────────────────────────────────────────────────────

interface Step {
  num: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  icon: React.ReactNode;
  command: string;
  color: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "Docs",
    desc: "Read the documentation and understand Tokamak's L2 architecture",
    cta: "Open Docs",
    href: LINKS.DOCS,
    icon: <BookOpen size={20} />,
    command: "open https://docs.tokamak.network",
    color: "#0ea5e9",
  },
  {
    num: "02",
    title: "GitHub",
    desc: "Explore the codebase, clone repos, and start building",
    cta: "View Code",
    href: LINKS.GITHUB,
    icon: <Github size={20} />,
    command: "git clone tokamak-network/L2",
    color: "#22c55e",
  },
  {
    num: "03",
    title: "Grant",
    desc: "Get funded to build on Tokamak and ship to production",
    cta: "Apply Now",
    href: LINKS.GRANT,
    icon: <Award size={20} />,
    command: "tokamak grant apply --mainnet",
    color: "#a855f7",
  },
];

// ── Typing effect ────────────────────────────────────────────────────

function useTypingEffect(text: string, trigger: boolean, speed = 40) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!trigger) return;
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, trigger, speed]);

  return displayed;
}

// ── Step card ────────────────────────────────────────────────────────

function StepCard({
  step,
  index,
  isVisible,
  isActive,
  onHover,
}: {
  readonly step: Step;
  readonly index: number;
  readonly isVisible: boolean;
  readonly isActive: boolean;
  readonly onHover: () => void;
}) {
  const typed = useTypingEffect(step.command, isActive);

  return (
    <motion.div
      className="relative flex-1 min-w-[280px] group"
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ delay: 0.2 + index * 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={onHover}
    >
      {/* Connector line to next step (desktop only) */}
      {index < STEPS.length - 1 && (
        <div className="hidden [@media(min-width:801px)]:block absolute top-[36px] right-[-24px] z-10">
          <ChevronRight size={16} className="text-[#333]" />
        </div>
      )}

      <a
        href={step.href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex flex-col h-full overflow-hidden rounded-lg border transition-all duration-300"
        style={{
          borderColor: isActive ? step.color + "60" : "#1a1a1a",
          backgroundColor: isActive ? step.color + "08" : "#0a0a0a",
          boxShadow: isActive
            ? `0 0 40px ${step.color}15, inset 0 1px 0 ${step.color}20`
            : "none",
        }}
      >
        {/* Top: step number + icon */}
        <div className="flex items-center justify-between p-6 pb-0">
          <span
            className="text-[40px] font-orbitron font-[900] leading-none"
            style={{ color: step.color + "30" }}
          >
            {step.num}
          </span>
          <div
            className="w-10 h-10 rounded flex items-center justify-center transition-colors duration-300"
            style={{
              backgroundColor: isActive ? step.color + "25" : "#ffffff08",
              color: isActive ? step.color : "#666",
            }}
          >
            {step.icon}
          </div>
        </div>

        {/* Title + description */}
        <div className="px-6 pt-4 pb-3 flex-1">
          <h3
            className="text-[20px] font-[900] uppercase tracking-[0.06em] mb-2 transition-colors duration-300"
            style={{ color: isActive ? step.color : "#fff" }}
          >
            {step.title}
          </h3>
          <p className="text-[14px] text-[#929298] leading-relaxed">
            {step.desc}
          </p>
        </div>

        {/* Terminal mockup */}
        <div
          className="mx-4 mb-4 rounded overflow-hidden border transition-colors duration-300"
          style={{ borderColor: isActive ? step.color + "30" : "#1a1a1a" }}
        >
          {/* Terminal header */}
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#0d0d0d] border-b border-[#1a1a1a]">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
            <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
            <div className="w-2 h-2 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-[9px] text-[#555] font-mono">terminal</span>
          </div>
          {/* Command line */}
          <div className="px-3 py-3 bg-[#080808] font-mono text-[12px] flex items-center gap-2 min-h-[40px]">
            <Terminal size={12} className="text-[#555] shrink-0" />
            <span style={{ color: step.color }}>$</span>
            <span className="text-[#ccc]">
              {isActive ? typed : step.command}
            </span>
            {isActive && typed.length < step.command.length && (
              <span
                className="inline-block w-[7px] h-[14px] animate-pulse"
                style={{ backgroundColor: step.color }}
              />
            )}
          </div>
        </div>

        {/* CTA button */}
        <div className="px-6 pb-6 pt-2">
          <span
            className="inline-flex items-center gap-2 text-[13px] font-[700] uppercase tracking-[0.06em] transition-colors duration-300"
            style={{ color: step.color }}
          >
            {step.cta}
            <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </span>
        </div>

        {/* Top edge glow when active */}
        {isActive && (
          <div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`,
            }}
          />
        )}
      </a>
    </motion.div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────

export default function DeveloperCta() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-cycle through steps
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STEPS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isVisible]);

  const handleHover = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section
      id="developer-cta"
      className="relative z-10 w-full flex justify-center px-6 py-[160px] [@media(max-width:640px)]:py-[80px]"
    >
      <div ref={ref} className="w-full max-w-[1280px] flex flex-col items-center">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-[1px] bg-primary" />
          <span className="text-[12px] text-primary font-[700] uppercase tracking-[0.1em]">
            Developer Resources
          </span>
          <div className="w-8 h-[1px] bg-primary" />
        </motion.div>

        <motion.h2
          className="text-[38px] md:text-[48px] [@media(max-width:700px)]:text-[28px] font-[900] text-white tracking-[0.06em] uppercase mb-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Start Building
        </motion.h2>

        <motion.p
          className="text-[16px] text-[#929298] mb-[60px] text-center max-w-[500px]"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Everything you need to launch your own L2
        </motion.p>

        {/* Step progress indicator */}
        <motion.div
          className="flex items-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {STEPS.map((step, i) => (
            <button
              key={step.num}
              className="flex items-center gap-2"
              onClick={() => setActiveIndex(i)}
            >
              <div
                className="h-[3px] rounded-full transition-all duration-500"
                style={{
                  width: i === activeIndex ? 32 : 12,
                  backgroundColor:
                    i === activeIndex ? step.color : "#333",
                }}
              />
            </button>
          ))}
        </motion.div>

        {/* Cards */}
        <div className="flex gap-6 w-full [@media(max-width:800px)]:flex-col">
          {STEPS.map((step, i) => (
            <StepCard
              key={step.num}
              step={step}
              index={i}
              isVisible={isVisible}
              isActive={i === activeIndex}
              onHover={() => handleHover(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
