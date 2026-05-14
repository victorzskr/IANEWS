import { statSync } from "node:fs";
import { resolve } from "node:path";
import newsItems from "../../../../content/news.json";
import { newsItemsSchema, type NewsItem } from "../domain/news-item";

const newsFilePath = resolve(process.cwd(), "content/news.json");

export function getNewsItems(): NewsItem[] {
  return newsItemsSchema.parse(newsItems);
}

export function getNewsLastUpdatedAt(): Date {
  return statSync(newsFilePath).mtime;
}
