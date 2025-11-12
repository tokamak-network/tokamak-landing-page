import Price from "@/app/components/ui/sections/price";

// Render dynamically to avoid API calls during build
export const dynamic = "force-dynamic";

export default function PricePage() {
  return <Price />;
}
