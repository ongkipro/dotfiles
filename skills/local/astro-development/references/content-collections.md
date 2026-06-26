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
