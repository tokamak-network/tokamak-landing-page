"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RepoCardData } from "./types";
import { parseNum } from "./sortRepos";
import ContributorBadge from "./ContributorBadge";

function LinesChangedBar({
  linesAdded,
  linesDeleted,
}: {
  linesAdded: string;
  linesDeleted: string;
}) {
  const added = Math.abs(parseNum(linesAdded));
  const deleted = Math.abs(parseNum(linesDeleted));
  const total = added + deleted;
  if (total === 0) return null;

  const addedPct = (added / total) * 100;

  return (
    <div className="flex items-center gap-[8px] mt-[4px]">
      <div className="flex-1 h-[4px] rounded-full overflow-hidden flex bg-[#e8e8e8]">
        <div
          className="h-full bg-[#28a745] rounded-l-full"
          style={{ width: `${addedPct}%` }}
        />
        <div
          className="h-full bg-[#cb2431] rounded-r-full"
          style={{ width: `${100 - addedPct}%` }}
        />
      </div>
      <span className="text-[11px] text-[#808992] flex-shrink-0">
        {Math.round(addedPct)}% additions
      </span>
    </div>
  );
}

function StatPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-[#f5f5f5] text-[12px] text-[#333]">
      {children}
    </span>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#f8f9fa] rounded-[8px] p-[16px]">
      <h4 className="text-[13px] font-[600] text-[#1C1C1C] mb-[8px]">
        {title}
      </h4>
      {children}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      className="flex-shrink-0 mt-[2px]"
    >
      <path
        d="M5 10L8.5 13.5L15 7"
        stroke="#28a745"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RepoCard({ repo }: { repo: RepoCardData }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `repo-detail-${repo.repoName.replace(/[^a-zA-Z0-9-]/g, "-")}`;
  const hasValidGithubUrl = repo.githubUrl.startsWith("https://");

  return (
    <div
      id={`repo-${repo.repoName}`}
      style={{ scrollMarginTop: "110px" }}
      className="rounded-[12px] border border-[#DEDEDE] bg-white overflow-hidden"
    >
      {/* HEADER - always visible */}
      <div className="flex items-center justify-between p-[20px] [@media(max-width:640px)]:p-[16px]
        hover:bg-[#fafafa] transition-colors duration-150">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }
          }}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex flex-col gap-[8px] min-w-0 flex-1 text-left cursor-pointer"
        >
          {/* Repo name + GitHub link */}
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

          {/* Stat pills */}
          <div className="flex items-center gap-[6px] [@media(max-width:640px)]:gap-[4px] flex-wrap">
            <StatPill>
              <span className="font-[500]">{repo.stats.commits}</span> commits
            </StatPill>
            <StatPill>
              <span className="font-[500]">{repo.stats.contributors}</span> contribs
            </StatPill>
            <StatPill>
              <span className="text-[#28a745] font-[500]">{repo.stats.linesAdded}</span>
            </StatPill>
            <StatPill>
              <span className="text-[#cb2431] font-[500]">{repo.stats.linesDeleted}</span>
            </StatPill>
            <span className="text-[12px] text-[#333]">
              net {repo.stats.netLines}
            </span>
          </div>

          {/* Lines changed bar */}
          <LinesChangedBar
            linesAdded={repo.stats.linesAdded}
            linesDeleted={repo.stats.linesDeleted}
          />
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
      </div>

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
                <SubSection title="Key Accomplishments">
                  <ul className="flex flex-col gap-[6px]">
                    {repo.accomplishments.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-[8px] text-[13px] text-[#444] leading-[1.6]"
                      >
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </SubSection>
              )}

              {repo.codeAnalysis && (
                <SubSection title="Code Analysis">
                  <p className="text-[13px] text-[#444] leading-[1.6]">
                    {repo.codeAnalysis}
                  </p>
                </SubSection>
              )}

              {repo.nextSteps && (
                <SubSection title="Next Steps">
                  <p className="text-[13px] text-[#444] leading-[1.6]">
                    {repo.nextSteps}
                  </p>
                </SubSection>
              )}

              {repo.topContributors.length > 0 && (
                <div>
                  <h4 className="text-[13px] font-[600] text-[#1C1C1C] mb-[8px]">
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
