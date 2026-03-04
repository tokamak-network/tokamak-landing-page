"use client";

import Link from "next/link";
import type { ActivityItem } from "./types";
import { ACTIVITY_ITEMS } from "./data";

const TYPE_COLORS: Record<ActivityItem["type"], string> = {
  commit: "bg-[#28a745]/15 text-[#28a745]",
  blog: "bg-[#0078FF]/15 text-[#0078FF]",
  report: "bg-[#FFB800]/15 text-[#FFB800]",
};

const TYPE_LABELS: Record<ActivityItem["type"], string> = {
  commit: "Commit",
  blog: "Blog",
  report: "Report",
};

function TypeBadge({ type }: { readonly type: ActivityItem["type"] }) {
  return (
    <span
      className={`flex items-center justify-center px-[10px] py-[4px] rounded-full text-[11px] font-[600] shrink-0 ${TYPE_COLORS[type]}`}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}

function ActivityRow({ item }: { readonly item: ActivityItem }) {
  const isExternal = item.type === "blog" || item.type === "commit";

  const content = (
    <div className="flex items-center gap-[14px] py-[16px] px-[16px] rounded-[12px] hover:bg-[#2a2a2a] transition-colors duration-150 group cursor-pointer">
      <TypeBadge type={item.type} />
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-[15px] font-[500] text-white truncate group-hover:text-[#0078FF] transition-colors">
          {item.title}
        </span>
        <span className="text-[13px] font-[300] text-white/40">
          {item.metadata}
        </span>
      </div>
      <span className="text-[12px] font-[300] text-white/30 whitespace-nowrap shrink-0">
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
    <section className="w-full bg-[#1C1C1C] flex justify-center px-[25px] [@media(max-width:1000px)]:px-[15px] py-[80px] [@media(max-width:640px)]:py-[50px]">
      <div className="w-full max-w-[800px] flex flex-col items-center">
        <h2 className="text-[30px] font-[100] text-white mb-[9px] text-center">
          Recent <span className="font-[600]">Activity</span>
        </h2>
        <p className="text-[15px] font-[300] text-white/50 mb-[40px] text-center">
          Latest updates from across the ecosystem
        </p>
        <div className="w-full flex flex-col divide-y divide-[#333]/50">
          {ACTIVITY_ITEMS.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
