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

const DEFAULT_STATS: ReportStats = {
  commits: "0",
  linesChanged: "0",
  activeRepos: "0",
  contributors: "0",
  netGrowth: "0",
};

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return url;
    }
    return "";
  } catch {
    return "";
  }
}

function extractBetweenComments(
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

function parseStats(html: string): ReportStats {
  const statsHtml = extractBetweenComments(html, "STATS BAR", "BODY");
  if (!statsHtml) return { ...DEFAULT_STATS };

  const $ = cheerio.load(statsHtml);
  const statDivs = $("div[style*='text-align:center']");

  const labels: Record<string, keyof ReportStats> = {
    commits: "commits",
    "lines changed": "linesChanged",
    "active repos": "activeRepos",
    "active repositories": "activeRepos",
    contributors: "contributors",
    "net growth": "netGrowth",
    "net change": "netGrowth",
  };

  const entries: Partial<ReportStats> = {};
  statDivs.each((_: number, el: AnyNode) => {
    const children = $(el).children("div");
    if (children.length < 2) return;

    const value = $(children[0]).text().trim();
    const label = $(children[children.length - 1]).text().trim().toLowerCase();

    for (const [key, field] of Object.entries(labels)) {
      if (label.includes(key)) {
        entries[field] = value;
        break;
      }
    }
  });

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

  // Real HTML: <h3> for headline, <p> for narrative
  const headline: string =
    $("h3").first().text().trim() ||
    $("p[style*='font-weight:bold']").first().text().trim() ||
    $("p").first().text().trim();

  const paragraphs = $("p").toArray();
  const narrative: string =
    paragraphs.length > 0
      ? $(paragraphs[paragraphs.length - 1]).text().trim()
      : "";

  return { headline, narrative };
}

function extractRepoStats(
  card: cheerio.Cheerio<AnyNode>
): RepoCardData["stats"] {
  const defaults = {
    commits: "0",
    contributors: "0",
    linesAdded: "0",
    linesDeleted: "0",
    netLines: "0",
  };

  // Real HTML: stats in div with gap:24px or gap:20px, containing text-align:center divs
  const statsContainer = card.find(
    "div[style*='justify-content:space-around']"
  ).first();

  if (!statsContainer.length) return defaults;

  const $ = cheerio.load(statsContainer.html() || "");
  const statLabels: Record<string, keyof typeof defaults> = {
    commits: "commits",
    contributors: "contributors",
    "lines added": "linesAdded",
    "lines deleted": "linesDeleted",
    "net change": "netLines",
    "net lines": "netLines",
    net: "netLines",
  };

  const entries: Partial<typeof defaults> = {};
  $("div[style*='text-align:center']").each((_: number, el: AnyNode) => {
    const children = $(el).children("div");
    if (children.length < 2) return;

    const value = $(children[0]).text().trim();
    const label = $(children[children.length - 1]).text().trim().toLowerCase();

    for (const [key, field] of Object.entries(statLabels)) {
      if (label.includes(key)) {
        entries[field] = value;
        break;
      }
    }
  });

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
  sections: Record<string, cheerio.Cheerio<AnyNode>>,
  card: cheerio.Cheerio<AnyNode>,
  $: cheerio.CheerioAPI
): Contributor[] {
  const contributors: Contributor[] = [];

  // Real HTML: contributors are in a div with "Top Contributors:" text
  // Pattern: <a href="...">name</a> <span>(N commits)</span>
  const contributorDiv = card.find("div").filter((_: number, el: AnyNode) => {
    return $(el).find("strong").text().includes("Top Contributors");
  }).first();

  if (contributorDiv.length) {
    contributorDiv.find("a").each((_: number, a: AnyNode) => {
      const profileUrl = sanitizeUrl($(a).attr("href") || "");
      const name: string = $(a).text().trim();
      if (name) {
        contributors.push({ name, avatarUrl: "", profileUrl });
      }
    });
  }

  return contributors;
}

function parseRepoCards(html: string): RepoCardData[] {
  const cardsHtml = extractBetweenComments(html, "REPO CARDS", "FOOTER");
  if (!cardsHtml) return [];

  const $ = cheerio.load(cardsHtml);
  const cards: RepoCardData[] = [];

  const cardDivs = $(
    "div[style*='background:#fff'][style*='border:1px solid #e8e8e8'][style*='border-radius:12px']"
  );

  cardDivs.each((_: number, cardEl: AnyNode) => {
    const card = $(cardEl);

    // Real HTML: <h3> contains repo name directly, GitHub link is a separate <a>
    const repoName: string = card.find("h3").first().text().trim();

    // GitHub URL: look for <a> with "GitHub" text or github.com href
    let githubUrl = "";
    card.find("a").each((_i: number, a: AnyNode) => {
      const href = $(a).attr("href") || "";
      const text = $(a).text().trim();
      if (
        (text.includes("GitHub") || href.includes("github.com")) &&
        !githubUrl
      ) {
        githubUrl = sanitizeUrl(href);
      }
    });

    // Description: first <p> after the header area
    const description: string = card.find("p").first().text().trim();

    const repoStats = extractRepoStats(card);

    const sections: Record<string, cheerio.Cheerio<AnyNode>> = {};
    card.find("h4").each((_i: number, h4: AnyNode) => {
      const title: string = $(h4).text().trim().toLowerCase();
      sections[title] = $(h4);
    });

    const accomplishments = extractAccomplishments(sections, $);

    const codeAnalysis: string = sections["code analysis"]
      ? sections["code analysis"].next("p").text().trim()
      : "";

    const nextSteps: string = sections["next steps"]
      ? sections["next steps"].next("p").text().trim()
      : "";

    const topContributors = extractContributors(sections, card, $);

    cards.push({
      repoName,
      githubUrl,
      description,
      stats: repoStats,
      accomplishments,
      codeAnalysis,
      nextSteps,
      topContributors,
    });
  });

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

    return {
      ...meta,
      stats,
      executiveHeadline: headline,
    };
  } catch {
    return {
      ...meta,
      stats: { ...DEFAULT_STATS },
      executiveHeadline: "",
    };
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
  } catch {
    return {
      ...meta,
      stats: { ...DEFAULT_STATS },
      executiveHeadline: "",
      executiveNarrative: "",
      repos: [],
    };
  }
}
