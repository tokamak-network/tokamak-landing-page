import { useState, useMemo } from "react";
import { FilterType, MediumPost } from "../insight/types";
import { LINKS } from "@/app/constants/links";
import { InsightCard, InsightMainCard } from "./InsightCard";

const styles = {
  button:
    "h-[33px] px-[30px] border border-[#1C1C1C] text-[14px] rounded-[16.5px]",
};

export default function InsightGrid({ posts }: { posts: MediumPost[] }) {
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
    <div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.map((post, index) => {
          if (index === 0)
            return <InsightMainCard key={post.title} post={post} />;
          return <InsightCard key={post.title} post={post} />;
        })}
      </div>
    </div>
  );
}
