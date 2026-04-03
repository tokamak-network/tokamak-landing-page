import { NextResponse } from "next/server";
import { fetchGovernanceStakingData } from "./index";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchGovernanceStakingData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API Route] Error fetching governance-staking data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch governance-staking data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
