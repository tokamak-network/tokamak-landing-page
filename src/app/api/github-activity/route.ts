import { NextResponse } from "next/server";
import { fetchGitHubActivity } from "@/app/lib/github";

export const runtime = "nodejs";
export const revalidate = 180; // 3-minute ISR

export async function GET() {
  try {
    const commits = await fetchGitHubActivity();
    return NextResponse.json(commits);
  } catch (error) {
    console.error("[github-activity] API error:", error);
    return NextResponse.json([]);
  }
}
