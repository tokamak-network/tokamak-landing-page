"use client";

import { useMemo } from "react";
import type { CategoryFocusItem, RepoCardData } from "./types";
import { sanitizeColor, parseNum } from "@/app/lib/utils/format";

interface RepoLines {
  added: number;
  deleted: number;
}

function buildLinesMap(repos: RepoCardData[]): Map<string, RepoLines> {
  const map = new Map<string, RepoLines>();
  for (const r of repos) {
    map.set(r.repoName, {
      added: Math.abs(parseNum(r.stats.linesAdded)),
      deleted: Math.abs(parseNum(r.stats.linesDeleted)),
    });
  }
  return map;
}

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

function RepoChip({
  name,
  lines,
}: {
  name: string;
  lines: RepoLines | undefined;
}) {
  return (
    <span className="inline-flex items-center gap-[4px] bg-[#f5f7fa] text-[12px] text-[#444] px-[10px] py-[4px] rounded-full">
      <span className="font-[600]">{name}</span>
      {lines && (
        <span className="text-[#888]">
          <span className="text-[#28a745]">+{formatNum(lines.added)}</span>
          {" / "}
          <span className="text-[#cb2431]">-{formatNum(lines.deleted)}</span>
        </span>
      )}
    </span>
  );
}

function FocusCard({
  item,
  linesMap,
}: {
  item: CategoryFocusItem;
  linesMap: Map<string, RepoLines>;
}) {
  const categoryLines = useMemo(() => {
    let added = 0;
    let deleted = 0;
    for (const repo of item.topRepos) {
      const lines = linesMap.get(repo.name);
      if (lines) {
        added += lines.added;
        deleted += lines.deleted;
      }
    }
    return { added, deleted };
  }, [item.topRepos, linesMap]);

  const hasLines = categoryLines.added > 0 || categoryLines.deleted > 0;

  return (
    <div
      className="bg-white border border-[#e8e8e8] rounded-[10px] p-[20px_24px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
      style={{ borderLeft: `4px solid ${sanitizeColor(item.color)}` }}
    >
      {/* Header */}
      <div className="flex items-center gap-[8px] mb-[10px] flex-wrap">
        <span className="text-[18px]">{item.icon}</span>
        <span className="text-[16px] font-[700] text-[#1a1a1a]">
          {item.name}
        </span>
        <div className="ml-auto flex items-center gap-[6px]">
          <span
            className="bg-[#f0f0f0] text-[#555] px-[10px] py-[2px] rounded-[10px]
              text-[11px] font-[700] whitespace-nowrap"
          >
            {item.repoCount} repos
          </span>
          {hasLines && (
            <span
              className="bg-[#f0f0f0] px-[10px] py-[2px] rounded-[10px]
                text-[11px] font-[700] whitespace-nowrap"
            >
              <span className="text-[#28a745]">+{formatNum(categoryLines.added)}</span>
              {" / "}
              <span className="text-[#cb2431]">-{formatNum(categoryLines.deleted)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Top repos */}
      {item.topRepos.length > 0 && (
        <div className="flex flex-wrap gap-[6px] mb-[10px]">
          {item.topRepos.map((repo) => (
            <RepoChip
              key={repo.name}
              name={repo.name}
              lines={linesMap.get(repo.name)}
            />
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
  repos,
}: {
  items: CategoryFocusItem[];
  repos: RepoCardData[];
}) {
  const linesMap = useMemo(() => buildLinesMap(repos), [repos]);

  return (
    <div className="flex flex-col gap-[20px]">
      <span className="text-[11px] font-[700] text-[#0078FF] uppercase tracking-[0.05em]">
        Category Focus & Synergies
      </span>

      <div className="flex flex-col gap-[16px]">
        {items.map((item) => (
          <FocusCard key={item.name} item={item} linesMap={linesMap} />
        ))}
      </div>
    </div>
  );
}
