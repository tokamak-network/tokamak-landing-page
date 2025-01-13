export interface NavItemProps {
  label: string;
  icon?: string;
  href?: string;
}

export type NavItemType = {
  name: string;
  link: string;
  isExternal?: boolean;
};
