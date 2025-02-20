import { useState, useMemo } from "react";
import { FilterType, MediumPost } from "../insight/types";
import { InsightMainCard } from "./InsightCard";
import { NewsCard } from "../insight/news/NewsCard";
import { useIsMobile } from "@/app/hooks/layout/useIsMobile";
import { LINKS } from "@/app/constants/links";

const styles = {
  button:
    "h-[33px] px-[30px] border border-[#1C1C1C] text-[14px] rounded-[16.5px]",
};

export default function InsightGrid({ posts }: { posts: MediumPost[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const { isMobile } = useIsMobile(799);

  const filteredPosts = useMemo(() => {
    if (activeFilter === "All") return posts?.slice(0, 10);
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
      .slice(0, 10);
  }, [posts, activeFilter]);

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-[12px] justify-center mb-[60px]text-[#1C1C1C] mb-[60px] [@media(max-width:799px)]:mb-[27px]">
        {["All", "News", "Tokamak Network", "Research"].map((filter) => {
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
        })}
      </div>
      <div className="flex flex-col gap-y-[50px] ">
        {filteredPosts.map((post, index) => {
          if (index === 0 && !isMobile)
            return (
              <InsightMainCard
                key={post.title}
                post={post}
                category={activeFilter}
              />
            );
        })}
        <div
          className="grid w-full[@media(min-width:800px)_and_(max-width:1279px)]:grid [@media(min-width:800px)_and_(max-width:1279px)]:grid-cols-2 [@media(min-width:1280px)]:grid [@media(min-width:1280px)]:grid-cols-3 gap-[57px]
          [@media(max-width:793px)]:gap-y-[43px]
          [@media(max-width:1280px)]:justify-center
          [@media(max-width:830px)]:justify-center 
          "
        >
          {filteredPosts?.map((post, index) => {
            if (isMobile)
              return (
                <NewsCard
                  key={post.title}
                  post={post}
                  category={activeFilter}
                />
              );
            if (index !== 0)
              return (
                <NewsCard
                  key={post.title}
                  post={post}
                  category={activeFilter}
                />
              );
          })}
        </div>
      </div>
      <div className="flex justify-center mt-[60px] [@media(max-width:799px)]:mt-[46px]">
        <a
          href={LINKS.MEDIUM}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} w-[150px] h-[40px] hover:bg-tokamak-blue  hover:border-tokamak-blue  hover:text-white font-bold leading-[36px] text-center rounded-[20px]`}
          key={"more"}
        >
          More +
        </a>
      </div>
    </div>
  );
}
