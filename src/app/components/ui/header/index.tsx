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
    icon: true,
    className: "text-blue-600",
  },
  {
    label: "Features",
    icon: true,
  },
  {
    label: "About",
    icon: true,
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
