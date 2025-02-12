export interface PriceCardProps {
  value: string;
  label: string;
}

export interface MediumPost {
  title: string;
  pubDate: string;
  link: string;
  author: string;
  thumbnail: string | undefined;
  content: string | undefined;
  categories: string[];
}

export interface NewsCardProps {
  post: MediumPost;
}

export type FilterType = "All" | "News" | "Tokamak Network" | "Research";
