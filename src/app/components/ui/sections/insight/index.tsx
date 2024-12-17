import NewsSection from "./news";
import PriceSection from "./price";

export default function Insights() {
  return (
    <div className="w-full flex flex-col items-center pt-[90px] pb-[120px] bg-white">
      <div className="w-full max-w-[1200px] flex flex-col gap-y-[90px]">
        <NewsSection />
        <PriceSection />
      </div>
    </div>
  );
}
