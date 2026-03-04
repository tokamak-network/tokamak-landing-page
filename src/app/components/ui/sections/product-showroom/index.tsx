"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { protocolsData } from "../protocols/data";
import type { ProtocolCardProps } from "../protocols/types";

function ProductCard({
  protocol,
  index,
  isVisible,
}: {
  readonly protocol: ProtocolCardProps;
  readonly index: number;
  readonly isVisible: boolean;
}) {
  const githubLink = protocol.links?.find((l) => l.icon === "Github")?.link;
  const websiteLink = protocol.links?.find((l) => l.icon === "Website")?.link;
  const primaryLink = websiteLink ?? githubLink;

  const content = (
    <>
      <div className="flex items-start justify-between mb-5">
        <Image
          loading="lazy"
          src={protocol.icon}
          alt={protocol.alt}
          className="object-contain w-10 h-10 brightness-0 invert"
        />
        {protocol.links && protocol.links.length > 0 && (
          <div className="flex gap-2">
            {protocol.links.map((link) => (
              <a
                key={link.link}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#929298] font-[700] uppercase tracking-[0.04em] hover:text-primary transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {link.icon}
              </a>
            ))}
          </div>
        )}
      </div>
      <h3 className="text-[16px] font-[900] text-white mb-2 uppercase tracking-[0.04em] group-hover:text-primary transition-colors duration-300">
        {protocol.title}
      </h3>
      <p className="text-[13px] text-[#929298] leading-relaxed">
        {protocol.description}
      </p>
    </>
  );

  const sharedClass =
    "group flex flex-col p-8 bg-black/40 border border-[#434347]/50 transition-all duration-500 hover:bg-black/60 hover:border-primary/30";

  const sharedStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(20px)",
    transitionDelay: `${index * 60}ms`,
  };

  if (primaryLink) {
    return (
      <a
        href={primaryLink}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClass}
        style={sharedStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={sharedClass} style={sharedStyle}>
      {content}
    </div>
  );
}

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
      { threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="protocols"
      className="relative z-10 w-full flex justify-center bg-surface px-6 py-[160px] [@media(max-width:700px)]:py-[80px]"
    >
      <div ref={ref} className="w-full max-w-[1280px]">
        <h2 className="text-[12px] uppercase tracking-[0.08em] text-primary font-[700] mb-4 text-center">
          Products &amp; Protocols
        </h2>
        <p className="text-[38px] md:text-[48px] [@media(max-width:700px)]:text-[28px] text-white font-[900] text-center mb-4 leading-tight tracking-[0.04em] uppercase">
          The Tokamak Stack
        </p>
        <p className="text-[16px] text-[#929298] text-center mb-[80px] max-w-[600px] mx-auto">
          12 protocols powering on-demand L2 deployment, security, and governance on Ethereum.
        </p>

        <div className="grid grid-cols-3 [@media(max-width:1000px)]:grid-cols-2 [@media(max-width:600px)]:grid-cols-1 gap-0">
          {protocolsData.map((protocol, i) => (
            <ProductCard
              key={protocol.title}
              protocol={protocol}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
