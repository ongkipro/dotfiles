# Shopify AI Development Repository Map

> Disusun: 2026-06-27 · Sumber: **enumerasi penuh 1202 repo publik** org Shopify via `gh api orgs/Shopify/repos` (13 halaman) + baca README selektif. Tidak ada repo yang di-clone.
> Untuk: workflow AI terminal (Claude Code / pi / codex) milik fantastico.
> Cakupan: seluruh 1202 repo dipindai (nama+deskripsi+bahasa+arsip), lalu disaring ~189 kandidat relevan, dikurasi jadi daftar di bawah.

## Purpose

Dokumen ini adalah **peta keputusan**: saat AI terminal mengerjakan task Shopify (theme, Liquid, app, extension, function, Hydrogen), file ini menjawab *"repo resmi mana yang harus jadi rujukan, dan apakah perlu di-clone atau cukup reference link?"*

Prinsip:
- **Reference link** = baca via web/`gh api` saat butuh, jangan simpan lokal.
- **Clone (read-only, sekali)** = hanya untuk repo yang sering jadi base/contoh kode nyata (Dawn, Skeleton, app templates) — clone ke folder *reference* terpisah, bukan ke project.
- Some needs may be covered by Shopify skills or MCP capabilities from an external plugin. Check current runtime discovery first; this document does not prove that any particular skill or MCP is installed.

---

## Quick Decision Matrix

| Need | Use these repos | Why | Clone? |
|------|-----------------|-----|--------|
| Bikin/edit theme dari nol | `skeleton-theme`, `dawn` | Skeleton = starter minimal terbaru; Dawn = reference lengkap OS 2.0 | Clone (base) |
| Pola section/snippet/JSON template nyata | `dawn`, `reference-theme` | Contoh production-grade & dokumentasi pola | Clone Dawn / ref link |
| Lint & validasi theme | `theme-tools` (berisi theme-check) | Linter + LSP + prettier resmi (monorepo aktif) | Reference link |
| Spesifikasi Liquid objek/filter/tag | `theme-liquid-docs`, MCP `shopify-dev` | Sumb. mesin-readable utk Liquid docs | Reference link |
| Liquid support di Claude Code | `liquid-skills` | Plugin marketplace resmi (LSP + skills) utk Claude Code | Install plugin |
| Bikin app | `shopify-app-template-remix` (atau `-react-router`) | Template app resmi & paling aktif | Clone (scaffold) |
| Library auth/webhook/GraphQL app (Node) | `shopify-app-js`, `shopify-api-js` | SDK app & Admin API utk Node/TS | Reference link |
| Shopify Function (diskon, validasi cart) | `function-examples`, `shopify-function-javascript`/`-rust` | Contoh & SDK Functions resmi | Reference link |
| UI / Checkout / Admin / POS extension | `ui-extensions`, `function-examples`, `example-checkout--*` | Definisi API extension + contoh nyata | Reference link |
| Hydrogen / headless storefront | `hydrogen`, `hydrogen-demo-store` | Framework + full demo store | Reference / clone demo |
| Storefront tanpa Hydrogen | `storefront-api-examples`, `js-buy-sdk` | Contoh Storefront API mentah | Reference link |
| UI admin app (Polaris) | use current Shopify documentation or a relevant skill actually discovered by the runtime | `polaris-react` sudah **deprecated** | Jangan clone |
| Lint/format/validate theme | `theme-tools` (theme-check, LSP, prettier) | DX theme resmi (monorepo aktif) | Reference link |
| Belajar / contoh kode | `function-examples`, `example-app--qr-code--remix`, `storefront-api-learning-kit`, `graphql-design-tutorial` | Pola konkret tanpa harus clone semua | Reference link |
| CLI (alat utama) | `cli` (TS) | CLI resmi modern (`@shopify/cli`) | Install via npm |

---

## Must-have References

Enam titik rujukan inti — selebihnya turunan:

1. **`Shopify/horizon`** — theme flagship generasi baru dengan **theme blocks** (arsitektur terbaru). Rujukan utama untuk theme modern.
2. **`Shopify/dawn`** — reference theme OS 2.0, masih sumber pola section/snippet/schema paling matang.
3. **`Shopify/skeleton-theme`** — starter theme minimal & modular (titik mulai bersih).
4. **`Shopify/theme-tools`** — theme-check + LSP + prettier-plugin-liquid (DX theme resmi).
5. **`Shopify/theme-liquid-docs`** — dokumentasi Liquid mesin-readable.
6. **`Shopify/shopify-app-template-remix`** — base app resmi.

Plus jalur AI/non-repo yang sering paling cepat:
- **`Shopify/Shopify-AI-Toolkit`** — plugin Shopify Dev MCP resmi untuk Claude Code/Cursor/Gemini (docs + schema + validasi anti-halusinasi). **Ini sumber MCP `shopify-dev`.**
- Use Shopify skills or the `shopify-dev` MCP only when current runtime discovery exposes that capability; otherwise read the official documentation directly.

---

## Shopify Theme Development

| Repo | URL | Fungsi | Kapan dirujuk | Clone? | Prioritas |
|------|-----|--------|---------------|--------|-----------|
| horizon | https://github.com/Shopify/horizon | Theme flagship generasi baru, pakai **theme blocks** (arsitektur Liquid terbaru) | Theme modern baru; pelajari pola theme blocks & section grouping terkini | Clone (read-only base) | must-have |
| dawn | https://github.com/Shopify/dawn | Reference theme OS 2.0 (Liquid) | Cari pola section, snippet, JSON template, accessibility, performance | Clone (read-only base) | must-have |
| skeleton-theme | https://github.com/Shopify/skeleton-theme | Starter theme minimal, modular, best-practice terbaru | Mulai theme baru yang ramping | Clone (scaffold) | must-have |
| reference-theme | https://github.com/Shopify/reference-theme | Developer reference theme | Pelengkap Dawn, lihat pola alternatif | Reference link | useful |
| theme-scripts | https://github.com/Shopify/theme-scripts | Utility JS khusus theme (a11y, currency, dll) | Butuh util JS theme siap pakai | Reference link | optional |
| theme-extension-getting-started | https://github.com/Shopify/theme-extension-getting-started | Boilerplate theme app extension | Bikin app block utk Online Store | Reference link | useful |

> **Horizon vs Dawn:** Horizon = generasi terbaru (theme blocks, default store baru). Dawn = masih reference paling matang & banyak dipakai. Untuk theme baru: mulai dari Horizon/Skeleton; untuk cari pola yang sudah terbukti: Dawn.

**Hindari/deprecated:** `slate`, `starter-theme` (Slate), `Timber`, `shopify_theme`, `themekit` (Go CLI lama), `node-themekit` → semua arsip/legacy. Gunakan `cli` modern + Dawn/Skeleton.

---

## Liquid and Theme Tooling

| Repo | URL | Fungsi | Kapan dirujuk | Clone? | Prioritas |
|------|-----|--------|---------------|--------|-----------|
| theme-tools | https://github.com/Shopify/theme-tools | Monorepo DX theme: theme-check (linter), Liquid LSP, `prettier-plugin-liquid`, LiquidHTML parser | Setup lint/format/validate; pahami aturan theme-check | Reference link | must-have |
| theme-liquid-docs | https://github.com/Shopify/theme-liquid-docs | Sumber dokumentasi Liquid (objek, filter, tag) mesin-readable | Verifikasi signature filter/objek Liquid | Reference link | must-have |
| liquid | https://github.com/Shopify/liquid | Engine Liquid asli (Ruby) | Pahami semantik inti Liquid / edge case | Reference link | useful |
| liquid-skills | https://github.com/Shopify/liquid-skills | **Plugin marketplace Claude Code**: `liquid-lsp` + 3 skill Liquid | Tambah dukungan Liquid native di Claude Code | Install plugin | must-have (utk AI terminal) |
| prettier-plugin-liquid | https://github.com/Shopify/prettier-plugin-liquid | Formatter Liquid/HTML (kini di-vendor ke theme-tools) | Konfigurasi format Liquid | Reference link | useful |
| liquid-tm-grammar | https://github.com/Shopify/liquid-tm-grammar | Grammar syntax highlighting resmi | Setup highlight editor | Reference link | optional |
| theme-check-vscode | https://github.com/Shopify/theme-check-vscode | Ekstensi VS Code Liquid resmi | Hanya kalau pakai VS Code (user pakai helix → skip) | Reference link | optional |
| liquid-c | https://github.com/Shopify/liquid-c | Ekstensi performa Liquid (C) | Internal/performance, jarang relevan | Reference link | optional |

> Catatan: **`theme-check` (repo Ruby) sudah ARCHIVED** — fungsinya pindah ke `theme-tools` (TS). Selalu rujuk `theme-tools`.

---

## Dawn-Based Theme Development Workflow

Alur yang disarankan untuk AI terminal saat develop theme (Horizon/Dawn-based):

1. **Mulai**: scaffold via `shopify theme init` (pakai `cli`) → atau clone `horizon`/`skeleton-theme`/`dawn` ke folder reference. Theme baru: mulai dari **Horizon** (theme blocks) atau **Skeleton**.
2. **Pola kode**: saat butuh contoh section/snippet/`{% schema %}`/JSON template → buka padanannya di **Dawn** (pola matang) atau **Horizon** (pola theme-blocks terbaru), read-only.
3. **Liquid correctness**: check filters and objects in **theme-liquid-docs**, or use the `shopify-dev` MCP / a Liquid skill only when runtime discovery exposes it.
4. **Custom data**: for metafields and metaobjects, use the official documentation or a custom-data skill only when runtime discovery exposes it.
5. **Validasi**: jalankan **theme-check** (dari `theme-tools`) via `shopify theme check`; format dengan `prettier-plugin-liquid`.
6. **Preview**: `shopify theme dev` → buka Chromium ke localhost (sesuai working agreement).
7. **AI assist**: pasang `liquid-skills` plugin agar Claude Code punya LSP + skill Liquid native.

**Repo wajib jadi reference utk theme-workflow:** `horizon` (pola theme-blocks terbaru) + `dawn` (pola matang), `skeleton-theme` (base), `theme-tools` (lint), `theme-liquid-docs` (spec).

---

## Shopify App Development

| Repo | URL | Fungsi | Kapan dirujuk | Clone? | Prioritas |
|------|-----|--------|---------------|--------|-----------|
| shopify-app-template-remix | https://github.com/Shopify/shopify-app-template-remix | Template app resmi (Remix/TS) — default scaffold | Bikin app embedded baru | Clone (scaffold) | must-have |
| shopify-app-template-react-router | https://github.com/Shopify/shopify-app-template-react-router | Template app berbasis React Router 7+ | Alternatif modern dari Remix | Clone (scaffold) | useful |
| shopify-app-js | https://github.com/Shopify/shopify-app-js | Library app Node: auth, session, webhook, OAuth | Implementasi backend app Node/TS | Reference link | must-have |
| shopify-api-js | https://github.com/Shopify/shopify-api-js | Admin API client (Node/TS): REST + GraphQL | Query/mutation Admin API dari Node | Reference link | must-have |
| cli | https://github.com/Shopify/cli | Shopify CLI resmi (`@shopify/cli`) utk app/theme/hydrogen | Hampir semua workflow dev | Install via npm | must-have |
| shopify-app-bridge | https://github.com/Shopify/shopify-app-bridge | App Bridge: jembatan app embedded ↔ Shopify admin | Bikin app embedded (navigasi, modal, toast, resource picker) | Reference link | must-have |
| shopify-app-examples | https://github.com/Shopify/shopify-app-examples | Kumpulan contoh app resmi end-to-end | Lihat pola app nyata di luar template | Reference link | useful |
| example-app--qr-code--remix | https://github.com/Shopify/example-app--qr-code--remix | App QR-code lengkap (Remix) — contoh kanonik | Belajar struktur app Remix utuh | Reference link | useful |
| graphql-codegen | https://github.com/Shopify/graphql-codegen | Preset codegen utk tipe TypeScript dari query GraphQL | Setup typed Admin/Storefront query | Reference link | useful |
| shopify-api-php / shopify-app-php / shopify-app-python | (lihat Repo Index) | SDK/Package app per-bahasa (PHP, Python) | Stack non-Node | Reference link | optional |
| shopify_app | https://github.com/Shopify/shopify_app | Rails Engine utk app Ruby | Hanya kalau stack Ruby/Rails | Reference link | optional |
| shopify-api-ruby | https://github.com/Shopify/shopify-api-ruby | Admin API client Ruby | Stack Ruby | Reference link | optional |
| shopify-app-template-php / -ruby / -none / -extension-only | (lihat Repo Index) | Template alternatif per-stack | Sesuai stack/keperluan | Clone bila dipakai | optional |
| shopify_python_api | https://github.com/Shopify/shopify_python_api | Admin API client Python | Skrip/automasi Python | Reference link | optional |

> **Deprecated/arsip:** `shopify-cli` (Ruby) & `shopify-app-template-node` masih ada tapi jalur modern = `cli` (TS) + template Remix/React-Router.

---

## Extensions and Functions

| Repo | URL | Fungsi | Kapan dirujuk | Clone? | Prioritas |
|------|-----|--------|---------------|--------|-----------|
| ui-extensions | https://github.com/Shopify/ui-extensions | Definisi publik API semua UI extension (checkout, admin, customer-account, POS) | Pahami API/target extension | Reference link | must-have |
| function-examples | https://github.com/Shopify/function-examples | Contoh Shopify Functions (diskon, validasi cart, delivery, payment) | Bikin/ubah Function | Reference link | must-have |
| extensions-templates | https://github.com/Shopify/extensions-templates | Template yang dipakai `@shopify/app` CLI saat generate extension | Pahami struktur scaffold extension/function | Reference link | useful |
| discounts-reference-app | https://github.com/Shopify/discounts-reference-app | Reference app Discount Functions (read-only, maintained Shopify) | Pola implementasi diskon production | Reference link | useful |
| discount-app-components | https://github.com/Shopify/discount-app-components | Komponen React khusus app diskon | Bangun UI app diskon | Reference link | optional |
| shopify-function-javascript | https://github.com/Shopify/shopify-function-javascript | SDK Functions utk JS/TS | Tulis Function dengan JS | Reference link | useful |
| shopify-function-rust | https://github.com/Shopify/shopify-function-rust | SDK Functions utk Rust | Tulis Function dengan Rust (perf) | Reference link | useful |
| function-runner | https://github.com/Shopify/function-runner | Jalankan/test Function (wasm) lokal | Test Function tanpa deploy | Reference link | useful |
| shopify-function-test-helpers | https://github.com/Shopify/shopify-function-test-helpers | Helper test wasm-level Function | Unit test Function | Reference link | optional |
| example-checkout--* | github.com/Shopify (banyak) | Contoh checkout UI extension spesifik (custom field, banner, validation) | Pola checkout extension konkret | Reference link | useful |
| theme-extension-getting-started | https://github.com/Shopify/theme-extension-getting-started | Boilerplate theme app extension | App block utk theme | Reference link | useful |

> For authoring, use the official documentation and CLI or a Functions/extension skill actually discovered by the runtime. External plugin skill names are not an installation contract for this repository.

---

## Hydrogen / Storefront

| Repo | URL | Fungsi | Kapan dirujuk | Clone? | Prioritas |
|------|-----|--------|---------------|--------|-----------|
| hydrogen | https://github.com/Shopify/hydrogen | Framework headless storefront (aktif) | Bangun storefront headless | Reference link | must-have (jika headless) |
| hydrogen-demo-store | https://github.com/Shopify/hydrogen-demo-store | Demo store full-feature | Contoh struktur & query nyata | Clone (reference) | useful |
| awesome-hydrogen | https://github.com/Shopify/awesome-hydrogen | Kurasi resource Hydrogen | Cari plugin/contoh komunitas | Reference link | optional |
| storefront-api-examples | https://github.com/Shopify/storefront-api-examples | Contoh storefront custom (non-Hydrogen) | Storefront pakai Storefront API mentah | Reference link | useful |
| js-buy-sdk | https://github.com/Shopify/js-buy-sdk | SDK ecommerce ringan (produk, cart, checkout) | Embed commerce ke web biasa | Reference link | optional |
| hydrogen-react | https://github.com/Shopify/hydrogen-react | Komponen/util storefront (deprecated, lebur ke hydrogen) | Hanya legacy | Reference link | optional |

> **Deprecated:** `hydrogen-v1` is an archived legacy concept. For Hydrogen, use the official Hydrogen documentation and, when runtime discovery exposes one, the applicable Hydrogen skill; do not assume a particular skill is installed.

---

## Polaris / UI

| Repo | URL | Fungsi | Status | Prioritas |
|------|-----|--------|--------|-----------|
| polaris-react | https://github.com/Shopify/polaris-react | Implementasi React design system | **Deprecated** | optional |
| polaris-tokens | https://github.com/Shopify/polaris-tokens | Design tokens Polaris | Deprecated/maintenance | optional |
| polaris-viz | https://github.com/Shopify/polaris-viz | Komponen data-viz | Deprecated | optional |

> Most Polaris repositories on GitHub are **deprecated**. For admin app UI, use current Shopify documentation or a relevant skill discovered by the runtime. Do not clone the Polaris repositories.

---

## Testing / Linting / Formatting / Language Server

| Repo | URL | Fungsi | Kapan dirujuk | Clone? | Prioritas |
|------|-----|--------|---------------|--------|-----------|
| theme-tools | https://github.com/Shopify/theme-tools | theme-check (linter) + Liquid **Language Server** + `prettier-plugin-liquid` + LiquidHTML parser | Lint/format/validate theme; integrasi LSP ke helix | Reference link | must-have |
| theme-check-action | https://github.com/Shopify/theme-check-action | Jalankan theme-check di GitHub PR (CI) | Setup CI lint theme | Reference link | useful |
| function-runner | https://github.com/Shopify/function-runner | Eksekusi/test Function (wasm) lokal | Test Function tanpa deploy | Reference link | useful |
| shopify-function-test-helpers | https://github.com/Shopify/shopify-function-test-helpers | Helper test wasm-level Function | Unit test Function | Reference link | optional |
| graphql-codegen | https://github.com/Shopify/graphql-codegen | Codegen tipe TS dari operasi GraphQL | Typed Admin/Storefront query | Reference link | useful |

> Liquid LSP may be available in Claude Code through the `liquid-skills` plugin. Use it only when runtime discovery exposes the plugin; for Helix, point the LSP at `@shopify/cli` / `theme-tools`.

---

## Docs / Examples / Learning References

Bukan untuk di-clone — buka saat butuh contoh konkret atau belajar pola. Default = reference link.

| Repo | URL | Fungsi | Kapan dirujuk | Prioritas |
|------|-----|--------|---------------|-----------|
| graphql-design-tutorial | https://github.com/Shopify/graphql-design-tutorial | Tutorial desain GraphQL API (prinsip mutation/relasi) | Mendesain skema/operasi GraphQL yang bersih | useful |
| storefront-api-learning-kit | https://github.com/Shopify/storefront-api-learning-kit | Learning kit Storefront API (query nyata) | Belajar query Storefront API | useful |
| shopify-app-examples | https://github.com/Shopify/shopify-app-examples | Kumpulan contoh app resmi end-to-end | Pola app nyata di luar template | useful |
| example-app--qr-code--remix | https://github.com/Shopify/example-app--qr-code--remix | App QR-code Remix kanonik utuh | Struktur app Remix lengkap | useful |
| function-examples | https://github.com/Shopify/function-examples | Contoh Function (diskon, validasi, delivery, payment) | Pola Function konkret | must-have |
| example-checkout--* | https://github.com/Shopify (mis. `--custom-field--react`, `--client-validation--react`) | Contoh checkout UI extension spesifik | Pola checkout extension per use-case | useful |
| customer-account-tutorials | https://github.com/Shopify/customer-account-tutorials | Kode tutorial customer account extension | Bangun customer-account UI extension | optional |
| pos-ui-extensions-tutorials | https://github.com/Shopify/pos-ui-extensions-tutorials | Kode tutorial POS UI extension | Bangun POS extension | optional |
| awesome-hydrogen | https://github.com/Shopify/awesome-hydrogen | Kurasi resource Hydrogen komunitas | Cari plugin/contoh Hydrogen | optional |
| liquid-docs-code-samples | https://github.com/Shopify/liquid-docs-code-samples | Sample kode dari tutorial Liquid shopify.dev | Cocokkan contoh dengan docs Liquid | optional |
| example-mobile--storefront--* | https://github.com/Shopify (react-native/swift/kotlin) | Contoh storefront mobile native | Storefront app mobile | optional |

> The primary documentation source remains **shopify.dev**. Use the `shopify-dev` MCP or Shopify skills only when runtime discovery exposes those capabilities; the repositories above are for concrete code examples.

---

## Recommended AI Terminal Setup

### Plugin/MCP resmi untuk AI terminal (paling penting)
Dari enumerasi penuh, Shopify punya plugin AI-agent **resmi** — pakai ini, jangan reinvent:
- **`Shopify/Shopify-AI-Toolkit`** (marketplace `shopify-ai-toolkit`) — Shopify Dev MCP: docs, schema API, validasi anti-halusinasi, + `store execute`. Untuk Claude Code:
  `/plugin marketplace add Shopify/shopify-ai-toolkit` → `/plugin install shopify-plugin@shopify-ai-toolkit`.
  When runtime discovery exposes the plugin, this is the source of its Shopify MCP and skill capabilities.
- **`Shopify/liquid-skills`** — LSP + skill Liquid native: `/plugin marketplace add Shopify/liquid-skills` → install `liquid-lsp@liquid-skills` + `liquid-skills@liquid-skills` (butuh `@shopify/cli`).
- **`Shopify/shop-chat-agent`** — template app AI chat storefront berbasis Storefront MCP (rujukan kalau bikin agent belanja).

### Skill discovery and extension
- **Check runtime discovery first.** Names such as `shopify-liquid`, `shopify-hydrogen`, `shopify-functions`, `shopify-custom-data`, `shopify-storefront-graphql`, `shopify-admin`, `shopify-use-shopify-cli`, `shopify-polaris-*`, and `shopify-onboarding-dev` belong to external plugin capabilities and are not guaranteed to be installed by this repository.
- **A custom skill is worth considering only when the capability is genuinely absent:** a short `horizon-theme-workflow` under `~/dotfiles/skills/local/` could summarize this machine's theme flow (initialize Horizon/Skeleton → consult Dawn/Horizon patterns → theme-check → preview in Chromium).

### Reference docs to keep
- Keep **this tracked file** as the primary map: `docs/shopify-ai-development-repos.md`. Do not maintain a second copy under `~/Documents`.
- Saat butuh kode pola, **clone read-only sekali** ke folder reference (mis. `~/Documents/Shopify/_reference/`): `dawn`, `skeleton-theme`. Jangan clone ke project. (Catatan: user punya hard-rule no `git clone` di task ini — clone hanya kalau user mengizinkan eksplisit nanti.)
- For Liquid and API specifications, use live `theme-liquid-docs` and the `shopify-dev` MCP only when runtime discovery exposes it; do not store a dump.

### Memory facts ✅ SUDAH DISIMPAN
Tersimpan ringkas di `~/.config/ai/memory/shopify.md` (lintas-CLI). Untuk development routing, gunakan repo map ini dan official documentation langsung; router lama `shopify-ai-toolkit-router` sudah dihapus. Fakta DURABLE & ringkas (bukan isi besar):
- Theme flagship terbaru = `horizon` (theme blocks); `dawn` = reference matang; `skeleton-theme` = base bersih. `theme-check` (Ruby)/`themekit`/`slate`/`Timber`/`starter-theme` = **deprecated**.
- Plugin AI resmi: `Shopify-AI-Toolkit` (= Shopify Dev MCP) + `liquid-skills` (LSP) untuk Claude Code; `shop-chat-agent` = template AI storefront.
- Theme DX modern = `theme-tools` (theme-check + LSP + prettier-plugin-liquid). CLI resmi = `cli` (TS, `@shopify/cli`), bukan `shopify-cli` Ruby (arsip).
- App scaffold default = `shopify-app-template-remix`; lib Node = `shopify-app-js` + `shopify-api-js`.
- Functions = `function-examples` + `shopify-function-javascript/-rust` + `function-runner`. Extensions API = `ui-extensions`.
- Polaris repositories are deprecated → use current Shopify documentation or a relevant Polaris skill discovered by the runtime.
- AI Liquid support = plugin `Shopify/liquid-skills` (LSP + skills) untuk Claude Code.

### Memory facts NOT to save
- Daftar lengkap repo + star count (berubah & besar) → biarkan di file markdown ini saja.
- Isi README / contoh kode panjang → ambil live saat dibutuhkan.

### Commands / prompts AI should use
- Cari docs API/Liquid: **MCP `shopify-dev`** atau skill spesifik, bukan tebak dari memori.
- Scan repo org tanpa clone: `gh api -X GET search/repositories -f q='org:Shopify <kata> in:name' --jq '...'`.
- Baca README tanpa clone: `gh api repos/Shopify/<repo>/readme --jq '.content' | base64 -d`.
- Validasi theme: `shopify theme check`; preview: `shopify theme dev` → Chromium localhost.

---

## Repo Index

| Category | Repo | URL | Function | Priority | Clone? |
|----------|------|-----|----------|----------|--------|
| AI/Plugin | Shopify-AI-Toolkit | https://github.com/Shopify/Shopify-AI-Toolkit | Shopify Dev MCP plugin (docs/schema/validasi) utk Claude Code/Cursor/Gemini | must-have (AI) | Install plugin |
| AI/Plugin | shop-chat-agent | https://github.com/Shopify/shop-chat-agent | Template app AI chat storefront (Storefront MCP) | useful | Reference link |
| Theme | horizon | https://github.com/Shopify/horizon | Theme flagship baru (theme blocks) | must-have | Clone (base) |
| Theme | dawn | https://github.com/Shopify/dawn | Reference theme OS 2.0 | must-have | Clone (base) |
| Theme | skeleton-theme | https://github.com/Shopify/skeleton-theme | Starter theme minimal modern | must-have | Clone (scaffold) |
| Theme | reference-theme | https://github.com/Shopify/reference-theme | Developer reference theme | useful | Ref link |
| Theme | theme-scripts | https://github.com/Shopify/theme-scripts | Utility JS theme | optional | Ref link |
| Theme | theme-extension-getting-started | https://github.com/Shopify/theme-extension-getting-started | Boilerplate theme app extension | useful | Ref link |
| Liquid Tooling | theme-tools | https://github.com/Shopify/theme-tools | theme-check + LSP + prettier (monorepo) | must-have | Ref link |
| Liquid Tooling | theme-liquid-docs | https://github.com/Shopify/theme-liquid-docs | Dokumentasi Liquid mesin-readable | must-have | Ref link |
| Liquid Tooling | liquid | https://github.com/Shopify/liquid | Engine Liquid (Ruby) | useful | Ref link |
| Liquid Tooling | liquid-skills | https://github.com/Shopify/liquid-skills | Plugin Claude Code (LSP+skills) | must-have (AI) | Install plugin |
| Liquid Tooling | prettier-plugin-liquid | https://github.com/Shopify/prettier-plugin-liquid | Formatter Liquid/HTML | useful | Ref link |
| Liquid Tooling | liquid-tm-grammar | https://github.com/Shopify/liquid-tm-grammar | Syntax grammar resmi | optional | Ref link |
| Liquid Tooling | liquid-c | https://github.com/Shopify/liquid-c | Ekstensi performa Liquid (C) | optional | Ref link |
| CLI | cli | https://github.com/Shopify/cli | Shopify CLI resmi (TS) | must-have | npm install |
| App | shopify-app-template-remix | https://github.com/Shopify/shopify-app-template-remix | Template app default | must-have | Clone (scaffold) |
| App | shopify-app-template-react-router | https://github.com/Shopify/shopify-app-template-react-router | Template app React Router 7+ | useful | Clone (scaffold) |
| App | shopify-app-js | https://github.com/Shopify/shopify-app-js | Lib app Node (auth/webhook) | must-have | Ref link |
| App | shopify-api-js | https://github.com/Shopify/shopify-api-js | Admin API client Node | must-have | Ref link |
| App | shopify-app-bridge | https://github.com/Shopify/shopify-app-bridge | App Bridge utk app embedded | must-have | Ref link |
| App | shopify-app-examples | https://github.com/Shopify/shopify-app-examples | Contoh app resmi end-to-end | useful | Ref link |
| App | example-app--qr-code--remix | https://github.com/Shopify/example-app--qr-code--remix | App QR-code Remix kanonik | useful | Ref link |
| App | graphql-codegen | https://github.com/Shopify/graphql-codegen | Codegen tipe TS dari GraphQL | useful | Ref link |
| App | shopify-api-php | https://github.com/Shopify/shopify-api-php | Admin API client PHP | optional | Ref link |
| App | shopify-app-php | https://github.com/Shopify/shopify-app-php | Package app PHP | optional | Ref link |
| App | shopify-app-python | https://github.com/Shopify/shopify-app-python | Package app Python | optional | Ref link |
| App | shopify_app | https://github.com/Shopify/shopify_app | Rails Engine app | optional | Ref link |
| App | shopify-api-ruby | https://github.com/Shopify/shopify-api-ruby | Admin API client Ruby | optional | Ref link |
| App | shopify_python_api | https://github.com/Shopify/shopify_python_api | Admin API client Python | optional | Ref link |
| App | shopify-app-template-php | https://github.com/Shopify/shopify-app-template-php | Template app PHP | optional | Clone bila dipakai |
| App | shopify-app-template-ruby | https://github.com/Shopify/shopify-app-template-ruby | Template app Ruby | optional | Clone bila dipakai |
| App | shopify-app-template-extension-only | https://github.com/Shopify/shopify-app-template-extension-only | App tanpa backend (extension-only) | optional | Clone bila dipakai |
| Functions | function-examples | https://github.com/Shopify/function-examples | Contoh Shopify Functions | must-have | Ref link |
| Functions | extensions-templates | https://github.com/Shopify/extensions-templates | Template scaffold extension CLI | useful | Ref link |
| Functions | discounts-reference-app | https://github.com/Shopify/discounts-reference-app | Reference app Discount Functions | useful | Ref link |
| Functions | discount-app-components | https://github.com/Shopify/discount-app-components | Komponen React app diskon | optional | Ref link |
| Storefront | buy-button-js | https://github.com/Shopify/buy-button-js | BuyButton.js embed commerce | optional | Ref link |
| Testing/LSP | theme-check-action | https://github.com/Shopify/theme-check-action | theme-check di GitHub PR (CI) | useful | Ref link |
| Testing/LSP | shopify-function-test-helpers | https://github.com/Shopify/shopify-function-test-helpers | Test helper wasm Function | optional | Ref link |
| Docs/Learning | graphql-design-tutorial | https://github.com/Shopify/graphql-design-tutorial | Tutorial desain GraphQL API | useful | Ref link |
| Docs/Learning | storefront-api-learning-kit | https://github.com/Shopify/storefront-api-learning-kit | Learning kit Storefront API | useful | Ref link |
| Docs/Learning | customer-account-tutorials | https://github.com/Shopify/customer-account-tutorials | Tutorial customer account extension | optional | Ref link |
| Docs/Learning | pos-ui-extensions-tutorials | https://github.com/Shopify/pos-ui-extensions-tutorials | Tutorial POS UI extension | optional | Ref link |
| Docs/Learning | awesome-hydrogen | https://github.com/Shopify/awesome-hydrogen | Kurasi resource Hydrogen | optional | Ref link |
| Docs/Learning | liquid-docs-code-samples | https://github.com/Shopify/liquid-docs-code-samples | Sample kode tutorial Liquid | optional | Ref link |
| Functions | shopify-function-javascript | https://github.com/Shopify/shopify-function-javascript | SDK Functions JS | useful | Ref link |
| Functions | shopify-function-rust | https://github.com/Shopify/shopify-function-rust | SDK Functions Rust | useful | Ref link |
| Functions | function-runner | https://github.com/Shopify/function-runner | Runner/test Function (wasm) | useful | Ref link |
| Functions | shopify-function-test-helpers | https://github.com/Shopify/shopify-function-test-helpers | Test helper Function | optional | Ref link |
| Extensions | ui-extensions | https://github.com/Shopify/ui-extensions | Definisi API UI extension | must-have | Ref link |
| Extensions | example-checkout--* | https://github.com/Shopify | Contoh checkout UI extension | useful | Ref link |
| Hydrogen | hydrogen | https://github.com/Shopify/hydrogen | Framework headless storefront | must-have (headless) | Ref link |
| Hydrogen | hydrogen-demo-store | https://github.com/Shopify/hydrogen-demo-store | Demo store full-feature | useful | Clone (ref) |
| Hydrogen | awesome-hydrogen | https://github.com/Shopify/awesome-hydrogen | Kurasi resource | optional | Ref link |
| Storefront | storefront-api-examples | https://github.com/Shopify/storefront-api-examples | Contoh storefront non-Hydrogen | useful | Ref link |
| Storefront | js-buy-sdk | https://github.com/Shopify/js-buy-sdk | SDK commerce ringan | optional | Ref link |
| UI | polaris-react | https://github.com/Shopify/polaris-react | Design system React (deprecated) | optional | Jangan clone |
| UI | polaris-tokens | https://github.com/Shopify/polaris-tokens | Design tokens (deprecated) | optional | Jangan clone |

### Sengaja DIKECUALIKAN (tidak relevan utk dev Shopify storefront/app)
`draggable`, `toxiproxy`, `dashing`, `react-native-skia`, `flash-list`, `restyle`, `go-lua`, `kubeaudit`, `krane`, `ghostferry`, `identity_cache`, `packwerk`, `semian`, `shipit-engine`, `ejson`, `graphql-batch`, `job-iteration`, `maintenance_tasks`, `pitchfork`, `tapioca`, `ruby-lsp*`, `roast`, `yjit`, `statsd-instrument`, dll — itu infra/Ruby-internal Shopify, bukan untuk membangun di atas platform.

---

## Final Recommendation

**Singkat & praktis:**

0. **AI terminal dulu:** pasang `Shopify-AI-Toolkit` (Shopify Dev MCP) + `liquid-skills` plugin di Claude Code — ini fondasi docs/schema/validasi anti-halusinasi untuk semua task di bawah.
1. **Theme:** untuk theme baru mulai dari `horizon` (theme blocks) atau `skeleton-theme`; pakai `dawn` sebagai sumber pola matang. Clone read-only ketiganya sebagai reference; validasi pakai `theme-tools` (`shopify theme check`); cek Liquid via `theme-liquid-docs`/MCP `shopify-dev`.
2. **App:** scaffold from `shopify-app-template-remix`; use `shopify-app-js` + `shopify-api-js`; route everything through the official `cli` (`@shopify/cli`). For admin UI, use current Shopify documentation or a relevant skill discovered by the runtime, **not** the deprecated Polaris repository.
3. **Functions/Extensions:** consult `function-examples` + `ui-extensions`; use an authoring skill only when runtime discovery exposes it.
4. **Hydrogen:** consult `hydrogen` + `hydrogen-demo-store`; use a Hydrogen skill only when runtime discovery exposes it.
5. **Do not download:** the Liquid tooling repositories (reference links are enough), Polaris (deprecated), Shopify's internal Ruby/Go infrastructure repositories, or archived repositories (`theme-check`, `themekit`, `slate`, `Timber`, `hydrogen-v1`, and the Ruby `shopify-cli`).
6. **Prefer capabilities actually exposed by runtime discovery** before opening a repository; use official documentation when they are unavailable.

---

## Catatan Cakupan (full-scan 2026-06-27)

Dokumen ini berbasis **enumerasi penuh 1202 repo publik** org Shopify (bukan sampling). Temuan penting hasil full-scan yang tidak muncul di scan awal by-stars/keyword:
- **`horizon`** — theme flagship baru (theme blocks) → ditambahkan sbg must-have.
- **`Shopify-AI-Toolkit`** & **`shopify-plugins`** — plugin Shopify Dev MCP resmi utk AI agent → jadi fondasi setup AI terminal.
- **`shop-chat-agent`** — template AI storefront (Storefront MCP).
- **`shopify-app-bridge`**, **`shopify-app-examples`**, **`example-app--qr-code--remix`**, **`graphql-codegen`**, **`extensions-templates`**, **`discounts-reference-app`**, **`discount-app-components`**, **`storefront-api-learning-kit`**, SDK PHP/Python.

Dari 1202 repo: ~189 lolos filter relevansi (theme/liquid/app/extension/function/hydrogen/graphql/dll), sisanya mayoritas infra Ruby/Go internal (362 repo Ruby) yang dikecualikan. Distribusi bahasa: Ruby 362, JS 173, Go 106, TS 82, Python 41, Liquid 16.
