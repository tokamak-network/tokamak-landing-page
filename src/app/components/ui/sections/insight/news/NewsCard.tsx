import Image from "next/image";
import { NewsCardProps } from "../types";

export function NewsCard({
  image,
  title,
  subtitle,
  date,
  category,
  timeAgo,
  description,
}: NewsCardProps) {
  return (
    <div className="flex flex-col">
      <div className="relative h-[200px] rounded-lg overflow-hidden mb-4">
        <Image src={image} alt={title} fill className="object-cover" />
      </div>
      <div className="flex justify-between items-center text-sm mb-2">
        <span>{category}</span>
        <span className="text-gray-500">{timeAgo}</span>
      </div>
      <h3 className="font-bold mb-2">{description}</h3>
    </div>
  );
}
