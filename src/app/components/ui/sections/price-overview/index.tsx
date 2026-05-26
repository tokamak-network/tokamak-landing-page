import { fetchPriceDatas } from "@/app/api/price";
import { LINKS } from "@/app/constants/links";
import InfoBadgeClient from "./InfoBadge";
import SparklineChart from "./SparklineChart";

interface PriceData {
  tonPrice: {
    current: { usd: number; krw: number };
    opening: { usd: number; krw: number };
    closing: { usd: number; krw: number };
  };
  /** 24x 60-minute close prices in USD, oldest → newest. Empty if Upbit failed. */
  priceHistoryUSD: number[];
  marketCap: number;
  tradingVolumeUSD: number;
  fullyDilutedValuation: number;
  totalSupply: number;
  circulatingSupply: number;
  /** Upbit-standard circulating (totalSupply minus DAO-held). */
  circulatingSuupplyUpbitStandard: number;
  burnedSupply: number;
  stakedVolume: number;
  stakedVolumeUSD: number;
  DAOStakedVolume: number;
  DAOStakedVolumeUSD: number;
  /** Liquidity tier supplies — cumulative. C1 < C2 ≤ C3. */
  liquidity: { c1: number; c2: number; c3: number };
  liquidityUSD: { c1: number; c2: number; c3: number };
}

const TON_CONTRACT = "0x2be5e8c109e2197D077D13A82dAead6a9b3433C5";

/**
 * Per-metric tooltips — surfaced both as the native `title` attribute (hover)
 * and as a small ⓘ glyph on the card so users notice extra context exists.
 * Sourced from the legacy Tokamak price dashboard plus public docs.
 */
const METRIC_TOOLTIPS: Record<string, string> = {
  "Market Cap":
    "Current circulating supply × current price. The publicly traded value of TON right now.",
  "Fully Diluted Valuation":
    "Total supply × current price. Hypothetical market cap if every TON were in circulation today.",
  "24h Trading Volume":
    "USD value of TON traded across listed exchanges over the past 24 hours.",
  "Total Supply *":
    "Total TON ever minted, including burned and locked tokens. * Contract value ÷ 10^18 to get the human-readable amount.",
  "Circulating Supply":
    "TON currently available on-chain in the open market (excluding burned and DAO-vault held).",
  "Circulating (Upbit)":
    "Upbit-standard circulating supply — Total Supply minus tokens held in the DAO vault.",
  "Burned *":
    "TON permanently removed from supply by sending to the burn address. * Contract value ÷ 10^18.",
  "DAO Vault **":
    "TON held in the DAO treasury for governance and ecosystem operations. ** Contract value ÷ 10^27.",
  "Staked *":
    "TON locked in the seigniorage staking contract — earns block rewards and secures the network. * Contract value ÷ 10^18.",
  "Vested **":
    "TON locked in vesting contracts (team, contributors, investors). ** Contract value ÷ 10^27.",
  "Stake / Circulating":
    "Share of circulating TON actively staked. A higher ratio means the network is more secured.",
  C1: "Free-float liquidity — TON immediately tradable on the open market.",
  C2: "C1 + tokens unlocking from staking within the seigniorage period.",
  C3: "Maximum liquid envelope — broadest near-term liquidity (C1 + C2 + scheduled unlocks).",
  "24h Open":
    "TON's USD price at the start of the current 24-hour candle (Upbit feed).",
  Current: "Live USD price refreshed every minute from Upbit.",
  "24h Close":
    "TON's USD price at the close of the previous 24-hour candle (Upbit feed).",
};

function fmtMoney(n: number, currency: "USD" | "KRW" = "USD"): string {
  if (!Number.isFinite(n)) return "—";
  const sym = currency === "USD" ? "$" : "₩";
  const fixed = currency === "USD" ? 4 : 0;
  return `${sym}${n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fixed,
  })}`;
}

function fmtCompactUSD(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

function fmtCompactToken(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function pctChange(current: number, base: number): number {
  if (!base) return 0;
  return ((current - base) / base) * 100;
}

/**
 * InfoBadge — small ⓘ glyph that surfaces the native browser tooltip on
 * hover. Renders inline next to a metric label so the reader always sees
 * that there's more context available without it adding visual noise.
 */
function InfoBadge({ label }: { label: string }) {
  const text = METRIC_TOOLTIPS[label];
  if (!text) return null;
  return <InfoBadgeClient text={text} />;
}

export default async function PriceOverview() {
  const data = (await fetchPriceDatas()) as PriceData;

  const change24h = pctChange(
    data.tonPrice.current.usd,
    data.tonPrice.closing.usd
  );
  const changePositive = change24h >= 0;
  const stakeRatio = data.circulatingSupply
    ? (data.stakedVolume / data.circulatingSupply) * 100
    : 0;

  return (
    <div
      className="bg-black text-white"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      <PriceHero
        currentUsd={data.tonPrice.current.usd}
        currentKrw={data.tonPrice.current.krw}
        change24h={change24h}
        positive={changePositive}
      />
      <PriceTicker data={data} change24h={change24h} positive={changePositive} />
      <PriceSection
        data={data}
        change24h={change24h}
        positive={changePositive}
      />
      <SupplySection data={data} />
      <LockedSection data={data} stakeRatio={stakeRatio} />
      <LiquiditySection data={data} />
      <DashboardDisclaimers />
    </div>
  );
}

/* ============================================================
   HERO — TON token + price headline (mirrors ZkHero pattern)
   ============================================================ */
function PriceHero({
  currentUsd,
  currentKrw,
  change24h,
  positive,
}: {
  currentUsd: number;
  currentKrw: number;
  change24h: number;
  positive: boolean;
}) {
  const arrow = positive ? "▲" : "▼";
  const changeColor = positive ? "#4ade80" : "#f87171";
  return (
    <section className="relative w-full lg:min-h-[88vh] bg-[#02040a] overflow-hidden">
      {/* Ambient glow — same Tokamak blue as ZkHero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 70% 75%, rgba(42,114,229,0.22) 0%, rgba(42,114,229,0.10) 30%, rgba(26,79,181,0.04) 60%, transparent 85%)",
        }}
      />

      {/* Hero plaza loop — anchored bottom-right, native size kept small so
          the 1280px source stays sharp. Edges dissolve into the background
          via a radial mask so the video reads as part of the canvas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-[1] bottom-0 right-0 w-full lg:w-[58%] xl:w-[52%] h-[42vh] sm:h-[55vh] lg:h-[72vh] lg:max-h-[720px]"
      >
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            maskImage:
              "radial-gradient(ellipse 90% 100% at 70% 60%, black 25%, rgba(0,0,0,0.55) 55%, transparent 95%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 8%, black 18%, black 70%, rgba(0,0,0,0.3) 90%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 90% 100% at 70% 60%, black 25%, rgba(0,0,0,0.55) 55%, transparent 95%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 8%, black 18%, black 70%, rgba(0,0,0,0.3) 90%, transparent 100%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "saturate(1.05) brightness(0.95)" }}
          >
            <source src="/videos/price-hero.webm" type="video/webm" />
            <source src="/videos/price-hero.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 sm:px-12 lg:px-16 pt-28 sm:pt-36 lg:pt-44 pb-[44vh] sm:pb-[42vh] lg:pb-32 lg:max-w-[55%] xl:max-w-[58%] lg:mx-0 lg:ml-[max(24px,calc((100vw-1280px)/2))]">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5 sm:mb-7">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
          <span
            className="text-[10px] sm:text-[11px] tracking-[0.5em] text-[#7AB0FF]/90 uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Real-Time TON(Tokamak)
          </span>
        </div>

        {/* Headline — wide tracking, mixed italic accent */}
        <h1
          className="text-white leading-[0.95] mb-5"
          style={{
            fontWeight: 800,
            letterSpacing: "-0.045em",
            fontSize: "clamp(48px, 7vw, 96px)",
          }}
        >
          Market
          <br />
          <em
            className="not-italic"
            style={{
              fontStyle: "italic",
              fontWeight: 500,
              color: "#7AB0FF",
              textShadow: "0 0 28px rgba(42,114,229,0.55)",
            }}
          >
            Insights.
          </em>
        </h1>

        {/* Live price row — big tabular number + change pill */}
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 mb-6">
          <span
            className="text-white tracking-tight tabular-nums"
            style={{
              fontWeight: 600,
              fontSize: "clamp(24px, 2.8vw, 36px)",
            }}
          >
            {fmtMoney(currentUsd, "USD")}
          </span>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs sm:text-sm font-semibold"
            style={{
              color: changeColor,
              background: `${changeColor}1f`,
              border: `1px solid ${changeColor}55`,
              fontFamily: "var(--font-geist-mono), monospace",
              textShadow: `0 0 10px ${changeColor}55`,
            }}
          >
            {arrow} {Math.abs(change24h).toFixed(2)}%
          </span>
          <span
            className="text-white/45 text-xs sm:text-[13px] tracking-[0.18em] uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {fmtMoney(currentKrw, "KRW")} KRW · Upbit
          </span>
        </div>

        {/* Data sources — terminal-style metadata strip (key / value rows) */}
        <dl
          className="mb-9 grid grid-cols-[auto_1fr] gap-x-5 sm:gap-x-7 gap-y-2 max-w-xl"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          <dt className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-white/40 font-semibold pt-px">
            Sources
          </dt>
          <dd className="text-[12.5px] sm:text-[13.5px] text-white/85 leading-snug">
            Upbit feed
            <span className="text-white/25 mx-2">·</span>
            Etherscan
            <span className="text-white/25 mx-2">·</span>
            Tokamak supply API
          </dd>

          <dt className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-white/40 font-semibold pt-px">
            Coverage
          </dt>
          <dd className="text-[12.5px] sm:text-[13.5px] text-white/85 leading-snug">
            Price
            <span className="text-white/25 mx-2">·</span>
            Supply
            <span className="text-white/25 mx-2">·</span>
            Staking
            <span className="text-white/25 mx-2">·</span>
            DAO Treasury
          </dd>

          <dt className="text-[10px] sm:text-[11px] tracking-[0.32em] uppercase text-white/40 font-semibold pt-px">
            Latency
          </dt>
          <dd className="text-[12.5px] sm:text-[13.5px] text-white/85 leading-snug inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80] animate-pulse" />
            Real-time
            <span className="text-white/40">· 60s refresh</span>
          </dd>
        </dl>

        {/* CTAs — two primary, Etherscan demoted to a text link */}
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <a
            href="https://upbit.com/exchange?code=CRIX.UPBIT.KRW-TOKAMAK"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 sm:px-7 py-2.5 sm:py-3 bg-[#2A72E5]/15 border border-[#4A8EFA]/70 text-[#7AB0FF] text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:bg-[#2A72E5]/25 hover:border-[#4A8EFA] transition-all shadow-[0_0_24px_rgba(42,114,229,0.18)] hover:shadow-[0_0_40px_rgba(42,114,229,0.35)]"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Buy TON(Tokamak) →
          </a>
          <a
            href={LINKS.DUNE_DASHBOARD}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 sm:px-7 py-2.5 sm:py-3 border border-[#FF744F]/60 text-[#FF8E6B] text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:bg-[#FF744F]/10 hover:border-[#FF744F] hover:text-[#FFB99E] transition-all"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Dune Dashboard →
          </a>
          <a
            href={`https://etherscan.io/token/${TON_CONTRACT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-white/45 hover:text-white/85 transition-colors underline-offset-4 hover:underline"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Etherscan ↗
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   TICKER — HUD-style horizontal data strip (mirrors TickerClient)
   ============================================================ */
function PriceTicker({
  data,
  change24h,
  positive,
}: {
  data: PriceData;
  change24h: number;
  positive: boolean;
}) {
  const items: { label: string; value: string; accent?: string }[] = [
    { label: "Price", value: fmtMoney(data.tonPrice.current.usd) },
    {
      label: "24h",
      value: `${positive ? "▲" : "▼"} ${Math.abs(change24h).toFixed(2)}%`,
      accent: positive ? "#4ade80" : "#f87171",
    },
    { label: "Market Cap", value: fmtCompactUSD(data.marketCap) },
    { label: "24h Volume", value: fmtCompactUSD(data.tradingVolumeUSD) },
    { label: "FDV", value: fmtCompactUSD(data.fullyDilutedValuation) },
    {
      label: "Circulating",
      value: `${fmtCompactToken(data.circulatingSupply)} TON`,
    },
  ];

  return (
    <section
      className="relative w-full bg-[#040814] border-y border-[#4A8EFA]/22"
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      {/* hairlines + radial glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4A8EFA]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#4A8EFA]/40 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 200% at 50% 50%, rgba(42,114,229,0.10) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-[1500px] mx-auto px-4 sm:px-8 py-4 overflow-x-auto">
        <ul className="flex items-center gap-6 sm:gap-10 min-w-max">
          {items.map((it) => (
            <li key={it.label} className="flex items-center gap-2.5">
              <span className="inline-block h-1 w-1 rounded-full bg-[#4A8EFA] shadow-[0_0_6px_#2A72E5]" />
              <span className="text-[9px] sm:text-[10px] tracking-[0.32em] uppercase text-white/45">
                {it.label}
              </span>
              <span
                className="text-sm sm:text-base font-semibold"
                style={{ color: it.accent ?? "#e5e7eb" }}
              >
                {it.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ============================================================
   INFOGRAPHIC — Dune-flavored data widgets mixed with ProjectBento's
   high-saturation color blocks. Donut for supply distribution, radial
   gauge for stake ratio, animated sparkline for price, bold solid
   metric cards in brand palette, and a snapshot table at the bottom.
   ============================================================ */
interface SupplySlice {
  id: string;
  label: string;
  color: string;
  value: number;
}

/**
 * iOS-widget-style palette: each card uses a soft top→bottom gradient
 * (brand → slightly deeper brand) with a glossy highlight on top and a
 * tinted drop shadow underneath.
 */
const PALETTES = [
  { from: "#FFFFFF", to: "#E8EAEF", fg: "#0A0A14", shadow: "rgba(0,0,0,0.28)" },
  { from: "#3A82EE", to: "#1A56B5", fg: "#FFFFFF", shadow: "rgba(26,86,181,0.45)" },
  { from: "#22D8EE", to: "#00B8CC", fg: "#0A0A14", shadow: "rgba(0,184,204,0.4)" },
  { from: "#FFD23A", to: "#D4A800", fg: "#0A0A14", shadow: "rgba(212,168,0,0.4)" },
  { from: "#F65EAB", to: "#BE2F73", fg: "#FFFFFF", shadow: "rgba(190,47,115,0.4)" },
  { from: "#34D26C", to: "#16953F", fg: "#0A0A14", shadow: "rgba(22,149,63,0.4)" },
  { from: "#FF8E6B", to: "#D9532D", fg: "#FFFFFF", shadow: "rgba(217,83,45,0.45)" }, // Dune-style orange
];

/* ----------------------------------------------------------------
   SectionShell — shared eyebrow + headline wrapper. Optional ambient
   background video tints the whole section softly (Tokamak's video-on-
   black motif). Keeps every section header consistent with the main
   page (dot-pulse eyebrow, bold display headline with italic accent).
   ---------------------------------------------------------------- */
function SectionShell({
  eyebrow,
  titleStart,
  titleAccent,
  titleEnd,
  sub,
  videoSrc,
  videoOpacity = 0.22,
  children,
}: {
  eyebrow: string;
  titleStart: string;
  titleAccent: string;
  titleEnd?: string;
  sub?: string;
  videoSrc?: string;
  videoOpacity?: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className="relative w-full bg-black py-20 sm:py-24 lg:py-28 px-4 sm:px-6 overflow-hidden"
      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
    >
      {videoSrc && (
        <video
          aria-hidden
          autoPlay
          loop
          muted
          playsInline
          className="pointer-events-none absolute inset-0 w-full h-full object-cover z-0"
          style={{
            opacity: videoOpacity,
            mixBlendMode: "screen",
            filter: "saturate(0.95) brightness(0.85)",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 12%, black 28%, black 72%, rgba(0,0,0,0.4) 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 12%, black 28%, black 72%, rgba(0,0,0,0.4) 92%, transparent 100%)",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
            <span
              className="text-[10px] sm:text-[11px] tracking-[0.5em] text-[#7AB0FF]/85 uppercase"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {eyebrow}
            </span>
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_10px_#2A72E5] animate-pulse" />
          </div>
          <h2
            className="text-3xl sm:text-5xl lg:text-6xl text-white tracking-[-0.04em] leading-[0.98]"
            style={{ fontWeight: 800 }}
          >
            {titleStart}{" "}
            <em
              className="not-italic"
              style={{
                color: "#7AB0FF",
                fontStyle: "italic",
                fontWeight: 500,
                textShadow: "0 0 24px rgba(42,114,229,0.5)",
              }}
            >
              {titleAccent}
            </em>
            {titleEnd}
          </h2>
          {sub && (
            <p
              className="mt-4 text-xs sm:text-sm tracking-[0.18em] uppercase text-white/45"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {sub}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}

/* ============================================================
   1. PRICE — OHLC trio + Market Cap / FDV solid metrics + sparkline.
   ============================================================ */
function PriceSection({
  data,
  change24h,
  positive,
}: {
  data: PriceData;
  change24h: number;
  positive: boolean;
}) {
  return (
    <SectionShell
      eyebrow="01 · Price"
      titleStart="The price of"
      titleAccent="TON"
      titleEnd="."
      sub="OHLC · Upbit feed · refreshed every minute"
    >
      <div className="grid grid-cols-3 sm:grid-cols-6 [grid-auto-rows:140px] sm:[grid-auto-rows:160px] lg:[grid-auto-rows:180px] [grid-auto-flow:dense] gap-3 sm:gap-4">
        {/* 24h price sparkline — wide */}
        <SparklineWidget
          series={data.priceHistoryUSD}
          currentUsd={data.tonPrice.current.usd}
          change24h={change24h}
          positive={positive}
          span="col-span-3 row-span-2 sm:col-span-4 sm:row-span-2"
        />
        {/* Market Cap — large brand-blue */}
        <SolidMetric
          label="Market Cap"
          value={fmtCompactUSD(data.marketCap)}
          sub="circulating × price"
          palette={1}
          span="col-span-3 row-span-1 sm:col-span-2"
        />
        {/* Fully Diluted Valuation — cyan */}
        <SolidMetric
          label="Fully Diluted Valuation"
          value={fmtCompactUSD(data.fullyDilutedValuation)}
          sub="all supply × price"
          palette={2}
          span="col-span-3 row-span-1 sm:col-span-2"
        />

        {/* OHLC trio — Open / Current / Close */}
        <OHLCCard
          label="24h Open"
          usd={data.tonPrice.opening.usd}
          krw={data.tonPrice.opening.krw}
          span="col-span-1 sm:col-span-2"
        />
        <OHLCCard
          label="Current"
          usd={data.tonPrice.current.usd}
          krw={data.tonPrice.current.krw}
          highlight
          span="col-span-1 sm:col-span-2"
        />
        <OHLCCard
          label="24h Close"
          usd={data.tonPrice.closing.usd}
          krw={data.tonPrice.closing.krw}
          span="col-span-1 sm:col-span-2"
        />
      </div>
    </SectionShell>
  );
}

/* ============================================================
   2. SUPPLY — full-width segmented bar + 4 distribution cards.
   ============================================================ */
function SupplySection({ data }: { data: PriceData }) {
  const total = data.totalSupply || 1;
  // Segmented bar slices: Circulating · Locked (Staked + DAO) · Burned · Other
  const lockedTotal = data.stakedVolume + data.DAOStakedVolume;
  const accountedFor =
    data.circulatingSupply + lockedTotal + data.burnedSupply;
  const other = Math.max(0, total - accountedFor);
  const slices: SupplySlice[] = [
    { id: "circulating", label: "Circulating", color: "#4A8EFA", value: data.circulatingSupply },
    { id: "locked", label: "Locked", color: "#22C55E", value: lockedTotal },
    { id: "other", label: "Reserve", color: "#7AB0FF", value: other },
    { id: "burned", label: "Burned", color: "#EC4899", value: data.burnedSupply },
  ];

  return (
    <SectionShell
      eyebrow="02 · Supply"
      titleStart="History of"
      titleAccent="TON"
      titleEnd="."
      sub="Raw on-chain data — total / circulating / burned"
      videoSrc="/videos/cta-footer.mp4"
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        <SupplyBar slices={slices} total={total} span="" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <SolidMetric
            label="Total Supply *"
            value={fmtCompactToken(data.totalSupply)}
            sub="TON"
            palette={0}
            span="min-h-[170px]"
          />
          <SolidMetric
            label="Circulating Supply"
            value={fmtCompactToken(data.circulatingSupply)}
            sub="TON · on-chain"
            palette={1}
            span="min-h-[170px]"
          />
          <SolidMetric
            label="Circulating (Upbit)"
            value={fmtCompactToken(data.circulatingSuupplyUpbitStandard)}
            sub="TON · exchange standard"
            palette={2}
            span="min-h-[170px]"
          />
          <SolidMetric
            label="Burned *"
            value={fmtCompactToken(data.burnedSupply)}
            sub="TON · permanently removed"
            palette={4}
            span="min-h-[170px]"
          />
        </div>
      </div>
    </SectionShell>
  );
}

/* ============================================================
   3. LOCKED — three vault pillars (DAO · Staked · Vested) + stake gauge.
   ============================================================ */
function LockedSection({
  data,
  stakeRatio,
}: {
  data: PriceData;
  stakeRatio: number;
}) {
  // Vested data isn't exposed by the price API yet — render as placeholder.
  const vested = 0;
  const lockedTotal = data.DAOStakedVolume + data.stakedVolume + vested;
  const ceiling = Math.max(lockedTotal, data.circulatingSupply, 1);

  const vaults = [
    {
      id: "dao",
      label: "DAO Vault **",
      value: data.DAOStakedVolume,
      usd: data.DAOStakedVolumeUSD,
      color: "#FACC15",
    },
    {
      id: "staked",
      label: "Staked *",
      value: data.stakedVolume,
      usd: data.stakedVolumeUSD,
      color: "#22C55E",
    },
    {
      id: "vested",
      label: "Vested **",
      value: vested,
      usd: 0,
      color: "#7AB0FF",
    },
  ];

  return (
    <SectionShell
      eyebrow="03 · Locked"
      titleStart="Where TON is"
      titleAccent="held"
      titleEnd="."
      sub="DAO · Staking · Vesting contracts"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4 sm:gap-5">
        {/* Vault pillars */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {vaults.map((v) => (
            <VaultPillar key={v.id} {...v} ceiling={ceiling} />
          ))}
        </div>

        {/* Stake-ratio gauge */}
        <GaugeWidget
          label="Stake / Circulating"
          value={Math.min(100, stakeRatio)}
          sub={`${fmtCompactToken(data.stakedVolume)} TON of ${fmtCompactToken(data.circulatingSupply)}`}
          color="#22C55E"
          span="min-h-[320px] lg:min-h-0"
        />
      </div>
    </SectionShell>
  );
}

/* ============================================================
   4. LIQUIDITY — stepped pyramid of C1 / C2 / C3 tiers.
   ============================================================ */
function LiquiditySection({ data }: { data: PriceData }) {
  const tiers = [
    {
      id: "c1",
      title: "C1",
      caption: "Free-float liquidity",
      ton: data.liquidity.c1,
      usd: data.liquidityUSD.c1,
      widthPct: 100,
      color: "#4A8EFA",
    },
    {
      id: "c2",
      title: "C2",
      caption: "Free-float + short-term unlocks",
      ton: data.liquidity.c2,
      usd: data.liquidityUSD.c2,
      widthPct: 78,
      color: "#22C55E",
    },
    {
      id: "c3",
      title: "C3",
      caption: "Maximum liquid envelope",
      ton: data.liquidity.c3,
      usd: data.liquidityUSD.c3,
      widthPct: 56,
      color: "#FACC15",
    },
  ];

  return (
    <SectionShell
      eyebrow="04 · Liquidity Measure"
      titleStart="Liquidity"
      titleAccent="tiers"
      titleEnd="."
      sub="C1 · C2 · C3 — cumulative liquid supply"
      videoSrc="/videos/cta-footer.mp4"
      videoOpacity={0.18}
    >
      <div className="mx-auto max-w-[920px] flex flex-col gap-3 sm:gap-4">
        {tiers.map((t) => (
          <PyramidTier
            key={t.id}
            title={t.title}
            caption={t.caption}
            ton={t.ton}
            usd={t.usd}
            widthPct={t.widthPct}
            color={t.color}
          />
        ))}
      </div>
    </SectionShell>
  );
}

/* ----------------------------------------------------------------
   OHLCCard — single open/current/close price card.
   ---------------------------------------------------------------- */
function OHLCCard({
  label,
  usd,
  krw,
  highlight,
  span,
}: {
  label: string;
  usd: number;
  krw: number;
  highlight?: boolean;
  span: string;
}) {
  return (
    <div
      className={`${span} relative rounded-[28px] overflow-hidden flex flex-col justify-between p-4 sm:p-5 border bg-gradient-to-br from-[#0c1530] via-[#070d22] to-[#040814] shadow-[0_14px_32px_-10px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)]`}
      style={{
        borderColor: highlight ? "rgba(74,142,250,0.55)" : "rgba(255,255,255,0.08)",
        boxShadow: highlight
          ? "0 0 40px rgba(42,114,229,0.22), inset 0 1px 0 rgba(255,255,255,0.08)"
          : undefined,
      }}
    >
      <div className="flex items-center gap-2">
        {highlight && (
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#4A8EFA] shadow-[0_0_8px_#4A8EFA] animate-pulse" />
        )}
        <span
          className="text-[9px] sm:text-[10px] tracking-[0.32em] uppercase font-semibold"
          style={{
            color: highlight ? "#7AB0FF" : "rgba(255,255,255,0.5)",
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          {label}
        </span>
        <span
          className="text-white/40 hover:text-white/80"
          style={{ display: "inline-flex" }}
        >
          <InfoBadge label={label} />
        </span>
      </div>

      <div>
        <div
          className="text-white tracking-tight tabular-nums leading-none"
          style={{
            fontWeight: 700,
            fontSize: "clamp(20px, 2.4vw, 30px)",
          }}
        >
          {fmtMoney(usd, "USD")}
        </div>
        <div
          className="mt-2 text-[10px] sm:text-[11px] text-white/45 tracking-[0.18em] uppercase"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {fmtMoney(krw, "KRW")} KRW
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   VaultPillar — vertical fill-bar chamber for Locked section.
   ---------------------------------------------------------------- */
function VaultPillar({
  label,
  value,
  usd,
  color,
  ceiling,
}: {
  label: string;
  value: number;
  usd: number;
  color: string;
  ceiling: number;
}) {
  const fill = ceiling > 0 ? Math.min(1, value / ceiling) : 0;

  return (
    <div
      className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0c1530] via-[#070d22] to-[#040814] border min-h-[320px] flex flex-col"
      style={{
        borderColor: `${color}33`,
        boxShadow: `0 14px 32px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px ${color}11`,
      }}
    >
      {/* Bottom fill — rises with value */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 transition-[height] duration-700"
        style={{
          height: `${fill * 100}%`,
          background: `linear-gradient(180deg, ${color}3a 0%, ${color}22 60%, ${color}10 100%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 h-[2px] transition-[bottom] duration-700"
        style={{
          bottom: `${fill * 100}%`,
          background: color,
          boxShadow: `0 0 14px ${color}, 0 0 4px ${color}`,
        }}
      />

      <div className="relative z-10 p-4 sm:p-5 flex items-start justify-between">
        <span
          className="inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] tracking-[0.32em] uppercase font-semibold"
          style={{
            color,
            fontFamily: "var(--font-geist-mono), monospace",
          }}
        >
          <span>{label}</span>
          <InfoBadge label={label} />
        </span>
        <span
          className="text-[10px] tracking-[0.28em] uppercase text-white/40 font-semibold"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          {(fill * 100).toFixed(1)}%
        </span>
      </div>

      <div className="relative z-10 mt-auto p-4 sm:p-5">
        <div
          className="text-white leading-none tracking-tight tabular-nums break-all"
          style={{ fontWeight: 900, fontSize: "clamp(24px, 3vw, 44px)" }}
        >
          {value > 0 ? fmtCompactToken(value) : "—"}
        </div>
        <div
          className="mt-1.5 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-white/45"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          TON
        </div>
        {usd > 0 && (
          <div
            className="mt-2 text-[10px] sm:text-[11px] text-white/55 tabular-nums"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            ≈ {fmtCompactUSD(usd)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   PyramidTier — single liquidity tier row for the stepped pyramid.
   Width tapers as the tier index increases; color shifts up the
   accent ladder. Each row shows TON + USD.
   ---------------------------------------------------------------- */
function PyramidTier({
  title,
  caption,
  ton,
  usd,
  widthPct,
  color,
}: {
  title: string;
  caption: string;
  ton: number;
  usd: number;
  widthPct: number;
  color: string;
}) {
  return (
    <div className="flex justify-center">
      <div
        className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0c1530] via-[#070d22] to-[#040814] border transition-[width] duration-700 flex items-center justify-between gap-3 sm:gap-5 px-5 sm:px-7 py-4 sm:py-5"
        style={{
          width: `${widthPct}%`,
          borderColor: `${color}40`,
          boxShadow: `0 14px 32px -10px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px ${color}11`,
        }}
      >
        {/* Glowing left bracket — visual tier marker */}
        <span
          aria-hidden
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{ background: color, boxShadow: `0 0 14px ${color}` }}
        />

        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] tracking-[0.32em] uppercase font-semibold"
            style={{
              color,
              fontFamily: "var(--font-geist-mono), monospace",
            }}
          >
            <span>{title}</span>
            <InfoBadge label={title} />
          </span>
          <span
            className="hidden sm:inline text-[10px] sm:text-[11px] text-white/45 tracking-[0.18em] uppercase"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {caption}
          </span>
        </div>

        <div className="text-right">
          <div
            className="text-white tracking-tight tabular-nums leading-none"
            style={{ fontWeight: 800, fontSize: "clamp(20px, 2.2vw, 30px)" }}
          >
            {fmtCompactToken(ton)}{" "}
            <span className="text-white/40 text-xs sm:text-sm font-mono">TON</span>
          </div>
          <div
            className="mt-1 text-[10px] sm:text-[11px] text-white/55 tabular-nums"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            ≈ {fmtCompactUSD(usd)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   DashboardDisclaimers — fine print from the legacy dashboard.
   Lives at the end of the page so the data sections stay clean.
   ---------------------------------------------------------------- */
function DashboardDisclaimers() {
  return (
    <section className="relative w-full bg-black border-t border-white/[0.06] py-10 sm:py-12 px-4 sm:px-6">
      <ul
        className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-3 text-[11px] sm:text-[11.5px] text-white/45 leading-relaxed"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        <li className="flex gap-2">
          <span className="text-[#7AB0FF]/70 flex-shrink-0">*</span>
          <span>
            Verify each value on Etherscan. In case of discrepancies,
            Etherscan&apos;s value is considered accurate.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#7AB0FF]/70 flex-shrink-0">*</span>
          <span>
            Contract values for staking metrics need to be divided by
            10<sup>27</sup> to get the correct decimal place.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-[#7AB0FF]/70 flex-shrink-0">**</span>
          <span>
            Contract values for supply metrics need to be divided by
            10<sup>18</sup> to get the correct decimal place.
          </span>
        </li>
      </ul>
    </section>
  );
}

/* ----------------------------------------------------------------
   Radial gauge — 270° arc, fills from -135° to value%. Big number
   in the middle.
   ---------------------------------------------------------------- */
function GaugeWidget({
  label,
  value,
  sub,
  color,
  span,
}: {
  label: string;
  value: number;
  sub: string;
  color: string;
  span: string;
}) {
  const RADIUS = 70;
  const START = -225; // 270° arc starting bottom-left
  const END = 45;
  const SWEEP = END - START;
  const valueDeg = START + (Math.min(100, Math.max(0, value)) / 100) * SWEEP;

  const polar = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: RADIUS * Math.cos(rad), y: RADIUS * Math.sin(rad) };
  };
  const startPt = polar(START);
  const endPt = polar(END);
  const valuePt = polar(valueDeg);

  const arc = (from: { x: number; y: number }, to: { x: number; y: number }, deg: number) => {
    const large = deg > 180 ? 1 : 0;
    return `M ${from.x} ${from.y} A ${RADIUS} ${RADIUS} 0 ${large} 1 ${to.x} ${to.y}`;
  };

  return (
    <div
      className={`${span} relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0c1530] via-[#070d22] to-[#040814] border border-white/[0.08] shadow-[0_14px_32px_-10px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)] p-5 sm:p-6 flex flex-col`}
    >
      <div
        className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] tracking-[0.32em] uppercase text-[#7AB0FF]/85 font-semibold mb-2"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        <span>{label}</span>
        <InfoBadge label={label} />
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-0">
        <svg viewBox="-100 -100 200 160" className="w-full h-full max-w-[260px]">
          {/* Track arc */}
          <path
            d={arc(startPt, endPt, SWEEP)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d={arc(startPt, valuePt, valueDeg - START)}
            stroke={color}
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 8px ${color})` }}
          />
        </svg>
        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none mt-2">
          <div
            className="text-white leading-none tracking-tight"
            style={{ fontWeight: 900, fontSize: "clamp(28px, 4vw, 52px)" }}
          >
            {value.toFixed(1)}%
          </div>
          <div
            className="mt-2 text-[8.5px] sm:text-[9.5px] tracking-[0.28em] uppercase text-white/55"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {sub}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Sparkline — real 24h close-price series from Upbit's 60-min candles.
   Falls back to a flat line if the upstream returned nothing.
   ---------------------------------------------------------------- */
function SparklineWidget({
  series,
  currentUsd,
  span,
}: {
  series: number[];
  currentUsd: number;
  /** 24h change isn't passed here anymore — the chart recomputes it per range. */
  change24h?: number;
  positive?: boolean;
  span: string;
}) {
  return (
    <div
      className={`${span} relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0c1530] via-[#070d22] to-[#040814] border border-white/[0.08] shadow-[0_14px_32px_-10px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)] p-5 sm:p-6`}
    >
      <SparklineChart initialSeries={series} currentUsd={currentUsd} />
    </div>
  );
}

/* ----------------------------------------------------------------
   Solid metric card — high-saturation brand color block with big
   number. Same vocabulary as ProjectBento's MetricTile.
   ---------------------------------------------------------------- */
function SolidMetric({
  label,
  value,
  sub,
  palette,
  span,
}: {
  label: string;
  value: string;
  sub?: string;
  palette: number;
  span: string;
}) {
  const p = PALETTES[palette] ?? PALETTES[0];
  return (
    <div
      className={`${span} relative rounded-[28px] overflow-hidden flex flex-col justify-between p-5 sm:p-6`}
      style={{
        background: `linear-gradient(160deg, ${p.from} 0%, ${p.to} 100%)`,
        color: p.fg,
        boxShadow: `0 14px 32px -10px ${p.shadow}, inset 0 1px 0 rgba(255,255,255,0.22)`,
      }}
    >
      {/* Subtle glossy highlight on top half */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-2/3"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, transparent 100%)",
        }}
      />

      <div
        className="relative inline-flex items-center gap-1.5 text-[9.5px] sm:text-[10.5px] tracking-[0.32em] uppercase font-semibold opacity-75"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        <span>{label}</span>
        <InfoBadge label={label} />
      </div>
      <div className="relative">
        <div
          className="leading-none tracking-[-0.05em] break-all"
          style={{ fontWeight: 900, fontSize: "clamp(28px, 4.5vw, 60px)" }}
        >
          {value}
        </div>
        {sub && (
          <div
            className="mt-2 text-[9.5px] sm:text-[10.5px] tracking-[0.22em] uppercase opacity-70"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------
   Horizontal supply bar — segmented breakdown across full width
   with brand-color slices and inline labels.
   ---------------------------------------------------------------- */
function SupplyBar({
  slices,
  total,
  span,
}: {
  slices: SupplySlice[];
  total: number;
  span: string;
}) {
  return (
    <div
      className={`${span} relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0c1530] via-[#070d22] to-[#040814] border border-white/[0.08] shadow-[0_14px_32px_-10px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.07)] p-4 sm:p-5 flex flex-col justify-center`}
    >
      <div
        className="text-[9px] sm:text-[10px] tracking-[0.32em] uppercase text-[#7AB0FF]/85 font-semibold mb-3"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        Supply Allocation · 100% =&nbsp;
        <span className="text-white/85">{fmtCompactToken(total)} TON</span>
      </div>
      <div className="flex h-6 sm:h-7 w-full overflow-hidden rounded-full bg-white/[0.04]">
        {slices.map((s) => {
          const pct = (s.value / total) * 100;
          return (
            <div
              key={s.id}
              className="h-full transition-all"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${s.color}cc 0%, ${s.color}88 100%)`,
                boxShadow: `inset 0 0 12px ${s.color}66`,
              }}
              title={`${s.label} · ${pct.toFixed(2)}%`}
            />
          );
        })}
      </div>
      {/* Inline legend */}
      <ul
        className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        {slices.map((s) => (
          <li key={s.id} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-sm"
              style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
            />
            <span className="text-white/70">{s.label}</span>
            <span className="text-white/40 tabular-nums">
              {((s.value / total) * 100).toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
