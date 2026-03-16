"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FileText, Newspaper, BarChart3, GitPullRequest, ArrowUpRight } from "lucide-react";
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
      className="relative w-full cursor-pointer group block overflow-hidden rounded-lg"
      style={{
        border: `1px solid ${cfg.color}20`,
      }}
    >
      {/* Full-card thumbnail */}
      <div className="relative w-full h-[300px] overflow-hidden">
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onError={() => setImgError(true)}
        />

        {/* Permanent dark gradient from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Top row: badge + time */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 z-10">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-[700] uppercase tracking-[0.06em] backdrop-blur-md"
            style={{
              backgroundColor: cfg.color + "25",
              color: cfg.color,
              border: `1px solid ${cfg.color}40`,
            }}
          >
            {cfg.icon}
            {cfg.label}
          </span>
          <span className="px-2 py-0.5 text-[9px] font-[600] text-white/60 bg-black/40 backdrop-blur-md rounded">
            {relativeDays(item.date)}
          </span>
        </div>

        {/* Glass overlay — default: bottom ~40%, hover: expands to ~65% */}
        <div
          className="absolute left-0 right-0 bottom-0 backdrop-blur-sm transition-all duration-500 ease-out flex flex-col justify-end"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.35))`,
            borderTop: `1px solid ${cfg.color}15`,
          }}
        >
          <div className="px-4 pt-3 pb-3">
            {/* Date */}
            <span className="text-[11px] text-[#888] font-[400] block mb-1.5">
              {formatDate(item.date)}
            </span>

            {/* Title */}
            <h3 className="text-[16px] font-[700] text-white leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-0">
              {item.title}
            </h3>

            {/* Expandable detail area */}
            <div className="overflow-hidden transition-all duration-500 ease-out max-h-0 group-hover:max-h-[120px] opacity-0 group-hover:opacity-100">
              {/* Stats for reports */}
              {item.type === "report" && item.statsSummary && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {item.statsSummary.split(" · ").map((stat) => {
                    const isRepo = stat.includes("repo");
                    return (
                      <span
                        key={stat}
                        className="inline-flex items-center gap-1 text-[10px] font-[600] px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: cfg.color + "15",
                          color: cfg.color,
                          border: `1px solid ${cfg.color}25`,
                        }}
                      >
                        {isRepo ? <GitPullRequest size={10} /> : <BarChart3 size={10} />}
                        {stat}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Excerpt for blogs */}
              {item.type === "blog" && item.excerpt && (
                <p className="text-[12px] text-[#999] mt-3 leading-relaxed line-clamp-2">
                  {item.excerpt}
                </p>
              )}

              {/* CTA */}
              <div className="flex items-center gap-1 mt-3">
                <span
                  className="text-[11px] font-[700] uppercase tracking-[0.06em]"
                  style={{ color: cfg.color }}
                >
                  {item.type === "report" ? "Open Report" : "Read More"}
                </span>
                <ArrowUpRight size={12} style={{ color: cfg.color }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top edge glow on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
          }}
        />
      </div>
    </Wrapper>
  );
}
