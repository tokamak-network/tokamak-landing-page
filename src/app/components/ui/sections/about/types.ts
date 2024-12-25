import { StaticImageData } from "next/image";

export interface TeamMemberProps {
  name: string;
  role: string;
  imageUrl: StaticImageData;
  isCEO?: boolean;
}

export interface SocialIconsProps {
  linkedInUrl?: string;
  githubUrl?: string;
}
