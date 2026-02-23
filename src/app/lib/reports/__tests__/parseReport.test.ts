import { describe, it, expect } from "vitest";
import {
  sanitizeUrl,
  extractBetweenComments,
  parseStats,
  parseRepoCards,
} from "../parseReport";

describe("sanitizeUrl", () => {
  it("returns https URLs unchanged", () => {
    expect(sanitizeUrl("https://github.com/tokamak-network")).toBe(
      "https://github.com/tokamak-network"
    );
  });

  it("returns http URLs unchanged", () => {
    expect(sanitizeUrl("http://example.com")).toBe("http://example.com/");
  });

  it("rejects javascript: protocol", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("");
  });

  it("rejects data: protocol", () => {
    expect(sanitizeUrl("data:text/html,<h1>hi</h1>")).toBe("");
  });

  it("rejects ftp: protocol", () => {
    expect(sanitizeUrl("ftp://evil.com/payload")).toBe("");
  });

  it("returns empty for invalid URLs", () => {
    expect(sanitizeUrl("not-a-url")).toBe("");
    expect(sanitizeUrl("")).toBe("");
  });

  it("normalizes URLs", () => {
    expect(sanitizeUrl("https://github.com/foo/../bar")).toBe(
      "https://github.com/bar"
    );
  });
});

describe("extractBetweenComments", () => {
  const html = `
    <div>before</div>
    <!-- START -->
    <p>content here</p>
    <!-- END -->
    <div>after</div>
  `;

  it("extracts content between markers", () => {
    const result = extractBetweenComments(html, "START", "END");
    expect(result).toBe("<p>content here</p>");
  });

  it("returns empty string when start marker missing", () => {
    expect(extractBetweenComments(html, "MISSING", "END")).toBe("");
  });

  it("returns empty string when end marker missing", () => {
    expect(extractBetweenComments(html, "START", "MISSING")).toBe("");
  });

  it("returns empty string when markers are in wrong order", () => {
    expect(extractBetweenComments(html, "END", "START")).toBe("");
  });
});

describe("parseStats", () => {
  const statsHtml = `
<!-- STATS BAR -->
<div style="background:#111827;padding:28px 40px;">
  <div style="max-width:1100px;margin:0 auto;display:flex;">
    <div style="text-align:center;flex:1;">
      <div style="font-size:2rem;font-weight:800;color:#fff;">2,161</div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">Commits</div>
    </div>
    <div style="text-align:center;flex:1;">
      <div style="font-size:2rem;font-weight:800;color:#fff;">+4.9M</div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">Lines Changed</div>
    </div>
    <div style="text-align:center;flex:1;">
      <div style="font-size:2rem;font-weight:800;color:#fff;">67</div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">Active Repos</div>
    </div>
    <div style="text-align:center;flex:1;">
      <div style="font-size:2rem;font-weight:800;color:#fff;">16</div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">Contributors</div>
    </div>
    <div style="text-align:center;flex:1;">
      <div style="font-size:2rem;font-weight:800;color:#2A72E5;">+3.0M</div>
      <div style="font-size:0.7rem;color:rgba(255,255,255,0.5);">Net Growth</div>
    </div>
  </div>
</div>
<!-- BODY -->
  `;

  it("parses all 5 stat values", () => {
    const stats = parseStats(statsHtml);
    expect(stats.commits).toBe("2,161");
    expect(stats.linesChanged).toBe("+4.9M");
    expect(stats.activeRepos).toBe("67");
    expect(stats.contributors).toBe("16");
    expect(stats.netGrowth).toBe("+3.0M");
  });

  it("returns defaults when no STATS BAR marker", () => {
    const stats = parseStats("<div>no markers</div>");
    expect(stats.commits).toBe("0");
    expect(stats.linesChanged).toBe("0");
    expect(stats.activeRepos).toBe("0");
    expect(stats.contributors).toBe("0");
    expect(stats.netGrowth).toBe("0");
  });

  it("handles alternate label 'Active Repositories'", () => {
    const html = `
<!-- STATS BAR -->
<div>
  <div>
    <div>42</div>
    <div>Active Repositories</div>
  </div>
</div>
<!-- BODY -->
    `;
    const stats = parseStats(html);
    expect(stats.activeRepos).toBe("42");
  });
});

describe("parseRepoCards", () => {
  const singleCardHtml = `
<!-- REPO CARDS -->
<div style="background:#fff;border:1px solid #e8e8e8;border-radius:12px;padding:32px;margin-bottom:24px;">
  <div style="display:flex;justify-content:space-between;">
    <h3 style="margin:0;font-size:1.4rem;">SentinAI</h3>
    <a href="https://github.com/tokamak-network/SentinAI" target="_blank">GitHub →</a>
  </div>
  <p style="color:#555;">AI-powered security sentinel for smart contract auditing.</p>
  <div style="display:flex;gap:24px;">
    <div style="text-align:center;"><div>223</div><div>Commits</div></div>
    <div style="text-align:center;"><div>1</div><div>Contributors</div></div>
    <div style="text-align:center;"><div>+92,357</div><div>Lines Added</div></div>
    <div style="text-align:center;"><div>-17,072</div><div>Lines Deleted</div></div>
    <div style="text-align:center;"><div>+75,285</div><div>Net Change</div></div>
  </div>
  <h4>Key Accomplishments</h4>
  <ul>
    <li>Established system architecture</li>
    <li>Implemented hybrid AI strategy</li>
  </ul>
  <h4>Code Analysis</h4>
  <p>The net +75,285 lines reflects substantial product build-out.</p>
  <h4>Next Steps</h4>
  <p>Operationalize scaling and state-management proposals.</p>
  <div>👤 <strong>Top Contributors:</strong> <a href="https://github.com/theo-learner" target="_blank">theo</a></div>
</div>
<!-- FOOTER -->
  `;

  it("parses repo name", () => {
    const cards = parseRepoCards(singleCardHtml);
    expect(cards).toHaveLength(1);
    expect(cards[0].repoName).toBe("SentinAI");
  });

  it("parses GitHub URL with sanitization", () => {
    const cards = parseRepoCards(singleCardHtml);
    expect(cards[0].githubUrl).toBe(
      "https://github.com/tokamak-network/SentinAI"
    );
  });

  it("parses description", () => {
    const cards = parseRepoCards(singleCardHtml);
    expect(cards[0].description).toBe(
      "AI-powered security sentinel for smart contract auditing."
    );
  });

  it("parses repo stats", () => {
    const cards = parseRepoCards(singleCardHtml);
    expect(cards[0].stats.commits).toBe("223");
    expect(cards[0].stats.contributors).toBe("1");
    expect(cards[0].stats.linesAdded).toBe("+92,357");
    expect(cards[0].stats.linesDeleted).toBe("-17,072");
    expect(cards[0].stats.netLines).toBe("+75,285");
  });

  it("parses accomplishments", () => {
    const cards = parseRepoCards(singleCardHtml);
    expect(cards[0].accomplishments).toHaveLength(2);
    expect(cards[0].accomplishments[0]).toBe(
      "Established system architecture"
    );
  });

  it("parses code analysis and next steps", () => {
    const cards = parseRepoCards(singleCardHtml);
    expect(cards[0].codeAnalysis).toContain("substantial product build-out");
    expect(cards[0].nextSteps).toContain("scaling and state-management");
  });

  it("parses contributors with sanitized URLs", () => {
    const cards = parseRepoCards(singleCardHtml);
    expect(cards[0].topContributors).toHaveLength(1);
    expect(cards[0].topContributors[0].name).toBe("theo");
    expect(cards[0].topContributors[0].profileUrl).toBe(
      "https://github.com/theo-learner"
    );
  });

  it("returns empty array when no REPO CARDS marker", () => {
    const cards = parseRepoCards("<div>no markers</div>");
    expect(cards).toEqual([]);
  });

  it("handles multiple cards", () => {
    const html = `
<!-- REPO CARDS -->
<div><h3>RepoA</h3><p>Desc A</p><h4>Key Accomplishments</h4><ul><li>Item</li></ul></div>
<div><h3>RepoB</h3><p>Desc B</p><h4>Key Accomplishments</h4><ul><li>Item</li></ul></div>
<!-- FOOTER -->
    `;
    const cards = parseRepoCards(html);
    expect(cards).toHaveLength(2);
    expect(cards[0].repoName).toBe("RepoA");
    expect(cards[1].repoName).toBe("RepoB");
  });

  it("rejects malicious contributor URLs", () => {
    const html = `
<!-- REPO CARDS -->
<div>
  <h3>TestRepo</h3>
  <p>Desc</p>
  <h4>Key Accomplishments</h4>
  <ul><li>Item</li></ul>
  <div><strong>Top Contributors:</strong> <a href="javascript:alert(1)">hacker</a></div>
</div>
<!-- FOOTER -->
    `;
    const cards = parseRepoCards(html);
    expect(cards[0].topContributors[0].profileUrl).toBe("");
  });
});
