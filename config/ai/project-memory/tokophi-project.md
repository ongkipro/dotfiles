---
name: tokophi-project
description: "TokoΦ (formerly \"indostore\") = Shopify-clone commerce SaaS for Indonesia; ~/projects/tokophi, private repo ongkipro/tokophi; monorepo scope @tokophi/*; local Postgres+Drizzle, RLS role tokophi_app; prod target self-hosted Postgres+PostgREST on VPS (NOT Supabase)"
metadata: 
  node_type: memory
  type: project
  originSessionId: a3473a68-f7cb-4f46-aa14-c07821480525
  modified: 2026-08-22T18:39:40.580Z
---

**TokoΦ** — Shopify-style commerce platform for Indonesia. **REBRANDED from "indostore" 2026-07-08** (full rename: display brand → **TokoΦ** (phi symbol); folder/scope/db identifiers → `tokophi`). **One shared admin** (all clients same admin UI) + **per-client Astro storefronts** built bespoke per brand. Deliberately **NO Themes menu, NO Apps/Plugins** — curated, lightweight, Bahasa Indonesia UI, modern-SaaS polish.

**Dated build log** (slug rename, TASKS.md board, Stage 4 P0 complete, super-admin control plane/auth, real variants, live deploy + billing): [[tokophi-build-log]]. Progress itself is read from the repo.


**Rebrand facts (what changed from indostore):**
- Folder: `~/projects/tokophi` (was `~/projects/indostore`). **Docs single-source = repo `specs/`** (canonical, versioned with code); the old path `~/Documents/Development/tokophi` is now a **symlink → `~/projects/tokophi/specs`** (dedup decision 2026-07-08; edit docs in `specs/` only).
- Repo: **private `ongkipro/tokophi`** (new repo, history kept; rebrand commit **89b7e48**). Old `ongkipro/indostore` remote abandoned.
- npm scope `@indostore/*` → **`@tokophi/*`** (db/ui/lib/data/admin/super-admin/storefront); root pkg `tokophi`.
- DB: role `indostore_app` → **`tokophi_app`**; docker container **`tokophi-db`**, volume `tokophi_tokophi-pgdata`, POSTGRES user·pass·db (values: see `~/.config/ai-local/project-credentials.md`); `DATABASE_URL=postgresql://<user>:<pass>@localhost:5433/tokophi (values: see `~/.config/ai-local/project-credentials.md`)`.
- Owner login rebranded: **ongki@batiknusantara.id / <password: see `~/.config/ai-local/project-credentials.md`>** (was indostore123).
- Display brand string is literally `TokoΦ` (all in JSX/strings/CSS-comments, never a JS identifier).
- Verified after rebrand: migrate + seed + verify-rls pass; admin·super-admin·storefront build clean.

**Architecture (unchanged by rebrand):** monorepo npm workspaces — `apps/{admin,super-admin,storefront}` + `packages/{ui,lib,data,db}`. **`@tokophi/db`** = Drizzle + **local PostgreSQL 16 in Docker** (port 5433, 53 tables, migrations 0000–0012, seed/reset). Runs **locally on Linux** (VPS deferred). DONE + verified E2E:
- **Reads:** all 3 surfaces — super-admin (5 pages), admin (16 modules `lib/data/*` `force-dynamic`), storefront (`src/data/catalog.ts` reads `@tokophi/db` via top-level await at build/SSR).
- **Writes:** all 12 admin editors persist via `lib/actions/*.ts` server actions. Delete=archive when FK-referenced (products←order_line_items), else hard delete.
- **Auth (local):** email/password → **jose JWT** httpOnly `session` cookie, `middleware.ts` protects admin. `users.password_hash` = scrypt. AUTH_SECRET env.
- **RBAC (local, ENFORCED):** client-safe matrix `apps/admin/lib/rbac-policy.ts` (owner=all · admin=all−settings · staff=shop ops no-delete/no-warehouse/no-settings · gudang=inventori+pembelian only); `lib/rbac.ts` adds server guard `requireCapability(cap)` gating all mutating actions + returns session. UI gating `components/admin/permissions.tsx` (`useCan`/`<Can>` + role badge).
- **RLS (local, ENFORCING at runtime):** migration **0012_tenant_rls** — non-owner **`tokophi_app`** role + `app_current_store_id()` GUC + `tenant_isolation` (`USING`/`WITH CHECK` on `store_id`) on all 32 store-scoped tables. `packages/db withTenant(storeId, fn)` = per-txn `set_config('app.store_id',…,true)` + `SET LOCAL ROLE tokophi_app`. Admin routes every read through `apps/admin/lib/tenant.ts withCurrentTenant(fn)` (14 `lib/data/*`), every write via `withTenant(session.storeId,…)` (13 `lib/actions/*`). **Owner-stays exceptions:** `lib/auth.ts` (pre-session read), super-admin (cross-tenant), storefront (per-client build). Verify: `npm run verify-rls` + `verify-rls-app`. Callback param named `db`; NEVER use bare module `db` for admin tenant data.
- **Media (local):** product editor uploads → `apps/admin/public/uploads/` (gitignored) + `product_media` (`lib/actions/media.ts`, 5MB cap).
- Single-tenant MVP ("Batik Nusantara" = the demo STORE, distinct from the TokoΦ platform brand; 14 fashion products).

**🎯 DB DIRECTION (user, 2026-07-03): NOT Supabase.** Prod = **self-hosted PostgreSQL + PostgREST on a VPS** (RLS `store_id`, JWT auth, Storage MinIO/S3). Same Drizzle migrations carry up. On VPS, PostgREST connects as `tokophi_app` with JWT `store_id` claim → `app.store_id` GUC.


**▶ RESUME candidates:** (a) **VPS infra** (self-hosted Postgres + PostgREST + MinIO; needs a real server — the app side is done). (b) de-dup admin→`@tokophi/ui` + delete admin's local `components/ui`/`lib`.

**GOTCHA — shadcn/ui uses Base UI (`@base-ui/react`), NOT Radix.** No `asChild` → use **`render` prop**: `<DropdownMenuTrigger render={<Button/>} />`. Don't use `Select` (API differs) — use DropdownMenu/Tabs. `Button` as Link needs **`nativeButton={false}`** or console.error. Determinism: mock anchored `TODAY=2026-06-30`, no `Date.now()`/`Math.random()` in render. Charts: screenshot with **Playwright** (headless-chrome mis-sizes Recharts).

Related: [[toko-online-builder]], [[folder-convention-dev]], [[no-ai-commit-trailer]], [[git-identity-noreply]].
