import { describe, it, expect } from "vitest";
import { parseNum, sortRepos } from "../sortRepos";
import type { RepoCardData } from "../types";

function makeRepo(overrides: Partial<RepoCardData> & { repoName: string }): RepoCardData {
  return {
    githubUrl: "",
    description: "",
    stats: {
      commits: "0",
      contributors: "0",
      linesAdded: "0",
      linesDeleted: "0",
      netLines: "0",
    },
    accomplishments: [],
    codeAnalysis: "",
    nextSteps: "",
    topContributors: [],
    ...overrides,
  };
}

describe("parseNum", () => {
  it("parses plain numbers", () => {
    expect(parseNum("223")).toBe(223);
  });

  it("parses numbers with commas", () => {
    expect(parseNum("2,161")).toBe(2161);
  });

  it("parses numbers with + prefix", () => {
    expect(parseNum("+92,357")).toBe(92357);
  });

  it("parses negative numbers", () => {
    expect(parseNum("-17,072")).toBe(-17072);
  });

  it("parses abbreviations like +4.9M as 49", () => {
    // parseInt strips after decimal, so "+4.9M" → "49" → 49
    expect(parseNum("+4.9M")).toBe(49);
  });

  it("returns 0 for empty string", () => {
    expect(parseNum("")).toBe(0);
  });

  it("returns 0 for non-numeric strings", () => {
    expect(parseNum("N/A")).toBe(0);
  });
});

describe("sortRepos", () => {
  const repos: RepoCardData[] = [
    makeRepo({
      repoName: "Bravo",
      stats: {
        commits: "100",
        contributors: "3",
        linesAdded: "+500",
        linesDeleted: "-200",
        netLines: "+300",
      },
    }),
    makeRepo({
      repoName: "Alpha",
      stats: {
        commits: "223",
        contributors: "1",
        linesAdded: "+92,357",
        linesDeleted: "-17,072",
        netLines: "+75,285",
      },
    }),
    makeRepo({
      repoName: "Charlie",
      stats: {
        commits: "50",
        contributors: "5",
        linesAdded: "+1,000",
        linesDeleted: "-800",
        netLines: "+200",
      },
    }),
  ];

  it("sorts by name alphabetically", () => {
    const sorted = sortRepos(repos, "name");
    expect(sorted.map((r) => r.repoName)).toEqual([
      "Alpha",
      "Bravo",
      "Charlie",
    ]);
  });

  it("sorts by commits descending", () => {
    const sorted = sortRepos(repos, "commits");
    expect(sorted.map((r) => r.repoName)).toEqual([
      "Alpha",
      "Bravo",
      "Charlie",
    ]);
  });

  it("sorts by lines changed descending (added + deleted)", () => {
    const sorted = sortRepos(repos, "lines");
    expect(sorted.map((r) => r.repoName)).toEqual([
      "Alpha",
      "Charlie",
      "Bravo",
    ]);
  });

  it("sorts by contributors descending", () => {
    const sorted = sortRepos(repos, "contributors");
    expect(sorted.map((r) => r.repoName)).toEqual([
      "Charlie",
      "Bravo",
      "Alpha",
    ]);
  });

  it("does not mutate original array", () => {
    const original = [...repos];
    sortRepos(repos, "name");
    expect(repos.map((r) => r.repoName)).toEqual(
      original.map((r) => r.repoName)
    );
  });

  it("handles empty array", () => {
    expect(sortRepos([], "name")).toEqual([]);
  });
});
