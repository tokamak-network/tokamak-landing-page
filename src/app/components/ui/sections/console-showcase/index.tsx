"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { CONSOLE_PRODUCTS, type ConsoleProduct } from "./products";

export default function ConsoleShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const product = CONSOLE_PRODUCTS[activeIndex];
  const total = CONSOLE_PRODUCTS.length;

  const swapWithTransition = useCallback((nextIndex: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setActiveIndex(((nextIndex % total) + total) % total);
      setTransitioning(false);
    }, 180);
  }, [total]);

  const prev = useCallback(() => swapWithTransition(activeIndex - 1), [activeIndex, swapWithTransition]);
  const next = useCallback(() => swapWithTransition(activeIndex + 1), [activeIndex, swapWithTransition]);
  const launch = useCallback(() => {
    window.open(product.url, "_blank", "noopener,noreferrer");
  }, [product.url]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Enter" || e.key === " ") launch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, launch]);

  return (
    <section className="relative w-full min-h-screen bg-black flex flex-col items-center justify-center py-12 px-4">
      {/* Section eyebrow */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] tracking-[0.5em] text-cyan-300/85 font-mono uppercase">
            Pick a Product
          </span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse" />
        </div>
        <h2
          className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.05]"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          The{" "}
          <span className="text-cyan-300 drop-shadow-[0_0_24px_rgba(0,229,255,0.35)]">
            Tokamak
          </span>{" "}
          Console
        </h2>
      </div>

      {/* Console image with overlays */}
      <div
        className="relative w-full"
        style={{
          maxWidth: "1100px",
          aspectRatio: "1374 / 773",
        }}
      >
        {/* Console base image */}
        <Image
          src="/hero/console.jpeg"
          alt="Tokamak product console"
          fill
          priority
          className="object-contain select-none pointer-events-none"
        />

        {/* DISPLAY content overlay — sits over the screen area in the image */}
        <DisplayOverlay product={product} transitioning={transitioning} index={activeIndex} total={total} />

        {/* BUTTONS (transparent clickzones over the painted buttons) */}
        {/* Blue button — PREV */}
        <ConsoleButton
          x={42.5} y={70.5}
          size={4.8}
          color="#3b82f6"
          label="PREV"
          onClick={prev}
        />
        {/* Yellow button — Random shuffle */}
        <ConsoleButton
          x={50.0} y={70.5}
          size={4.8}
          color="#eab308"
          label="SHUFFLE"
          onClick={() => swapWithTransition(Math.floor(Math.random() * total))}
        />
        {/* Red button — NEXT */}
        <ConsoleButton
          x={57.5} y={70.5}
          size={4.8}
          color="#ef4444"
          label="NEXT"
          onClick={next}
        />
        {/* Big yellow smile button — LAUNCH */}
        <ConsoleButton
          x={79.7} y={70.0}
          size={9.0}
          color="#facc15"
          label="LAUNCH"
          onClick={launch}
        />

        {/* Keyboard hint */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 text-[10px] tracking-[0.3em] font-mono text-white/40 uppercase whitespace-nowrap">
          ← → Navigate · Enter Launch
        </div>
      </div>
    </section>
  );
}

function DisplayOverlay({
  product,
  transitioning,
  index,
  total,
}: {
  product: ConsoleProduct;
  transitioning: boolean;
  index: number;
  total: number;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        // Measured from the console image — covers the screen area
        left: "28%",
        top: "18.5%",
        width: "39.3%",
        height: "32%",
      }}
    >
      <div
        className="relative w-full h-full overflow-hidden rounded-md"
        style={{
          // Dark CRT screen behind the content (sits over the pixel art screen in image)
          background: "rgba(8, 12, 20, 0.88)",
          backdropFilter: "blur(2px)",
        }}
      >
        {/* CRT scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 229, 255, 0.25) 3px, transparent 4px)",
          }}
        />

        {/* Content — fades during transition */}
        <div
          className="relative h-full flex flex-col justify-between p-3 sm:p-4 transition-opacity duration-200"
          style={{ opacity: transitioning ? 0 : 1 }}
        >
          {/* Top row: category + pagination */}
          <div className="flex items-center justify-between">
            <span
              className="text-[8px] sm:text-[10px] tracking-[0.3em] font-mono"
              style={{ color: product.color, textShadow: `0 0 6px ${product.color}` }}
            >
              {product.category}
            </span>
            <span className="text-[8px] sm:text-[10px] tracking-[0.2em] font-mono text-cyan-300/80">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Center: name + tagline */}
          <div className="flex-grow flex flex-col justify-center text-center">
            <h3
              className="text-lg sm:text-2xl lg:text-3xl font-bold text-white leading-tight"
              style={{
                fontFamily: "Orbitron, sans-serif",
                textShadow: `0 0 12px ${product.color}80, 0 0 24px ${product.color}40`,
              }}
            >
              {product.name}
            </h3>
            <p className="mt-1 sm:mt-2 text-[9px] sm:text-xs text-white/75 font-mono">
              {product.tagline}
            </p>
          </div>

          {/* Bottom: metric + LIVE */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span
                className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full animate-pulse"
                style={{ background: product.color, boxShadow: `0 0 6px ${product.color}` }}
              />
              <span className="text-[7px] sm:text-[9px] tracking-[0.2em] font-mono text-white/60">
                LIVE
              </span>
            </span>
            <span
              className="text-[8px] sm:text-[10px] font-mono tracking-[0.2em]"
              style={{ color: product.color }}
            >
              {product.metric}
            </span>
          </div>
        </div>

        {/* CRT flicker overlay during transition */}
        {transitioning && (
          <div className="absolute inset-0 bg-cyan-300/30 mix-blend-screen animate-pulse" />
        )}
      </div>
    </div>
  );
}

function ConsoleButton({
  x,
  y,
  size,
  color,
  label,
  onClick,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full
                 transition-all duration-100 ease-out
                 hover:scale-105 active:scale-90
                 focus:outline-none cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}%`,
        aspectRatio: "1 / 1",
      }}
    >
      {/* Hover halo */}
      <span
        className="absolute inset-[-15%] rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${color}55 0%, transparent 70%)`,
        }}
      />
      {/* Active (pressed) inner glow */}
      <span
        className="absolute inset-0 rounded-full opacity-0 group-active:opacity-100 transition-opacity pointer-events-none"
        style={{
          boxShadow: `inset 0 0 20px ${color}, 0 0 30px ${color}`,
        }}
      />
      {/* Always-on tooltip label below button */}
      <span
        className="absolute left-1/2 -translate-x-1/2 top-full mt-2
                   px-2 py-0.5 rounded border bg-black/85 backdrop-blur-sm
                   text-[8px] tracking-[0.3em] font-mono uppercase whitespace-nowrap
                   opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ borderColor: color, color: color }}
      >
        {label}
      </span>
    </button>
  );
}
