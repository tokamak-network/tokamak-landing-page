import PriceOverview from "@/app/components/ui/sections/price-overview";

// ISR instead of force-dynamic: price fetches use `revalidate`, so the HTML is
// cached and refreshed at most every 2 min (price up to ~120s stale — fine here).
export const revalidate = 120;

export default function PricePage() {
  return <PriceOverview />;
}
