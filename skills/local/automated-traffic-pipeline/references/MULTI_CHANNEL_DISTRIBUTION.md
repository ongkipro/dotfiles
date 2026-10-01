# Multi-Channel Distribution Flywheel Architecture

Publishing a page on your site is only step 1. An automated traffic flywheel distributes visual assets and content snippets across high-domain-authority platforms (**Pinterest, Medium, Dev.to, LinkedIn, RSS feeds**).

---

## 1. Distribution Flywheel Architecture

```text
NEW CONTENT PUBLISHED
          │
          ├──► 1. Auto-Generate Pinterest Pin (2:3 Vertical 1000x1500px)
          │
          ├──► 2. Publish to Pinterest Board API
          │
          ├──► 3. Generate RSS / Atom Feed Item
          │
          └──► 4. Syndication to Medium / Dev.to with Canonical Link
```

---

## 2. Automated Pin Asset Metadata Generator (`pinGenerator.ts`)

```typescript
interface PinMetadataInput {
  title: string;
  description: string;
  targetUrl: string;
  imageUrl: string;
  boardId: string;
}

export function generatePinterestMetadata({ title, description, targetUrl, imageUrl, boardId }: PinMetadataInput) {
  // lazy: limits below are local defaults, not verified against the Pinterest API v5
  // reference (developer docs need login to read). Confirm current maxLength values
  // in the POST /v5/pins schema before shipping.
  const pinTitle = title.substring(0, 100);
  const pinDesc = `${description.substring(0, 400)}... Read the complete guide at ${targetUrl}`;

  return {
    board_id: boardId,
    title: pinTitle,
    description: pinDesc,
    link: targetUrl,
    media_source: {
      source_type: "image_url",
      url: imageUrl
    }
  };
}
```

---

## 3. Canonical Syndication Rules (Medium / Dev.to)

When auto-syndicating blog articles to external platforms, set the platform's canonical field (e.g. Dev.to `canonical_url`, Medium import) to the original URL where offered — but do not rely on it for Google. Google states: "The canonical link element is not recommended for those who want to avoid duplication by syndication partners, because the pages are often very different. The most effective solution is for partners to block indexing of your content." ([Fix canonicalization issues](https://developers.google.com/search/docs/crawling-indexing/canonicalization-troubleshooting), accessed 2026-10-02.) Duplicate content is not a penalty; the risk is the syndicated copy being chosen to rank instead of yours. Prefer partners that apply `noindex`, syndicate excerpts with a link back, or publish on your own domain first and syndicate later.
