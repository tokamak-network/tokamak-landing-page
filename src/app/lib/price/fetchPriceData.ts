"use server";

import { fetchPriceDatas } from "@/app/api/price";
import { revalidatePath } from "next/cache";

export async function refreshPriceData() {
  const data = await fetchPriceDatas();
  revalidatePath("/price"); // 캐시 무효화
  return data;
}
