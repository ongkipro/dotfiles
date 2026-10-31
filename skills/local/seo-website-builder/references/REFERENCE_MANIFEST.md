# SEO Reference Manifest

This manifest maps the important files in the `seo-website-builder` skill so agents can load the right reference without reading everything.

## Core entry points

| File | Purpose |
| --- | --- |
| `SKILL.md` | Main skill instructions |
| `COMPACT_SKILL_REFERENCES.md` | Optional cross-domain overview; not a mandatory pre-read |
| `PLAYBOOK.md` | Daily operational SEO workflow |
| `IMPLEMENTATION_SPEC.md` | Developer spec: head elements, Open Graph, site name/Organization/breadcrumb/structured data, crawl and index control, robots, sitemap, canonical, hreflang, JavaScript, framework traps; pairs with `scripts/` |
| `PAGE_COMPLETENESS_FORMULA.md` | Complete page audit formula: title, description, canonical, robots, headings, images, links, schema, sitemap |
| `SITEMAP_SUBMISSION.md` | Sitemap discovery + search-engine notification: robots `Sitemap:`, GSC/Bing submit, IndexNow (Bing/Yandex/partners), Google no-ping, on-publish auto-notify |
| `OUTPUT_TEMPLATES.md` | Audit/build/schema/metadata/change-log templates |
| `SEARCH_ENGINE_ALGORITHM_BRIEF.md` | Multi-engine algorithm/discovery model |
| `SEARCH_ENGINE_SOURCE_INDEX.md` | Official/trusted source index |
| `ALGORITHM_UPDATE_LOG.md` | Algorithm update log and playbook refresh policy |
| `TEST_CASES.md` | Pre-promotion and regression test scenarios |
| `VALIDATION_REPORT.md` | Documentation validation report |
| `CHANGELOG.md` | Change history |

## Stack / use-case playbooks

| File | Use case |
| --- | --- |
| `ASTRO_SEO_PLAYBOOK.md` | Astro/static/Cloudflare site SEO |
| `NEXTJS_SEO_PLAYBOOK.md` | Next.js frontend/App Router/Pages Router SEO |
| `SHOPIFY_SEO_PLAYBOOK.md` | Shopify product, collection, listing, and feed SEO |
| `LOCAL_BUSINESS_SEO_PLAYBOOK.md` | Local/service business, GBP alignment, NAP, LocalBusiness schema |

## Recommended load profiles

### Fast mode

Read SKILL.md and existing repository context. For a bounded repair, load only
the relevant topic/stack section if needed, then prove the affected behavior.
Do not require full business planning or analytics for a settled markup change.

### Build mode

1. `PLAYBOOK.md`
2. `PAGE_COMPLETENESS_FORMULA.md`
3. stack/use-case playbook (`ASTRO_SEO_PLAYBOOK.md`, `NEXTJS_SEO_PLAYBOOK.md`, `SHOPIFY_SEO_PLAYBOOK.md`, etc.)
4. Applicable sections of `OUTPUT_TEMPLATES.md` only when useful

### Audit mode

Start with `PLAYBOOK.md`; select page-family, stack, completeness, and template
sections needed for the actual audit scope. The compact overview is optional.

### Algorithm refresh mode

1. `SEARCH_ENGINE_SOURCE_INDEX.md`
2. `ALGORITHM_UPDATE_LOG.md`
3. `SEARCH_ENGINE_ALGORITHM_BRIEF.md`
4. relevant stack/use-case playbook

### Skill authoring / maintenance mode

1. `SKILL.md`
2. `COMPACT_SKILL_REFERENCES.md`
3. `REFERENCE_MANIFEST.md`
4. `TEST_CASES.md`
5. `VALIDATION_REPORT.md`
6. `CHANGELOG.md`

## Deep reference note

The original long-form SEO OS archive is intentionally not bundled. Numeric
module IDs from that retired corpus are not loadable references in this skill.
Use the bundled files listed above.

If a local user has a larger private SEO archive, load it only for deep research tasks and keep the public skill compact.

## Canonical duplicate policy

When a duplicated reference exists, keep one canonical file and replace duplicates with redirect stubs or remove them. Do not ship duplicated reference bodies in the public skill.

## Source governance

- Use official search engine/platform sources for hard rules.
- Use industry sources for tactical context only.
- Label speculative claims clearly.
- Do not claim secret algorithm knowledge.
- Record meaningful updates in `ALGORITHM_UPDATE_LOG.md` and `CHANGELOG.md`.
