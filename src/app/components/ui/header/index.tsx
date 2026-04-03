"use client";
import * as React from "react";
import { NavItem } from "./NavItem";
import TokamakLogo from "@/assets/images/Tokamak_Symbol.svg";
import TokamakLogoText from "@/assets/images/Tokamak_LogoText.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isAbout = pathname.startsWith("/about");

  if (isMobile) return <Mobile isAbout={isAbout} />;

  return (
    <div className="fixed top-[24px] w-full flex justify-center px-5 md:px-12 z-50">
      <div className={`max-w-[1360px] w-full h-[72px] flex flex-col justify-center px-4 md:pr-11 md:pl-8 text-base font-medium text-center whitespace-nowrap rounded-2xl border border-solid ${
        isAbout
          ? "text-black bg-white bg-opacity-90 border-neutral-200"
          : "text-white bg-black/20 backdrop-blur-md border-white/10"
      }`}>
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
                className={isAbout ? "invert" : ""}
              />
            </figure>
          </Link>

          {/* 네비게이션 메뉴 (데스크톱) */}
          <div className="hidden sm:flex gap-x-[60px] items-center">
            {navItems.map((item, index) => (
              <div key={index} className={item.className}>
                <NavItem label={item.label} icon={item.icon} isAbout={isAbout} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
