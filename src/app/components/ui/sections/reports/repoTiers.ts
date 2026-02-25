import type { RepoCardData, RepoCategoryInfo } from "./types";
import { parseNum } from "@/app/lib/utils/format";

// ── Scoring ──

export function scoreRepo(repo: RepoCardData): number {
  const added = Math.abs(parseNum(repo.stats.linesAdded));
  const deleted = Math.abs(parseNum(repo.stats.linesDeleted));
  return added + deleted;
}

// ── Minor repo detection ──

const MINOR_MAX_NET_LINES = 100;

function isMinorRepo(repo: RepoCardData): boolean {
  const net = Math.abs(parseNum(repo.stats.netLines));
  return net <= MINOR_MAX_NET_LINES;
}

// ── Tiering ──

export interface CategoryGroup {
  label: string;
  color: string;
  icon: string;
  repos: RepoCardData[];
}

export interface TieredRepos {
  highlights: RepoCardData[];
  categories: CategoryGroup[];
  minor: RepoCardData[];
}

export const HIGHLIGHT_COUNT = 7;

export function tierRepos(
  repos: RepoCardData[],
  categoryMap?: Map<string, RepoCategoryInfo>
): TieredRepos {
  const scored = repos.map((repo) => ({ repo, score: scoreRepo(repo) }));
  scored.sort((a, b) => b.score - a.score);

  const highlights = scored.slice(0, HIGHLIGHT_COUNT).map((s) => s.repo);

  const remaining = scored.slice(HIGHLIGHT_COUNT).map((s) => s.repo);

  const minor: RepoCardData[] = [];
  const significant: RepoCardData[] = [];

  for (const repo of remaining) {
    if (isMinorRepo(repo)) {
      minor.push(repo);
    } else {
      significant.push(repo);
    }
  }

  const categories: CategoryGroup[] = buildCategoryGroups(
    significant,
    categoryMap
  );

  return { highlights, categories, minor };
}

function buildCategoryGroups(
  repos: RepoCardData[],
  categoryMap?: Map<string, RepoCategoryInfo>
): CategoryGroup[] {
  if (!categoryMap || categoryMap.size === 0) {
    // Flat fallback for old reports without landscape data
    if (repos.length === 0) return [];
    return [{ label: "Repositories", color: "", icon: "", repos }];
  }

  const grouped = new Map<string, { info: RepoCategoryInfo; repos: RepoCardData[] }>();

  for (const repo of repos) {
    const info = categoryMap.get(repo.repoName) ?? {
      label: "Other",
      color: "#888",
      icon: "",
    };
    const existing = grouped.get(info.label);
    if (existing) {
      existing.repos.push(repo);
    } else {
      grouped.set(info.label, { info, repos: [repo] });
    }
  }

  const groups = Array.from(grouped.values()).map(({ info, repos: groupRepos }) => ({
    label: info.label,
    color: info.color,
    icon: info.icon,
    repos: groupRepos,
  }));

  const scored = groups.map((g) => ({
    group: g,
    total: g.repos.reduce((sum, r) => sum + scoreRepo(r), 0),
  }));
  scored.sort((a, b) => b.total - a.total);
  return scored.map((s) => s.group);
}
