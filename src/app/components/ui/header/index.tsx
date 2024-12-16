import * as React from "react";
import { NavItem } from "./NavItem";

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
  },
];

export const NavigationBar: React.FC = () => {
  return (
    <div className="flex flex-col justify-center pr-11 pl-8 text-base font-medium text-center text-black whitespace-nowrap rounded-2xl border border-solid bg-white bg-opacity-90 border-neutral-200 max-md:px-5">
      <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/134ba1625795551afad46d0a9e08601bb44dd5eff5778b2756b0f2ffca073e1e?placeholderIfAbsent=true&apiKey=06865df1cc614dd09e17f99455bd22cf"
          alt="Company Logo"
          className="object-contain shrink-0 self-stretch my-auto aspect-[8.33] w-[200px]"
        />
        <div className="flex gap-10 items-center self-stretch my-auto min-w-[240px]">
          {navItems.map((item, index) => (
            <div key={index} className={item.className}>
              <NavItem label={item.label} icon={item.icon} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
