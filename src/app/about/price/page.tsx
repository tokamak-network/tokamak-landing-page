import Price from "@/app/components/ui/sections/price";

// Use dynamic rendering (server-side on each request)
export const dynamic = 'force-dynamic';

export default function PricePage() {
  return <Price />;
}
