import InsightBackground from "./Background";
import NewsSection from "./news";
// import PriceSection from "./price";
import { fetchMediumPosts } from "@/app/api/medium";

export default async function Insights() {
  const posts = await fetchMediumPosts();

  return (
    <InsightBackground>
      <div
        className="w-full flex flex-col items-center pt-[90px] pb-[120px]
      [@media(max-width:800px)]:pb-[90px] [@media(max-width:640px)]:pb-[45px] bg-white px-[25px] [@media(max-width:1000px)]:px-[15px]"
        style={{
          clipPath:
            "polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px), 0 40px)",
          transform: "translateY(1px)",
        }}
      >
        <div className="w-full max-w-[1200px] flex flex-col gap-y-[90px] [@media(max-width:830px)]:gap-y-[60px]">
          <NewsSection posts={posts} />
          {/* <PriceSection /> */}
        </div>
      </div>
    </InsightBackground>
  );
}
