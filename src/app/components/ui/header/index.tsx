"use client";
import * as React from "react";
import { NavItem } from "./NavItem";
import TokamakLogo from "@/assets/images/Tokamak_Symbol.svg";
import TokamakLogoText from "@/assets/images/Tokamak_LogoText.svg";
import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/app/hooks/layout/useIsMobile";
import Mobile from "./Mobile";

const navItems = [
  {
    label: "Developer",
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f7ce1d4f0147077e9d34d8dd2ab80245979de09b506cc0b8791cf21c92ca5c01?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
    className: "text-blue-600",
  },
  {
    label: "Features",
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/2259f3d2652229c6d4f87a57ad9bb920fe1305578e1c025a330a418af354e054?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
  },
  {
    label: "About",
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/2259f3d2652229c6d4f87a57ad9bb920fe1305578e1c025a330a418af354e054?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf",
  },
];

export default function NavigationBar() {
  const { isMobile } = useIsMobile(640);

  if (isMobile) return <Mobile />;

  return (
    <div className="fixed top-[24px] w-full flex justify-center px-5 md:px-12 z-50">
      <div className="max-w-[1360px] w-full h-[72px] flex flex-col justify-center px-4 md:pr-11 md:pl-8 text-base font-medium text-center text-black whitespace-nowrap rounded-2xl border border-solid bg-white bg-opacity-90 border-neutral-200">
        <div className="flex justify-between items-center w-full">
          {/* 로고 */}
          <Link href="/">
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
          </Link>

          {/* 네비게이션 메뉴 (데스크톱) */}
          <div className="hidden sm:flex gap-x-[60px] items-center">
            {navItems.map((item, index) => (
              <div key={index} className={item.className}>
                <NavItem label={item.label} icon={item.icon} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
