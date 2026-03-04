"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import infrastructureIcon from "@/assets/icons/protocols/1.svg";
import applicationL2Icon from "@/assets/icons/protocols/2.svg";
import zkEvmIcon from "@/assets/icons/protocols/3.svg";
import securityIcon from "@/assets/icons/protocols/6.svg";

interface HighlightProtocol {
  icon: string;
  title: string;
  description: string;
  alt: string;
  link?: string;
}

const HIGHLIGHTS: HighlightProtocol[] = [
  {
    icon: infrastructureIcon,
    title: "L2 Infrastructure & Scalability",
    description:
      "Core protocols for L2 infrastructure, enabling scalable on-demand rollup deployment on Ethereum.",
    alt: "L2 Infrastructure icon",
  },
  {
    icon: applicationL2Icon,
    title: "Application-specific L2",
    description:
      "Deploy specialized L2s for gaming, privacy, or DeFi via Tokamak Rollup Hub — tailored to your use case.",
    alt: "Applications L2 icon",
    link: "https://github.com/tokamak-network/tokamak-rollup-hub",
  },
  {
    icon: zkEvmIcon,
    title: "New class of zk-EVM",
    description:
      "Anyone can become a prover with minimal hardware, enabling accessible zk-based L2 launches.",
    alt: "zk-EVM icon",
    link: "https://github.com/tokamak-network/Tokamak-ZkEVM",
  },
  {
    icon: securityIcon,
    title: "Enhanced Security & Identity",
    description:
      "Security, reliability, and identity enhancement protocols that strengthen the entire L2 ecosystem.",
    alt: "Security icon",
  },
];

export default function ProtocolsHighlight() {
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
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="protocols" className="w-full flex justify-center bg-slate-50 px-6 py-[100px] [@media(max-width:700px)]:py-[60px]">
      <div ref={ref} className="w-full max-w-[1200px]">
        <h2 className="text-[14px] uppercase tracking-[3px] text-[#0078FF] font-[500] mb-4 text-center">
          Protocols
        </h2>
        <p className="text-[28px] [@media(max-width:700px)]:text-[22px] text-slate-900 font-[700] text-center mb-[60px] max-w-[500px] mx-auto leading-snug tracking-tight">
          Key capabilities powering the network
        </p>

        <div className="grid grid-cols-2 [@media(max-width:700px)]:grid-cols-1 gap-6">
          {HIGHLIGHTS.map((protocol, i) => (
            <div
              key={protocol.title}
              className="flex flex-col p-8 bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-700 hover:border-[#0078FF] hover:-translate-y-1"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <Image
                loading="lazy"
                src={protocol.icon}
                alt={protocol.alt}
                className="object-contain w-8 h-8 mb-4"
              />
              <h3 className="text-[18px] font-[600] text-slate-900 mb-2">
                {protocol.title}
              </h3>
              <p className="text-[14px] text-slate-500 leading-relaxed mb-4 flex-1">
                {protocol.description}
              </p>
              {protocol.link && (
                <a
                  href={protocol.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-[#0078FF] hover:text-[#3399ff] font-[400] transition-colors"
                >
                  Learn More →
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/#protocols"
            className="text-[14px] text-slate-400 hover:text-slate-600 font-[400] transition-colors"
          >
            See all 12 protocols →
          </Link>
        </div>
      </div>
    </section>
  );
}
