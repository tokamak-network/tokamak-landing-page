"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { SHOWCASE_CLIPS, type ShowcaseClip } from "./clips";

const AUTO_ROTATE_MS = 9000;
const CROSSFADE_MS = 800;

export default function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [muted, setMuted] = useState(true);
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
      className="relative w-full lg:min-h-screen bg-black overflow-hidden flex items-start lg:items-center"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Background — blueprint grid framed by radial mask */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.13]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(74,142,250,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(74,142,250,0.22) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 50%, black 35%, transparent 100%)",
        }}
      />
      {/* Background — cyan glow bottom-left */}
      <div
        aria-hidden
        className="absolute -bottom-48 -left-40 w-[680px] h-[680px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(42,114,229,0.22) 0%, transparent 65%)",
        }}
      />
      {/* Background — subtle counter glow top-right */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[520px] h-[520px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(122,176,255,0.10) 0%, transparent 65%)",
        }}
      />

      <div className="relative w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.75fr)] gap-6 lg:gap-14 items-center">
        {/* Left — Cinematic stage */}
        <div className="relative w-full order-2 lg:order-1">
          {/* Frame wrapper — FUI-style bezel */}
          <div
            className="relative rounded-[22px] p-[6px] bg-gradient-to-b from-[#0c1430] via-[#070b1c] to-[#040814] border border-[#4A8EFA]/30 shadow-[0_0_60px_rgba(42,114,229,0.18),inset_0_1px_0_rgba(255,255,255,0.05)]"
          >
          {/* Top frame label badge */}
          <div
            className="absolute -top-3 left-6 z-30 px-2.5 py-1 rounded-md bg-[#040814] border border-[#4A8EFA]/40 text-[9px] sm:text-[10px] tracking-[0.32em] text-[#7AB0FF]/95 uppercase shadow-[0_0_18px_rgba(42,114,229,0.25)]"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_6px_#2A72E5] mr-2 align-middle animate-pulse" />
            Feed 01 · Stage Live
          </div>

          {/* Top-right frame coordinates */}
          <div
            className="absolute -top-3 right-6 z-30 px-2.5 py-1 rounded-md bg-[#040814] border border-[#4A8EFA]/25 text-[9px] sm:text-[10px] tracking-[0.32em] text-white/55 uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            16:9 · 1500
          </div>

          <div
            className="relative w-full rounded-[16px] overflow-hidden bg-zinc-950"
            style={{ aspectRatio: "16 / 9" }}
          >
          {/* Stacked clip layers — crossfade between them */}
          {SHOWCASE_CLIPS.map((c, i) => (
            <ClipLayer
              key={c.id}
              clip={c}
              active={i === activeIndex}
              muted={muted}
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
          {/* Subtle Tokamak blue light wash from below */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(42,114,229,0.10) 0%, transparent 60%)",
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

          {/* Corner brackets — FUI HUD */}
          <span className="absolute top-3 left-3 z-20 w-5 h-5 border-l-2 border-t-2 border-[#4A8EFA]/85 pointer-events-none" />
          <span className="absolute top-3 right-3 z-20 w-5 h-5 border-r-2 border-t-2 border-[#4A8EFA]/85 pointer-events-none" />
          <span className="absolute bottom-3 left-3 z-20 w-5 h-5 border-l-2 border-b-2 border-[#4A8EFA]/85 pointer-events-none" />
          <span className="absolute bottom-3 right-3 z-20 w-5 h-5 border-r-2 border-b-2 border-[#4A8EFA]/85 pointer-events-none" />

          {/* Mute toggle */}
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute video" : "Mute video"}
            className="absolute top-3 right-12 z-30 h-9 w-9 rounded-full bg-black/55 backdrop-blur-sm border border-[#4A8EFA]/40 hover:border-[#4A8EFA] hover:bg-black/80 text-white/85 hover:text-white transition-all flex items-center justify-center"
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          </div>

          {/* Frame bottom telemetry strip */}
          <div
            className="absolute -bottom-3 left-6 z-30 px-2.5 py-1 rounded-md bg-[#040814] border border-[#4A8EFA]/25 text-[9px] sm:text-[10px] tracking-[0.32em] text-white/55 uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Sync · OK
          </div>
          </div>
        </div>

        {/* Right — Title + synced meta panel + roster */}
        <div className="relative z-20 max-w-md lg:max-w-none order-1 lg:order-2 flex flex-col gap-6">
          <div>
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
              <span
                className="text-[10px] sm:text-[11px] tracking-[0.5em] text-[#7AB0FF]/90 uppercase"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                Live Production
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-[1.05] tracking-tight">
              Built on{" "}
              <span className="text-[#7AB0FF] drop-shadow-[0_0_24px_rgba(42,114,229,0.55)]">
                Tokamak
              </span>
            </h2>
            <p
              className="mt-4 text-sm text-white/55 leading-relaxed max-w-md"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              Real products shipping on the network.
            </p>
          </div>

          <MetaPanel clip={clip} index={activeIndex} total={total} />

          <Roster
            clips={SHOWCASE_CLIPS}
            activeIndex={activeIndex}
            onSelect={goto}
          />
        </div>
      </div>
    </section>
  );
}

function ClipLayer({
  clip,
  active,
  muted,
}: {
  clip: ShowcaseClip;
  active: boolean;
  muted: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(clip.videoMp4 || clip.videoWebm);

  // Restart from the beginning whenever this clip becomes active, and
  // pause non-active videos for perf. Mute state is mirrored both ways.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = muted;
    if (active) {
      try {
        v.currentTime = 0;
      } catch {
        /* some browsers reject seek before metadata is ready */
      }
      v.play().catch(() => {});
    } else {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }, [active, muted]);

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
          muted={muted}
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

function MetaPanel({
  clip,
  index,
  total,
}: {
  clip: ShowcaseClip;
  index: number;
  total: number;
}) {
  const domain = useMemo(() => {
    try {
      return new URL(clip.url).hostname.replace(/^www\./, "");
    } catch {
      return clip.url;
    }
  }, [clip.url]);

  return (
    <div
      className="relative rounded-xl border border-[#4A8EFA]/25 bg-[#040814]/70 backdrop-blur-sm p-4 sm:p-5 overflow-hidden transition-[box-shadow] duration-500"
      style={{
        boxShadow: `0 0 30px ${clip.color}1f, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Left color spine — bound to active clip */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-500"
        style={{
          background: clip.color,
          boxShadow: `0 0 14px ${clip.color}, 0 0 28px ${clip.color}55`,
        }}
      />
      {/* Top row: category + status */}
      <div className="flex items-center justify-between mb-3 pl-2">
        <span
          className="text-[10px] tracking-[0.35em] uppercase transition-colors duration-500"
          style={{
            color: clip.color,
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          {clip.category}
        </span>
        <span
          className="flex items-center gap-1.5 text-[9px] tracking-[0.3em] uppercase text-white/55"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{
              background: clip.color,
              boxShadow: `0 0 8px ${clip.color}`,
            }}
          />
          Live · 0{index + 1}/0{total}
        </span>
      </div>

      <h3 className="pl-2 text-lg sm:text-xl font-semibold text-white leading-tight mb-1.5 tracking-tight">
        {clip.name}
      </h3>
      <p
        className="pl-2 text-xs sm:text-[13px] text-white/65 leading-relaxed"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {clip.description}
      </p>

      {clip.tags && clip.tags.length > 0 && (
        <div className="mt-3 pl-2 flex flex-wrap gap-1.5">
          {clip.tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded border border-white/15 bg-white/[0.04] text-[9.5px] tracking-[0.18em] uppercase text-white/65"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <a
        href={clip.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group/cta mt-5 ml-2 inline-flex items-center gap-3 px-5 py-3 rounded-full border text-[11px] sm:text-xs tracking-[0.28em] uppercase font-semibold transition-all"
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          color: clip.color,
          borderColor: `${clip.color}80`,
          background: `${clip.color}14`,
          boxShadow: `0 0 28px ${clip.color}33, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `${clip.color}26`;
          e.currentTarget.style.borderColor = clip.color;
          e.currentTarget.style.boxShadow = `0 0 44px ${clip.color}55, inset 0 1px 0 rgba(255,255,255,0.08)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = `${clip.color}14`;
          e.currentTarget.style.borderColor = `${clip.color}80`;
          e.currentTarget.style.boxShadow = `0 0 28px ${clip.color}33, inset 0 1px 0 rgba(255,255,255,0.06)`;
        }}
      >
        Visit {domain}
        <span
          aria-hidden
          className="inline-flex items-center justify-center w-6 h-6 rounded-full text-black text-[13px] font-bold transition-transform group-hover/cta:translate-x-0.5"
          style={{ background: clip.color }}
        >
          →
        </span>
      </a>
    </div>
  );
}

function Roster({
  clips,
  activeIndex,
  onSelect,
}: {
  clips: ShowcaseClip[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span
          className="text-[9px] tracking-[0.4em] text-white/40 uppercase"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Roster · 0{clips.length}
        </span>
        <span
          className="text-[9px] tracking-[0.4em] text-white/30 uppercase"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          <span className="sm:hidden">Swipe to jump</span>
          <span className="hidden sm:inline">Tap to jump</span>
        </span>
      </div>
      <ul
        className="flex gap-2 sm:gap-0 sm:block sm:space-y-1.5 overflow-x-auto sm:overflow-visible -mx-4 sm:mx-0 px-4 sm:px-0 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {clips.map((c, i) => {
          const isActive = i === activeIndex;
          return (
            <li
              key={c.id}
              className="flex-shrink-0 w-[68%] xs:w-[58%] sm:w-auto snap-start"
            >
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={isActive ? "true" : undefined}
                className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all"
                style={{
                  borderColor: isActive
                    ? `${c.color}66`
                    : "rgba(255,255,255,0.08)",
                  background: isActive
                    ? `linear-gradient(90deg, ${c.color}1f 0%, rgba(255,255,255,0.02) 70%)`
                    : "rgba(255,255,255,0.02)",
                  boxShadow: isActive
                    ? `inset 0 0 0 1px ${c.color}33, 0 0 18px ${c.color}22`
                    : "none",
                }}
              >
                <span
                  className="text-[10px] tracking-[0.3em] uppercase w-7 transition-colors"
                  style={{
                    color: isActive ? c.color : "rgba(255,255,255,0.35)",
                    fontFamily: "var(--font-geist-mono), monospace",
                  }}
                >
                  0{i + 1}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold text-white truncate">
                    {c.name}
                  </span>
                  <span
                    className="block text-[9.5px] tracking-[0.28em] uppercase mt-0.5 truncate transition-colors"
                    style={{
                      color: isActive ? c.color : "rgba(255,255,255,0.4)",
                      fontFamily: "var(--font-geist-mono), monospace",
                    }}
                  >
                    {c.category}
                  </span>
                </span>
                <span
                  className="h-1.5 w-1.5 rounded-full transition-all"
                  style={{
                    background: isActive ? c.color : "rgba(255,255,255,0.2)",
                    boxShadow: isActive ? `0 0 10px ${c.color}` : "none",
                  }}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

