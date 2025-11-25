import Parser from "rss-parser";
import * as cheerio from "cheerio";
import axios from "axios";
import { MediumPost } from "@/app/components/ui/sections/insight/types";
import { NextResponse } from "next/server";

// Vercel에서 Node.js runtime 사용 (axios, cheerio 필요)
export const runtime = "nodejs";
// 20분마다 재검증 (ISR)
export const revalidate = 1200;

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

  private async scrapeMorePosts(): Promise<MediumPost[]> {
    try {
      const response = await axios.get(`https://medium.com/${this.username}`);
      const $ = cheerio.load(response.data);
      const posts: MediumPost[] = [];

      // Find and parse Medium article elements
      $("article").each((_, element) => {
        const article = $(element);
        const title = article.find("h2").first().text().trim();
        const link = article.find("a").first().attr("href");
        const pubDate = article.find("time").attr("datetime") || "";

        if (title && link) {
          posts.push({
            title,
            link: link.startsWith("http") ? link : `https://medium.com${link}`,
            pubDate,
            author: this.username,
            thumbnail: undefined,
            content: undefined,
            categories: [],
          });
        }
      });

      return posts;
    } catch (error) {
      console.error("Error scraping Medium posts:", error);
      return [];
    }
  }

  async getPosts(): Promise<MediumPost[]> {
    try {
      // Fetch from RSS feed
      const rssPosts = await this.parser.parseURL(this.baseUrl).then((feed) =>
        feed.items.map((item) => {
          // Thumbnail extraction logic
          let thumbnail: string | undefined = undefined;
          if (item["content:encoded"]) {
            const $ = cheerio.load(item["content:encoded"]);
            const firstImage = $("img").first();
            thumbnail = firstImage.attr("src");
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
        })
      );

      // Fetch additional posts through scraping
      // const scrapedPosts = await this.scrapeMorePosts();

      // Merge posts and remove duplicates based on URL
      const allPosts = [...rssPosts];
      // scrapedPosts.forEach((post) => {
      //   if (!allPosts.some((p) => p.link === post.link)) {
      //     allPosts.push(post);
      //   }
      // });

      return allPosts;
    } catch (error) {
      console.error("Error fetching Medium posts:", error);
      throw error;
    }
  }
}

// Internal function for fetching Medium posts
async function fetchMediumPosts(): Promise<MediumPost[]> {
  try {
    const mediumParser = new MediumFeedParser();
    const result = await mediumParser.getPosts();
    return result;
  } catch (error) {
    console.error("Error fetching Medium posts:", error);
    // Return empty array on error
    return [];
  }
}

// API Route handler
export async function GET() {
  try {
    const posts = await fetchMediumPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json([], { status: 500 });
  }
}
