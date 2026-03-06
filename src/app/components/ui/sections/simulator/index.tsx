"use client";

import { useState, useCallback } from "react";
import { Type, Coins, Globe, FileDown, Settings } from "lucide-react";
import { LINKS } from "@/app/constants/links";
import ConfigInput from "./ConfigInput";
import ConfigSelector from "./ConfigSelector";
import DeployAnimation from "./DeployAnimation";
import NetworkVisualization from "./NetworkVisualization";

type SimulatorPhase = "config" | "deploying" | "complete";

const GAS_TOKEN_OPTIONS = [
  { label: "TON", value: "ton" },
  { label: "ETH", value: "eth" },
] as const;

const GAS_TOKEN_SUBTITLES: Record<string, string> = {
  ton: "Tokamak native token",
  eth: "Ether as gas token",
};

const NETWORK_OPTIONS = [
  { label: "Mainnet", value: "mainnet" },
  { label: "Testnet", value: "testnet" },
] as const;

const NETWORK_SUBTITLES: Record<string, string> = {
  mainnet: "Ethereum mainnet settlement",
  testnet: "Sepolia testnet deployment",
};

export default function SimulatorHero() {
  const [phase, setPhase] = useState<SimulatorPhase>("config");
  const [chainName, setChainName] = useState("");
  const [gasToken, setGasToken] = useState("ton");
  const [network, setNetwork] = useState("mainnet");

  const handleDeploy = useCallback(() => {
    setPhase("deploying");
  }, []);

  const handleDeployComplete = useCallback(() => {
    setPhase("complete");
  }, []);

  const handleReset = useCallback(() => {
    setPhase("config");
    setChainName("");
    setGasToken("ton");
    setNetwork("mainnet");
  }, []);

  const isDeploying = phase === "deploying" || phase === "complete";

  return (
    <section className="relative z-10 w-full overflow-hidden flex items-center justify-center">
      {/* Background network visualization */}
      <div className="absolute inset-0">
        <NetworkVisualization isDeploying={isDeploying} />
      </div>

      {/* Subtle dot grid */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      {/* Content — side-by-side layout */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 pt-[120px] pb-[120px] flex flex-col [@media(min-width:960px)]:flex-row items-center [@media(min-width:960px)]:items-center justify-between gap-10">
        {/* Left: Hero text + CTA */}
        <div className="flex flex-col gap-6 text-left max-w-[680px] [@media(max-width:959px)]:text-center [@media(max-width:959px)]:items-center">
          <h1 className="text-[54px] md:text-[80px] [@media(max-width:650px)]:text-[40px] leading-[1.05] text-white font-[900] tracking-[0.06em] uppercase">
            Own Your L2. Earn TON Rewards.
          </h1>
          <p className="text-[#c5c5ca] text-[18px] md:text-[20px] [@media(max-width:650px)]:text-[14px] font-[400] leading-relaxed">
            Deploy your appchain on your own infrastructure. No revenue share. No lock-in. Just seigniorage rewards as your chain grows.
          </p>
          <div className="flex gap-4 mt-2 [@media(max-width:400px)]:flex-col [@media(max-width:400px)]:w-full">
            <a
              href={LINKS.ROLLUP_HUB}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-[16px] bg-primary hover:bg-primary/90 text-black text-[14px] font-[700] uppercase tracking-[0.06em]
                transition-all duration-300 text-center hover:-translate-y-1"
            >
              Start Building
            </a>
            <a
              href={LINKS.DOCS}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-[16px] bg-surface hover:bg-[#222225] text-white text-[14px] font-[700] uppercase tracking-[0.06em]
                transition-all duration-300 text-center cursor-pointer hover:-translate-y-1"
            >
              Read Docs
            </a>
          </div>
        </div>

        {/* Right: Configuration Panel — charcoal card */}
        <div className="w-full max-w-md [@media(max-width:959px)]:max-w-[560px] card-charcoal p-6 [@media(max-width:500px)]:p-5">
          {phase === "config" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white text-[14px] font-[700] uppercase tracking-[0.06em]">
                  L2 Configurator
                </h3>
                <Settings size={16} className="text-primary" />
              </div>
              <ConfigInput
                title="Chain Name"
                placeholder="e.g. my-tokamak-l2"
                icon={<Type size={20} />}
                value={chainName}
                onChange={setChainName}
              />
              <ConfigSelector
                title="Gas Token"
                subtitle={GAS_TOKEN_SUBTITLES[gasToken]}
                icon={<Coins size={20} />}
                options={GAS_TOKEN_OPTIONS}
                selected={gasToken}
                onSelect={setGasToken}
              />
              <ConfigSelector
                title="Network"
                subtitle={NETWORK_SUBTITLES[network]}
                icon={<Globe size={20} />}
                options={NETWORK_OPTIONS}
                selected={network}
                onSelect={setNetwork}
              />

              <button
                type="button"
                onClick={handleDeploy}
                className="mt-2 w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/90 text-black text-[14px] font-[700] uppercase tracking-[0.06em]
                  transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <span>Generate Config</span>
                <FileDown size={16} />
              </button>
            </div>
          )}

          {phase === "deploying" && (
            <div className="flex flex-col gap-6 min-h-[240px] justify-center">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-[13px] font-[700] text-[#929298] uppercase tracking-[0.06em]">
                  Generating
                </div>
                <div className="flex gap-1">
                  {chainName && (
                    <span className="px-2 py-0.5 bg-white/10 text-[12px] text-white/60 uppercase">
                      {chainName}
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-white/10 text-[12px] text-white/60 uppercase">
                    {gasToken}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-[12px] text-white/60 uppercase">
                    {network}
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
                  <path
                    d="M6 16L13 23L26 9"
                    stroke="#28a745"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div className="text-center">
                <h3 className="text-[24px] font-[900] text-white mb-2 uppercase tracking-[0.06em]">
                  Config file ready.
                </h3>
                <p className="text-[14px] text-[#929298]">
                  {chainName || "my-l2"} &middot; {gasToken.toUpperCase()} &middot;{" "}
                  {network}
                </p>
              </div>

              <div className="flex gap-3 mt-2 [@media(max-width:400px)]:flex-col [@media(max-width:400px)]:w-full">
                <a
                  href={LINKS.ROLLUP_HUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-[14px] bg-primary hover:bg-primary/90 text-black text-[14px] font-[700] uppercase tracking-[0.06em]
                    transition-all duration-300 text-center hover:-translate-y-1"
                >
                  Go to Rollup Hub &rarr;
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-[14px] bg-surface hover:bg-[#222225] text-white/70 text-[14px] font-[500] uppercase tracking-[0.06em]
                    transition-all duration-300 cursor-pointer"
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
