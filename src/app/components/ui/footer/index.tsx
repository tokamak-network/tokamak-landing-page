"use client";

import Image from "next/image";
import TokamakLogo from "@/assets/images/Tokamak_Symbol.svg";
import TokamakLogoText from "@/assets/images/Tokamak_LogoText.svg";
import { NAV_COLUMNS } from "./navData";
import FooterNavColumn from "./FooterNavColumn";
import InlineNewsletter from "./InlineNewsletter";
import LiveDot from "@/app/components/shared/LiveDot";

export default function Footer() {
  return (
    <footer className="w-full py-[60px] border-t border-border-color flex justify-center px-6 [@media(max-width:1000px)]:px-4">
      <div className="flex flex-col w-full max-w-[1200px] gap-y-[32px]">
        {/* Top: Logo + Nav Grid */}
        <div className="flex justify-between items-start w-full [@media(max-width:1000px)]:flex-col-reverse gap-y-[30px]">
          {/* Logo */}
          <div className="flex [@media(min-width:1001px)]:flex-col justify-between [@media(max-width:1000px)]:items-center w-full h-full [@media(max-width:800px)]:justify-center [@media(min-width:1001px)]:max-w-[200px]">
            <figure className="flex items-center gap-2 [@media(max-width:800px)]:hidden">
              <Image loading="lazy" src={TokamakLogo} alt="Tokamak Network Logo" className="brightness-0 invert" />
              <Image loading="lazy" src={TokamakLogoText} alt="Tokamak Network" className="brightness-0 invert" />
            </figure>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-4 [@media(max-width:800px)]:hidden gap-4">
            {NAV_COLUMNS.map((col) => (
              <div
                key={col.title}
                className="p-5 bg-surface rounded-xl border border-border-color hover:border-primary/40 transition-colors duration-200"
              >
                <FooterNavColumn
                  column={col}
                  headingClass="font-[700] mb-4 text-white text-[14px]"
                  linkClass="hover:text-primary opacity-50 hover:opacity-100 transition-colors text-white text-[13px]"
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Network Status Row */}
        <div className="flex items-center gap-2 py-4 border-y border-border-color">
          <LiveDot />
          <span className="text-[13px] font-[400] text-white/60">
            Network Status:
          </span>
          <span className="text-[13px] font-[500] text-emerald-400">
            Active
          </span>
        </div>

        {/* Newsletter + Copyright */}
        <div className="flex justify-between items-end [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:items-center gap-y-[20px]">
          <InlineNewsletter variant="dark" />
          <div className="text-[11px] text-white/30">
            &copy; {new Date().getFullYear()} Tokamak Network{" "}
            <span className="[@media(max-width:800px)]:hidden">
              | All Rights Reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
