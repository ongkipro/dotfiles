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

- Down: `bash scripts/sync-from-product.sh` in `~/Projects/zanobyshop` — since
  2026-10-12 an ordinary `git merge product/main` (history joined at product
  `d19231b`) followed by the palette script; then check/test/build, commit, and
  push `main`, which deploys. The old tree replace is retired: it would discard
  the store's own changes the merge base now accounts for.
- The product is monochrome deliberately — it installs for any merchant.
  zanobyshop's deep blue lives in `scripts/apply-store-palette.py`, which the
  sync re-runs. Without it a sync reverts the store to black and white.
- Up: open an issue on `ongkipro/adsbookcms` describing what the live store
  showed. Do not patch the product from inside the install.

See [[adsbookcms-install-fleet]].
