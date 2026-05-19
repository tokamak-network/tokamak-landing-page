"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SHOWCASE_CLIPS, type ShowcaseClip } from "./clips";

const AUTO_ROTATE_MS = 9000;
const CROSSFADE_MS = 800;

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const total = SHOWCASE_CLIPS.length;
  const clip = SHOWCASE_CLIPS[activeIndex];

  const goto = useCallback(
    (next: number) => {
      setActiveIndex(((next % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => goto(activeIndex + 1), [activeIndex, goto]);
  const prev = useCallback(() => goto(activeIndex - 1), [activeIndex, goto]);

  // Auto-rotate (paused on hover)
  useEffect(() => {
    if (hovering) return;
    const t = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(t);
  }, [hovering, next]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  return (
    <section
      className="relative w-full bg-black overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Section eyebrow */}
      <div className="relative z-20 text-center pt-16 sm:pt-20 px-6">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] tracking-[0.5em] text-cyan-300/85 font-mono uppercase">
            Live Production
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
        </div>
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05]"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          Built on{" "}
          <span className="text-cyan-300 drop-shadow-[0_0_24px_rgba(0,229,255,0.35)]">
            Tokamak
          </span>
        </h2>
      </div>

      {/* Cinematic stage */}
      <div className="relative w-full max-w-[1500px] mx-auto mt-10 sm:mt-14 px-4 sm:px-8 pb-16">
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-zinc-950"
          style={{ aspectRatio: "16 / 9" }}
        >
          {/* Stacked clip layers — crossfade between them */}
          {SHOWCASE_CLIPS.map((c, i) => (
            <ClipLayer
              key={c.id}
              clip={c}
              active={i === activeIndex}
            />
          ))}

          {/* Cinematic post-processing overlays — always on top of video */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          {/* Bottom gradient for text legibility */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
          {/* Subtle cyan light wash from below */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(0,229,255,0.08) 0%, transparent 60%)",
            }}
          />
          {/* Film grain via SVG noise */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "256px 256px",
            }}
          />

          {/* Text overlay — bottom-left glass card */}
          <div className="absolute left-4 sm:left-8 bottom-4 sm:bottom-8 right-4 sm:right-auto sm:max-w-[460px] z-10 pointer-events-none">
            <ClipCard clip={clip} />
          </div>

          {/* CTA — bottom-right */}
          <div className="absolute right-4 sm:right-8 bottom-4 sm:bottom-8 z-10">
            <a
              href={clip.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 hover:bg-white text-black text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase font-semibold transition-all shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
              style={{
                boxShadow: `0 8px 30px ${clip.color}55, 0 0 0 1px ${clip.color}33`,
              }}
            >
              Explore more
              <span className="text-base leading-none" aria-hidden>
                →
              </span>
            </a>
          </div>

          {/* Dot navigation — bottom center */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-3 sm:bottom-4 z-10 flex items-center gap-2">
            {SHOWCASE_CLIPS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => goto(i)}
                aria-label={`Show ${c.name}`}
                className="group relative h-3 w-3 flex items-center justify-center"
              >
                <span
                  className="block rounded-full transition-all"
                  style={{
                    width: i === activeIndex ? "20px" : "6px",
                    height: "4px",
                    background:
                      i === activeIndex ? c.color : "rgba(255,255,255,0.3)",
                    boxShadow:
                      i === activeIndex ? `0 0 10px ${c.color}` : "none",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Side arrow nav (subtle) */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 hover:bg-black/70 hover:border-white/30 text-white/80 transition-all flex items-center justify-center"
          >
            <span className="text-lg leading-none">←</span>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/15 hover:bg-black/70 hover:border-white/30 text-white/80 transition-all flex items-center justify-center"
          >
            <span className="text-lg leading-none">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function ClipLayer({
  clip,
  active,
}: {
  clip: ShowcaseClip;
  active: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(clip.videoMp4 || clip.videoWebm);

  // Pause non-active videos for perf
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  return (
    <div
      className="absolute inset-0 transition-opacity ease-in-out"
      style={{
        opacity: active ? 1 : 0,
        transitionDuration: `${CROSSFADE_MS}ms`,
      }}
    >
      {hasVideo ? (
        <video
          ref={ref}
          autoPlay={active}
          loop
          muted
          playsInline
          poster={clip.poster}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter:
              "contrast(1.12) brightness(0.88) saturate(0.92)",
          }}
        >
          {clip.videoWebm && (
            <source src={clip.videoWebm} type="video/webm" />
          )}
          {clip.videoMp4 && <source src={clip.videoMp4} type="video/mp4" />}
        </video>
      ) : (
        // Placeholder gradient (until real video is added)
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 30% 40%, ${clip.color}55 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, ${clip.color}33 0%, transparent 55%), linear-gradient(135deg, #0a0a14 0%, #06070d 100%)`,
          }}
        />
      )}
    </div>
  );
}

function ClipCard({ clip }: { clip: ShowcaseClip }) {
  return (
    <div className="pointer-events-auto rounded-xl border border-white/15 bg-black/45 backdrop-blur-md px-5 py-4 sm:px-6 sm:py-5 shadow-2xl">
      <div
        className="text-[10px] sm:text-[11px] tracking-[0.4em] font-mono uppercase mb-2 sm:mb-3"
        style={{ color: clip.color }}
      >
        {clip.category}
      </div>
      <h3
        className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 sm:mb-3"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        {clip.name}
      </h3>
      <p className="text-xs sm:text-sm text-white/70 font-mono leading-relaxed">
        {clip.description}
      </p>
    </div>
  );
}
