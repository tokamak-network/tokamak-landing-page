import { LINKS } from "@/app/constants/links";

export interface NavLink {
  readonly label: string;
  readonly href: string;
  readonly isInternal?: boolean;
}

export interface NavColumn {
  readonly title: string;
  readonly links: readonly NavLink[];
}

export const NAV_COLUMNS: readonly NavColumn[] = [
  {
    title: "Developer",
    links: [
      { label: "Documents", href: LINKS.DOCS },
      { label: "Github", href: LINKS.GITHUB },
      { label: "Grant", href: LINKS.GRANT },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Rollup Hub", href: LINKS.ROLLUP_HUB },
      { label: "Staking", href: LINKS.STAKING },
      { label: "DAO", href: LINKS.DAO },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Price Dashboard", href: "/about/price", isInternal: true },
      { label: "Partners", href: "/about/partners", isInternal: true },
      { label: "Insight", href: "/about/insight", isInternal: true },
      { label: "Reports", href: "/about/reports", isInternal: true },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Medium", href: LINKS.MEDIUM },
      { label: "X (Twitter)", href: LINKS.X },
      { label: "Discord", href: LINKS.DISCORD },
      { label: "Telegram (EN)", href: LINKS.TELEGRAM },
      { label: "LinkedIn", href: LINKS.LINKEDIN },
    ],
  },
];
