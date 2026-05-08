# IANEWS content curation workflow

IANEWS uses a human-approved daily curation workflow.

## Daily heartbeat

The active Codex heartbeat is `daily-content-curation-ianews`.

Every day it should:

1. Review current AI development news.
2. Use `C:\Users\victo\OneDrive\Documentos\1PROGRAMACION\config\content-curation-rules.md` as editorial guidance when available.
3. Compare candidates with previous thread context and existing entries in `content/news.json`.
4. Propose only new, non-duplicate news.
5. Wait for explicit approval before changing the website.

The older `work-heartbeats` automation is paused to avoid duplicate proposals in a different thread.

## Publication flow

After approval, update `content/news.json` with the accepted items and keep the collection sorted by `publishedAt` descending.

Each item must include:

- `id`
- `title`
- `summary`
- `whyItMatters`
- `source`
- `sourceAccount`
- `url`
- `publishedAt`
- `confidence`
- `tags`

Before publishing, run:

```bash
pnpm lint
pnpm test:unit
pnpm check
pnpm build
pnpm test:e2e
```

Then commit and push the approved update.

## Deduplication rules

Do not publish an item if it duplicates an existing:

- `id`
- canonical URL, ignoring fragments and `utm_*` tracking parameters
- normalized title

The unit suite checks the current repository data for these duplicate cases.
