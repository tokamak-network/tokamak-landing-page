import type { ReportStats } from "./types";

const STAT_ITEMS: { key: keyof ReportStats; label: string }[] = [
  { key: "commits", label: "Commits" },
  { key: "linesChanged", label: "Lines Changed" },
  { key: "activeRepos", label: "Active Repos" },
  { key: "contributors", label: "Contributors" },
  { key: "netGrowth", label: "Net Growth" },
];

export default function StatsBar({
  stats,
  compact = false,
  variant = "default",
}: {
  stats: ReportStats;
  compact?: boolean;
  variant?: "default" | "cards";
}) {
  if (variant === "cards") {
    return (
      <div className="grid grid-cols-5 gap-[8px] [@media(max-width:640px)]:grid-cols-3 [@media(max-width:400px)]:grid-cols-2">
        {STAT_ITEMS.map(({ key, label }) => (
          <div
            key={key}
            className="flex flex-col items-center text-center bg-[#f8f9fa] rounded-[8px] py-[16px] px-[12px]"
          >
            <span className="text-[22px] [@media(max-width:640px)]:text-[18px] font-[700] text-[#1C1C1C]">
              {stats[key]}
            </span>
            <span className="text-[11px] text-[#808992] uppercase tracking-[0.02em]">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-5 ${
        compact
          ? "gap-2 [@media(max-width:640px)]:grid-cols-3 [@media(max-width:400px)]:grid-cols-2"
          : "gap-4 [@media(max-width:640px)]:grid-cols-3 [@media(max-width:400px)]:grid-cols-2"
      }`}
    >
      {STAT_ITEMS.map(({ key, label }) => (
        <div
          key={key}
          className={`flex flex-col items-center text-center ${
            compact ? "gap-[2px]" : "gap-[4px]"
          }`}
        >
          <span
            className={`font-[600] text-[#1C1C1C] ${
              compact ? "text-[14px]" : "text-[20px] [@media(max-width:640px)]:text-[16px]"
            }`}
          >
            {stats[key]}
          </span>
          <span
            className={`text-[#808992] ${
              compact ? "text-[10px]" : "text-[12px]"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
