import NewsSection from "./news";
import PriceSection from "./price";
import { fetchMediumPosts } from "@/app/api/medium";

export default async function Insights() {
  const posts = await fetchMediumPosts();
  return (
    <div
      className="w-full flex flex-col items-center pt-[90px] pb-[120px] bg-white"
      style={{
        clipPath:
          "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px), 0 40px)",
      }}
    >
      <div className="w-full max-w-[1200px] flex flex-col gap-y-[90px]">
        <NewsSection posts={posts} />
        <PriceSection />
      </div>
    </div>
  );
}
