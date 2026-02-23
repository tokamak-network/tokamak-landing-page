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

export function parseStats(html: string): ReportStats {
  const statsHtml = extractBetweenComments(html, "STATS BAR", "BODY");
  if (!statsHtml) return { ...DEFAULT_STATS };

  const $ = cheerio.load(statsHtml);

  const labels: Record<string, keyof ReportStats> = {
    commits: "commits",
    "lines changed": "linesChanged",
    "active repos": "activeRepos",
    "active repositories": "activeRepos",
    contributors: "contributors",
    "net growth": "netGrowth",
    "net change": "netGrowth",
  };

  const entries = findStatValue($, $.root(), labels);
  return { ...DEFAULT_STATS, ...entries };
}

function parseExecutiveSummary(html: string): {
  headline: string;
  narrative: string;
} {
  const summaryHtml = extractBetweenComments(
    html,
    "EXECUTIVE SUMMARY",
    "REPO CARDS"
  );
  if (!summaryHtml) return { headline: "", narrative: "" };

  const $ = cheerio.load(summaryHtml);

  const headline: string =
    $("h3").first().text().trim() ||
    $("p[style*='font-weight:bold']").first().text().trim() ||
    $("p").first().text().trim();

  const paragraphs = $("p").toArray();
  const narrative: string = paragraphs
    .map((p) => $(p).text().trim())
    .filter(Boolean)
    .join("\n\n");

  return { headline, narrative };
}

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
  const accomplishments: string[] = [];
  const h4 = sections["key accomplishments"];
  if (h4) {
    h4.next("ul")
      .find("li")
      .each((_: number, li: AnyNode) => {
        accomplishments.push($(li).text().trim());
      });
  }
  return accomplishments;
}

function extractContributors(
  card: cheerio.Cheerio<AnyNode>,
  $: cheerio.CheerioAPI
): Contributor[] {
  const contributors: Contributor[] = [];

  const contributorDiv = card
    .find("div")
    .filter((_: number, el: AnyNode) =>
      $(el).find("strong").text().includes("Top Contributors")
    )
    .first();

  if (contributorDiv.length) {
    contributorDiv.find("a").each((_: number, a: AnyNode) => {
      const profileUrl = sanitizeUrl($(a).attr("href") || "");
      const name: string = $(a).text().trim();
      if (name) {
        contributors.push({ name, profileUrl });
      }
    });
  }

  return contributors;
}

function buildCardFromDiv(
  div: cheerio.Cheerio<AnyNode>,
  $: cheerio.CheerioAPI
): RepoCardData | null {
  const repoName: string = div.find("h3").first().text().trim();
  if (!repoName) return null;

  let githubUrl = "";
  div.find("a").each((_i: number, a: AnyNode) => {
    const href = $(a).attr("href") || "";
    const text = $(a).text().trim();
    if (
      (text.includes("GitHub") || href.includes("github.com")) &&
      !githubUrl
    ) {
      githubUrl = sanitizeUrl(href);
    }
  });

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

export function parseRepoCards(html: string): RepoCardData[] {
  const cardsHtml = extractBetweenComments(html, "REPO CARDS", "FOOTER");
  if (!cardsHtml) return [];

  const $ = cheerio.load(cardsHtml);
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

export function parseReportSummary(
  filePath: string,
  meta: ReportMeta
): ReportSummary {
  try {
    const html = fs.readFileSync(filePath, "utf-8");
    const stats = parseStats(html);
    const { headline } = parseExecutiveSummary(html);

    return { ...meta, stats, executiveHeadline: headline };
  } catch (error) {
    console.error(`[reports] Failed to parse summary for ${meta.slug}:`, error);
    return { ...meta, stats: { ...DEFAULT_STATS }, executiveHeadline: "" };
  }
}

export function parseReportDetail(
  filePath: string,
  meta: ReportMeta
): ReportDetail {
  try {
    const html = fs.readFileSync(filePath, "utf-8");
    const stats = parseStats(html);
    const { headline, narrative } = parseExecutiveSummary(html);
    const repos = parseRepoCards(html);

    return {
      ...meta,
      stats,
      executiveHeadline: headline,
      executiveNarrative: narrative,
      repos,
    };
  } catch (error) {
    console.error(`[reports] Failed to parse detail for ${meta.slug}:`, error);
    return {
      ...meta,
      stats: { ...DEFAULT_STATS },
      executiveHeadline: "",
      executiveNarrative: "",
      repos: [],
    };
  }
}
