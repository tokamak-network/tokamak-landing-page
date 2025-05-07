import * as React from "react";
import { ProtocolCardProps } from "./types";
import { LinkItem } from "./LinkItem";
import Image from "next/image";

export const ProtocolCard: React.FC<ProtocolCardProps> = ({
  icon,
  title,
  description,
  links,
  alt,
}) => {
  return (
    <div className="flex flex-col grow shrink w-[360px] h-[154px] min-w-[240px]">
      <Image
        loading="lazy"
        src={icon}
        alt={alt}
        className="object-contain w-8 aspect-square"
      />
      <div className="flex flex-col felx-1 h-full mt-[18px] w-full">
        <div className="text-lg text-white h-[22px] mb-[6px] font-[400]">
          {title}
        </div>
        <div className="text-[15px] font-[300] text-white opacity-[0.8] mt-[6px]">
          {description}
        </div>
        <div className="flex gap-4 items-center w-full h-[16px] mt-[6px] opacity-[0.8]">
          {links?.map((link, index) => (
            <LinkItem key={index} {...link} />
          ))}
        </div>
      </div>
    </div>
  );
};
