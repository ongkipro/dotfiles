# Multi-Modal & Authority Schemas (JSON-LD)

Google AI Mode & Overviews give **+156% to +317% selection lift** to content that pairs clear text with structured multi-modal data (`ImageObject`, `VideoObject` with transcripts).

---

## 1. ImageObject Schema Generator

```ts
// src/utils/schemaMedia.ts

export function imageObjectSchema({
  url,
  caption,
  author,
  width = 1200,
  height = 630
}: {
  url: string;
  caption: string;
  author: string;
  width?: number;
  height?: number;
}) {
  return {
    "@type": "ImageObject",
    "contentUrl": url,
    "caption": caption,
    "width": width,
    "height": height,
    "creator": {
      "@type": "Person",
      "name": author
    }
  };
}
```

---

## 2. VideoObject Schema Generator

```ts
export function videoObjectSchema({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  transcript
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl: string;
  transcript?: string;
}) {
  return {
    "@type": "VideoObject",
    "name": name,
    "description": description,
    "thumbnailUrl": thumbnailUrl,
    "uploadDate": uploadDate,
    "contentUrl": contentUrl,
    ...(transcript && { "transcript": transcript })
  };
}
```

---

## 3. Article Schema with Embedded Media & E-E-A-T Author

```ts
export function articleSchema({
  title,
  description,
  url,
  image,
  publishedAt,
  updatedAt,
  authorName,
  authorUrl
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  authorUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "image": [image],
    "datePublished": publishedAt,
    "dateModified": updatedAt || publishedAt,
    "author": {
      "@type": "Person",
      "name": authorName,
      "url": authorUrl
    },
    "publisher": {
      "@id": "https://example.com/#organization"
    }
  };
}
```
