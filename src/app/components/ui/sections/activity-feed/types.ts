export interface ActivityItem {
  readonly id: string;
  readonly type: "commit" | "blog" | "report";
  readonly title: string;
  readonly metadata: string;
  readonly timeAgo: string;
  readonly href: string;
}
