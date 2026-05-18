"use client";

export default function HUDOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Edge fade gradients — make coins disappear at edges */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black via-black/70 to-transparent" />

      {/* Top center header */}
      <div className="absolute left-1/2 top-10 -translate-x-1/2 text-center">
        <div className="text-[10px] tracking-[0.5em] text-cyan-300/80 font-mono uppercase">
          Zero-Knowledge Layer
        </div>
        <div className="mt-2 text-xs text-white/45 font-mono">
          Every public transfer becomes a private proof.
        </div>
      </div>

      {/* Left side label: PUBLIC */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 max-w-[170px]">
        <div className="text-[10px] tracking-[0.45em] text-amber-300/85 font-mono uppercase border-l border-amber-300/40 pl-3">
          Public Ledger
        </div>
        <div className="mt-2 pl-3 text-[11px] text-white/45 font-mono leading-relaxed">
          Sender, receiver, amount —
          <br />
          visible to everyone.
        </div>
      </div>

      {/* Right side label: PRIVATE */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 max-w-[170px] text-right">
        <div className="text-[10px] tracking-[0.45em] text-cyan-300/90 font-mono uppercase border-r border-cyan-300/40 pr-3">
          Zero-Knowledge Proof
        </div>
        <div className="mt-2 pr-3 text-[11px] text-white/45 font-mono leading-relaxed">
          Validity is verified.
          <br />
          Identity stays sealed.
        </div>
      </div>

      {/* Bottom center: transformation marker */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        <div className="text-[9px] tracking-[0.5em] text-cyan-400/55 font-mono uppercase">
          ↑ transformation ↑
        </div>
      </div>
    </div>
  );
}
