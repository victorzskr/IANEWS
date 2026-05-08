import { describe, expect, it } from "vitest";
import {
  createFilteredTimelineGroups,
  createTimelineGroups,
  filterNewsByQuery,
  formatUpdateStatus,
  getLatestPublishedAt,
  sortNewsByNewest
} from "../../src/modules/news/application/news-timeline";
import {
  findDuplicateNewsIssues,
  hasDuplicateNews
} from "../../src/modules/news/application/news-curation";
import { newsItemSchema, type NewsItem } from "../../src/modules/news/domain/news-item";
import { getNewsItems } from "../../src/modules/news/infrastructure/json-news-repository";

const newsItems: NewsItem[] = [
  {
    id: "claude-code",
    title: "Anthropic publica mejoras en Claude Code",
    summary: "Mejor manejo de contexto para proyectos.",
    whyItMatters: "Mejora el trabajo diario en repositorios con asistentes de codigo.",
    source: "X",
    sourceAccount: "@anthropicai",
    url: "https://example.com/claude-code",
    publishedAt: "2026-05-08T08:45:00.000Z",
    confidence: "High",
    tags: ["claude", "developer-tools"]
  },
  {
    id: "openai-files",
    title: "OpenAI lanza soporte nativo para archivos grandes",
    summary: "La API ahora admite archivos grandes.",
    whyItMatters: "Amplia los casos de uso de agentes y analisis documental.",
    source: "X",
    sourceAccount: "@openai",
    url: "https://example.com/openai-files",
    publishedAt: "2026-05-07T17:20:00.000Z",
    confidence: "Medium",
    tags: ["openai", "files"]
  },
  {
    id: "openai-agents",
    title: "OpenAI actualiza sus herramientas para agentes",
    summary: "Nuevas capacidades en la API.",
    whyItMatters: "Afecta a como los equipos construyen aplicaciones agenticas.",
    source: "X",
    sourceAccount: "@openai",
    url: "https://example.com/openai-agents",
    publishedAt: "2026-05-08T10:30:00.000Z",
    confidence: "High",
    tags: ["agents", "api"]
  }
];

describe("news domain", () => {
  it("validates a news item with zod", () => {
    expect(newsItemSchema.parse(newsItems[0])).toEqual(newsItems[0]);
  });

  it("rejects news items with unsupported sources or invalid urls", () => {
    expect(() =>
      newsItemSchema.parse({
        ...newsItems[0],
        source: "Newsletter",
        url: "not-a-url"
      })
    ).toThrow();
  });

  it("loads valid news from the json repository", () => {
    const repositoryItems = getNewsItems();

    expect(repositoryItems.length).toBeGreaterThan(0);
    expect(repositoryItems.every((item) => newsItemSchema.safeParse(item).success)).toBe(
      true
    );
  });

  it("keeps repository news free of duplicate ids, urls and titles", () => {
    expect(findDuplicateNewsIssues(getNewsItems())).toEqual([]);
  });
});

describe("news curation safeguards", () => {
  it("detects duplicate ids, urls and normalized titles", () => {
    const duplicateItems: NewsItem[] = [
      newsItems[0],
      {
        ...newsItems[1],
        id: newsItems[0].id,
        title: "Anthropic publica mejoras en Claude Code!",
        url: `${newsItems[0].url}?utm_source=x#thread`
      }
    ];

    expect(hasDuplicateNews(duplicateItems)).toBe(true);
    expect(findDuplicateNewsIssues(duplicateItems)).toEqual([
      {
        field: "id",
        value: "claude-code",
        itemIds: ["claude-code", "claude-code"]
      },
      {
        field: "url",
        value: "https://example.com/claude-code",
        itemIds: ["claude-code", "claude-code"]
      },
      {
        field: "title",
        value: "anthropic publica mejoras en claude code",
        itemIds: ["claude-code", "claude-code"]
      }
    ]);
  });

  it("accepts unique news candidates", () => {
    expect(hasDuplicateNews(newsItems)).toBe(false);
  });
});

describe("news timeline use cases", () => {
  it("sorts news by newest publication date", () => {
    expect(sortNewsByNewest(newsItems).map((item) => item.id)).toEqual([
      "openai-agents",
      "claude-code",
      "openai-files"
    ]);
  });

  it("does not mutate the original news collection when sorting", () => {
    const originalOrder = newsItems.map((item) => item.id);

    sortNewsByNewest(newsItems);

    expect(newsItems.map((item) => item.id)).toEqual(originalOrder);
  });

  it("groups news by day using Spanish labels", () => {
    const groups = createTimelineGroups(
      newsItems,
      new Date("2026-05-08T12:00:00.000Z")
    );

    expect(groups).toMatchObject([
      {
        label: "Hoy",
        accent: "lime",
        items: [{ id: "openai-agents" }, { id: "claude-code" }]
      },
      {
        label: "Ayer",
        accent: "cyan",
        items: [{ id: "openai-files" }]
      }
    ]);
  });

  it("uses formatted dates and neutral accents for older groups", () => {
    const groups = createTimelineGroups(
      [
        ...newsItems,
        {
          id: "older-news",
          title: "Nueva herramienta de pruebas para IA",
          summary: "Caso de prueba para fechas antiguas.",
          whyItMatters: "Ayuda a comparar resultados antes de publicar cambios.",
          source: "Blog",
          sourceAccount: "Official blog",
          url: "https://example.com/older-news",
          publishedAt: "2026-05-05T11:00:00.000Z",
          confidence: "Medium",
          tags: ["testing"]
        }
      ],
      new Date("2026-05-08T12:00:00.000Z")
    );

    expect(groups.at(-1)).toMatchObject({
      id: "2026-05-05",
      label: "05 may",
      accent: "neutral",
      items: [{ id: "older-news" }]
    });
  });

  it("filters by title, summary, source and tags", () => {
    expect(filterNewsByQuery(newsItems, "agentes").map((item) => item.id)).toEqual([
      "openai-agents"
    ]);
    expect(filterNewsByQuery(newsItems, "developer-tools").map((item) => item.id)).toEqual([
      "claude-code"
    ]);
    expect(filterNewsByQuery(newsItems, "api").map((item) => item.id)).toEqual([
      "openai-files",
      "openai-agents"
    ]);
  });

  it("filters case-insensitively and ignores accents in search text", () => {
    expect(filterNewsByQuery(newsItems, "ANTHROPIC").map((item) => item.id)).toEqual([
      "claude-code"
    ]);
    expect(filterNewsByQuery(newsItems, "nuevas capacidades").map((item) => item.id)).toEqual([
      "openai-agents"
    ]);
  });

  it("returns all items for empty or whitespace-only queries", () => {
    expect(filterNewsByQuery(newsItems, "").map((item) => item.id)).toEqual(
      newsItems.map((item) => item.id)
    );
    expect(filterNewsByQuery(newsItems, "   ").map((item) => item.id)).toEqual(
      newsItems.map((item) => item.id)
    );
  });

  it("keeps filtered results grouped by day", () => {
    const groups = createFilteredTimelineGroups(
      newsItems,
      "openai",
      new Date("2026-05-08T12:00:00.000Z")
    );

    expect(groups.map((group) => group.items.map((item) => item.id))).toEqual([
      ["openai-agents"],
      ["openai-files"]
    ]);
  });

  it("returns an empty filtered timeline when there are no matches", () => {
    expect(createFilteredTimelineGroups(newsItems, "without results")).toEqual([]);
  });

  it("derives the update status from the latest news item", () => {
    expect(getLatestPublishedAt(newsItems)?.toISOString()).toBe(
      "2026-05-08T10:30:00.000Z"
    );
    expect(formatUpdateStatus(getLatestPublishedAt(newsItems))).toContain(
      "Actualizado"
    );
  });

  it("handles empty collections when deriving update status", () => {
    expect(getLatestPublishedAt([])).toBeNull();
    expect(formatUpdateStatus(null)).toBe("Sin noticias");
  });
});
