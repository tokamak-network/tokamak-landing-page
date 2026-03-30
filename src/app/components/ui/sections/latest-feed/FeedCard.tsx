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
    color: "#00e5ff",
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
      className="relative w-full cursor-pointer group block overflow-hidden"
      style={{
        borderRadius: "2px",
        border: `1px solid rgba(0,229,255,0.15)`,
        boxShadow: "0 0 0 0 transparent",
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(0,229,255,0.4)";
        el.style.boxShadow = "0 0 20px rgba(0,229,255,0.12), inset 0 0 20px rgba(0,229,255,0.03)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(0,229,255,0.15)";
        el.style.boxShadow = "0 0 0 0 transparent";
      }}
    >
      {/* Scan-line overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,229,255,0.015) 3px, rgba(0,229,255,0.015) 4px)",
        }}
      />

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
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-[700] uppercase tracking-[0.1em] backdrop-blur-md"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              borderRadius: "2px",
              backgroundColor: cfg.color + "20",
              color: cfg.color,
              border: `1px solid ${cfg.color}45`,
            }}
          >
            {cfg.icon}
            {cfg.label}
          </span>
          <span
            className="px-2 py-0.5 text-[9px] text-white/60 bg-black/50 backdrop-blur-md tracking-[0.08em] uppercase"
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              borderRadius: "2px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {relativeDays(item.date)}
          </span>
        </div>

        {/* Glass overlay */}
        <div
          className="absolute left-0 right-0 bottom-0 backdrop-blur-sm transition-all duration-500 ease-out flex flex-col justify-end"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.38))`,
            borderTop: `1px solid ${cfg.color}18`,
          }}
        >
          <div className="px-4 pt-3 pb-3">
            {/* Date */}
            <span
              className="text-[10px] block mb-1.5 tracking-[0.08em] uppercase"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                color: "rgba(140,200,255,0.5)",
              }}
            >
              {formatDate(item.date)}
            </span>

            {/* Title */}
            <h3
              className="text-[16px] font-[700] text-white leading-snug line-clamp-2 mb-0 transition-colors duration-300"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#00e5ff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#ffffff"; }}
            >
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
                        className="inline-flex items-center gap-1 text-[10px] font-[600] px-2 py-0.5 tracking-[0.06em]"
                        style={{
                          fontFamily: "'Share Tech Mono', monospace",
                          borderRadius: "2px",
                          backgroundColor: cfg.color + "12",
                          color: cfg.color,
                          border: `1px solid ${cfg.color}28`,
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
                <p
                  className="text-[12px] mt-3 leading-relaxed line-clamp-2"
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    color: "rgba(140,200,255,0.5)",
                  }}
                >
                  {item.excerpt}
                </p>
              )}

              {/* CTA */}
              <div className="flex items-center gap-1 mt-3">
                <span
                  className="text-[11px] font-[700] uppercase tracking-[0.1em]"
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    color: "#00e5ff",
                  }}
                >
                  {item.type === "report" ? "Open Report" : "Read More"}
                </span>
                <ArrowUpRight size={12} style={{ color: "#00e5ff" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top edge glow — always subtly visible, brighter on hover */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px] opacity-40 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
            boxShadow: `0 0 6px ${cfg.color}80`,
          }}
        />
      </div>
    </Wrapper>
  );
}
