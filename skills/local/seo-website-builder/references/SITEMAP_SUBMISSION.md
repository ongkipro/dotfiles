# Sitemap Submission & Search-Engine Notification (Ping)

How to tell search engines about a new/updated sitemap and changed URLs — the
current, correct way. Load this for launch, publishing pipelines, or "how do I
ping Google/Bing" questions.

## Evidence Rule

The classic anonymous **sitemap ping endpoints are deprecated. Do not use them.**

- **Google** retired `https://www.google.com/ping?sitemap=...` (announced Jun
  2023, endpoint removed). Pinging it does nothing.
- **Bing** retired its anonymous sitemap ping; it now points publishers to
  IndexNow.

Recommending the old ping URLs is a correctness bug. Use the two layers below.

## Two-Layer Model

**Layer 1 — Discovery (always set up, once):** let engines find the sitemap.
**Layer 2 — Instant notification (on publish/update/delete):** push changed URLs.

### Layer 1 — Discovery (set-and-forget)

1. `robots.txt` MUST contain a `Sitemap:` directive with the absolute URL. This
   is the primary, engine-agnostic discovery mechanism.
   ```
   Sitemap: https://example.com/sitemap.xml
   ```
2. Submit the sitemap once in each webmaster console:
   - **Google Search Console** → Sitemaps → add `sitemap.xml`.
   - **Bing Webmaster Tools** → Sitemaps (or import from GSC).
   - Optional: **Yandex Webmaster**, **Naver Search Advisor** for those markets.
3. Keep `<lastmod>` accurate (true content update time, not build time). Engines
   use it to prioritize recrawl. Inaccurate/always-now `lastmod` gets ignored.

### Layer 2 — Instant notification on change

#### IndexNow — the way to "ping all search engines"

One protocol, one request, propagated to all participants:
**Microsoft Bing, Yandex, Seznam.cz, Naver, Yep** (and **DuckDuckGo** via Bing).
Submitting to any IndexNow endpoint shares with every participant — you do NOT
call each engine separately.

> Google is **not** an IndexNow participant (as of this writing). Handle Google
> via Layer 1 + the Google section below.

**Setup (once):**
1. Generate a key: 8–128 hex chars, e.g. `a1b2c3d4e5f6...`.
2. Host it at the site root: `https://example.com/<key>.txt`, file body = the key.
3. That URL is your `keyLocation`.

**Notify on publish / update / delete** (send the affected URL(s)):

- Single URL (GET):
  ```
  https://api.indexnow.org/indexnow?url=https://example.com/blog/post&key=<key>
  ```
- Batch (POST JSON, up to 10,000 URLs):
  ```
  POST https://api.indexnow.org/indexnow
  Content-Type: application/json
  {
    "host": "example.com",
    "key": "<key>",
    "keyLocation": "https://example.com/<key>.txt",
    "urlList": ["https://example.com/blog/post", "https://example.com/katalog/x"]
  }
  ```
  Endpoints are interchangeable: `api.indexnow.org/indexnow`,
  `www.bing.com/indexnow`, `yandex.com/indexnow`. 200/202 = accepted.

**Send on:** new publish, meaningful update, and deletion (so engines drop it).
Do NOT spam unchanged URLs — send only what actually changed.

#### Google — there is no ping

- Rely on Layer 1: `robots.txt` + Search Console. Google recrawls sitemaps it
  knows about automatically; accurate `lastmod` speeds it up.
- For a few high-priority URLs, use **URL Inspection → Request Indexing** in GSC.
- **Indexing API** is officially limited to `JobPosting` and `BroadcastEvent`
  page types. Do not advise it for general content (violates the API terms).

## Coverage Table

| Engine | How it's notified |
| --- | --- |
| Bing, Yandex, Seznam, Naver, Yep, DuckDuckGo | **IndexNow** (single call) |
| Google | robots.txt `Sitemap:` + Search Console (no ping; Indexing API only for JobPosting/BroadcastEvent) |
| Any other | robots.txt `Sitemap:` discovery |

## Auto-notify in a CMS/app (Next.js example)

Fire IndexNow from the server action that publishes/updates/unpublishes content.
Key from env; fail soft (never block the publish on a ping error).

```ts
// lib/indexnow.ts
const KEY = process.env.INDEXNOW_KEY;
const HOST = process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "");

export async function notifyIndexNow(urls: string[]) {
  if (!KEY || !HOST || urls.length === 0) return;
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList: urls,
      }),
    });
  } catch {
    /* non-blocking */
  }
}
```
- Serve the key file: `app/[key].txt/route.ts` returning the key, or a static
  file in `public/<key>.txt`.
- Call `notifyIndexNow([absoluteUrl(...)])` after a successful publish/update,
  and on delete. Batch when bulk-publishing.

## QA Checklist

- [ ] `robots.txt` has an absolute `Sitemap:` line.
- [ ] Sitemap submitted in Google Search Console + Bing Webmaster Tools.
- [ ] `<lastmod>` reflects real content changes.
- [ ] IndexNow key file reachable at `/<key>.txt` (200, body = key).
- [ ] Publish/update/delete triggers an IndexNow call with the changed URL(s).
- [ ] No deprecated `google.com/ping` or `bing.com/ping` calls anywhere.
- [ ] Only canonical, indexable, published URLs are submitted.
