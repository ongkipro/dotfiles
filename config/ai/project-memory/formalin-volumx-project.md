---
name: formalin-volumx-project
description: Formalin (formalin_volumx) — multi-tenant conversion-commerce SaaS monorepo; identity, stack, provider facts, gotchas (progress lives in the repo's STATUS.md)
metadata: 
  node_type: memory
  type: project
  originSessionId: 2df959b4-d4d6-44a6-ba7b-f6ccc46121c9
  modified: 2026-07-22T06:32:42.383Z
---

**Formalin** = multi-tenant direct-response conversion-commerce SaaS for Indonesia (order forms + AI
landing pages + orders/payments/shipping). **REBRANDED 2026-07-18 from "Volumform"** (source: 23 `.docx`
in `~/Downloads/Volumform-…`). Engine = **VolumX** (replaced the old term "Perfect Form"; never write
"Volumform"/"Perfect Form").

## ⚠️ TWO repos as of 2026-07-22 — check which one you are in
- **`~/projects/formalin`** · GitHub `ongkipro/formalin` **PRIVATE** — **the greenfield project, docs only,
  no code.** Created 2026-07-22 to develop from 0 via AI terminal. Holds the curated spec set: PRD, 13 ADRs,
  architecture/data-model/RBAC, and four NEW specs written 22 Jul — `MERCHANT_CONSOLE.md` (teardown of
  competitor app.formulir.com), `DESIGN_SYSTEM.md` (Meta palette + the ID/EN language split),
  `CONVERSATIONS_PIPELINE.md` (WhatsApp CRM), `ORDER_CAPTURE_INDONESIA.md` (phone/COD/tracking rules audited
  from ~/projects/petanisejahtera). STATUS/AUDIT/TRACEABILITY/VALIDATION are deliberately **stubs pointing
  back**, not copies — they describe the OLD codebase. **Read its README.md first.**
- **`~/projects/formalin_volumx`** · GitHub `ongkipro/formalin_volumx` **PRIVATE** — the previous
  implementation (6 apps, 10 packages, real code). Not abandoned; its ADRs/RLS/ledger/idempotency/contracts
  were carried into the new repo. Everything below in this file describes THIS repo.
- **Domains NOT acquired yet** (localhost/Coolify first, hosts are ENV-DRIVEN never hard-coded):
  `formalin.id` (main), `cuan.formalin.id` (super admin), `app.formalin.id` (client admin),
  `demo.formalin.id` + `{slug}.formalin.id` (storefront), `api.` / `platform-api.`.
- **Stack** (ADR 0008): pnpm 11 + Turborepo. Admin surfaces (`client-admin` :3100, `platform-admin`
  :3101) + APIs (`api` :3102, `platform-api` :3103) = **Next.js App Router**, responsive any-device.
  Storefront (`public-web` :4400) = **Astro, mobile-first, locked `max-w-[480px]`** (ADR 0006), near-zero
  client JS. Postgres+RLS (dev :5435, vitest uses a SEPARATE `formalin_test` DB), BullMQ worker (Redis).
  Providers **Mengantar** (shipping) + **AutoLaris** (payment/COD) — same ecosystem as [[tokophi-project]],
  **white-label / brand hidden from merchants & buyers**. AI = Anthropic Claude (`claude-opus-4-8`) adapter.
  Price Rp159,000/mo/tenant. Owner login `owner@formalin.test` / <password: see `~/.config/ai-local/project-credentials.md`>; dev platform operator
  `ops@formalin.test` / <password: see `~/.config/ai-local/project-credentials.md`>.

## Status lives in the repo, not here (per dotfiles convention)
Read progress from the repo, which is the source of truth and stays current: **`specs/docs/STATUS.md`**
(what is real vs spec-only, with evidence), **`specs/docs/AUDIT_2026-07-20.md`** (the 4-surface audit +
resolution log), `CHANGELOG.md`, `WORKLOG.md`, `specs/docs/RBAC_MATRIX.md`. `specs/` mirrors the TokoΦ
layout (PRD, docs, `decisions/000N-*.md` ADRs). Do NOT record test counts / milestone numbers here — they
go stale the next commit; STATUS.md carries them.

- **PICKUP (2026-07-22, wave 7 committed):** branch `hardening/audit-wave-1`, working tree CLEAN, **not yet
  pushed and not yet PR'd**. Wave 7 landed migration `0024_credential_reveals` (durable one-time credential
  reveal), `POST /v1/step-up`, `POST /v1/tenants/{id}/owner-password`, ETag on published reads, and the
  merchant deactivate-store button. Read `specs/docs/STATUS.md` for the numbers — do not trust any count in
  this memory file.
- **The trap that pass caught, worth remembering:** `contracts:check` (route↔OpenAPI parity) is **CI-only,
  NOT a turbo task**, so two shipped routes had no OpenAPI path while lint/typecheck/build/test were all
  green. Run `pnpm --filter @formalin/contracts contracts:check` **from the package** (repo root gives a
  misleading ENOENT) after touching routes. Also: a changed lib signature does not fail a mocking suite, it
  fails it at IMPORT ("No X export is defined on the mock") — the file reports zero tests, not a diff.
- **Active branch `hardening/audit-wave-1`** (not yet PR'd to `main`): a 4-surface read-only audit
  (super-admin, merchant admin, storefront, cross-surface chain) followed by multiple hardening waves.
  Recurring finding the whole effort chases: **a mature repository function with no human-reachable path,
  or data written and never readable** (e.g. `audit_events` had 7 writers, 0 readers). Every Next surface
  now has a test suite (they had none). The super-admin→merchant→buyer chain is operable from empty tenant.
- **`AGENTS.md` has a "Traps that pass every gate" section** — read it before working here. The dominant
  lesson: a green `lint`/`typecheck`/`test`/`build` has shipped real defects, because suites import `src/`
  and the API layer, not what ships and not what a user reaches. **Verify at the boundary a real consumer
  crosses** (boot the app, hit the HTTP surface). `turbo test` `dependsOn` `build` so a `dist/`-only defect
  is catchable; keep it.

## Non-negotiable invariants (also in AGENTS.md / ADRs)
- Tenant boundary is RLS (`withTenant`), never a hand-written `WHERE tenant_id` (ADR 0002).
- Versions immutable: publish = new version + atomic pointer swap; the ROUTE validates schema, the repo
  publish fn does not (ADR 0003).
- Money is an append-only double-entry ledger; balances derived (ADR 0007). `ledger_entries` has NO FK to
  orders → **never add `deleteStore`** (orders `ON DELETE CASCADE` would orphan money rows = permanent
  ADR-0007 violation). Deactivate, never delete, anything an order references.
- Order capture idempotent (ADR 0004): `Idempotency-Key` + fingerprint. Money movement (refund) needs
  actor + reason + before/after audit + step-up MFA; `finance:manage` is NON-mintable as an API-key scope.
- White-label safety = **whitelist the output keys that may leave**, never filter known-bad ones.
- Provider brand names must never reach merchant/buyer surfaces; a leaked provider ref turns a bearer link
  into a data leak — public projections echo no PII.

## Real provider integrations (owner ungated + gave keys 2026-07-19, "rotate at go-live")
Keys in **`apps/api/.env.local`** (gitignored `.env.*`) — NEVER commit; NEVER put keys in the doc repos.
Vars: `MENGANTAR_API_BASE_URL`=`https://api-public.mengantar.com` (prod, live-confirmed),
`MENGANTAR_API_KEY`, `MENGANTAR_ORIGIN_ID`; `AUTOLARIS_API_BASE_URL`=`https://api-h2h.autolaris.com`,
`AUTOLARIS_API_KEY`, `AUTOLARIS_CALLBACK_SECRET`, opt `AUTOLARIS_VA_CHANNEL`/`_CALLBACK_URL`/`_CUSTOMER_EMAIL`.
- **Mengantar** (`MengantarAdapter`): key in URL PATH `/api/public/{key}/…` (server-only);
  `GET address/search?keyword=`→wilayah `_id`; `GET order/estimate?…&courier=all&weight(kg)`→map keyed by
  courier, **no etd field**, needs WILAYAH `_id`. Shipping FAILS CLOSED (502 `SHIPPING_PROVIDER_UNAVAILABLE`)
  on live-error/partial-config/prod — a mock ongkir is a fabricated price, and this is the money path. Mock
  only when fully unconfigured AND non-prod.
- **AutoLaris** (`AutoLarisAdapter`, like TokoΦ `packages/lib/src/autolaris.ts`): `POST /api/h2h/create_payment`
  Bearer; envelope `{rc,ket,data}` rc "00"=Sukses; reff_id=`fl_<order20>`=providerRef; COD skips gateway;
  reserve-first init (gateway ≤1×/order, cached instruction on retry); NO silent mock fallback → 502.
  **GOTCHA: QRIS EMVCo merchant name = AutoLaris account name, CRC-signed — NOT a code leak.** Callback
  `POST /v1/storefront/payments/autolaris/callback` carries a PER-ORDER token = HMAC(secret, reff_id) via
  `?token=` (never the master secret in the URL), constant-time, **fails closed when live/prod**, dedups on
  trx_id, rejects amount_mismatch 409. Dev confirm path is env-gated `MOCK_PAYMENT_CONFIRM=1`.
- **STILL GATED (external, not code-closeable):** AutoLaris's REAL signature/IP-allowlist (vendor spec
  unconfirmed — interim per-order HMAC in place); real settlement/refund to provider; TLS + Cloudflare
  custom hostname + edge routing (application-level host→tenant resolution IS built via `resolveHost` +
  `GET /v1/storefront/context`; only the edge/TLS half is gated). Doc repos: `~/Documents/mengantar`
  (ongkipro/mengantar-documentation) + `~/projects/autolaris-payment-gateway` (ongkipro/autolaris-payment-gateway).

## Gotchas that cost time
- pnpm 11.12 fails `--frozen-lockfile` on skipped esbuild/sharp build scripts → set
  `PNPM_CONFIG_STRICT_DEP_BUILDS=false` (env; .npmrc/workspace settings NOT honored).
- Turbo strict-env: declare `env: [DATABASE_*]` on the `test` task or vitest can't see the DB URL in CI.
- `next build` and `tsc` in parallel fail spuriously (`next build` truncates `.next/types` while `tsc`
  reads it, TS6053) → run build and typecheck SEQUENTIALLY.
- The root `.env` is loaded into each app via `process.loadEnvFile("../../.env")` in its config (Next only
  auto-loads an app-local `.env`); db/worker scripts use `node --env-file-if-exists`.
- `pnpm --filter X start` leaves a zombie `next` child on kill → free the port with `fuser -k <port>/tcp`,
  not `pkill -f "next start"` (matches your own shell script). Dev DB (:5435) migrated separately from the
  vitest test DB.

## Conventions
Commit private via `gh`, [[no-ai-commit-trailer]], [[git-identity-noreply]]; [[folder-convention-dev]];
Tailwind v4 bracket arbitrary values [[pixsgo-layout-width]]; page `<title>` uses " - " [[title-separator-convention]].
