import { fetchMediumPosts } from "@/app/api/medium";
import ExploringInsight from "@/app/components/ui/sections/insight-page";

export default async function InsightPage() {
  const posts = await fetchMediumPosts();

  return <ExploringInsight posts={posts} />;
}
