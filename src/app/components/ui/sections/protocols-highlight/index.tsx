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
    <section id="protocols" className="relative z-10 w-full flex justify-center bg-black px-6 py-[160px] [@media(max-width:700px)]:py-[80px]">
      <div ref={ref} className="w-full max-w-[1280px]">
        <h2 className="text-[12px] uppercase tracking-[0.08em] text-primary font-[700] mb-4 text-center">
          Protocols
        </h2>
        <p className="text-[38px] [@media(max-width:700px)]:text-[28px] text-white font-[900] text-center mb-[80px] max-w-[500px] mx-auto leading-tight tracking-[0.04em] uppercase">
          Powering the Network
        </p>

        <div className="grid grid-cols-2 [@media(max-width:700px)]:grid-cols-1 gap-6">
          {HIGHLIGHTS.map((protocol, i) => (
            <div
              key={protocol.title}
              className="flex flex-col p-8 card-charcoal"
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
                className="object-contain w-8 h-8 mb-5 brightness-0 invert"
              />
              <h3 className="text-[18px] font-[900] text-white mb-2 uppercase tracking-[0.04em]">
                {protocol.title}
              </h3>
              <p className="text-[14px] text-[#929298] leading-relaxed mb-4 flex-1">
                {protocol.description}
              </p>
              {protocol.link && (
                <a
                  href={protocol.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-primary font-[700] uppercase tracking-[0.04em] transition-colors duration-300"
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
            className="text-[14px] text-[#929298] hover:text-primary font-[700] uppercase tracking-[0.04em] transition-colors duration-300"
          >
            See all 12 protocols →
          </Link>
        </div>
      </div>
    </section>
  );
}
