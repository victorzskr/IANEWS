# IANEWS

IANEWS is a minimal web application for developers who want to stay up to date with the most relevant daily news about building with artificial intelligence.

The first version focuses on a simple timeline experience. News items are loaded from `content/news.json`, validated at build time, and each item in the timeline links directly to the original source.

## Product Idea

Developers working with AI tools, models, agents, APIs, and infrastructure need a lightweight way to follow meaningful updates without browsing several feeds every day. IANEWS aims to provide a focused daily timeline of relevant AI development news.

## Initial Scope

- Minimal web interface.
- Timeline-only layout.
- Daily news loaded from a static JSON file.
- Each news item opens the original article or post.
- Human-approved content updates from a daily Codex heartbeat.
- Editorial metadata for source account, confidence and why each item matters.

## Content Sources

The initial source is X, with the goal of tracking relevant updates from AI development accounts and communities.

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

## Content Workflow

Daily curation is handled by the `daily-content-curation-ianews` heartbeat. It proposes new non-duplicate items, waits for approval, then the approved update is committed and pushed after validation.

See `docs/content-curation-workflow.md` for the full workflow.

## Roadmap

1. Expand real source coverage beyond X.
2. Replace sample URLs with approved live sources.
3. Add deploy automation after CI.
4. Add richer source filters and archive views.

## Status

This project has a working static timeline, CI checks and a human-approved content curation workflow.
