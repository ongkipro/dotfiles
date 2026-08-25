---
name: content
description: >-
  End-to-end content production playbook for blog articles, product listings,
  social posts, and landing pages. Covers structure templates, brand voice
  calibration, batching/calendar workflow, image+alt pipeline, cross-posting,
  and quality gates (no CTA, no brand leak, char limits). Triggers: bikin
  konten, tulis artikel, blog post, content calendar, social post, landing
  page copy, batch content, kalender konten, artikel SEO. Pairs with
  copywriting (rules), seo-website-builder
  (SEO QA), volumx-writer (preservation + humanization), and 9router (visuals
  + research). NOT the source of copy rules and NOT for a single asset — use
  copywriting for char limits, headline patterns, meta, and ALT text; this skill
  is the multi-asset production pipeline.
---

# Content Production

Repeatable content workflow that produces clean, on-brand, SEO-ready copy at
scale. Pairs with `copywriting` (rules + templates) and
`seo-website-builder` (domain-specific QA).

## When to use

- User asks for a blog article, listicle, comparison, review, how-to, or guide.
- User wants a batch of social posts (FB / IG / Threads / Pinterest / TikTok).
- User wants landing page copy (hero, sub, sections, FAQ, CTA band).
- User wants a content calendar or wants to plan a content sprint.
- User wants to refactor existing content (rewrite for voice, freshness, SEO).
- Mixed-language content (ID/EN) — confirm language per channel first.

## Workflow (canonical order)

1. **Scope** — confirm:
   - Channel (blog / product / social / landing / email).
   - Language and target market (US/EN, ID/EN, DE/DE, etc.).
   - Brand policy: generic or branded (default = generic per `copywriting` hard rule #1).
   - Voice register (warm/playful, premium/minimalist, technical/precise) — pull
     from `~/.config/ai/memory/identity.md` + `business.md`.
   - Volume and deadline.
2. **Research** — for any factual claim:
   - Official docs first, then trusted secondary.
   - For SEO-driven pieces: pull related queries from `seo-website-builder` +
     `9router` (`references/web-search.md`).
   - Do **not** invent specs, prices, dates, or product facts.
3. **Outline** — produce a numbered outline with:
   - Hook (1 sentence), H2s (3-6), key points per H2, internal link candidates,
     meta title/description, suggested image(s) and ALT.
   - For products: title candidates, handle, meta, tags, category, body sections.
4. **Protect** — for rewrites or constrained source material, use
   `volumx-writer/references/preservation.md` to ledger claims, qualifiers,
   keywords, citations, offers, and required formatting before editing.
5. **Draft** — write to a file (`/tmp/content/<slug>.md`) so it can be reviewed
   in chunks. Apply hard rules from `copywriting` (no CTA, char limits, no
   third-party brand, fix typos, verifiable facts only).
6. **QA gates (Delivery verification)** before publish — run **all**:
   - **P0 Blockers (Immediate Reject):**
     - Any fabricated or unsourced numeric claim/stat (every material number must cite a real source).
     - Title bait-and-switch (H1 and body must fulfill the headline promise).
     - Broken links (404/SSRF) or broken local/CDN image references.
     - Unapproved CTA in body or meta (unless explicitly a landing page or buy-box).
     - Third-party brand names present without user opt-in.
   - **P1 Ship Blockers (Must fix before final publish):**
     - Intent invisible in first 5 seconds (missing Key Takeaways / TL;DR summary at the top).
     - H2 contract broken (subtopic promise not delivered in opening 100 words of the section).
     - Monotonous wall of text (missing TOC on >1500 words; missing comparison table/list for dense data).
     - Field and ALT limits exceeded (cross-channel table from `copywriting`).
     - Image ALT missing or using generic filler ("image of", "picture of").
     - H1/H2 hierarchy broken (more than one H1, or skipped heading levels).
   - **P2 Polish & Editorial Checks:**
     - Second-order AI slop (metronomic 3-clause rhythm, question-cadence H2s, hedge stacking `may/often/typically`).
     - Duplicate trailing `## Sources` block when citations are already inline (`volumx-writer/references/synthesis-contract.md`).
     - JSON-LD schema `wordCount` matches actual body word count within ±5%.
7. **Image pipeline** — for each visual:
   - Generate via `9router` (`references/image.md`), selecting the current image model from that skill's use-case matrix rather than pinning a model ID here, or
     use supplied asset.
   - Filename: `<handle-or-slug>-N.<ext>`. Write ALT text with `copywriting`'s canonical pattern and current limit.
   - If image is AI-generated: keep the original, store the public URL (R2/Cloudinary)
     before publishing.
8. **Publish** — apply per channel:
   - **Blog**: write Markdown/Astro/MDX; run `seo-website-builder` reference
     `PAGE_COMPLETENESS_FORMULA.md` before deploy.
   - **Product**: apply `copywriting`'s product rules; do not bypass the QA gates.
   - **Social**: use `copywriting` social templates; respect per-platform char
     limits and hashtag policy.
   - **Landing**: copy + design tokens + sections; respect the project's brand
     palette and motion system (GSAP if available).
9. **Log** — append a 1-line entry to the project's edit-log
   (`~/Documents/<project>/_log.md` or similar) so memory stays current.

## Hard rules (apply to ALL channels unless the user explicitly overrides)

- **No CTA** in blog/article/product body. CTA bands belong only on landing pages
  or shop product pages, and even then must be user-approved.
- **No third-party brand names** unless user opts in. Generic praise only.
- **Field and ALT limits** — load the canonical cross-channel table from `copywriting`; that skill is the only owner of the numeric limits and qualifiers.
- **No invented facts** — pull from source data or research; if uncertain, ask.
- **Fix ALL typos** — run a final spell pass.
- **One H1 per page**. No skipped heading levels.
- **Language consistency** — pick one primary language per piece; do not mix
  unless the user asks for code-switching.
- **Image ALT** — descriptive, keyword-aware, no "image of"/"picture of" filler.

## Batching patterns

### Article batch (5-10 pieces / sprint)
1. Pull topic list + target keywords from research.
2. Outline all pieces first; checkpoint with user.
3. Draft sequentially; write to files for review.
4. QA each piece individually.
5. Generate visuals in parallel (one 9router image call per piece).
6. Publish in publish order, log each.

### Social batch (per channel, weekly)
1. Pick themes for the week (3-5 topics).
2. Write 5-7 posts per topic across channels.
3. Adapt per platform (FB long-form, IG caption + hashtag, Threads short, etc.).
4. Schedule via the project's social tool (or note publish times).

### Product batch (large catalog)
1. Fan out to subagents, ~15-20 products each.
2. Each subagent loads the current rules directly from `copywriting`; never paste a second copy of its limits into the batch prompt or this skill.
3. Validate before apply.

> The `shopify-listing` skill that used to own this workflow (and its
> purpose-built subagent prompt) was deactivated 2026-08-10. Restore with
> `git revert` + `skill-update` before running a Shopify catalog batch.

## Output shape (final hand-off)

```md
## Content Brief — <slug or topic>

- Channel: <blog|product|social|landing>
- Language: <locale>
- Voice: <1 line>
- Length target: <words / char count>
- Headline: <candidate>
- Meta: <metaTitle> | <metaDescription>
- Outline: <numbered>
- Visuals: <N images, brief each>
- Internal links: <list>
- CTA: <none | user-approved band at section X>
- QA: <passed | list of gates that flagged something>
- Log: <1 line for edit-log>
```

## Operational notes

- **Token discipline**: outline + structure first, draft in chunks, never dump
  a 5000-word essay into a single response.
- **Reuse**: prefer editing an existing draft over rewriting from scratch.
- **File path**: write drafts to `/tmp/content/<slug>.md` for review; final
  location is project-specific (e.g. `src/content/blog/<slug>.md`).
- **Memory**: after publishing, append the headline + URL to the project's
  block in `~/.config/ai/memory/projects.md` so the next session picks it up.

## Pair with

- `copywriting` — exact copy rules + headline/meta/body templates.
- `volumx-writer` — preservation, anti-hallucination, humanization, and scoring.
- `seo-website-builder` — for technical SEO QA + sitemap/IndexNow.
- `9router` (`references/image.md`) — for image generation.
- `9router` (`references/web-search.md`) — for research and source verification.
- `prd-taskbreaker` — to break a content sprint into numbered tasks.
