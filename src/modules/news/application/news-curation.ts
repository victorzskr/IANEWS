import type { NewsItem } from "../domain/news-item";

export interface DuplicateNewsIssue {
  field: "id" | "url" | "title";
  value: string;
  itemIds: string[];
}

export function findDuplicateNewsIssues(items: NewsItem[]): DuplicateNewsIssue[] {
  return [
    ...findDuplicateIssuesByField(items, "id", (item) => item.id),
    ...findDuplicateIssuesByField(items, "url", (item) => normalizeUrl(item.url)),
    ...findDuplicateIssuesByField(items, "title", (item) => normalizeText(item.title))
  ];
}

export function hasDuplicateNews(items: NewsItem[]): boolean {
  return findDuplicateNewsIssues(items).length > 0;
}

function findDuplicateIssuesByField(
  items: NewsItem[],
  field: DuplicateNewsIssue["field"],
  getValue: (item: NewsItem) => string
): DuplicateNewsIssue[] {
  const seenItems = new Map<string, NewsItem[]>();

  for (const item of items) {
    const value = getValue(item);
    const currentItems = seenItems.get(value) ?? [];
    currentItems.push(item);
    seenItems.set(value, currentItems);
  }

  return Array.from(seenItems.entries())
    .filter(([, duplicateItems]) => duplicateItems.length > 1)
    .map(([value, duplicateItems]) => ({
      field,
      value,
      itemIds: duplicateItems.map((item) => item.id)
    }));
}

function normalizeUrl(value: string): string {
  const url = new URL(value);
  url.hash = "";

  for (const key of Array.from(url.searchParams.keys())) {
    if (key.toLowerCase().startsWith("utm_")) {
      url.searchParams.delete(key);
    }
  }

  url.searchParams.sort();

  return url.toString().replace(/\/$/, "");
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}
