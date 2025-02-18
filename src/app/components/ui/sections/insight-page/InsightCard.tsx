import { MediumPost } from "../insight/types";
import Image from "next/image";
import DefaultThumbnail from "@/assets/images/insight/default-thumnail.svg";

export function InsightMainCard({ post }: { post: MediumPost }) {
  return (
    <div className="flex flex-col gap-y-[60px] text-tokamak-black">
      <Image
        src={post.thumbnail || DefaultThumbnail}
        alt={post.title}
        width={600}
        height={337}
        className="object-cover"
      />
      <div>
        <h1 className="text-[30px] font-bold  h-[37px]">{post.title}</h1>
        <span className="text-[13px]">{"news"}</span>
      </div>
    </div>
  );
}

export function InsightCard({ post }: { post: MediumPost }) {
  return <div className="flex flex-col gap-y-[60px] text-tokamak-black"></div>;
}
