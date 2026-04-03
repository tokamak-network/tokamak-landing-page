"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Intro sequence
 *
 * Timeline (no video):
 *   0.0s  black
 *   0.8s  title phase — "TOKAMAK NETWORK" slow fade-in
 *   ~3.0s typewriter subtitle begins
 *   ~4.1s typewriter done
 *   5.6s  fadeout — overlay fades, hero appears
 *   6.6s  done — overlay unmounts
 *
 * When a `videoSrc` is provided the video plays first; after it ends
 * the same black→title→fadeout sequence runs.
 */

type Phase = "video" | "black" | "title" | "fadeout" | "done";

/** GradientSweep — reveals text with a left-to-right holographic light sweep */
function GradientSweep({
  text,
  delay = 0,
  duration = 1200,
  className,
}: {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    startTimeRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const p = Math.min(elapsed / duration, 1);
      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - p, 3);
      setProgress(eased * 110); // overshoot to 110% to fully reveal
      if (p < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, duration]);

  const maskGradient = `linear-gradient(90deg, #000 0%, #000 ${progress - 8}%, transparent ${progress}%, transparent 100%)`;

  return (
    <span className={className} style={{ position: "relative", display: "inline-block" }}>
      {/* Revealed text via mask */}
      <span
        style={{
          WebkitMaskImage: maskGradient,
          maskImage: maskGradient,
          display: "inline",
        }}
      >
        {text}
      </span>

      {/* Glowing sweep edge */}
      {started && progress < 105 && (
        <span
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${Math.min(progress, 100)}%`,
            width: "2px",
            background: "rgba(0, 119, 255, 0.9)",
            boxShadow:
              "0 0 8px rgba(0, 119, 255, 0.8), 0 0 20px rgba(0, 119, 255, 0.4), 0 0 40px rgba(0, 119, 255, 0.2)",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />
      )}
    </span>
  );
}

interface IntroSequenceProps {
  /** Optional intro video — plays before the title sequence */
  videoSrc?: string;
}

export default function IntroSequence({ videoSrc }: IntroSequenceProps) {
  const [phase, setPhase] = useState<Phase>(videoSrc ? "video" : "black");
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ── Body scroll lock ── */
  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  /* ── Phase timers ── */
  useEffect(() => {
    if (phase !== "black") return;
    // Brief black, then straight to title (no pulse)
    const t = setTimeout(() => setPhase("title"), 800);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "title") return;
    // Title fade-in: 2.2s | Typewriter: starts 2.2s, 44 chars × 25ms = 1.1s, done ~3.3s
    // + 1.5s breathing room after typewriter → fadeout at 4.8s
    const t = setTimeout(() => setPhase("fadeout"), 4800);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fadeout") return;
    // Notify hero to start fade-in simultaneously
    window.dispatchEvent(new CustomEvent("intro-fadeout"));
    const t = setTimeout(() => setPhase("done"), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  /* ── Video ended handler ── */
  const handleVideoEnd = () => {
    setPhase("black");
  };

  /* ── Skip on click / tap ── */
  const handleSkip = () => {
    if (phase === "video" && videoRef.current) {
      videoRef.current.pause();
    }
    window.dispatchEvent(new CustomEvent("intro-fadeout"));
    setPhase("done");
    document.body.style.overflow = "";
  };

  if (phase === "done") return null;

  return (
    <div
      data-intro
      className="fixed inset-0 select-none"
      style={{ zIndex: 9999 }}
      onClick={handleSkip}
      role="presentation"
    >
      {/* ── Base black layer ── */}
      <motion.div
        className="absolute inset-0 bg-black"
        animate={{
          opacity: phase === "fadeout" ? 0 : 1,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* ── Video phase ── */}
      {phase === "video" && videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-contain"
          style={{ zIndex: 1 }}
        />
      )}

      {/* ── Title phase ── */}
      <AnimatePresence>
        {(phase === "title" || phase === "fadeout") && (
          <motion.div
            key="title"
            className="absolute inset-0 flex flex-col items-center justify-end pb-[18vh] md:pb-[15vh]"
            style={{ zIndex: 3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "fadeout" ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: phase === "fadeout" ? 0.6 : 0.3 }}
          >
            <div className="text-center">
              {/* Main title — slow dramatic fade-in */}
              <motion.h1
                className="font-orbitron text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] font-[900] text-white uppercase leading-[0.95] tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2.2, ease: [0.25, 0.1, 0.25, 1] }}
              >
                TOKAMAK
                <br />
                <span className="text-[#0077ff]">NETWORK</span>
              </motion.h1>

              {/* Tagline — gradient sweep reveal after title is visible */}
              <p className="mt-5 text-[16px] sm:text-[18px] md:text-[20px] text-[#929298] max-w-[520px] mx-auto">
                <GradientSweep
                  text="Every application deserves its own Layer 2"
                  delay={2200}
                  duration={1200}
                />
              </p>

              {/* Invisible spacer matching HeroOverlay CTA buttons height
                  so the title text aligns at the same vertical position */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center invisible" aria-hidden="true">
                <span className="px-8 py-4 text-[15px]">&nbsp;</span>
                <span className="px-8 py-4 text-[15px]">&nbsp;</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fadeout: subtle light flood ── */}
      <AnimatePresence>
        {phase === "fadeout" && (
          <motion.div
            key="cyanout"
            className="absolute inset-0"
            style={{
              zIndex: 4,
              background:
                "radial-gradient(circle at 50% 50%, rgba(42, 114, 229, 0.15) 0%, transparent 60%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, times: [0, 0.4, 1], ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* ── Skip hint ── */}
      {phase !== "fadeout" && (
        <motion.div
          className="absolute"
          style={{
            bottom: "clamp(24px, 4vh, 48px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 0.5, delay: 2.0 }}
        >
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "clamp(9px, 0.8vw, 11px)",
              color: "rgba(42, 114, 229, 0.5)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Click to skip
          </span>
        </motion.div>
      )}
    </div>
  );
}
