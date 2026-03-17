"use client";

import { useState, useCallback } from "react";
import { Globe, Coins, Gamepad2, LayoutGrid, Settings } from "lucide-react";
import { LINKS } from "@/app/constants/links";
import DeployAnimation from "./DeployAnimation";
import NetworkVisualization from "./NetworkVisualization";

type SimulatorPhase = "config" | "deploying" | "complete";
type Preset = "general" | "defi" | "gaming" | "full";
type Network = "sepolia" | "mainnet";

interface PresetOption {
  readonly value: Preset;
  readonly label: string;
  readonly duration: string;
  readonly icon: React.ElementType;
  readonly iconColor: string;
}

const PRESETS: readonly PresetOption[] = [
  { value: "general", label: "General", duration: "~12min", icon: Globe, iconColor: "text-primary" },
  { value: "defi", label: "DeFi", duration: "~18min", icon: Coins, iconColor: "text-[#f59e0b]" },
  { value: "gaming", label: "Gaming", duration: "~20min", icon: Gamepad2, iconColor: "text-[#8b5cf6]" },
  { value: "full", label: "Full", duration: "~25min", icon: LayoutGrid, iconColor: "text-[#929298]" },
] as const;

const NETWORKS = [
  { value: "sepolia" as Network, label: "Sepolia Testnet", subtitle: "For development & testing" },
  { value: "mainnet" as Network, label: "Ethereum Mainnet", subtitle: "Production deployment" },
] as const;

export default function SimulatorHero() {
  const [phase, setPhase] = useState<SimulatorPhase>("config");
  const [preset, setPreset] = useState<Preset>("defi");
  const [chainName, setChainName] = useState("");
  const [network, setNetwork] = useState<Network>("sepolia");

  const handleDeploy = useCallback(() => {
    setPhase("deploying");
  }, []);

  const handleDeployComplete = useCallback(() => {
    setPhase("complete");
  }, []);

  const handleReset = useCallback(() => {
    setPhase("config");
    setChainName("");
    setPreset("defi");
    setNetwork("sepolia");
  }, []);

  const selectedPreset = PRESETS.find((p) => p.value === preset)!;
  const isDeploying = phase === "deploying" || phase === "complete";

  return (
    <section className="relative z-10 w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <NetworkVisualization isDeploying={isDeploying} />
      </div>
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 pt-[250px] pb-[120px] flex flex-col [@media(min-width:960px)]:flex-row items-center justify-between gap-10">

        {/* Left: Hero text */}
        <div className="flex flex-col gap-6 text-left max-w-[520px] [@media(max-width:959px)]:text-center [@media(max-width:959px)]:items-center">
          <h1 className="font-orbitron text-[52px] md:text-[68px] [@media(max-width:650px)]:text-[38px] leading-[1.05] font-[900] tracking-[0.03em] uppercase">
            <span className="text-white">OWN YOUR L2.</span>
            <br />
            <span className="text-primary">EARN TON</span>
            <br />
            <span className="text-white">REWARDS.</span>
          </h1>
          <p className="text-[#c5c5ca] text-[16px] md:text-[18px] [@media(max-width:650px)]:text-[14px] leading-relaxed">
            Deploy your appchain on your own infrastructure. No revenue share. No lock-in. Just seigniorage rewards as your chain grows.
          </p>
          <div className="flex gap-4 mt-2 [@media(max-width:400px)]:flex-col [@media(max-width:400px)]:w-full">
            <a
              href={LINKS.ROLLUP_HUB}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-[16px] bg-primary hover:bg-primary/90 text-black text-[14px] font-[700] uppercase tracking-[0.06em] transition-all duration-300 text-center hover:-translate-y-1"
            >
              Start Building
            </a>
            <a
              href={LINKS.DOCS}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-[16px] bg-surface hover:bg-[#222225] text-white text-[14px] font-[700] uppercase tracking-[0.06em] transition-all duration-300 text-center hover:-translate-y-1"
            >
              Read Docs
            </a>
          </div>
        </div>

        {/* Right: Configurator */}
        <div className="w-full max-w-md [@media(max-width:959px)]:max-w-[560px] card-charcoal p-6 [@media(max-width:500px)]:p-5">

          {phase === "config" && (
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-white text-[13px] font-[700] uppercase tracking-[0.08em]">
                    L2 Configurator
                  </h3>
                  <Settings size={13} className="text-[#929298]" />
                </div>
              </div>

              {/* Preset selector */}
              <div>
                <p className="text-[11px] font-[700] text-[#929298] uppercase tracking-[0.1em] mb-2">
                  Choose Your Preset
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {PRESETS.map((p) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const Icon = p.icon as any;
                    const isSelected = preset === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPreset(p.value)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-1 border transition-colors duration-200 cursor-pointer
                          ${isSelected
                            ? "border-primary bg-primary/10"
                            : "border-[#434347] bg-black/40 hover:border-[#929298]"
                          }`}
                      >
                        <Icon size={20} className={p.iconColor} />
                        <span className={`text-[12px] font-[700] leading-tight ${isSelected ? "text-white" : "text-[#929298]"}`}>
                          {p.label}
                        </span>
                        <span className="text-[10px] text-[#929298] leading-tight">{p.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chain Name */}
              <div>
                <p className="text-[11px] font-[700] text-[#929298] uppercase tracking-[0.1em] mb-2">
                  Chain Name
                </p>
                <input
                  type="text"
                  value={chainName}
                  onChange={(e) => setChainName(e.target.value)}
                  placeholder={`e.g. my-${preset}-chain`}
                  className="w-full bg-black/60 border border-[#434347] focus:border-primary px-4 py-3 text-[#c5c5ca] text-[13px] outline-none placeholder:text-[#929298]/50 transition-colors duration-200"
                />
              </div>

              {/* Network */}
              <div>
                <p className="text-[11px] font-[700] text-[#929298] uppercase tracking-[0.1em] mb-2">
                  Network
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {NETWORKS.map((n) => {
                    const isSelected = network === n.value;
                    return (
                      <button
                        key={n.value}
                        type="button"
                        onClick={() => setNetwork(n.value)}
                        className={`flex flex-col gap-0.5 p-3 border text-left transition-colors duration-200 cursor-pointer
                          ${isSelected
                            ? "border-primary bg-surface"
                            : "border-[#434347] bg-black/40 hover:border-[#929298]"
                          }`}
                      >
                        <span className={`text-[13px] font-[700] ${isSelected ? "text-white" : "text-[#929298]"}`}>
                          {n.label}
                        </span>
                        <span className="text-[11px] text-[#929298]">{n.subtitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deploy button */}
              <button
                type="button"
                onClick={handleDeploy}
                className="w-full h-12 bg-surface hover:bg-primary/20 border border-[#434347] hover:border-primary text-[#929298] hover:text-primary text-[13px] font-[700] uppercase tracking-[0.08em] transition-all duration-300 cursor-pointer"
              >
                Deploy {selectedPreset.label} Chain →
              </button>
            </div>
          )}

          {phase === "deploying" && (
            <div className="flex flex-col gap-6 min-h-[300px] justify-center">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-[13px] font-[700] text-[#929298] uppercase tracking-[0.06em]">
                  Deploying
                </div>
                <div className="flex gap-1">
                  {chainName && (
                    <span className="px-2 py-0.5 bg-white/10 text-[12px] text-white/60 uppercase">
                      {chainName}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-white/10 text-[12px] text-white/60 uppercase">
                    {selectedPreset.label}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-[12px] text-white/60 uppercase">
                    {network === "sepolia" ? "Testnet" : "Mainnet"}
                  </span>
                </div>
              </div>
              <DeployAnimation onComplete={handleDeployComplete} />
            </div>
          )}

          {phase === "complete" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="w-16 h-16 bg-[#28a745]/20 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M6 16L13 23L26 9" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-[24px] font-[900] text-white mb-2 uppercase tracking-[0.06em]">
                  Config file ready.
                </h3>
                <p className="text-[14px] text-[#929298]">
                  {chainName || `my-${preset}-chain`} · {selectedPreset.label} · {network === "sepolia" ? "Testnet" : "Mainnet"}
                </p>
              </div>
              <div className="flex gap-3 mt-2 [@media(max-width:400px)]:flex-col [@media(max-width:400px)]:w-full">
                <a
                  href={LINKS.ROLLUP_HUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-[14px] bg-primary hover:bg-primary/90 text-black text-[14px] font-[700] uppercase tracking-[0.06em] transition-all duration-300 text-center hover:-translate-y-1"
                >
                  Go to Rollup Hub →
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-[14px] bg-surface hover:bg-[#222225] text-white/70 text-[14px] font-[500] uppercase tracking-[0.06em] transition-all duration-300 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
