"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RepoCardData } from "./types";

export default function MinorReposSection({
  repos,
}: {
  repos: RepoCardData[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (repos.length === 0) return null;

  return (
    <div className="rounded-[12px] border border-[#EDEDF0] bg-[#fafafa] overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="minor-repos-panel"
        className="w-full flex items-center justify-between px-[20px] py-[14px]
          hover:bg-[#f0f0f0] transition-colors duration-150 text-left cursor-pointer"
      >
        <span className="text-[14px] text-[#808992]">
          <span className="font-[600] text-[#1C1C1C]">{repos.length}</span>{" "}
          repositories with minor changes
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          className={`text-[#808992] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="minor-repos-panel"
            role="region"
            aria-label="Repositories with minor changes"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#EDEDF0]">
              {repos.map((repo) => (
                <div
                  key={repo.repoName}
                  className="flex items-center justify-between px-[20px] py-[10px]
                    border-b border-[#f0f0f0] last:border-b-0 text-[13px]"
                >
                  <span className="text-[#444] truncate mr-[12px]">
                    {repo.repoName}
                  </span>
                  <div className="flex items-center gap-[12px] flex-shrink-0 text-[#808992]">
                    <span>{repo.stats.commits} commits</span>
                    <span>net {repo.stats.netLines}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
