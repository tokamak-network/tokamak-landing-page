"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import TokamakLogo from "@/assets/images/Tokamak_Symbol.svg";
import TokamakLogoText from "@/assets/images/Tokamak_LogoText.svg";
import { NAV_COLUMNS } from "@/app/components/ui/footer/navData";
import InlineNewsletter from "@/app/components/ui/footer/InlineNewsletter";

/* ═══════════════════════════════════════════════
   Ethereum Badge — "Built on Ethereum" indicator
   ═══════════════════════════════════════════════ */

function EthereumBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center gap-2"
    >
      {/* Ethereum diamond icon */}
      <svg
        width="16"
        height="26"
        viewBox="0 0 16 26"
        fill="none"
        style={{ filter: "drop-shadow(0 0 6px rgba(98, 126, 234, 0.5))" }}
      >
        <path d="M7.998 0L7.852 0.497V17.546L7.998 17.691L15.996 13.228L7.998 0Z" fill="#627EEA" fillOpacity="0.8" />
        <path d="M7.998 0L0 13.228L7.998 17.691V9.47V0Z" fill="#627EEA" fillOpacity="0.6" />
        <path d="M7.998 19.172L7.916 19.271V25.413L7.998 25.652L16 14.712L7.998 19.172Z" fill="#627EEA" fillOpacity="0.8" />
        <path d="M7.998 25.652V19.172L0 14.712L7.998 25.652Z" fill="#627EEA" fillOpacity="0.6" />
        <path d="M7.998 17.691L15.996 13.228L7.998 9.47V17.691Z" fill="#627EEA" fillOpacity="0.5" />
        <path d="M0 13.228L7.998 17.691V9.47L0 13.228Z" fill="#627EEA" fillOpacity="0.35" />
      </svg>
      <span
        style={{
          fontSize: "clamp(9px, 0.7vw, 11px)",
          color: "rgba(98, 126, 234, 0.7)",
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          textShadow: "0 0 8px rgba(98, 126, 234, 0.3)",
        }}
      >
        Built on Ethereum
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   Social Icon Links
   ═══════════════════════════════════════════════ */

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Medium: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  ),
  "X (Twitter)": (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Discord: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
    </svg>
  ),
  "Telegram (EN)": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  LinkedIn: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

/* ═══════════════════════════════════════════════
   Main Export — Tower Foundation Footer
   ═══════════════════════════════════════════════ */

export default function TowerFoundation() {
  const socialColumn = NAV_COLUMNS.find((c) => c.title === "Social");
  const navColumns = NAV_COLUMNS.filter((c) => c.title !== "Social");

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "clamp(500px, 60vh, 700px)" }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/tower/floor-foundation.png"
          alt="Tower foundation — Tokamak Network built on Ethereum"
          fill
          className="object-cover object-top"
          sizes="100vw"
        />
        {/* Top fade to black */}
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "30%",
            background:
              "linear-gradient(180deg, black 0%, rgba(0,0,0,0.7) 40%, transparent 100%)",
          }}
        />
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.85) 100%)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-[clamp(60px,10vh,100px)] pb-[clamp(30px,5vh,50px)] flex flex-col h-full">
        {/* Top Section: Logo + Ethereum Badge + Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start gap-8 mb-[clamp(30px,5vh,50px)]"
        >
          {/* Logo + Tagline + Ethereum */}
          <div className="flex flex-col gap-4">
            <figure className="flex items-center gap-2">
              <Image
                loading="lazy"
                src={TokamakLogo}
                alt="Tokamak Network Logo"
              />
              <Image
                loading="lazy"
                src={TokamakLogoText}
                alt="Tokamak Network"
              />
            </figure>
            <p
              style={{
                fontSize: "clamp(12px, 1vw, 14px)",
                color: "rgba(255, 255, 255, 0.5)",
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: "0.05em",
              }}
            >
              Every app deserves its own L2.
            </p>
            <EthereumBadge />
          </div>

          {/* Newsletter */}
          <div className="w-full md:w-auto md:max-w-[320px]">
            <InlineNewsletter variant="dark" />
          </div>
        </motion.div>

        {/* Navigation Columns */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-x-[clamp(30px,4vw,60px)] gap-y-6 mb-[clamp(30px,5vh,50px)] [@media(max-width:640px)]:hidden"
        >
          {navColumns.map((col) => (
            <div key={col.title} className="flex flex-col gap-2">
              <h3
                style={{
                  fontSize: "clamp(9px, 0.7vw, 11px)",
                  color: "rgba(0, 229, 255, 0.6)",
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: 4,
                  textShadow: "0 0 8px rgba(0, 229, 255, 0.2)",
                }}
              >
                {col.title}
              </h3>
              {col.links.map((link) =>
                link.isInternal ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-white/50 hover:text-[#00e5ff] transition-colors duration-300"
                    style={{
                      fontSize: "clamp(11px, 0.85vw, 13px)",
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-white/50 hover:text-[#00e5ff] transition-colors duration-300"
                    style={{
                      fontSize: "clamp(11px, 0.85vw, 13px)",
                      fontFamily: "'Share Tech Mono', monospace",
                      letterSpacing: "0.03em",
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                ),
              )}
            </div>
          ))}
        </motion.div>

        {/* Spacer to push bottom section down */}
        <div className="flex-1" />

        {/* Bottom: Divider + Copyright + Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Divider line with glow */}
          <div
            style={{
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.2) 20%, rgba(98, 126, 234, 0.3) 50%, rgba(0, 229, 255, 0.2) 80%, transparent)",
              marginBottom: "clamp(16px, 2vh, 24px)",
            }}
          />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p
              style={{
                fontSize: "clamp(10px, 0.7vw, 12px)",
                color: "rgba(255, 255, 255, 0.3)",
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: "0.05em",
              }}
            >
              &copy; {new Date().getFullYear()} Tokamak Network | All Rights
              Reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialColumn?.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-[#00e5ff] transition-all duration-300 hover:drop-shadow-[0_0_6px_rgba(0,229,255,0.4)]"
                  title={link.label}
                >
                  {SOCIAL_ICONS[link.label] || (
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "'Share Tech Mono', monospace",
                      }}
                    >
                      {link.label}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
