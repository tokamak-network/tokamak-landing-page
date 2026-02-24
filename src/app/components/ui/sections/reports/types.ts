export interface ReportMeta {
  slug: string;
  year: number;
  month: number;
  startDay: number;
  endDay: number;
  dateLabel: string;
}

export interface ReportStats {
  commits: string;
  linesChanged: string;
  activeRepos: string;
  contributors: string;
  netGrowth: string;
  linesAdded?: string;
  linesDeleted?: string;
}

export interface ReportSummary extends ReportMeta {
  stats: ReportStats;
  executiveHeadline: string;
}

export interface Contributor {
  name: string;
  profileUrl: string;
}

export interface RepoCardData {
  repoName: string;
  githubUrl: string;
  description: string;
  stats: {
    commits: string;
    contributors: string;
    linesAdded: string;
    linesDeleted: string;
    netLines: string;
  };
  accomplishments: string[];
  codeAnalysis: string;
  nextSteps: string;
  topContributors: Contributor[];
}

export type ActivityLevel = "high" | "medium" | "low";

export interface LandscapeRepo {
  name: string;
  description: string;
  githubUrl: string;
  activity: ActivityLevel;
  categoryColor: string;
}

export interface LandscapeCategory {
  name: string;
  icon: string;
  color: string;
  repoCount: number;
  commitCount: number;
  repos: LandscapeRepo[];
}

export interface EcosystemLandscape {
  totalRepos: number;
  totalCommits: number;
  totalCategories: number;
  categories: LandscapeCategory[];
}

export interface CategoryFocusItem {
  name: string;
  icon: string;
  color: string;
  repoCount: number;
  commitCount: number;
  topRepos: { name: string; commits: number }[];
  focusNarrative: string;
  synergies: string[];
}

export interface ReportDetail extends ReportMeta {
  stats: ReportStats;
  executiveHeadline: string;
  executiveNarrative: string;
  repos: RepoCardData[];
  ecosystemLandscape?: EcosystemLandscape;
  categoryFocus?: CategoryFocusItem[];
}
