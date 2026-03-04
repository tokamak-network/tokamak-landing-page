"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, Cpu, Globe, Rocket } from "lucide-react";
import type { ReactNode } from "react";

interface Product {
  icon: ReactNode;
  name: string;
  tagline: string;
  description: string;
  href: string;
  status: "live" | "testnet" | "development";
}

const PRODUCTS: Product[] = [
  {
    icon: <Layers size={28} />,
    name: "Rollup Hub",
    tagline: "On-Demand L2 Deployment",
    description:
      "Launch application-specific rollups in minutes. Configure VM type, gas tokens, and privacy settings through a single interface.",
    href: "https://rolluphub.tokamak.network/",
    status: "live",
  },
  {
    icon: <Cpu size={28} />,
    name: "Tokamak ZkEVM",
    tagline: "Lightweight Zero-Knowledge Prover",
    description:
      "A new class of zk-EVM where anyone can become a prover with minimal hardware. No specialized equipment required.",
    href: "https://github.com/tokamak-network/Tokamak-ZkEVM",
    status: "development",
  },
  {
    icon: <Globe size={28} />,
    name: "Titan Network",
    tagline: "Public L2 for Tokamak Ecosystem",
    description:
      "The flagship public L2 network powering the Tokamak ecosystem. Battle-tested infrastructure with Ethereum-grade security.",
    href: "https://docs.tokamak.network",
    status: "live",
  },
  {
    icon: <Rocket size={28} />,
    name: "TON Staking",
    tagline: "Secure the Network, Earn Rewards",
    description:
      "Stake TON tokens to secure the network and earn rewards. Participate in governance and help shape the future of Tokamak.",
    href: "https://github.com/tokamak-network/TokamakStaking",
    status: "live",
  },
];

const STATUS_STYLES = {
  live: "bg-[#00C853]/20 text-[#00C853]",
  testnet: "bg-[#FF9800]/20 text-[#FF9800]",
  development: "bg-primary/20 text-primary",
} as const;

const STATUS_LABELS = {
  live: "LIVE",
  testnet: "TESTNET",
  development: "IN DEV",
} as const;

export default function ProductShowroom() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative z-10 w-full flex justify-center bg-surface px-6 py-[160px] [@media(max-width:700px)]:py-[80px]">
      <div ref={ref} className="w-full max-w-[1280px]">
        <h2 className="text-[12px] uppercase tracking-[0.08em] text-primary font-[700] mb-4 text-center">
          Products
        </h2>
        <p className="text-[38px] md:text-[48px] [@media(max-width:700px)]:text-[28px] text-white font-[900] text-center mb-4 leading-tight tracking-[0.04em] uppercase">
          The Tokamak Stack
        </p>
        <p className="text-[16px] text-[#929298] text-center mb-[80px] max-w-[500px] mx-auto">
          Everything you need to build, deploy, and scale on Ethereum.
        </p>

        <div className="grid grid-cols-2 [@media(max-width:800px)]:grid-cols-1 gap-0">
          {PRODUCTS.map((product, i) => (
            <a
              key={product.name}
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col p-10 bg-black/40 border border-[#434347]/50 transition-all duration-500 hover:bg-black/60 hover:border-primary/30"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                  {product.icon}
                </div>
                <span
                  className={`px-3 py-1 text-[11px] font-[700] uppercase tracking-[0.06em] ${STATUS_STYLES[product.status]}`}
                >
                  {STATUS_LABELS[product.status]}
                </span>
              </div>

              <h3 className="text-[22px] font-[900] text-white uppercase tracking-[0.04em] mb-1 group-hover:text-primary transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-[13px] text-primary font-[700] uppercase tracking-[0.04em] mb-4">
                {product.tagline}
              </p>
              <p className="text-[14px] text-[#929298] leading-relaxed flex-1">
                {product.description}
              </p>

              <span className="mt-6 text-[13px] text-[#929298] font-[700] uppercase tracking-[0.04em] group-hover:text-primary transition-colors duration-300">
                Explore →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
