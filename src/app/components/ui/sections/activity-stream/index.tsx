import { fetchGitHubActivity, GitHubCommit } from "@/app/lib/github";
import { listReports, getReportPath } from "@/app/lib/reports/listReports";
import { parseReportDetail } from "@/app/lib/reports/parseReport";
import StreamClient from "./StreamClient";

export interface StreamItem {
  time: string;
  repoName: string;
  text: string;
  type: "feat" | "fix" | "refactor" | "test" | "docs" | "infra";
}

const TYPE_PATTERNS: [RegExp, StreamItem["type"]][] = [
  [/\bfix(ed|es|ing)?\b|\bbug\b|\bresolv/i, "fix"],
  [/\btest(s|ing|ed)?\b|\bcoverage\b|\bspec\b/i, "test"],
  [/\bdoc(s|umentation)?\b|\breadme\b|\bguide/i, "docs"],
  [/\brefactor(ed|ing)?\b|\bcleanup\b|\brestructur/i, "refactor"],
  [/\bdeploy\b|\binfra\b|\bci\b|\bpipeline\b|\bdocker\b|\bconfig/i, "infra"],
];

function inferType(text: string): StreamItem["type"] {
  for (const [pattern, type] of TYPE_PATTERNS) {
    if (pattern.test(text)) return type;
  }
  return "feat";
}

// ── Relative time label from ISO date ───────────────────────────────

function relativeDateLabel(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── GitHub commits → StreamItem[] ───────────────────────────────────

function commitsToStreamItems(commits: GitHubCommit[]): StreamItem[] {
  return commits.map((c) => ({
    time: relativeDateLabel(c.committedDate),
    repoName: c.repoName,
    text: c.message.split("\n")[0], // first line only
    type: inferType(c.message),
  }));
}

// ── Fallback: existing report-based data ────────────────────────────

function generateTimeLabel(index: number): string {
  const minutes = index * 12 + Math.floor(Math.random() * 10);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function getReportStreamData(): StreamItem[] {
  const metas = listReports();
  if (metas.length === 0) return [];

  const items: Omit<StreamItem, "time">[] = [];

  for (const meta of metas.slice(0, 2)) {
    const filePath = getReportPath(meta.slug);
    if (!filePath) continue;

    const detail = parseReportDetail(filePath, meta);
    for (const repo of detail.repos) {
      for (const accomplishment of repo.accomplishments) {
        items.push({
          repoName: repo.repoName,
          text: accomplishment,
          type: inferType(accomplishment),
        });
      }
    }
  }

  return items.slice(0, 30).map((item, i) => ({
    ...item,
    time: generateTimeLabel(i),
  }));
}

// ── Server component ────────────────────────────────────────────────

export default async function ActivityStream() {
  // Try GitHub API first, fall back to report data
  const commits = await fetchGitHubActivity().catch(() => null);

  const items =
    commits && commits.length > 0
      ? commitsToStreamItems(commits)
      : getReportStreamData();

  if (items.length === 0) return null;
  return <StreamClient items={items} />;
}
