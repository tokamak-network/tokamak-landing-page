"use client";

import Image from "next/image";
import Link from "next/link";
import TokamakLogo from "@/assets/images/Tokamak_Symbol.svg";
import TokamakLogoText from "@/assets/images/Tokamak_LogoText.svg";
import { NAV_COLUMNS } from "./navData";
import InlineNewsletter from "./InlineNewsletter";

export default function Footer() {
  return (
    <footer className="relative z-10 w-full border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 py-[60px]">
        {/* Top: Logo + Nav + Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-y-[40px] gap-x-[40px] mb-[40px]">
          {/* Logo + Tagline */}
          <div className="flex flex-col gap-3">
            <figure className="flex items-center gap-2">
              <Image loading="lazy" src={TokamakLogo} alt="Tokamak Network Logo" className="brightness-0 invert" />
              <Image loading="lazy" src={TokamakLogoText} alt="Tokamak Network" className="brightness-0 invert" />
            </figure>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Every app deserves its own L2.
            </p>
          </div>

          {/* Navigation — glass card */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 [@media(max-width:640px)]:hidden glass-panel rounded-2xl p-6">
            {NAV_COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col gap-2">
                <h3 className="text-[12px] font-[600] text-white uppercase tracking-wide mb-1">
                  {col.title}
                </h3>
                {col.links.map((link) =>
                  link.isInternal ? (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-[13px] text-slate-500 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-[13px] text-slate-500 hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="[@media(max-width:799px)]:hidden">
            <InlineNewsletter variant="dark" />
          </div>
        </div>

        {/* Bottom: Divider + Copyright + Social */}
        <div className="border-t border-white/10 pt-[24px] flex justify-between items-center [@media(max-width:640px)]:flex-col [@media(max-width:640px)]:gap-3">
          <p className="text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} Tokamak Network | All Rights Reserved.
          </p>
          <div className="flex gap-4">
            {NAV_COLUMNS.find((c) => c.title === "Social")?.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-white/30 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
