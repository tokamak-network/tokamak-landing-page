"use client";

import Link from "next/link";
import type { ActivityItem } from "./types";
import { ACTIVITY_ITEMS } from "./data";

const TYPE_ICON_STYLES: Record<ActivityItem["type"], string> = {
  commit: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  blog: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  report: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const TYPE_ICONS: Record<ActivityItem["type"], string> = {
  commit: "{ }",
  blog: "📄",
  report: "📊",
};

function ActivityRow({ item }: { readonly item: ActivityItem }) {
  const isExternal = item.type === "blog" || item.type === "commit";

  const content = (
    <div className="flex items-center gap-4 p-4 hover:bg-surface-hover transition-colors cursor-pointer">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg border shrink-0 text-[14px] ${TYPE_ICON_STYLES[item.type]}`}
      >
        {TYPE_ICONS[item.type]}
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[14px] font-[700] text-white truncate">
          {item.title}
        </span>
        <span className="text-slate-400 text-[12px] mt-0.5">
          {item.metadata}
        </span>
      </div>
      <span className="text-slate-500 text-[12px] whitespace-nowrap shrink-0">
        {item.timeAgo}
      </span>
    </div>
  );

  if (isExternal) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={item.href}>{content}</Link>;
}

export default function ActivityFeed() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-white text-[24px] font-[700] tracking-tight">
        Recent Activity
      </h2>
      <div className="flex flex-col rounded-xl border border-border-color bg-surface divide-y divide-border-color">
        {ACTIVITY_ITEMS.map((item) => (
          <ActivityRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
