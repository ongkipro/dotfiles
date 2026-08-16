# Freshness & Maintenance Engine Architecture

No search engine publishes a universal content-age threshold. This reference uses **90 days only as a configurable house heuristic** for selecting review candidates; it is directional, not an official ranking rule. Choose a cadence from source volatility and observed performance. Google explicitly says sitemap `<lastmod>` should reflect the last significant page update, not an artificial timestamp ([Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap#lastmod)).

---

## 1. Automated Freshness Strategy

1. **Accurate `<lastmod>` Timestamp**: Update sitemap `<lastmod>` only after meaningful content changes.
2. **Automated Cron Data Refresh**: Run scheduled background tasks (e.g. Cloudflare Scheduled Triggers / GitHub Actions) to refresh market prices, stock stats, or annual figures.
3. **Semantic Time Tags**: Use `<time datetime="YYYY-MM-DD">` elements on article layouts.

---

## 2. Cloudflare Worker Candidate Scanner (`scheduled.ts`)

```typescript
interface Env {
  DB: D1Database;
  CONTENT_REFRESH_DAYS: string;
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env) {
    const refreshDays = Number.parseInt(env.CONTENT_REFRESH_DAYS, 10);
    if (!Number.isInteger(refreshDays) || refreshDays < 1) {
      throw new Error("CONTENT_REFRESH_DAYS must be a positive integer");
    }

    const staleModifier = `-${refreshDays} days`;
    const candidates = await env.DB.prepare(
      `SELECT id, slug, url FROM pages
       WHERE updated_at < DATE('now', ?)
       ORDER BY updated_at ASC
       LIMIT 10`
    ).bind(staleModifier).all();

    for (const page of candidates.results) {
      console.log(`[FRESHNESS-CANDIDATE] Review ${page.url}`);
    }
  }
};
```

This scanner selects review candidates; it deliberately does not bump `updated_at`. The content job must re-check the source and change material facts first. Only then record the real update time, regenerate sitemap/`llms.txt`, and notify eligible indexing services. A timestamp-only rewrite is not a freshness update.
