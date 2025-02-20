import Image from "next/image";
import { MediumPost } from "../types";
import { NewsDate } from "./NewDate";
import DefaultThumbnail from "@/assets/images/insight/default-thumnail.svg";
import { useMemo } from "react";

export function NewsCard({
  post,
  category,
}: {
  post: MediumPost;
  category: string;
}) {
  const categoryName = useMemo(() => {
    if (category !== "All") return category;
    const validCategories = ["news", "tokamak-network", "research"];
    const displayCategory =
      post.categories.find((category) =>
        validCategories.includes(category.toLowerCase())
      ) || post.categories[0];
    if (displayCategory === "tokamak-network") return "Tokamak Network";
    if (displayCategory === "research") return "Research";
    if (displayCategory === "news") return "News";
    return "Tokamak Network";
  }, [category, post.categories]);

  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col w-full max-w-[360px] max-400:max-w-[330px] text-[#1C1C1C] cursor-pointer group"
    >
      <div
        className="relative w-full h-[198px] max-400:h-[181px]  overflow-hidden mb-4 rounded-[14px] border border-[#DEDEDE]
      "
      >
        <Image
          src={post.thumbnail || DefaultThumbnail}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-[13px] font-bold">{categoryName}</span>
        <NewsDate dateString={post.pubDate} />
      </div>
      <span className="text-[18px] font-bold line-clamp-1 group-hover:text-tokamak-blue transition-colors">
        {post.title}
      </span>
    </a>
  );
}
