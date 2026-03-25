"use client";

import { useState, useEffect, useCallback } from "react";

interface Props {
  onComplete: () => void;
}

const BOOT_LINES = [
  { text: "INITIALIZING FUSION REACTOR...", delay: 0 },
  { text: "[OK]  VACUUM SEAL: SECURE", delay: 400 },
  { text: "[OK]  PLASMA STABILITY: OPTIMAL", delay: 300 },
  { text: "[OK]  MAGNET SYSTEMS: ENGAGED", delay: 350 },
  { text: "[OK]  CONFINEMENT FIELD: STABLE", delay: 300 },
  { text: "[WAIT] PLASMA IGNITION: 42%...", delay: 500 },
];

/**
 * CRT boot sequence with AI-generated photorealistic monitor as base.
 * Animated text + progress bar overlay on top of the image.
 */
export default function BootSequence({ onComplete }: Props) {
  const [phase, setPhase] = useState<"off" | "flicker" | "boot" | "logo" | "done">("off");
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [imgRevealed, setImgRevealed] = useState(false);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  // Phase sequencing
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("flicker"), 300);
    const t2 = setTimeout(() => {
      setPhase("boot");
      setImgRevealed(true);
    }, 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Boot lines typewriter
  useEffect(() => {
    if (phase !== "boot") return;

    let total = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      total += line.delay;
      timers.push(setTimeout(() => setVisibleLines(i + 1), total));
    });

    // Start progress bar after all lines
    timers.push(
      setTimeout(() => {
        let p = 0;
        const interval = setInterval(() => {
          p += Math.random() * 15 + 5;
          if (p >= 100) {
            p = 100;
            clearInterval(interval);
            setTimeout(() => setPhase("logo"), 200);
          }
          setProgress(Math.min(p, 100));
        }, 80);
      }, total + 200)
    );

    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Logo phase -> done
  useEffect(() => {
    if (phase !== "logo") return;
    const t = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 1800);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" style={{ background: "#0a0a08" }}>
      {/* === Layer 0: Photorealistic CRT monitor image === */}
      <div
        className="absolute inset-0 transition-all duration-[1200ms] ease-out"
        style={{
          opacity: imgRevealed ? 1 : 0,
          transform: imgRevealed ? "scale(1)" : "scale(1.02)",
        }}
      >
        {/* Aspect-ratio preserving container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/retro-tv/boot-screen.png"
            alt=""
            className="w-full h-full object-cover"
            style={{
              // Nearly invisible during boot (only CRT edges faintly visible)
              // Slightly brighter during logo for ambient glow reveal
              filter:
                phase === "logo"
                  ? "brightness(0.25) saturate(1.2)"
                  : "brightness(0.06) saturate(0.5)",
              transition: "filter 1s ease-out",
            }}
          />
        </div>
      </div>

      {/* === Layer 1: Ambient CRT glow === */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 48%, rgba(51,255,51,0.08) 0%, transparent 70%)",
          opacity: imgRevealed ? 1 : 0,
        }}
      />

      {/* === Layer 2: Interactive boot content overlay === */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Power-on horizontal line flash */}
        {phase === "flicker" && (
          <div
            className="absolute left-0 right-0 h-[2px] top-1/2 -translate-y-1/2 z-20"
            style={{
              background:
                "linear-gradient(90deg, transparent 5%, #33ff33 20%, #33ff33 80%, transparent 95%)",
              boxShadow: "0 0 30px #33ff3380, 0 0 80px #33ff3340",
              animation: "crtFlickerLine 0.5s ease-out forwards",
            }}
          />
        )}

        {/* Boot text content — positioned to overlap with image screen area */}
        {(phase === "boot" || phase === "logo") && (
          <div className="relative z-10 w-full max-w-2xl px-8 font-mono text-sm md:text-base">
            {/* Japanese corner labels */}
            <div
              className="flex justify-between mb-6 text-[10px] md:text-xs"
              style={{ color: "#33ff3380" }}
            >
              <div>
                トーカマク
                <br />
                ネットワーク
              </div>
              <div className="text-right">
                核融合炉始動中
                <br />
                システム正常
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4" style={{ color: "#33ff33" }}>
              <h1
                className="text-3xl md:text-5xl font-bold tracking-wider"
                style={{
                  textShadow:
                    "0 0 15px #33ff3370, 0 0 40px #33ff3330, 0 0 80px #33ff3315",
                }}
              >
                TOKAMAK NETWORK
              </h1>
            </div>

            {/* Status line */}
            <div
              className="text-center mb-6 text-xs md:text-sm"
              style={{ color: "#33ff3399" }}
            >
              <div>SYSTEM STATUS: ACTIVE</div>
              <div>REACTOR CONFINEMENT FIELD: STABLE</div>
            </div>

            {/* Boot log lines */}
            <div className="space-y-1 mb-6" style={{ color: "#33ff33cc" }}>
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <div key={i} className="text-xs md:text-sm">
                  {line.text}
                  {i === visibleLines - 1 && visibleLines < BOOT_LINES.length && (
                    <span style={{ opacity: cursorVisible ? 1 : 0 }}>█</span>
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            {progress > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 h-3 border rounded-sm overflow-hidden"
                    style={{ borderColor: "#33ff3340" }}
                  >
                    <div
                      className="h-full transition-[width] duration-100"
                      style={{
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, #33ff33, #33ff33cc)",
                        boxShadow: "0 0 12px #33ff3380",
                      }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: "#33ff3399" }}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div
                  className="flex justify-between text-[10px]"
                  style={{ color: "#33ff3360" }}
                >
                  <span>STATUS: POWERING UP...</span>
                  <span>SYSTEM_BUILD_v2.026</span>
                </div>
              </div>
            )}

            {/* Logo reveal phase */}
            {phase === "logo" && (
              <div
                className="text-center mt-8 animate-pulse"
                style={{ color: "#33ff33" }}
              >
                <div
                  className="text-lg md:text-xl tracking-[0.3em]"
                  style={{ textShadow: "0 0 20px #33ff3360" }}
                >
                  {">"} REACTOR STATUS: ONLINE
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* === Layer 3: CRT scan lines === */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
        }}
      />

      {/* === Layer 4: Screen flicker === */}
      <div
        className="absolute inset-0 pointer-events-none z-[29]"
        style={{
          background: "rgba(51, 255, 51, 0.015)",
          animation: "crtFlicker 0.1s infinite alternate",
        }}
      />

      {/* === Layer 5: Vignette (CRT edges) === */}
      <div
        className="absolute inset-0 pointer-events-none z-[28]"
        style={{
          background:
            "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.8) 100%)",
        }}
      />
    </div>
  );
}
