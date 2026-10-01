# Content Collections

## Use modern Astro content setup

Use:
- `src/content.config.ts`
- loaders such as `glob()` or `file()`
- schemas for every collection

## Use collections for

- blog posts
- docs pages
- team/member profiles
- services/case studies/testimonials
- structured content that should be typed

## Best practices

- define clear schema fields
- use defaults only where sensible
- keep slug/content organization predictable
- separate authored content from dynamic application data

## Do not use collections for

- high-churn runtime data
- form submissions
- user-specific data
- admin-managed transactional data

Those belong in a database or API-backed flow instead.

## Build-time or live

- Build-time (`src/content.config.ts`, `glob()`/`file()`/custom `load`):
  content that changes at deploy time; fastest and fully prerenderable.
- Live (`src/live.config.ts`, `defineLiveCollection()`, Astro 6+): external
  data that must be current per request without a rebuild; needs on-demand
  rendering and handles the returned `error` from `getLiveCollection()` /
  `getLiveEntry()`.
- Import Zod from `astro/zod` (Zod 4 on Astro 6+). Details and sources:
  [Platform versions](platform-versions.md).
