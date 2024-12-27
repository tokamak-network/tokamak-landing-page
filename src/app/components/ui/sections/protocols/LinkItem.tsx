import * as React from "react";
import { LinkProps } from "./types";
import Image from "next/image";
import websiteIcon from "@/assets/icons/common/website.svg";
import githubIcon from "@/assets/icons/common/github-white.svg";
import notionIcon from "@/assets/icons/common/notion.svg";

export const LinkItem: React.FC<LinkProps> = ({ icon, alt, link }) => {
  const IconComponent =
    icon === "Website"
      ? websiteIcon
      : icon === "Github"
      ? githubIcon
      : notionIcon;
  const label =
    icon === "Website" ? "Website" : icon === "Github" ? "Github" : "Notion";

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-1.5 items-center self-stretch my-auto cursor-pointer opacity-[0.6] hover:opacity-100"
    >
      <div className="flex flex-col self-stretch my-auto w-4 min-h-[16px]">
        <Image
          loading="lazy"
          src={IconComponent}
          alt={alt}
          className="object-contain w-4 aspect-square"
        />
      </div>
      <div className="self-stretch my-auto text-[13px] font-light text-white">
        {label}
      </div>
    </a>
  );
};
