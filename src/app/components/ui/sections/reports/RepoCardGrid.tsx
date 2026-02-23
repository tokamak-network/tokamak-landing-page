"use client";

import { useState, useMemo } from "react";
import type { RepoCardData } from "./types";
import RepoCard from "./RepoCard";

type SortKey = "name" | "commits" | "lines" | "contributors";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "commits", label: "Commits" },
  { key: "lines", label: "Lines Changed" },
  { key: "contributors", label: "Contributors" },
];

function parseNum(s: string): number {
  return parseInt(s.replace(/[^0-9-]/g, ""), 10) || 0;
}

function sortRepos(repos: RepoCardData[], sortKey: SortKey): RepoCardData[] {
  return [...repos].sort((a, b) => {
    switch (sortKey) {
      case "name":
        return a.repoName.localeCompare(b.repoName);
      case "commits":
        return parseNum(b.stats.commits) - parseNum(a.stats.commits);
      case "lines":
        return (
          Math.abs(parseNum(b.stats.linesAdded)) +
          Math.abs(parseNum(b.stats.linesDeleted)) -
          (Math.abs(parseNum(a.stats.linesAdded)) +
            Math.abs(parseNum(a.stats.linesDeleted)))
        );
      case "contributors":
        return parseNum(b.stats.contributors) - parseNum(a.stats.contributors);
      default:
        return 0;
    }
  });
}

export default function RepoCardGrid({ repos }: { repos: RepoCardData[] }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("commits");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    const matching = query
      ? repos.filter((r) => r.repoName.toLowerCase().includes(query))
      : repos;
    return sortRepos(matching, sortKey);
  }, [repos, search, sortKey]);

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
      </div>

      {/* COUNT */}
      <span className="text-[13px] text-[#808992]">
        {filtered.length} of {repos.length} repositories
      </span>

      {/* CARDS */}
      <div className="flex flex-col gap-[12px]">
        {filtered.length === 0 ? (
          <div className="text-center py-[40px] text-[#808992] text-[14px]">
            No repositories match your search.
          </div>
        ) : (
          filtered.map((repo) => (
            <RepoCard key={repo.repoName} repo={repo} />
          ))
        )}
      </div>
    </div>
  );
}
