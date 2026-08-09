# Freshness & Maintenance Engine Architecture

Search engines (Google, Bing) and AI search recommenders (Google AI Overviews, Perplexity) prioritize content updated within the **last 90 days**.

---

## 1. Automated Freshness Strategy

1. **Dynamic `<lastmod>` Timestamp**: Ensure the XML sitemap updates `<lastmod>` only when meaningful content changes.
2. **Automated Cron Data Refresh**: Run scheduled background tasks (e.g. Cloudflare Scheduled Triggers / GitHub Actions) to refresh market prices, stock stats, or annual figures.
3. **Semantic Time Tags**: Use `<time datetime="YYYY-MM-DD">` elements on article layouts.

---

## 2. Cloudflare Worker Cron Trigger Example (`scheduled.ts`)

```typescript
export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log(`[CRON-FRESHNESS] Executing daily content freshness engine at ${new Date().toISOString()}`);

    // 1. Fetch outdated topics (> 90 days since last refresh)
    const outdated = await env.DB.prepare(
      `SELECT id, slug, url FROM pages WHERE updated_at < DATE('now', '-90 days') LIMIT 10`
    ).all();

    if (!outdated.results.length) return;

    for (const page of outdated.results) {
      // Update page timestamp & refresh key metrics
      await env.DB.prepare(
        `UPDATE pages SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).bind(page.id).run();

      // Trigger IndexNow to inform engines of updated content
      await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: env.SITE_HOST,
          key: env.INDEXNOW_KEY,
          keyLocation: `https://${env.SITE_HOST}/${env.INDEXNOW_KEY}.txt`,
          urlList: [page.url]
        })
      });
    }
  }
};
```
