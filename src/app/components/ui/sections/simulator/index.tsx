"use client";

import { useState, useCallback } from "react";
import { Zap, Shield, Monitor, Rocket, Settings } from "lucide-react";
import { LINKS } from "@/app/constants/links";
import ConfigSelector from "./ConfigSelector";
import DeployAnimation from "./DeployAnimation";
import NetworkVisualization from "./NetworkVisualization";

type SimulatorPhase = "config" | "deploying" | "complete";

const THROUGHPUT_OPTIONS = [
  { label: "Standard", value: "standard" },
  { label: "High", value: "high" },
  { label: "Ultra", value: "ultra" },
] as const;

const THROUGHPUT_SUBTITLES: Record<string, string> = {
  standard: "Standard throughput setup",
  high: "High throughput setup",
  ultra: "Ultra throughput setup",
};

const PRIVACY_OPTIONS = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Hybrid", value: "hybrid" },
] as const;

const PRIVACY_SUBTITLES: Record<string, string> = {
  public: "Public chain configuration",
  private: "Advanced privacy config",
  hybrid: "Hybrid privacy mode",
};

const VM_OPTIONS = [
  { label: "EVM", value: "evm" },
  { label: "zk-EVM", value: "zk-evm" },
] as const;

const VM_SUBTITLES: Record<string, string> = {
  evm: "Standard EVM runtime",
  "zk-evm": "Zero-knowledge EVM",
};

export default function SimulatorHero() {
  const [phase, setPhase] = useState<SimulatorPhase>("config");
  const [throughput, setThroughput] = useState("standard");
  const [privacy, setPrivacy] = useState("public");
  const [vm, setVm] = useState("evm");

  const handleDeploy = useCallback(() => {
    setPhase("deploying");
  }, []);

  const handleDeployComplete = useCallback(() => {
    setPhase("complete");
  }, []);

  const handleReset = useCallback(() => {
    setPhase("config");
    setThroughput("standard");
    setPrivacy("public");
    setVm("evm");
  }, []);

  const isDeploying = phase === "deploying" || phase === "complete";

  return (
    <section className="relative z-10 w-full min-h-[900px] [@media(max-width:700px)]:min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Background network visualization */}
      <div className="absolute inset-0">
        <NetworkVisualization isDeploying={isDeploying} />
      </div>

      {/* Subtle dot grid */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      {/* Content — side-by-side layout */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 pt-[200px] pb-[120px] flex flex-col [@media(min-width:960px)]:flex-row items-center [@media(min-width:960px)]:items-center justify-between gap-16">
        {/* Left: Hero text + CTA */}
        <div className="flex flex-col gap-8 text-left max-w-[560px] [@media(max-width:959px)]:text-center [@media(max-width:959px)]:items-center">
          <h1 className="text-[54px] md:text-[80px] [@media(max-width:650px)]:text-[40px] leading-[1.05] text-white font-[900] tracking-[0.06em] uppercase">
            Build Your L2
            <br />
            In Seconds
          </h1>
          <p className="text-[#c5c5ca] text-[18px] md:text-[20px] [@media(max-width:650px)]:text-[14px] font-[400] leading-relaxed max-w-[520px]">
            A premium crypto protocol for deploying and scaling custom Layer 2
            solutions with unmatched speed and security.
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
              <ConfigSelector
                title="Throughput"
                subtitle={THROUGHPUT_SUBTITLES[throughput]}
                icon={<Zap size={20} />}
                options={THROUGHPUT_OPTIONS}
                selected={throughput}
                onSelect={setThroughput}
              />
              <ConfigSelector
                title="Privacy"
                subtitle={PRIVACY_SUBTITLES[privacy]}
                icon={<Shield size={20} />}
                options={PRIVACY_OPTIONS}
                selected={privacy}
                onSelect={setPrivacy}
              />
              <ConfigSelector
                title="VM Options"
                subtitle={VM_SUBTITLES[vm]}
                icon={<Monitor size={20} />}
                options={VM_OPTIONS}
                selected={vm}
                onSelect={setVm}
              />

              <button
                type="button"
                onClick={handleDeploy}
                className="mt-2 w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/90 text-black text-[14px] font-[700] uppercase tracking-[0.06em]
                  transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                <span>Deploy Instance</span>
                <Rocket size={16} />
              </button>
            </div>
          )}

          {phase === "deploying" && (
            <div className="flex flex-col gap-6 min-h-[240px] justify-center">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-[13px] font-[700] text-[#929298] uppercase tracking-[0.06em]">
                  Deploying
                </div>
                <div className="flex gap-1">
                  <span className="px-2 py-0.5 bg-white/10 text-[12px] text-white/60 uppercase">
                    {throughput}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-[12px] text-white/60 uppercase">
                    {privacy}
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-[12px] text-white/60 uppercase">
                    {vm}
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
                  Your L2 is ready.
                </h3>
                <p className="text-[14px] text-[#929298]">
                  {throughput} throughput &middot; {privacy} privacy &middot;{" "}
                  {vm.toUpperCase()}
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
                  Deploy for Real &rarr;
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
