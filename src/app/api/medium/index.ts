import Parser from "rss-parser";
import * as cheerio from "cheerio";
import axios from "axios";
import { MediumPost } from "@/app/components/ui/sections/insight/types";

interface CustomFeed {
  title: string;
  description: string;
  link: string;
}

interface CustomItem {
  title: string;
  link: string;
  pubDate: string;
  "content:encoded"?: string; // Medium RSS에서는 이 필드를 사용
  author: string;
  categories: string[];
}

function processCategories(categories: string[]): string[] {
  const validCategories = ["news", "tokamak-network", "research"];

  // 유효한 카테고리가 하나라도 있는지 확인
  const hasValidCategory = categories.some((category) =>
    validCategories.includes(category.toLowerCase())
  );

  // 유효한 카테고리가 없으면 tokamak-network 추가
  if (!hasValidCategory) {
    return [...categories, "tokamak-network"];
  }

  // 유효한 카테고리가 있으면 원래 배열 반환
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
    this.username = "@tokamak-network"; // Medium 계정명
  }

  private async scrapeMorePosts(): Promise<MediumPost[]> {
    try {
      // User-Agent 헤더 추가
      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      };

      const response = await axios.get(`https://medium.com/${this.username}`, {
        headers,
        timeout: 10000, // 10초 타임아웃 설정
      });
      const $ = cheerio.load(response.data);
      const posts: MediumPost[] = [];

      // Medium의 article 요소들을 찾아서 파싱
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
      // RSS 피드에서 가져오기 - 헤더 추가
      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/rss+xml,application/xml;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      };

      // rss-parser에 커스텀 axios 인스턴스 사용
      const customAxios = axios.create({
        headers,
        timeout: 10000,
      });

      this.parser.parseURL = async (url) => {
        const response = await customAxios.get(url);
        return this.parser.parseString(response.data);
      };

      const rssPosts = await this.parser.parseURL(this.baseUrl).then((feed) =>
        feed.items.map((item) => {
          // 썸네일 추출 로직
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

      // 스크래핑으로 추가 포스트 가져오기
      const scrapedPosts = await this.scrapeMorePosts();

      // 중복 제거를 위해 URL을 기준으로 합치기
      const allPosts = [...rssPosts];
      scrapedPosts.forEach((post) => {
        if (!allPosts.some((p) => p.link === post.link)) {
          allPosts.push(post);
        }
      });

      return allPosts;
    } catch (error) {
      console.error("Error fetching Medium posts:", error);

      // 에러 상세 정보 로깅
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
        });
      }

      // 에러가 발생해도 빈 배열 반환하여 사이트 작동 유지
      return [];
    }
  }
}

// 외부에서 사용할 함수
export async function fetchMediumPosts(): Promise<MediumPost[]> {
  try {
    const mediumParser = new MediumFeedParser();
    const result = await mediumParser.getPosts();
    return result;
  } catch (error) {
    console.error("Failed to fetch Medium posts:", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
}
