import { z } from "zod";

export const newsSourceSchema = z.enum(["X", "Blog", "Release Notes", "GitHub"]);

export const newsItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  whyItMatters: z.string().min(1),
  source: newsSourceSchema,
  sourceAccount: z.string().min(1),
  url: z.url(),
  publishedAt: z.iso.datetime(),
  confidence: z.enum(["High", "Medium", "Low"]),
  tags: z.array(z.string().min(1)).default([])
});

export const newsItemsSchema = z.array(newsItemSchema);

export type NewsSource = z.infer<typeof newsSourceSchema>;
export type NewsItem = z.infer<typeof newsItemSchema>;

export type TimelineAccent = "lime" | "cyan" | "neutral";

export interface TimelineGroup {
  id: string;
  label: string;
  accent: TimelineAccent;
  items: NewsItem[];
}
