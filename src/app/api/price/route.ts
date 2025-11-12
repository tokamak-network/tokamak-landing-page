import { NextResponse } from "next/server";
import { fetchPriceDatas } from "./index";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchPriceDatas();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in price API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch price data" },
      { status: 500 }
    );
  }
}
