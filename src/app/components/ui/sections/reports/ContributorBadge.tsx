import type { Contributor } from "./types";

export default function ContributorBadge({
  contributor,
}: {
  contributor: Contributor;
}) {
  const hasValidUrl = contributor.profileUrl.startsWith("https://");

  const badge = (
    <span
      className={`inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full
        bg-[#f5f5f5] text-[12px] text-[#333] transition-colors duration-200 ${
          hasValidUrl ? "hover:bg-[#e8e8e8] hover:text-[#0078FF]" : ""
        }`}
    >
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
