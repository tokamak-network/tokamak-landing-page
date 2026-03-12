"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { RepoCardData, RepoCategoryInfo } from "./types";
import RepoCard from "./RepoCard";
import CompactRepoRow from "./CompactRepoRow";
import MinorReposSection from "./MinorReposSection";
import { sortRepos, SORT_OPTIONS } from "./sortRepos";
import type { SortKey } from "./sortRepos";
import { tierRepos } from "./repoTiers";
import type { CategoryGroup } from "./repoTiers";
import { sanitizeColor } from "@/app/lib/utils/format";

function CategoryGroupSection({ group }: { group: CategoryGroup }) {
  return (
    <div
      className="flex flex-col gap-[8px] pl-[12px]"
      style={group.color ? { borderLeft: `3px solid ${sanitizeColor(group.color)}` } : undefined}
    >
      <div className="flex items-center gap-[8px]">
        {group.icon && <span className="text-[16px]">{group.icon}</span>}
        <h3 className="text-[14px] font-[600] text-white">
          {group.label}
        </h3>
        <span className="text-[12px] text-[#929298]">
          {group.repos.length}
        </span>
      </div>
      <div className="flex flex-col gap-[6px]">
        {group.repos.map((repo) => (
          <CompactRepoRow key={repo.repoName} repo={repo} />
        ))}
      </div>
    </div>
  );
}

export default function RepoCardGrid({
  repos,
  categoryMap,
}: {
  repos: RepoCardData[];
  categoryMap?: Map<string, RepoCategoryInfo>;
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lines");

  const isSearching = search.trim().length > 0;

  // Flat filtered list for search mode
  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    const matching = query
      ? repos.filter((r) => r.repoName.toLowerCase().includes(query))
      : repos;
    return sortRepos(matching, sortKey);
  }, [repos, search, sortKey]);

  // Tiered view for non-search mode
  const tiered = useMemo(() => tierRepos(repos, categoryMap), [repos, categoryMap]);

  return (
    <div className="flex flex-col gap-[16px]">
      {/* TOOLBAR */}
      <div className="flex items-center gap-[12px] [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:items-stretch">
        <div className="relative flex-1">
          <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#929298]" />
          <input
            type="text"
            aria-label="Search repositories"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-[36px] pr-[12px] py-[10px] text-[14px]
              border border-[#434347] bg-surface text-white
              placeholder:text-[#929298]
              focus:outline-none focus:border-[#0078FF]
              transition-colors duration-200"
          />
        </div>

        {isSearching && (
          <select
            aria-label="Sort repositories"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="px-[12px] py-[10px] text-[14px]
              border border-[#434347] bg-surface text-white
              focus:outline-none focus:border-[#0078FF]
              transition-colors duration-200 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                Sort by {opt.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* SEARCH RESULTS (flat list) */}
      {isSearching && (
        <div className="flex flex-col gap-[12px]">
          {filtered.length === 0 ? (
            <div className="text-center py-[40px] text-[#929298] text-[14px]">
              No repositories match your search.
            </div>
          ) : (
            <>
              <span className="text-[13px] text-[#929298]">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
              {filtered.map((repo) => (
                <RepoCard key={repo.repoName} repo={repo} />
              ))}
            </>
          )}
        </div>
      )}

      {/* TIERED VIEW (default) */}
      {!isSearching && (
        <div className="flex flex-col gap-[32px]">
          {/* Highlights */}
          {tiered.highlights.length > 0 && (
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center gap-[8px]">
                <span className="text-[11px] font-[700] text-[#0078FF] uppercase tracking-[0.05em]">
                  Highlights
                </span>
                <span className="text-[12px] text-[#929298]">
                  Top {tiered.highlights.length} by activity
                </span>
              </div>
              <div className="flex flex-col gap-[12px]">
                {tiered.highlights.map((repo) => (
                  <RepoCard key={repo.repoName} repo={repo} />
                ))}
              </div>
            </div>
          )}

          {/* Category groups */}
          {tiered.categories.length > 0 && (
            <div className="flex flex-col gap-[24px]">
              {tiered.categories.map((group) => (
                <CategoryGroupSection
                  key={group.label}
                  group={group}
                />
              ))}
            </div>
          )}

          {/* Minor repos */}
          <MinorReposSection repos={tiered.minor} />
        </div>
      )}
    </div>
  );
}
