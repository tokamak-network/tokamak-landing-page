"use client";

import { useMemo } from "react";
import type {
  EcosystemLandscape as EcosystemLandscapeType,
  LandscapeCategory,
  LandscapeRepo,
  RepoCardData,
} from "./types";
import { sanitizeColor } from "@/app/lib/utils/format";
import { type RepoLines, buildLinesMap, formatNum } from "./repoLinesUtils";

function categoryLinesTotal(
  category: LandscapeCategory,
  linesMap: Map<string, RepoLines>
): number {
  let total = 0;
  for (const repo of category.repos) {
    const added = repo.linesAdded ?? linesMap.get(repo.name)?.added ?? 0;
    const deleted = repo.linesDeleted ?? linesMap.get(repo.name)?.deleted ?? 0;
    total += added + deleted;
  }
  return total;
}

function repoLinesTotal(
  repo: LandscapeRepo,
  linesMap: Map<string, RepoLines>
): number {
  const added = repo.linesAdded ?? linesMap.get(repo.name)?.added ?? 0;
  const deleted = repo.linesDeleted ?? linesMap.get(repo.name)?.deleted ?? 0;
  return added + deleted;
}

const MAX_CATEGORY_SIZE = 9;

const ACTIVITY_LABEL: Record<string, string> = {
  high: "High Activity",
  medium: "Medium Activity",
  low: "Low Activity",
};

function splitLargeCategories(
  categories: LandscapeCategory[]
): LandscapeCategory[] {
  const result: LandscapeCategory[] = [];

  for (const cat of categories) {
    if (cat.repos.length <= MAX_CATEGORY_SIZE) {
      result.push(cat);
      continue;
    }

    const buckets: Record<string, LandscapeRepo[]> = {
      high: [],
      medium: [],
      low: [],
    };
    for (const repo of cat.repos) {
      const bucket = buckets[repo.activity] ?? buckets.low;
      bucket.push(repo);
    }

    for (const level of ["high", "medium", "low"] as const) {
      const levelRepos = buckets[level];
      if (levelRepos.length === 0) continue;
      result.push({
        ...cat,
        name: `${cat.name} (${ACTIVITY_LABEL[level]})`,
        repoCount: levelRepos.length,
        commitCount: 0,
        repos: levelRepos,
      });
    }
  }

  return result;
}

const ACTIVITY_COLORS: Record<string, string> = {
  high: "#22C55E",
  medium: "#EAB308",
  low: "#9CA3AF",
};

function SummaryPills({
  totalRepos,
  totalCategories,
}: {
  totalRepos: number;
  totalCategories: number;
}) {
  const pills = [
    { label: "Projects", value: totalRepos },
    { label: "Categories", value: totalCategories },
  ];

  return (
    <div className="flex flex-wrap gap-[8px]">
      {pills.map((p) => (
        <span
          key={p.label}
          className="inline-flex items-center gap-[6px] bg-[#f5f7fa] text-[13px] text-[#555]
            px-[12px] py-[5px] rounded-full font-[600]"
        >
          <span className="text-[#1C1C1C]">{p.value}</span>
          {p.label}
        </span>
      ))}
    </div>
  );
}

function CategoryLegend({ categories }: { categories: LandscapeCategory[] }) {
  return (
    <div className="flex flex-wrap gap-x-[14px] gap-y-[6px]">
      {categories.map((cat) => (
        <span
          key={cat.name}
          className="inline-flex items-center gap-[5px] text-[12px] text-[#666]"
        >
          <span
            className="w-[8px] h-[8px] rounded-full inline-block shrink-0"
            style={{ background: sanitizeColor(cat.color) }}
          />
          {cat.name}
        </span>
      ))}
    </div>
  );
}

function ActivityLegend() {
  const levels = [
    { label: "High (100k+)", color: ACTIVITY_COLORS.high },
    { label: "Medium (10k-100k)", color: ACTIVITY_COLORS.medium },
    { label: "Low (<10k)", color: ACTIVITY_COLORS.low },
  ];

  return (
    <div className="flex items-center gap-[12px] text-[12px] text-[#888]">
      <span className="font-[600] text-[#666]">Activity:</span>
      {levels.map((l) => (
        <span key={l.label} className="inline-flex items-center gap-[4px]">
          <span
            className="w-[7px] h-[7px] rounded-full inline-block"
            style={{ background: l.color }}
          />
          {l.label}
        </span>
      ))}
    </div>
  );
}

function RepoMiniCard({
  repo,
  lines,
}: {
  repo: LandscapeRepo;
  lines: RepoLines | undefined;
}) {
  const added = repo.linesAdded ?? lines?.added ?? 0;
  const deleted = repo.linesDeleted ?? lines?.deleted ?? 0;
  const total = added + deleted;

  return (
    <a
      href={repo.githubUrl || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-[8px] px-[10px] py-[10px] rounded-[6px]
        hover:bg-[#f5f7fa] transition-colors duration-150 group"
      style={{ borderLeft: `3px solid ${sanitizeColor(repo.categoryColor)}` }}
    >
      <span
        className="w-[7px] h-[7px] rounded-full mt-[5px] shrink-0"
        style={{ background: ACTIVITY_COLORS[repo.activity] }}
        title={`${repo.activity} activity`}
      />
      <div className="min-w-0 flex-1">
        <span className="text-[13px] font-[600] text-[#1C1C1C] group-hover:text-[#0078FF] transition-colors truncate block">
          {repo.name}
        </span>
        {repo.description && (
          <span className="text-[11px] text-[#888] leading-[1.4] line-clamp-1 block">
            {repo.description}
          </span>
        )}
        {(added > 0 || deleted > 0) && (
          <div className="flex items-center gap-[4px] mt-[2px]">
            <span className="text-[11px] text-[#28a745] font-[500]">+{formatNum(added)}</span>
            <span className="text-[11px] text-[#888]">/</span>
            <span className="text-[11px] text-[#cb2431] font-[500]">-{formatNum(deleted)}</span>
          </div>
        )}
      </div>
      {total > 0 && (
        <div className="shrink-0 text-right ml-[4px]">
          <span className="text-[9px] font-[600] text-[#888] uppercase tracking-[0.5px]">
            Code Changes
          </span>
          <span
            className="text-[14px] font-[700] block leading-[1.2]"
            style={{ color: sanitizeColor(repo.categoryColor) }}
          >
            {formatNum(total)}
          </span>
        </div>
      )}
    </a>
  );
}

function CategoryCard({
  category,
  linesMap,
}: {
  category: LandscapeCategory;
  linesMap: Map<string, RepoLines>;
}) {
  const catLines = useMemo(() => {
    let added = 0;
    let deleted = 0;
    for (const repo of category.repos) {
      const mapLines = linesMap.get(repo.name);
      added += repo.linesAdded ?? mapLines?.added ?? 0;
      deleted += repo.linesDeleted ?? mapLines?.deleted ?? 0;
    }
    return { added, deleted };
  }, [category.repos, linesMap]);

  const hasLines = catLines.added > 0 || catLines.deleted > 0;

  return (
    <div className="bg-white border border-[#e8e8e8] rounded-[10px] overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-[8px] px-[16px] py-[12px] border-b border-[#f0f0f0]"
        style={{ borderLeft: `4px solid ${sanitizeColor(category.color)}` }}
      >
        <span className="text-[16px]">{category.icon}</span>
        <span className="text-[14px] font-[700] text-[#1C1C1C]">
          {category.name}
        </span>
        <div className="ml-auto flex items-center gap-[6px]">
          <span className="text-[11px] text-[#888] font-[600] whitespace-nowrap">
            {category.repoCount} repos
          </span>
          {hasLines && (
            <span
              className="bg-[#f0f0f0] px-[8px] py-[1px] rounded-[10px]
                text-[11px] font-[700] whitespace-nowrap"
            >
              <span className="text-[#28a745]">+{formatNum(catLines.added)}</span>
              {" / "}
              <span className="text-[#cb2431]">-{formatNum(catLines.deleted)}</span>
            </span>
          )}
        </div>
      </div>

      {/* Repo list */}
      <div className="flex flex-col py-[6px] gap-[2px]">
        {category.repos.map((repo) => (
          <RepoMiniCard
            key={repo.name}
            repo={repo}
            lines={linesMap.get(repo.name)}
          />
        ))}
      </div>
    </div>
  );
}

export default function EcosystemLandscape({
  data,
  repos = [],
}: {
  data: EcosystemLandscapeType;
  repos?: RepoCardData[];
}) {
  const linesMap = useMemo(() => buildLinesMap(repos), [repos]);

  const sortedCategories = useMemo(() => {
    const split = splitLargeCategories(data.categories);
    const sorted = [...split].sort(
      (a, b) => categoryLinesTotal(b, linesMap) - categoryLinesTotal(a, linesMap)
    );
    return sorted.map((cat) => ({
      ...cat,
      repos: [...cat.repos].sort(
        (a, b) => repoLinesTotal(b, linesMap) - repoLinesTotal(a, linesMap)
      ),
    }));
  }, [data.categories, linesMap]);

  return (
    <div className="flex flex-col gap-[20px]">
      <span className="text-[11px] font-[700] text-[#0078FF] uppercase tracking-[0.05em]">
        Ecosystem Landscape
      </span>

      <SummaryPills
        totalRepos={data.totalRepos}
        totalCategories={sortedCategories.length}
      />

      <div className="flex flex-col gap-[8px]">
        <CategoryLegend categories={sortedCategories} />
        <ActivityLegend />
      </div>

      <div className="grid grid-cols-1 [@media(min-width:700px)]:grid-cols-2 gap-[20px]">
        {sortedCategories.map((cat) => (
          <CategoryCard key={cat.name} category={cat} linesMap={linesMap} />
        ))}
      </div>
    </div>
  );
}
