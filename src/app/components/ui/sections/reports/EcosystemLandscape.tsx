"use client";

import type {
  EcosystemLandscape as EcosystemLandscapeType,
  LandscapeCategory,
  LandscapeRepo,
} from "./types";

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
    { label: "Repositories", value: totalRepos },
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
            style={{ background: cat.color }}
          />
          {cat.name}
        </span>
      ))}
    </div>
  );
}

function ActivityLegend() {
  const levels = [
    { label: "High (20+)", color: ACTIVITY_COLORS.high },
    { label: "Medium (5-19)", color: ACTIVITY_COLORS.medium },
    { label: "Low (<5)", color: ACTIVITY_COLORS.low },
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

function RepoMiniCard({ repo }: { repo: LandscapeRepo }) {
  return (
    <a
      href={repo.githubUrl || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-[8px] px-[10px] py-[8px] rounded-[6px]
        hover:bg-[#f5f7fa] transition-colors duration-150 group"
      style={{ borderLeft: `3px solid ${repo.categoryColor}` }}
    >
      <span
        className="w-[7px] h-[7px] rounded-full mt-[5px] shrink-0"
        style={{ background: ACTIVITY_COLORS[repo.activity] }}
        title={`${repo.activity} activity`}
      />
      <div className="min-w-0">
        <span className="text-[13px] font-[600] text-[#1C1C1C] group-hover:text-[#0078FF] transition-colors truncate block">
          {repo.name}
        </span>
        {repo.description && (
          <span className="text-[11px] text-[#888] leading-[1.4] line-clamp-1 block">
            {repo.description}
          </span>
        )}
      </div>
    </a>
  );
}

function CategoryCard({ category }: { category: LandscapeCategory }) {
  return (
    <div className="bg-white border border-[#e8e8e8] rounded-[10px] overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center gap-[8px] px-[16px] py-[12px] border-b border-[#f0f0f0]"
        style={{ borderLeft: `4px solid ${category.color}` }}
      >
        <span className="text-[16px]">{category.icon}</span>
        <span className="text-[14px] font-[700] text-[#1C1C1C]">
          {category.name}
        </span>
        <span className="ml-auto text-[11px] text-[#888] font-[600] whitespace-nowrap">
          {category.repoCount} repos
        </span>
      </div>

      {/* Repo list */}
      <div className="flex flex-col py-[4px]">
        {category.repos.map((repo) => (
          <RepoMiniCard key={repo.name} repo={repo} />
        ))}
      </div>
    </div>
  );
}

export default function EcosystemLandscape({
  data,
}: {
  data: EcosystemLandscapeType;
}) {
  return (
    <div className="flex flex-col gap-[20px]">
      <span className="text-[11px] font-[700] text-[#0078FF] uppercase tracking-[0.05em]">
        Ecosystem Landscape
      </span>

      <SummaryPills
        totalRepos={data.totalRepos}
        totalCategories={data.totalCategories}
      />

      <div className="flex flex-col gap-[8px]">
        <CategoryLegend categories={data.categories} />
        <ActivityLegend />
      </div>

      <div className="grid grid-cols-1 [@media(min-width:700px)]:grid-cols-2 gap-[16px]">
        {data.categories.map((cat) => (
          <CategoryCard key={cat.name} category={cat} />
        ))}
      </div>
    </div>
  );
}
