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
    <div className="flex flex-col grow shrink w-72 min-w-[240px]">
      <Image
        loading="lazy"
        src={icon}
        alt={alt}
        className="object-contain w-8 aspect-square"
      />
      <div className="flex flex-col mt-5 w-full">
        <div className="text-lg text-white">{title}</div>
        <div className="mt-1.5 text-base font-light text-white">
          {description}
        </div>
        <div className="flex gap-4 items-center mt-1.5 w-full">
          {links.map((link, index) => (
            <LinkItem key={index} {...link} />
          ))}
        </div>
      </div>
    </div>
  );
};
