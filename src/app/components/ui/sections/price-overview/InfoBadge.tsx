"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  text: string;
}

/**
 * Small ⓘ glyph that opens a tooltip portaled into <body> so it can escape
 * the card's `overflow: hidden` clipping. Positions itself just above the
 * trigger element using window-relative coordinates.
 */
export default function InfoBadge({ text }: Props) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const show = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      top: rect.top + window.scrollY - 10,
      left: rect.left + rect.width / 2 + window.scrollX,
    });
  };
  const hide = () => setPos(null);

  return (
    <>
      <span
        ref={triggerRef}
        role="button"
        tabIndex={0}
        aria-label={text}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        className="inline-flex items-center justify-center h-4 w-4 rounded-full border border-current opacity-50 hover:opacity-100 focus:opacity-100 transition-opacity cursor-help select-none align-middle"
      >
        <svg
          width="9"
          height="9"
          viewBox="0 0 10 10"
          fill="currentColor"
          aria-hidden
        >
          <circle cx="5" cy="2.4" r="0.9" />
          <rect x="4.25" y="4" width="1.5" height="4.2" rx="0.4" />
        </svg>
      </span>

      {mounted &&
        pos &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: "translate(-50%, -100%)",
              fontFamily: "var(--font-geist-sans), sans-serif",
            }}
            className="pointer-events-none z-[9999] w-[260px] p-3 rounded-lg bg-[#0a0e1c]/95 backdrop-blur-md border border-[#4A8EFA]/40 text-[11.5px] text-white/85 normal-case tracking-normal font-normal leading-relaxed shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7),0_0_20px_rgba(42,114,229,0.18)]"
          >
            {text}
            <span
              aria-hidden
              className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 rotate-45 bg-[#0a0e1c] border-r border-b border-[#4A8EFA]/40"
            />
          </div>,
          document.body
        )}
    </>
  );
}
