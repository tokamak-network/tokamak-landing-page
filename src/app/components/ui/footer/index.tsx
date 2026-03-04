"use client";

import Image from "next/image";
import TokamakLogo from "@/assets/images/Tokamak_Symbol.svg";
import TokamakLogoText from "@/assets/images/Tokamak_LogoText.svg";
import { LINKS } from "@/app/constants/links";
import Link from "next/link";
import { useFocus } from "@/context/FocusContext";
import InlineNewsletter from "./InlineNewsletter";

export default function Footer() {
  const { isFocused } = useFocus();
  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: isFocused ? "#0078ff" : "",
      }}
    >
      <footer
        className="w-full py-[60px] bg-white flex justify-center px-[25px] [@media(max-width:1000px)]:px-[15px]"
        style={{
          clipPath:
            "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 100% 100%, 0 100%, 0 100%, 0 40px)",
        }}
      >
        <div className="flex flex-col w-full max-w-[1220px] gap-y-[40px]">
          {/* Top: Logo + Nav + Newsletter */}
          <div className="flex justify-between items-start w-full [@media(max-width:1000px)]:flex-col-reverse gap-y-[30px]">
            {/* Logo Section */}
            <div className="flex [@media(min-width:1001px)]:flex-col justify-between [@media(max-width:1000px)]:items-center w-full h-full [@media(max-width:800px)]:justify-center [@media(min-width:1001px)]:max-w-[200px]">
              <figure className="flex items-center gap-2 [@media(max-width:800px)]:hidden">
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
            </div>

            {/* Navigation Links */}
            <div className="flex text-right [@media(max-width:800px)]:hidden">
              {/* Developer Column */}
              <div className="w-[180px] [@media(max-width:1000px)]:w-[175px]">
                <h3 className="font-[600] mb-4 text-tokamak-black">Developer</h3>
                <ul className="space-y-2 text-sm text-gray-600 font-[400]">
                  <li>
                    <a
                      href={LINKS.DOCS}
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Documents
                    </a>
                  </li>
                  <li>
                    <a
                      href={LINKS.GITHUB}
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Github
                    </a>
                  </li>
                  <li>
                    <a
                      href={LINKS.GRANT}
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Grant
                    </a>
                  </li>
                </ul>
              </div>

              {/* Features Column */}
              <div className="w-[180px] [@media(max-width:1000px)]:w-[175px]">
                <h3 className="font-[600] mb-4 text-tokamak-black">Features</h3>
                <ul className="space-y-2 text-sm text-gray-600 font-[400]">
                  <li>
                    <a
                      href={LINKS.ROLLUP_HUB}
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Rollup Hub
                    </a>
                  </li>
                  <li>
                    <a
                      href={LINKS.STAKING}
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Staking
                    </a>
                  </li>
                  <li>
                    <a
                      href={LINKS.DAO}
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      DAO
                    </a>
                  </li>
                </ul>
              </div>

              {/* About Column */}
              <div className="w-[180px] [@media(max-width:1000px)]:w-[175px]">
                <h3 className="font-[600] mb-4 text-tokamak-black">About</h3>
                <ul className="space-y-2 text-sm text-gray-600 font-[400]">
                  <li>
                    <Link
                      href="/about/price"
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                    >
                      Price Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about/partners"
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                    >
                      Partners
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about/insight"
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                    >
                      Insight
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about/reports"
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                    >
                      Reports
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Social Column */}
              <div className="w-[180px] [@media(max-width:1000px)]:w-[175px]">
                <h3 className="font-[600] mb-4 text-tokamak-black">Social</h3>
                <ul className="space-y-2 text-sm text-gray-600 font-[400]">
                  <li>
                    <a
                      href={LINKS.MEDIUM}
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Medium
                    </a>
                  </li>
                  <li>
                    <a
                      href={LINKS.X}
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      X (Twitter)
                    </a>
                  </li>
                  <li>
                    <a
                      href={LINKS.DISCORD}
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Discord
                    </a>
                  </li>
                  <li>
                    <a
                      href={LINKS.TELEGRAM}
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Telegram (EN)
                    </a>
                  </li>
                  <li>
                    <a
                      href={LINKS.LINKEDIN}
                      className="hover:text-tokamak-blue hover:opacity-100 opacity-[0.6] transition-colors text-[#252525]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Inline Newsletter */}
          <div className="border-t border-[#E5E5E5] pt-[30px] flex justify-between items-end [@media(max-width:800px)]:flex-col [@media(max-width:800px)]:items-center gap-y-[20px]">
            <InlineNewsletter />
            {/* Copyright */}
            <div className="text-[11px] text-[#1c1c1c] font-normal opacity-[0.6]">
              &copy; 2025 Tokamak Network{" "}
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
