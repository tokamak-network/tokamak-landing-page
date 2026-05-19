"use client";

import Image from "next/image";
import { DIORAMA_PRODUCTS, type DioramaProduct } from "./products";

export default function DioramaShowcase() {
  return (
    <section className="relative w-full bg-black overflow-hidden py-20 sm:py-24">
      {/* Section header */}
      <div className="text-center mb-10 sm:mb-14 px-6">
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
          The{" "}
          <span className="text-cyan-300 drop-shadow-[0_0_24px_rgba(0,229,255,0.35)]">
            Tokamak
          </span>{" "}
          Ecosystem
        </h2>
        <p className="mt-5 text-white/55 font-mono text-xs sm:text-sm max-w-md mx-auto">
          Explore the live production network. Hover any node.
        </p>
      </div>

      {/* Diorama with hotspots */}
      <div
        className="relative w-full mx-auto"
        style={{
          maxWidth: "1400px",
          aspectRatio: "1374 / 773",
        }}
      >
        {/* Background diorama image */}
        <Image
          src="/hero/showcase-diorama.jpeg"
          alt="Tokamak ecosystem diorama"
          fill
          priority
          className="object-contain"
        />

        {/* Hotspot overlay layer */}
        <div className="absolute inset-0 z-10">
          {DIORAMA_PRODUCTS.map((product) => (
            <Hotspot key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Browse all link */}
      <div className="text-center mt-10">
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

function Hotspot({ product }: { product: DioramaProduct }) {
  const cardPositionClass =
    product.cardSide === "right"
      ? "left-10 group-hover:left-12"
      : "right-10 group-hover:right-12";

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
      style={{
        left: `${product.x}%`,
        top: `${product.y}%`,
      }}
    >
      {/* Always-visible label tag above marker (with connector line) */}
      <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/80 border backdrop-blur-sm shadow-lg"
          style={{
            borderColor: `${product.color}88`,
            boxShadow: `0 0 18px ${product.color}33`,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{
              background: product.color,
              boxShadow: `0 0 8px ${product.color}`,
            }}
          />
          <span
            className="text-[10px] tracking-[0.28em] font-mono uppercase font-semibold"
            style={{ color: product.color }}
          >
            {product.name}
          </span>
        </div>
        {/* Connector line from label down to the hotspot dot */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full w-px h-3"
          style={{
            background: `linear-gradient(to bottom, ${product.color}cc, transparent)`,
          }}
        />
      </div>

      {/* Pulse marker — always visible, more prominent */}
      <div className="relative">
        <span
          className="block h-4 w-4 rounded-full transition-transform group-hover:scale-110"
          style={{
            background: product.color,
            boxShadow: `0 0 20px ${product.color}, 0 0 40px ${product.color}88`,
          }}
        />
        {/* Inner core dot */}
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white"
        />
        {/* Ripple ring */}
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            background: product.color,
            opacity: 0.55,
            animationDuration: "2.2s",
          }}
        />
        {/* Outer border ring */}
        <span
          className="absolute -inset-2 rounded-full border-2 transition-all duration-300 group-hover:-inset-4 group-hover:border-opacity-100"
          style={{
            borderColor: product.color,
            opacity: 0.6,
          }}
        />
        {/* Crosshair brackets — sci-fi HUD feel */}
        <span
          className="absolute -inset-5 opacity-0 group-hover:opacity-90 transition-opacity"
          style={{ pointerEvents: "none" }}
        >
          <span
            className="absolute top-0 left-0 h-2 w-2 border-l-2 border-t-2"
            style={{ borderColor: product.color }}
          />
          <span
            className="absolute top-0 right-0 h-2 w-2 border-r-2 border-t-2"
            style={{ borderColor: product.color }}
          />
          <span
            className="absolute bottom-0 left-0 h-2 w-2 border-l-2 border-b-2"
            style={{ borderColor: product.color }}
          />
          <span
            className="absolute bottom-0 right-0 h-2 w-2 border-r-2 border-b-2"
            style={{ borderColor: product.color }}
          />
        </span>
      </div>

      {/* Detail card — appears on hover */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 ${cardPositionClass}
          opacity-0 group-hover:opacity-100
          translate-y-[-50%]
          pointer-events-none group-hover:pointer-events-auto
          transition-all duration-300 ease-out
          w-[280px]`}
      >
        <div
          className="rounded-md border bg-black/85 backdrop-blur-md p-4 shadow-2xl"
          style={{
            borderColor: product.color,
            boxShadow: `0 0 40px ${product.color}44`,
          }}
        >
          {/* Top row: category + LIVE */}
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-[9px] tracking-[0.35em] font-mono uppercase"
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
            className="text-xl font-bold text-white mb-1.5 leading-tight"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-white/65 font-mono leading-relaxed mb-3">
            {product.tagline}
          </p>

          {/* Metric */}
          {product.metric && (
            <div className="mb-3 pb-3 border-b border-white/10">
              <div
                className="text-xs font-mono"
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
            className="block text-center py-2 border font-mono text-[10px] tracking-[0.3em] uppercase transition-all"
            style={{
              borderColor: product.color,
              color: product.color,
            }}
          >
            Try it →
          </a>
        </div>
      </div>
    </div>
  );
}
