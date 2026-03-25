"use client";

import { useRef, useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HelixSpine from "./HelixSpine";
import FuiPanel from "./FuiPanel";
import {
  DonutChart,
  BarChart,
  LineChart,
  NetworkGraph,
  DataRows,
  ProgressBars,
  StatusGrid,
  Waveform,
  RadarChart,
} from "./panels";

gsap.registerPlugin(ScrollTrigger);

const CYAN = "#00e5ff";
const TEAL = "#00bcd4";
const PURPLE = "#b388ff";
const ORANGE = "#ffab40";
const RED = "#ff5252";
const GREEN = "#69f0ae";
const YELLOW = "#eeff41";

export default function FuiDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    setReady(true);
    return () => lenis.destroy();
  }, []);

  // Track global scroll progress
  useEffect(() => {
    if (!ready || !containerRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setScrollProgress(self.progress),
    });

    return () => trigger.kill();
  }, [ready]);

  // Animate panels on scroll
  useEffect(() => {
    if (!ready || !containerRef.current) return;

    const panels = containerRef.current.querySelectorAll("[data-fui-panel]");
    const ctx = gsap.context(() => {
      panels.forEach((panel) => {
        const side = panel.getAttribute("data-fui-side");
        gsap.fromTo(
          panel,
          {
            opacity: 0,
            x: side === "left" ? -60 : side === "right" ? 60 : 0,
            y: side === "center" ? 40 : 0,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 90%",
              end: "top 50%",
              scrub: true,
            },
          }
        );
      });
    }, containerRef.current);

    return () => ctx.revert();
  }, [ready]);

  return (
    <div ref={containerRef} className="relative bg-[#030810] min-h-[500vh]">
      {/* Fixed background grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,229,255,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(3,8,16,0.8) 100%)",
          }}
        />
      </div>

      {/* Fixed helix spine in center */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 10 }}>
        <HelixSpine scrollProgress={scrollProgress} color={CYAN} />
      </div>

      {/* Fixed top status bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div
          className="flex items-center justify-between px-6 py-2"
          style={{
            background: "linear-gradient(180deg, rgba(3,8,16,0.95) 0%, transparent 100%)",
            borderBottom: `1px solid ${CYAN}10`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00e5ff]" style={{ boxShadow: `0 0 8px ${CYAN}` }} />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#00e5ff]/80 uppercase">
              Tokamak Network — Reactor Status
            </span>
          </div>
          <div className="flex items-center gap-4">
            {["SYS:ONLINE", "NODES:124", "EPOCH:1247"].map((s, i) => (
              <span key={i} className="text-[9px] font-mono text-[#00e5ff]/40">
                {s}
              </span>
            ))}
          </div>
        </div>
        {/* Scroll progress bar */}
        <div className="h-[1px] bg-[#00e5ff]/5">
          <div
            className="h-full transition-[width] duration-100"
            style={{
              width: `${scrollProgress * 100}%`,
              background: `linear-gradient(90deg, ${CYAN}, ${PURPLE})`,
            }}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 1: Overview (0vh - 100vh) */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center justify-center" style={{ zIndex: 20 }}>
        <div className="absolute inset-0 grid grid-cols-[1fr_200px_1fr] gap-0 px-6 py-20 max-w-[1400px] mx-auto">
          {/* Left panels */}
          <div className="flex flex-col gap-3 pr-8">
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="Network Overview" color={CYAN} height="160px">
                <StatusGrid
                  color={CYAN}
                  items={[
                    { label: "TVL", value: "$48.2M" },
                    { label: "TPS", value: "847" },
                    { label: "STAKED", value: "42.3M" },
                    { label: "UPTIME", value: "99.97%" },
                  ]}
                />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="TON Price" color={TEAL} height="120px">
                <LineChart data={[1.2, 1.15, 1.3, 1.25, 1.4, 1.35, 1.5, 1.45, 1.6, 1.55, 1.7, 1.65]} color={TEAL} label="USD" />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="Staking Distribution" color={PURPLE} height="130px">
                <DonutChart value={78} label="PARTICIPATION" color={PURPLE} />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="Gas Usage" color={CYAN} height="100px">
                <BarChart data={[30, 55, 42, 70, 65, 45, 80, 60, 50, 75, 40, 90]} color={CYAN} />
              </FuiPanel>
            </div>
          </div>

          {/* Center - reserved for helix */}
          <div />

          {/* Right panels */}
          <div className="flex flex-col gap-3 pl-8">
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Node Topology" color={CYAN} height="160px">
                <NetworkGraph color={CYAN} />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Recent Blocks" color={TEAL} height="140px">
                <DataRows
                  color={TEAL}
                  rows={[
                    { key: "#4,291,847", value: "2s ago" },
                    { key: "#4,291,846", value: "4s ago" },
                    { key: "#4,291,845", value: "6s ago" },
                    { key: "#4,291,844", value: "8s ago" },
                    { key: "#4,291,843", value: "10s ago" },
                  ]}
                />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="System Health" color={GREEN} height="120px">
                <RadarChart values={[90, 85, 95, 78, 88, 92]} color={GREEN} />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Comms Signal" color={CYAN} height="80px">
                <Waveform color={CYAN} bars={24} />
              </FuiPanel>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 2: Staking & DeFi (100vh - 200vh) */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center" style={{ zIndex: 20 }}>
        <div className="absolute inset-0 grid grid-cols-[1fr_200px_1fr] gap-0 px-6 py-20 max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-3 pr-8">
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="Seigniorage Rewards" color={ORANGE} height="140px">
                <LineChart data={[200, 210, 195, 230, 245, 250, 260, 275, 290, 310, 320, 340]} color={ORANGE} label="TON/day" />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="Validator Performance" color={GREEN} height="140px">
                <ProgressBars
                  color={GREEN}
                  items={[
                    { label: "Uptime", value: 99 },
                    { label: "Commit Rate", value: 97 },
                    { label: "Attestation", value: 95 },
                    { label: "Proposal", value: 88 },
                  ]}
                />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="APR History" color={CYAN} height="120px">
                <BarChart data={[12, 14, 13, 15, 16, 14, 17, 15, 18, 16, 19, 17]} color={CYAN} />
              </FuiPanel>
            </div>
          </div>

          <div />

          <div className="flex flex-col gap-3 pl-8">
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Protocol Revenue" color={PURPLE} height="130px">
                <DonutChart value={62} label="BURN RATE" color={PURPLE} />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Governance" color={YELLOW} height="140px">
                <ProgressBars
                  color={YELLOW}
                  items={[
                    { label: "TIP-42 Upgrade", value: 78 },
                    { label: "TIP-43 Treasury", value: 45 },
                    { label: "TIP-44 Bridge v2", value: 92 },
                  ]}
                />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Cross-Chain Volume" color={ORANGE} height="130px">
                <LineChart data={[80, 120, 95, 140, 160, 130, 180, 200, 170, 220, 250, 230]} color={ORANGE} label="ETH" />
              </FuiPanel>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 3: L2 & Bridge (200vh - 300vh) */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center" style={{ zIndex: 20 }}>
        <div className="absolute inset-0 grid grid-cols-[1fr_200px_1fr] gap-0 px-6 py-20 max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-3 pr-8">
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="Thanos L2 Chain" color={CYAN} height="150px">
                <DataRows
                  color={CYAN}
                  rows={[
                    { key: "Chain ID", value: "111551118080" },
                    { key: "Block Time", value: "1.2s" },
                    { key: "Finality", value: "~2 min" },
                    { key: "Sequencer", value: "ACTIVE" },
                    { key: "Batch Freq", value: "30s" },
                  ]}
                />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="L1 ↔ L2 Bridge" color={TEAL} height="120px">
                <StatusGrid
                  color={TEAL}
                  items={[
                    { label: "DEPOSIT", value: "2.1M" },
                    { label: "WITHDRAW", value: "1.8M" },
                    { label: "PENDING", value: "47" },
                    { label: "AVG TIME", value: "2.4m" },
                  ]}
                />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="Batch Compression" color={GREEN} height="100px">
                <DonutChart value={85} label="RATIO" color={GREEN} />
              </FuiPanel>
            </div>
          </div>

          <div />

          <div className="flex flex-col gap-3 pl-8">
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Network Topology" color={PURPLE} height="180px">
                <RadarChart values={[88, 92, 76, 95, 84, 90]} color={PURPLE} />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Transaction Flow" color={CYAN} height="120px">
                <Waveform color={CYAN} bars={30} />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Error Rate" color={RED} height="80px">
                <LineChart data={[0.1, 0.05, 0.08, 0.03, 0.02, 0.04, 0.01, 0.03, 0.02, 0.01, 0.02, 0.01]} color={RED} />
              </FuiPanel>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 4: Ecosystem (300vh - 400vh) */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center" style={{ zIndex: 20 }}>
        <div className="absolute inset-0 grid grid-cols-[1fr_200px_1fr] gap-0 px-6 py-20 max-w-[1400px] mx-auto">
          <div className="flex flex-col gap-3 pr-8">
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="Active Projects" color={CYAN} height="140px">
                <DataRows
                  color={CYAN}
                  rows={[
                    { key: "Titan", value: "DeFi Hub" },
                    { key: "Gemstone", value: "DEX" },
                    { key: "Dooropen", value: "Bridge" },
                    { key: "Tonstarter", value: "Launchpad" },
                    { key: "TONStarter", value: "Staking" },
                  ]}
                />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="Developer Activity" color={GREEN} height="120px">
                <BarChart data={[45, 52, 48, 60, 55, 70, 65, 80, 75, 85, 90, 95]} color={GREEN} />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="left">
              <FuiPanel title="Protocol Metrics" color={TEAL} height="120px">
                <RadarChart values={[80, 70, 90, 85, 75, 88]} color={TEAL} />
              </FuiPanel>
            </div>
          </div>

          <div />

          <div className="flex flex-col gap-3 pl-8">
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Token Distribution" color={PURPLE} height="130px">
                <DonutChart value={42} label="STAKED" color={PURPLE} />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Holder Growth" color={CYAN} height="130px">
                <LineChart data={[1200, 1350, 1400, 1580, 1700, 1850, 2000, 2200, 2400, 2550, 2700, 2900]} color={CYAN} label="Wallets" />
              </FuiPanel>
            </div>
            <div data-fui-panel data-fui-side="right">
              <FuiPanel title="Community Pulse" color={ORANGE} height="100px">
                <Waveform color={ORANGE} bars={28} />
              </FuiPanel>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 5: Finale (400vh - 500vh) */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center justify-center" style={{ zIndex: 20 }}>
        <div className="text-center space-y-6 max-w-xl" data-fui-panel data-fui-side="center">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#00e5ff]" />
            <span className="text-[#00e5ff] text-xs font-mono tracking-[0.4em] uppercase">
              Fusion Complete
            </span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#00e5ff]" />
          </div>
          <h2
            className="text-5xl md:text-7xl font-bold text-white leading-[1.05]"
            style={{ textShadow: `0 0 60px ${CYAN}30` }}
          >
            The Future
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${CYAN}, ${PURPLE})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              is On-Chain
            </span>
          </h2>
          <p className="text-white/40 text-lg">
            DAO governance, DeFi protocols, and developer tools — all powered by the Tokamak fusion reactor.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <a
              href="https://tokamak.network"
              className="px-6 py-2 rounded-full text-sm font-mono border transition-all duration-300 hover:bg-[#00e5ff]/10"
              style={{ borderColor: `${CYAN}40`, color: CYAN }}
            >
              Enter Network
            </a>
            <a
              href="https://github.com/tokamak-network"
              className="px-6 py-2 rounded-full text-sm font-mono border transition-all duration-300 hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Bottom fade */}
      <div
        className="fixed bottom-0 left-0 right-0 h-20 pointer-events-none z-40"
        style={{
          background: "linear-gradient(to top, rgba(3,8,16,0.9), transparent)",
        }}
      />
    </div>
  );
}
