"use client";

import { useState, useEffect } from "react";
import { SHOWCASE_PRODUCTS, type ShowcaseProduct } from "./products";

const AUTO_CYCLE_MS = 3500;

export default function LiveShowcase() {
  const [activeIndex, setActiveIndex] = useState(
    Math.floor(SHOWCASE_PRODUCTS.length / 2)
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const openIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  // Auto-cycle (paused while hovering any card)
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
      <div className="text-center mb-16 sm:mb-24 px-6">
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

      {/* Fan card stage */}
      <div
        className="relative mx-auto"
        style={{
          perspective: "2200px",
          height: "560px",
          maxWidth: "1400px",
        }}
      >
        <div className="absolute inset-0 flex items-end justify-center gap-2 sm:gap-3 px-6 pb-10">
          {SHOWCASE_PRODUCTS.map((p, i) => {
            const isOpen = i === openIndex;
            const offsetFromCenter = i - centerOffset;
            const fanAngle = offsetFromCenter * -10;

            return (
              <FanCard
                key={p.id}
                product={p}
                isOpen={isOpen}
                rotateY={isOpen ? 0 : fanAngle}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </div>
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

function FanCard({
  product,
  isOpen,
  rotateY,
  onMouseEnter,
  onMouseLeave,
}: {
  product: ShowcaseProduct;
  isOpen: boolean;
  rotateY: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="transition-all duration-[700ms] ease-out cursor-pointer relative"
      style={{
        width: isOpen ? "360px" : "100px",
        height: "480px",
        transform: `rotateY(${rotateY}deg) ${isOpen ? "translateZ(80px)" : ""}`,
        transformOrigin: "center center",
        transformStyle: "preserve-3d",
        zIndex: isOpen ? 50 : 10,
        flexShrink: 0,
      }}
    >
      <div
        className="w-full h-full rounded-2xl border overflow-hidden relative"
        style={{
          borderColor: isOpen
            ? product.color
            : "rgba(255, 255, 255, 0.12)",
          background: isOpen
            ? `linear-gradient(180deg, ${product.color}26 0%, #06070d 60%)`
            : `linear-gradient(180deg, ${product.color}18 0%, #04050a 70%)`,
          boxShadow: isOpen
            ? `0 0 60px ${product.color}55, inset 0 0 60px ${product.color}22`
            : `0 0 20px ${product.color}1a`,
          transition: "all 700ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Color stripe along left edge — always visible */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{
            background: product.color,
            boxShadow: `0 0 16px ${product.color}`,
          }}
        />

        {isOpen ? (
          /* OPEN STATE — full content */
          <div className="h-full flex flex-col p-7">
            {/* Top row: category + LIVE */}
            <div className="flex items-center justify-between mb-8">
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
              className="text-3xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              {product.name}
            </h3>

            {/* Tagline */}
            <p className="text-sm text-white/65 font-mono leading-relaxed mb-6 flex-grow">
              {product.tagline}
            </p>

            {/* Metric */}
            {product.metric && (
              <div className="mb-6 pb-6 border-b border-white/10">
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
              className="block text-center py-3 border font-mono text-xs tracking-[0.3em] uppercase transition-all"
              style={{
                borderColor: product.color,
                color: product.color,
                boxShadow: `0 0 20px ${product.color}33`,
              }}
            >
              Try it →
            </a>
          </div>
        ) : (
          /* CLOSED STATE — vertical label */
          <div className="h-full flex flex-col items-center justify-center px-2">
            <div
              className="text-[10px] tracking-[0.4em] font-mono uppercase whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                color: product.color,
                opacity: 0.85,
              }}
            >
              {product.name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
