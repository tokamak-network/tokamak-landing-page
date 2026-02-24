"use client";

import { useState } from "react";
import Image from "next/image";
import type { Contributor } from "./types";

function getGithubAvatarUrl(profileUrl: string): string | null {
  if (!profileUrl.startsWith("https://github.com/")) return null;
  const path = profileUrl.replace("https://github.com/", "");
  if (!path || path.includes("/")) return null;
  return `${profileUrl}.png?size=40`;
}

export default function ContributorBadge({
  contributor,
}: {
  contributor: Contributor;
}) {
  const hasValidUrl = contributor.profileUrl.startsWith("https://");
  const avatarUrl = getGithubAvatarUrl(contributor.profileUrl);
  const [avatarError, setAvatarError] = useState(false);

  const initial = contributor.name.charAt(0).toUpperCase();

  const avatar = avatarUrl && !avatarError ? (
    <Image
      src={avatarUrl}
      alt=""
      width={20}
      height={20}
      className="rounded-full"
      onError={() => setAvatarError(true)}
    />
  ) : (
    <span className="w-[20px] h-[20px] rounded-full bg-[#e8e8e8] text-[#666] text-[10px] font-[600] inline-flex items-center justify-center flex-shrink-0">
      {initial}
    </span>
  );

  const badge = (
    <span
      className={`inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full
        bg-[#f5f5f5] text-[12px] text-[#333] transition-colors duration-200 ${
          hasValidUrl ? "hover:bg-[#e8e8e8] hover:text-[#0078FF]" : ""
        }`}
    >
      {avatar}
      {contributor.name}
    </span>
  );

  if (!hasValidUrl) return badge;

  return (
    <a
      href={contributor.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {badge}
    </a>
  );
}
