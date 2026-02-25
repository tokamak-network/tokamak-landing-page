import type { RepoCardData } from "./types";
import { parseNum } from "@/app/lib/utils/format";

export interface RepoLines {
  added: number;
  deleted: number;
}

export function buildLinesMap(repos: RepoCardData[]): Map<string, RepoLines> {
  const map = new Map<string, RepoLines>();
  for (const r of repos) {
    map.set(r.repoName, {
      added: Math.abs(parseNum(r.stats.linesAdded)),
      deleted: Math.abs(parseNum(r.stats.linesDeleted)),
    });
  }
  return map;
}

export function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}
