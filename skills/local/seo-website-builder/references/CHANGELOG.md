# SEO Documentation Pack Changelog

This file records the retired `/home/fantastico/Documents/SEO` source pack and subsequent changes to the active skill.

## 2026-08-16 — Active-skill governance correction

- The canonical active skill now lives in this directory; older entries below describe its retired source pack and are historical, not current inventory.
- Removed the stale `PROMOTION_CHECKLIST.md` dependency. `TEST_CASES.md` owns the current conversion/regression gate.

## 2026-07-04 — Sitemap submission / search-engine notification playbook

### Added

- `SITEMAP_SUBMISSION.md` — modern sitemap ping/notify playbook. Documents that
  Google (`google.com/ping`) and Bing anonymous sitemap ping are **deprecated**;
  the correct approach is robots `Sitemap:` + Search Console/Bing Webmaster for
  discovery and **IndexNow** (Bing, Yandex, Seznam, Naver, Yep, DuckDuckGo) for
  instant on-publish notification. Google = no ping (crawl + GSC; Indexing API
  only for JobPosting/BroadcastEvent). Includes a Next.js on-publish IndexNow
  snippet and a QA checklist.

### Changed

- `SKILL.md` — added task-table row routing to `SITEMAP_SUBMISSION.md`.
- `NEXTJS_SEO_PLAYBOOK.md` — sitemap section now warns against deprecated ping
  URLs and links the submission playbook; notes dynamic-from-DB generation.
- `REFERENCE_MANIFEST.md` — registered the new reference.

## 2026-06-30 — Skill-ready documentation pack created

### Added

- `README.md`
- `AUDIT.md`
- `PLAYBOOK.md`
- `ASTRO_SEO_PLAYBOOK.md`
- `SHOPIFY_SEO_PLAYBOOK.md`
- `LOCAL_BUSINESS_SEO_PLAYBOOK.md`
- `SEO_SKILL_BLUEPRINT.md`
- `SKILL_DRAFT.md`
- `REFERENCE_MANIFEST.md`
- `OUTPUT_TEMPLATES.md`
- `VALIDATION_REPORT.md`

### Changed

- Converted duplicate Etsy/eBay export files into redirect stubs while keeping canonical originals.
- Added daily workflow, mode routing, and stack-specific playbooks.
- Integrated useful patterns from existing local skills:
  - `seo-local-business`
  - `shopify-listing`
  - `astro-development`

### Validation

- Broken local links: 0
- Unfinished-marker sweep: clean

## 2026-06-30 — Multi-engine algorithm intelligence added

### Added

- `SEARCH_ENGINE_ALGORITHM_BRIEF.md`
- `SEARCH_ENGINE_SOURCE_INDEX.md`
- `ALGORITHM_UPDATE_LOG.md`

### Changed

- Updated `PLAYBOOK.md` with multi-engine baseline.
- Updated `SKILL_DRAFT.md` with algorithm/source load order and multi-engine output requirement.
- Updated `REFERENCE_MANIFEST.md` with algorithm refresh mode.
- Updated `README.md`, `AUDIT.md`, and `VALIDATION_REPORT.md`.

### Source basis

- Google Search Central docs/blog/status
- Google AI Features and Your Website
- Google ranking systems guide
- Bing Webmaster Blog / IndexNow
- Yandex Webmaster docs
- Pinterest Business/Help/Policy docs

### Validation

- Broken local links: 0
- Unfinished-marker sweep: clean

## 2026-06-30 — Pre-promotion governance added

### Added

- `COMPACT_SKILL_REFERENCES.md`
- `TEST_CASES.md`
- `PROMOTION_CHECKLIST.md` *(historical source-pack file; not retained in the active skill)*
- `CHANGELOG.md`

### Changed

- Prepared compact load reference to reduce future skill context usage.
- Added test cases for local business, Astro, Shopify, ecommerce category, existing audit, algorithm review, Pinterest, and programmatic SEO.
- Added a source-pack promotion checklist; the active skill later consolidated this gate into `TEST_CASES.md`.

### Status

- Still kept in `/home/fantastico/Documents/SEO`.
- Not promoted into active CLI skill yet.

## 2026-06-30 — Dry-run test and promotion status added

### Added

- `TEST_RUN_REPORT.md`
- `PROMOTION_STATUS.md`

### Changed

- Updated `README.md` and `REFERENCE_MANIFEST.md` to include dry-run and promotion status files.

### Validation

- dry-run test cases: PASS
- promotion status: ready pending explicit user approval
- broken local links: clean
- unfinished-marker sweep: clean

## 2026-06-30 — Added Next.js SEO Playbook

### Added

- `references/NEXTJS_SEO_PLAYBOOK.md`

### Changed

- Updated `SKILL.md` to route Next.js frontend tasks.
- Updated `COMPACT_SKILL_REFERENCES.md`, `REFERENCE_MANIFEST.md`, and `README.md`.

### Notes

- Covers App Router Metadata API, `generateMetadata()`, Pages Router `next/head`, `app/sitemap.ts`, `app/robots.ts`, SSG/SSR/ISR decisions, Client Component SEO boundaries, JSON-LD, `next/image`, and crawlable navigation.

## 2026-06-30 — Added Page Completeness Formula

### Added

- `references/PAGE_COMPLETENESS_FORMULA.md`

### Changed

- Updated `SKILL.md` to route complete page audits to the new formula.
- Updated `COMPACT_SKILL_REFERENCES.md` with title/description/social/schema completeness checks.
- Updated `OUTPUT_TEMPLATES.md` with a complete page audit template.
- Updated `REFERENCE_MANIFEST.md` and `README.md`.

### Notes

- Added guidance for title length, description length, OG/Twitter absolute image URLs, headings, image ALT, schema eligibility, robots/canonical, sitemap inclusion, and measurement readiness.
- Included an English example based on an Islamic boarding school homepage audit pattern.

## Future Changelog Template

```md
## YYYY-MM-DD — Title

### Added

- ...

### Changed

- ...

### Removed

- ...

### Source / Evidence

- URL:
- Source type: Official / Strong public evidence / Speculative monitor

### Validation

- broken links:
- placeholder sweep:
- test cases:

### Notes

- ...
```
