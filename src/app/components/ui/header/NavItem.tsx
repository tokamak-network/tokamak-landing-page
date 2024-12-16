import * as React from "react";
import { NavItemProps } from "./types";

export const NavItem: React.FC<NavItemProps> = ({ label, icon }) => {
  return (
    <div className="flex gap-1 items-center self-stretch my-auto">
      <div className="self-stretch my-auto">{label}</div>
      {icon && (
        <img
          loading="lazy"
          src={icon}
          alt=""
          className="object-contain shrink-0 self-stretch my-auto w-3.5 aspect-square"
        />
      )}
    </div>
  );
};
