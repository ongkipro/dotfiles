# IndexNow Protocol Implementation Playbook

IndexNow is an open protocol that allows website owners to instantly notify participating search engines (**Microsoft Bing, Yandex, Seznam.cz, Naver, Yep, DuckDuckGo**) whenever content is created, updated, or deleted.

---

## 1. How IndexNow Works

1. You generate a random 32-character hex key (e.g. `c8a4f912e56b4028b123456789abcdef`).
2. You host a verification text file at `https://example.com/<key>.txt` containing only the key string.
3. Whenever a URL changes, your server sends an HTTP POST request to `https://api.indexnow.org/indexnow`.
4. IndexNow automatically distributes the notification to all participating engines in real time.

---

## 2. API Payload & Request Format

```http
POST /indexnow HTTP/1.1
Host: api.indexnow.org
Content-Type: application/json; charset=utf-8

{
  "host": "example.com",
  "key": "c8a4f912e56b4028b123456789abcdef",
  "keyLocation": "https://example.com/c8a4f912e56b4028b123456789abcdef.txt",
  "urlList": [
    "https://example.com/ganoderma/penyebab/",
    "https://example.com/guides/cara-identifikasi-ganoderma/"
  ]
}
```

---

## 3. Implementation Code Examples

### A. TypeScript / Node.js Helper (`indexnow.ts`)

```typescript
interface NotifyIndexNowInput {
  host: string; // e.g. "example.com"
  key: string;  // 32-char hex string
  urls: string[]; // Full HTTPS URLs
}

export async function notifyIndexNow({ host, key, urls }: NotifyIndexNowInput): Promise<boolean> {
  if (!urls.length || !key || !host) return false;

  const payload = {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload)
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`[INDEXNOW-SUCCESS] Notified ${urls.length} URLs`);
      return true;
    }
    console.error(`[INDEXNOW-ERROR] HTTP ${res.status}`, await res.text());
    return false;
  } catch (err) {
    console.error("[INDEXNOW-NETWORK-ERROR]", err);
    return false;
  }
}
```

### B. Cloudflare Worker / API Route Trigger
Call `notifyIndexNow` automatically when publishing via CMS webhook, database trigger, or Astro/Next.js build script.

---

## 4. Verification Checklist

- [ ] Hex Key file hosted at `https://example.com/<key>.txt` (returns HTTP 200 and matches key string).
- [ ] Protocol handler sends clean, absolute HTTPS URLs.
- [ ] No non-indexable (404, 301 redirect, noindex) URLs are submitted.
- [ ] Sitemaps (`sitemap-index.xml`) still contain `<lastmod>` tags as a fallback layer.
