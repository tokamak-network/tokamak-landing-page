"use client";

import type { Floor } from "./floors";

interface Props {
  floors: Floor[];
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export default function FloorIndicator({
  floors,
  activeIndex,
  onNavigate,
}: Props) {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
      {/* Progress line */}
      <div className="relative w-[2px] h-32 bg-white/10 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full origin-top transition-transform duration-700 ease-out"
          style={{
            transform: `scaleY(${(activeIndex + 1) / floors.length})`,
            height: "100%",
            background: `linear-gradient(to bottom, ${floors[activeIndex]?.accent || "#0077FF"}, transparent)`,
          }}
        />
      </div>

      {/* Floor dots */}
      {floors.map((floor, i) => (
        <button
          key={floor.id}
          onClick={() => onNavigate(i)}
          className="group relative flex items-center"
          aria-label={floor.label}
        >
          <div
            className="w-2.5 h-2.5 rounded-full transition-all duration-500"
            style={{
              backgroundColor:
                i === activeIndex ? floor.accent : "rgba(255,255,255,0.2)",
              boxShadow:
                i === activeIndex ? `0 0 12px ${floor.accent}80` : "none",
              transform: i === activeIndex ? "scale(1.4)" : "scale(1)",
            }}
          />

          {/* Label on hover */}
          <span className="absolute left-6 whitespace-nowrap text-xs font-mono tracking-wider text-white/0 group-hover:text-white/70 transition-colors duration-300 uppercase">
            {floor.label}
          </span>
        </button>
      ))}
    </div>
  );
}
