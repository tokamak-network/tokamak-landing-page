"use client";

import { useState, useEffect, useRef } from "react";
import { type EcosystemCategory } from "@/app/lib/ecosystem-data";

const ROTATE_MS = 4500;
const ANGLE_STEP_DEG = 20; // degrees between adjacent cards on the arc
const RADIUS = 490; // px from pivot (center-bottom) to each card

interface Props {
  categories: EcosystemCategory[];
}

export default function EcosystemFan({ categories }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const total = categories.length;
  const active = categories[activeIndex];

  const goto = (next: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setActiveIndex(((next % total) + total) % total);
      setTransitioning(false);
    }, 180);
  };

  // Auto-rotate (paused on hover)
  useEffect(() => {
    if (hovering) return;
    const t = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setActiveIndex((i) => (i + 1) % total);
        setTransitioning(false);
      }, 180);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [hovering, total]);

  /** Shortest signed offset around the loop (so cards take the shortest arc path). */
  function getOffset(i: number): number {
    let diff = (i - activeIndex + total) % total;
    if (diff > total / 2) diff -= total;
    return diff;
  }

  // Track previous angles so we can detect a card "wrapping" from one side
  // of the arc to the other and snap its position (rather than letting CSS
  // interpolate it across the visible area).
  const cardAngles = categories.map((_, i) => getOffset(i) * ANGLE_STEP_DEG);
  const prevCardAngles = useRef<number[]>([]);
  useEffect(() => {
    prevCardAngles.current = cardAngles;
  });

  return (
    <section
      className="relative w-full bg-black overflow-hidden py-20 sm:py-28 px-6"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {/* Ambient background video — reuses the hero ZK Engine clip,
          heavily darkened + masked so the fan carousel remains primary. */}
      <video
        aria-hidden
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: 0.35,
          filter: "contrast(1.1) brightness(0.55) saturate(0.85)",
          maskImage:
            "radial-gradient(ellipse 75% 90% at 50% 70%, black 30%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 90% at 50% 70%, black 30%, transparent 85%)",
        }}
      >
        <source src="/hero/zk-engine.webm" type="video/webm" />
        <source src="/hero/zk-engine.mp4" type="video/mp4" />
      </video>
      {/* Dark overlay to keep readability */}
      <div className="absolute inset-0 bg-black/55 pointer-events-none" />

      {/* All foreground content sits above the video */}
      <div className="relative z-10">

      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
          <span
            className="text-[10px] sm:text-[11px] tracking-[0.5em] text-[#7AB0FF]/85 uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            The Ecosystem
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.05]">
          {total}{" "}
          <span className="text-white/60">categories</span>{" "}
          <span className="text-white/30">·</span>{" "}
          {categories.reduce((s, c) => s + c.repoCount, 0)}+{" "}
          <span className="text-white/60">projects</span>
        </h2>
      </div>

      {/* Fan stage — pivot at center-bottom, cards on upper arc */}
      <div
        className="relative mx-auto"
        style={{ maxWidth: "1300px", height: "640px" }}
      >
        {/* Soft radial Tokamak-blue glow filling the semi-circle interior */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "85%",
            background:
              "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(42,114,229,0.18) 0%, rgba(42,114,229,0.06) 35%, transparent 70%)",
          }}
        />

        {/* Arc baseline — thin line tracing the bottom of the fan */}
        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[80%] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(122,176,255,0.35) 50%, transparent 100%)",
          }}
        />

        {/* Center content — active category's projects (inside the fan) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10 w-full max-w-md text-center px-4 transition-opacity duration-200"
          style={{
            top: "58%",
            transform: "translate(-50%, -50%)",
            opacity: transitioning ? 0 : 1,
          }}
        >
          <ActiveCategoryDisplay category={active} />
        </div>

        {/* Card arc — anchored at section bottom-center */}
        <div
          className="absolute left-1/2 bottom-0"
          style={{ width: 0, height: 0 }}
        >
          {categories.map((cat, i) => {
            const offset = getOffset(i);
            const angleDeg = cardAngles[i];
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = RADIUS * Math.sin(angleRad);
            const y = -RADIUS * Math.cos(angleRad);
            const isActive = i === activeIndex;
            const visible = Math.abs(angleDeg) <= 95;

            // If this card just teleported from the opposite side of the
            // arc (e.g., +100° → -100°), suppress the position transition so
            // it snaps into place while invisible and only opacity fades.
            const prevAngle = prevCardAngles.current[i];
            const isWrap =
              prevAngle !== undefined &&
              Math.abs(angleDeg - prevAngle) > 90;

            const transition = isWrap
              ? "opacity 400ms ease"
              : "left 750ms cubic-bezier(0.4, 0, 0.2, 1), top 750ms cubic-bezier(0.4, 0, 0.2, 1), transform 750ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms ease";

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => goto(i)}
                className="absolute focus:outline-none"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
                  transformOrigin: "center center",
                  opacity: visible ? 1 : 0,
                  transition,
                  pointerEvents: visible ? "auto" : "none",
                  zIndex: isActive ? 30 : 20 - Math.abs(offset),
                }}
              >
                <CategoryCard category={cat} active={isActive} />
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  active,
}: {
  category: EcosystemCategory;
  active: boolean;
}) {
  return (
    <div
      className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/85 backdrop-blur-sm border whitespace-nowrap"
      style={{
        borderColor: active ? "#4A8EFA" : "rgba(255,255,255,0.18)",
        boxShadow: active
          ? "0 0 28px rgba(42,114,229,0.45), inset 0 0 14px rgba(122,176,255,0.18)"
          : "0 0 10px rgba(0,0,0,0.5)",
        transform: active ? "scale(1.2)" : "scale(1)",
        transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <span
        className="text-[11px] sm:text-[12px] tracking-[0.25em] uppercase font-semibold"
        style={{
          color: active ? "#7AB0FF" : "rgba(255,255,255,0.72)",
          fontFamily: "var(--font-geist-mono), monospace",
          textShadow: active ? "0 0 12px rgba(122,176,255,0.55)" : "none",
        }}
      >
        {category.name}
      </span>
      <span
        className="text-[10px]"
        style={{
          color: active ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
          fontFamily: "var(--font-geist-mono), monospace",
        }}
      >
        {category.repoCount}
      </span>
    </div>
  );
}

function ActiveCategoryDisplay({
  category,
}: {
  category: EcosystemCategory;
}) {
  const topRepos = category.repos.slice(0, 5);
  return (
    <div>
      <div
        className="text-[10px] tracking-[0.4em] text-[#7AB0FF]/80 uppercase mb-2"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        Category
      </div>
      <h3
        className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-2 tracking-tight"
        style={{ textShadow: "0 0 28px rgba(42,114,229,0.45)" }}
      >
        {category.name}
      </h3>
      <div
        className="text-[11px] text-white/45 mb-7 tracking-[0.3em] uppercase"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {category.repoCount} active projects
      </div>

      {topRepos.length > 0 ? (
        <div className="space-y-3">
          {topRepos.map((repo) => (
            <a
              key={repo.name}
              href={repo.githubUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-left group"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-1 w-1 rounded-full"
                  style={{
                    background:
                      repo.activity === "high"
                        ? "#4ade80"
                        : repo.activity === "medium"
                        ? "#facc15"
                        : "rgba(255,255,255,0.4)",
                    boxShadow:
                      repo.activity === "high"
                        ? "0 0 6px #4ade80"
                        : repo.activity === "medium"
                        ? "0 0 6px #facc15"
                        : "none",
                  }}
                />
                <span
                  className="text-sm sm:text-base text-white/95 group-hover:text-[#7AB0FF] transition-colors"
                  style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                >
                  {repo.name}
                </span>
              </div>
              {repo.description && (
                <div className="text-[11px] sm:text-xs text-white/45 mt-0.5 ml-3 line-clamp-1">
                  {repo.description}
                </div>
              )}
            </a>
          ))}
          {category.repos.length > 5 && (
            <div
              className="text-[10px] text-white/40 italic tracking-wider pt-2"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              + {category.repos.length - 5} more
            </div>
          )}
        </div>
      ) : (
        <div
          className="text-[12px] text-white/40 tracking-wider"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {category.repoCount} projects in this category
        </div>
      )}
    </div>
  );
}
