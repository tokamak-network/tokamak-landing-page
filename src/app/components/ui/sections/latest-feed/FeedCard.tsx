"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DefaultThumbnail from "@/assets/images/insight/default-thumnail.svg";
import type { FeedItem } from "./types";

const BADGE_STYLES = {
  blog: "bg-[#1C1C1C] text-white",
  report: "bg-[#0078FF] text-white",
} as const;

const BADGE_LABELS = {
  blog: "Blog",
  report: "Dev Report",
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
      className="flex flex-col w-full max-w-[360px] text-[#1C1C1C] cursor-pointer group"
    >
      <div className="relative w-full h-[198px] overflow-hidden mb-4 rounded-[14px] border border-[#DEDEDE]">
        <Image
          src={imageSrc}
          alt={item.title}
          fill
          className="object-cover"
          onError={() => setImgError(true)}
        />
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-[600] ${BADGE_STYLES[item.type]}`}
        >
          {BADGE_LABELS[item.type]}
        </span>
      </div>
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-[13px] font-[700]">
          {item.type === "report" ? "Dev Report" : "Blog"}
        </span>
        <span className="text-gray-500 font-[400] text-[13px]">
          {formatDate(item.date)}
        </span>
      </div>
      <span className="text-[18px] font-[500] line-clamp-2 group-hover:text-[#0078FF] transition-colors">
        {item.title}
      </span>
      {item.statsSummary && (
        <span className="text-[13px] font-[300] text-[#808992] mt-1">
          {item.statsSummary}
        </span>
      )}
    </Wrapper>
  );
}
