import * as React from "react";
import { LinkProps } from "./types";
import Image from "next/image";

export const LinkItem: React.FC<LinkProps> = ({ icon, label, alt }) => {
  return (
    <div className="flex gap-1.5 items-center self-stretch my-auto cursor-pointer">
      <div className="flex flex-col self-stretch my-auto w-4 min-h-[16px]">
        <Image
          loading="lazy"
          src={icon}
          alt={alt}
          className="object-contain w-4 aspect-square"
        />
      </div>
      <div className="self-stretch my-auto text-[13px] font-light text-white">
        {label}
      </div>
    </div>
  );
};
