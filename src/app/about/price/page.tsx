import Price from "@/app/components/ui/sections/price";

// Revalidate this page every 60 seconds (ISR - Incremental Static Regeneration)
export const revalidate = 60;

export default function PricePage() {
  return <Price />;
}
