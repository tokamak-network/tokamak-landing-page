import { NewsCard } from "./NewsCard";

const styles = {
  button:
    "h-[33px] px-[30px] border border-[#1C1C1C] text-[14px] rounded-[16.5px]",
  // 다른 스타일들도 추가 가능
};

export default function NewsSection() {
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
        <button className="bg-black text-white rounded-[16.5px] px-[30px] h-[33px] text-[14px]">
          All
        </button>
        <button className={styles.button}>News</button>
        <button className={styles.button}>Tokamak Network</button>
        <button className={styles.button}>Research</button>
        <button className={styles.button}>More +</button>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-3 gap-6">
        <NewsCard
          image="/images/biweekly.jpg"
          title="BIWEEKLY REPORT"
          subtitle="2024 #24"
          date="Nov 19 - Dec 2"
          category="Tokamak Network"
          timeAgo="4 days ago"
          description="Shifting our focus to building a developer-c..."
        />
        {/* Add other NewsCard components similarly */}
      </div>
    </div>
  );
}
