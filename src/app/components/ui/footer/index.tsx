"use client";

import Image from "next/image";
import Link from "next/link";
import TokamakLogo from "@/assets/images/Tokamak_Symbol.svg";
import TokamakLogoText from "@/assets/images/Tokamak_LogoText.svg";
import { CLIP_PATHS } from "@/app/constants/styles";
import { NAV_COLUMNS } from "./navData";
import InlineNewsletter from "./InlineNewsletter";

export default function Footer() {
  return (
    <div className="w-full h-full">
      <footer
        className="w-full py-[80px] bg-white flex justify-center px-[25px] [@media(max-width:1000px)]:px-[15px]"
        style={{ clipPath: CLIP_PATHS.topCutCorners }}
      >
        <div className="flex flex-col items-center w-full max-w-[1220px]">
          {/* Centered Logo */}
          <figure className="flex items-center gap-2 mb-[48px]">
            <Image loading="lazy" src={TokamakLogo} alt="Tokamak Network Logo" />
            <Image loading="lazy" src={TokamakLogoText} alt="Tokamak Network" />
          </figure>

          {/* Navigation — horizontal centered groups */}
          <div className="flex flex-wrap justify-center gap-x-[60px] gap-y-[32px] mb-[48px] [@media(max-width:640px)]:hidden">
            {NAV_COLUMNS.map((col) => (
              <div key={col.title} className="flex flex-col items-center">
                <h3 className="text-[11px] font-[500] uppercase tracking-[3px] text-[#0078FF] mb-[12px]">
                  {col.title}
                </h3>
                <div className="flex flex-wrap justify-center gap-x-[20px] gap-y-[6px]">
                  {col.links.map((link) =>
                    link.isInternal ? (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-[14px] font-[300] text-[#1C1C1C] opacity-[0.5] hover:opacity-100 hover:text-tokamak-blue transition-all"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        key={link.label}
                        href={link.href}
                        className="text-[14px] font-[300] text-[#1C1C1C] opacity-[0.5] hover:opacity-100 hover:text-tokamak-blue transition-all"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full max-w-[600px] border-t border-[#E5E5E5] mb-[40px]" />

          {/* Newsletter — centered */}
          <div className="flex justify-center w-full mb-[40px]">
            <InlineNewsletter variant="light" />
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-[#1c1c1c] font-[300] opacity-[0.4]">
            &copy; {new Date().getFullYear()} Tokamak Network | All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
