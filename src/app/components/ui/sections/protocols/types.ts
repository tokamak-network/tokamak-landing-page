export interface LinkProps {
  icon: string;
  label: string;
  alt: string;
}

export interface ProtocolCardProps {
  icon: string;
  title: string;
  description: string;
  links: LinkProps[];
  alt: string;
}

export interface ProtocolsGridProps {
  grants: ProtocolCardProps[];
}
