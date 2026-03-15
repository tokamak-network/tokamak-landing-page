"use client";

interface TickerItem {
  label: string;
  value: string;
  prefix?: string;
  suffix?: string;
  change?: string;
}

function TickerItemDisplay({ item }: { item: TickerItem }) {
  return (
    <span className="inline-flex items-center gap-2 px-6 whitespace-nowrap">
      <span className="text-[11px] font-[700] text-[#929298] uppercase tracking-[0.08em]">
        {item.label}
      </span>
      <span className="text-[13px] font-[700] text-white font-orbitron tracking-wider">
        {item.prefix}{item.value}{item.suffix ? ` ${item.suffix}` : ""}
      </span>
      {item.change && (
        <span className={`text-[11px] font-[700] ${
          item.change.startsWith("+") ? "text-[#22c55e]" : "text-[#ef4444]"
        }`}>
          {item.change}
        </span>
      )}
      <span className="text-[#333] mx-2">│</span>
    </span>
  );
}

export default function TickerClient({ items }: { items: TickerItem[] }) {
  return (
    <div className="relative z-20 w-full h-10 bg-[#0a0a0a] border-b border-[#1a1a1d] overflow-hidden flex items-center">
      {/* Live indicator */}
      <div className="absolute left-4 z-10 flex items-center gap-2 bg-[#0a0a0a] pr-4">
        <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-live-pulse" />
        <span className="text-[10px] font-[700] text-[#22c55e] uppercase tracking-[0.12em] font-orbitron">
          LIVE
        </span>
      </div>

      {/* Scrolling ticker */}
      <div className="flex animate-infinite-scroll pl-24">
        {/* Duplicate items for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <TickerItemDisplay key={`${item.label}-${i}`} item={item} />
        ))}
      </div>
      <div className="flex animate-infinite-scroll pl-0" aria-hidden="true">
        {[...items, ...items].map((item, i) => (
          <TickerItemDisplay key={`dup-${item.label}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}
