import type { ReactNode } from "react";
import LazyVideo from "@/app/components/shared/LazyVideo";

const MONO_STYLE = { fontFamily: "var(--font-geist-mono), monospace" } as const;

interface Props {
  /** Small uppercase mono label rendered next to the pulsing dot. */
  eyebrow: string;
  /** First part of the headline, rendered on its own line. */
  titleStart: string;
  /** Italic accented word/phrase, rendered on the second line. */
  titleAccent: string;
  /** Optional trailing punctuation rendered inline after the accent. */
  titleEnd?: string;
  /** Optional ambient video (mp4), anchored bottom-right with soft masks (mirrors PriceHero). */
  videoMp4?: string;
  /** Poster shown before the ambient video loads. Defaults to the mp4's sibling `-poster.jpg`. */
  videoPoster?: string;
  /** One-line subhead paragraph below the H1. */
  subhead?: string;
  /** Slot for extra elements (CTAs, metadata strips, stat rows, etc.). */
  children?: ReactNode;
}

/**
 * Shared subpage hero that mirrors the visual pattern used by the main page
 * (ZkHero) and the price subpage (PriceHero). Tall section, ambient blue
 * radial glow, optional bottom-right ambient video, left-anchored content
 * with dot-pulse eyebrow + bold italic-accented headline.
 */
export default function SubpageHero({
  eyebrow,
  titleStart,
  titleAccent,
  titleEnd = "",
  videoMp4,
  videoPoster,
  subhead,
  children,
}: Props) {
  const hasVideo = Boolean(videoMp4);
  const poster = videoPoster ?? videoMp4?.replace(/\.mp4$/, "-poster.jpg");

  return (
    <section className="relative w-full lg:min-h-[88vh] bg-[#02040a] overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 70% 75%, rgba(42,114,229,0.22) 0%, rgba(42,114,229,0.10) 30%, rgba(26,79,181,0.04) 60%, transparent 85%)",
        }}
      />

      {/* Optional hero video — anchored bottom-right, layered masks */}
      {hasVideo && (
        <div
          aria-hidden
          className="pointer-events-none absolute z-[1] bottom-0 right-0 w-full lg:w-[70%] xl:w-[68%] h-[42vh] sm:h-[55vh] lg:h-[72vh] lg:max-h-[720px]"
        >
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              maskImage:
                "radial-gradient(ellipse 95% 110% at 78% 55%, black 18%, rgba(0,0,0,0.5) 55%, transparent 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 8%, black 18%, black 72%, rgba(0,0,0,0.3) 92%, transparent 100%), linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 14%, black 36%, black 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 95% 110% at 78% 55%, black 18%, rgba(0,0,0,0.5) 55%, transparent 100%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 8%, black 18%, black 72%, rgba(0,0,0,0.3) 92%, transparent 100%), linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 14%, black 36%, black 100%)",
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
          >
            <LazyVideo
              src={videoMp4 as string}
              poster={poster}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "saturate(1.05) brightness(0.95)" }}
            />
            {/* Section-color wash on the left edge — fades the video into the
                page background where text sits. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/2 lg:w-2/5"
              style={{
                background:
                  "linear-gradient(to right, #02040a 0%, rgba(2,4,10,0.85) 25%, rgba(2,4,10,0.45) 55%, transparent 100%)",
              }}
            />
          </div>
        </div>
      )}

      {/* Bottom blend — softens the transition into the next section so the
          hero doesn't feel like a hard-edged tile cut off from body content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-40 lg:h-56 z-[2]"
        style={{
          background:
            "linear-gradient(to top, #02040a 0%, rgba(2,4,10,0.6) 40%, rgba(2,4,10,0.15) 75%, transparent 100%)",
        }}
      />

      {/* Content — left-anchored within a 1280px guide */}
      <div
        className={`relative z-10 max-w-[1280px] mx-auto px-6 sm:px-12 lg:px-16 pt-28 sm:pt-36 lg:pt-44 ${
          hasVideo
            ? "pb-[44vh] sm:pb-[42vh] lg:pb-32"
            : "pb-20 sm:pb-24 lg:pb-32"
        } lg:max-w-[55%] xl:max-w-[58%] lg:mx-0 lg:ml-[max(24px,calc((100vw-1280px)/2))]`}
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5 sm:mb-7">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
          <span
            className="text-[10px] sm:text-[11px] tracking-[0.5em] text-[#7AB0FF]/90 uppercase"
            style={MONO_STYLE}
          >
            {eyebrow}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-white leading-[0.95] mb-5"
          style={{
            fontWeight: 800,
            letterSpacing: "-0.045em",
            fontSize: "clamp(48px, 7vw, 96px)",
          }}
        >
          {titleStart}
          <br />
          <em
            className="not-italic"
            style={{
              fontStyle: "italic",
              fontWeight: 500,
              color: "#7AB0FF",
              textShadow: "0 0 28px rgba(42,114,229,0.55)",
            }}
          >
            {titleAccent}
          </em>
          {titleEnd}
        </h1>

        {subhead && (
          <p className="mt-2 text-base sm:text-lg text-white/55 max-w-[48ch] leading-relaxed">
            {subhead}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}
