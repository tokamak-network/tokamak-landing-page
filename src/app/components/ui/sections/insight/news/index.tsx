"use client";

import { NewsCard } from "./NewsCard";
import { FilterType, Post } from "../types";
import { useMemo, useState } from "react";

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
        const categories = post.categories.filter(
          (cat) =>
            cat !== "tokamak-network" ||
            !post.categories.some(
              (otherCat) =>
                otherCat !== "tokamak-network" &&
                otherCat.toLowerCase() === activeFilter.toLowerCase()
            )
        );
        return categories.some(
          (category) => category.toLowerCase() === activeFilter.toLowerCase()
        );
      })
      .slice(0, 3);
  }, [posts, activeFilter]);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="text-center mb-[36px]">
        <h1 className="text-[30px] font-bold">
          Exploring <span className="text-black">INSIGHTS</span>
        </h1>
        <p className="text-[15px] text-gray-600 mt-[9px]">
          Follow the news, research and updates from Tokamak Network.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 justify-center mb-[60px]text-[#1C1C1C] mb-[60px]">
        {["All", "News", "Tokamak Network", "Research"].map((filter) => (
          <button
            key={filter}
            className={`${styles.button} ${
              activeFilter === filter ? "bg-[#1C1C1C] text-white" : ""
            }`}
            value={filter}
            onClick={() => setActiveFilter(filter as FilterType)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="h-[280px] [@media(max-width:830px)]:h-[570px] overflow-hidden">
        <div
          className="flex flex-wrap w-full[@media(min-width:800px)_and_(max-width:1279px)]:grid [@media(min-width:800px)_and_(max-width:1279px)]:grid-cols-2 [@media(min-width:1280px)]:grid [@media(min-width:1280px)]:grid-cols-3 gap-[60px] [@media(max-width:830px)]:gap-[30px]
          [@media(max-width:1200px)]:justify-between
          [@media(max-width:830px)]:justify-center
        "
        >
          {filteredPosts?.map((post) => (
            <NewsCard key={post.guid} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
