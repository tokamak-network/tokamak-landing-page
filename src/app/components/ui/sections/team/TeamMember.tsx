import * as React from "react";
import { TeamMemberProps, SocialIconsProps } from "./types";
import Image from "next/image";
import GithubIcon from "@/assets/icons/about/github.svg";
import LinkedInIcon from "@/assets/icons/about/linked-in.svg";

const SocialIcons: React.FC<SocialIconsProps> = ({
  linkedInUrl,
  githubUrl,
}) => (
  <div className="flex gap-2 items-center self-stretch my-auto">
    {githubUrl && (
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-4 h-4"
      >
        <Image
          src={GithubIcon}
          alt="Github Profile"
          style={{ cursor: "pointer" }}
        />
      </a>
    )}
    {linkedInUrl && (
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-4 h-4"
      >
        <Image
          src={LinkedInIcon}
          alt="LinkedIn Profile"
          style={{ cursor: "pointer" }}
        />
      </a>
    )}
  </div>
);

export default function TeamMember({
  name,
  role,
  imageUrl,
  isCEO,
}: TeamMemberProps) {
  return (
    <div className="flex flex-col grow shrink justify-center w-[155px] h-[221px] md:w-[180px] md:h-[257px]">
      <Image loading="lazy" src={imageUrl} alt={`${name} - ${role}`} />
      <div className="flex flex-col mt-2.5 w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex-1 shrink self-stretch my-auto text-[16px] font-[600] basis-0 text-[#1C1C1C] ">
            {name}
          </div>
          {isCEO && (
            <SocialIcons
              githubUrl="https://github.com/ggs134"
              linkedInUrl="https://www.linkedin.com/in/philosopher134/"
            />
          )}
        </div>
        <div className="text-[13px] font-[500] leading-none  text-[#252525]">
          {role}
        </div>
      </div>
    </div>
  );
}
