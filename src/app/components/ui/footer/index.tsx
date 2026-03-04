"use client";

import Image from "next/image";
import TokamakLogo from "@/assets/images/Tokamak_Symbol.svg";
import TokamakLogoText from "@/assets/images/Tokamak_LogoText.svg";
import { CLIP_PATHS } from "@/app/constants/styles";
import { NAV_COLUMNS } from "./navData";
import FooterNavColumn from "./FooterNavColumn";
import InlineNewsletter from "./InlineNewsletter";

export default function Footer() {
  return (
    <div className="w-full h-full">
      <footer
        className="w-full py-[60px] bg-white flex justify-center px-[25px] [@media(max-width:1000px)]:px-[15px]"
        style={{ clipPath: CLIP_PATHS.topCutCorners }}
      >
        <div className="flex flex-col w-full max-w-[1220px] gap-y-[40px]">
          {/* Top: Logo + Nav */}
          <div className="flex justify-between items-start w-full [@media(max-width:1000px)]:flex-col-reverse gap-y-[30px]">
            {/* Logo */}
            <div className="flex [@media(min-width:1001px)]:flex-col justify-between [@media(max-width:1000px)]:items-center w-full h-full [@media(max-width:800px)]:justify-center [@media(min-width:1001px)]:max-w-[200px]">
              <figure className="flex items-center gap-2 [@media(max-width:800px)]:hidden">
                <Image loading="lazy" src={TokamakLogo} alt="Tokamak Network Logo" />
                <Image loading="lazy" src={TokamakLogoText} alt="Tokamak Network" />
              </figure>
            </div>

            {/* Navigation */}
            <div className="flex text-right [@media(max-width:800px)]:hidden">
              {NAV_COLUMNS.map((col) => (
                <FooterNavColumn
                  key={col.title}
                  column={col}
                  headingClass="font-[600] mb-4 text-tokamak-black"
                  linkClass="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                />
              ))}
            </div>
          </div>

          {/* Newsletter + Copyright */}
          <div className="border-t border-[#E5E5E5] pt-[30px] flex justify-between items-end [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:items-center gap-y-[20px]">
            <InlineNewsletter variant="light" />
            <div className="text-[11px] text-[#1c1c1c] font-normal opacity-[0.6]">
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
