import * as React from "react";
import type { ProtocolCardProps } from "./types";
import Image from "next/image";

interface ActivityBadge {
  readonly label: string;
  readonly level: "high" | "medium" | "low";
}

const BADGE_STYLES = {
  high: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  low: "text-slate-400 bg-slate-400/10 border-slate-400/20",
} as const;

const BADGE_LABELS = {
  high: "Active",
  medium: "Active",
  low: "Beta",
} as const;

const ICON_STYLES = {
  high: "bg-primary/20 text-primary",
  medium: "bg-indigo-500/20 text-indigo-400",
  low: "bg-rose-500/20 text-rose-400",
} as const;

export interface ProtocolCardWithBadgeProps extends ProtocolCardProps {
  readonly badge?: ActivityBadge;
}

export const ProtocolCardWithBadge: React.FC<ProtocolCardWithBadgeProps> = ({
  icon,
  title,
  description,
  alt,
  badge,
}) => {
  const level = badge?.level ?? "medium";

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-border-color bg-surface hover:border-primary/50 transition-colors">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded shrink-0 ${ICON_STYLES[level]}`}
      >
        <Image
          loading="lazy"
          src={icon}
          alt={alt}
          width={24}
          height={24}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-white text-[14px] font-[700] truncate">{title}</p>
        <p className="text-slate-400 text-[12px] truncate">{description}</p>
      </div>
      {badge && (
        <span
          className={`text-[12px] font-[500] px-2 py-1 rounded border shrink-0 ${BADGE_STYLES[badge.level]}`}
        >
          {BADGE_LABELS[badge.level]}
        </span>
      )}
    </div>
  );
};
