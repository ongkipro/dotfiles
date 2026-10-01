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
(Bing, Yandex, Seznam, Naver,  (+ optional llms.txt)
 Yep, Internet Archive, Amazon)        │
                                       ▼
                             Google Search discovery via
                             sitemap/Search Console; Indexing API
                             only for eligible page types
```

IndexNow participants per [indexnow.org/searchengines.json](https://www.indexnow.org/searchengines.json) on 2026-10-02: Bing, Yandex, Seznam, Naver, Yep, Internet Archive, Amazon. DuckDuckGo is **not** listed (an earlier version said it was). One submission is shared with all participants. Protocol limits ([documentation](https://www.indexnow.org/documentation)): up to 10,000 URLs per POST; key of 8–128 characters from `a-z`, `A-Z`, `0-9`, `-`; `200` = submitted, `202` = received pending key validation, `400` bad format, `403` key invalid, `422` URL/host or key mismatch, `429` too many requests (treat as back-off, not retry-now).

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

  // 1. Fire IndexNow (shared with every participating engine); max 10,000 URLs per POST
  if (urls.length > 10_000) throw new Error("IndexNow: split into batches of 10,000 URLs");
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
    if (res.status !== 200 && res.status !== 202) {
      console.error(`[INDEXNOW-PUSH-REJECTED] ${res.status}`, await res.text());
    }
  } catch (err) {
    console.error("[INDEXNOW-PUSH-FAILED]", err);
  }

  // 2. Log event for Sitemap & LLM text update triggers
  console.log(`[SITEMAP-REFRESH] Queued ${urls.length} URLs for sitemap regeneration.`);
}
```
