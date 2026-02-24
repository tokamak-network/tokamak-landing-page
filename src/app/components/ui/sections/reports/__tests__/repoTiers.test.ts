import { describe, it, expect } from "vitest";
import { scoreRepo, tierRepos } from "../repoTiers";
import type { RepoCardData, RepoCategoryInfo } from "../types";

function makeRepo(
  name: string,
  commits: string,
  linesAdded: string,
  linesDeleted: string,
  netLines: string
): RepoCardData {
  return {
    repoName: name,
    githubUrl: `https://github.com/tokamak-network/${name}`,
    description: "",
    stats: { commits, contributors: "1", linesAdded, linesDeleted, netLines },
    accomplishments: [],
    codeAnalysis: "",
    nextSteps: "",
    topContributors: [],
  };
}

describe("scoreRepo", () => {
  it("calculates score as commits*2 + |added| + |deleted|", () => {
    const repo = makeRepo("test", "10", "+500", "-200", "+300");
    expect(scoreRepo(repo)).toBe(10 * 2 + 500 + 200);
  });

  it("handles zero values", () => {
    const repo = makeRepo("test", "0", "0", "0", "0");
    expect(scoreRepo(repo)).toBe(0);
  });

  it("handles formatted numbers with commas", () => {
    const repo = makeRepo("test", "1,000", "+50,000", "-10,000", "+40,000");
    expect(scoreRepo(repo)).toBe(1000 * 2 + 50000 + 10000);
  });
});

describe("tierRepos", () => {
  it("returns empty tiers for empty input", () => {
    const result = tierRepos([]);
    expect(result.highlights).toHaveLength(0);
    expect(result.categories).toHaveLength(0);
    expect(result.minor).toHaveLength(0);
  });

  it("puts top 7 repos by score into highlights", () => {
    const repos = Array.from({ length: 10 }, (_, i) =>
      makeRepo(`repo-${i}`, `${(i + 1) * 10}`, `+${(i + 1) * 100}`, `-${(i + 1) * 50}`, `+${(i + 1) * 50}`)
    );
    const result = tierRepos(repos);
    expect(result.highlights).toHaveLength(7);
    // Highest scored should be first
    expect(result.highlights[0].repoName).toBe("repo-9");
  });

  it("separates minor repos (<=3 commits AND |net| <= 100)", () => {
    const repos = [
      // 7 high-activity repos to fill highlights
      ...Array.from({ length: 7 }, (_, i) =>
        makeRepo(`big-repo-${i}`, "100", "+10000", "-5000", "+5000")
      ),
      // Medium repo — not minor
      makeRepo("medium-repo", "20", "+500", "-200", "+300"),
      // Minor repos
      makeRepo("tiny-repo-1", "2", "+10", "-5", "+5"),
      makeRepo("tiny-repo-2", "1", "+3", "-1", "+2"),
      makeRepo("some-commits-but-tiny-net", "3", "+50", "-0", "+50"),
    ];
    const result = tierRepos(repos);
    const minorNames = result.minor.map((r) => r.repoName);
    expect(minorNames).toContain("tiny-repo-1");
    expect(minorNames).toContain("tiny-repo-2");
    expect(minorNames).toContain("some-commits-but-tiny-net");
    expect(minorNames).not.toContain("medium-repo");
  });

  it("does not put highlight repos into minor even if small", () => {
    // With only 3 repos, all go to highlights (< 7)
    const repos = [
      makeRepo("only-one", "1", "+5", "-2", "+3"),
      makeRepo("only-two", "2", "+10", "-3", "+7"),
      makeRepo("only-three", "3", "+20", "-5", "+15"),
    ];
    const result = tierRepos(repos);
    expect(result.highlights).toHaveLength(3);
    expect(result.minor).toHaveLength(0);
    expect(result.categories).toHaveLength(0);
  });

  it("groups mid-tier repos into flat list without categoryMap", () => {
    const repos = [
      // 7 high-activity repos for highlights
      ...Array.from({ length: 7 }, (_, i) =>
        makeRepo(`highlight-${i}`, "100", "+10000", "-5000", "+5000")
      ),
      // Significant repos (not minor)
      makeRepo("repo-a", "20", "+500", "-200", "+300"),
      makeRepo("repo-b", "15", "+300", "-100", "+200"),
    ];
    const result = tierRepos(repos);
    expect(result.highlights).toHaveLength(7);
    expect(result.categories).toHaveLength(1);
    expect(result.categories[0].label).toBe("Repositories");
    expect(result.categories[0].color).toBe("");
    expect(result.categories[0].icon).toBe("");
    expect(result.categories[0].repos).toHaveLength(2);
  });

  it("groups mid-tier repos by landscape categories when categoryMap provided", () => {
    const categoryMap = new Map<string, RepoCategoryInfo>([
      ["infra-repo", { label: "Infrastructure", color: "#E11D48", icon: "⚙️" }],
      ["defi-repo", { label: "DeFi & Staking", color: "#7C3AED", icon: "💰" }],
      ["another-infra", { label: "Infrastructure", color: "#E11D48", icon: "⚙️" }],
    ]);

    const repos = [
      // 7 highlights
      ...Array.from({ length: 7 }, (_, i) =>
        makeRepo(`highlight-${i}`, "100", "+10000", "-5000", "+5000")
      ),
      // Categorized repos
      makeRepo("infra-repo", "20", "+500", "-200", "+300"),
      makeRepo("defi-repo", "15", "+300", "-100", "+200"),
      makeRepo("another-infra", "10", "+200", "-50", "+150"),
      // Unmatched repo → "Other"
      makeRepo("unknown-repo", "12", "+250", "-80", "+170"),
    ];
    const result = tierRepos(repos, categoryMap);
    expect(result.highlights).toHaveLength(7);

    const labels = result.categories.map((c) => c.label);
    expect(labels).toContain("Infrastructure");
    expect(labels).toContain("DeFi & Staking");
    expect(labels).toContain("Other");

    const infraGroup = result.categories.find((c) => c.label === "Infrastructure")!;
    expect(infraGroup.color).toBe("#E11D48");
    expect(infraGroup.icon).toBe("⚙️");
    expect(infraGroup.repos).toHaveLength(2);

    const otherGroup = result.categories.find((c) => c.label === "Other")!;
    expect(otherGroup.color).toBe("#888");
    expect(otherGroup.repos).toHaveLength(1);
  });
});
