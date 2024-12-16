import * as React from "react";
import { NavItemProps } from "./types";
import Image from "next/image";
import ArrowDown from "@/assets/icons/header/arrow-down.svg";

const menuItems = ["Github", "Documents", "Grant"];

export const NavItem: React.FC<NavItemProps> = ({ label, icon }) => {
  return (
    <div className="flex gap-1 items-center self-stretch my-auto cursor-pointer relative group">
      <div className="self-stretch my-auto">{label}</div>
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

      {/* 드롭다운 메뉴 */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:inline-flex mt-[35.5px] p-[18px] flex-col items-start rounded-[15px] border border-[#DEDEDE] bg-white w-[146px] gap-[12px]">
        {menuItems?.map((item, index) => (
          <div
            key={index}
            className="overflow-hidden text-ellipsis text-[#1C1C1C] font-['Proxima_Nova'] text-[14px] font-normal leading-normal
            hover:text-[#0078FF] cursor-pointer transition-colors duration-200"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
