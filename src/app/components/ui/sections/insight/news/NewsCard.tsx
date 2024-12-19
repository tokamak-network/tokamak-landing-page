import Image from "next/image";
import { NewsCardProps } from "../types";
import { NewsDate } from "./NewDate";

export function NewsCard({ post }: NewsCardProps) {
  return (
    <div className="flex flex-col">
      <div className="relative h-[200px] rounded-lg overflow-hidden mb-4">
        <Image
          src={post.thumbnail || "/images/default-news.jpg"}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex justify-between items-center text-sm mb-2">
        <span>{post.categories[0]}</span>
        <NewsDate dateString={post.pubDate} />
      </div>
      <h3 className="font-bold mb-2 line-clamp-1">{post.title}</h3>
    </div>
  );
}
