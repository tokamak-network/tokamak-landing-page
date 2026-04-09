"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./styles.module.css";

interface PriceData {
  tonPrice: {
    current: { usd: number; krw: number };
    opening: { usd: number };
    closing: { usd: number };
  };
  marketCap: number;
  fullyDilutedValuation: number;
  totalSupply: number;
  circulatingSupply: number;
  stakedVolume: number;
  DAOStakedVolume: number;
  burnedSupply: number;
  circulatingSuupplyUpbitStandard: number;
  liquidity: {
    c1: number;
    c2: number;
    c3: number;
  };
}

function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}
function fmtDec(n: number, d = 4): string {
  return Number(n).toFixed(d);
}

export default function PriceCardsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [data, setData] = useState<PriceData | null>(null);

  // Derived state for delta direction
  const [deltaUp, setDeltaUp] = useState(true);
  const [deltaValue, setDeltaValue] = useState("— %");

  // Range positions (left %)
  const [rangePos, setRangePos] = useState({ open: 12, current: 50, close: 88 });

  // Donut stroke-dasharray
  const [donutDash, setDonutDash] = useState("0 1000");

  // Stack seg widths
  const [supplySegs, setSupplySegs] = useState({ circ: 0, staked: 0, dao: 0 });
  const [liqSegs, setLiqSegs] = useState({ c1: 0, c2delta: 0, locked: 0 });

  // Alt bar widths
  const [supplyAlt, setSupplyAlt] = useState({ circStrict: 0, circUpbit: 0, burned: 0 });
  const [liqAlt, setLiqAlt] = useState({ c1: 0, c2: 0, c3: 0 });

  // Visibility tracking for card reveal
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  // ── Particles canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    type Particle = { x: number; y: number; r: number; a: number; vx: number; vy: number; pulse: number; phase: number };
    let parts: Particle[] = [];

    function resize() {
      w = canvas!.width = window.innerWidth;
      h = canvas!.height = window.innerHeight;
    }
    function make() {
      parts = [];
      const count = Math.floor((w * h) / 3500);
      for (let i = 0; i < count; i++) {
        parts.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 2.5 + 0.5, a: Math.random() * 0.5 + 0.1,
          vx: (Math.random() - 0.5) * 0.3, vy: -Math.random() * 0.35 - 0.08,
          pulse: Math.random() * 0.02 + 0.008, phase: Math.random() * Math.PI * 2,
        });
      }
    }
    let t = 0;
    function draw() {
      ctx!.clearRect(0, 0, w, h);
      t += 0.016;
      for (const p of parts) {
        p.x += p.vx + Math.sin(t * 0.5 + p.phase) * 0.1;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        const f = Math.sin(t * p.pulse * 60 + p.phase) * 0.4 + 0.6;
        const alpha = p.a * f;
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0, `rgba(0, 180, 220, ${alpha})`);
        g.addColorStop(0.4, `rgba(0, 140, 200, ${alpha * 0.4})`);
        g.addColorStop(1, "rgba(0,100,180,0)");
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx!.fillStyle = g; ctx!.fill();
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(150, 220, 255, ${alpha * 1.5})`; ctx!.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    }

    resize(); make(); draw();
    const onResize = () => { resize(); make(); };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Data fetch ──
  useEffect(() => {
    fetch("/api/price")
      .then((r) => { if (!r.ok) throw new Error("fetch failed"); return r.json(); })
      .then((d: PriceData) => setData(d))
      .catch((e) => console.warn("Failed to fetch:", e));
  }, []);

  // ── Apply data when it arrives ──
  useEffect(() => {
    if (!data) return;

    const usd = data.tonPrice.current.usd;
    const open = data.tonPrice.opening.usd;
    const close = data.tonPrice.closing.usd;
    const cur = usd;

    // Delta
    const delta = ((cur - open) / open) * 100;
    setDeltaUp(delta >= 0);
    const sign = delta >= 0 ? "+" : "";
    setDeltaValue(`${sign}${delta.toFixed(2)}%`);

    // Range positions
    const vals = [open, cur, close];
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 0.0001;
    const padPct = 12;
    const usable = 100 - padPct * 2;
    const pos = (v: number) => padPct + ((v - min) / range) * usable;
    setRangePos({ open: pos(open), current: pos(cur), close: pos(close) });

    // Donut
    const mcPct = (data.marketCap / data.fullyDilutedValuation) * 100;
    const r = 82;
    const circ = 2 * Math.PI * r;
    const filled = (mcPct / 100) * circ;
    setDonutDash(`${filled} ${circ - filled}`);

    // Supply segs
    const total = data.totalSupply;
    const circPct = (data.circulatingSupply / total) * 100;
    const stakedPct = (data.stakedVolume / total) * 100;
    const daoPct = (data.DAOStakedVolume / total) * 100;
    setSupplySegs({ circ: circPct, staked: stakedPct, dao: daoPct });

    // Supply alt bars
    const upbitPct = (data.circulatingSuupplyUpbitStandard / total) * 100;
    const burnedPct = (data.burnedSupply / total) * 100;
    setSupplyAlt({ circStrict: circPct, circUpbit: upbitPct, burned: Math.max(burnedPct, 0.5) });

    // Liquidity segs
    const c1Pct = (data.liquidity.c1 / total) * 100;
    const c2Pct = (data.liquidity.c2 / total) * 100;
    const deltaC2 = Math.max(c2Pct - c1Pct, 0);
    const lockedPct = Math.max(100 - c2Pct, 0);
    setLiqSegs({ c1: c1Pct, c2delta: deltaC2, locked: lockedPct });

    // Liquidity alt bars
    const c3Pct = (data.liquidity.c3 / total) * 100;
    setLiqAlt({ c1: c1Pct, c2: c2Pct, c3: c3Pct });
  }, [data]);

  // ── Card reveal IntersectionObserver ──
  const cardObserverCb = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target as HTMLElement;
        const cardId = el.dataset.cardId;
        if (cardId) {
          const parent = el.parentElement;
          const siblings = parent ? Array.from(parent.querySelectorAll("[data-card-id]")) : [];
          const idx = siblings.indexOf(el);
          setTimeout(() => {
            setVisibleCards((prev) => new Set([...prev, cardId]));
          }, idx * 120);
        }
      }
    });
  }, []);

  const cardObserverRef = useRef<IntersectionObserver | null>(null);
  const observeCard = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    if (!cardObserverRef.current) {
      cardObserverRef.current = new IntersectionObserver(cardObserverCb, { threshold: 0.15 });
    }
    cardObserverRef.current.observe(el);
  }, [cardObserverCb]);

  // ── Derived values (computed from data) ──
  const total = data?.totalSupply ?? 0;
  const circPct = data ? (data.circulatingSupply / total) * 100 : 0;
  const stakedPct = data ? (data.stakedVolume / total) * 100 : 0;
  const daoPct = data ? (data.DAOStakedVolume / total) * 100 : 0;
  const mcPct = data ? (data.marketCap / data.fullyDilutedValuation) * 100 : 0;
  const c1Pct = data ? (data.liquidity.c1 / total) * 100 : 0;
  const c2Pct = data ? (data.liquidity.c2 / total) * 100 : 0;
  const c3Pct = data ? (data.liquidity.c3 / total) * 100 : 0;
  const upbitPct = data ? (data.circulatingSuupplyUpbitStandard / total) * 100 : 0;
  const burnedPct = data ? (data.burnedSupply / total) * 100 : 0;
  const deltaC2 = Math.max(c2Pct - c1Pct, 0);
  const lockedPct = Math.max(100 - c2Pct, 0);

  // Whether a card is visible (drives CSS class + animated widths)
  const isVisible = (id: string) => visibleCards.has(id);
  const getSegWidth = (cardId: string, pct: number) => isVisible(cardId) ? `${pct}%` : "0%";

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgAmbient} />
      <canvas ref={canvasRef} className={styles.bgParticles} id="particles" />
      <div className={styles.grain} />

      {/* SVG gradient defs for donut */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#0077ff" />
          </linearGradient>
        </defs>
      </svg>

      <div className={styles.content}>

        {/* ══════ HERO ══════ */}
        <section className={styles.hero}>
          <video autoPlay loop muted playsInline src="/videos/particles-drift.mp4" />
          <div className={styles.heroGrad} />
          <div className={styles.heroContent}>
            <div className={styles.heroTag}>TOKAMAK NETWORK &mdash; PRICE DASHBOARD</div>
            <h1 className={styles.heroH1}>
              Real-Time TON(Tokamak)
              <span className={styles.heroH1Accent}>Market Insights</span>
            </h1>
            <p className={styles.heroSub}>
              This dashboard integrates multiple data sources to provide reliable information.
              Price data is updated in real-time and is linked to market data from major exchanges.
            </p>
            <div className={styles.heroBtnRow}>
              <a href="#" className={styles.btnPrimary}>Buy TON(Tokamak)</a>
              <a href="#" className={styles.btnGhost}>Dune Dashboard</a>
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

        {/* ══════ PRICE ══════ */}
        <div className={styles.chapterWrap}>
          <section className={styles.chapter} id="ch-price">
            <div className={styles.chapterLabel}>PRICE</div>

            <div className={styles.priceGrid}>

              {/* Hero Price Card */}
              <div
                ref={observeCard}
                data-card-id="price-hero"
                className={`${styles.card} ${styles.priceHero}${isVisible("price-hero") ? " " + styles.visible : ""}`}
              >
                <div className={styles.cardTop}>
                  <span className={styles.cardLabel}>TON PRICE · LIVE</span>
                  <span className={styles.cardHint}>USD / KRW</span>
                </div>

                <div className={styles.priceHeroMain}>
                  <div className={styles.priceHeroBig}>
                    <span className={styles.priceHeroSign}>$</span>
                    <span className={styles.priceHeroVal}>
                      {data ? fmtDec(data.tonPrice.current.usd, 4) : "0.0000"}
                    </span>
                  </div>
                  <div className={styles.priceHeroKrwWrap}>
                    <span className={styles.priceHeroKrwLabel}>KRW</span>
                    <span className={styles.priceHeroKrwVal}>
                      {data ? fmtInt(data.tonPrice.current.krw) : "0"}
                    </span>
                    <span className={styles.priceHeroKrwUnit}>Korean Won</span>
                  </div>
                </div>

                <div className={styles.deltaRow}>
                  <span className={`${styles.deltaPill}${deltaUp ? " " + styles.up : " " + styles.down}`}>
                    <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8">
                      {deltaUp
                        ? <path d="M5 8 L5 2 M2 5 L5 2 L8 5" strokeLinecap="round" strokeLinejoin="round" />
                        : <path d="M5 2 L5 8 M2 5 L5 8 L8 5" strokeLinecap="round" strokeLinejoin="round" />
                      }
                    </svg>
                    <span>{deltaValue}</span>
                  </span>
                  <span className={styles.deltaLabel}>VS 24H OPENING</span>
                </div>

                <div className={styles.rangeBlock}>
                  <div className={styles.rangeTitle}>24H RANGE · OPENING → CURRENT → CLOSING</div>
                  <div className={styles.rangeTrack}>
                    <div className={styles.rangeMark} style={{ left: `${rangePos.open}%` }}>
                      <span className={styles.rangeMarkLabel}>OPEN</span>
                      <div className={styles.rangeMarkDot} />
                      <span className={styles.rangeMarkVal}>
                        {data ? "$" + fmtDec(data.tonPrice.opening.usd, 4) : "—"}
                      </span>
                    </div>
                    <div className={`${styles.rangeMark} ${styles.current}`} style={{ left: `${rangePos.current}%` }}>
                      <span className={styles.rangeMarkLabel}>CURRENT</span>
                      <div className={styles.rangeMarkDot} />
                      <span className={styles.rangeMarkVal}>
                        {data ? "$" + fmtDec(data.tonPrice.current.usd, 4) : "—"}
                      </span>
                    </div>
                    <div className={styles.rangeMark} style={{ left: `${rangePos.close}%` }}>
                      <span className={styles.rangeMarkLabel}>CLOSE</span>
                      <div className={styles.rangeMarkDot} />
                      <span className={styles.rangeMarkVal}>
                        {data ? "$" + fmtDec(data.tonPrice.closing.usd, 4) : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.cardDesc}>
                  Live market price with intraday snapshot across three reference points.
                  Current price is continuously updated from major exchange feeds.
                </div>
              </div>

              {/* Market Metrics Card (donut: MC vs FDV) */}
              <div
                ref={observeCard}
                data-card-id="metrics"
                className={`${styles.card} ${styles.metricsCard}${isVisible("metrics") ? " " + styles.visible : ""}`}
              >
                <div className={styles.cardTop}>
                  <span className={styles.cardLabel}>MARKET METRICS</span>
                  <span className={styles.cardHint}>MC / FDV</span>
                </div>

                <div className={styles.metricsDonutWrap}>
                  <svg className={styles.metricsDonut} viewBox="0 0 200 200">
                    <circle className={styles.metricsDonutTrack} cx="100" cy="100" r="82" />
                    <circle
                      className={styles.metricsDonutArc}
                      cx="100" cy="100" r="82"
                      style={isVisible("metrics") ? { strokeDasharray: donutDash } : { strokeDasharray: "0 1000" }}
                    />
                  </svg>
                  <div className={styles.metricsDonutCenter}>
                    <div className={styles.metricsDonutPct}>
                      {data ? mcPct.toFixed(1) + "%" : "—"}
                    </div>
                    <div className={styles.metricsDonutCaption}>OF FULLY<br />DILUTED</div>
                  </div>
                </div>

                <div className={styles.metricsRow}>
                  <div className={styles.metricsItem}>
                    <span className={styles.metricsItemLabel}>MARKET CAP</span>
                    <span className={styles.metricsItemVal}>$<span>{data ? fmtInt(data.marketCap) : "—"}</span></span>
                    <span className={styles.metricsItemUnit}>USD</span>
                  </div>
                  <div className={styles.metricsItem}>
                    <span className={styles.metricsItemLabel}>FDV</span>
                    <span className={styles.metricsItemVal}>$<span>{data ? fmtInt(data.fullyDilutedValuation) : "—"}</span></span>
                    <span className={styles.metricsItemUnit}>USD</span>
                  </div>
                </div>

                <div className={styles.cardDesc}>
                  Ratio of circulating market cap to fully diluted valuation
                  at current TON price.
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* ══════ INTERLUDE: SUPPLY ══════ */}
        <section className={`${styles.videoInterlude} ${styles.viStart}`}>
          <video autoPlay loop muted playsInline src="/videos/start-section.mp4" />
          <div className={styles.gradTop} /><div className={styles.gradBottom} />
          <div className={styles.viContent}>
            <div className={styles.viBadge}>Supply Distribution</div>
            <h2 className={styles.viHeading}>Where value flows.<br />How supply distributes.</h2>
            <p className={styles.viDesc}>
              The entire Tokamak Network token supply — generated through seigniorage,
              distributed across staking, governance, and the open market.
            </p>
          </div>
        </section>

        {/* ══════ SUPPLY ══════ */}
        <div className={styles.chapterWrap}>
          <section className={styles.chapter} id="ch-supply">
            <div className={styles.chapterLabel}>SUPPLY</div>

            <div
              ref={observeCard}
              data-card-id="supply"
              className={`${styles.card} ${styles.bigCard}${isVisible("supply") ? " " + styles.visible : ""}`}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardLabel}>TOTAL SUPPLY · DISTRIBUTION</span>
                <span className={styles.cardHint}>MUTUALLY EXCLUSIVE SEGMENTS</span>
              </div>

              <div className={styles.bigCardTotal}>
                <span className={styles.bigCardTotalLabel}>TOTAL</span>
                <span className={styles.bigCardTotalVal}>{data ? fmtInt(total) : "—"}</span>
                <span className={styles.bigCardTotalUnit}>TON · 100%</span>
              </div>

              <div className={styles.stackBar} id="supplyStack">
                <div
                  className={`${styles.stackSeg} ${styles.stackSeg1}`}
                  style={{ width: getSegWidth("supply", supplySegs.circ) }}
                >
                  <div className={styles.stackSegInner}>CIRCULATING <strong>{circPct.toFixed(1)}%</strong></div>
                </div>
                <div
                  className={`${styles.stackSeg} ${styles.stackSeg2}`}
                  style={{ width: getSegWidth("supply", supplySegs.staked) }}
                >
                  <div className={styles.stackSegInner}>STAKED <strong>{stakedPct.toFixed(1)}%</strong></div>
                </div>
                <div
                  className={`${styles.stackSeg} ${styles.stackSeg3}`}
                  style={{ width: getSegWidth("supply", supplySegs.dao) }}
                >
                  <div className={styles.stackSegInner}>DAO <strong>{daoPct.toFixed(1)}%</strong></div>
                </div>
              </div>

              <div className={styles.stackLegend}>
                <div className={`${styles.legendItem} ${styles.seg1}`}>
                  <div className={styles.legendHeader}>
                    <span className={styles.legendDot} />
                    <span className={styles.legendLabel}>CIRCULATING</span>
                  </div>
                  <div className={styles.legendVal}>
                    <span>{data ? fmtInt(data.circulatingSupply) : "—"}</span>
                    <span className={styles.legendValUnit}>TON</span>
                  </div>
                  <span className={styles.legendPct}>{data ? circPct.toFixed(1) + "%" : "— %"}</span>
                  <p className={styles.legendSub}>Available in the open market for trading and transfers.</p>
                </div>
                <div className={`${styles.legendItem} ${styles.seg2}`}>
                  <div className={styles.legendHeader}>
                    <span className={styles.legendDot} />
                    <span className={styles.legendLabel}>STAKED</span>
                  </div>
                  <div className={styles.legendVal}>
                    <span>{data ? fmtInt(data.stakedVolume) : "—"}</span>
                    <span className={styles.legendValUnit}>TON</span>
                  </div>
                  <span className={styles.legendPct}>{data ? stakedPct.toFixed(1) + "%" : "— %"}</span>
                  <p className={styles.legendSub}>Locked in staking contracts, earning seigniorage rewards.</p>
                </div>
                <div className={`${styles.legendItem} ${styles.seg3}`}>
                  <div className={styles.legendHeader}>
                    <span className={styles.legendDot} />
                    <span className={styles.legendLabel}>DAO VAULT</span>
                  </div>
                  <div className={styles.legendVal}>
                    <span>{data ? fmtInt(data.DAOStakedVolume) : "—"}</span>
                    <span className={styles.legendValUnit}>TON</span>
                  </div>
                  <span className={styles.legendPct}>{data ? daoPct.toFixed(1) + "%" : "— %"}</span>
                  <p className={styles.legendSub}>Held indefinitely in the DAO treasury for governance.</p>
                </div>
              </div>

              <div className={styles.altClass}>
                <div className={styles.altClassTitle}>ALTERNATIVE CLASSIFICATIONS</div>
                <div className={styles.altList}>
                  <div className={styles.altItem}>
                    <div className={styles.altLabel}>CIRCULATING (STRICT)<span>Open market only</span></div>
                    <div className={styles.altBar}>
                      <div className={styles.altBarFill} style={{ width: isVisible("supply") ? `${supplyAlt.circStrict}%` : "0%" }} />
                    </div>
                    <span className={styles.altVal}><span>{data ? fmtInt(data.circulatingSupply) : "—"}</span> TON</span>
                    <span className={styles.altPct}>{data ? circPct.toFixed(1) + "%" : "—"}</span>
                  </div>
                  <div className={styles.altItem}>
                    <div className={styles.altLabel}>CIRCULATING (UPBIT)<span>Includes staked</span></div>
                    <div className={styles.altBar}>
                      <div className={styles.altBarFill} style={{ width: isVisible("supply") ? `${supplyAlt.circUpbit}%` : "0%" }} />
                    </div>
                    <span className={styles.altVal}><span>{data ? fmtInt(data.circulatingSuupplyUpbitStandard) : "—"}</span> TON</span>
                    <span className={styles.altPct}>{data ? upbitPct.toFixed(1) + "%" : "—"}</span>
                  </div>
                  <div className={styles.altItem}>
                    <div className={styles.altLabel}>BURNED (HISTORICAL)<span>Removed from supply</span></div>
                    <div className={styles.altBar}>
                      <div className={styles.altBarFill} style={{ width: isVisible("supply") ? `${supplyAlt.burned}%` : "0%" }} />
                    </div>
                    <span className={styles.altVal}><span>{data ? fmtInt(data.burnedSupply) : "—"}</span> TON</span>
                    <span className={styles.altPct}>{data ? burnedPct.toFixed(2) + "%" : "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ══════ LIQUIDITY ══════ */}
        <div className={styles.chapterWrap}>
          <section className={styles.chapter} id="ch-liquidity">
            <div className={styles.chapterLabel}>LIQUIDITY</div>

            <div
              ref={observeCard}
              data-card-id="liquidity"
              className={`${styles.card} ${styles.bigCard}${isVisible("liquidity") ? " " + styles.visible : ""}`}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardLabel}>LIQUIDITY TIERS · OF TOTAL SUPPLY</span>
                <span className={styles.cardHint}>CUMULATIVE · C1 ⊂ C2 = C3</span>
              </div>

              <div className={styles.bigCardTotal}>
                <span className={styles.bigCardTotalLabel}>TOTAL</span>
                <span className={styles.bigCardTotalVal}>{data ? fmtInt(total) : "—"}</span>
                <span className={styles.bigCardTotalUnit}>TON · 100%</span>
              </div>

              <div className={styles.stackBar} id="liqStack">
                <div
                  className={`${styles.stackSeg} ${styles.stackSeg1}`}
                  style={{ width: getSegWidth("liquidity", liqSegs.c1) }}
                >
                  <div className={styles.stackSegInner}>C1 <strong>{c1Pct.toFixed(1)}%</strong></div>
                </div>
                <div
                  className={`${styles.stackSeg} ${styles.stackSeg2}`}
                  style={{ width: getSegWidth("liquidity", liqSegs.c2delta) }}
                >
                  <div className={styles.stackSegInner}>+STAKED <strong>+{deltaC2.toFixed(1)}%</strong></div>
                </div>
                <div
                  className={`${styles.stackSeg} ${styles.stackSeg4}`}
                  style={{ width: getSegWidth("liquidity", liqSegs.locked) }}
                >
                  <div className={styles.stackSegInner}>LOCKED <strong>{lockedPct.toFixed(1)}%</strong></div>
                </div>
              </div>

              <div className={styles.stackLegend}>
                <div className={`${styles.legendItem} ${styles.seg1}`}>
                  <div className={styles.legendHeader}>
                    <span className={styles.legendDot} />
                    <span className={styles.legendLabel}>C1 LIQUIDITY</span>
                  </div>
                  <div className={styles.legendVal}>
                    <span>{data ? fmtInt(data.liquidity.c1) : "—"}</span>
                    <span className={styles.legendValUnit}>TON</span>
                  </div>
                  <span className={styles.legendPct}>{data ? c1Pct.toFixed(1) + "%" : "— %"}</span>
                  <p className={styles.legendSub}>Immediately available — excludes staked, vested, and DAO vault holdings.</p>
                </div>
                <div className={`${styles.legendItem} ${styles.seg2}`}>
                  <div className={styles.legendHeader}>
                    <span className={styles.legendDot} />
                    <span className={styles.legendLabel}>C2 LIQUIDITY</span>
                  </div>
                  <div className={styles.legendVal}>
                    <span>{data ? fmtInt(data.liquidity.c2) : "—"}</span>
                    <span className={styles.legendValUnit}>TON</span>
                  </div>
                  <span className={styles.legendPct}>{data ? c2Pct.toFixed(1) + "%" : "— %"}</span>
                  <p className={styles.legendSub}>Short-term accessible — includes tokens locked under 3 months.</p>
                </div>
                <div className={`${styles.legendItem} ${styles.seg3}`}>
                  <div className={styles.legendHeader}>
                    <span className={styles.legendDot} />
                    <span className={styles.legendLabel}>C3 LIQUIDITY</span>
                  </div>
                  <div className={styles.legendVal}>
                    <span>{data ? fmtInt(data.liquidity.c3) : "—"}</span>
                    <span className={styles.legendValUnit}>TON</span>
                  </div>
                  <span className={styles.legendPct}>{data ? c3Pct.toFixed(1) + "%" : "— %"}</span>
                  <p className={styles.legendSub}>Full picture — no additional long-term locks beyond staking.</p>
                </div>
              </div>

              <div className={styles.altClass}>
                <div className={styles.altClassTitle}>TIER COMPARISON · VS TOTAL SUPPLY</div>
                <div className={styles.altList}>
                  <div className={styles.altItem}>
                    <div className={styles.altLabel}>C1 · IMMEDIATE<span>Excludes all locks</span></div>
                    <div className={styles.altBar}>
                      <div className={styles.altBarFill} style={{ width: isVisible("liquidity") ? `${liqAlt.c1}%` : "0%" }} />
                    </div>
                    <span className={styles.altVal}><span>{data ? fmtInt(data.liquidity.c1) : "—"}</span> TON</span>
                    <span className={styles.altPct}>{data ? c1Pct.toFixed(1) + "%" : "—"}</span>
                  </div>
                  <div className={styles.altItem}>
                    <div className={styles.altLabel}>C2 · SHORT-TERM<span>C1 + staked</span></div>
                    <div className={styles.altBar}>
                      <div className={styles.altBarFill} style={{ width: isVisible("liquidity") ? `${liqAlt.c2}%` : "0%" }} />
                    </div>
                    <span className={styles.altVal}><span>{data ? fmtInt(data.liquidity.c2) : "—"}</span> TON</span>
                    <span className={styles.altPct}>{data ? c2Pct.toFixed(1) + "%" : "—"}</span>
                  </div>
                  <div className={styles.altItem}>
                    <div className={styles.altLabel}>C3 · FULL<span>C2 = C3</span></div>
                    <div className={styles.altBar}>
                      <div className={styles.altBarFill} style={{ width: isVisible("liquidity") ? `${liqAlt.c3}%` : "0%" }} />
                    </div>
                    <span className={styles.altVal}><span>{data ? fmtInt(data.liquidity.c3) : "—"}</span> TON</span>
                    <span className={styles.altPct}>{data ? c3Pct.toFixed(1) + "%" : "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>{/* /.content */}

      {/* ══════ CTA ══════ */}
      <section className={`${styles.videoInterlude} ${styles.viCta}`}>
        <video autoPlay loop muted playsInline src="/videos/cta-nebula.mp4" />
        <div className={styles.gradTop} /><div className={styles.gradBottom} />
        <div className={styles.viContent}>
          <h2 className={styles.viCtaHeading}>Explore the full picture.</h2>
          <p className={styles.viCtaDesc}>
            Real-time on-chain data, transparent tokenomics, and verifiable metrics —
            everything you need to understand TON.
          </p>
          <div className={styles.viBtnRow}>
            <a
              href="https://dune.com/tokamak-network/tokamak-network-tokenomics-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viBtnGlass}
            >
              View on Dune
            </a>
            <a
              href="https://docs.tokamak.network/home/information/get-ton"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.viBtnSolid}
            >
              Buy TON
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
