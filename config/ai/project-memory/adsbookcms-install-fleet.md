---
name: adsbookcms-install-fleet
description: AdsBookCMS is one product with several store installs; which local directory is which, and where the fleet's truth lives.
metadata:
  type: project
---

`ongkipro/adsbookcms` is the **product** and deploys nothing. Each store is an
install: `wrangler deploy` uploads from a working directory, so git is never in
the deploy path (`INSTALLATION.md` §10).

Local directories, all clones of the product, none obvious from its name:

- `~/Projects/adsbookcms` — the product itself
- `~/Projects/zvarashop` — install `zvara.shop`, repo `ongkipro/zvarashop`
- `~/Projects/taniniaga` — install `taniniaga.shop`, repo `ongkipro/taniniaga`
- `~/Projects/permatamall` (+ `-perf`) — install `permatamall.shop`, repo `ongkipro/permatamall`, and the only one with a `deploy.yml`, so pushing there deploys production
- `~/Projects/zanobyshop` — install `zanobyshop.shop`, repo `ongkipro/zanobyshop`. Worker is still
  named `cmsads-zanobyshop` (old scheme; renaming it would create a new Worker and drop the
  domain). It shares **no git history** with the product, so bringing it forward means replacing
  the tree, not merging: take `src/`, `scripts/`, `docs/` and root files from the product, keep
  its own `wrangler.jsonc` and `public/`. Its catalogue images live in `public/images/**` and are
  referenced from D1, which is why the product's brand-contamination test fails in this install.
- `~/Projects/carukesi` — install `carukesi.com`, created 2026-08-20. No store repo yet: its only remote is `product`, push `DISABLED`. Worker `carukesi`, D1 `carukesi-d1`, KV `carukesi-SESSION`, R2 `carukesi-assets`.
- `~/Projects/skincarebpom` — install `skincarebpom.shop` (**not** .com - that name is unregistered; both public resolvers answer NXDOMAIN), created 2026-08-21. Worker `skincarebpom`, D1 `skincarebpom-d1`, KV `skincarebpom-SESSION`, R2 `skincarebpom-assets`.

In every install clone `origin` is the store and `product` is
`ongkipro/adsbookcms` with its push URL set to `DISABLED` — pushing an install's
real `wrangler.jsonc` to the product would hand the next clone somebody's live
infrastructure. Install work lives on an `install/<store>` branch.

Fleet state, findings and decisions are owned by
`HANDOVER-2026-08-19-install-fleet-audit.md` on `install/zvarashop`, not by this
file. See [[prefer-git-worktree]] and [[no-ai-commit-trailer]].
