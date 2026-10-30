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
- `~/Projects/revenleather` — install `page.revenleather.com`, repo `ongkipro/revenleather` (private), merges on `main`,
  Worker `revenleather`, D1 `revenleather-d1`, R2 `revenleather-assets`; deployed manually with `npm run deploy`
  (only `ci.yml`, no deploy workflow). It is the Indonesian ads/COD funnel only: the brand's main shop is
  Shopify on `revenleather.com` / `revenleather.id` (repo `~/Projects/revenleather.com`, never touch it from
  install work), which owns search for the same catalog, so the install sets `PUBLIC_SITE_NOINDEX=true`
  (product 1.7.7) and `PUBLIC_SITE_BRAND_MARK` (1.7.5) for its lion mark.

- `~/Projects/klikinaja` — install for `klikinaja.shop`, repo `ongkipro/klikinaja`, branch `install/klikinaja`, Worker `klikinaja`, D1 `klikinaja-d1`, KV `klikinaja-SESSION`, R2 `klikinaja-assets`; created 2026-10-13 from product 1.5.4 with shared history. The domain was not registered at creation (RDAP 404), so it runs on `klikinaja.ongki.workers.dev` until attached. Its `/install` token is `KLIKINAJA_INSTALL_TOKEN` in secrets-env.
- `~/Projects/agritani-shop` — install for `agritani.shop`, repo `ongkipro/agritani-shop`, branch `install/agritani-shop`, Worker `agritani-shop`, D1 `agritani-shop-d1`, KV `agritani-shop-session`, R2 `agritani-shop-assets`.
- `~/Projects/numaskin-adbook` — install for `page.numaskin.id`, repo `ongkipro/numaskin-adbook`, merges on `main`, Worker `numaskin-adbook`, D1 `numaskin-adbook-d1`, KV `numaskin-adbook-session`, R2 `numaskin-adbook-assets`.
- `~/Projects/bavenshop` — install for `baven.shop`, repo `ongkipro/bavenshop`, branch `install/bavenshop`, Worker `bavenshop`, D1 `bavenshop-d1`, KV `bavenshop-session`, R2 `bavenshop-assets`; created 2026-10-24 from product 1.7.12.
- `~/Projects/halotanishop` — install for `halotani.shop`, repo `ongkipro/halotanishop`, branch `install/halotanishop`, Worker `halotanishop`, D1 `halotanishop-d1`, KV `halotanishop-session`, R2 `halotanishop-assets`; created 2026-10-24 from product 1.7.12.

That is thirteen installs. Roll a release out to every one of them; list
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


---


## Lesson: Syncing a no-shared-history install: product-whole tree, not hunk merges

### Symptom
Hunk-level three-way merge of permatamall onto product 1.5.0 produced duplicate functions/identifiers (28 failing tests); a commit-tree sync of zanobyshop failed CI's route-map drift test though local tests passed.

### Root cause
The store had upstreamed features the product later rewrote, so both sides added the same code at different positions and merged cleanly into duplicates. git write-tree reads the index, and the regenerated route map was written after the last git add.

### Durable invariant
For installs without shared history (zanobyshop, permatamall): product-owned files come from the product whole; keep only store-added files, register files, public/, wrangler.jsonc, README/RELEASE. Run regenerators before the final git add and assert git diff --quiet before write-tree.

### Fix
Rebuilt the permatamall tree from product/main plus store-only files; moved the landing pages' divergent toast to an install-owned component; regenerated and committed the route map for zanobyshop.

### Regression check
npm test / npm run check / npm run build in the final checkout with git status clean before pushing a branch that auto-deploys.

> Promoted from a reviewed local candidate on 2026-10-29.


---


## Lesson: Install deploy from a checkout missing D1-applied store migrations serves 503

### Symptom
After a routine product merge and npm run deploy, zvara.shop answered 503 'Database toko belum siap' on every DB-backed route; fleet:status showed schema 74/69 (applied/expected) both before and after.

### Root cause
Store migrations 0069-0073 were applied to production D1 and deployed on 2026-10-14 from a working tree on another device, never committed or pushed. A build from the pushed branch bundles only 69 migrations; the runtime schema guard refuses an ahead history with a labelled 503. preflight:deploy checks the tree against its upstream, not the D1 ledger against the bundle.

### Durable invariant
Every migration recorded in an install's production d1_migrations must exist in the checkout being deployed; applied > expected in fleet:status means do not deploy from this tree.

### Fix
wrangler rollback to the previous version id restored service in under a minute; the missing migration files must come from the device that applied them before that install can take a new release.

### Regression check
npm run fleet:status -- <install>: schema column applied must equal expected before npm run deploy; after deploy curl / and /produk return 200.

> Promoted from a reviewed local candidate on 2026-10-29.
