---
name: mengantar-docs-project
description: Mengantar API integration docs+toolkit repo (ongkipro/mengantar-documentation) — dev-ready
metadata: 
  node_type: memory
  type: project
  originSessionId: 21498f9a-f581-465f-900e-ef575ec4d1dd
---

`~/Documents/mengantar` = git repo **ongkipro/mengantar-documentation** (public): docs + toolkit
integrasi API Mengantar (agregator kurir Indonesia). Awalnya reverse-engineered dari plugin WooCommerce
*Woo Mengantar*; 2026-07-03 dicocokkan penuh dengan **docs resmi `app.mengantar.com/docs`** (static
HTML, fetch via curl bukan WebFetch yang 403).

**Struktur (dirapikan 2026-07-03):** `README.md` · `AGENTS.md` (=`CLAUDE.md` symlink, kontrak agent) ·
`Makefile` (make check/client-check/smoke/all) · `docs/01–10` · `spec/openapi.yaml` (18 endpoint,
OpenAPI 3.1) · `examples/` (client TS no-dep + package.json/tsconfig, lolos `tsc --strict`) ·
`scripts/check-links.sh`+`smoke.sh` (smoke READ-ONLY, --full utk write) · `requests.http` (REST-client) ·
`.env.example` · `.github/workflows/ci.yml` · `CONTRIBUTING.md`/`CHANGELOG.md`/`LICENSE`/`SECURITY.md`.
`docs/03-data-model.md` §0 = objek order API resmi + skema SQL `shipments`; `examples/README.md` punya
Recipes (kurir termurah/terbaik, gating COD via receiver-score, polling resi, pay-unpaid). Spec=18
operationId, README badge CI/OpenAPI/MIT. `make check` & `make client-check` hijau. 26 file total.

**Fakta API kunci (sumber kebenaran = docs/):** key di PATH `/api/public/{KEY}` (server-only) ·
param `COD_AMOUNT` huruf besar · `POST /time` `date`=`mm-dd-yyyy` + slot `9:00–18:00` · courier
estimate default `JNE` · konkurensi batch JT Premium/Ninja/SiCepat → `409` (1 batch/akun) · resi=`cnote_no`,
create `data`=array · saldo kurang→unpaid→`/order/pay-unpaid` · error `X000–X003`. Tanda kepercayaan di
docs: default=docs resmi, `[plugin]`=dari plugin, `[verifikasi]`=belum diuji akun asli.

**Live-verified 2026-07-03 (akun produksi read-only, `make smoke` 5/5):** base URL
`https://api-public.mengantar.com` bekerja; key format `API-…`; estimate `origin_id`/`destination_id`
= `_id` WILAYAH (dari /address/search atau `PICKUP_AUTOFILL` alamat pickup), **bukan** `_id` alamat
pickup (salah pakai → success:false) — bug ini sudah diperbaiki di smoke.sh/07/01/05/06/client. Create
`pickup.address_id` & `/time?address=` pakai `_id` alamat pickup. `courier=all` balikin 14–15 kurir
(incl paxel/pos). JANGAN simpan API key di file. Belum diuji tulis (POST /order dll).

Belum di-commit per 2026-07-03 (user minta commit manual, pakai [[git-identity-noreply]], tanpa
[[no-ai-commit-trailer]]). Base URL sandbox masih dari plugin — perlu konfirmasi tim Mengantar.
