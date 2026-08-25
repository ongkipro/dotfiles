---
name: adsbookcms-zanobyshop-sync
description: "Standing arrangement between the AdsBookCMS product and the zanobyshop install — product updates go down, store findings go up."
metadata:
  node_type: memory
  type: feedback
  originSessionId: 800b55de-06ff-4f0f-88f4-a9aa8cbf05cc
  modified: 2026-08-22T15:44:01.815Z
---

Product updates flow **down** into `zanobyshop`; important findings from running
it flow **up** to whoever is working on `adsbookcms`, as an issue rather than a
silent local fix.

**Why:** two terminals work these repos at once. Without the arrangement the
store drifts from the product, and a defect found only under real data — live
landing pages, real catalogue images, a real database — never reaches the repo
that could fix it for every install.

**How to apply:**

- Down: `bash scripts/sync-from-product.sh` in `~/Projects/zanobyshop`, then
  `npm run build`, `wrangler d1 migrations apply <db> --remote`, `wrangler deploy`.
  The store shares no git history with the product, so a sync **replaces** the
  tree; `wrangler.jsonc`, `design-tokens.md`, `public/` and the store's own
  scripts are what it keeps.
- The product is monochrome deliberately — it installs for any merchant.
  zanobyshop's deep blue lives in `scripts/apply-store-palette.py`, which the
  sync re-runs. Without it a sync reverts the store to black and white.
- Up: open an issue on `ongkipro/adsbookcms` describing what the live store
  showed. Do not patch the product from inside the install.

See [[adsbookcms-install-fleet]].
