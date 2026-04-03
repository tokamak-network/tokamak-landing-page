import { getEcosystemData } from "@/app/lib/ecosystem-data";
import CarouselClient from "./CarouselClient";

export default async function EcosystemCarousel() {
  const { categories } = await getEcosystemData();
  return <CarouselClient categories={categories} />;
}
