import Image from "next/image";
import type { Contributor } from "./types";

export default function ContributorBadge({
  contributor,
}: {
  contributor: Contributor;
}) {
  const hasValidUrl = contributor.profileUrl.startsWith("https://");

  const content = (
    <span
      className={`flex items-center gap-[6px] px-[8px] py-[4px] rounded-full
        bg-[#f5f5f5] transition-colors duration-200 ${
          hasValidUrl ? "hover:bg-[#e8e8e8]" : ""
        }`}
    >
      {contributor.avatarUrl && (
        <Image
          src={contributor.avatarUrl}
          alt={contributor.name}
          width={20}
          height={20}
          className="rounded-full"
        />
      )}
      <span className="text-[12px] text-[#333]">{contributor.name}</span>
    </span>
  );

  if (!hasValidUrl) return content;

  return (
    <a
      href={contributor.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  );
}
