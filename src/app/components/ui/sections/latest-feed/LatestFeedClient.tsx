"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FeedCard } from "./FeedCard";
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
      <div
        className="grid gap-[30px] w-full
          [@media(min-width:1280px)]:grid-cols-4
          [@media(min-width:800px)_and_(max-width:1279px)]:grid-cols-2
          [@media(max-width:799px)]:grid-cols-1
          [@media(max-width:799px)]:justify-items-center"
      >
        {feedItems.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>

      {/* Decorative separator */}
      <div className="relative w-full mt-[60px] mb-6 flex items-center gap-4">
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

      <div className="flex gap-8">
        <Link
          href="/about/reports"
          className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] transition-colors duration-300"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "rgba(0,229,255,0.7)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#00e5ff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(0,229,255,0.7)"; }}
        >
          <span
            className="inline-block w-4 h-[1px] transition-all duration-300 group-hover:w-6"
            style={{ background: "#00e5ff" }}
          />
          View all reports
        </Link>
        <Link
          href="/about/insight"
          className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] transition-colors duration-300"
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: "rgba(0,229,255,0.7)",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#00e5ff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(0,229,255,0.7)"; }}
        >
          <span
            className="inline-block w-4 h-[1px] transition-all duration-300 group-hover:w-6"
            style={{ background: "#00e5ff" }}
          />
          View all posts
        </Link>
      </div>
    </div>
  );
}
