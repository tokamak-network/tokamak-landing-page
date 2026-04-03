export interface FeedItem {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly type: "blog" | "report";
  readonly href: string;
  readonly thumbnail?: string;
  readonly statsSummary?: string;
  readonly excerpt?: string;
}
