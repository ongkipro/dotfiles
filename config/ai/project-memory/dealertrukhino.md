---
name: dealertrukhino
description: "dealertrukhino.com — live product-intent Hino catalogue, deliberately separated from dealerhinoofficial's geographic intent"
metadata:
  node_type: memory
  type: project
  originSessionId: c3f8226f-2597-439c-858d-b7cd1ef35d53
  modified: 2026-08-05
---

`~/Projects/dealertrukhino` (private repo `ongkipro/dealertrukhino`) is a static
Astro catalogue and a deliberate sister site to [[dealerhinoofficial]]. Both serve
the same business, so their search intent, content modules, identity, and visual
language must remain distinct.

**Positioning split — do not blur it:**

- `dealerhinoofficial.com` owns geographic intent such as "dealer hino [kota]".
- `dealertrukhino.com` owns product/spec intent such as "harga/spesifikasi [model]",
  per-variant specifications, comparisons, and buyer education.

Do not port the sister site's city pages, sales-person brand page, karoseri showcase,
after-sales taxonomy, testimonials, gallery, or homepage FAQ **verbatim** into this
project. Earlier duplicate data modules were removed for that reason. The repository
later added brand-specific testimonials and gallery content; that is compatible with
the boundary as long as the material remains original. Coverage must stay at province
level rather than reproducing the sister site's city-level footprint.

**Local state on this Mac (2026-08-05):** clone removed from `~/Projects` for clean workspace.
Pull again from `ongkipro/dealertrukhino` when needed.

The identity split is deliberate: this site uses Adi Wicaksana,
`0812-3150-2345`, and `sales@dealertrukhino.com`; the sister site uses a different
sales identity and contact details. Social links stay empty until this brand owns
its own accounts. The visual direction is dark industrial with amber, Geist, and
tight radii; the sister site is light, Hino red, Inter, and Plus Jakarta Sans.

**Production state, re-verified 2026-08-05:** the domain was registered on
2026-07-31, uses Cloudflare nameservers, resolves through Cloudflare, and returns
HTTP 200 at `https://dealertrukhino.com/`. The canonical `site` value in
`astro.config.mjs` is therefore correct.

The repository's current `DEVELOPMENT.md` says pushes to `main` deploy through
Cloudflare Pages with no staging step. Run `npm run check` before pushing; it covers
the specs parser, production build, and whole-site validation. Re-fetch the remote
immediately before committing because another device also contributes.

Do not infer current page counts, deployment history, or Cloudflare project mode
from this memory. Read the repository and account state. See
[[cloudflare-pages-direct-upload-lock]], [[prefer-git-worktree]], and
[[additive-commits-no-history-rewrite]].
