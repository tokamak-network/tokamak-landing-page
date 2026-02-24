import type { RepoCardData } from "./types";
import { parseNum } from "./sortRepos";

// ── Scoring ──

export function scoreRepo(repo: RepoCardData): number {
  const commits = parseNum(repo.stats.commits);
  const added = Math.abs(parseNum(repo.stats.linesAdded));
  const deleted = Math.abs(parseNum(repo.stats.linesDeleted));
  return commits * 2 + added + deleted;
}

// ── Categorization ──

export type RepoCategory =
  | "infrastructure"
  | "defi"
  | "ai-security"
  | "frontend"
  | "zk-privacy"
  | "tooling"
  | "other";

const CATEGORY_META: Record<RepoCategory, string> = {
  infrastructure: "Infrastructure",
  defi: "DeFi & Staking",
  "ai-security": "AI & Security",
  frontend: "Frontend & UI",
  "zk-privacy": "ZK & Privacy",
  tooling: "Tooling & Ops",
  other: "Other",
};

const CATEGORY_PATTERNS: [RepoCategory, RegExp][] = [
  // Order matters: more specific patterns first, broad patterns last.
  // Use word-boundary-like patterns ([-/]|^|$) to avoid substring false positives.
  [
    "zk-privacy",
    /zk[-]|zero-knowledge|zkp|privacy|private|commit-reveal|voting|loot-box|mafia|secure-vote/i,
  ],
  [
    "infrastructure",
    /optimism|thanos|titan|(?:^|[-/])l2(?:$|[-/])|bridge|(?:^|[-/])chain(?:$|[-/])|rollup|data-layer|fraud-proof|dispute/i,
  ],
  ["defi", /staking|swap|defi|vault|lending|ton-|airdrop|supply/i],
  [
    "ai-security",
    /ai-agent|ai-layer|ai-kit|ai-token|ai-play|ai-team|sentinai|sentinel|audit|security|(?:^|[-/])agent(?:$|[-/])|learning/i,
  ],
  [
    "frontend",
    /landing|dashboard|website|(?:^|[-])ui(?:$|[-])|frontend|portal|app-hub|thumbnail|desktop/i,
  ],
  [
    "tooling",
    /tool|(?:^|[-/])cli(?:$|[-/])|(?:^|[-/])sdk(?:$|[-/])|(?:^|[-/])bot(?:$|[-/])|report|generator|setup-guide|playground|(?:^|[-/])hr(?:$|[-/])|crewcode|meet-analyze|nanobot/i,
  ],
];

export function categorizeRepo(repoName: string): RepoCategory {
  for (const [category, pattern] of CATEGORY_PATTERNS) {
    if (pattern.test(repoName)) return category;
  }
  return "other";
}

export function getCategoryLabel(category: RepoCategory): string {
  return CATEGORY_META[category];
}

// ── Category ordering (display order) ──

const CATEGORY_ORDER: RepoCategory[] = [
  "infrastructure",
  "ai-security",
  "defi",
  "zk-privacy",
  "frontend",
  "tooling",
  "other",
];

// ── Minor repo detection ──

const MINOR_MAX_COMMITS = 3;
const MINOR_MAX_NET_LINES = 100;

function isMinorRepo(repo: RepoCardData): boolean {
  const commits = parseNum(repo.stats.commits);
  const net = Math.abs(parseNum(repo.stats.netLines));
  return commits <= MINOR_MAX_COMMITS && net <= MINOR_MAX_NET_LINES;
}

// ── Tiering ──

export interface CategoryGroup {
  category: RepoCategory;
  label: string;
  repos: RepoCardData[];
}

export interface TieredRepos {
  highlights: RepoCardData[];
  categories: CategoryGroup[];
  minor: RepoCardData[];
}

const HIGHLIGHT_COUNT = 7;

export function tierRepos(repos: RepoCardData[]): TieredRepos {
  const scored = repos.map((repo) => ({ repo, score: scoreRepo(repo) }));
  scored.sort((a, b) => b.score - a.score);

  const highlights = scored.slice(0, HIGHLIGHT_COUNT).map((s) => s.repo);

  const remaining = scored
    .slice(HIGHLIGHT_COUNT)
    .map((s) => s.repo);

  const minor: RepoCardData[] = [];
  const significant: RepoCardData[] = [];

  for (const repo of remaining) {
    if (isMinorRepo(repo)) {
      minor.push(repo);
    } else {
      significant.push(repo);
    }
  }

  const grouped = new Map<RepoCategory, RepoCardData[]>();
  for (const repo of significant) {
    const cat = categorizeRepo(repo.repoName);
    const list = grouped.get(cat) ?? [];
    list.push(repo);
    grouped.set(cat, list);
  }

  const categories: CategoryGroup[] = CATEGORY_ORDER
    .filter((cat) => grouped.has(cat))
    .map((cat) => ({
      category: cat,
      label: getCategoryLabel(cat),
      repos: grouped.get(cat)!,
    }));

  return { highlights, categories, minor };
}
