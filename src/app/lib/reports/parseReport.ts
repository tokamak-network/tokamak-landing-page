import fs from "fs";
import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import type {
  ReportStats,
  ReportSummary,
  ReportDetail,
  ReportMeta,
  RepoCardData,
  Contributor,
} from "@/app/components/ui/sections/reports/types";
import { DEFAULT_STATS } from "./constants";
import { parseNum } from "@/app/lib/utils/format";

// ── URL sanitization ──

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.href;
    }
    return "";
  } catch {
    return "";
  }
}

// ── Utilities ──

function formatWithCommas(n: number, prefix: string): string {
  return `${prefix}${n.toLocaleString("en-US")}`;
}

function aggregateRepoLines(
  repos: RepoCardData[]
): { linesAdded: string; linesDeleted: string } {
  let totalAdded = 0;
  let totalDeleted = 0;

  for (const repo of repos) {
    totalAdded += Math.abs(parseNum(repo.stats.linesAdded));
    totalDeleted += Math.abs(parseNum(repo.stats.linesDeleted));
  }

  return {
    linesAdded: formatWithCommas(totalAdded, "+"),
    linesDeleted: formatWithCommas(totalDeleted, "-"),
  };
}

// ── Section extraction ──

export function extractBetweenComments(
  html: string,
  startMarker: string,
  endMarker: string
): string {
  const startIdx = html.indexOf(`<!-- ${startMarker} -->`);
  const endIdx = html.indexOf(`<!-- ${endMarker} -->`);

  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return "";

  const afterStart = startIdx + `<!-- ${startMarker} -->`.length;
  return html.slice(afterStart, endIdx).trim();
}

interface ExtractedSections {
  stats: string;
  summary: string;
  cards: string;
  missing: string[];
}

function extractSections(html: string): ExtractedSections {
  const missing: string[] = [];

  const stats = extractBetweenComments(html, "STATS BAR", "BODY");
  if (!stats) missing.push("STATS BAR");

  const summary = extractBetweenComments(
    html,
    "EXECUTIVE SUMMARY",
    "REPO CARDS"
  );
  if (!summary) missing.push("EXECUTIVE SUMMARY");

  const cards = extractBetweenComments(html, "REPO CARDS", "FOOTER");
  if (!cards) missing.push("REPO CARDS");

  return { stats, summary, cards, missing };
}

// ── Stats parsing ──

function findStatValue(
  $: cheerio.CheerioAPI,
  container: cheerio.Cheerio<AnyNode>,
  labels: Record<string, string>
): Record<string, string> {
  const entries: Record<string, string> = {};

  container.find("div").each((_: number, el: AnyNode) => {
    const children = $(el).children("div");
    if (children.length < 2) return;

    // Only process leaf-level stat containers (children should not contain nested divs)
    const firstChild = $(children[0]);
    const lastChild = $(children[children.length - 1]);
    if (firstChild.find("div").length > 0 || lastChild.find("div").length > 0)
      return;

    const value = firstChild.text().trim();
    const label = lastChild.text().trim().toLowerCase();

    for (const [key, field] of Object.entries(labels)) {
      if (label.includes(key) && !entries[field]) {
        entries[field] = value;
        break;
      }
    }
  });

  return entries;
}

const STAT_LABELS: Record<string, keyof ReportStats> = {
  commits: "commits",
  "lines changed": "linesChanged",
  "active repos": "activeRepos",
  "active repositories": "activeRepos",
  contributors: "contributors",
  "net growth": "netGrowth",
  "net change": "netGrowth",
};

function parseStatsFragment(fragment: string): ReportStats {
  const $ = cheerio.load(fragment);
  const entries = findStatValue($, $.root(), STAT_LABELS);
  return { ...DEFAULT_STATS, ...entries };
}

/** Public API — extracts section from full HTML then parses. Used by tests. */
export function parseStats(html: string): ReportStats {
  const fragment = extractBetweenComments(html, "STATS BAR", "BODY");
  if (!fragment) return { ...DEFAULT_STATS };
  return parseStatsFragment(fragment);
}

// ── Executive Summary parsing ──

interface SummaryResult {
  headline: string;
  narrative: string;
}

function parseSummaryFragment(fragment: string): SummaryResult {
  const $ = cheerio.load(fragment);

  const headline: string =
    $("h3").first().text().trim() ||
    $("p[style*='font-weight:bold']").first().text().trim() ||
    $("p").first().text().trim();

  const narrative: string = $("p")
    .toArray()
    .map((p) => $(p).text().trim())
    .filter(Boolean)
    .join("\n\n");

  return { headline, narrative };
}

// ── Repo Card parsing ──

function extractRepoStats(
  card: cheerio.Cheerio<AnyNode>,
  $: cheerio.CheerioAPI
): RepoCardData["stats"] {
  const defaults = {
    commits: "0",
    contributors: "0",
    linesAdded: "0",
    linesDeleted: "0",
    netLines: "0",
  };

  const labels: Record<string, string> = {
    commits: "commits",
    contributors: "contributors",
    "lines added": "linesAdded",
    "lines deleted": "linesDeleted",
    "net change": "netLines",
    "net lines": "netLines",
  };

  const entries = findStatValue($, card, labels);
  return { ...defaults, ...entries };
}

function extractAccomplishments(
  sections: Record<string, cheerio.Cheerio<AnyNode>>,
  $: cheerio.CheerioAPI
): string[] {
  const h4 = sections["key accomplishments"];
  if (!h4) return [];

  return h4
    .next("ul")
    .find("li")
    .toArray()
    .map((li) => $(li).text().trim());
}

function extractContributors(
  card: cheerio.Cheerio<AnyNode>,
  $: cheerio.CheerioAPI
): Contributor[] {
  const contributorDiv = card
    .find("div")
    .filter((_: number, el: AnyNode) =>
      $(el).find("strong").text().includes("Top Contributors")
    )
    .first();

  if (!contributorDiv.length) return [];

  return contributorDiv
    .find("a")
    .toArray()
    .map((a) => ({
      name: $(a).text().trim(),
      profileUrl: sanitizeUrl($(a).attr("href") || ""),
    }))
    .filter((c) => c.name.length > 0);
}

function findGithubUrl(
  div: cheerio.Cheerio<AnyNode>,
  $: cheerio.CheerioAPI
): string {
  const link = div
    .find("a")
    .toArray()
    .find((a) => {
      const href = $(a).attr("href") || "";
      const text = $(a).text().trim();
      return text.includes("GitHub") || href.includes("github.com");
    });

  return link ? sanitizeUrl($(link).attr("href") || "") : "";
}

function buildCardFromDiv(
  div: cheerio.Cheerio<AnyNode>,
  $: cheerio.CheerioAPI
): RepoCardData | null {
  const repoName: string = div.find("h3").first().text().trim();
  if (!repoName) return null;

  const githubUrl = findGithubUrl(div, $);
  const description: string = div.find("p").first().text().trim();
  const repoStats = extractRepoStats(div, $);

  const sections: Record<string, cheerio.Cheerio<AnyNode>> = {};
  div.find("h4").each((_i: number, h4: AnyNode) => {
    const title: string = $(h4).text().trim().toLowerCase();
    sections[title] = $(h4);
  });

  return {
    repoName,
    githubUrl,
    description,
    stats: repoStats,
    accomplishments: extractAccomplishments(sections, $),
    codeAnalysis: sections["code analysis"]
      ? sections["code analysis"].next("p").text().trim()
      : "",
    nextSteps: sections["next steps"]
      ? sections["next steps"].next("p").text().trim()
      : "",
    topContributors: extractContributors(div, $),
  };
}

function parseCardsFragment(fragment: string): RepoCardData[] {
  const $ = cheerio.load(fragment);
  const cards: RepoCardData[] = [];

  // Find repo cards by structural marker: top-level divs that contain an <h3>
  $.root()
    .children("div")
    .each((_: number, el: AnyNode) => {
      const div = $(el);
      if (!div.find("h3").length) return;

      const card = buildCardFromDiv(div, $);
      if (card) cards.push(card);
    });

  // Fallback: if root children didn't work, try nested divs with <h3> + <h4>
  if (cards.length === 0) {
    $("div")
      .filter((_: number, el: AnyNode) => {
        const d = $(el);
        return d.find("h3").length > 0 && d.find("h4").length > 0;
      })
      .each((_: number, el: AnyNode) => {
        const card = buildCardFromDiv($(el), $);
        if (!card || cards.some((c) => c.repoName === card.repoName)) return;
        cards.push(card);
      });
  }

  return cards;
}

/** Public API — extracts section from full HTML then parses. Used by tests. */
export function parseRepoCards(html: string): RepoCardData[] {
  const fragment = extractBetweenComments(html, "REPO CARDS", "FOOTER");
  if (!fragment) return [];
  return parseCardsFragment(fragment);
}

// ── Top-level report parsers ──

function warnMissingMarkers(slug: string, missing: string[]): void {
  if (missing.length > 0) {
    console.warn(
      `[reports] ${slug}: missing HTML markers: ${missing.join(", ")}. ` +
        "Check that the report HTML contains <!-- STATS BAR -->, " +
        "<!-- EXECUTIVE SUMMARY -->, <!-- REPO CARDS -->, and <!-- FOOTER --> comments."
    );
  }
}

export function parseReportSummary(
  filePath: string,
  meta: ReportMeta
): ReportSummary {
  try {
    const html = fs.readFileSync(filePath, "utf-8");
    const { stats: statsFragment, summary: summaryFragment, missing } =
      extractSections(html);

    warnMissingMarkers(meta.slug, missing);

    const stats = statsFragment
      ? parseStatsFragment(statsFragment)
      : { ...DEFAULT_STATS };

    const headline = summaryFragment
      ? parseSummaryFragment(summaryFragment).headline
      : "";

    return { ...meta, stats, executiveHeadline: headline };
  } catch (error) {
    console.warn(`[reports] Failed to parse summary for ${meta.slug}:`, error);
    return { ...meta, stats: { ...DEFAULT_STATS }, executiveHeadline: "" };
  }
}

export function parseReportDetail(
  filePath: string,
  meta: ReportMeta
): ReportDetail {
  try {
    const html = fs.readFileSync(filePath, "utf-8");
    const {
      stats: statsFragment,
      summary: summaryFragment,
      cards: cardsFragment,
      missing,
    } = extractSections(html);

    warnMissingMarkers(meta.slug, missing);

    const stats = statsFragment
      ? parseStatsFragment(statsFragment)
      : { ...DEFAULT_STATS };

    const { headline, narrative } = summaryFragment
      ? parseSummaryFragment(summaryFragment)
      : { headline: "", narrative: "" };

    const repos = cardsFragment ? parseCardsFragment(cardsFragment) : [];

    const enrichedStats =
      repos.length > 0
        ? { ...stats, ...aggregateRepoLines(repos) }
        : stats;

    return {
      ...meta,
      stats: enrichedStats,
      executiveHeadline: headline,
      executiveNarrative: narrative,
      repos,
    };
  } catch (error) {
    console.warn(`[reports] Failed to parse detail for ${meta.slug}:`, error);
    return {
      ...meta,
      stats: { ...DEFAULT_STATS },
      executiveHeadline: "",
      executiveNarrative: "",
      repos: [],
    };
  }
}
