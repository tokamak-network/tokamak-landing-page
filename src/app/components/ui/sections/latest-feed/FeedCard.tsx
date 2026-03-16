"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FileText, Newspaper, BarChart3, GitPullRequest } from "lucide-react";
import DefaultThumbnail from "@/assets/images/insight/default-thumnail.svg";
import type { FeedItem } from "./types";

const TYPE_CONFIG = {
  blog: {
    label: "Blog",
    color: "#a855f7",
    icon: <Newspaper size={12} />,
  },
  report: {
    label: "Dev Report",
    color: "#0077ff",
    icon: <FileText size={12} />,
  },
} as const;

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

function relativeDays(dateString: string): string {
  try {
    const now = Date.now();
    const then = new Date(dateString).getTime();
    const days = Math.floor((now - then) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  } catch {
    return "";
  }
}

export function FeedCard({ item }: { readonly item: FeedItem }) {
  const [imgError, setImgError] = useState(false);
  const cfg = TYPE_CONFIG[item.type];

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
      className="flex flex-col w-full max-w-[360px] text-white cursor-pointer group"
    >
      {/* Thumbnail */}
      <div
        className="relative w-full h-[198px] overflow-hidden mb-4 rounded-lg border transition-colors duration-300 group-hover:border-opacity-60"
        style={{ borderColor: cfg.color + "30" }}
      >
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badge */}
        <span
          className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-[700] uppercase tracking-[0.06em] backdrop-blur-sm"
          style={{
            backgroundColor: cfg.color + "20",
            color: cfg.color,
            border: `1px solid ${cfg.color}40`,
          }}
        >
          {cfg.icon}
          {cfg.label}
        </span>

        {/* Relative time pill */}
        <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-[600] text-white/60 bg-black/40 backdrop-blur-sm rounded">
          {relativeDays(item.date)}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[12px] text-[#929298] font-[400]">
          {formatDate(item.date)}
        </span>
      </div>

      {/* Title */}
      <span className="text-[18px] font-[700] text-white line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-snug">
        {item.title}
      </span>

      {/* Stats preview for reports */}
      {item.type === "report" && item.statsSummary && (
        <div className="flex items-center gap-3 mt-2">
          {item.statsSummary.split(" · ").map((stat) => {
            const isRepo = stat.includes("repo");
            return (
              <span
                key={stat}
                className="inline-flex items-center gap-1 text-[11px] font-[600] px-2 py-0.5 rounded"
                style={{
                  backgroundColor: "#0077ff10",
                  color: "#0077ff",
                  border: "1px solid #0077ff20",
                }}
              >
                {isRepo ? <GitPullRequest size={10} /> : <BarChart3 size={10} />}
                {stat}
              </span>
            );
          })}
        </div>
      )}

      {/* Excerpt for blog posts */}
      {item.type === "blog" && item.excerpt && (
        <p className="text-[13px] text-[#777] mt-2 leading-relaxed line-clamp-2">
          {item.excerpt}
        </p>
      )}
    </Wrapper>
  );
}
