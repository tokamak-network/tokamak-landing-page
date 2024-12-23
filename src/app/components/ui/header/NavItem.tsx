import * as React from "react";
import { NavItemProps } from "./types";
import { LINKS } from "@/app/constants/links";
import Link from "next/link";

const developerItems = [
  { name: "Documents", link: LINKS.DOCS },
  { name: "Github", link: LINKS.GITHUB },
  { name: "Grant", link: LINKS.GRANT },
];
const featureItems = [
  { name: "Rollup Hub", link: LINKS.ROLLUP_HUB },
  { name: "Staking", link: LINKS.STAKING },
  { name: "DAO", link: LINKS.DAO },
];

export const NavItem: React.FC<NavItemProps> = ({ label, icon }) => {
  if (label === "About") {
    return (
      <Link href="/about" className="h-full flex items-center">
        <span className="text-[#1C1C1C] font-['Proxima_Nova'] text-base font-medium leading-normal hover:text-[#0078FF] transition-colors duration-200">
          {label}
        </span>
      </Link>
    );
  }

  const items = label === "Developer" ? developerItems : featureItems;

  return (
    // NavItem 컴포넌트를 div로 감싸서 수정
    <div className="group relative h-full flex items-center">
      <div className="flex items-center gap-[6px] cursor-pointer">
        <span className="text-[#1C1C1C] font-['Proxima_Nova'] text-base font-medium leading-normal">
          {label}
        </span>
        {icon && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="transition-transform duration-200 group-hover:rotate-180"
          >
            <path
              d="M2 5.36455L6.11616 9.48071C6.60227 9.96682 7.39773 9.96682 7.88384 9.48071L12 5.36455"
              stroke="currentColor"
              className="text-[#666666] group-hover:text-[#0078FF] transition-colors duration-200"
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* 드롭다운 메뉴 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-full invisible group-hover:visible 
    w-[146px]"
      >
        <div className="relative mt-[35.5px] before:absolute before:w-full before:h-[35.5px] before:top-[-35.5px] before:left-0">
          <div className="p-[18px] flex flex-col items-start rounded-[15px] border border-[#DEDEDE] bg-white gap-[12px]">
            {items?.map((item, index) => (
              <a
                key={index}
                className="overflow-hidden text-ellipsis text-[#1C1C1C] font-['Proxima_Nova'] text-[14px] font-normal leading-normal
            hover:text-[#0078FF] cursor-pointer transition-colors duration-200"
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
