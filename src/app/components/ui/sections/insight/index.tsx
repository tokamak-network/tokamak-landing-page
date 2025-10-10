"use client";

import { useEffect, useState } from "react";
import InsightBackground from "./Background";
import NewsSection from "./news";
import { MediumPost } from "./types";

export default function Insights() {
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/medium");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <InsightBackground>
        <div
          className="w-full flex flex-col items-center pt-[90px] pb-[120px] [@media(max-width:800px)]:pb-[90px] [@media(max-width:640px)]:pb-[45px] bg-white px-[25px] [@media(max-width:1000px)]:px-[15px]"
          style={{
            clipPath:
              "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px), 0 40px)",
            transform: "translateY(1px)",
          }}
        >
          <div className="w-full max-w-[1200px] flex flex-col gap-y-[90px] [@media(max-width:830px)]:gap-y-[60px]">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Loading posts...</div>
            </div>
          </div>
        </div>
      </InsightBackground>
    );
  }

  if (error) {
    return (
      <InsightBackground>
        <div
          className="w-full flex flex-col items-center pt-[90px] pb-[120px] [@media(max-width:800px)]:pb-[90px] [@media(max-width:640px)]:pb-[45px] bg-white px-[25px] [@media(max-width:1000px)]:px-[15px]"
          style={{
            clipPath:
              "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px), 0 40px)",
            transform: "translateY(1px)",
          }}
        >
          <div className="w-full max-w-[1200px] flex flex-col gap-y-[90px] [@media(max-width:830px)]:gap-y-[60px]">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-red-600">
                Error loading posts: {error}
              </div>
            </div>
          </div>
        </div>
      </InsightBackground>
    );
  }

  return (
    <InsightBackground>
      <div
        className="w-full flex flex-col items-center pt-[90px] pb-[120px] [@media(max-width:800px)]:pb-[90px] [@media(max-width:640px)]:pb-[45px] bg-white px-[25px] [@media(max-width:1000px)]:px-[15px]"
        style={{
          clipPath:
            "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px), 0 40px)",
          transform: "translateY(1px)",
        }}
      >
        <div className="w-full max-w-[1200px] flex flex-col gap-y-[90px] [@media(max-width:830px)]:gap-y-[60px]">
          <NewsSection posts={posts} />
        </div>
      </div>
    </InsightBackground>
  );
}
