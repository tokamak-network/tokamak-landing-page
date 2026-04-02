"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface RepoData {
  name: string;
  description: string;
  githubUrl: string;
  activity: string;
  linesAdded: number;
  linesDeleted: number;
}

interface CategoryData {
  name: string;
  repoCount: number;
  repos: RepoData[];
}

interface Props {
  categories: CategoryData[];
}

const CATEGORY_COLOR: Record<string, string> = {
  Platform: "#0088ff",
  Infra: "#22c55e",
  "AI / ML": "#f59e0b",
  ZK: "#8b5cf6",
  Lab: "#06b6d4",
  Tool: "#ec4899",
  DeFi: "#d4a24e",
  Social: "#f97316",
  Governance: "#6366f1",
  Analytics: "#14b8a6",
};

const BG_SLUG: Record<string, string> = {
  Platform: "platform",
  Infra: "infra",
  "AI / ML": "ai",
  ZK: "zk",
  Lab: "lab",
  Tool: "tool",
  DeFi: "defi",
  Social: "social",
  Governance: "governance",
  Analytics: "analytics",
};

const CATEGORY_ICON: Record<string, string> = {
  Platform: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="1" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>`,
  Infra: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="3" width="16" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="1" y="11" width="16" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><circle cx="13" cy="5" r="1" fill="currentColor"/><circle cx="13" cy="13" r="1" fill="currentColor"/></svg>`,
  "AI / ML": `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M9 1v3M9 14v3M1 9h3M14 9h3M3.22 3.22l2.12 2.12M12.66 12.66l2.12 2.12M3.22 14.78l2.12-2.12M12.66 5.34l2.12-2.12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  ZK: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="3" y="8" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M6 8V5.5a3 3 0 016 0V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/></svg>`,
  Lab: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 2v6L3 14a1 1 0 00.9 1.5h10.2A1 1 0 0015 14l-4-6V2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 2h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="12" r="1" fill="currentColor"/><circle cx="11" cy="13.5" r="0.75" fill="currentColor"/></svg>`,
  Tool: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M13.5 2a3.5 3.5 0 00-3.4 4.2L3 13.3a1 1 0 000 1.4l.3.3a1 1 0 001.4 0l7.1-7.1A3.5 3.5 0 1013.5 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  DeFi: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M9 5v8M6.5 7h4a1.5 1.5 0 010 3h-3a1.5 1.5 0 000 3H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  Social: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="6.5" cy="6" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M1 15c0-3.31 2.46-6 5.5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="13" cy="7" r="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M10 15c0-2.76 1.34-5 3-5s3 2.24 3 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  Governance: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1l1.9 5.8H17l-4.9 3.6 1.9 5.8L9 12.6l-5 3.6 1.9-5.8L1 6.8h6.1z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  Analytics: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M1 14L6 9l3.5 3.5L14 7l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 17h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

function colorVars(hex: string): React.CSSProperties {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {
    "--cc": hex,
    "--cc-dim": `rgba(${r},${g},${b},0.25)`,
    "--cc-half": `rgba(${r},${g},${b},0.5)`,
    "--cc-glow": `rgba(${r},${g},${b},0.08)`,
    "--cc-shadow": `rgba(${r},${g},${b},0.15)`,
    "--cc-grid": `rgba(${r},${g},${b},0.04)`,
    "--cc-bg": `rgba(${r},${g},${b},0.08)`,
  } as React.CSSProperties;
}

const CSS = `
  @keyframes carouselScroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }
  @keyframes breathe {
    0%, 100% { opacity: 0.75; }
    50% { opacity: 1.0; }
  }
  @keyframes particleFloat {
    0% { transform: translateY(0px) translateX(0px); opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 0.6; }
    100% { transform: translateY(-60px) translateX(var(--px, 8px)); opacity: 0; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes holoShift {
    0% { transform: translateX(-100%) skewX(-15deg); }
    100% { transform: translateX(300%) skewX(-15deg); }
  }
  @keyframes glitchScan {
    0% { top: -4px; opacity: 0; }
    10% { opacity: 0.6; }
    90% { opacity: 0.6; }
    100% { top: calc(100% + 4px); opacity: 0; }
  }
  .eco-track {
    display: flex;
    gap: 24px;
    will-change: transform;
    animation: carouselScroll var(--scroll-dur, 200s) linear infinite;
    animation-play-state: paused;
    cursor: grab;
  }
  .eco-track.is-visible {
    animation-play-state: running;
  }
  .eco-card:hover ~ .eco-card { pointer-events: auto; }
  .eco-track.is-visible.has-card-hover {
    animation-play-state: paused;
  }
  .eco-track.is-dragging {
    animation: none !important;
    cursor: grabbing;
    transition: none;
  }
  .eco-card {
    position: relative;
    width: 220px;
    height: 330px;
    flex-shrink: 0;
    border-radius: 10px;
    overflow: hidden;
    background: #050a14;
    border: 1px solid var(--cc-dim);
    box-shadow: 0 0 20px var(--cc-shadow), inset 0 0 30px var(--cc-glow);
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .eco-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 0 40px var(--cc-half), inset 0 0 40px var(--cc-glow);
  }
  .eco-card-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    animation: breathe 4s ease-in-out infinite;
  }
  .eco-card-fade-top {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 60%;
    background: linear-gradient(to bottom, #050a14 0%, transparent 100%);
    z-index: 1;
  }
  .eco-card-fade-bot {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 65%;
    background: linear-gradient(to top, #050a14 0%, rgba(6,12,26,0.9) 60%, transparent 100%);
    z-index: 1;
  }
  .eco-card-scanlines {
    position: absolute;
    inset: 0;
    background-image: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 2px,
      rgba(0,0,0,0.18) 2px,
      rgba(0,0,0,0.18) 4px
    );
    z-index: 2;
    pointer-events: none;
  }
  .eco-card-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--cc) 50%, transparent 100%);
    z-index: 4;
  }
  .eco-card-corner {
    position: absolute;
    width: 14px; height: 14px;
    z-index: 4;
  }
  .eco-card-corner::before,
  .eco-card-corner::after {
    content: '';
    position: absolute;
    background: var(--cc);
  }
  .eco-card-corner.tl { top: 6px; left: 6px; }
  .eco-card-corner.tl::before { top: 0; left: 0; width: 100%; height: 1.5px; }
  .eco-card-corner.tl::after  { top: 0; left: 0; width: 1.5px; height: 100%; }
  .eco-card-corner.tr { top: 6px; right: 6px; }
  .eco-card-corner.tr::before { top: 0; right: 0; width: 100%; height: 1.5px; }
  .eco-card-corner.tr::after  { top: 0; right: 0; width: 1.5px; height: 100%; }
  .eco-card-corner.bl { bottom: 6px; left: 6px; }
  .eco-card-corner.bl::before { bottom: 0; left: 0; width: 100%; height: 1.5px; }
  .eco-card-corner.bl::after  { bottom: 0; left: 0; width: 1.5px; height: 100%; }
  .eco-card-corner.br { bottom: 6px; right: 6px; }
  .eco-card-corner.br::before { bottom: 0; right: 0; width: 100%; height: 1.5px; }
  .eco-card-corner.br::after  { bottom: 0; right: 0; width: 1.5px; height: 100%; }
  .eco-card-icon {
    position: absolute;
    top: 12px; left: 12px;
    width: 32px; height: 32px;
    border-radius: 6px;
    background: var(--cc-bg);
    border: 1px solid var(--cc-dim);
    display: flex; align-items: center; justify-content: center;
    color: var(--cc);
    z-index: 5;
  }
  .eco-card-activity {
    position: absolute;
    top: 14px; right: 12px;
    display: flex; align-items: center; gap: 5px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    color: var(--cc);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    z-index: 5;
  }
  .eco-card-activity-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--cc);
    animation: pulse 1.5s ease-in-out infinite;
  }
  .eco-card-particles {
    position: absolute;
    inset: 0;
    z-index: 3;
    pointer-events: none;
    overflow: hidden;
  }
  .eco-particle {
    position: absolute;
    width: 2px; height: 2px;
    border-radius: 50%;
    background: var(--cc);
    opacity: 0;
    animation: particleFloat var(--pd, 3s) ease-in var(--delay, 0s) infinite;
  }
  .eco-card-content {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 14px;
    z-index: 6;
  }
  .eco-card-name {
    font-family: 'Orbitron', monospace;
    font-size: 15px;
    font-weight: 700;
    color: #e8f4ff;
    letter-spacing: 0.05em;
    line-height: 1.3;
    margin-bottom: 6px;
    text-shadow: 0 0 10px var(--cc-half);
    word-break: break-all;
  }
  .eco-card-desc {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: rgba(180,200,230,0.7);
    line-height: 1.5;
    margin-bottom: 8px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .eco-card-tag {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 3px;
    background: var(--cc-bg);
    border: 1px solid var(--cc-dim);
    font-family: 'Share Tech Mono', monospace;
    font-size: 9px;
    color: var(--cc);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .eco-card-holo {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 7;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .eco-card:hover .eco-card-holo { opacity: 1; }
  .eco-card-holo::after {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    width: 40%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    animation: holoShift 1.2s ease-in-out infinite;
  }
  .eco-card-glitch {
    position: absolute;
    left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, transparent, var(--cc-half), transparent);
    z-index: 8;
    pointer-events: none;
    opacity: 0;
  }
  .eco-card:hover .eco-card-glitch {
    animation: glitchScan 2s linear infinite;
  }
  .eco-card-datagrid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(var(--cc-grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--cc-grid) 1px, transparent 1px);
    background-size: 20px 20px;
    z-index: 3;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .eco-card:hover .eco-card-datagrid { opacity: 1; }
`;

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  left: `${10 + i * 11}%`,
  bottom: `${15 + (i % 3) * 10}%`,
  delay: `${i * 0.4}s`,
  duration: `${2.5 + (i % 3) * 0.8}s`,
  px: `${(i % 2 === 0 ? 1 : -1) * (4 + i * 2)}px`,
}));

interface CardItem {
  repo: RepoData;
  category: string;
  color: string;
  bgSlug: string;
  icon: string;
}

// Deterministic pseudo-random to avoid hydration mismatch
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function buildCardList(categories: CategoryData[]): CardItem[] {
  // Group cards by category
  const buckets: CardItem[][] = [];
  for (const cat of categories) {
    const color = CATEGORY_COLOR[cat.name] ?? "#00e5ff";
    const bgSlug = BG_SLUG[cat.name] ?? cat.name.toLowerCase();
    const icon = CATEGORY_ICON[cat.name] ?? CATEGORY_ICON["Analytics"];
    const bucket: CardItem[] = [];
    for (const repo of cat.repos) {
      bucket.push({ repo, category: cat.name, color, bgSlug, icon });
    }
    if (bucket.length === 0) {
      bucket.push({
        repo: {
          name: cat.name,
          description: `${cat.repoCount} repositories in the ${cat.name} category`,
          githubUrl: "",
          activity: "active",
          linesAdded: 0,
          linesDeleted: 0,
        },
        category: cat.name,
        color,
        bgSlug,
        icon,
      });
    }
    buckets.push(bucket);
  }

  // Shuffle within each bucket for variety
  for (const b of buckets) {
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(i * 7 + b[0].category.charCodeAt(0)) * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
  }

  // Max-spread interleave: always pick from the category with most remaining items
  // that differs from the last 2 placed categories (ensures max diversity per screen)
  const result: CardItem[] = [];
  const indices = buckets.map(() => 0);
  let remaining = buckets.reduce((s, b) => s + b.length, 0);
  const recentCats: string[] = []; // track last 2

  while (remaining > 0) {
    // Build candidates: buckets with items left, excluding recent categories
    const candidates: { idx: number; rem: number }[] = [];
    for (let i = 0; i < buckets.length; i++) {
      const rem = buckets[i].length - indices[i];
      if (rem > 0 && !recentCats.includes(buckets[i][0].category)) {
        candidates.push({ idx: i, rem });
      }
    }

    // Fallback: if all remaining are in recent categories, relax to exclude only last 1
    if (candidates.length === 0) {
      const lastOne = recentCats[recentCats.length - 1] ?? "";
      for (let i = 0; i < buckets.length; i++) {
        const rem = buckets[i].length - indices[i];
        if (rem > 0 && buckets[i][0].category !== lastOne) {
          candidates.push({ idx: i, rem });
        }
      }
    }

    // Last resort: take anything remaining
    if (candidates.length === 0) {
      for (let i = 0; i < buckets.length; i++) {
        const rem = buckets[i].length - indices[i];
        if (rem > 0) candidates.push({ idx: i, rem });
      }
    }

    if (candidates.length === 0) break;

    // Pick the bucket with the most remaining items (greedy max-spread)
    candidates.sort((a, b) => b.rem - a.rem);
    const pick = candidates[0];
    const item = buckets[pick.idx][indices[pick.idx]];
    result.push(item);
    indices[pick.idx]++;
    remaining--;

    recentCats.push(item.category);
    if (recentCats.length > 2) recentCats.shift();
  }

  return result;
}

function EcoCard({ item, idx, onHover }: { item: CardItem; idx: number; onHover?: (hovering: boolean) => void }) {
  const vars = colorVars(item.color);
  const bgUrl = `/cards/bg-${item.bgSlug}-a.png`;
  const startPos = useRef({ x: 0, y: 0 });

  return (
    <div
      className="eco-card"
      style={vars}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onMouseDown={(e) => { startPos.current = { x: e.clientX, y: e.clientY }; }}
      onClick={(e) => {
        const dx = Math.abs(e.clientX - startPos.current.x);
        const dy = Math.abs(e.clientY - startPos.current.y);
        if (dx > 5 || dy > 5) return; // was a drag, not a click
        if (item.repo.githubUrl) window.open(item.repo.githubUrl, "_blank");
      }}
    >
      {/* Background image */}
      <div
        className="eco-card-bg"
        style={{ backgroundImage: `url(${bgUrl})` }}
      />
      {/* Gradient fades */}
      <div className="eco-card-fade-top" />
      <div className="eco-card-fade-bot" />
      {/* Scan lines */}
      <div className="eco-card-scanlines" />
      {/* Data grid (hover) */}
      <div className="eco-card-datagrid" />
      {/* Accent line */}
      <div className="eco-card-accent" />
      {/* Corners */}
      <div className="eco-card-corner tl" />
      <div className="eco-card-corner tr" />
      <div className="eco-card-corner bl" />
      <div className="eco-card-corner br" />
      {/* Icon badge */}
      <div
        className="eco-card-icon"
        dangerouslySetInnerHTML={{ __html: item.icon }}
      />
      {/* Activity label */}
      <div className="eco-card-activity">
        <div className="eco-card-activity-dot" />
        <span>{item.category}</span>
      </div>
      {/* Particles */}
      <div className="eco-card-particles">
        {PARTICLES.map((p, pi) => (
          <div
            key={pi}
            className="eco-particle"
            style={{
              left: p.left,
              bottom: p.bottom,
              "--delay": p.delay,
              "--pd": p.duration,
              "--px": p.px,
            } as React.CSSProperties}
          />
        ))}
      </div>
      {/* Holo sweep */}
      <div className="eco-card-holo" />
      {/* Glitch scan */}
      <div className="eco-card-glitch" />
      {/* Content */}
      <div className="eco-card-content">
        <div className="eco-card-name">{item.repo.name}</div>
        {item.repo.description && (
          <div className="eco-card-desc">{item.repo.description}</div>
        )}
        <div className="eco-card-tag">{item.category}</div>
      </div>
    </div>
  );
}

export default function CarouselClient({ categories }: Props) {
  const allCards = buildCardList(categories);

  const totalCategories = categories.length;
  const totalRepos = categories.reduce((s, c) => s + c.repoCount, 0);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cardHover, setCardHover] = useState(false);

  const cards = allCards;
  const doubled = [...cards, ...cards];
  const scrollDur = `${Math.max(cards.length * 4, 60)}s`;

  // Drag state
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    currentX: 0,
    velocity: 0,
    lastTime: 0,
    lastX: 0,
    animFrame: 0,
  });

  // IntersectionObserver
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Card width + gap for navigation
  const CARD_STEP = 244; // 220px card + 24px gap
  const offsetRef = useRef(0); // accumulated manual offset in px

  // Step left/right by N cards with smooth transition
  const stepCards = useCallback((dir: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    // Pause CSS animation, capture current animated position
    const style = getComputedStyle(track);
    const matrix = new DOMMatrix(style.transform);
    const currentX = matrix.m41;
    const halfWidth = track.scrollWidth / 2;

    // Calculate target
    const targetX = currentX + dir * CARD_STEP * 3;

    // Stop animation, set current position
    track.classList.add("is-dragging");
    track.style.transform = `translateX(${currentX}px)`;

    // Force reflow then animate to target
    void track.offsetWidth;
    track.style.transition = "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)";
    track.style.transform = `translateX(${targetX}px)`;

    // After transition: compute new animation-delay to resume from this position
    setTimeout(() => {
      const scrollDurMs = Math.max(cards.length * 4, 60) * 1000;
      // targetX maps to a fraction of the full cycle
      let fraction = Math.abs(targetX % halfWidth) / halfWidth;
      if (targetX > 0) fraction = 1 - fraction;
      const newDelay = -(fraction * scrollDurMs);

      track.style.transition = "";
      track.style.transform = "";
      track.style.animationDelay = `${newDelay}ms`;
      track.classList.remove("is-dragging");
    }, 420);
  }, [cards.length]);

  // Drag/swipe handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    const style = getComputedStyle(track);
    const matrix = new DOMMatrix(style.transform);
    const currentTranslateX = matrix.m41;

    track.classList.add("is-dragging");
    track.style.transform = `translateX(${currentTranslateX}px)`;

    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      scrollLeft: currentTranslateX,
      currentX: currentTranslateX,
      velocity: 0,
      lastTime: Date.now(),
      lastX: e.clientX,
      animFrame: 0,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const ds = dragState.current;
    if (!ds.isDragging) return;
    const track = trackRef.current;
    if (!track) return;

    const dx = e.clientX - ds.startX;
    const newX = ds.scrollLeft + dx;
    track.style.transform = `translateX(${newX}px)`;
    ds.currentX = newX;

    const now = Date.now();
    const dt = now - ds.lastTime;
    if (dt > 0) {
      ds.velocity = (e.clientX - ds.lastX) / dt;
      ds.lastTime = now;
      ds.lastX = e.clientX;
    }
  }, []);

  const onPointerUp = useCallback(() => {
    const ds = dragState.current;
    if (!ds.isDragging) return;
    ds.isDragging = false;

    const track = trackRef.current;
    if (!track) return;

    let vel = ds.velocity * 15;
    let pos = ds.currentX;
    const halfWidth = track.scrollWidth / 2;

    const decelerate = () => {
      vel *= 0.95;
      pos += vel;
      if (pos > 0) pos -= halfWidth;
      if (pos < -halfWidth) pos += halfWidth;
      track.style.transform = `translateX(${pos}px)`;

      if (Math.abs(vel) > 0.5) {
        ds.animFrame = requestAnimationFrame(decelerate);
      } else {
        track.classList.remove("is-dragging");
        track.style.transform = "";
      }
    };

    if (Math.abs(vel) > 1) {
      ds.animFrame = requestAnimationFrame(decelerate);
    } else {
      track.classList.remove("is-dragging");
      track.style.transform = "";
    }
  }, []);


  // Cleanup
  useEffect(() => {
    return () => {
      if (dragState.current.animFrame) cancelAnimationFrame(dragState.current.animFrame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        height: "100vh",
        scrollSnapAlign: "start",
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          padding: "100px 48px 4px",
          flexShrink: 0,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontFamily: "'Orbitron', 'Share Tech Mono', monospace",
              fontSize: "clamp(14px, 1.8vw, 24px)",
              fontWeight: 700,
              color: "#00e5ff",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              textShadow:
                "0 0 15px rgba(0,229,255,0.6), 0 0 40px rgba(0,229,255,0.2)",
            }}
          >
            Ecosystem Nexus
          </span>
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "clamp(9px, 0.9vw, 13px)",
              color: "rgba(140,200,255,0.5)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {totalRepos} projects · {totalCategories} categories
          </span>
          <div
            style={{
              width: "clamp(200px, 40vw, 500px)",
              height: 1,
              marginTop: "4px",
              background:
                "linear-gradient(90deg, transparent, rgba(0,229,255,0.6) 20%, #00e5ff 50%, rgba(0,229,255,0.6) 80%, transparent)",
              boxShadow:
                "0 0 8px rgba(0,229,255,0.4), 0 0 20px rgba(0,229,255,0.15)",
            }}
          />
        </div>
      </div>

      {/* Carousel track wrapper */}
      <div
        className="eco-track-wrap"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          position: "relative",
          touchAction: "pan-y",
        }}
      >
        {/* Left arrow button */}
        <button
          onClick={() => stepCards(1)}
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 30,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid rgba(0,229,255,0.25)",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            color: "rgba(0,229,255,0.8)",
            fontFamily: "'Orbitron', monospace",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "rgba(0,229,255,0.6)";
            el.style.background = "rgba(0,229,255,0.15)";
            el.style.boxShadow = "0 0 16px rgba(0,229,255,0.3)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "rgba(0,229,255,0.25)";
            el.style.background = "rgba(0,0,0,0.7)";
            el.style.boxShadow = "none";
          }}
        >
          ‹
        </button>

        {/* Right arrow button */}
        <button
          onClick={() => stepCards(-1)}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 30,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid rgba(0,229,255,0.25)",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            color: "rgba(0,229,255,0.8)",
            fontFamily: "'Orbitron', monospace",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "rgba(0,229,255,0.6)";
            el.style.background = "rgba(0,229,255,0.15)";
            el.style.boxShadow = "0 0 16px rgba(0,229,255,0.3)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "rgba(0,229,255,0.25)";
            el.style.background = "rgba(0,0,0,0.7)";
            el.style.boxShadow = "none";
          }}
        >
          ›
        </button>

        {/* Left fade */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "80px",
            background:
              "linear-gradient(to right, #000000 0%, transparent 100%)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
        {/* Right fade */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "80px",
            background:
              "linear-gradient(to left, #000000 0%, transparent 100%)",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />

        <div
          ref={trackRef}
          className={`eco-track${isVisible ? " is-visible" : ""}${cardHover ? " has-card-hover" : ""}`}
          style={
            {
              "--scroll-dur": scrollDur,
              paddingLeft: "48px",
            } as React.CSSProperties
          }
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {doubled.map((item, idx) => (
            <EcoCard key={idx} item={item} idx={idx} onHover={setCardHover} />
          ))}
        </div>
      </div>
    </section>
  );
}
