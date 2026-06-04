"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LINKS } from "@/app/constants/links";
import type { FeedItem } from "./types";

interface MediumPost {
  title: string;
  pubDate: string;
  link: string;
  author: string;
  thumbnail: string | undefined;
  content: string | undefined;
  categories: string[];
}

type Channel = "biweekly" | "medium" | "x";

const MONO = "var(--font-geist-mono), monospace";

const CHANNEL_META: Record<
  Channel,
  { name: React.ReactNode; tag: string; tagColor: string; href: string; meta: string }
> = {
  biweekly: {
    name: (
      <>
        Biweekly
        <br />
        Report
      </>
    ),
    tag: "Report",
    tagColor: "#7AB0FF",
    href: "/about/reports",
    meta: "Engineering progress · every 2 weeks",
  },
  medium: {
    name: "Medium",
    tag: "Article",
    tagColor: "#c084fc",
    href: LINKS.MEDIUM,
    meta: "Essays · research · protocol notes",
  },
  x: {
    name: "X / Feed",
    tag: "Social",
    tagColor: "#7AB0FF",
    href: LINKS.X,
    meta: "Live updates · @tokamak_network",
  },
};

function formatDateShort(iso: string): string {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
      .format(d)
      .toUpperCase();
  } catch {
    return iso;
  }
}

function getReportNumber(report: FeedItem | undefined): string | null {
  if (!report) return null;
  const m = report.title.match(/#(\d+)/);
  return m ? m[1].padStart(2, "0") : null;
}

/** Convert "April 16 — 30, 2026" into a stacked 2-line uppercase title. */
function biweeklyPeriodTitle(
  dateLabel: string | undefined
): React.ReactNode | null {
  if (!dateLabel) return null;
  const m = dateLabel.match(
    /^(\w+)\s+(\d+)\s*[—–-]\s*(\d+),?\s*(\d{4})$/
  );
  if (!m) return dateLabel.toUpperCase();
  const [, month, startDay, endDay, year] = m;
  return (
    <>
      {month.toUpperCase()} {startDay} — {endDay}
      <br />
      {year}
    </>
  );
}

export default function LatestFeedClient({
  reportItems,
}: {
  readonly reportItems: readonly FeedItem[];
}) {
  const [activeChannel, setActiveChannel] = useState<Channel>("biweekly");
  const [blogPosts, setBlogPosts] = useState<MediumPost[]>([]);
  const [mediumLoading, setMediumLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/medium");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setBlogPosts(data);
        }
      } catch {
        /* best-effort */
      } finally {
        setMediumLoading(false);
      }
    })();
  }, []);

  const latestReportNum = getReportNumber(reportItems[0]);
  const biweeklyTitle = biweeklyPeriodTitle(reportItems[0]?.dateLabel);

  return (
    <div className="w-full flex flex-col gap-10 sm:gap-14">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.75fr)] gap-5 lg:gap-6 items-stretch lg:h-[564px]">
        {/* ── Left — article feed for the active channel ── */}
        <div className="order-2 lg:order-1 min-h-[360px] lg:min-h-0 lg:h-full">
          {activeChannel === "biweekly" && (
            <BiweeklyFeed items={reportItems.slice(0, 4)} />
          )}
          {activeChannel === "medium" && (
            <MediumFeed posts={blogPosts.slice(0, 4)} loading={mediumLoading} />
          )}
          {activeChannel === "x" && <XPromoCard />}
        </div>

        {/* ── Right — channel tabs ── */}
        <div className="order-1 lg:order-2 flex flex-col gap-3 sm:gap-4 lg:h-full">
          {(["biweekly", "medium", "x"] as Channel[]).map((c) => (
            <ChannelTab
              key={c}
              channel={c}
              active={activeChannel === c}
              onSelect={() => setActiveChannel(c)}
              latestReportNum={latestReportNum}
              customTitle={c === "biweekly" ? biweeklyTitle : undefined}
            />
          ))}
        </div>
      </div>

      {/* Marquee */}
      <Marquee />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Right column — channel tab cards
   ───────────────────────────────────────────────────────────────────── */
function ChannelTab({
  channel,
  active,
  onSelect,
  latestReportNum,
  customTitle,
}: {
  channel: Channel;
  active: boolean;
  onSelect: () => void;
  latestReportNum: string | null;
  customTitle?: React.ReactNode;
}) {
  const meta = CHANNEL_META[channel];
  const tagColor = meta.tagColor;

  return (
    <div className="relative lg:flex-1 lg:min-h-0">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className="group relative w-full text-left overflow-hidden bg-[#040814] border transition-all min-h-[110px] sm:min-h-[170px] lg:h-full"
        style={{
          borderColor: active ? `${tagColor}88` : "rgba(74,142,250,0.22)",
          boxShadow: active
            ? `0 0 28px ${tagColor}33, inset 0 0 0 1px ${tagColor}22`
            : "none",
        }}
      >
        <ChannelBackground channel={channel} active={active} />

        {/* FUI corners */}
        <span
          className="absolute top-2 left-2 w-3 h-3 border-l border-t pointer-events-none transition-colors z-20"
          style={{ borderColor: active ? tagColor : "rgba(74,142,250,0.55)" }}
        />
        <span
          className="absolute top-2 right-2 w-3 h-3 border-r border-t pointer-events-none transition-colors z-20"
          style={{ borderColor: active ? tagColor : "rgba(74,142,250,0.55)" }}
        />
        <span
          className="absolute bottom-2 left-2 w-3 h-3 border-l border-b pointer-events-none transition-colors z-20"
          style={{ borderColor: active ? tagColor : "rgba(74,142,250,0.55)" }}
        />
        <span
          className="absolute bottom-2 right-2 w-3 h-3 border-r border-b pointer-events-none transition-colors z-20"
          style={{ borderColor: active ? tagColor : "rgba(74,142,250,0.55)" }}
        />

        {/* Content row: visual (left) + text (right) */}
        <div className="relative z-10 flex h-full items-stretch">
          {/* Visual block */}
          <div
            className="relative w-[42%] flex items-center justify-center overflow-hidden border-r"
            style={{
              borderColor: active
                ? `${tagColor}33`
                : "rgba(255,255,255,0.06)",
            }}
          >
            <TabVisual
              channel={channel}
              latestReportNum={latestReportNum}
            />
          </div>

          {/* Text block */}
          <div className="flex-1 relative flex flex-col p-3.5 pr-11">
            {/* Top: type pill (+ active indicator) */}
            <div className="flex items-center justify-between mb-auto">
              <span
                className="px-2 py-0.5 border bg-[#040814]/85 text-[9px] tracking-[0.32em] uppercase backdrop-blur-sm"
                style={{
                  fontFamily: MONO,
                  color: tagColor,
                  borderColor: `${tagColor}66`,
                }}
              >
                {meta.tag}
              </span>
              {active && (
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{
                    background: tagColor,
                    boxShadow: `0 0 8px ${tagColor}`,
                  }}
                />
              )}
            </div>

            {/* Bottom: big channel name + meta */}
            <div className="mt-3">
              <div
                className="text-white uppercase leading-[0.95] tracking-[-0.04em]"
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(18px, 1.7vw, 26px)",
                }}
              >
                {customTitle ?? meta.name}
              </div>
              <div
                className="mt-2 pt-2 border-t border-white/12 text-[9px] tracking-[0.28em] uppercase text-white/55 flex items-center gap-1.5"
                style={{ fontFamily: MONO }}
              >
                <span
                  className="h-1 w-1 rounded-full animate-pulse"
                  style={{
                    background: tagColor,
                    boxShadow: `0 0 6px ${tagColor}`,
                  }}
                />
                Live
              </div>
            </div>
          </div>
        </div>
      </button>

      {/* External link arrow — separate from tab click */}
      <a
        href={meta.href}
        target={meta.href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        aria-label={`Open ${meta.tag}`}
        className="absolute top-3 right-3 z-30 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black transition-transform hover:scale-110"
      >
        <ArrowUpRight size={12} />
      </a>
    </div>
  );
}

function TabVisual({
  channel,
  latestReportNum,
}: {
  channel: Channel;
  latestReportNum: string | null;
}) {
  if (channel === "biweekly") {
    return (
      <>
        <Image
          src="/feed/biweekly-tab.jpeg"
          alt=""
          fill
          sizes="200px"
          className="object-cover"
          style={{ filter: "saturate(0.95) contrast(1.05)" }}
        />
        <div className="absolute inset-0 bg-[#040814]/30 pointer-events-none" />
        {/* Cyan wash on top */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(42,114,229,0.30) 0%, transparent 65%)",
          }}
        />
        {/* Latest report number stamp (top-left corner) */}
        {latestReportNum && (
          <div
            className="absolute top-2 left-2 z-10 text-[#9EC4FF] leading-none tracking-[-0.04em] select-none"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontWeight: 900,
              fontSize: "clamp(18px, 2vw, 28px)",
              textShadow: "0 0 12px rgba(0,0,0,0.7)",
            }}
          >
            #{latestReportNum}
          </div>
        )}
      </>
    );
  }
  if (channel === "medium") {
    return (
      <>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(168,85,247,0.30) 0%, transparent 65%), linear-gradient(180deg, rgba(26,10,46,0.55) 0%, transparent 100%)",
          }}
        />
        <MediumLogo
          className="relative w-[58%] max-w-[88px] h-auto text-white"
          style={{ filter: "drop-shadow(0 0 16px rgba(168,85,247,0.55))" }}
        />
      </>
    );
  }
  // x
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(122,176,255,0.6) 1.1px, transparent 1.4px)",
          backgroundSize: "14px 14px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(42,114,229,0.30) 0%, transparent 65%)",
        }}
      />
      <XLogo
        className="relative w-[48%] max-w-[68px] h-auto text-white"
        style={{ filter: "drop-shadow(0 0 16px rgba(122,176,255,0.6))" }}
      />
    </>
  );
}

function MediumLogo({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

function XLogo({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ChannelBackground({ channel, active }: { channel: Channel; active: boolean }) {
  if (channel === "biweekly") {
    return (
      <>
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(74,142,250,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(74,142,250,0.5) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse 60% 80% at 25% 50%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 80% at 25% 50%, black 30%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none transition-opacity duration-500"
          style={{
            opacity: active ? 1 : 0.55,
            background:
              "radial-gradient(ellipse 55% 90% at 22% 45%, rgba(42,114,229,0.30) 0%, transparent 65%)",
          }}
        />
      </>
    );
  }
  if (channel === "medium") {
    return (
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: active ? 1 : 0.55,
          background:
            "radial-gradient(ellipse 55% 90% at 22% 45%, rgba(168,85,247,0.30) 0%, transparent 65%), linear-gradient(180deg, rgba(26,10,46,0.6) 0%, transparent 100%)",
        }}
      />
    );
  }
  // X
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(122,176,255,0.6) 1.1px, transparent 1.4px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: active ? 1 : 0.55,
          background:
            "radial-gradient(ellipse 55% 90% at 22% 45%, rgba(42,114,229,0.32) 0%, transparent 65%)",
        }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Left column — article feeds
   ───────────────────────────────────────────────────────────────────── */
function ArticleCardShell({
  href,
  external = false,
  typeLabel,
  typeColor,
  date,
  title,
  body,
  metaRight,
  visual,
}: {
  href: string;
  external?: boolean;
  typeLabel: string;
  typeColor: string;
  date: string;
  title: React.ReactNode;
  body?: string;
  metaRight?: string;
  visual: React.ReactNode;
}) {
  const className =
    "group relative block overflow-hidden bg-[#040814] border border-[#4A8EFA]/22 hover:border-[#4A8EFA]/55 transition-colors aspect-[5/4] lg:aspect-auto lg:h-full";
  const inner = (
    <ArticleInner
      typeLabel={typeLabel}
      typeColor={typeColor}
      date={date}
      title={title}
      body={body}
      metaRight={metaRight}
      visual={visual}
    />
  );
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

function ArticleInner({
  typeLabel,
  typeColor,
  date,
  title,
  body,
  metaRight,
  visual,
}: {
  typeLabel: string;
  typeColor: string;
  date: string;
  title: React.ReactNode;
  body?: string;
  metaRight?: string;
  visual: React.ReactNode;
}) {
  return (
    <>
      <div className="absolute inset-0">{visual}</div>
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/82 to-transparent pointer-events-none" />

      {/* corner brackets */}
      <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-[#4A8EFA]/55 pointer-events-none z-10" />
      <span className="absolute top-2 right-2 w-3 h-3 border-r border-t border-[#4A8EFA]/55 pointer-events-none z-10" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-[#4A8EFA]/55 pointer-events-none z-10" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-[#4A8EFA]/55 pointer-events-none z-10" />

      {/* Top row */}
      <div className="absolute top-0 inset-x-0 p-3.5 z-20 flex items-start justify-between">
        <span
          className="text-[9px] tracking-[0.3em] uppercase text-white/55"
          style={{ fontFamily: MONO }}
        >
          {date}
        </span>
        <span
          className="px-1.5 py-0.5 border bg-[#040814]/85 text-[8.5px] tracking-[0.3em] uppercase backdrop-blur-sm"
          style={{
            fontFamily: MONO,
            color: typeColor,
            borderColor: `${typeColor}66`,
          }}
        >
          {typeLabel}
        </span>
      </div>

      {/* Bottom block */}
      <div className="absolute bottom-0 inset-x-0 p-3.5 z-20">
        <h3
          className="text-white tracking-tight leading-[1.12]"
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 700,
            fontSize: "clamp(16px, 1.4vw, 22px)",
          }}
        >
          {title}
        </h3>
        {body && (
          <p
            className="mt-1.5 text-[10.5px] leading-snug text-white/55 line-clamp-2"
            style={{ fontFamily: MONO }}
          >
            {body}
          </p>
        )}
        {metaRight && (
          <div
            className="mt-2 pt-2 border-t border-white/12 text-[9px] tracking-[0.28em] uppercase text-white/45"
            style={{ fontFamily: MONO }}
          >
            {metaRight}
          </div>
        )}

        {/* Arrow */}
        <span className="absolute right-3.5 bottom-3.5 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight size={11} />
        </span>
      </div>
    </>
  );
}

function BiweeklyFeed({ items }: { items: readonly FeedItem[] }) {
  if (items.length === 0) {
    return <EmptyState label="No reports yet" />;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 lg:h-full lg:grid-rows-2">
      {items.map((item) => {
        const num = getReportNumber(item);
        const periodTitle = item.dateLabel?.toUpperCase() ?? formatDateShort(item.date);
        const stats = item.statsSummary;
        return (
          <ArticleCardShell
            key={item.id}
            href={item.href}
            external
            typeLabel="Report"
            typeColor="#7AB0FF"
            date={formatDateShort(item.date)}
            title={periodTitle}
            metaRight={stats}
            visual={
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.12] pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(74,142,250,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(74,142,250,0.5) 1px, transparent 1px)",
                    backgroundSize: "26px 26px",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 60% 60% at 50% 38%, rgba(42,114,229,0.32) 0%, transparent 65%)",
                  }}
                />
                <div
                  className="relative -translate-y-[12%] text-[#9EC4FF] leading-[0.85] tracking-[-0.06em] select-none"
                  style={{
                    fontFamily: "var(--font-geist-sans), sans-serif",
                    fontWeight: 900,
                    fontSize: "clamp(80px, 11vw, 140px)",
                    textShadow: "0 0 30px rgba(42,114,229,0.5)",
                  }}
                >
                  {num ? `#${num}` : "BWR"}
                </div>
              </div>
            }
          />
        );
      })}
    </div>
  );
}

function MediumFeed({
  posts,
  loading,
}: {
  posts: readonly MediumPost[];
  loading: boolean;
}) {
  if (loading && posts.length === 0) {
    return <EmptyState label="Loading articles…" />;
  }
  if (posts.length === 0) {
    return <EmptyState label="No articles available" />;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 lg:h-full lg:grid-rows-2">
      {posts.map((post) => {
        const hasThumb = Boolean(post.thumbnail && post.thumbnail.trim() !== "");
        return (
          <ArticleCardShell
            key={post.link}
            href={post.link}
            external
            typeLabel="Medium"
            typeColor="#c084fc"
            date={formatDateShort(post.pubDate)}
            title={post.title}
            visual={
              hasThumb ? (
                <>
                  <Image
                    src={post.thumbnail!}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(min-width: 768px) 40vw, 100vw"
                    style={{ filter: "saturate(0.9) contrast(1.05)" }}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-[#0a0a14]/30" />
                </>
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(168,85,247,0.32) 0%, transparent 65%), linear-gradient(180deg, #1a0a2e 0%, #040814 100%)",
                  }}
                />
              )
            }
          />
        );
      })}
    </div>
  );
}

function XPromoCard() {
  return (
    <a
      href={LINKS.X}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden bg-[#040814] border border-[#4A8EFA]/25 hover:border-[#4A8EFA]/55 transition-colors h-full min-h-[340px] sm:min-h-[420px] lg:min-h-0"
    >
      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(122,176,255,0.55) 1.2px, transparent 1.5px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* Glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(42,114,229,0.32) 0%, transparent 70%)",
        }}
      />
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/82 to-transparent pointer-events-none" />

      {/* corner brackets */}
      <span className="absolute top-2 left-2 w-4 h-4 border-l border-t border-[#4A8EFA]/65 pointer-events-none z-10" />
      <span className="absolute top-2 right-2 w-4 h-4 border-r border-t border-[#4A8EFA]/65 pointer-events-none z-10" />
      <span className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-[#4A8EFA]/65 pointer-events-none z-10" />
      <span className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-[#4A8EFA]/65 pointer-events-none z-10" />

      {/* Top row */}
      <div className="absolute top-0 inset-x-0 p-5 z-20 flex items-start justify-between">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-black transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
          <ArrowUpRight size={16} />
        </span>
        <span
          className="px-2 py-0.5 border bg-[#040814]/85 text-[9.5px] tracking-[0.32em] uppercase backdrop-blur-sm"
          style={{
            fontFamily: MONO,
            color: "#7AB0FF",
            borderColor: "rgba(122,176,255,0.4)",
          }}
        >
          Social
        </span>
      </div>

      {/* Center 𝕏 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
        <div
          className="text-white leading-none select-none"
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(140px, 22vw, 280px)",
            textShadow: "0 0 50px rgba(122,176,255,0.6)",
          }}
        >
          𝕏
        </div>
        <div
          className="mt-4 text-[12px] tracking-[0.5em] uppercase text-[#7AB0FF]/90"
          style={{ fontFamily: MONO }}
        >
          @tokamak_network
        </div>
      </div>

      {/* Bottom title + CTA */}
      <div className="absolute bottom-0 inset-x-0 p-5 z-20 text-center">
        <div
          className="text-white uppercase leading-[0.95] tracking-[-0.04em]"
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 900,
            fontSize: "clamp(32px, 3vw, 44px)",
          }}
        >
          Follow on X
        </div>
        <p
          className="mt-3 text-[10.5px] tracking-[0.18em] uppercase text-white/55 max-w-md mx-auto"
          style={{ fontFamily: MONO }}
        >
          Live shipping signal · alpha drops · ecosystem updates.
        </p>
      </div>
    </a>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      className="w-full h-full min-h-[420px] flex items-center justify-center border border-dashed border-[#4A8EFA]/20 text-white/40 text-xs tracking-[0.3em] uppercase"
      style={{ fontFamily: MONO }}
    >
      {label}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Marquee
   ───────────────────────────────────────────────────────────────────── */
function Marquee() {
  const chunk = (
    <span
      className="text-[12px] sm:text-[13px] tracking-[0.42em] uppercase text-white/55 inline-flex items-center"
      style={{ fontFamily: MONO }}
    >
      <span className="px-6">Read the latest</span>
      <Diamond />
      <span className="px-6">Follow @tokamak_network</span>
      <Diamond />
      <span className="px-6">Subscribe on Medium</span>
      <Diamond />
      <span className="px-6">News · Research · Development</span>
      <Diamond />
    </span>
  );

  return (
    <div
      className="relative w-full overflow-hidden border-y border-[#4A8EFA]/22 py-3 sm:py-3.5 bg-[#040814]/40"
      aria-hidden
    >
      <div
        className="flex whitespace-nowrap"
        style={{ animation: "sparkline-scroll 38s linear infinite" }}
      >
        {chunk}
        {chunk}
      </div>
    </div>
  );
}

function Diamond() {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rotate-45 mx-1"
      style={{
        background: "#4A8EFA",
        boxShadow: "0 0 6px rgba(74,142,250,0.55)",
      }}
    />
  );
}
