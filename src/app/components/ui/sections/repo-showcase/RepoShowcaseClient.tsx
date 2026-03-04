"use client";

import { useEffect, useRef, useState } from "react";
import { Github, TrendingUp, TrendingDown } from "lucide-react";

export interface ShowcaseRepo {
  repoName: string;
  githubUrl: string;
  description: string;
  linesAdded: string;
  linesDeleted: string;
  netLines: string;
  category?: string;
  categoryColor?: string;
  accomplishments: string[];
}

interface RepoShowcaseClientProps {
  repos: ShowcaseRepo[];
  reportLabel: string;
  reportHref: string;
}

function RepoCard({
  repo,
  index,
  isVisible,
}: {
  readonly repo: ShowcaseRepo;
  readonly index: number;
  readonly isVisible: boolean;
}) {
  return (
    <a
      href={repo.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col p-8 card-charcoal"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* Header: name + category */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Github size={20} className="text-primary shrink-0" />
          <h3 className="text-[16px] font-[900] text-white uppercase tracking-[0.04em] group-hover:text-primary transition-colors duration-300">
            {repo.repoName}
          </h3>
        </div>
        {repo.category && (
          <span
            className="shrink-0 px-3 py-1 text-[10px] font-[700] uppercase tracking-[0.06em]"
            style={{
              backgroundColor: `${repo.categoryColor ?? "#0077FF"}20`,
              color: repo.categoryColor ?? "#0077FF",
            }}
          >
            {repo.category}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-[13px] text-[#929298] leading-relaxed mb-5 line-clamp-2">
        {repo.description}
      </p>

      {/* Stats row */}
      <div className="flex gap-6 mb-5">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={14} className="text-[#00C853]" />
          <span className="text-[13px] font-[700] text-[#00C853]">
            {repo.linesAdded}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingDown size={14} className="text-[#FF4444]" />
          <span className="text-[13px] font-[700] text-[#FF4444]">
            {repo.linesDeleted}
          </span>
        </div>
        <span className="text-[13px] font-[700] text-[#929298]">
          net {repo.netLines}
        </span>
      </div>

      {/* Top accomplishments */}
      {repo.accomplishments.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {repo.accomplishments.slice(0, 2).map((item) => (
            <li
              key={item}
              className="text-[12px] text-[#929298] leading-relaxed flex gap-2"
            >
              <span className="text-primary shrink-0">—</span>
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </a>
  );
}

export default function RepoShowcaseClient({
  repos,
  reportLabel,
  reportHref,
}: RepoShowcaseClientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (repos.length === 0) return null;

  return (
    <section className="relative z-10 w-full flex justify-center bg-surface px-6 py-[160px] [@media(max-width:700px)]:py-[80px]">
      <div ref={ref} className="w-full max-w-[1280px]">
        <h2 className="text-[12px] uppercase tracking-[0.08em] text-primary font-[700] mb-4 text-center">
          Notable Repositories
        </h2>
        <p
          className="text-[38px] md:text-[48px] [@media(max-width:700px)]:text-[28px] text-white font-[900] text-center mb-4 leading-tight tracking-[0.04em] uppercase transition-all duration-700"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          What&apos;s Being Built
        </p>
        <p className="text-[16px] text-[#929298] text-center mb-[80px] max-w-[600px] mx-auto">
          Most active projects from our latest biweekly report, ranked by code changes.
        </p>

        <div className="grid grid-cols-2 [@media(max-width:800px)]:grid-cols-1 gap-6">
          {repos.map((repo, i) => (
            <RepoCard key={repo.repoName} repo={repo} index={i} isVisible={isVisible} />
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={reportHref}
            className="text-[14px] text-primary hover:text-primary/80 font-[700] uppercase tracking-[0.04em] transition-colors duration-300"
          >
            See full report: {reportLabel} →
          </a>
        </div>
      </div>
    </section>
  );
}
