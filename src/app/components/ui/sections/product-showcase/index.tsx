"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SHOWCASE_CLIPS, type ShowcaseClip } from "./clips";

const AUTO_ROTATE_MS = 9000;
const CROSSFADE_MS = 900;

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const total = SHOWCASE_CLIPS.length;
  const clip = SHOWCASE_CLIPS[activeIndex];

  const goto = useCallback(
    (next: number) => setActiveIndex(((next % total) + total) % total),
    [total]
  );
  const next = useCallback(() => goto(activeIndex + 1), [activeIndex, goto]);
  const prev = useCallback(() => goto(activeIndex - 1), [activeIndex, goto]);

  useEffect(() => {
    if (hovering) return;
    const t = setInterval(next, AUTO_ROTATE_MS);
    return () => clearInterval(t);
  }, [hovering, next]);

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
      style={{ height: "min(90vh, 920px)" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stacked video layers — crossfade */}
      {SHOWCASE_CLIPS.map((c, i) => (
        <ClipLayer key={c.id} clip={c} active={i === activeIndex} />
      ))}

      {/* Cinematic post-processing stack */}
      {/* Heavy vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 80%, rgba(0,0,0,0.9) 100%)",
        }}
      />
      {/* Bottom gradient for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
      {/* Top fade — section blends with previous section */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.10] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />

      {/* Glass text card — bottom-left */}
      <div className="absolute left-6 sm:left-12 lg:left-16 bottom-8 sm:bottom-14 right-6 sm:right-auto sm:max-w-[500px] z-10">
        <ClipCard clip={clip} />
      </div>

      {/* CTA — bottom-right */}
      <div className="absolute right-6 sm:right-12 lg:right-16 bottom-8 sm:bottom-14 z-10">
        <a
          href={clip.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white text-black text-xs sm:text-[13px] font-medium tracking-wide transition-all shadow-[0_10px_40px_rgba(255,255,255,0.15)] hover:shadow-[0_14px_50px_rgba(255,255,255,0.25)] hover:scale-[1.02]"
        >
          Explore more
          <span
            className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-black text-white transition-transform group-hover:translate-x-0.5"
            aria-hidden
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 6h8m0 0L6 2m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      </div>

      {/* Minimal dot navigation — bottom center, low-key */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 sm:bottom-6 z-10 flex items-center gap-1.5">
        {SHOWCASE_CLIPS.map((c, i) => (
          <button
            key={c.id}
            type="button"
            onClick={() => goto(i)}
            aria-label={`Show ${c.name}`}
            className="block h-1 transition-all rounded-full"
            style={{
              width: i === activeIndex ? "28px" : "5px",
              background:
                i === activeIndex ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.3)",
            }}
          />
        ))}
      </div>

      {/* Hover-only arrow nav */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous"
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 text-white/85 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
        style={{ opacity: hovering ? 1 : 0 }}
      >
        <span className="text-base leading-none">←</span>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next"
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 text-white/85 transition-all flex items-center justify-center"
        style={{ opacity: hovering ? 1 : 0 }}
      >
        <span className="text-base leading-none">→</span>
      </button>
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

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) v.play().catch(() => {});
    else v.pause();
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
            // Cinematic grade: more contrast, slightly cool, slightly desaturated
            filter:
              "contrast(1.18) brightness(0.82) saturate(0.85) hue-rotate(-4deg)",
          }}
        >
          {clip.videoWebm && <source src={clip.videoWebm} type="video/webm" />}
          {clip.videoMp4 && <source src={clip.videoMp4} type="video/mp4" />}
        </video>
      ) : (
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl px-6 py-5 sm:px-7 sm:py-6 shadow-2xl">
      <div className="text-[10px] tracking-[0.32em] font-medium uppercase mb-3 text-white/55">
        {clip.category}
      </div>
      <h3 className="text-xl sm:text-2xl lg:text-[28px] font-medium text-white leading-tight mb-2 tracking-tight">
        {clip.name}
      </h3>
      <p className="text-sm sm:text-[15px] text-white/65 leading-relaxed">
        {clip.description}
      </p>
    </div>
  );
}
