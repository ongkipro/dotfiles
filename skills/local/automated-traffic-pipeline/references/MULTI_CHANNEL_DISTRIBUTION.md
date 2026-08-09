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
  // Truncate title to 100 chars, description to 500 chars per Pinterest API limits
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

When auto-syndicating blog articles to external publishing platforms, ALWAYS specify the original URL as the **Canonical Link** (`rel="canonical"`) to prevent duplicate content penalties from Google.
