---
name: pesantren
description: "pesantren.shop COD funnel, clean duplicate of petanisejahtera; repo ongkipro/pesantren; AWS-orange design tokens live in the repo."
metadata:
  node_type: memory
  type: project
  originSessionId: 8eaa81d9-7e70-4b38-ba51-92a82cbfcdd1
  modified: 2026-08-05
---

`pesantren.shop` is a general COD mini-store and landing-page system,
created from the architecture of [[petanisejahtera]] with fresh Git history.

- Canonical repository: `ongkipro/pesantren` (private), verified on branch
  `main` tracking `origin/main`.
- The local clone on this Mac was removed on 2026-08-05 during workspace cleanup; clone it again when needed.
- Stack: Astro 6, Tailwind CSS 4, Cloudflare Workers, and Scalev-backed order
  flows.
- The product scope is storefront, product pages, and landing pages; the
  article system was deliberately removed.
- `design-tokens.md` is the design source of truth. Orange `#FF9900` is a
  CTA-fill token, not text color. Use `design-taste` in Funnel mode.
- `LP_PATTERN.md` owns the landing-page contract. Landing-page generation
  must not change shared form, geo, or API behavior.
- Do not fabricate reviews, ratings, stock, medical outcomes, or customer
  evidence. Health-product pages retain the “bukan alat medis” boundary.
- Pushes to `main` may trigger production deployment through another
  collaborator's Cloudflare account. Treat push as a live action requiring
  approval.
- Current deploy blockers, catalog state, asset work, and credential status
  belong in the repository's `TASKS.md`; read it before implementation.
- Local `.env` and `.dev.vars` exist. Detect them without reading or copying
  their contents.
