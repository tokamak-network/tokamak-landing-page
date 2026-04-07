"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LINKS } from "@/app/constants/links";
import { formatInteger } from "@/app/lib/utils/format";
import styles from "./styles.module.css";

/* ── Pop-in stat with count-up (appears one by one vertically) ── */
function PopStat({
  value,
  unit,
  label,
  desc,
  delay,
}: {
  value: string;
  unit: string;
  label: string;
  desc: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  const animate = useCallback(() => {
    const cleaned = value.replace(/[,%]/g, "");
    const target = parseFloat(cleaned);
    if (isNaN(target) || target === 0) {
      setDisplay(value);
      return;
    }

    const isPercent = value.endsWith("%");
    const hasCommas = value.includes(",");
    const duration = 1800;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (isPercent) {
        setDisplay(`${current.toFixed(1)}%`);
      } else if (hasCommas) {
        setDisplay(Math.round(current).toLocaleString("en-US"));
      } else {
        setDisplay(String(Math.round(current)));
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    }

    requestAnimationFrame(tick);
  }, [value]);

  useEffect(() => {
    const el = ref.current;
    if (!el || triggered.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          triggered.current = true;
          setTimeout(() => {
            setVisible(true);
            if (value !== "-") animate();
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, value, animate]);

  // Re-animate when data arrives after trigger
  useEffect(() => {
    if (triggered.current && visible && value !== "-" && value !== "0") {
      animate();
    }
  }, [value, visible, animate]);

  return (
    <div
      ref={ref}
      className={`${styles.popStat}${visible ? ` ${styles.popStatVisible}` : ""}`}
    >
      <div className={styles.popStatLabel}>{label}</div>
      <div className={styles.popStatVal}>
        {value === "-" ? "-" : display}
      </div>
      <div className={styles.popStatUnit}>{unit}</div>
      <div className={styles.popStatDesc}>{desc}</div>
    </div>
  );
}

interface PriceData {
  tonPrice: {
    current: { usd: number; krw: number };
    opening: { usd: number; krw: number };
    closing: { usd: number; krw: number };
  };
  marketCap: number;
  fullyDilutedValuation: number;
  totalSupply: number;
  circulatingSupply: number;
  circulatingSuupplyUpbitStandard: number;
  burnedSupply: number;
  DAOStakedVolume: number;
  stakedVolume: number;
  liquidity: { c1: number; c2: number; c3: number };
  liquidityUSD: { c1: number; c2: number; c3: number };
}

interface DataCardProps {
  label: string;
  val: string;
  unit: string;
  pct?: string;
  desc: string;
}

function DataCard({ label, val, unit, pct, desc }: DataCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger based on sibling index
            const parent = el.parentElement;
            const cards = parent
              ? Array.from(parent.querySelectorAll("[data-card]"))
              : [];
            const idx = cards.indexOf(el);
            setTimeout(() => setVisible(true), idx * 100);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-card=""
      className={`${styles.dataCard}${visible ? ` ${styles.visible}` : ""}`}
    >
      <div className={styles.cardLabel}>{label}</div>
      <div className={styles.cardVal}>{val}</div>
      <span className={styles.cardUnit}>{unit}</span>
      {pct && <div className={styles.cardPct}>{pct}</div>}
      <div className={styles.cardDesc}>{desc}</div>
    </div>
  );
}

function RevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.reveal}${visible ? ` ${styles.visible}` : ""}`}
    >
      {children}
    </div>
  );
}

export default function PriceV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<PriceData | null>(null);

  // Floating particles (underwater feel)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: {
      x: number;
      y: number;
      r: number;
      a: number;
      vx: number;
      vy: number;
      pulse: number;
      phase: number;
    }[] = [];
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function make() {
      particles = [];
      const count = Math.floor((w * h) / 3500);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 2.5 + 0.5,
          a: Math.random() * 0.5 + 0.1,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.35 - 0.08,
          pulse: Math.random() * 0.02 + 0.008,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let t = 0;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      t += 0.016;
      for (const p of particles) {
        p.x += p.vx + Math.sin(t * 0.5 + p.phase) * 0.1;
        p.y += p.vy;
        // Wrap around
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const f = Math.sin(t * p.pulse * 60 + p.phase) * 0.4 + 0.6;
        const alpha = p.a * f;
        // Soft glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, `rgba(0, 180, 220, ${alpha})`);
        grad.addColorStop(0.4, `rgba(0, 140, 200, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(0, 100, 180, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150, 220, 255, ${alpha * 1.5})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    make();
    draw();

    const onResize = () => {
      resize();
      make();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Data fetch
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/price");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch {
        // silently fail — cards show "-" placeholders
      }
    }
    fetchData();
  }, []);

  const d = data;

  // Derived display values
  const tonPriceCurrent = d
    ? `${formatInteger(d.tonPrice.current.usd)}`
    : "-";
  const tonPriceCurrentUnit = d
    ? `USD / ${formatInteger(d.tonPrice.current.krw)} KRW`
    : "USD";
  const tonPriceOpening = d
    ? `${formatInteger(d.tonPrice.opening.usd)}`
    : "-";
  const tonPriceOpeningUnit = d
    ? `USD / ${formatInteger(d.tonPrice.opening.krw)} KRW`
    : "USD";
  const tonPriceClosing = d
    ? `${formatInteger(d.tonPrice.closing.usd)}`
    : "-";
  const tonPriceClosingUnit = d
    ? `USD / ${formatInteger(d.tonPrice.closing.krw)} KRW`
    : "USD";
  const marketCap = d ? formatInteger(d.marketCap) : "-";
  const fdv = d ? formatInteger(d.fullyDilutedValuation) : "-";

  const totalSupply = d ? formatInteger(d.totalSupply) : "-";
  const circulatingSupply = d ? formatInteger(d.circulatingSupply) : "-";
  const circulatingUpbit = d
    ? formatInteger(d.circulatingSuupplyUpbitStandard)
    : "-";
  const burnedSupply = d ? formatInteger(d.burnedSupply) : "-";

  const daoStaked = d ? formatInteger(d.DAOStakedVolume) : "-";
  const staked = d ? formatInteger(d.stakedVolume) : "-";

  const c1 = d ? formatInteger(d.liquidity.c1) : "-";
  const c2 = d ? formatInteger(d.liquidity.c2) : "-";
  const c3 = d ? formatInteger(d.liquidity.c3) : "-";

  // Stats interlude derived values
  const stakedStat = d ? formatInteger(d.stakedVolume) : "-";
  const daoStat = d ? formatInteger(d.DAOStakedVolume) : "-";
  const stakingRatio =
    d && d.totalSupply > 0
      ? `${((d.stakedVolume / d.totalSupply) * 100).toFixed(1)}%`
      : "-";

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgAmbient} />
      <canvas ref={canvasRef} className={styles.bgParticles} />
      <div className={styles.grain} />

      <div className={styles.content}>
        {/* ══════ HERO ══════ */}
        <section className={styles.hero}>
          <video
            className={styles.heroVideo}
            autoPlay
            loop
            muted
            playsInline
            src="/videos/particles-drift.mp4"
          />
          <div className={styles.heroGradV} />
          <div className={styles.heroContent}>
            <div className={styles.heroTag}>
              TOKAMAK NETWORK &mdash; PRICE DASHBOARD
            </div>
            <h1 className={styles.heroH1}>
              Real-Time TON(Tokamak)
              <span className={styles.heroH1Accent}>Market Insights</span>
            </h1>
            <p className={styles.heroSub}>
              This dashboard integrates multiple data sources to provide
              reliable information. Price data is updated in real-time and is
              linked to market data from major exchanges to ensure accuracy.
            </p>
            <div className={styles.heroBtnRow}>
              <a
                href={LINKS.GET_TON}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                Buy TON(Tokamak)
              </a>
              <a
                href={LINKS.DUNE_DASHBOARD}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnGhost}
              >
                Dune Dashboard
              </a>
            </div>
            <div className={styles.scrollHint}>
              SCROLL TO EXPLORE
              <div className={styles.scrollHintIcon}>
                <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                  <rect
                    x="1"
                    y="1"
                    width="14"
                    height="22"
                    rx="7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="8" cy="8" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ PRICE DATA ══════ */}
        <div className={styles.chapterWrap}><section className={styles.chapter} id="ch-price">
          <div className={styles.chapterLabel}>PRICE</div>
          <div className={`${styles.dataRow} ${styles.c5}`}>
            <DataCard
              label="TON PRICE"
              val={tonPriceCurrent}
              unit={tonPriceCurrentUnit}
              desc="Current market price across major exchanges"
            />
            <DataCard
              label="24H OPENING"
              val={tonPriceOpening}
              unit={tonPriceOpeningUnit}
              desc="Opening price at the start of trading day"
            />
            <DataCard
              label="24H CLOSING"
              val={tonPriceClosing}
              unit={tonPriceClosingUnit}
              desc="Most recent closing price within 24 hours"
            />
            <DataCard
              label="MARKET CAP"
              val={marketCap}
              unit="USD"
              desc="Total value of all circulating TON tokens"
            />
            <DataCard
              label="FDV"
              val={fdv}
              unit="USD"
              desc="Fully diluted valuation at current price"
            />
          </div>
        </section></div>

        {/* ══════ INTERLUDE 1: Price → Supply ══════ */}
        <section className={`${styles.videoInterlude} ${styles.viStart}`}>
          <video autoPlay loop muted playsInline src="/videos/start-section.mp4" />
          <div className={styles.gradTop} />
          <div className={styles.gradBottom} />
          <RevealSection>
            <div className={styles.viStartContent}>
              <div className={`${styles.viBadge} ${styles.liquidGlass}`}>
                Supply Distribution
              </div>
              <h2 className={styles.viHeading}>
                Where value flows.
                <br />
                How supply distributes.
              </h2>
              <p className={styles.viDesc}>
                50.6M TON comprises the entire Tokamak Network token supply —
                generated through seigniorage, distributed across staking,
                governance, and the open market.
              </p>
              <button className={`${styles.viBtn} ${styles.liquidGlassStrong}`}>
                Explore Supply
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </button>
            </div>
          </RevealSection>
        </section>

        {/* ══════ SUPPLY DATA ══════ */}
        <div className={styles.chapterWrap}><section className={styles.chapter} id="ch-supply">
          <div className={styles.chapterLabel}>SUPPLY</div>
          <div className={`${styles.dataRow} ${styles.c4}`}>
            <DataCard
              label="TOTAL SUPPLY"
              val={totalSupply}
              unit="TON"
              pct="100%"
              desc="Total tokens ever created through seigniorage"
            />
            <DataCard
              label="CIRCULATING"
              val={circulatingSupply}
              unit="TON"
              desc="Available in the open market for trading and transfers"
            />
            <DataCard
              label="CIRCULATING (UPBIT)"
              val={circulatingUpbit}
              unit="TON"
              desc="Upbit standard circulating supply measurement"
            />
            <DataCard
              label="BURNED"
              val={burnedSupply}
              unit="TON"
              pct="<0.01%"
              desc="Permanently removed from total supply"
            />
          </div>
        </section></div>

        {/* ══════ INTERLUDE 2: Supply → Locked ══════ */}
        <section className={`${styles.videoInterlude} ${styles.viStats}`}>
          <video autoPlay loop muted playsInline src="/videos/stats.mp4" />
          <div className={styles.gradTop} />
          <div className={styles.gradBottom} />
          <div className={styles.popStatsColumn}>
            <PopStat
              value={stakedStat}
              unit="TON"
              label="TOTAL STAKED"
              desc="Locked in staking contracts, securing the network and earning seigniorage rewards"
              delay={0}
            />
            <PopStat
              value={daoStat}
              unit="TON"
              label="DAO VAULT"
              desc="Held indefinitely in the DAO treasury for governance and ecosystem development"
              delay={300}
            />
            <PopStat
              value={stakingRatio}
              unit="of Total Supply"
              label="STAKING RATIO"
              desc="Proportion of total supply currently locked in staking — a key network health metric"
              delay={600}
            />
          </div>
        </section>

        {/* ══════ LOCKED DATA ══════ */}
        <div className={styles.chapterWrap}><section className={styles.chapter} id="ch-locked">
          <div className={styles.chapterLabel}>LOCKED</div>
          <div className={`${styles.dataRow} ${styles.c3}`}>
            <DataCard
              label="DAO VAULT"
              val={daoStaked}
              unit="TON"
              desc="Held indefinitely in the DAO treasury for governance"
            />
            <DataCard
              label="STAKED"
              val={staked}
              unit="TON"
              desc="Locked in staking contracts, earning seigniorage rewards"
            />
            <DataCard
              label="VESTED"
              val="0"
              unit="TON"
              pct="0%"
              desc="All vesting concluded on December 26, 2023"
            />
          </div>
        </section></div>

        {/* ══════ INTERLUDE 3: Locked → Liquidity ══════ */}
        <section className={`${styles.videoInterlude} ${styles.viCta}`}>
          <video autoPlay loop muted playsInline src="/videos/liquidity-flow.mp4" />
          <div className={styles.gradTop} />
          <div className={styles.gradBottom} />
          <RevealSection>
            <div className={styles.viCtaContent}>
              <h2 className={styles.viCtaHeading}>
                Liquidity that
                <br />
                never sleeps.
              </h2>
              <p className={styles.viCtaDesc}>
                Three tiers of liquidity measurement — from immediately
                available to long-term locked. Transparent, verifiable, always
                on-chain.
              </p>
              <div className={styles.viBtnRow}>
                <a
                  href={LINKS.DUNE_DASHBOARD}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.viBtnGlass} ${styles.liquidGlassStrong}`}
                >
                  View on Dune
                </a>
                <a
                  href={LINKS.GET_TON}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viBtnSolid}
                >
                  Buy TON
                </a>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ══════ LIQUIDITY DATA ══════ */}
        <div className={styles.chapterWrap}><section className={styles.chapter} id="ch-liquidity">
          <div className={styles.chapterLabel}>LIQUIDITY</div>
          <div className={`${styles.dataRow} ${styles.c3}`}>
            <DataCard
              label="C1 LIQUIDITY"
              val={c1}
              unit="TON"
              desc="Immediately available — excludes staked, vested, and DAO vault"
            />
            <DataCard
              label="C2 LIQUIDITY"
              val={c2}
              unit="TON"
              pct="C1 + Staked"
              desc="Short-term accessible, including tokens locked under 3 months"
            />
            <DataCard
              label="C3 LIQUIDITY"
              val={c3}
              unit="TON"
              pct="C2 = C3"
              desc="Full picture — no additional long-term locks beyond staking"
            />
          </div>
        </section></div>
      </div>
    </div>
  );
}
