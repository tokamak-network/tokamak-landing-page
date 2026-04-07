"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { LINKS } from "@/app/constants/links";
import { formatInteger } from "@/app/lib/utils/format";
import styles from "./styles.module.css";

gsap.registerPlugin(ScrollTrigger);

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
  delay?: number;
}

function DataCard({ label, val, unit, pct, desc, delay = 0 }: DataCardProps) {
  return (
    <motion.div
      className={styles.dataCard}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.cardLabel}>{label}</div>
      <div className={styles.cardVal}>{val}</div>
      <span className={styles.cardUnit}>{unit}</span>
      {pct && <div className={styles.cardPct}>{pct}</div>}
      <div className={styles.cardDesc}>{desc}</div>
    </motion.div>
  );
}

interface ScrollInterlud {
  videoSrc: string;
  items: {
    label: string;
    title: string;
    desc: string;
    metricVal: string;
    metricUnit: string;
  }[];
}

function ScrollInterlude({ videoSrc, items }: ScrollInterlud) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    let ctx: gsap.Context;

    const setup = () => {
      ctx = gsap.context(() => {
        // Video scroll scrub
        gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            onUpdate: (self) => {
              if (video.duration) {
                video.currentTime = self.progress * video.duration;
              }
              if (progressFillRef.current) {
                progressFillRef.current.style.transform = `scaleY(${self.progress})`;
              }
              const idx = Math.min(
                Math.floor(self.progress * items.length),
                items.length - 1
              );
              setActiveIndex(idx);
            },
          },
        });

        // Animate each item text
        items.forEach((_, i) => {
          const itemEl = container.querySelector(`[data-scroll-item="${i}"]`);
          if (!itemEl) return;

          gsap.fromTo(
            itemEl,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              scrollTrigger: {
                trigger: itemEl,
                start: "top 80%",
                end: "top 40%",
                scrub: true,
              },
            }
          );

          if (i < items.length - 1) {
            gsap.fromTo(
              itemEl,
              { opacity: 1 },
              {
                opacity: 0,
                duration: 0.5,
                scrollTrigger: {
                  trigger: itemEl,
                  start: "bottom 60%",
                  end: "bottom 20%",
                  scrub: true,
                },
              }
            );
          }
        });

        // Animate metrics
        container.querySelectorAll("[data-metric]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0.8 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              scrollTrigger: {
                trigger: el,
                start: "top 75%",
                end: "top 50%",
                scrub: true,
              },
            }
          );
        });
      }, container);
    };

    const onCanPlay = () => {
      setVideoReady(true);
      video.pause();
      setup();
    };

    if (video.readyState >= 3) {
      onCanPlay();
    } else {
      video.addEventListener("canplaythrough", onCanPlay, { once: true });
    }

    return () => {
      ctx?.revert();
      video.removeEventListener("canplaythrough", onCanPlay);
    };
  }, [items]);

  return (
    <div
      ref={containerRef}
      className={styles.scrollSection}
      style={{ height: `${items.length * 100}vh` }}
    >
      {/* Sticky video + overlays */}
      <div className={styles.scrollSticky}>
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          className={`${styles.scrollVideo}${videoReady ? ` ${styles.videoReady}` : ""}`}
        />

        {/* Gradient overlays */}
        <div className={styles.scrollGradH} />
        <div className={styles.scrollGradV} />

        {/* Left progress bar */}
        <div className={styles.scrollProgress}>
          <div className={styles.scrollProgressTrack}>
            <div ref={progressFillRef} className={styles.scrollProgressFill} />
          </div>
          {items.map((item, i) => (
            <button
              key={i}
              className={`${styles.scrollProgressDot}${i === activeIndex ? ` ${styles.active}` : ""}`}
              onClick={() => {
                const target = containerRef.current?.querySelector(
                  `[data-scroll-item="${i}"]`
                );
                target?.scrollIntoView({ behavior: "smooth" });
              }}
              aria-label={item.label}
            />
          ))}
        </div>

        {/* Section label badge */}
        <div className={styles.scrollSectionBadge}>
          {items[activeIndex].label}
        </div>
      </div>

      {/* Scrollable section triggers */}
      {items.map((item, i) => (
        <div
          key={i}
          data-scroll-item={i}
          className={styles.scrollItem}
          style={{ top: `${i * 100}vh` }}
        >
          <div className={styles.scrollItemInner}>
            {/* Text — left */}
            <div className={styles.scrollTextSide}>
              <p className={styles.scrollItemLabel}>{item.label}</p>
              <h2 className={styles.scrollItemTitle}>{item.title}</h2>
              <p className={styles.scrollItemDesc}>{item.desc}</p>
            </div>
            {/* Metric — right */}
            <div className={styles.scrollMetricSide}>
              <div data-metric className={styles.scrollMetric}>
                <div className={styles.scrollMetricVal}>{item.metricVal}</div>
                <div className={styles.scrollMetricUnit}>{item.metricUnit}</div>
                <div className={styles.scrollMetricLine} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PriceV3() {
  const starfieldRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<PriceData | null>(null);

  // Starfield canvas
  useEffect(() => {
    const canvas = starfieldRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let stars: { x: number; y: number; r: number; a: number; twinkle: number; phase: number }[] = [];
    let w = 0;
    let h = 0;

    function resize() {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function makeStars() {
      stars = [];
      const count = Math.floor((w * h) / 3000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.2 + 0.2,
          a: Math.random() * 0.5 + 0.1,
          twinkle: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    let t = 0;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      t += 0.016;
      for (const s of stars) {
        const alpha = s.a * (Math.sin(t * s.twinkle * 60 + s.phase) * 0.3 + 0.7);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 220, 255, ${alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    makeStars();
    draw();

    const onResize = () => { resize(); makeStars(); };
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

  const tonPriceCurrent = d ? `${formatInteger(d.tonPrice.current.usd)}` : "-";
  const tonPriceCurrentUnit = d ? `USD / ${formatInteger(d.tonPrice.current.krw)} KRW` : "USD";
  const tonPriceOpening = d ? `${formatInteger(d.tonPrice.opening.usd)}` : "-";
  const tonPriceOpeningUnit = d ? `USD / ${formatInteger(d.tonPrice.opening.krw)} KRW` : "USD";
  const tonPriceClosing = d ? `${formatInteger(d.tonPrice.closing.usd)}` : "-";
  const tonPriceClosingUnit = d ? `USD / ${formatInteger(d.tonPrice.closing.krw)} KRW` : "USD";
  const marketCap = d ? formatInteger(d.marketCap) : "-";
  const fdv = d ? formatInteger(d.fullyDilutedValuation) : "-";

  const totalSupply = d ? formatInteger(d.totalSupply) : "-";
  const circulatingSupply = d ? formatInteger(d.circulatingSupply) : "-";
  const circulatingUpbit = d ? formatInteger(d.circulatingSuupplyUpbitStandard) : "-";
  const burnedSupply = d ? formatInteger(d.burnedSupply) : "-";

  const daoStaked = d ? formatInteger(d.DAOStakedVolume) : "-";
  const staked = d ? formatInteger(d.stakedVolume) : "-";

  const c1 = d ? formatInteger(d.liquidity.c1) : "-";
  const c2 = d ? formatInteger(d.liquidity.c2) : "-";
  const c3 = d ? formatInteger(d.liquidity.c3) : "-";

  const stakedStat = d ? formatInteger(d.stakedVolume) : "-";
  const daoStat = d ? formatInteger(d.DAOStakedVolume) : "-";
  const stakingRatio =
    d && d.totalSupply > 0
      ? `${((d.stakedVolume / d.totalSupply) * 100).toFixed(1)}%`
      : "-";

  // Interlude 1: Supply sub-sections
  const interlude1Items = [
    {
      label: "TOTAL SUPPLY",
      title: "Where value\nbegins.",
      desc: "50.6M TON comprises the entire Tokamak Network token supply — generated through seigniorage.",
      metricVal: totalSupply,
      metricUnit: "Total TON",
    },
    {
      label: "CIRCULATING",
      title: "Open market\nmovement.",
      desc: "The majority of supply flows freely across exchanges, enabling price discovery and liquidity.",
      metricVal: circulatingSupply,
      metricUnit: "Circulating",
    },
    {
      label: "BURNED",
      title: "Permanently\nremoved.",
      desc: "A small portion of supply has been permanently burned, reducing total circulation over time.",
      metricVal: burnedSupply,
      metricUnit: "TON Burned",
    },
  ];

  // Interlude 2: Locked sub-sections
  const interlude2Items = [
    {
      label: "STAKED",
      title: "Secured by\nstakers.",
      desc: "TON locked in staking contracts earns seigniorage rewards while securing the network.",
      metricVal: stakedStat,
      metricUnit: "TON Staked",
    },
    {
      label: "DAO VAULT",
      title: "Governed by\nthe community.",
      desc: "The DAO treasury holds TON indefinitely for governance and ecosystem development.",
      metricVal: daoStat,
      metricUnit: "DAO Vault",
    },
    {
      label: "VESTING",
      title: "Vesting\ncomplete.",
      desc: "All vesting schedules concluded on December 26, 2023. Zero tokens remain under vesting lock.",
      metricVal: stakingRatio,
      metricUnit: "Staking Ratio",
    },
  ];

  // Interlude 3: Liquidity sub-sections
  const interlude3Items = [
    {
      label: "C1 LIQUIDITY",
      title: "Immediately\naccessible.",
      desc: "C1 excludes staked, vested, and DAO vault tokens — the most liquid layer of TON supply.",
      metricVal: c1,
      metricUnit: "C1 TON",
    },
    {
      label: "C2 LIQUIDITY",
      title: "Short-term\naccess.",
      desc: "C1 plus staked tokens, including those locked under 3 months. Broader liquidity picture.",
      metricVal: c2,
      metricUnit: "C2 TON",
    },
    {
      label: "C3 LIQUIDITY",
      title: "Full picture,\non-chain.",
      desc: "No additional long-term locks beyond staking. C2 equals C3 — fully transparent.",
      metricVal: c3,
      metricUnit: "C3 TON",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgStarfield} />
      <canvas ref={starfieldRef} className={styles.bgStarfieldCanvas} />
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
        <div className={styles.chapterWrap}>
          <section className={styles.chapter} id="ch-price">
            <motion.div
              className={styles.chapterLabel}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              PRICE
            </motion.div>
            <div className={`${styles.dataRow} ${styles.c5}`}>
              <DataCard label="TON PRICE" val={tonPriceCurrent} unit={tonPriceCurrentUnit} desc="Current market price across major exchanges" delay={0} />
              <DataCard label="24H OPENING" val={tonPriceOpening} unit={tonPriceOpeningUnit} desc="Opening price at the start of trading day" delay={0.08} />
              <DataCard label="24H CLOSING" val={tonPriceClosing} unit={tonPriceClosingUnit} desc="Most recent closing price within 24 hours" delay={0.16} />
              <DataCard label="MARKET CAP" val={marketCap} unit="USD" desc="Total value of all circulating TON tokens" delay={0.24} />
              <DataCard label="FDV" val={fdv} unit="USD" desc="Fully diluted valuation at current price" delay={0.32} />
            </div>
          </section>
        </div>

        {/* ══════ INTERLUDE 1: Price → Supply (scroll-scrub) ══════ */}
        <ScrollInterlude
          videoSrc="/videos/start-section.mp4"
          items={interlude1Items}
        />

        {/* ══════ SUPPLY DATA ══════ */}
        <div className={styles.chapterWrap}>
          <section className={styles.chapter} id="ch-supply">
            <motion.div
              className={styles.chapterLabel}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              SUPPLY
            </motion.div>
            <div className={`${styles.dataRow} ${styles.c4}`}>
              <DataCard label="TOTAL SUPPLY" val={totalSupply} unit="TON" pct="100%" desc="Total tokens ever created through seigniorage" delay={0} />
              <DataCard label="CIRCULATING" val={circulatingSupply} unit="TON" desc="Available in the open market for trading and transfers" delay={0.08} />
              <DataCard label="CIRCULATING (UPBIT)" val={circulatingUpbit} unit="TON" desc="Upbit standard circulating supply measurement" delay={0.16} />
              <DataCard label="BURNED" val={burnedSupply} unit="TON" pct="<0.01%" desc="Permanently removed from total supply" delay={0.24} />
            </div>
          </section>
        </div>

        {/* ══════ INTERLUDE 2: Supply → Locked (scroll-scrub) ══════ */}
        <ScrollInterlude
          videoSrc="/videos/stats.mp4"
          items={interlude2Items}
        />

        {/* ══════ LOCKED DATA ══════ */}
        <div className={styles.chapterWrap}>
          <section className={styles.chapter} id="ch-locked">
            <motion.div
              className={styles.chapterLabel}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              LOCKED
            </motion.div>
            <div className={`${styles.dataRow} ${styles.c3}`}>
              <DataCard label="DAO VAULT" val={daoStaked} unit="TON" desc="Held indefinitely in the DAO treasury for governance" delay={0} />
              <DataCard label="STAKED" val={staked} unit="TON" desc="Locked in staking contracts, earning seigniorage rewards" delay={0.08} />
              <DataCard label="VESTED" val="0" unit="TON" pct="0%" desc="All vesting concluded on December 26, 2023" delay={0.16} />
            </div>
          </section>
        </div>

        {/* ══════ INTERLUDE 3: Locked → Liquidity (scroll-scrub) ══════ */}
        <ScrollInterlude
          videoSrc="/videos/liquidity-flow.mp4"
          items={interlude3Items}
        />

        {/* ══════ LIQUIDITY DATA ══════ */}
        <div className={styles.chapterWrap}>
          <section className={styles.chapter} id="ch-liquidity">
            <motion.div
              className={styles.chapterLabel}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              LIQUIDITY
            </motion.div>
            <div className={`${styles.dataRow} ${styles.c3}`}>
              <DataCard label="C1 LIQUIDITY" val={c1} unit="TON" desc="Immediately available — excludes staked, vested, and DAO vault" delay={0} />
              <DataCard label="C2 LIQUIDITY" val={c2} unit="TON" pct="C1 + Staked" desc="Short-term accessible, including tokens locked under 3 months" delay={0.08} />
              <DataCard label="C3 LIQUIDITY" val={c3} unit="TON" pct="C2 = C3" desc="Full picture — no additional long-term locks beyond staking" delay={0.16} />
            </div>
          </section>
        </div>

        {/* ══════ FOOTER CTA ══════ */}
        <section style={{ padding: "80px 48px", textAlign: "center", position: "relative", zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }}
          >
            <h2
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              Liquidity that<br />never sleeps.
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(14px, 1.2vw, 16px)",
                maxWidth: "460px",
                lineHeight: 1.7,
              }}
            >
              Three tiers of liquidity measurement — from immediately available
              to long-term locked. Transparent, verifiable, always on-chain.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              <a
                href={LINKS.DUNE_DASHBOARD}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnGhost}
              >
                View on Dune
              </a>
              <a
                href={LINKS.GET_TON}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnPrimary}
              >
                Buy TON
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
