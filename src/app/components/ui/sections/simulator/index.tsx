"use client";

import { useState, useCallback } from "react";
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

const PRIVACY_OPTIONS = [
  { label: "Public", value: "public" },
  { label: "Private", value: "private" },
  { label: "Hybrid", value: "hybrid" },
] as const;

const VM_OPTIONS = [
  { label: "EVM", value: "evm" },
  { label: "zk-EVM", value: "zk-evm" },
] as const;

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
    <section className="relative z-10 w-full min-h-[860px] [@media(max-width:700px)]:min-h-[700px] overflow-hidden flex items-center justify-center">
      {/* Background network visualization */}
      <div className="absolute inset-0">
        <NetworkVisualization isDeploying={isDeploying} />
      </div>

      {/* Blue glow behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 pt-[140px] pb-[80px] flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-[50px]">
          <h1 className="text-[48px] md:text-[72px] [@media(max-width:650px)]:text-[36px] leading-[1.1] text-white font-[700] tracking-[-0.04em] mb-6 drop-shadow-[0_0_15px_rgba(0,119,255,0.3)]">
            Build Your L2 <br />in Seconds
          </h1>
          <p className="text-[18px] [@media(max-width:650px)]:text-[14px] text-slate-400 max-w-[600px] mx-auto leading-relaxed">
            Deploy customizable Layer 2 solutions with unmatched speed, security, and flexibility.
          </p>
        </div>

        {/* Glassmorphism Simulator Card */}
        <div className="w-full max-w-[640px] rounded-2xl p-8 [@media(max-width:500px)]:p-5 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {phase === "config" && (
            <div className="flex flex-col gap-6">
              <h3 className="text-white text-[18px] font-[600] mb-2 flex items-center gap-2">
                Configure Your Chain
              </h3>
              <ConfigSelector
                title="Throughput"
                options={THROUGHPUT_OPTIONS}
                selected={throughput}
                onSelect={setThroughput}
              />
              <ConfigSelector
                title="Privacy"
                options={PRIVACY_OPTIONS}
                selected={privacy}
                onSelect={setPrivacy}
              />
              <ConfigSelector
                title="Virtual Machine"
                options={VM_OPTIONS}
                selected={vm}
                onSelect={setVm}
              />

              <button
                type="button"
                onClick={handleDeploy}
                className="mt-4 w-full py-[14px] rounded-full bg-primary hover:bg-primary/90 text-white text-[16px] font-[600]
                  transition-all duration-200 cursor-pointer
                  shadow-[0_0_20px_rgba(0,119,255,0.4)]"
              >
                Launch Your L2
              </button>
            </div>
          )}

          {phase === "deploying" && (
            <div className="flex flex-col gap-6 min-h-[240px] justify-center">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-[13px] font-[500] text-white/40 uppercase tracking-wider">
                  Deploying
                </div>
                <div className="flex gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[12px] text-white/60">
                    {throughput}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[12px] text-white/60">
                    {privacy}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[12px] text-white/60">
                    {vm}
                  </span>
                </div>
              </div>
              <DeployAnimation onComplete={handleDeployComplete} />
            </div>
          )}

          {phase === "complete" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="w-16 h-16 rounded-full bg-[#28a745]/20 flex items-center justify-center">
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
                <h3 className="text-[24px] font-[600] text-white mb-2">
                  Your L2 is ready.
                </h3>
                <p className="text-[14px] text-slate-400">
                  {throughput} throughput &middot; {privacy} privacy &middot;{" "}
                  {vm.toUpperCase()}
                </p>
              </div>

              <div className="flex gap-3 mt-2 [@media(max-width:400px)]:flex-col [@media(max-width:400px)]:w-full">
                <a
                  href={LINKS.ROLLUP_HUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-[12px] rounded-full bg-primary hover:bg-primary/90 text-white text-[14px] font-[600]
                    transition-all duration-200 text-center
                    shadow-[0_0_20px_rgba(0,119,255,0.4)]"
                >
                  Deploy for Real &rarr;
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-[12px] rounded-full bg-white/5 hover:bg-white/10 text-white/70 text-[14px] font-[500]
                    transition-all duration-200 cursor-pointer border border-white/10"
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
