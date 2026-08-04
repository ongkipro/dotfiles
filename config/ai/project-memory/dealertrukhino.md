---
name: dealertrukhino
description: "dealertrukhino.com is a deliberate sister site to dealerhinoofficial.com — differentiated by search intent, not cosmetics; never re-copy the sister site's content modules."
metadata: 
  node_type: memory
  type: project
  originSessionId: 5680614a-78e0-4848-841a-b484494bceed
  modified: 2026-07-30T14:29:26.952Z
---

`~/Projects/dealertrukhino` (repo `ongkipro/dealertrukhino`) is a sister site to
`~/Projects/dealerhinoofficial` (repo `ongkipro/dealerhinoofficial`, live since before 2026-07-30).
Both sell Hino trucks for the same salesperson, so they are one business in Google's eyes unless
kept structurally apart.

**Positioning split, decided 2026-07-30 (do not blur it):**
- `dealerhinoofficial.com` = geo intent — "dealer hino [kota]", ~190 city pages. Leave as is.
- `dealertrukhino.com` = product/spec intent — "harga/spesifikasi [model]", per-variant pages
  built from `src/data/specs/**` (46 variants), plus a comparison table.

**Never port these back in.** `location-pages.ts`, `service-pages.ts`, `testimonials.ts`, and
`gallery.ts` were verbatim copies of the sister site and were deleted on purpose. Also off-limits
(the sister site's identity): per-city location pages, the sales-person brand page, the karoseri
icon showcase, the four-pillar after-sales taxonomy, testimonials, gallery, and its homepage FAQ.
Location coverage here is **province-level only** (`/jangkauan/[provinsi]`, 33 pages) — matching
the sister site's city-level granularity on identical dealer data is the biggest duplication risk
available to this project.

Visual identity is also deliberately opposed: trukhino is dark industrial + amber, Geist,
tight radii; the sister site is light + Hino red, Inter + Plus Jakarta Sans.

**Identity is separated (resolved 2026-07-30):** sales is **Adi Wicaksana**, phone/WA
**0812-3150-2345**, `sales@dealertrukhino.com`. The sister site uses Elgin Marchlouis and different
numbers. Social links stay empty until this brand owns its own accounts.

`npm run check` (specs parser + build + whole-site validator) must pass before pushing —
**push to `main` auto-deploys to production** via Cloudflare Pages, with no staging step.
Full technical reference lives in `DEVELOPMENT.md` in the repo; prefer it over this memory.

Code progress lives in the repo, not here. See also [[prefer-git-worktree]],
[[additive-commits-no-history-rewrite]].
