"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Intro sequence: B+D hybrid
 *
 * Timeline (no video):
 *   0.0s  black
 *   0.6s  pulse phase — cyan dot appears, beats twice
 *   3.0s  title phase — glow expands, text reveals
 *   5.0s  fadeout — cyan-out fills screen
 *   5.8s  done — overlay unmounts, hero visible
 *
 * When a `videoSrc` is provided the video plays first; after it ends
 * the same pulse→title→fadeout sequence runs.
 */

type Phase = "video" | "black" | "pulse" | "title" | "fadeout" | "done";

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

  /* ── Timeline driver ── */
  useEffect(() => {
    if (phase === "video" || phase === "done") return;

    const schedule: [Phase, number][] =
      phase === "black"
        ? [
            ["pulse", 600],
            ["title", 3000],
            ["fadeout", 5000],
            ["done", 5800],
          ]
        : phase === "pulse"
        ? [
            ["title", 2400],
            ["fadeout", 4400],
            ["done", 5200],
          ]
        : phase === "title"
        ? [
            ["fadeout", 2000],
            ["done", 2800],
          ]
        : phase === "fadeout"
        ? [["done", 800]]
        : [];

    const timers = schedule.map(([p, ms]) =>
      setTimeout(() => setPhase(p), ms)
    );
    return () => timers.forEach(clearTimeout);
    // Only re-run when entering a "root" phase
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase === "black" ? "black" : undefined]);

  /* ── Auto-start timeline after black phase ── */
  useEffect(() => {
    if (phase !== "black") return;
    const timers = [
      setTimeout(() => setPhase("pulse"), 600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "pulse") return;
    const timers = [
      setTimeout(() => setPhase("title"), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "title") return;
    const timers = [
      setTimeout(() => setPhase("fadeout"), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "fadeout") return;
    const timers = [
      setTimeout(() => setPhase("done"), 800),
    ];
    return () => timers.forEach(clearTimeout);
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
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
        />
      )}

      {/* ── Pulse phase — cyan dot with heartbeat ── */}
      <AnimatePresence>
        {(phase === "pulse" || phase === "title") && (
          <motion.div
            key="pulse-container"
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Radial glow — expands during title phase */}
            <motion.div
              className="absolute"
              style={{
                width: 600,
                height: 600,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(42, 114, 229, 0.12) 0%, rgba(42, 114, 229, 0.03) 40%, transparent 70%)",
                filter: "blur(40px)",
              }}
              animate={{
                scale: phase === "title" ? 3 : 1,
                opacity: phase === "title" ? 0.8 : 0.4,
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {/* The dot */}
            <motion.div
              className="relative"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#2A72E5",
                boxShadow:
                  "0 0 20px rgba(42, 114, 229, 0.8), 0 0 60px rgba(42, 114, 229, 0.4), 0 0 120px rgba(42, 114, 229, 0.2)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={
                phase === "pulse"
                  ? {
                      scale: [0, 1, 1.8, 1, 1.8, 1],
                      opacity: [0, 1, 0.6, 1, 0.6, 1],
                    }
                  : {
                      scale: 0,
                      opacity: 0,
                    }
              }
              transition={
                phase === "pulse"
                  ? {
                      duration: 2.0,
                      times: [0, 0.15, 0.3, 0.5, 0.65, 0.8],
                      ease: "easeInOut",
                    }
                  : { duration: 0.4 }
              }
            />

            {/* Pulse rings (heartbeat ripple) */}
            {phase === "pulse" && (
              <>
                <motion.div
                  className="absolute"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    border: "1px solid rgba(42, 114, 229, 0.6)",
                  }}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 12, opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3,
                    ease: "easeOut",
                  }}
                />
                <motion.div
                  className="absolute"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    border: "1px solid rgba(42, 114, 229, 0.6)",
                  }}
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 12, opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    delay: 1.1,
                    ease: "easeOut",
                  }}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Title phase — matches HeroOverlay exactly ── */}
      <AnimatePresence>
        {(phase === "title" || phase === "fadeout") && (
          <motion.div
            key="title"
            className="absolute inset-0 flex flex-col items-center justify-end pb-[18vh] md:pb-[15vh]"
            style={{ zIndex: 3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "fadeout" ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: phase === "fadeout" ? 0.6 : 0.8 }}
          >
            <div className="text-center">
              {/* Main title — identical to HeroOverlay h1 */}
              <motion.h1
                className="font-orbitron text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] font-[900] text-white uppercase leading-[0.95] tracking-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                TOKAMAK
                <br />
                <span className="text-[#0077ff]">NETWORK</span>
              </motion.h1>

              {/* Tagline — identical to HeroOverlay p */}
              <motion.p
                className="mt-5 text-[16px] sm:text-[18px] md:text-[20px] text-[#929298] max-w-[520px] mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Every application deserves its own Layer 2
              </motion.p>

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

      {/* ── Fadeout: cyan light flood ── */}
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
