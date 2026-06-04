"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { LINKS } from "@/app/constants/links";
import SubpageHero from "@/app/components/ui/sections/subpage-hero";

type MediumPost = {
  title: string;
  pubDate: string;
  link: string;
  author: string;
  thumbnail: string | undefined;
  content: string | undefined;
  categories: string[];
};

type Filter = "All" | "News" | "Tokamak Network" | "Research";

const FILTERS: Filter[] = ["All", "News", "Tokamak Network", "Research"];
const INITIAL_COUNT = 13; // 1 featured + 12 grid
const LOAD_MORE = 9;

const CATEGORY_COLOR: Record<string, string> = {
  News: "#7AB0FF",
  "Tokamak Network": "#4A8EFA",
  Research: "#c084fc",
};

const MONO_STYLE = { fontFamily: "var(--font-geist-mono), monospace" } as const;

function matchesFilter(post: MediumPost, filter: Filter): boolean {
  if (filter === "All") return true;
  const target =
    filter === "Tokamak Network" ? "tokamak-network" : filter.toLowerCase();
  return post.categories.some((c) => c.toLowerCase() === target);
}

function displayCategory(post: MediumPost): string {
  const valid = ["news", "tokamak-network", "research"];
  const found = post.categories.find((c) => valid.includes(c.toLowerCase()));
  if (!found) return "Tokamak Network";
  const lower = found.toLowerCase();
  if (lower === "tokamak-network") return "Tokamak Network";
  if (lower === "news") return "News";
  if (lower === "research") return "Research";
  return "Tokamak Network";
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
      .format(new Date(iso))
      .toUpperCase();
  } catch {
    return iso;
  }
}

function getPreview(content: string | undefined, maxLength = 180): string {
  if (!content) return "";
  const text = content
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, "") + "…";
}

function CategoryPill({ label }: { label: string }) {
  const color = CATEGORY_COLOR[label] ?? "#7AB0FF";
  return (
    <span
      className="px-2 py-0.5 border bg-[#040814]/85 text-[9px] tracking-[0.32em] uppercase backdrop-blur-sm"
      style={{ ...MONO_STYLE, color, borderColor: `${color}66` }}
    >
      {label}
    </span>
  );
}

function CornerBrackets() {
  return (
    <>
      <span className="absolute top-2 left-2 w-3 h-3 border-l border-t border-[#4A8EFA]/55 pointer-events-none z-10" />
      <span className="absolute top-2 right-2 w-3 h-3 border-r border-t border-[#4A8EFA]/55 pointer-events-none z-10" />
      <span className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-[#4A8EFA]/55 pointer-events-none z-10" />
      <span className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-[#4A8EFA]/55 pointer-events-none z-10" />
    </>
  );
}

function Thumbnail({ post, ratio }: { post: MediumPost; ratio: string }) {
  const hasThumb = Boolean(post.thumbnail && post.thumbnail.trim() !== "");
  const category = displayCategory(post);
  const color = CATEGORY_COLOR[category] ?? "#7AB0FF";

  if (hasThumb) {
    return (
      <div className={`relative ${ratio} overflow-hidden`}>
        <Image
          src={post.thumbnail!}
          alt={post.title}
          fill
          unoptimized
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          style={{ filter: "saturate(0.9) contrast(1.05)" }}
        />
        <div className="absolute inset-0 bg-[#0a0a14]/30" />
      </div>
    );
  }

  return (
    <div
      className={`relative ${ratio} overflow-hidden`}
      style={{
        background: `radial-gradient(ellipse 70% 55% at 50% 40%, ${color}33 0%, transparent 65%), linear-gradient(180deg, ${color}1a 0%, #040814 100%)`,
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-[12px] tracking-[0.45em] uppercase opacity-50"
          style={{ ...MONO_STYLE, color }}
        >
          {category}
        </span>
      </div>
    </div>
  );
}

function FeaturedCard({ post }: { post: MediumPost }) {
  const category = displayCategory(post);
  const preview = getPreview(post.content);
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] overflow-hidden bg-[#040814] border border-[#4A8EFA]/22 hover:border-[#4A8EFA]/55 transition-colors mb-12 lg:mb-16"
    >
      <Thumbnail post={post} ratio="aspect-[4/3] lg:aspect-auto lg:h-full" />
      <div className="relative p-6 lg:p-10 flex flex-col justify-between min-h-[280px]">
        <CornerBrackets />
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <CategoryPill label={category} />
          <span
            className="text-[9px] tracking-[0.3em] uppercase text-white/55"
            style={MONO_STYLE}
          >
            {formatDate(post.pubDate)}
          </span>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h2
            className="text-white tracking-tight leading-[1.12] mb-4"
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontWeight: 700,
              fontSize: "clamp(22px, 2.4vw, 36px)",
            }}
          >
            {post.title}
          </h2>
          {preview && (
            <p
              className="text-white/55 text-[12px] lg:text-[13px] leading-relaxed line-clamp-3 max-w-prose"
              style={MONO_STYLE}
            >
              {preview}
            </p>
          )}
        </div>
        <div className="mt-8 flex items-center justify-between">
          <span
            className="text-[11px] tracking-[0.3em] uppercase text-[#7AB0FF] group-hover:text-[#A6C8FF] transition-colors"
            style={MONO_STYLE}
          >
            Read on Medium
          </span>
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </a>
  );
}

function GridCard({ post }: { post: MediumPost }) {
  const category = displayCategory(post);
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col overflow-hidden bg-[#040814] border border-[#4A8EFA]/22 hover:border-[#4A8EFA]/55 transition-colors"
    >
      <Thumbnail post={post} ratio="aspect-[4/3]" />
      <div className="relative p-4 lg:p-5 flex-1 flex flex-col">
        <CornerBrackets />
        <div className="flex items-center justify-between mb-3 gap-2">
          <CategoryPill label={category} />
          <span
            className="text-[9px] tracking-[0.3em] uppercase text-white/45"
            style={MONO_STYLE}
          >
            {formatDate(post.pubDate)}
          </span>
        </div>
        <h3
          className="text-white tracking-tight leading-[1.18] line-clamp-3 pr-8"
          style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontWeight: 700,
            fontSize: "clamp(15px, 1.1vw, 17px)",
          }}
        >
          {post.title}
        </h3>
        <span className="absolute right-3 bottom-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight size={11} />
        </span>
      </div>
    </a>
  );
}

function FilterTab({
  filter,
  active,
  onClick,
}: {
  filter: Filter;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-2 border text-[10px] sm:text-[11px] tracking-[0.32em] uppercase transition-all ${
        active
          ? "border-[#4A8EFA] text-white bg-[#2A72E5]/15 shadow-[0_0_20px_rgba(42,114,229,0.25)]"
          : "border-white/15 text-white/55 hover:border-white/35 hover:text-white/85"
      }`}
      style={MONO_STYLE}
    >
      {filter}
    </button>
  );
}

function LoadingState() {
  return (
    <div
      className="w-full h-[420px] flex items-center justify-center border border-dashed border-[#4A8EFA]/20 text-white/40 text-xs tracking-[0.3em] uppercase"
      style={MONO_STYLE}
    >
      Loading insights…
    </div>
  );
}

function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div
      className="w-full h-[420px] flex items-center justify-center border border-dashed border-[#4A8EFA]/20 text-white/40 text-xs tracking-[0.3em] uppercase"
      style={MONO_STYLE}
    >
      No posts in {filter}
    </div>
  );
}

export default function InsightArchive() {
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/medium");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setPosts(data);
        }
      } catch {
        /* best-effort */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [activeFilter]);

  const filtered = useMemo(
    () => posts.filter((p) => matchesFilter(p, activeFilter)),
    [posts, activeFilter]
  );
  const visible = filtered.slice(0, visibleCount);
  const featured = visible[0];
  const rest = visible.slice(1);
  const hasMore = filtered.length > visible.length;

  return (
    <div
      className="bg-[#02040a] text-white"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      <SubpageHero
        eyebrow="INSIGHTS · ARCHIVE"
        titleStart="Tokamak"
        titleAccent="Insights."
        subhead="Follow the latest articles, research notes, and updates from Tokamak Network."
        videoMp4="/videos/particles-drift.mp4"
      />

      <section className="relative max-w-[1280px] mx-auto px-6 sm:px-12 lg:px-16 pt-12 lg:pt-16 pb-24 lg:pb-32">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-10 lg:mb-12">
          {FILTERS.map((f) => (
            <FilterTab
              key={f}
              filter={f}
              active={activeFilter === f}
              onClick={() => setActiveFilter(f)}
            />
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <>
            {featured && <FeaturedCard post={featured} />}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {rest.map((p) => (
                  <GridCard key={p.link} post={p} />
                ))}
              </div>
            )}

            {/* Load more / Medium CTA */}
            <div className="mt-12 lg:mt-16 flex justify-center">
              {hasMore ? (
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + LOAD_MORE)}
                  className="px-7 py-3 border border-[#4A8EFA]/70 text-[#7AB0FF] text-[11px] tracking-[0.25em] uppercase hover:bg-[#2A72E5]/15 hover:border-[#4A8EFA] transition-all shadow-[0_0_24px_rgba(42,114,229,0.18)] hover:shadow-[0_0_40px_rgba(42,114,229,0.35)]"
                  style={MONO_STYLE}
                >
                  Load more
                </button>
              ) : (
                <a
                  href={LINKS.MEDIUM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-7 py-3 border border-[#4A8EFA]/70 text-[#7AB0FF] text-[11px] tracking-[0.25em] uppercase hover:bg-[#2A72E5]/15 hover:border-[#4A8EFA] transition-all shadow-[0_0_24px_rgba(42,114,229,0.18)] hover:shadow-[0_0_40px_rgba(42,114,229,0.35)]"
                  style={MONO_STYLE}
                >
                  View all on Medium
                  <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
