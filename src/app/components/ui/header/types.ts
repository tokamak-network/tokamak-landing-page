import { Dispatch, SetStateAction } from "react";

export interface NavItemProps {
  label: string;
  icon?: string;
  href?: string;
  setIsMobileMenuOpen?: Dispatch<SetStateAction<boolean>>;
}

export type NavItemType = {
  name: string;
  link: string;
  isExternal?: boolean;
  setIsMobileMenuOpen?: Dispatch<SetStateAction<boolean>>;
};
