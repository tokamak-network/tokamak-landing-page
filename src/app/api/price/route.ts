import { NextResponse } from "next/server";
import { fetchPriceDatas } from "./index";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("[API Route] Starting to fetch price data...");
    const data = await fetchPriceDatas();
    console.log("[API Route] Price data fetched successfully");
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Route] Error fetching price data:", error);
    console.error("[API Route] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      { 
        error: "Failed to fetch price data",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
