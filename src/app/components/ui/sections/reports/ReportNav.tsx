"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RepoCardData } from "./types";

export default function ReportNav({ repos }: { repos: RepoCardData[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return query
      ? repos.filter((r) => r.repoName.toLowerCase().includes(query))
      : repos;
  }, [repos, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function scrollToRepo(repoName: string) {
    const el = document.getElementById(`repo-${repoName}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  }

  return (
    <div className="fixed bottom-[24px] right-[24px] z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-[56px] right-0 w-[280px] max-h-[400px]
              rounded-[12px] border border-[#DEDEDE] bg-white shadow-xl
              flex flex-col overflow-hidden"
          >
            {/* Search */}
            <div className="p-[12px] border-b border-[#f0f0f0]">
              <input
                type="text"
                aria-label="Search repositories in navigation"
                placeholder="Search repos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-[10px] py-[6px] text-[13px] rounded-[6px]
                  border border-[#DEDEDE] bg-[#f8f9fa] text-[#1C1C1C]
                  placeholder:text-[#808992]
                  focus:outline-none focus:border-[#0078FF]
                  transition-colors duration-200"
              />
            </div>

            {/* Repo list */}
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 ? (
                <div className="px-[12px] py-[16px] text-[13px] text-[#808992] text-center">
                  No repos found
                </div>
              ) : (
                filtered.map((repo) => (
                  <button
                    key={repo.repoName}
                    onClick={() => scrollToRepo(repo.repoName)}
                    className="w-full text-left px-[12px] py-[8px] text-[13px] text-[#333]
                      hover:bg-[#f5f5f5] transition-colors duration-100
                      truncate cursor-pointer"
                  >
                    {repo.repoName}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={`Navigate ${repos.length} repositories`}
        className="w-[48px] h-[48px] rounded-full bg-[#1C1C1C] text-white shadow-lg
          flex items-center justify-center
          hover:bg-[#333] transition-colors duration-200 cursor-pointer"
      >
        <span className="text-[13px] font-[600]">{repos.length}</span>
      </button>
    </div>
  );
}
