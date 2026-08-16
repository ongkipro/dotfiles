# Automated Indexing Pipeline (Instant Push Engine)

Waiting for search engine crawlers to discover new or updated pages naturally can take weeks. An Automated Indexing Pipeline pushes new URLs to search engines **within seconds of publication**.

---

## 1. Multi-Engine Indexing Workflow

```text
PAGE CREATED / UPDATED / DELETED
              │
              ▼
   WEBHOOK / SERVER ACTION
              │
      ┌───────┴────────────────────────┐
      ▼                                ▼
IndexNow API                  Update sitemap.xml
(Bing, Yandex, Seznam,         & public/llms.txt
 Naver, Yep, DuckDuckGo)               │
                                       ▼
                             Google Search discovery via
                             sitemap/Search Console; Indexing API
                             only for eligible page types
```

Google's Indexing API is restricted to pages containing `JobPosting` or `BroadcastEvent` (inside `VideoObject`) structured data. Do not send general articles, product pages, or pSEO pages to it; use accurate sitemap `<lastmod>` and ordinary crawl discovery for Google, plus IndexNow for participating engines. Re-check the [official eligibility documentation](https://developers.google.com/search/apis/indexing-api/v3/using-api) before implementing an Indexing API branch.

---

## 2. Server Pipeline Helper (`indexingPipeline.ts`)

```typescript
interface PublishEventPayload {
  urls: string[]; // Absolute HTTPS URLs
  host: string;   // e.g. "example.com"
  indexNowKey: string;
}

export async function runAutomatedIndexingPipeline({ urls, host, indexNowKey }: PublishEventPayload) {
  if (!urls.length) return;

  console.log(`[INDEX-PIPELINE] Processing ${urls.length} URLs for ${host}`);

  // 1. Fire IndexNow API (Bing, Yandex, Seznam, Naver, Yep)
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: indexNowKey,
        keyLocation: `https://${host}/${indexNowKey}.txt`,
        urlList: urls
      })
    });
    console.log(`[INDEXNOW-PUSH] Status: ${res.status}`);
  } catch (err) {
    console.error("[INDEXNOW-PUSH-FAILED]", err);
  }

  // 2. Log event for Sitemap & LLM text update triggers
  console.log(`[SITEMAP-REFRESH] Queued ${urls.length} URLs for sitemap regeneration.`);
}
```
