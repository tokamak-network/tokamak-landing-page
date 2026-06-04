"use client";

interface TickerItem {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  change?: string;
}

function TickerItemDisplay({ item, idx }: { item: TickerItem; idx: number }) {
  const isUp = item.change?.startsWith("+");
  const isDown = item.change?.startsWith("-");

  return (
    <span className="inline-flex items-center gap-3 px-7 whitespace-nowrap">
      {/* Small pulsing cyan node */}
      <span
        className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse"
        style={{
          boxShadow: "0 0 6px #00e5ff, 0 0 12px rgba(0,229,255,0.5)",
          animationDelay: `${(idx % 7) * 0.18}s`,
        }}
      />

      {/* Label */}
      <span className="text-[10px] tracking-[0.4em] font-mono text-cyan-300/75 uppercase">
        {item.label}
      </span>

      {/* Value */}
      <span
        className="text-[14px] font-mono font-medium text-white tracking-wide"
        style={{ textShadow: "0 0 8px rgba(255,255,255,0.18)" }}
      >
        {item.prefix}
        {item.value}
        {item.suffix ? ` ${item.suffix}` : ""}
      </span>

      {/* Change indicator */}
      {item.change && (
        <span
          className={`text-[11px] font-mono font-semibold tracking-wide inline-flex items-center gap-0.5 ${
            isUp ? "text-emerald-400" : isDown ? "text-rose-400" : "text-white/60"
          }`}
          style={{
            textShadow: isUp
              ? "0 0 8px rgba(52,211,153,0.55)"
              : isDown
              ? "0 0 8px rgba(251,113,133,0.55)"
              : "none",
          }}
        >
          {isUp ? "▲" : isDown ? "▼" : ""}
          {item.change.replace(/^[+-]/, "")}
        </span>
      )}

      {/* Vertical hairline separator */}
      <span className="ml-4 w-px h-4 bg-cyan-400/15" />
    </span>
  );
}

export default function TickerClient({ items }: { items: TickerItem[] }) {
  return (
    <div className="relative z-20 w-full bg-black overflow-hidden">
      {/* Top hairline — fades from transparent → cyan → transparent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/45 to-transparent" />
      {/* Bottom hairline */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/45 to-transparent" />

      {/* Subtle radial cyan glow behind the strip */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 200% at 50% 50%, rgba(0,229,255,0.07) 0%, transparent 65%)",
        }}
      />

      {/* Ticker scrolling content */}
      <div className="relative h-14 flex items-center">
        <div className="flex animate-infinite-scroll">
          {[...items, ...items].map((item, i) => (
            <TickerItemDisplay
              key={`${item.label}-${i}`}
              item={item}
              idx={i}
            />
          ))}
        </div>
        <div className="flex animate-infinite-scroll" aria-hidden="true">
          {[...items, ...items].map((item, i) => (
            <TickerItemDisplay
              key={`dup-${item.label}-${i}`}
              item={item}
              idx={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
