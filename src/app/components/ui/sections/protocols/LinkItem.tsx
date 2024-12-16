import * as React from "react";
import { LinkProps } from "./types";

export const LinkItem: React.FC<LinkProps> = ({ icon, label, alt }) => {
  return (
    <div className="flex gap-1.5 items-center self-stretch my-auto">
      <div className="flex flex-col self-stretch my-auto w-4 min-h-[16px]">
        <img
          loading="lazy"
          src={icon}
          alt={alt}
          className="object-contain w-4 aspect-square"
        />
      </div>
      <div className="self-stretch my-auto text-sm font-light text-white">
        {label}
      </div>
    </div>
  );
};
