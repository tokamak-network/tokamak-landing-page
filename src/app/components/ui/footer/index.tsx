"use client";

import Image from "next/image";
import TokamakLogo from "@/assets/images/Tokamak_Symbol.svg";
import TokamakLogoText from "@/assets/images/Tokamak_LogoText.svg";
import { CLIP_PATHS } from "@/app/constants/styles";
import { NAV_COLUMNS } from "./navData";
import FooterNavColumn from "./FooterNavColumn";
import InlineNewsletter from "./InlineNewsletter";
import LiveDot from "@/app/components/shared/LiveDot";

export default function Footer() {
  return (
    <div className="w-full h-full">
      <footer
        className="w-full py-[60px] bg-[#1C1C1C] flex justify-center px-[25px] [@media(max-width:1000px)]:px-[15px]"
        style={{ clipPath: CLIP_PATHS.topCutCorners }}
      >
        <div className="flex flex-col w-full max-w-[1220px] gap-y-[32px]">
          {/* Top: Logo + Nav Cards Grid */}
          <div className="flex justify-between items-start w-full [@media(max-width:1000px)]:flex-col-reverse gap-y-[30px]">
            {/* Logo */}
            <div className="flex [@media(min-width:1001px)]:flex-col justify-between [@media(max-width:1000px)]:items-center w-full h-full [@media(max-width:800px)]:justify-center [@media(min-width:1001px)]:max-w-[200px]">
              <figure className="flex items-center gap-2 [@media(max-width:800px)]:hidden">
                <Image loading="lazy" src={TokamakLogo} alt="Tokamak Network Logo" className="brightness-0 invert" />
                <Image loading="lazy" src={TokamakLogoText} alt="Tokamak Network" className="brightness-0 invert" />
              </figure>
            </div>

            {/* Navigation — dashboard card grid */}
            <div className="grid grid-cols-4 [@media(max-width:800px)]:hidden gap-[16px]">
              {NAV_COLUMNS.map((col) => (
                <div
                  key={col.title}
                  className="p-[20px] bg-[#242424] rounded-[16px] border border-[#333] hover:border-[#0078FF]/40 transition-colors duration-200"
                >
                  <FooterNavColumn
                    column={col}
                    headingClass="font-[600] mb-4 text-white text-[14px]"
                    linkClass="hover:text-tokamak-blue hover:opacity-100 opacity-[0.5] transition-colors text-white text-[13px]"
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Network Status Row */}
          <div className="flex items-center gap-[8px] py-[16px] border-y border-[#333]">
            <LiveDot />
            <span className="text-[13px] font-[400] text-white/60">
              Network Status:
            </span>
            <span className="text-[13px] font-[500] text-[#28a745]">
              Active
            </span>
          </div>

          {/* Newsletter + Copyright */}
          <div className="flex justify-between items-end [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:items-center gap-y-[20px]">
            <InlineNewsletter variant="dark" />
            <div className="text-[11px] text-white font-normal opacity-[0.3]">
              &copy; {new Date().getFullYear()} Tokamak Network{" "}
              <span className="[@media(max-width:800px)]:hidden">
                | All Rights Reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
