"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import s from "./styles.module.css";

import EfgOff from "@/assets/partners/name=efg, Hover=off.svg";
import EfgOn from "@/assets/partners/name=efg, Hover=on.svg";
import SKYOff from "@/assets/partners/name=SKY, Hover=off.svg";
import SKYOn from "@/assets/partners/name=SKY, Hover=on.svg";
import PolygonOff from "@/assets/partners/name=Polygon, Hover=off.svg";
import PolygonOn from "@/assets/partners/name=Polygon, Hover=on.svg";
import METEROff from "@/assets/partners/name=METER, Hover=off.svg";
import METEROn from "@/assets/partners/name=METER, Hover=on.svg";
import DSRVOff from "@/assets/partners/name=DSRV, Hover=off.svg";
import DSRVOn from "@/assets/partners/name=DSRV, Hover=on.svg";
import BounceOff from "@/assets/partners/name=Bounce, Hover=off.svg";
import BounceOn from "@/assets/partners/name=Bounce, Hover=on.svg";
import PaycoinOff from "@/assets/partners/name=paycoin, Hover=off.svg";
import PaycoinOn from "@/assets/partners/name=paycoin, Hover=on.svg";
import BifROSTOff from "@/assets/partners/name=BIFROST, Hover=off.svg";
import BifROSTOn from "@/assets/partners/name=BIFROST, Hover=on.svg";
import KdacOff from "@/assets/partners/name=kdac, Hover=off.svg";
import KdacOn from "@/assets/partners/name=kdac, Hover=on.svg";
import DcentOff from "@/assets/partners/name=dcent, Hover=off.svg";
import DcentOn from "@/assets/partners/name=dcent, Hover=on.svg";
import OzysOff from "@/assets/partners/name=ozys, Hover=off.svg";
import OzysOn from "@/assets/partners/name=ozys, Hover=on.svg";
import PanonyOff from "@/assets/partners/name=panony, Hover=off.svg";
import PanonyOn from "@/assets/partners/name=panony, Hover=on.svg";
import StakedOff from "@/assets/partners/name=Staked, Hover=off.svg";
import StakedOn from "@/assets/partners/name=Staked, Hover=on.svg";
import ChainlinkOff from "@/assets/partners/name=chainlink, Hover=off.svg";
import ChainlinkOn from "@/assets/partners/name=chainlink, Hover=on.svg";
import DespreadOff from "@/assets/partners/name=despread, Hover=off.svg";
import DespreadOn from "@/assets/partners/name=despread, Hover=on.svg";
import DecipherOff from "@/assets/partners/name=decipher, Hover=off.svg";
import DecipherOn from "@/assets/partners/name=decipher, Hover=on.svg";
import CiphersOff from "@/assets/partners/name=ciphers, Hover=off.svg";
import CiphersOn from "@/assets/partners/name=ciphers, Hover=on.svg";
import OneHundredOff from "@/assets/partners/name=100n100, Hover=off.svg";
import OneHundredOn from "@/assets/partners/name=100n100, Hover=on.svg";
import BLOCOREOff from "@/assets/partners/name=BLOCORE, Hover=off.svg";
import BLOCOREOn from "@/assets/partners/name=BLOCORE, Hover=on.svg";
import AlphainOff from "@/assets/partners/name=Alphain Ventures, Hover=off.svg";
import AlphainOn from "@/assets/partners/name=Alphain Ventures, Hover=on.svg";
import SkytaleOff from "@/assets/partners/name=Skytale Capital, Hover=off.svg";
import SkytaleOn from "@/assets/partners/name=Skytale Capital, Hover=on.svg";

type Partner = {
  name: string;
  logoOff: string;
  logoOn: string;
  link?: string;
};

const partners: Partner[] = [
  { name: "EFG", logoOff: EfgOff, logoOn: EfgOn, link: "https://medium.com/tokamak-network/vitalik-buterins-big-announcements-about-plasma-evm-tokamak-network-636dc11ea257" },
  { name: "SKY", logoOff: SKYOff, logoOn: SKYOn, link: "https://sky.money" },
  { name: "Polygon", logoOff: PolygonOff, logoOn: PolygonOn, link: "https://polygon.technology" },
  { name: "METER", logoOff: METEROff, logoOn: METEROn, link: "https://meter.io" },
  { name: "DSRV", logoOff: DSRVOff, logoOn: DSRVOn, link: "https://www.dsrvlabs.com" },
  { name: "Bounce", logoOff: BounceOff, logoOn: BounceOn, link: "https://bounce.finance" },
  { name: "Paycoin", logoOff: PaycoinOff, logoOn: PaycoinOn, link: "https://payprotocol.io" },
  { name: "BiFROST", logoOff: BifROSTOff, logoOn: BifROSTOn, link: "https://thebifrost.io" },
  { name: "KDAC", logoOff: KdacOff, logoOn: KdacOn, link: "https://www.kdac.io/" },
  { name: "D'CENT", logoOff: DcentOff, logoOn: DcentOn, link: "https://dcentwallet.com" },
  { name: "Ozys", logoOff: OzysOff, logoOn: OzysOn, link: "https://orbitchain.io" },
  { name: "Panony", logoOff: PanonyOff, logoOn: PanonyOn, link: "https://www.panony.com" },
  { name: "Staked", logoOff: StakedOff, logoOn: StakedOn, link: "https://staked.us" },
  { name: "Chainlink", logoOff: ChainlinkOff, logoOn: ChainlinkOn, link: "https://chain.link" },
  { name: "Despread", logoOff: DespreadOff, logoOn: DespreadOn, link: "https://www.despread.io" },
  { name: "Decipher", logoOff: DecipherOff, logoOn: DecipherOn, link: "https://medium.com/decipher-media" },
  { name: "Ciphers", logoOff: CiphersOff, logoOn: CiphersOn },
];

const backedBy: Partner[] = [
  { name: "100N100", logoOff: OneHundredOff, logoOn: OneHundredOn, link: "http://100and100capital.com" },
  { name: "BLOCORE", logoOff: BLOCOREOff, logoOn: BLOCOREOn, link: "https://www.blocore.com" },
  { name: "Alphain Ventures", logoOff: AlphainOff, logoOn: AlphainOn },
  { name: "Skytale Capital", logoOff: SkytaleOff, logoOn: SkytaleOn },
];

/* ── Floating particles ── */
function useParticles(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, raf = 0;
    const COUNT = 40;
    const ps: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = [];

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    for (let i = 0; i < COUNT; i++) {
      ps.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2 + 0.5,
        vy: -(Math.random() * 0.3 + 0.1),
        vx: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.4 + 0.1,
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0, `rgba(0,180,220,${p.a})`);
        g.addColorStop(1, "rgba(0,180,220,0)");
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx!.fillStyle = g;
        ctx!.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [canvasRef]);
}

/* ── Scroll reveal observer ── */
function useScrollReveal() {
  const observe = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    // observe all partner-cards and reveal elements inside
    el.querySelectorAll(`.${s.partnerCard}, .${s.reveal}`).forEach((child, i) => {
      if (child.classList.contains(s.partnerCard)) {
        (child as HTMLElement).style.transitionDelay = `${(i % 4) * 100}ms`;
      }
      observer.observe(child);
    });
  }, []);
  return observe;
}

/* ── Partner card component ── */
function PartnerCard({ p }: { p: Partner }) {
  const inner = (
    <>
      <div className={s.logoWrap}>
        <Image src={p.logoOff} alt={p.name} className={s.logoOff} />
        <Image src={p.logoOn} alt={p.name} className={s.logoOn} />
      </div>
      <span className={s.partnerName}>{p.name.toUpperCase()}</span>
    </>
  );

  if (p.link) {
    return (
      <a href={p.link} target="_blank" rel="noopener noreferrer" className={s.partnerCard}>
        {inner}
      </a>
    );
  }
  return <div className={s.partnerCard}>{inner}</div>;
}

/* ── Main component ── */
export default function PartnersV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticles(canvasRef);
  const scrollRef = useScrollReveal();

  return (
    <div className={s.wrapper} ref={scrollRef}>
      <div className={s.bgAmbient} />
      <canvas ref={canvasRef} className={s.bgParticles} />
      <div className={s.grain} />

      <div className={s.content}>
        {/* ═══ HERO ═══ */}
        <section className={s.hero}>
          <h1 className={s.heroH1}>
            Building Together,
            <span className={s.heroH1Accent}>Scaling Ethereum</span>
          </h1>
          <p className={s.heroSub}>
            Tokamak Network collaborates with leading projects, investors, and
            research teams to make Ethereum more scalable and deliver a better
            decentralized experience.
          </p>
          <div className={s.heroStats}>
            <div style={{ textAlign: "center" }}>
              <div className={s.heroStatVal}>{partners.length + backedBy.length}</div>
              <div className={s.heroStatLabel}>PARTNERS</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className={s.heroStatVal}>{backedBy.length}</div>
              <div className={s.heroStatLabel}>INVESTORS</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className={s.heroStatVal}>6+</div>
              <div className={s.heroStatLabel}>YEARS</div>
            </div>
          </div>
        </section>

        {/* ═══ PARTNERS & GRANTS ═══ */}
        <div className={s.sectionWrap}>
          <div className={s.section}>
            <div className={s.sectionLabel}>Partners & Grants</div>
            <div className={s.sectionDesc}>
              Strategic partnerships and grant collaborations driving the Tokamak
              Network ecosystem forward.
            </div>
            <div className={s.partnersGrid}>
              {partners.map((p) => (
                <PartnerCard key={p.name} p={p} />
              ))}
            </div>
          </div>
        </div>

        {/* ═══ INTERLUDE ═══ */}
        <div className={s.videoInterlude}>
          <div className={s.viBg} />
          <div className={s.gradTop} />
          <div className={s.gradBottom} />
          <div className={`${s.viContent} ${s.reveal}`}>
            <div className={s.viHeading}>
              Supported by<br />Leading Investors
            </div>
            <div className={s.viDesc}>
              Tokamak Network is backed by experienced investors who share our
              vision for a more scalable and accessible Ethereum ecosystem.
            </div>
          </div>
        </div>

        {/* ═══ BACKED BY ═══ */}
        <div className={s.sectionWrap}>
          <div className={s.section}>
            <div className={s.sectionLabel}>Backed by</div>
            <div className={s.sectionDesc}>
              Investors and funds supporting Tokamak Network&apos;s mission.
            </div>
            <div className={s.partnersGrid}>
              {backedBy.map((p) => (
                <PartnerCard key={p.name} p={p} />
              ))}
            </div>
          </div>
        </div>

        {/* ═══ CTA ═══ */}
        <div className={s.videoInterlude} style={{ minHeight: 350 }}>
          <div className={s.viBg} />
          <div className={s.gradTop} />
          <div className={s.gradBottom} />
          <div className={`${s.viContent} ${s.reveal}`}>
            <div className={s.viHeading}>Become a Partner</div>
            <div className={s.viDesc}>
              Interested in collaborating with Tokamak Network? We&apos;re always
              looking for projects that share our vision.
            </div>
            <a href="mailto:hello@tokamak.network" className={s.btnSolid}>
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
