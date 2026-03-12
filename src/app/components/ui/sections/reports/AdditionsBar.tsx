import { parseNum } from "@/app/lib/utils/format";

export default function AdditionsBar({
  linesAdded,
  linesDeleted,
  height = 4,
  showLabel = false,
  className = "",
}: {
  linesAdded: string;
  linesDeleted: string;
  height?: number;
  showLabel?: boolean;
  className?: string;
}) {
  const added = Math.abs(parseNum(linesAdded));
  const deleted = Math.abs(parseNum(linesDeleted));
  const total = added + deleted;
  if (total === 0) return null;

  const addedPct = (added / total) * 100;

  return (
    <div className={`flex items-center gap-[8px] ${className}`}>
      <div
        className="flex-1 overflow-hidden flex bg-[#2a2a2e]"
        style={{ height: `${height}px` }}
      >
        <div
          className="h-full bg-[#00C853]"
          style={{ width: `${addedPct}%` }}
        />
        <div
          className="h-full bg-[#FF4444]"
          style={{ width: `${100 - addedPct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] text-[#929298] flex-shrink-0">
          {Math.round(addedPct)}% additions
        </span>
      )}
    </div>
  );
}
