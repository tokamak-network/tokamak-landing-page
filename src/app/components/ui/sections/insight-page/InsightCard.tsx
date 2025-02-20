"use client";

import { MediumPost } from "../insight/types";
import Image from "next/image";
import DefaultThumbnail from "@/assets/images/insight/default-thumnail.svg";
import { useMemo } from "react";
import { NewsDate } from "../insight/news/NewDate";
import { formatDistanceToNow } from "date-fns";
import { useIsMobile } from "@/app/hooks/layout/useIsMobile";

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true }); // "4 days ago" 형식으로 반환
};

export function InsightMainCard({
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
  }, [category, post.categories]);

  const relativeTime = formatRelativeTime(post.pubDate);
  const { isMobile: isTablet } = useIsMobile(1279);
  const { isMobile } = useIsMobile(793);

  if (isMobile) return null;
  if (isTablet) {
    return (
      <div className="w-full flex justify-center">
        <div className="flex flex-col text-tokamak-black  max-w-[570px]">
          <div className="rounded-[14px]">
            <Image
              src={post.thumbnail || DefaultThumbnail}
              alt={post.title}
              width={570}
              height={320}
              className="object-cover rounded-[14px]"
            />
          </div>
          <div className="flex justify-between items-center text-sm mb-2 w-full max-w-[570px]">
            <span className="text-[13px] font-bold">{categoryName}</span>
            <NewsDate dateString={post.pubDate} />
          </div>
          <div className="w-full">
            <span className="text-[18px] font-bold line-clamp-1 group-hover:text-tokamak-blue transition-colors">
              {post.title}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex gap-x-[60px] text-tokamak-black cursor-pointer group"
      onClick={() => window.open(post.link)}
    >
      <Image
        src={post.thumbnail || DefaultThumbnail}
        alt={post.title}
        width={600}
        height={337}
        className="object-cover rounded-[14px]"
      />
      <div
        className="flex flex-col pt-[30px]
      group-hover:text-tokamak-blue transition-colors
      "
      >
        <h1 className="text-[30px] font-bold  h->[37px] max-w-[530px]">
          {post.title}
        </h1>
        <div className="flex gap-x-[15px]">
          <span className="text-[13px] font-bold">{categoryName}</span>
          <span className="text-[13px]">{relativeTime}</span>
        </div>
      </div>
    </div>
  );
}

// export function InsightCard({
//   post,
//   category,
// }: {
//   post: MediumPost;
//   category: string;
// }) {
//   const categoryName = useMemo(() => {
//     if (category !== "All") return category;
//     const validCategories = ["news", "tokamak-network", "research"];
//     const displayCategory =
//       post.categories.find((category) =>
//         validCategories.includes(category.toLowerCase())
//       ) || post.categories[0];
//     if (displayCategory === "tokamak-network") return "Tokamak Network";
//     if (displayCategory === "research") return "Research";
//     if (displayCategory === "news") return "News";
//   }, [category, post.categories]);

//   return <div className="flex flex-col gap-y-[60px] text-tokamak-black"></div>;
// }
