import Parser from "rss-parser";
import * as cheerio from "cheerio";
import axios from "axios";
import { MediumPost } from "@/app/components/ui/sections/insight/types";
import { NextResponse } from "next/server";

// Use Node.js runtime on Vercel (required for axios, cheerio)
export const runtime = "nodejs";
// Disable caching for debugging
export const dynamic = "force-dynamic";
export const revalidate = 0;
// Set maximum execution time (in seconds)
export const maxDuration = 30;

interface CustomFeed {
  title: string;
  description: string;
  link: string;
}

interface CustomItem {
  title: string;
  link: string;
  pubDate: string;
  "content:encoded"?: string; // Medium RSS uses this field
  author: string;
  categories?: string[];
}

function processCategories(categories: string[] | undefined): string[] {
  const validCategories = ["news", "tokamak-network", "research"];

  // Handle undefined or empty categories
  if (!categories || categories.length === 0) {
    return ["tokamak-network"];
  }

  // Check if there's at least one valid category
  const hasValidCategory = categories.some((category) =>
    validCategories.includes(category.toLowerCase())
  );

  // Add tokamak-network if no valid category exists
  if (!hasValidCategory) {
    return [...categories, "tokamak-network"];
  }

  // Return original array if valid category exists
  return categories;
}

class MediumFeedParser {
  private parser: Parser<CustomFeed, CustomItem>;
  private baseUrl: string;
  private username: string;

  constructor() {
    this.parser = new Parser<CustomFeed, CustomItem>({
      customFields: {
        item: [
          ["creator", "author"],
          ["content:encoded", "content:encoded"],
        ],
      },
    });
    this.baseUrl = "https://medium.com/feed/tokamak-network";
    this.username = "@tokamak-network"; // Medium account name
  }

  async getPosts(): Promise<MediumPost[]> {
    try {
      console.log("Fetching Medium RSS feed from:", this.baseUrl);

      // Try direct fetch with comprehensive browser-like headers
      const response = await Promise.race([
        axios.get(this.baseUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
          },
          timeout: 15000,
          validateStatus: (status) => status < 500, // Accept 4xx responses
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("RSS fetch timeout")), 15000)
        ),
      ]);

      console.log(`RSS feed fetch completed with status: ${response.status}`);

      if (response.status !== 200) {
        throw new Error(`Failed to fetch RSS feed: HTTP ${response.status}`);
      }

      // Parse the RSS XML string
      const feed = await this.parser.parseString(response.data);
      console.log(`Successfully parsed ${feed.items.length} posts from RSS`);

      const rssPosts = feed.items.map((item) => {
        // Thumbnail extraction logic with proper validation
        let thumbnail: string | undefined = undefined;
        if (item["content:encoded"]) {
          const $ = cheerio.load(item["content:encoded"]);
          const firstImage = $("img").first();
          const imgSrc = firstImage.attr("src");
          thumbnail = imgSrc && imgSrc.trim() !== "" ? imgSrc : undefined;
        }

        return {
          title: item.title || "",
          link: item.link || "",
          pubDate: item.pubDate || "",
          author: item.author || "",
          thumbnail: thumbnail,
          content: item["content:encoded"],
          categories: processCategories(item.categories),
        };
      });

      console.log(`Returning ${rssPosts.length} total posts`);
      return rssPosts;
    } catch (error) {
      console.error("Error fetching Medium posts:", error);
      console.error(
        "Error details:",
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }
}

// Internal function for fetching Medium posts
async function fetchMediumPosts(): Promise<MediumPost[]> {
  const mediumParser = new MediumFeedParser();
  const result = await mediumParser.getPosts();
  return result;
}

// API Route handler
export async function GET() {
  try {
    console.log("Medium API route called");
    const posts = await fetchMediumPosts();
    console.log(`Returning ${posts.length} posts to client`);

    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error in API route:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error message:", errorMessage);

    // Return error details in development, empty array in production
    return NextResponse.json(
      {
        error: errorMessage,
        posts: [],
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
