"use client";

import { useState, useEffect } from "react";
import { SHOWCASE_PRODUCTS, type ShowcaseProduct } from "./products";

const AUTO_CYCLE_MS = 3800;
const REST_ANGLE = 72; // degrees — how much each "resting" card is rotated (book-spine view, facing right)
const SPACING = 110; // px between card centers in the row (matches foreshortened card width)
const CARD_WIDTH = 320;
const CARD_HEIGHT = 460;
const ACTIVE_FORWARD = 100; // px translateZ when active

export default function LiveShowcase() {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(SHOWCASE_PRODUCTS.length / 2)
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const openIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  // Auto-cycle (paused while hovering)
  useEffect(() => {
    if (hoveredIndex !== null) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + direction;
        if (next >= SHOWCASE_PRODUCTS.length - 1) {
          setDirection(-1);
          return SHOWCASE_PRODUCTS.length - 1;
        }
        if (next <= 0) {
          setDirection(1);
          return 0;
        }
        return next;
      });
    }, AUTO_CYCLE_MS);

    return () => clearInterval(interval);
  }, [direction, hoveredIndex]);

  const centerOffset = (SHOWCASE_PRODUCTS.length - 1) / 2;

  return (
    <section className="relative w-full min-h-screen bg-black overflow-hidden py-20 sm:py-28">
      {/* Section header */}
      <div className="text-center mb-12 sm:mb-16 px-6">
        <div className="inline-flex items-center gap-3 mb-5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] tracking-[0.5em] text-cyan-300/85 font-mono uppercase">
            Live Production
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
        </div>
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05]"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          Built on{" "}
          <span className="text-cyan-300 drop-shadow-[0_0_24px_rgba(0,229,255,0.35)]">
            Tokamak
          </span>
        </h2>
        <p className="mt-5 text-white/55 font-mono text-xs sm:text-sm max-w-md mx-auto">
          Real products live in production. Hover any card to focus.
        </p>
      </div>

      {/* Book-spine rotation stage */}
      <div
        className="relative mx-auto"
        style={{
          perspective: "1600px",
          perspectiveOrigin: "center center",
          height: `${CARD_HEIGHT + 80}px`,
          width: "100%",
        }}
      >
        {SHOWCASE_PRODUCTS.map((product, i) => {
          const isOpen = i === openIndex;
          const xPos = (i - centerOffset) * SPACING;
          const distFromActive = Math.abs(i - openIndex);

          return (
            <div
              key={product.id}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="absolute cursor-pointer"
              style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                left: "50%",
                top: "50%",
                marginLeft: -CARD_WIDTH / 2,
                marginTop: -CARD_HEIGHT / 2,
                transform: `translateX(${xPos}px) ${
                  isOpen
                    ? `rotateY(0deg) translateZ(${ACTIVE_FORWARD}px)`
                    : `rotateY(${REST_ANGLE}deg)`
                }`,
                transformOrigin: "center center",
                transformStyle: "preserve-3d",
                transition: "transform 800ms cubic-bezier(0.34, 1.15, 0.64, 1)",
                zIndex: isOpen ? 50 : 20 - distFromActive,
              }}
            >
              <CardContent product={product} isOpen={isOpen} />
            </div>
          );
        })}
      </div>

      {/* Browse all link */}
      <div className="text-center mt-12">
        <a
          href="/ecosystem"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase text-cyan-300/70 hover:text-cyan-300 transition-colors"
        >
          → Explore all projects in the ecosystem
        </a>
      </div>
    </section>
  );
}

function CardContent({
  product,
  isOpen,
}: {
  product: ShowcaseProduct;
  isOpen: boolean;
}) {
  return (
    <div
      className="w-full h-full rounded-2xl border overflow-hidden relative"
      style={{
        borderColor: isOpen ? product.color : "rgba(255, 255, 255, 0.18)",
        background: `linear-gradient(180deg, ${product.color}28 0%, #06070d 65%)`,
        boxShadow: isOpen
          ? `0 0 80px ${product.color}66, inset 0 0 50px ${product.color}22`
          : `0 0 24px ${product.color}1a`,
        transition: "all 700ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Color stripe along left edge — visible as the "spine" when rotated */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[4px]"
        style={{
          background: product.color,
          boxShadow: `0 0 18px ${product.color}, 0 0 32px ${product.color}77`,
        }}
      />

      <div className="h-full flex flex-col p-6">
        {/* Top row: category + LIVE */}
        <div className="flex items-center justify-between mb-7">
          <span
            className="text-[10px] tracking-[0.35em] font-mono uppercase"
            style={{ color: product.color }}
          >
            {product.category}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{
                background: product.color,
                boxShadow: `0 0 8px ${product.color}`,
              }}
            />
            <span className="text-[9px] tracking-[0.3em] font-mono uppercase text-white/65">
              Live
            </span>
          </span>
        </div>

        {/* Title */}
        <h3
          className="text-2xl font-bold text-white mb-3 leading-tight"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          {product.name}
        </h3>

        {/* Tagline */}
        <p className="text-sm text-white/65 font-mono leading-relaxed mb-5 flex-grow">
          {product.tagline}
        </p>

        {/* Metric */}
        {product.metric && (
          <div className="mb-5 pb-5 border-b border-white/10">
            <div className="text-[9px] tracking-[0.3em] font-mono uppercase text-white/40 mb-1">
              Status
            </div>
            <div
              className="text-sm font-mono"
              style={{ color: product.color }}
            >
              {product.metric}
            </div>
          </div>
        )}

        {/* CTA */}
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="block text-center py-3 border font-mono text-xs tracking-[0.3em] uppercase transition-all"
          style={{
            borderColor: product.color,
            color: product.color,
            boxShadow: isOpen ? `0 0 18px ${product.color}33` : "none",
          }}
        >
          Try it →
        </a>
      </div>
    </div>
  );
}
