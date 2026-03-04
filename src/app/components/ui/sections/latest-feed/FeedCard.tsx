"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DefaultThumbnail from "@/assets/images/insight/default-thumnail.svg";
import type { FeedItem } from "./types";

const BADGE_STYLES = {
  blog: "bg-white/10 text-white backdrop-blur-sm",
  report: "bg-primary text-black font-[700]",
} as const;

const BADGE_LABELS = {
  blog: "BLOG",
  report: "DEV REPORT",
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

export function FeedCard({ item }: { readonly item: FeedItem }) {
  const [imgError, setImgError] = useState(false);

  const imageSrc =
    imgError || !item.thumbnail || item.thumbnail.trim() === ""
      ? DefaultThumbnail
      : item.thumbnail;

  const isExternal = item.type === "blog";
  const Wrapper = isExternal ? "a" : Link;
  const linkProps = isExternal
    ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
    : { href: item.href };

  return (
    <Wrapper
      {...linkProps}
      className="flex flex-col w-full max-w-[360px] text-white cursor-pointer group"
    >
      <div className="relative w-full h-[198px] overflow-hidden mb-4 border border-[#434347]">
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
        <span
          className={`absolute top-3 left-3 px-3 py-1 text-[11px] font-[700] uppercase tracking-[0.04em] ${BADGE_STYLES[item.type]}`}
        >
          {BADGE_LABELS[item.type]}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-[12px] font-[700] text-[#929298] uppercase tracking-[0.06em]">
          {item.type === "report" ? "Dev Report" : "Blog"}
        </span>
        <span className="text-[#929298] font-[400] text-[13px]">
          {formatDate(item.date)}
        </span>
      </div>
      <span className="text-[18px] font-[700] text-white line-clamp-2 group-hover:text-primary transition-colors duration-300">
        {item.title}
      </span>
      {item.statsSummary && (
        <span className="text-[13px] text-[#929298] mt-1">
          {item.statsSummary}
        </span>
      )}
    </Wrapper>
  );
}
