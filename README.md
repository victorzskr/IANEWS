# IANEWS

IANEWS is a minimal web application for developers who want to stay up to date with the most relevant daily news about building with artificial intelligence.

The first version will focus on a simple timeline experience. News items will be loaded from a manually maintained data file, such as JSON, and each item in the timeline will link directly to the original source.

## Product Idea

Developers working with AI tools, models, agents, APIs, and infrastructure need a lightweight way to follow meaningful updates without browsing several feeds every day. IANEWS aims to provide a focused daily timeline of relevant AI development news.

## Initial Scope

- Minimal web interface.
- Timeline-only layout.
- Daily news loaded from a static JSON file.
- Each news item opens the original article or post.
- Manual content updates at first.
- Future heartbeat workflow to help collect and refresh the day's most relevant news.

## Content Sources

The initial source will be X, with the goal of tracking relevant updates from AI development accounts and communities.

In the future, the project may expand to additional sources such as:

- AI company blogs.
- Engineering blogs.
- Product release feeds.
- RSS feeds.
- Public websites that allow scraping.

## Data Model Draft

The first JSON structure may look like this:

```json
[
  {
    "id": "2026-05-05-example",
    "title": "Example AI development news",
    "summary": "Short description of why this news matters.",
    "source": "X",
    "url": "https://example.com/news",
    "publishedAt": "2026-05-05T09:00:00Z",
    "tags": ["ai", "developer-tools"]
  }
]
```

## Roadmap

1. Create the static web interface.
2. Add the timeline component.
3. Load news from a local JSON file.
4. Add sample daily news data.
5. Configure a heartbeat workflow for manual or assisted updates.
6. Explore additional sources beyond X.

## Status

This project is in the planning and initialization stage.
