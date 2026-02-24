"use client";

import type { CategoryFocusItem } from "./types";
import { sanitizeColor } from "@/app/lib/utils/format";

function RepoChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center bg-[#f5f7fa] text-[12px] text-[#444] px-[10px] py-[4px] rounded-full">
      <span className="font-[600]">{name}</span>
    </span>
  );
}

function FocusCard({ item }: { item: CategoryFocusItem }) {
  return (
    <div
      className="bg-white border border-[#e8e8e8] rounded-[10px] p-[20px_24px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      style={{ borderLeft: `4px solid ${sanitizeColor(item.color)}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-[8px] mb-[10px]">
        <span className="text-[18px]">{item.icon}</span>
        <span className="text-[16px] font-[700] text-[#1a1a1a]">
          {item.name}
        </span>
        <span
          className="ml-auto bg-[#f0f0f0] text-[#555] px-[10px] py-[2px] rounded-[10px]
            text-[11px] font-[700] whitespace-nowrap"
        >
          {item.repoCount} repos
        </span>
      </div>

      {/* Top repos */}
      {item.topRepos.length > 0 && (
        <div className="flex flex-wrap gap-[6px] mb-[10px]">
          {item.topRepos.map((repo) => (
            <RepoChip key={repo.name} name={repo.name} />
          ))}
        </div>
      )}

      {/* Current Focus */}
      {item.focusNarrative && (
        <div className="mb-[8px]">
          <div className="text-[11px] font-[600] text-[#0078FF] uppercase tracking-[0.03em] mb-[4px]">
            Current Focus
          </div>
          <div className="text-[13px] text-[#444] leading-[1.5]">
            {item.focusNarrative}
          </div>
        </div>
      )}

      {/* Potential Synergies */}
      <div className="mt-[12px]">
        <div className="text-[11px] font-[600] text-[#EA580C] uppercase tracking-[0.03em] mb-[6px]">
          Potential Synergies
        </div>
        {item.synergies.length > 0 ? (
          <ul className="pl-[18px] text-[12px] text-[#555] leading-[1.5] list-disc">
            {item.synergies.map((s, i) => (
              <li key={i} className="mb-[6px]">
                {s}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-[12px] text-[#999] italic">
            No cross-category synergies identified
          </span>
        )}
      </div>
    </div>
  );
}

export default function CategoryFocusSynergies({
  items,
}: {
  items: CategoryFocusItem[];
}) {
  return (
    <div className="flex flex-col gap-[20px]">
      <span className="text-[11px] font-[700] text-[#0078FF] uppercase tracking-[0.05em]">
        Category Focus & Synergies
      </span>

      <div className="flex flex-col gap-[16px]">
        {items.map((item) => (
          <FocusCard key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
}
