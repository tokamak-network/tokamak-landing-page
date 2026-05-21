"use client";

import { useEffect, useState } from "react";

export interface SectionDescriptor {
  id: string;
  label: string;
  index: number;
}

interface Props {
  sections: SectionDescriptor[];
  total: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function SectionHud({ sections, total }: Props) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    if (sections.length === 0) return;

    const targets = sections
      .map((s) => ({
        id: s.id,
        el: document.querySelector<HTMLElement>(`[data-section="${s.id}"]`),
      }))
      .filter((x): x is { id: string; el: HTMLElement } => x.el !== null);

    if (targets.length === 0) return;

    // Use the position of an "active line" 35% down the viewport.
    // The current section is the last one whose top edge is at or above that line.
    const update = () => {
      const activeLine = window.scrollY + window.innerHeight * 0.35;
      let current = targets[0].id;
      for (const { id, el } of targets) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= activeLine) current = id;
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [sections]);

  const active = sections.find((s) => s.id === activeId) ?? sections[0];
  if (!active) return null;

  return (
    <div
      aria-hidden
      className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-none"
    >
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#040814]/85 backdrop-blur-md border border-[#4A8EFA]/35 shadow-[0_0_18px_rgba(42,114,229,0.25)]"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_6px_#2A72E5] animate-pulse" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#7AB0FF]/95 tabular-nums">
          {pad(active.index)}/{pad(total)}
        </span>
        <span className="text-[9px] tracking-[0.25em] uppercase text-white/55 border-l border-white/15 pl-2">
          {active.label}
        </span>
      </div>
    </div>
  );
}
