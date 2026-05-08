import type { NewsItem, TimelineAccent, TimelineGroup } from "../domain/news-item";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function sortNewsByNewest(items: NewsItem[]): NewsItem[] {
  return [...items].sort(
    (first, second) =>
      new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime()
  );
}

export function filterNewsByQuery(items: NewsItem[], query: string): NewsItem[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) =>
    normalizeSearchText(
      [item.title, item.summary, item.source, ...item.tags].join(" ")
    ).includes(normalizedQuery)
  );
}

export function createTimelineGroups(
  items: NewsItem[],
  referenceDate = new Date()
): TimelineGroup[] {
  const groups = new Map<string, NewsItem[]>();

  for (const item of sortNewsByNewest(items)) {
    const dateKey = getLocalDateKey(new Date(item.publishedAt));
    const currentItems = groups.get(dateKey) ?? [];
    currentItems.push(item);
    groups.set(dateKey, currentItems);
  }

  return Array.from(groups.entries()).map(([dateKey, groupItems]) => {
    const dayDifference = getDayDifference(dateKey, referenceDate);

    return {
      id: dateKey,
      label: getGroupLabel(dayDifference, dateKey),
      accent: getGroupAccent(dayDifference),
      items: groupItems
    };
  });
}

export function createFilteredTimelineGroups(
  items: NewsItem[],
  query: string,
  referenceDate = new Date()
): TimelineGroup[] {
  return createTimelineGroups(filterNewsByQuery(items, query), referenceDate);
}

export function getLatestPublishedAt(items: NewsItem[]): Date | null {
  const [latestItem] = sortNewsByNewest(items);

  return latestItem ? new Date(latestItem.publishedAt) : null;
}

export function formatUpdateStatus(publishedAt: Date | null): string {
  if (!publishedAt) {
    return "Sin noticias";
  }

  const formattedDate = new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Madrid"
  }).format(publishedAt);

  return `Actualizado ${formattedDate}`;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function getGroupLabel(dayDifference: number, dateKey: string): string {
  if (dayDifference === 0) {
    return "Hoy";
  }

  if (dayDifference === 1) {
    return "Ayer";
  }

  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short"
  }).format(parseLocalDateKey(dateKey));
}

function getGroupAccent(dayDifference: number): TimelineAccent {
  if (dayDifference === 0) {
    return "lime";
  }

  if (dayDifference === 1) {
    return "cyan";
  }

  return "neutral";
}

function getDayDifference(dateKey: string, referenceDate: Date): number {
  const referenceStart = parseLocalDateKey(getLocalDateKey(referenceDate)).getTime();
  const itemStart = parseLocalDateKey(dateKey).getTime();

  return Math.round((referenceStart - itemStart) / DAY_IN_MS);
}

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}
