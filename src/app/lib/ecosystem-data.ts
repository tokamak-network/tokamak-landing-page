import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import { FALLBACK_REPORT } from "@/app/lib/reports/constants";

function parseNum(s: string | undefined): number {
  if (!s) return 0;
  return parseInt(s.replace(/,/g, ""), 10) || 0;
}

/** Fallback descriptions for repos with placeholder "{name} component" text */
const REPO_DESCRIPTIONS: Record<string, string> = {
  "toki": "Interactive onboarding arcade with staking experiences",
  "tako": "Next.js governance app for proposals and delegates",
  "tokamak-oracle-network": "Oracle contracts, agent, and dashboard with battle features",
  "oracle-battle": "SP1-based off-chain betting system with React frontend",
  "tokamak-rally": "Phaser.js rally racing game with Sepolia leaderboard",
  "tokamon-io": "Tokamon web property with site structure and assets",
  "ETH-RPG": "Ethereum wallet-linked RPG with PvP and achievements",
  "sheriff": "Security audit tool with deep audits and SAST integration",
  "skills": "Skill definitions catalog for CLI tools and agents",
  "agent-skills": "Tokamak Network agent skills package with showcase",
  "tokamak-agent-scan": "Agent discovery, registration, and on-chain listing",
  "tokamak-agent-commerce": "Proof-of-concept agent commerce with contracts",
  "ton-station": "Tokamak staking station architectural prototype",
  "TokamakStaking": "TON token staking smart contracts",
  "tokamak-thanos-stack": "Full-stack tooling for Thanos rollup deployment",
  "tokamak-rollup-metadata-repository": "Rollup metadata definitions for appchains",
  "ECO-documents": "ECO initiative architecture docs and references",
  "ECO-notion-migrator": "Utility to migrate Notion content to Obsidian",
  "Tokamak-zk-EVM-landing-page": "Landing page for Tokamak zk-EVM privacy features",
  "hr-automation-process": "HR team member management and compensation tracking",
  "hr-candidate-screening": "HR candidate evaluation and screening workflows",
  "biweekly-reporter": "Automated biweekly engineering report generator",
  "price-api": "Token price data API with handover documentation",
  "tokamak-cli": "Terminal UI for Tokamak Network tooling workflows",
  "perplexity-cli": "Perplexity API CLI with search integration",
  "grok-cli": "Grok API command-line interface tool",
  "twitterapi-cli": "Twitter API command-line tool for automation",
  "py-ethclient": "Python Ethereum client with RPC interaction",
  "ex-ethclient": "Elixir Ethereum client with core types and networking",
  "auto-research-forum": "Autonomous research forum with AI agent API layer",
  "ethrex": "Ethereum execution client implementation in Rust",
  "x402-ton": "HTTP 402 payment protocol integration for TON",
  "sigil-voting": "On-chain governance voting with signature proofs",
};

/** Strip placeholder descriptions like "{name} component" */
function resolveDescription(name: string, description: string): string {
  if (!description || description.toLowerCase().endsWith("component")) {
    return REPO_DESCRIPTIONS[name] ?? "";
  }
  return description;
}

const SHORT_NAMES: Record<string, string> = {
  "Platform & Services": "Platform",
  "Core Infrastructure": "Infra",
  "AI & Machine Learning": "AI / ML",
  "Privacy & ZK": "ZK",
  "Research & Education": "Lab",
  "Automation & Tooling": "Tool",
  "DeFi & Staking": "DeFi",
  "Gaming & Social": "Social",
  "Data & Analytics": "Analytics",
};

export interface EcosystemCategory {
  name: string;
  repoCount: number;
  repos: {
    name: string;
    description: string;
    githubUrl: string;
    activity: string;
    linesAdded: number;
    linesDeleted: number;
  }[];
}

export interface EcosystemData {
  categories: EcosystemCategory[];
  activeProjects: number;
  totalCategories: number;
  codeChanges: number;
  netGrowth: number;
}

export const FALLBACK_CATEGORIES: EcosystemCategory[] = [
  { name: "Platform", repoCount: 10, repos: [] },
  { name: "Infra", repoCount: 4, repos: [] },
  { name: "AI / ML", repoCount: 4, repos: [] },
  { name: "ZK", repoCount: 4, repos: [] },
  { name: "Lab", repoCount: 5, repos: [] },
  { name: "Tool", repoCount: 8, repos: [] },
  { name: "DeFi", repoCount: 5, repos: [] },
  { name: "Social", repoCount: 3, repos: [] },
  { name: "Governance", repoCount: 2, repos: [] },
  { name: "Analytics", repoCount: 3, repos: [] },
];

const FALLBACK_DATA: EcosystemData = {
  categories: FALLBACK_CATEGORIES,
  activeProjects: FALLBACK_CATEGORIES.reduce((sum, c) => sum + c.repoCount, 0),
  totalCategories: FALLBACK_CATEGORIES.length,
  codeChanges: parseNum(FALLBACK_REPORT.codeChanges),
  netGrowth: parseNum(FALLBACK_REPORT.netGrowth),
};

/** Merge latest 2 reports: combine categories, deduplicate repos by name */
export async function getEcosystemData(): Promise<EcosystemData> {
  try {
    const metas = listReports();
    if (metas.length === 0) throw new Error("No reports");

    // Parse up to 2 latest reports
    const details = metas.slice(0, 2).map((meta) => {
      const filePath = getReportPath(meta.slug);
      if (!filePath) return null;
      return parseReportDetail(filePath, meta);
    }).filter((d): d is NonNullable<typeof d> => d !== null);

    if (details.length === 0) throw new Error("No report files");

    // Merge categories from all reports, deduplicating repos by name
    const catMap = new Map<string, {
      repos: Map<string, EcosystemCategory["repos"][0]>;
    }>();

    for (const detail of details) {
      const cats = detail.ecosystemLandscape?.categories ?? [];
      for (const c of cats) {
        const shortName = SHORT_NAMES[c.name] ?? c.name;
        if (!catMap.has(shortName)) {
          catMap.set(shortName, { repos: new Map() });
        }
        const entry = catMap.get(shortName)!;
        for (const r of c.repos) {
          if (!entry.repos.has(r.name)) {
            entry.repos.set(r.name, {
              name: r.name,
              description: resolveDescription(r.name, r.description),
              githubUrl: r.githubUrl,
              activity: r.activity,
              linesAdded: r.linesAdded ?? 0,
              linesDeleted: r.linesDeleted ?? 0,
            });
          } else {
            // Repo exists in both reports — sum lines, keep higher activity
            const existing = entry.repos.get(r.name)!;
            existing.linesAdded += r.linesAdded ?? 0;
            existing.linesDeleted += r.linesDeleted ?? 0;
            // Keep the higher activity level
            const activityRank = { high: 3, medium: 2, low: 1 };
            const existRank = activityRank[existing.activity as keyof typeof activityRank] ?? 0;
            const newRank = activityRank[r.activity as keyof typeof activityRank] ?? 0;
            if (newRank > existRank) existing.activity = r.activity;
            // Update description/url if missing or placeholder
            const resolved = resolveDescription(r.name, r.description);
            if ((!existing.description || existing.description.toLowerCase().endsWith("component")) && resolved) {
              existing.description = resolved;
            }
            if (!existing.githubUrl && r.githubUrl) existing.githubUrl = r.githubUrl;
          }
        }
      }
    }

    const categories: EcosystemCategory[] = catMap.size > 0
      ? Array.from(catMap.entries()).map(([name, entry]) => ({
          name,
          repoCount: entry.repos.size,
          repos: Array.from(entry.repos.values()),
        }))
      : FALLBACK_CATEGORIES;

    const activeProjects = categories.reduce((sum, c) => sum + c.repoCount, 0);

    // Sum code changes across reports
    let totalCodeChanges = 0;
    let totalNetGrowth = 0;
    for (const detail of details) {
      totalCodeChanges += parseNum(detail.stats?.linesChanged);
      totalNetGrowth += parseNum(detail.stats?.netGrowth);
    }

    return {
      categories,
      activeProjects,
      totalCategories: categories.length,
      codeChanges: totalCodeChanges || parseNum(FALLBACK_REPORT.codeChanges),
      netGrowth: totalNetGrowth || parseNum(FALLBACK_REPORT.netGrowth),
    };
  } catch {
    return FALLBACK_DATA;
  }
}
