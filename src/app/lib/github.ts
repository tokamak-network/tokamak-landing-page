import { unstable_cache } from "next/cache";

// ── Types ───────────────────────────────────────────────────────────

export interface GitHubCommit {
  repoName: string;
  repoUrl: string;
  message: string;
  committedDate: string;
  additions: number;
  deletions: number;
  authorName: string;
  authorLogin: string | null;
}

interface CommitNode {
  oid: string;
  message: string;
  committedDate: string;
  additions: number;
  deletions: number;
  author: {
    name: string;
    user: { login: string } | null;
  };
}

interface RepoNode {
  name: string;
  url: string;
  isArchived: boolean;
  defaultBranchRef: {
    target: {
      history: {
        nodes: CommitNode[];
      };
    };
  } | null;
}

interface GraphQLResponse {
  data: {
    organization: {
      repositories: {
        nodes: RepoNode[];
      };
    };
  };
  errors?: { message: string }[];
}

// ── GraphQL query ───────────────────────────────────────────────────

const REPOS_WITH_COMMITS_QUERY = `
  query($orgName: String!) {
    organization(login: $orgName) {
      repositories(first: 20, orderBy: {field: PUSHED_AT, direction: DESC}) {
        nodes {
          name
          url
          isArchived
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 5) {
                  nodes {
                    oid
                    message
                    committedDate
                    additions
                    deletions
                    author {
                      name
                      user { login }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ── Fetch logic ─────────────────────────────────────────────────────

async function fetchGitHubActivityRaw(): Promise<GitHubCommit[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("[github] GITHUB_TOKEN not set, skipping GitHub activity fetch");
    return [];
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: REPOS_WITH_COMMITS_QUERY,
      variables: { orgName: "tokamak-network" },
    }),
  });

  if (!res.ok) {
    console.error(`[github] GraphQL request failed: ${res.status}`);
    return [];
  }

  const json = (await res.json()) as GraphQLResponse;

  if (json.errors) {
    console.error("[github] GraphQL errors:", json.errors);
    return [];
  }

  const repos = json.data.organization.repositories.nodes;
  const commits: GitHubCommit[] = [];

  for (const repo of repos) {
    if (repo.isArchived) continue;
    if (!repo.defaultBranchRef?.target?.history?.nodes) continue;

    for (const c of repo.defaultBranchRef.target.history.nodes) {
      // Skip net-negative commits (more deletions than additions)
      if (c.deletions > c.additions) continue;

      commits.push({
        repoName: repo.name,
        repoUrl: repo.url,
        message: c.message,
        committedDate: c.committedDate,
        additions: c.additions,
        deletions: c.deletions,
        authorName: c.author.name,
        authorLogin: c.author.user?.login ?? null,
      });
    }
  }

  // Sort by date descending, take top 30
  commits.sort(
    (a, b) =>
      new Date(b.committedDate).getTime() - new Date(a.committedDate).getTime(),
  );

  return commits.slice(0, 30);
}

// ── Cached export (3-minute TTL) ────────────────────────────────────

export const fetchGitHubActivity = unstable_cache(
  fetchGitHubActivityRaw,
  ["github-activity"],
  { revalidate: 180 },
);
