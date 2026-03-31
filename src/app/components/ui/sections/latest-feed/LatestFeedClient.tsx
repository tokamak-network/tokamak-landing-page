"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FeedCard } from "./FeedCard";
import { FileText, Newspaper, ArrowUpRight } from "lucide-react";
import DefaultThumbnail from "@/assets/images/insight/default-thumnail.svg";
import type { FeedItem } from "./types";
import type { MediumPost } from "../insight/types";

const MAX_ITEMS = 4;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}

function blogPostToFeedItem(post: MediumPost): FeedItem {
  const plainText = post.content ? stripHtml(post.content) : "";
  const excerpt = plainText.length > 120
    ? plainText.slice(0, 120).trim() + "..."
    : plainText || undefined;

  return {
    id: `blog-${post.link}`,
    title: post.title,
    date: post.pubDate,
    type: "blog",
    href: post.link,
    thumbnail: post.thumbnail,
    excerpt,
  };
}

function formatDateShort(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

function MobileCard({ item }: { readonly item: FeedItem }) {
  const [imgError, setImgError] = useState(false);
  const isReport = item.type === "report";
  const color = isReport ? "#00e5ff" : "#a855f7";
  const imageSrc =
    imgError || !item.thumbnail || item.thumbnail.trim() === ""
      ? DefaultThumbnail
      : item.thumbnail;

  const isExternal = item.type === "blog";
  const Wrapper = isExternal ? "a" : Link;
  const linkProps = isExternal
    ? { href: item.href, target: "_blank" as const, rel: "noopener noreferrer" }
    : { href: item.href };

  return (
    <Wrapper
      {...linkProps}
      className="flex gap-3 p-3 w-full"
      style={{
        border: "1px solid rgba(0,229,255,0.12)",
        borderRadius: "2px",
        background: "rgba(0,229,255,0.02)",
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ width: 72, height: 72, borderRadius: "2px" }}
      >
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
          sizes="72px"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color,
              backgroundColor: color + "15",
              border: `1px solid ${color}30`,
              borderRadius: "2px",
            }}
          >
            {isReport ? <FileText size={9} /> : <Newspaper size={9} />}
            {isReport ? "Report" : "Blog"}
          </span>
          <span
            className="text-[9px] uppercase tracking-wider"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: "rgba(140,200,255,0.4)",
            }}
          >
            {formatDateShort(item.date)}
          </span>
        </div>
        <h3
          className="text-[13px] font-bold text-white leading-tight line-clamp-2"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          {item.title}
        </h3>
      </div>

      {/* Arrow */}
      <div className="flex items-center flex-shrink-0">
        <ArrowUpRight size={14} style={{ color: "rgba(0,229,255,0.4)" }} />
      </div>
    </Wrapper>
  );
}

export default function LatestFeedClient({
  reportItems,
}: {
  readonly reportItems: readonly FeedItem[];
}) {
  const [blogPosts, setBlogPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/medium");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch {
        // Silently fail — reports will still show
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const feedItems = useMemo(() => {
    const blogItems = blogPosts.map(blogPostToFeedItem);
    const merged = [...blogItems, ...reportItems];
    const sorted = [...merged].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted.slice(0, MAX_ITEMS);
  }, [blogPosts, reportItems]);

  if (loading && reportItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* ── Desktop: 4-col grid ── */}
      <div
        className="hidden md:grid gap-[30px] w-full
          [@media(min-width:1280px)]:grid-cols-4
          [@media(min-width:800px)_and_(max-width:1279px)]:grid-cols-2"
      >
        {feedItems.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>

      {/* ── Mobile: compact horizontal cards ── */}
      <div className="flex md:hidden flex-col gap-3 w-full">
        {feedItems.map((item) => (
          <MobileCard key={item.id} item={item} />
        ))}
      </div>

      {/* Decorative separator */}
      <div className="relative w-full mt-10 md:mt-[60px] mb-5 md:mb-6 flex items-center gap-4">
        <div
          className="flex-1 h-[1px]"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.25))",
          }}
        />
        <div
          className="w-1.5 h-1.5 rotate-45"
          style={{ background: "rgba(0,229,255,0.5)" }}
        />
        <div
          className="flex-1 h-[1px]"
          style={{
            background: "linear-gradient(90deg, rgba(0,229,255,0.25), transparent)",
          }}
        />
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 w-full sm:w-auto items-center">
        <Link
          href="/about/reports"
          className="group flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 sm:py-0 text-[11px] uppercase tracking-[0.15em] transition-all duration-300 rounded-sm sm:rounded-none"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "rgba(0,229,255,0.7)",
            border: "1px solid rgba(0,229,255,0.2)",
            background: "rgba(0,229,255,0.03)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "#00e5ff";
            el.style.borderColor = "rgba(0,229,255,0.5)";
            el.style.background = "rgba(0,229,255,0.08)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "rgba(0,229,255,0.7)";
            el.style.borderColor = "rgba(0,229,255,0.2)";
            el.style.background = "rgba(0,229,255,0.03)";
          }}
        >
          <FileText size={12} />
          View all reports
          <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <Link
          href="/about/insight"
          className="group flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 sm:py-0 text-[11px] uppercase tracking-[0.15em] transition-all duration-300 rounded-sm sm:rounded-none"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "rgba(0,229,255,0.7)",
            border: "1px solid rgba(0,229,255,0.2)",
            background: "rgba(0,229,255,0.03)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "#00e5ff";
            el.style.borderColor = "rgba(0,229,255,0.5)";
            el.style.background = "rgba(0,229,255,0.08)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.color = "rgba(0,229,255,0.7)";
            el.style.borderColor = "rgba(0,229,255,0.2)";
            el.style.background = "rgba(0,229,255,0.03)";
          }}
        >
          <Newspaper size={12} />
          View all posts
          <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>
    </div>
  );
}
