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
                             Google Search Console /
                             Indexing API (if eligible)
```

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
