import type { ReportStats } from "./types";
import AdditionsBar from "./AdditionsBar";

const SECONDARY_STATS: { key: keyof ReportStats; label: string }[] = [
  { key: "activeRepos", label: "Active Projects" },
  { key: "netGrowth", label: "Net Growth" },
];

const LISTING_STAT_COLUMNS: { key: keyof ReportStats; label: string }[] = [
  { key: "linesChanged", label: "Code Changes" },
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
        <div className="bg-surface p-[20px] [@media(max-width:640px)]:p-[16px] border border-[#434347]">
          <div className="flex flex-col gap-[4px] mb-[12px]">
            <span className="text-[28px] [@media(max-width:640px)]:text-[22px] text-white font-[600]">
              Total Code Changes
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
                <span className="text-[13px] [@media(max-width:640px)]:text-[12px] text-[#00C853] font-[500]">
                  {stats.linesAdded} added
                </span>
                <span className="text-[13px] [@media(max-width:640px)]:text-[12px] text-[#FF4444] font-[500]">
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
              className="flex flex-col items-center text-center bg-surface py-[14px] px-[12px]"
            >
              <span className="text-[20px] [@media(max-width:640px)]:text-[16px] font-[700] text-white">
                {stats[key]}
              </span>
              <span className="text-[11px] text-[#929298] uppercase tracking-[0.02em]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-2 [@media(max-width:640px)]:grid-cols-2 [@media(max-width:400px)]:grid-cols-2">
        {LISTING_STAT_COLUMNS.map(({ key, label }, i) => (
          <div key={key} className="flex flex-col items-center text-center gap-[2px]">
            <span className={`font-[600] ${i === 0 ? "text-[#0078FF] text-[16px]" : "text-white text-[14px]"}`}>
              {stats[key]}
            </span>
            <span className="text-[#929298] text-[10px]">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-3 gap-4 [@media(max-width:640px)]:grid-cols-2 [@media(max-width:400px)]:grid-cols-2"
    >
      {LISTING_STAT_COLUMNS.map(({ key, label }, i) => (
        <div
          key={key}
          className="flex flex-col items-center text-center gap-[4px]"
        >
          <span
            className={`font-[600] ${
              i === 0
                ? "text-[28px] [@media(max-width:640px)]:text-[22px] font-[700] text-[#0078FF]"
                : "text-[20px] [@media(max-width:640px)]:text-[16px] text-white"
            }`}
          >
            {stats[key]}
          </span>
          <span className="text-[#929298] text-[12px]">{label}</span>
        </div>
      ))}
    </div>
  );
}
