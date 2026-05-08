import newsItems from "../../../../content/news.json";
import { newsItemsSchema, type NewsItem } from "../domain/news-item";

export function getNewsItems(): NewsItem[] {
  return newsItemsSchema.parse(newsItems);
}
