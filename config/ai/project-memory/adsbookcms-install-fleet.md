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
- `~/Projects/permatamall` (+ `-perf`) — install `permatamall.shop`, repo `ongkipro/permatamall`; it and zanobyshop carry a `deploy.yml`, so pushing their `main` deploys production
- `~/Projects/zanobyshop` — install `zanobyshop.shop`, repo `ongkipro/zanobyshop`. Worker is still
  named `cmsads-zanobyshop` (old scheme; renaming it would create a new Worker and drop the
  domain). Joined the product's history on 2026-10-12 (`merge -s ours` at product `d19231b`), so it
  updates by `git merge` like the rest; `scripts/sync-from-product.sh` now merges and re-runs
  `apply-store-palette.py`. Pushing `main` deploys (`deploy.yml`).
- `~/Projects/permatamall` — joined the product's history the same day; same merge-based
  `sync-from-product.sh`, and pushing `main` deploys too.
- `~/Projects/carukesi` — install `carukesi.com`, created 2026-08-20. No store repo yet: its only remote is `product`, push `DISABLED`. Worker `carukesi`, D1 `carukesi-d1`, KV `carukesi-SESSION`, R2 `carukesi-assets`.
- `~/Projects/skincarebpom` — install `skincarebpom.shop` (**not** .com - that name is unregistered; both public resolvers answer NXDOMAIN), created 2026-08-21. Worker `skincarebpom`, D1 `skincarebpom-d1`, KV `skincarebpom-SESSION`, R2 `skincarebpom-assets`.

- `~/Projects/beranda-tani` — install `beranda.click` (Petani Sejahtera theme), repo `ongkipro/beranda-tani`, branch `install/beranda-tani`, Worker `beranda-tani`; deployed manually with `npm run deploy`. Its breadcrumb and footer are install-themed, so product changes there conflict.
- `~/Projects/revenleather` — install `page.revenleather.com`, merges on `main`.

- `~/Projects/klikinaja` — install for `klikinaja.shop`, repo `ongkipro/klikinaja`, branch `install/klikinaja`, Worker `klikinaja`, D1 `klikinaja-d1`, KV `klikinaja-SESSION`, R2 `klikinaja-assets`; created 2026-10-13 from product 1.5.4 with shared history. The domain was not registered at creation (RDAP 404), so it runs on `klikinaja.ongki.workers.dev` until attached. Its `/install` token is `KLIKINAJA_INSTALL_TOKEN` in secrets-env.

That is nine installs. Roll a release out to every one of them; list
`~/Projects/*/wrangler.jsonc` rather than trusting a remembered count.

In every install clone `origin` is the store and `product` is
`ongkipro/adsbookcms` with its push URL set to `DISABLED` — pushing an install's
real `wrangler.jsonc` to the product would hand the next clone somebody's live
infrastructure. Install work lives on an `install/<store>` branch.

`npm run fleet:status -- <install-dir>...` in the product prints every install's version,
sync, distance behind the product, last deploy and schema (A-51).

Fleet state, findings and decisions are owned by
`HANDOVER-2026-08-19-install-fleet-audit.md` on `install/zvarashop`, not by this
file. See [[prefer-git-worktree]] and [[no-ai-commit-trailer]].
