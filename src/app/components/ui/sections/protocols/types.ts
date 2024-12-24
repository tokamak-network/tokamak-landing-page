export interface LinkProps {
  icon: "Website" | "Github" | "Notion";
  alt: string;
  link: `https://${string}`;
}

export interface ProtocolCardProps {
  icon: string;
  title: string;
  description: string;
  links?: LinkProps[];
  alt: string;
}

export interface ProtocolsGridProps {
  protocols: ProtocolCardProps[];
}
