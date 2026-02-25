import type { RepoCardData } from "./types";
export { parseNum } from "@/app/lib/utils/format";
import { parseNum } from "@/app/lib/utils/format";

export type SortKey = "name" | "lines" | "contributors";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "lines", label: "Code Changes" },
  { key: "contributors", label: "Contributors" },
];

export function sortRepos(
  repos: RepoCardData[],
  sortKey: SortKey
): RepoCardData[] {
  return [...repos].sort((a, b) => {
    switch (sortKey) {
      case "name":
        return a.repoName.localeCompare(b.repoName);
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
