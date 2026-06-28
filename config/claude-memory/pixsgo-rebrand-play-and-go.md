---
name: pixsgo-rebrand-play-and-go
description: "pixsgo.com rebranded from retro gaming to \"Play & Go\" Toys & Hobbies; brand name stays Pixs&Go"
metadata: 
  node_type: memory
  type: project
  originSessionId: 15d467b4-c0ee-433c-82de-045a30445d77
---

The pixsgo.com Astro store (in /home/fantastico/Projects/pixsgo) was rebranded from a retro-gaming
niche to **Toys & Hobbies** under the **"Play & Go"** philosophy (USA market). Done 2026-06-25.

**Brand name stays "Pixs&Go"** (matches the domain) — "Play & Go" is the philosophy/tagline, not a rename.

Positioning: safe, **offline / no-wifi** game players (R36S, Miyoo, TrimUI are real catalog items,
reframed as kid-friendly offline game players) + fidget/sensory toys + puzzles & magic cubes + plush +
outdoor play. Audience: Millennial parents & Boomer grandparents gifting kids. Pillars: zero tech setup,
built to last, 1-year US warranty + US support, gift-ready. Voice: warm, plain-English, senior-accessible
(min 16px body, high contrast, Neo-Brutalist). Avoid enthusiast jargon (emulation/ROMs/firmware).

5 category names used site-wide: Offline Game Players, Fidget & Sensory Toys, Puzzles & Magic Cubes,
Plush & Soft Toys, Outdoor & Active Play.

PROGRESS (as of 2026-06-25):
- DONE: full copy rebrand across all pages/components (Layout SEO, Header, Footer, homepage, ~20 pages,
  policies, filters).
- DONE: HOMEPAGE visual redesign to "Warm & Playful" (Lovevery/Yoto) — warm palette tokens in
  src/styles/global.css (cream bg #FBF7F0, warm charcoal text #2B2622, pastel tokens); removed dot-grid +
  hard brutalist shadows + terminal badges; rounded-2xl cards, pill buttons, pastel chips; Footer = peach.
- DONE: width boundary — all non-hero home sections are cream (no full-width colored bands), content
  capped at max-w-1200px; ONLY the hero is full-bleed (per user request "jangan full width kecuali hero").
- DONE: Judge.me tokens fixed (was 401). New tokens in .env: JUDGEME_PRIVATE_API_TOKEN=FKclh5MN1KVcI9Di8bCnOmDW8Z0
  (server reviews) + PUBLIC_JUDGEME_PUBLIC_API_TOKEN=6EajElsOPHXXA3IXQa9NqYrYTzo (widget, hardcoded in
  Layout.astro jdgmSettings). Reviews API verified HTTP 200. Shop domain 2mpt3p-xv.myshopify.com.
- Dev server runs via `astro dev --background --port 4322`.

NEXT / STILL OPEN (resume here):
1. Apply the same warm "Play & Go" visual + width-boundary to the OTHER 19 pages (shop, about, sale, faq,
   contact, sustainability, safety-checklist, 404, collections, products, blogs, policies). They still use
   old dot-grid/Neo-Brutalist styling. Reuse spec: /scratchpad/warm-spec.md pattern.
2. Replace retro hero/category IMAGES (public/images/retro_hero_*.jpg, *_category.jpg) with toy imagery —
   needs real assets from user (can't generate).
3. Shopify Admin (not code): create real collections (only `frontpage` exists), clean mixed catalog
   (toys + leftover pet supplies), rewrite gaming blog articles, then `npm run cache:fetch`.
4. Security: rotate/remove hardcoded secret fallbacks in src (Shopify Admin token shpat_..., storefront
   045fd451..., in shopify.ts/shopify-client.ts/subscribe.ts) — 3 files.
