import { describe, it, expect } from "vitest";
import {
  scoreRepo,
  categorizeRepo,
  getCategoryLabel,
  tierRepos,
} from "../repoTiers";
import type { RepoCardData } from "../types";

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

describe("categorizeRepo", () => {
  it("categorizes infrastructure repos", () => {
    expect(categorizeRepo("tokamak-optimism-v2")).toBe("infrastructure");
    expect(categorizeRepo("thanos-bridge")).toBe("infrastructure");
    expect(categorizeRepo("tokamak-thanos")).toBe("infrastructure");
    expect(categorizeRepo("titan-chain")).toBe("infrastructure");
  });

  it("categorizes DeFi repos", () => {
    expect(categorizeRepo("ton-staking-v2")).toBe("defi");
    expect(categorizeRepo("delegate-staking-mvp")).toBe("defi");
    expect(categorizeRepo("vton-airdrop-simulator")).toBe("defi");
    expect(categorizeRepo("TON-total-supply")).toBe("defi");
  });

  it("categorizes AI & Security repos", () => {
    expect(categorizeRepo("SentinAI")).toBe("ai-security");
    expect(categorizeRepo("tokamak-ai-agent")).toBe("ai-security");
    expect(categorizeRepo("smart-contract-audit-tool")).toBe("ai-security");
    expect(categorizeRepo("Tokamak-AI-Layer")).toBe("ai-security");
    expect(categorizeRepo("agent-key-management")).toBe("ai-security");
    expect(categorizeRepo("ai-kits")).toBe("ai-security");
  });

  it("categorizes Frontend repos", () => {
    expect(categorizeRepo("tokamak-landing-page")).toBe("frontend");
    expect(categorizeRepo("trh-platform-ui")).toBe("frontend");
    expect(categorizeRepo("tokamak-app-hub")).toBe("frontend");
    expect(categorizeRepo("trh-platform-desktop")).toBe("frontend");
  });

  it("categorizes ZK & Privacy repos", () => {
    expect(categorizeRepo("zk-dex")).toBe("zk-privacy");
    expect(categorizeRepo("zk-mafia")).toBe("zk-privacy");
    expect(categorizeRepo("Commit-Reveal2")).toBe("zk-privacy");
    expect(categorizeRepo("secure-vote")).toBe("zk-privacy");
    expect(categorizeRepo("private-app-channel-manager")).toBe("zk-privacy");
  });

  it("categorizes Tooling repos", () => {
    expect(categorizeRepo("Ooo-report-generator")).toBe("tooling");
    expect(categorizeRepo("ai-setup-guide")).toBe("tooling");
    expect(categorizeRepo("google-meet-analyze")).toBe("tooling");
    expect(categorizeRepo("trh-sdk")).toBe("tooling");
  });

  it("returns other for unmatched names", () => {
    expect(categorizeRepo("Zodiac")).toBe("other");
    expect(categorizeRepo("tokamon")).toBe("other");
  });
});

describe("getCategoryLabel", () => {
  it("returns human-readable label", () => {
    expect(getCategoryLabel("infrastructure")).toBe("Infrastructure");
    expect(getCategoryLabel("defi")).toBe("DeFi & Staking");
    expect(getCategoryLabel("ai-security")).toBe("AI & Security");
    expect(getCategoryLabel("frontend")).toBe("Frontend & UI");
    expect(getCategoryLabel("zk-privacy")).toBe("ZK & Privacy");
    expect(getCategoryLabel("tooling")).toBe("Tooling & Ops");
    expect(getCategoryLabel("other")).toBe("Other");
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

  it("groups remaining significant repos by category", () => {
    const repos = [
      // 7 high-activity repos for highlights
      ...Array.from({ length: 7 }, (_, i) =>
        makeRepo(`highlight-${i}`, "100", "+10000", "-5000", "+5000")
      ),
      // Category repos
      makeRepo("tokamak-optimism-v2", "20", "+500", "-200", "+300"),
      makeRepo("ton-staking-v2", "15", "+300", "-100", "+200"),
      makeRepo("zk-dex", "10", "+200", "-50", "+150"),
    ];
    const result = tierRepos(repos);
    expect(result.highlights).toHaveLength(7);
    const categoryNames = result.categories.map((c) => c.category);
    expect(categoryNames).toContain("infrastructure");
    expect(categoryNames).toContain("defi");
    expect(categoryNames).toContain("zk-privacy");
  });

  it("orders categories in consistent order", () => {
    const repos = [
      ...Array.from({ length: 7 }, (_, i) =>
        makeRepo(`highlight-${i}`, "100", "+10000", "-5000", "+5000")
      ),
      makeRepo("zk-dex", "10", "+200", "-50", "+150"),
      makeRepo("tokamak-optimism-v2", "20", "+500", "-200", "+300"),
      makeRepo("tokamak-landing-page", "8", "+100", "-30", "+70"),
    ];
    const result = tierRepos(repos);
    const categoryNames = result.categories.map((c) => c.category);
    // Infrastructure should come before zk-privacy, which comes before frontend
    const infraIdx = categoryNames.indexOf("infrastructure");
    const zkIdx = categoryNames.indexOf("zk-privacy");
    const frontIdx = categoryNames.indexOf("frontend");
    expect(infraIdx).toBeLessThan(zkIdx);
    expect(zkIdx).toBeLessThan(frontIdx);
  });
});
