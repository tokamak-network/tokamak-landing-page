export interface PriceCardProps {
  value: string;
  label: string;
}

export interface Post {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: Record<string, unknown>;
  categories: string[];
}

export interface NewsCardProps {
  post: Post;
}

export type FilterType = "All" | "News" | "Tokamak Network" | "Research";
