import type { ReportStats } from "./types";
import AdditionsBar from "./AdditionsBar";

const SECONDARY_STATS: { key: keyof ReportStats; label: string }[] = [
  { key: "activeRepos", label: "Active Projects" },
  { key: "netGrowth", label: "Net Growth" },
];

const LISTING_STAT_COLUMNS: { key: keyof ReportStats; label: string }[] = [
  { key: "linesChanged", label: "Lines Changed" },
  { key: "activeRepos", label: "Active Projects" },
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
    const hasBreakdown = stats.linesAdded && stats.linesDeleted;

    return (
      <div className="flex flex-col gap-[12px]">
        {/* Hero: Total Lines Changed */}
        <div className="bg-[#f8f9fa] rounded-[12px] p-[20px] [@media(max-width:640px)]:p-[16px] border border-[#EDEDF0]">
          <div className="flex items-baseline justify-between mb-[12px]">
            <span className="text-[11px] text-[#808992] uppercase tracking-[0.06em] font-[600]">
              Total Lines Changed
            </span>
            <span className="text-[48px] [@media(max-width:640px)]:text-[36px] font-[700] text-[#0078FF]">
              {stats.linesChanged.replace(/^\+/, "")}
            </span>
          </div>

          {hasBreakdown && (
            <>
              <AdditionsBar
                linesAdded={stats.linesAdded!}
                linesDeleted={stats.linesDeleted!}
                height={6}
              />
              <div className="flex items-center justify-between mt-[8px]">
                <span className="text-[13px] [@media(max-width:640px)]:text-[12px] text-[#28a745] font-[500]">
                  {stats.linesAdded} added
                </span>
                <span className="text-[13px] [@media(max-width:640px)]:text-[12px] text-[#cb2431] font-[500]">
                  {stats.linesDeleted} deleted
                </span>
              </div>
            </>
          )}
        </div>

        {/* Secondary stats: 2-column grid */}
        <div className="grid grid-cols-2 gap-[8px]">
          {SECONDARY_STATS.map(({ key, label }) => (
            <div
              key={key}
              className="flex flex-col items-center text-center bg-[#f8f9fa] rounded-[8px] py-[14px] px-[12px]"
            >
              <span className="text-[20px] [@media(max-width:640px)]:text-[16px] font-[700] text-[#1C1C1C]">
                {stats[key]}
              </span>
              <span className="text-[11px] text-[#808992] uppercase tracking-[0.02em]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-3 ${
        compact
          ? "gap-2 [@media(max-width:640px)]:grid-cols-2 [@media(max-width:400px)]:grid-cols-2"
          : "gap-4 [@media(max-width:640px)]:grid-cols-2 [@media(max-width:400px)]:grid-cols-2"
      }`}
    >
      {LISTING_STAT_COLUMNS.map(({ key, label }, i) => (
        <div
          key={key}
          className={`flex flex-col items-center text-center ${
            compact ? "gap-[2px]" : "gap-[4px]"
          }`}
        >
          <span
            className={`font-[600] ${
              i === 0 ? "text-[#0078FF]" : "text-[#1C1C1C]"
            } ${
              compact
                ? i === 0
                  ? "text-[16px]"
                  : "text-[14px]"
                : i === 0
                  ? "text-[22px] [@media(max-width:640px)]:text-[18px]"
                  : "text-[20px] [@media(max-width:640px)]:text-[16px]"
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
