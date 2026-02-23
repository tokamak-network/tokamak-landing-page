"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RepoCardData } from "./types";
import ContributorBadge from "./ContributorBadge";

export default function RepoCard({ repo }: { repo: RepoCardData }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `repo-detail-${repo.repoName.replace(/[^a-zA-Z0-9-]/g, "-")}`;
  const hasValidGithubUrl = repo.githubUrl.startsWith("https://");

  return (
    <div className="rounded-[12px] border border-[#DEDEDE] bg-white overflow-hidden">
      {/* HEADER - always visible */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="w-full flex items-center justify-between p-[20px] [@media(max-width:640px)]:p-[16px]
          hover:bg-[#fafafa] transition-colors duration-150 text-left cursor-pointer"
      >
        <div className="flex flex-col gap-[8px] min-w-0 flex-1">
          <div className="flex items-center gap-[8px] flex-wrap">
            <span className="text-[16px] font-[600] text-[#1C1C1C] truncate">
              {repo.repoName}
            </span>
            {hasValidGithubUrl && (
              <a
                href={repo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#808992] hover:text-[#0078FF] transition-colors duration-200 flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-[12px] [@media(max-width:640px)]:gap-[8px] flex-wrap text-[12px]">
            <span className="text-[#333]">
              <span className="font-[500]">{repo.stats.commits}</span> commits
            </span>
            <span className="text-[#333]">
              <span className="font-[500]">{repo.stats.contributors}</span>{" "}
              contributors
            </span>
            <span className="text-[#28a745]">{repo.stats.linesAdded}</span>
            <span className="text-[#cb2431]">{repo.stats.linesDeleted}</span>
            <span className="text-[#333]">
              net {repo.stats.netLines}
            </span>
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={`text-[#808992] flex-shrink-0 ml-[12px] transition-transform duration-200 ${
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

      {/* BODY - expandable */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-label={`${repo.repoName} details`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-[20px] pb-[20px] [@media(max-width:640px)]:px-[16px] [@media(max-width:640px)]:pb-[16px] flex flex-col gap-[16px] border-t border-[#f0f0f0] pt-[16px]">
              {repo.description && (
                <p className="text-[14px] text-[#444] leading-[1.6]">
                  {repo.description}
                </p>
              )}

              {repo.accomplishments.length > 0 && (
                <div>
                  <h4 className="text-[14px] font-[600] text-[#1C1C1C] mb-[8px]">
                    Key Accomplishments
                  </h4>
                  <ul className="list-disc list-inside flex flex-col gap-[4px]">
                    {repo.accomplishments.map((item, i) => (
                      <li
                        key={i}
                        className="text-[13px] text-[#444] leading-[1.6]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {repo.codeAnalysis && (
                <div>
                  <h4 className="text-[14px] font-[600] text-[#1C1C1C] mb-[8px]">
                    Code Analysis
                  </h4>
                  <p className="text-[13px] text-[#444] leading-[1.6]">
                    {repo.codeAnalysis}
                  </p>
                </div>
              )}

              {repo.nextSteps && (
                <div>
                  <h4 className="text-[14px] font-[600] text-[#1C1C1C] mb-[8px]">
                    Next Steps
                  </h4>
                  <p className="text-[13px] text-[#444] leading-[1.6]">
                    {repo.nextSteps}
                  </p>
                </div>
              )}

              {repo.topContributors.length > 0 && (
                <div>
                  <h4 className="text-[14px] font-[600] text-[#1C1C1C] mb-[8px]">
                    Top Contributors
                  </h4>
                  <div className="flex flex-wrap gap-[8px]">
                    {repo.topContributors.map((c) => (
                      <ContributorBadge key={c.name} contributor={c} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
