"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
    <div className="border border-[#434347] bg-surface overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="minor-repos-panel"
        className="w-full flex items-center justify-between px-[20px] py-[14px]
          hover:bg-surface-light transition-colors duration-150 text-left cursor-pointer"
      >
        <span className="text-[14px] text-[#929298]">
          <span className="font-[600] text-white">{repos.length}</span>{" "}
          repositories with minor changes
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#929298] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
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
            <div className="border-t border-[#434347]">
              {repos.map((repo) => (
                <div
                  key={repo.repoName}
                  className="flex items-center justify-between px-[20px] py-[10px]
                    border-b border-[#2a2a2e] last:border-b-0 text-[13px]"
                >
                  <span className="text-[#c5c5ca] truncate mr-[12px]">
                    {repo.repoName}
                  </span>
                  <div className="flex items-center gap-[12px] flex-shrink-0 text-[#929298]">
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
