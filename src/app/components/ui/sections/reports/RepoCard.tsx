"use client";

import { useState } from "react";
import { Github, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { RepoCardData } from "./types";
import ContributorBadge from "./ContributorBadge";
import AdditionsBar from "./AdditionsBar";

function StatPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] bg-[#2a2a2e] text-[12px] text-[#c5c5ca]">
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
    <div className="bg-[#2a2a2e] p-[16px]">
      <h4 className="text-[13px] font-[600] text-white mb-[8px]">
        {title}
      </h4>
      {children}
    </div>
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
      className="border border-[#434347] bg-surface overflow-hidden"
    >
      {/* HEADER - always visible */}
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
        className="flex items-center justify-between p-[20px] [@media(max-width:640px)]:p-[16px]
          hover:bg-surface-light transition-colors duration-150 text-left cursor-pointer"
      >
        <div className="flex flex-col gap-[8px] min-w-0 flex-1">
          {/* Repo name + GitHub link */}
          <div className="flex items-center gap-[8px] flex-wrap">
            <span className="text-[16px] font-[600] text-white truncate">
              {repo.repoName}
            </span>
            {hasValidGithubUrl && (
              <a
                href={repo.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[#929298] hover:text-[#0078FF] transition-colors duration-200 flex-shrink-0"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Stat pills */}
          <div className="flex items-center gap-[6px] [@media(max-width:640px)]:gap-[4px] flex-wrap">
            <StatPill>
              <span className="text-[#00C853] font-[500]">{repo.stats.linesAdded}</span>
            </StatPill>
            <StatPill>
              <span className="text-[#FF4444] font-[500]">{repo.stats.linesDeleted}</span>
            </StatPill>
            <span className="text-[12px] text-[#c5c5ca]">
              net {repo.stats.netLines}
            </span>
            <span className="text-[12px] text-[#929298]">
              {repo.stats.contributors} contribs
            </span>
          </div>

          {/* Lines changed bar */}
          <AdditionsBar
            linesAdded={repo.stats.linesAdded}
            linesDeleted={repo.stats.linesDeleted}
            height={4}
            showLabel
            className="mt-[4px]"
          />
        </div>

        <ChevronDown
          className={`w-5 h-5 text-[#929298] flex-shrink-0 ml-[12px] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
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
            <div className="px-[20px] pb-[20px] [@media(max-width:640px)]:px-[16px] [@media(max-width:640px)]:pb-[16px] flex flex-col gap-[16px] border-t border-[#2a2a2e] pt-[16px]">
              {repo.description && (
                <p className="text-[14px] text-[#c5c5ca] leading-[1.6]">
                  {repo.description}
                </p>
              )}

              {repo.accomplishments.length > 0 && (
                <SubSection title="Key Accomplishments">
                  <ul className="flex flex-col gap-[6px]">
                    {repo.accomplishments.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-[8px] text-[13px] text-[#c5c5ca] leading-[1.6]"
                      >
                        <Check className="w-[14px] h-[14px] flex-shrink-0 mt-[2px] text-[#00C853]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </SubSection>
              )}

              {repo.codeAnalysis && (
                <SubSection title="Code Analysis">
                  <p className="text-[13px] text-[#c5c5ca] leading-[1.6]">
                    {repo.codeAnalysis}
                  </p>
                </SubSection>
              )}

              {repo.nextSteps && (
                <SubSection title="Next Steps">
                  <p className="text-[13px] text-[#c5c5ca] leading-[1.6]">
                    {repo.nextSteps}
                  </p>
                </SubSection>
              )}

              {repo.topContributors.length > 0 && (
                <div>
                  <h4 className="text-[13px] font-[600] text-white mb-[8px]">
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
