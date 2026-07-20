---
name: volumup
description: "Volumup — multi-store US dropship commerce. CODE EXISTS + far along: ~/Projects/volumup (single worktree, branch main), repo ongkipro/volumup. Resume from repo STATUS.md 'RESUME HERE'."
metadata: 
  node_type: memory
  type: project
  originSessionId: cfd5903c-8fda-431d-bd6a-71b30a64c845
---

**Volumup** — self-owned multi-store e-commerce backend. AliExpress **US-warehouse** dropshipping to
**US** consumers, paid ads, **niche** focus, bespoke Astro storefront per brand. Design docs (39 md):
`~/Documents/work/prd/volumup/`.

**⚠️ Any older "no code yet" note is WRONG.** As of 2026-07-20 there is a large, tested codebase at
**`~/Projects/volumup/`** (SINGLE worktree, branch `main` — consolidated 2026-07-20; the old
`volumup-phase1` / `volumup-phase3` worktrees + `phase1`/`phase3-api` branches were merged away, phase3's
WIP archived to `docs/archive/phase3-wip.patch`). Pushed to **`github.com/ongkipro/volumup`** (private).
CI green. **Trust the repo over this memory — disk wins.**
In-repo sources of truth: **`STATUS.md`** (has a "▶ RESUME HERE" block), `docs/ROADMAP.md` (open backlog),
`docs/ARCHITECTURE.md` + `docs/adr/`, `BUILD-LOG.md` (session-by-session), `AGENTS.md` (conventions).

**Built + tested, credential-free:** full Stripe payment loop (checkout→webhook→paid/refund/dispute),
per-store admin RBAC (store=organization), the admin API + worker jobs (prune, refund-failsafe,
expire-orders, ingest), PayPal adapter (code-only), the Ingest pipeline (link→DS→US-warehouse→AI→DRAFT),
and the whole admin SPA on the real API with login+2FA auth wiring. Three adversarial reviews (money
path, worker/admin, auth) fully closed. Run it: throwaway Postgres `:5433` → `pnpm db:seed` → `pnpm dev`
(api :3000 + worker + admin :5173); `INGEST_DEV_MOCK=1` for an ingest demo.

**Now (2026-07-20):** admin + superadmin + storefront all sign in and work in a real browser; the
superadmin cockpit is 100% on live data (all 7 screens). **Next task (per STATUS RESUME): in-app store
provisioning** (superadmin "Add store" — no external credential needed, reuse CLI `provision.ts`).
**Credential-gated** (external input needed): live Stripe (pk_/rk_test_), PayPal sandbox, R2 backup
bucket, the AliExpress DS signed-call client. Dev gotcha: the DB-backed test suite TRUNCATES `volumup_dev`
— re-run `pnpm db:seed && pnpm db:seed:admin` after any full test run. Stack: Hono API + Node worker (one
codebase, NOT Next.js — ADR-011) · React 19/Vite + Astro SSR storefronts · Postgres+Drizzle · Better Auth
1.6 · pg-boss · Vultr+Coolify+Cloudflare.

---
**Durable business/legal context (NOT in the repo — the part worth remembering):**

**The one rule that decides everything technical and legal at once:** *never own inventory situated in
the US* — it drives treaty PE, §865(e)(2), and whether sales-tax nexus attaches at $0. AliExpress
dropship + Printify POD are both PE-free (no owned US inventory); a US 3PL with owned stock is the ONE
channel that crosses this line — attorney-gated, "nanti/maybe", not near-term.

Research found the *business assumptions*, not the architecture, are what's unproven: the US $800 de
minimis is permanently gone; AliExpress has no working resale-exemption path (marketplace facilitator);
`ds.order.create` can't pin the warehouse; supplier sales tax is unpriceable before the order
(`actual_tax_fee` only appears after). **Printify (POD) is a PARALLEL dropship provider, same tier as
AliExpress → fulfillment is MULTI-PROVIDER** (abstraction deferred to Phase 4, ADR-014); Printify DOES
honor a resale cert (closes the ADR-007 double-tax hole without owning inventory), barrier = a state
seller's permit. **ADR-007 = CONDITIONAL upgrade, not accepted** — gate on the anchor-ID question (a
Delaware EIN-only entity has no home-state resale number to anchor MTC multi-state exemption), 2 real
test orders, attorney USTB/ECI review, and a new state income/gross-receipts nexus track (WA B&O / OH
CAT / etc, unshielded by 86-272/treaty PE). Near-term: defer strict-state registrations, eat small COGS
tax. `06-tasks.md` Phase 0 holds 9 preconditions (three can invalidate the plan) — they gate **launch**,
not Phase 1–3 code.

**Ongki's entity context:** Delaware **single-member LLC formed 2026**, foreign-owned, Stripe registered
to it → **Form 5472 + pro forma 1120 due 15 Apr 2027, $25,000/yr penalty uncapped**, triggered merely by
funding the LLC. ITIN (W-7) 9–11 weeks from overseas, gates the protective 1040-NR. Singapore Pte Ltd
option **researched + rejected** (no US–SG treaty → ~44.7%). Entity choice **DEFERRED by Ongki**; market
= US is **DECIDED**.

Related: [[prefer-git-worktree]], [[additive-commits-no-history-rewrite]]
