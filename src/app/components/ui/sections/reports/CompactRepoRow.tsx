"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
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
          className="mt-[4px] text-[12px] text-[#929298] hover:text-[#0078FF]
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
        border border-[#434347] bg-surface
        hover:bg-surface-light hover:border-[#555]
        transition-colors duration-150 text-left cursor-pointer group"
    >
      <div className="flex items-center gap-[12px] min-w-0 flex-1">
        <span className="text-[14px] font-[500] text-white truncate group-hover:text-[#0078FF] transition-colors duration-150">
          {repo.repoName}
        </span>
        <div className="flex items-center gap-[8px] flex-shrink-0">
          <span className="text-[12px] text-[#00C853]">
            {repo.stats.linesAdded}
          </span>
          <span className="text-[12px] text-[#FF4444]">
            {repo.stats.linesDeleted}
          </span>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-[#434347] group-hover:text-[#0078FF] transition-colors duration-150 flex-shrink-0 ml-[8px]" />
    </button>
  );
}
