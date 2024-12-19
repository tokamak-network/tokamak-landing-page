import Image from "next/image";
import { NewsCardProps } from "../types";
import Link from "next/link";

export function NewsCard({ post }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stripHtmlAndTruncate = (html: string, maxLength = 200) => {
    if (typeof window !== "undefined") {
      const tmp = document.createElement("div");
      tmp.innerHTML = html;
      const text = tmp.textContent || tmp.innerText;
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    }
    return html.substring(0, maxLength) + "...";
  };

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
        <span className="text-gray-500">{formatDate(post.pubDate)}</span>
      </div>
      <h3 className="font-bold mb-2 truncate max-w-[360px] max-h-[22px]">
        {stripHtmlAndTruncate(post.title, 100)}
      </h3>
    </div>
  );
}
