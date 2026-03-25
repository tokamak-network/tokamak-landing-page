"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import BootSequence from "./BootSequence";
import ChannelGuide from "./ChannelGuide";
import { CHANNELS } from "./ChannelGuide";

type Phase = "boot" | "transition" | "hero";

/**
 * Main Retro TV page. Uses AI-generated hero-room.png as the primary visual,
 * with interactive HTML overlays for the TV screen content, buttons, and nav.
 *
 * Image aspect ratio: 2752×1536 (≈16:9)
 * TV screen area in image: ~37% left, ~17% top, ~20% wide, ~52% tall
 */
export default function RetroTVPage() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [activeChannel, setActiveChannel] = useState(0);
  const [showGuide, setShowGuide] = useState(false);
  const [channelContent, setChannelContent] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const handleBootComplete = useCallback(() => {
    setPhase("transition");
  }, []);

  // Transition: fade from boot to hero
  useEffect(() => {
    if (phase !== "transition") return;
    // Brief black gap, then reveal hero
    const t1 = setTimeout(() => setHeroReady(true), 200);
    const t2 = setTimeout(() => setPhase("hero"), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  // Keyboard navigation
  useEffect(() => {
    if (phase !== "hero") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setActiveChannel((c) => Math.max(0, c - 1));
      } else if (e.key === "ArrowDown") {
        setActiveChannel((c) => Math.min(CHANNELS.length - 1, c + 1));
      } else if (e.key === "Enter") {
        handleChannelSelect(activeChannel);
      } else if (e.key === "Escape") {
        setShowGuide(true);
        setChannelContent(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, activeChannel]);

  const handleChannelSelect = useCallback((index: number) => {
    setTransitioning(true);
    setActiveChannel(index);
    setTimeout(() => {
      setChannelContent(CHANNELS[index].id);
      setShowGuide(false);
      setTransitioning(false);
    }, 400);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0a0a08] overflow-hidden">
      {/* === Boot Sequence === */}
      {phase === "boot" && <BootSequence onComplete={handleBootComplete} />}

      {/* === Hero Section === */}
      {(phase === "transition" || phase === "hero") && (
        <div ref={heroRef} className="relative min-h-screen">
          {/* --- Background: Photorealistic hero image --- */}
          <div className="fixed inset-0 z-0">
            {/* Image fills viewport */}
            <img
              src="/retro-tv/hero-room.png"
              alt=""
              className="w-full h-full object-cover transition-all duration-[2000ms] ease-out"
              style={{
                opacity: heroReady ? 1 : 0,
                transform: heroReady ? "scale(1)" : "scale(1.05)",
              }}
            />
            {/* Subtle dark overlay for text readability */}
            <div
              className="absolute inset-0 transition-opacity duration-[2000ms]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,10,8,0.2) 0%, rgba(10,10,8,0.1) 40%, rgba(10,10,8,0.3) 100%)",
                opacity: heroReady ? 1 : 0,
              }}
            />
          </div>

          {/* --- TV Screen Interactive Overlay --- */}
          {/* Positioned to exactly cover the TV screen in hero-room.png */}
          <TVScreenOverlay
            phase={phase}
            heroReady={heroReady}
            transitioning={transitioning}
            showGuide={showGuide}
            channelContent={channelContent}
            activeChannel={activeChannel}
            onChannelSelect={handleChannelSelect}
            onShowGuide={() => {
              setShowGuide(true);
              setChannelContent(null);
            }}
          />

          {/* --- Interactive Button Overlays --- */}
          {/* Positioned over the buttons visible in the image */}
          <div
            className="fixed z-20 flex gap-3 transition-all duration-1000 delay-700"
            style={{
              left: "4.2%",
              bottom: "26%",
              opacity: phase === "hero" ? 1 : 0,
              transform:
                phase === "hero" ? "translateY(0)" : "translateY(10px)",
            }}
          >
            <button
              className="px-5 py-2.5 text-xs font-mono tracking-wider uppercase cursor-pointer transition-all duration-300 hover:bg-[#33ff3320] hover:shadow-[0_0_20px_rgba(51,255,51,0.15)]"
              style={{
                border: "1px solid #33ff3350",
                color: "#33ff33",
                background: "rgba(51,255,51,0.05)",
                backdropFilter: "blur(4px)",
              }}
              onClick={() => {
                setShowGuide(true);
                setChannelContent(null);
              }}
            >
              ACCESS DATA
            </button>
            <button
              className="px-5 py-2.5 text-xs font-mono tracking-wider uppercase cursor-pointer transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.08)]"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(4px)",
              }}
              onClick={() => handleChannelSelect(0)}
            >
              VIEW LIVE FEED
            </button>
          </div>

          {/* --- Top Navigation Overlay --- */}
          <div
            className="fixed top-0 right-0 z-20 flex gap-6 px-8 py-4 transition-all duration-1000 delay-500"
            style={{
              opacity: phase === "hero" ? 1 : 0,
              transform:
                phase === "hero" ? "translateY(0)" : "translateY(-10px)",
            }}
          >
            {["PROJECTS", "LOGS", "DATA", "STATUS"].map((item) => (
              <span
                key={item}
                className="text-[10px] font-mono tracking-wider uppercase cursor-pointer transition-colors hover:text-[#33ff33]"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {item}
              </span>
            ))}
          </div>

          {/* --- Transition black overlay --- */}
          {phase === "transition" && (
            <div
              className="fixed inset-0 z-30 pointer-events-none transition-opacity duration-[1500ms]"
              style={{
                background: "#0a0a08",
                opacity: heroReady ? 0 : 1,
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── TV Screen Overlay ───
// Renders the interactive content precisely over the TV screen in the hero image.
// Uses percentage-based positioning relative to the viewport.
function TVScreenOverlay({
  phase,
  heroReady,
  transitioning,
  showGuide,
  channelContent,
  activeChannel,
  onChannelSelect,
  onShowGuide,
}: {
  phase: Phase;
  heroReady: boolean;
  transitioning: boolean;
  showGuide: boolean;
  channelContent: string | null;
  activeChannel: number;
  onChannelSelect: (index: number) => void;
  onShowGuide: () => void;
}) {
  // The TV screen position within hero-room.png (2752×1536).
  // These define where the dark screen area is in the image.
  // Fine-tuned for object-fit: cover on 16:9-ish viewports.
  const screenStyle: React.CSSProperties = {
    position: "fixed",
    // Calibrated screen bounds for hero-room.png (2752×1536)
    // Fine-tuned at 1280×720 viewport with object-fit: cover
    left: "35.2%",
    top: "16.5%",
    width: "19.2%",
    height: "49%",
    zIndex: 20,
    opacity: phase === "hero" ? 1 : 0,
    transition: "opacity 1s ease-out 0.5s",
    borderRadius: "3px",
    overflow: "hidden",
  };

  return (
    <div style={screenStyle}>
      {/* Screen background */}
      <div
        className="absolute inset-0"
        style={{ background: "#080a08" }}
      />

      {/* VHS channel transition noise */}
      {transitioning && (
        <div
          className="absolute inset-0 z-50"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(255,255,255,0.1) 1px,
              rgba(255,255,255,0.1) 2px
            )`,
            animation: "vhsStatic 0.1s steps(5) infinite",
          }}
        />
      )}

      {/* Channel guide */}
      {(showGuide || (!channelContent && phase === "hero")) &&
        !transitioning && (
          <ChannelGuide
            activeChannel={activeChannel}
            onSelect={onChannelSelect}
          />
        )}

      {/* Channel content */}
      {channelContent && !transitioning && (
        <ChannelScreen
          channelId={channelContent}
          onBack={onShowGuide}
        />
      )}

      {/* CRT scan lines on TV screen */}
      <div
        className="absolute inset-0 pointer-events-none z-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        }}
      />

      {/* CRT curvature shadow */}
      <div
        className="absolute inset-0 pointer-events-none z-[41]"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Screen glass reflection */}
      <div
        className="absolute inset-0 pointer-events-none z-[42]"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)",
        }}
      />
    </div>
  );
}

// ─── Channel Screen (terminal-style content) ───
function ChannelScreen({
  channelId,
  onBack,
}: {
  channelId: string;
  onBack: () => void;
}) {
  const channel = CHANNELS.find((c) => c.id === channelId);
  if (!channel) return null;

  return (
    <div
      className="absolute inset-0 font-mono p-3 overflow-hidden"
      style={{ color: "#33ff33" }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center mb-3"
        style={{ borderBottom: "1px solid #33ff3330" }}
      >
        <span className="text-xs tracking-wider">
          CH.{channel.number} {channel.name}
        </span>
        <button
          onClick={onBack}
          className="text-[10px] px-2 py-0.5 transition-colors hover:bg-[#33ff3315]"
          style={{ color: "#33ff3360", border: "1px solid #33ff3330" }}
        >
          TV GUIDE
        </button>
      </div>

      {/* Terminal content */}
      <TerminalContent channelId={channelId} />
    </div>
  );
}

function TerminalContent({ channelId }: { channelId: string }) {
  const [lines, setLines] = useState<string[]>([]);

  const contentMap: Record<string, string[]> = {
    overview: [
      "$ tokamak --architecture",
      "",
      "  TOKAMAK NETWORK STACK",
      "  ═════════════════════",
      "",
      "        ╭──○──╮       ← TON TORUS",
      "        ╰─────╯         Fusion Core",
      "     ┌───────────┐",
      "     │ ■ ■ ■ ■ ■ │    ← L2: THANOS",
      "     │ ■ ■ ■ ■ ■ │      OP Stack Rollup",
      "     └─────┬─────┘",
      "   ┌───────┴───────┐",
      "   │  ◇ Staking    │  ← MIDDLEWARE",
      "   │  ◇ Bridge     │    SeigManager",
      "   │  ◇ Governance │    DepositManager",
      "   └───────┬───────┘",
      "  ┌────────┴────────┐",
      "  │  ◆ TONStarter   │ ← SERVICES",
      "  │  ◆ L2 Factory   │   DApps & Tools",
      "  │  ◆ Gemstone     │",
      "  └────────┬────────┘",
      " ┌─────────┴─────────┐",
      " │   ◈  ETHEREUM L1  │ ← SETTLEMENT",
      " │   Data Availability│   Base Layer",
      " └───────────────────┘",
      "",
      "> STACK: ALL LAYERS ACTIVE_",
    ],
    staking: [
      "$ tokamak stake --status",
      "",
      "╔══════════════════════════════════╗",
      "║     SEIGNIORAGE STAKING          ║",
      "╚══════════════════════════════════╝",
      "",
      "TOTAL STAKED .... 42,391,582 TON",
      "YOUR STAKE ...... 12,500 TON",
      "APR ............. 15.2%",
      "VALIDATORS ...... 124 active",
      "EPOCH ........... 1,247",
      "",
      "REWARDS (7d):",
      "  ████████████████░░░░ 82%",
      "  EST. +142.5 TON",
      "",
      "> STATUS: EARNING_",
    ],
    bridge: [
      "$ tokamak bridge --monitor",
      "",
      "CROSS-CHAIN BRIDGE v2.0",
      "═══════════════════════",
      "",
      "L1 (Ethereum) ←→ L2 (Thanos)",
      "",
      "RECENT TRANSFERS:",
      "  → 0x4a2f.. 1,200 TON  [CONFIRMED]",
      "  ← 0xb7e1..   850 TON  [CONFIRMED]",
      "  → 0x1c8d.. 3,400 TON  [PENDING..]",
      "",
      "TVL: $2.4M  |  AVG TIME: 2.4 min",
      "24H VOL: $1.2M",
      "",
      "> BRIDGE: OPERATIONAL_",
    ],
    governance: [
      "$ tokamak gov --proposals",
      "",
      "DAO GOVERNANCE COUNCIL",
      "══════════════════════",
      "",
      "ACTIVE PROPOSALS:",
      "",
      "TIP-42  Protocol Upgrade    [78% YES]",
      "  ████████████████░░░░",
      "",
      "TIP-43  Treasury Alloc.     [45% YES]",
      "  █████████░░░░░░░░░░░",
      "",
      "TIP-44  Bridge v2 Launch    [92% YES]",
      "  ██████████████████░░",
      "",
      "> QUORUM: REACHED_",
    ],
    ecosystem: [
      "$ tokamak eco --list",
      "",
      "ECOSYSTEM PROJECTS",
      "══════════════════",
      "",
      "  Titan ........... DeFi Hub     [LIVE]",
      "  Gemstone ........ DEX          [LIVE]",
      "  Dooropen ........ Bridge       [LIVE]",
      "  TONStarter ...... Launchpad    [LIVE]",
      "  L2 Factory ...... Rollup Tool  [BETA]",
      "",
      "TOTAL PROJECTS: 14",
      "MONTHLY ACTIVE: 8,247 wallets",
      "",
      "> NETWORK: GROWING_",
    ],
    developer: [
      "$ tokamak dev --quick-start",
      "",
      "DEVELOPER TOOLKIT",
      "═════════════════",
      "",
      "npx create-tokamak-app my-l2",
      "",
      "STACK:",
      "  Runtime ....... OP Stack (Bedrock)",
      "  Consensus ..... Optimistic Rollup",
      "  DA ............ Ethereum L1",
      "  RPC ........... https://rpc.thanos.io",
      "",
      "DOCS: docs.tokamak.network",
      "GITHUB: github.com/tokamak-network",
      "",
      "> BUILD: READY_",
    ],
  };

  useEffect(() => {
    const content = contentMap[channelId] || ["No data."];
    let idx = 0;
    setLines([]);
    const interval = setInterval(() => {
      if (idx < content.length) {
        const line = content[idx];
        setLines((prev) => [...prev, line]);
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [channelId]);

  return (
    <div className="text-[10px] md:text-xs space-y-0 leading-relaxed">
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            color: line?.startsWith(">") ? "#33ff33" : "#33ff33bb",
          }}
        >
          {line || "\u00A0"}
        </div>
      ))}
    </div>
  );
}
