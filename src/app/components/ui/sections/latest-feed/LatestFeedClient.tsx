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
    <div className="flex flex-col items-center">
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

      <div className="flex gap-6 mt-[60px] text-[14px] font-[500]">
        <Link
          href="/about/reports"
          className="text-primary hover:underline"
        >
          View all reports &rarr;
        </Link>
        <Link
          href="/about/insight"
          className="text-primary hover:underline"
        >
          View all posts &rarr;
        </Link>
      </div>
    </div>
  );
}
