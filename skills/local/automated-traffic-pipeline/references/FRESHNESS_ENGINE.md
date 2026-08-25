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

---

## 3. Content Decay Triage Protocol (GSC QoQ Analysis)

When auditing traffic decay using Google Search Console export data comparing two periods (e.g. Current Quarter vs Previous Quarter), classify URLs with **≥ 20% traffic drop** into the three-way triage matrix:

| Observed Signal | Root Diagnosis | Prescribed Action |
|---|---|---|
| **Drop ≥ 20%, Rank 4–15, High Impressions** | Content is still indexed and visible, but losing clicks due to outdated dates, stale stats, or weak CTR titles. | **Refresh:** Update title hook, inject current-year verified stats, add a direct AnswerBox section, and update sitemap `<lastmod>`. |
| **Drop ≥ 20%, Multiple URLs ranking for same query** | Keyword cannibalization splitting authority between two or more posts. | **Consolidate:** Merge unique insights into the primary pillar URL, remove duplicate post, and set `301 Permanent Redirect`. |
| **Drop ≥ 20%, Rank > 30, Zero Impressions** | Dead search intent, deprecated tech, or zero remaining search demand. | **Prune:** Set `noindex` or `410 Gone` to protect site-wide crawl budget and content density. |

A ≥20% QoQ drop is a review trigger, not automatic authorization to rewrite,
redirect, noindex, or return `410`. Confirm query intent, the canonical URL,
indexed state, conversions, links, and relevant business owner before a
destructive consolidation or pruning action.
