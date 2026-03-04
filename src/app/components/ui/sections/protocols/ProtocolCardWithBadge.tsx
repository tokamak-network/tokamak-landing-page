import * as React from "react";
import type { ProtocolCardProps } from "./types";
import { LinkItem } from "./LinkItem";
import Image from "next/image";

interface ActivityBadge {
  readonly label: string;
  readonly level: "high" | "medium" | "low";
}

const BADGE_STYLES = {
  high: "bg-[#28a745]/15 text-[#28a745] border-[#28a745]/30",
  medium: "bg-[#FFB800]/15 text-[#FFB800] border-[#FFB800]/30",
  low: "bg-[#808992]/15 text-[#808992] border-[#808992]/30",
} as const;

export interface ProtocolCardWithBadgeProps extends ProtocolCardProps {
  readonly badge?: ActivityBadge;
}

export const ProtocolCardWithBadge: React.FC<ProtocolCardWithBadgeProps> = ({
  icon,
  title,
  description,
  links,
  alt,
  badge,
}) => {
  return (
    <div className="flex flex-col grow shrink w-[360px] min-w-[240px]">
      <div className="flex items-center gap-[10px]">
        <Image
          loading="lazy"
          src={icon}
          alt={alt}
          width={32}
          height={32}
          className="object-contain w-8 aspect-square"
        />
        {badge && (
          <span
            className={`px-[8px] py-[2px] text-[11px] font-[500] rounded-full border ${BADGE_STYLES[badge.level]}`}
          >
            {badge.label}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 h-full mt-[18px] w-full">
        <div className="text-lg text-white h-[22px] mb-[6px] font-[400]">
          {title}
        </div>
        <div className="text-[15px] font-[300] text-white opacity-[0.8] mt-[6px]">
          {description}
        </div>
        <div className="flex gap-4 items-center w-full h-[16px] mt-[6px] opacity-[0.8]">
          {links?.map((link, index) => (
            <LinkItem key={index} {...link} />
          ))}
        </div>
      </div>
    </div>
  );
};
