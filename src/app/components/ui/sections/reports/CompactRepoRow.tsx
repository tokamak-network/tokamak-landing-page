"use client";

import { useState } from "react";
import type { RepoCardData } from "./types";
import RepoCard from "./RepoCard";

export default function CompactRepoRow({ repo }: { repo: RepoCardData }) {
  const [expanded, setExpanded] = useState(false);

  if (expanded) {
    return (
      <div>
        <RepoCard repo={repo} />
        <button
          onClick={() => setExpanded(false)}
          className="mt-[4px] text-[12px] text-[#808992] hover:text-[#0078FF]
            transition-colors duration-150 cursor-pointer"
        >
          Collapse
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setExpanded(true)}
      className="w-full flex items-center justify-between px-[16px] py-[12px]
        rounded-[8px] border border-[#EDEDF0] bg-white
        hover:bg-[#fafafa] hover:border-[#d0d0d0]
        transition-colors duration-150 text-left cursor-pointer group"
    >
      <div className="flex items-center gap-[12px] min-w-0 flex-1">
        <span className="text-[14px] font-[500] text-[#1C1C1C] truncate group-hover:text-[#0078FF] transition-colors duration-150">
          {repo.repoName}
        </span>
        <div className="flex items-center gap-[8px] flex-shrink-0">
          <span className="text-[12px] text-[#808992]">
            {repo.stats.commits} commits
          </span>
          <span className="text-[12px] text-[#28a745]">
            {repo.stats.linesAdded}
          </span>
          <span className="text-[12px] text-[#cb2431]">
            {repo.stats.linesDeleted}
          </span>
        </div>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 20 20"
        fill="none"
        className="text-[#C4C4C4] group-hover:text-[#0078FF] transition-colors duration-150 flex-shrink-0 ml-[8px]"
      >
        <path
          d="M7.5 15L12.5 10L7.5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
