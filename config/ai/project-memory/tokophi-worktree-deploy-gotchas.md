---
name: tokophi-worktree-deploy-gotchas
description: "TokoΦ promospec worktree — dev-mode admin hydration broken, verify via prod build; migrations on shared DB; gh GraphQL flakes"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4863a141-ddc0-489d-a125-7e699e43b385
  modified: 2026-08-01T06:19:02.982Z
---

Gotchas hit repeatedly while building the PROMO system in the `~/projects/tokophi/.claude/worktrees/promospec` worktree (branch work → PR → merge → Coolify deploy). See [[tokophi-project]], [[tokophi-deploy-workflow]].

**Why:** each cost real debugging time; they are environmental, not code bugs.

**How to apply:**
- **A FRESH worktree has no `node_modules`, and TypeScript then lies to you** (hit 2026-08-01). Module resolution walks UP out of the worktree into the MAIN checkout's `node_modules`, where `@tokophi/db` symlinks to the main working tree — which is hundreds of commits stale. You get errors about columns that exist perfectly well (`products.number`, `product_variants.seq`). **`npm install` inside the worktree before trusting `tsc`.** Same trap in the shell: `cd` into the worktree in EVERY Bash command — reading `apps/**` from the repo root silently reads stale `main`, and it looks exactly like the code you are editing.
- **A 200 does NOT mean the deploy landed, and neither does a small response.** Verify with the shipped change itself (sitemap `<lastmod>` 15→21; `grep -c <seeded-marker>` on a login page). ⚠️ **Check the BYTE COUNT too** — mid-swap the origin returns a ~20-byte stub, so `grep -c` reads **0** and looks exactly like a successful fix. Gate on `wc -c > 2000` as well as on the change.
- **Admin `next dev` is broken in this worktree** — the page renders but does NOT hydrate (switches/buttons/save all dead), due to mixed webpack/turbopack `.next` + flaky HMR WebSocket. The pre-existing Diskon editor fails to save in dev too, proving it's the env. **Verify admin interactivity via a PRODUCTION build**: `npm run build:admin` then `npx next start -p 3005`, not `next dev`.
- **Storefront local tenant**: `batik-nusantara.primaryHost = toko-demo.test`, so localhost 301-redirects. Test with Chromium `--host-resolver-rules="MAP toko-demo.test 127.0.0.1"` + `http://toko-demo.test:<port>`. Login: ongki@batiknusantara.id / <password: see `~/.config/ai-local/project-credentials.md`> → lands on `/store/batik-nusantara`.
- **Shared dev DB (tokophi-db :5433) has migration drift** — `npm run migrate` collides. Apply new migration SQL directly & idempotently (`ALTER TABLE … ADD COLUMN IF NOT EXISTS …`). Committed migration files are still correct for prod (Coolify's `migrate` service runs `drizzle-kit migrate` before apps start). No host `psql`; use `docker exec tokophi-db psql -U tokophi -d tokophi`.
- **Base UI Switch is `<span role="switch">`** — Playwright `.click()` does NOT toggle it. Drive real interactions or edit a text field to exercise a save path instead.
- **`gh pr create` uses GraphQL and flakes** during GitHub incidents (seen returning `GraphQL: Something went wrong…` for ~5+ min). Branch push (REST) still works. Just retry `gh pr create` after a pause; don't hand-build via REST.
- **Watch a Coolify deploy** by polling the live URL for the 503→200 swap (build ~5 min, then container swap): `https://app.tokophi.com/login` (admin) or `https://toko.tokophi.com/` (storefront). 200 right after merge = still the OLD containers.
- `Header.astro` throws 8 astro-check false-positives (unterminated-string quirk on `<style is:global>` after a `{/* */}` comment) — pre-existing, site renders fine. Ignore when checking storefront.
