"use client";

import { useEffect, useState } from "react";
import ExploringInsight from "@/app/components/ui/sections/insight-page";
import { MediumPost } from "@/app/components/ui/sections/insight/types";

export default function InsightPage() {
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
      <div className="w-full h-full text-[#1C1C1C]">
        <div className="relative w-full h-[134px] bg-[#1c1c1c]">
          <div
            style={{
              clipPath:
                "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px), 0 40px)",
              backgroundColor: "white",
            }}
            className="absolute inset-0 bg-white"
          ></div>
        </div>
        <div className="flex justify-center items-center h-64 bg-white">
          <div className="text-lg text-gray-600">Loading posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full text-[#1C1C1C]">
        <div className="relative w-full h-[134px] bg-[#1c1c1c]">
          <div
            style={{
              clipPath:
                "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px), 0 40px)",
              backgroundColor: "white",
            }}
            className="absolute inset-0 bg-white"
          ></div>
        </div>
        <div className="flex justify-center items-center h-64 bg-white">
          <div className="text-lg text-red-600">
            Error loading posts: {error}
          </div>
        </div>
      </div>
    );
  }

  return <ExploringInsight posts={posts} />;
}
