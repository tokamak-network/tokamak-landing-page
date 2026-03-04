import type { ActivityItem } from "./types";
import { LINKS } from "@/app/constants/links";

export const ACTIVITY_ITEMS: readonly ActivityItem[] = [
  {
    id: "1",
    type: "commit",
    title: "feat: implement cross-chain swap v2 protocol",
    metadata: "tokamak-network/crossTrade",
    timeAgo: "2 hours ago",
    href: `${LINKS.GITHUB}/crossTrade`,
  },
  {
    id: "2",
    type: "blog",
    title: "Tokamak Network Monthly Update \u2014 February 2026",
    metadata: "Medium",
    timeAgo: "3 days ago",
    href: LINKS.MEDIUM,
  },
  {
    id: "3",
    type: "report",
    title: "Biweekly Development Report #2",
    metadata: "42 repos \u00b7 4.9M code changes",
    timeAgo: "5 days ago",
    href: "/about/reports/latest",
  },
  {
    id: "4",
    type: "commit",
    title: "fix: resolve L2 watchtower staking edge case",
    metadata: "tokamak-network/TokamakStaking",
    timeAgo: "1 week ago",
    href: `${LINKS.GITHUB}/TokamakStaking`,
  },
  {
    id: "5",
    type: "blog",
    title: "Understanding On-Demand L2 Architecture",
    metadata: "Medium",
    timeAgo: "2 weeks ago",
    href: LINKS.MEDIUM,
  },
] as const;
