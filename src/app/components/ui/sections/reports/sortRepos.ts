import type { RepoCardData } from "./types";

export type SortKey = "name" | "commits" | "lines" | "contributors";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "commits", label: "Commits" },
  { key: "lines", label: "Lines Changed" },
  { key: "contributors", label: "Contributors" },
];

export function parseNum(s: string): number {
  return parseInt(s.replace(/[^0-9-]/g, ""), 10) || 0;
}

export function sortRepos(
  repos: RepoCardData[],
  sortKey: SortKey
): RepoCardData[] {
  return [...repos].sort((a, b) => {
    switch (sortKey) {
      case "name":
        return a.repoName.localeCompare(b.repoName);
      case "commits":
        return parseNum(b.stats.commits) - parseNum(a.stats.commits);
      case "lines":
        return (
          Math.abs(parseNum(b.stats.linesAdded)) +
          Math.abs(parseNum(b.stats.linesDeleted)) -
          (Math.abs(parseNum(a.stats.linesAdded)) +
            Math.abs(parseNum(a.stats.linesDeleted)))
        );
      case "contributors":
        return parseNum(b.stats.contributors) - parseNum(a.stats.contributors);
      default:
        return 0;
    }
  });
}
