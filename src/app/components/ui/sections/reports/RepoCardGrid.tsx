"use client";

import { useState, useMemo } from "react";
import type { RepoCardData } from "./types";
import RepoCard from "./RepoCard";
import CompactRepoRow from "./CompactRepoRow";
import MinorReposSection from "./MinorReposSection";
import { sortRepos, SORT_OPTIONS } from "./sortRepos";
import type { SortKey } from "./sortRepos";
import { tierRepos } from "./repoTiers";
import type { CategoryGroup } from "./repoTiers";

function CategoryGroupSection({ group }: { group: CategoryGroup }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center gap-[8px]">
        <h3 className="text-[14px] font-[600] text-[#1C1C1C]">
          {group.label}
        </h3>
        <span className="text-[12px] text-[#808992]">
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

export default function RepoCardGrid({ repos }: { repos: RepoCardData[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("commits");

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
  const tiered = useMemo(() => tierRepos(repos), [repos]);

  return (
    <div className="flex flex-col gap-[16px]">
      {/* TOOLBAR */}
      <div className="flex items-center gap-[12px] [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:items-stretch">
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#808992"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-[12px] top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            aria-label="Search repositories"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-[36px] pr-[12px] py-[10px] text-[14px] rounded-[8px]
              border border-[#DEDEDE] bg-white text-[#1C1C1C]
              placeholder:text-[#808992]
              focus:outline-none focus:border-[#0078FF]
              transition-colors duration-200"
          />
        </div>

        {isSearching && (
          <select
            aria-label="Sort repositories"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="px-[12px] py-[10px] text-[14px] rounded-[8px]
              border border-[#DEDEDE] bg-white text-[#1C1C1C]
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
            <div className="text-center py-[40px] text-[#808992] text-[14px]">
              No repositories match your search.
            </div>
          ) : (
            <>
              <span className="text-[13px] text-[#808992]">
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
                <span className="text-[12px] text-[#808992]">
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
                  key={group.category}
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
