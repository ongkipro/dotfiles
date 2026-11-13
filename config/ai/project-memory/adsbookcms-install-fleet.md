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

- `~/Projects/adsbook.id/development` (symlink `~/Projects/adsbookcms`) — the product itself; its docs are in `~/Projects/adsbook.id/docs/`
- `~/Projects/zvarashop` — install `zvara.shop`, repo `ongkipro/zvarashop`
- `~/Projects/taniniaga` — install `taniniaga.shop`, repo `ongkipro/taniniaga`
- `~/Projects/permatamall` (+ `-perf`) — install `permatamall.shop`, repo `ongkipro/permatamall`. Since `5499583` it has no `deploy.yml`: pushing `main` deploys nothing, deploy is `npm run deploy` by hand. Its stale static `public/robots.txt` was removed in 1.8.2. Its footer adds a `Meta Ads & Privasi` → `/meta-ads` link (Meta App Basic Settings needs it): keep it when a product merge rewrites `SiteFooter.astro`. zanobyshop still carries a `deploy.yml`
- **zanobyshop — decommissioned 2026-11-01 (Paduka: not used).** Verified gone: Worker `cmsads-zanobyshop` (10007), D1 `cmsads-zanobyshop-d1`, KV `cmsads-zanobyshop-session`, repo `ongkipro/zanobyshop`, `~/Projects/zanobyshop`. R2 `cmsads-zanobyshop-assets` has an expire-all lifecycle rule (1 day) — delete the empty bucket from 2026-11-02 (`npx wrangler r2 bucket delete cmsads-zanobyshop-assets`). Backup: `/data/backups/zanobyshop-2026-11-01/` (repo bundle, D1 SQL, README). Do not re-check anything else.
- `~/Projects/permatamall` — joined the product's history the same day; same merge-based
  `sync-from-product.sh`; pushing `main` no longer deploys (see above).
- **carukesi — decommissioned, no longer related to the fleet (Paduka, 2026-11-01).** Verified gone 2026-11-01: no local `~/Projects/carukesi`, Worker `carukesi` answers "does not exist" (10007), no D1/KV/R2 named carukesi, no store repo. Do not re-check or list it as an install.
- `~/Projects/skincarebpom` — install `skincarebpom.shop` (**not** .com - that name is unregistered; both public resolvers answer NXDOMAIN), created 2026-08-21. Worker `skincarebpom`, D1 `skincarebpom-d1`, KV `skincarebpom-SESSION`, R2 `skincarebpom-assets`.

- `~/Projects/beranda-tani` — install `petanisejahtera.com` — main domain; the Worker also serves petanisawit.com and beranda.click (Petani Sejahtera theme), repo `ongkipro/beranda-tani`, branch `install/beranda-tani`, Worker `beranda-tani`; deployed manually with `npm run deploy`. Its breadcrumb and footer are install-themed, so product changes there conflict.
- `~/Projects/revenleather` — install `page.revenleather.com`, repo `ongkipro/revenleather`, merges on `main`,
  Worker `revenleather`, D1 `revenleather-d1`, R2 `revenleather-assets`; deployed manually with `npm run deploy`
  (only `ci.yml`, no deploy workflow). It is the Indonesian ads/COD funnel only: the brand's main shop is
  Shopify on `revenleather.com` / `revenleather.id` (repo `~/Projects/revenleather.com`, never touch it from
  install work), which owns search for the same catalog, so the install sets `PUBLIC_SITE_NOINDEX=true`
  (product 1.7.7) and `PUBLIC_SITE_BRAND_MARK` (1.7.5) for its lion mark.

- `~/Projects/klikinaja` — install for `klikinaja.shop`, repo `ongkipro/klikinaja`, branch `install/klikinaja`, Worker `klikinaja`, D1 `klikinaja-d1`, KV `klikinaja-SESSION`, R2 `klikinaja-assets`; created 2026-10-13 from product 1.5.4 with shared history. The domain was not registered at creation (RDAP 404), so it runs on `klikinaja.ongki.workers.dev` until attached. Its `/install` token is `KLIKINAJA_INSTALL_TOKEN` in secrets-env.
- `~/Projects/agritani-shop` — install for `agritani.shop`, repo `ongkipro/agritani-shop`, branch `install/agritani-shop`, Worker `agritani-shop`, D1 `agritani-shop-d1`, KV `agritani-shop-session`, R2 `agritani-shop-assets`.
- `~/Projects/numaskin-adbook` — install for `page.numaskin.id`, repo `ongkipro/numaskin-adbook`, merges on `main`, Worker `numaskin-adbook`, D1 `numaskin-adbook-d1`, KV `numaskin-adbook-session`, R2 `numaskin-adbook-assets`. Its storefront is install-owned: on a product merge keep its own `SiteHeader`, `SiteFooter`, `CompactMarketHome`, `home/*` and `PageIntro` (`git checkout --ours`), and port only data/SEO changes (e.g. the 1.8.2 Product JSON-LD builder) by hand. Other sessions push LP work to its `main` often: fetch and fast-forward before `npm run deploy` (preflight refuses a stale tree).
- `~/Projects/bavenshop` — install for `baven.shop`, repo `ongkipro/bavenshop`, branch `install/bavenshop`, Worker `bavenshop`, D1 `bavenshop-d1`, KV `bavenshop-session`, R2 `bavenshop-assets`; created 2026-10-24 from product 1.7.12.
- `~/Projects/halotanishop` — install for `halotani.shop`, repo `ongkipro/halotanishop`, branch `install/halotanishop`, Worker `halotanishop`, D1 `halotanishop-d1`, KV `halotanishop-session`, R2 `halotanishop-assets`; created 2026-10-24 from product 1.7.12.

That is twelve installs (carukesi and zanobyshop decommissioned 2026-11-01). Roll a release out to every one of them; list
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
For installs without shared history (permatamall; zanobyshop until it was decommissioned): product-owned files come from the product whole; keep only store-added files, register files, public/, wrangler.jsonc, README/RELEASE. Run regenerators before the final git add and assert git diff --quiet before write-tree.

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

Visibility (Paduka, 2026-11-01): the product and all linked store repos are **public** (zvarashop, permatamall, agritani-shop, taniniaga, halotanishop, bavenshop, numaskin-adbook, revenleather, beranda-tani, klikinaja, skincarebpom, cekat-shop; zanobyshop was public until its deletion), after a full-history scan found no secret or customer data (only test fixtures and base64 inside payment SVGs). `ongkipro/agritani` (agritani.com, not an AdsBookCMS install) stays private. Never commit a real token, `.dev.vars` or customer export to these repos.

## Cron and tracking-audit facts (verified 2026-11-01)

- The Cloudflare account takes more than five cron triggers: twelve installs register `7 * * * *`. skincarebpom's trigger was restored with `wrangler triggers deploy` (temp config needs `assets.directory`), and the install commit is `3247a23`. Never comment the trigger out to free a slot.
- CAPI delivery: an outbox row is written, then sent at once, retried by storefront traffic and by the hourly cron. Since PR #129 the cron drains up to three batches (`drainCapiOutboxBacklog`); this is unreleased until the next version. Requeueing failed rows stays manual. Queues are not used (they need the Paid plan).
- In a headless browser audit of the Pixel, a HeadlessChrome UA or `navigator.webdriver` silences fbevents. Use a mobile Chrome UA, mask webdriver, and parse the multipart `/tr/` beacon body. Otherwise the audit shows false negatives.
