"use client";

import { NewsCard } from "./NewsCard";
import { FilterType, Post } from "../types";
import { useMemo, useState } from "react";
import { LINKS } from "@/app/constants/links";

const styles = {
  button:
    "h-[33px] px-[30px] border border-[#1C1C1C] text-[14px] rounded-[16.5px]",
};

export default function NewsSection({ posts }: { posts: Post[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") return posts?.slice(0, 3);
    return posts
      ?.filter((post) => {
        const categories = post.categories;
        const activeFilterLowerCase =
          activeFilter === "Tokamak Network"
            ? "tokamak-network"
            : activeFilter.toLowerCase();
        return categories.some(
          (category: string) => category.toLowerCase() === activeFilterLowerCase
        );
      })
      .slice(0, 3);
  }, [posts, activeFilter]);

  return (
    <div className="flex flex-col text-tokamak-black">
      {/* Header */}
      <div className="text-center mb-[36px]">
        <h1 className="text-[30px] ">
          Exploring <span className="text-black font-bold">INSIGHTS</span>
        </h1>
        <p className="text-[15px] text-gray-600 mt-[9px]">
          Follow the news, research and updates from Tokamak Network.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-[12px] justify-center mb-[60px]text-[#1C1C1C] mb-[60px]">
        {["All", "News", "Tokamak Network", "Research", "More"].map(
          (filter) => {
            if (filter.includes("More")) {
              return (
                <a
                  href={LINKS.MEDIUM}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${
                    styles.button
                  } hover:bg-tokamak-blue hover:border-tokamak-blue  hover:text-white font-bold leading-[31px]  ${
                    filter === "More" ? "[@media(max-width:700px)]:order-5" : ""
                  }`}
                  key={"more"}
                >
                  More +
                </a>
              );
            }
            return (
              <button
                key={filter}
                className={`${styles.button} ${
                  activeFilter === filter ? "bg-[#1C1C1C] text-white" : ""
                } hover:bg-tokamak-black hover:border hover:border-tokamak-black hover:text-white font-bold
                   ${
                     filter === "All" ? "[@media(max-width:700px)]:order-1" : ""
                   }
              ${filter === "News" ? "[@media(max-width:700px)]:order-2" : ""}
              ${
                filter === "Research" ? "[@media(max-width:700px)]:order-3" : ""
              }
              ${
                filter === "Tokamak Network"
                  ? "[@media(max-width:700px)]:order-4"
                  : ""
              }
             
                `}
                value={filter}
                onClick={() => {
                  return setActiveFilter(filter as FilterType);
                }}
              >
                {filter}
              </button>
            );
          }
        )}
      </div>

      {/* News Grid */}
      <div className="h-[280px] [@media(max-width:797px)]:h-[570px] overflow-hidden">
        <div
          className="flex flex-wrap w-full[@media(min-width:800px)_and_(max-width:1279px)]:grid [@media(min-width:800px)_and_(max-width:1279px)]:grid-cols-2 [@media(min-width:1280px)]:grid [@media(min-width:1280px)]:grid-cols-3 gap-[60px] [@media(max-width:830px)]:gap-[30px]
          [@media(max-width:1280px)]:justify-between
          [@media(max-width:830px)]:justify-center"
        >
          {filteredPosts?.map((post) => (
            <NewsCard key={post.title} post={post} category={activeFilter} />
          ))}
        </div>
      </div>
    </div>
  );
}
