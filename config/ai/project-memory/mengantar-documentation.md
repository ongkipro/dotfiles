---
name: mengantar-documentation
description: "Mengantar Public API integration documentation and TypeScript toolkit; canonical repo ongkipro/mengantar-documentation"
metadata:
  node_type: memory
  type: project
  modified: 2026-08-07T00:00:00.000Z
---

Mengantar API Integration Documentation & Toolkit. Permanent checkout: `~/Projects/mengantar-documentation`.

- **Canonical repository:** `ongkipro/mengantar-documentation`; origin URL is `https://github.com/ongkipro/mengantar-documentation.git`.
- This is a documentation and integration-toolkit repository, not a runtime application. It contains 18 API operations across 13 OpenAPI paths, a dependency-free server-only TypeScript client, cURL/HTTP examples, and Astro/Next.js integration guidance.
- Disk is authoritative. Before editing, inspect the checkout because the audited 2026-08-07 working tree was intentionally left uncommitted for Ongki to review and commit through lazygit. Never reset, clean, or overwrite those changes.
- Contract priority: safely captured live/sandbox evidence → official docs at `https://app.mengantar.com/docs/` → `spec/openapi.yaml` → `docs/01-api-reference.md` → `examples/mengantar-client.ts`.
- Write endpoints use JSON. API keys stay server-side in `/api/public/{API_KEY}` paths. WooCommerce integrations set `x-client-source: woocommerce`.
- Keep the two origin identifiers separate: estimate `origin_id` is the area ID (`PICKUP_AUTOFILL`); `pickup.address_id` and `/time` use the pickup-address `_id`.
- `POST /time` returns one slot object; `GET /time` returns an array. Dates use `mm-dd-yyyy`, fixed 09:00–18:00 slots, at least 90 minutes ahead.
- Preserve the full create-order response envelope: `data[]`, top-level `batch_id`, and `errors[]`. Insufficient balance is a successful response with `isPaid:false` and `cnote_no:null`; top up and call `/order/pay-unpaid`, never create the shipment again.
- Shipment creation belongs in a trusted server job after ownership, idempotency, address, weight, and payment validation. Never forward a browser payload directly to `/order`. Serialize create requests per account for JT Premium, Ninja, and SiCepat.
- Checkout gating must reject `unsupported:true`; COD checkout must also reject `unsupported_cod:true`.
- Local quality gate: `make all`, `bash -n scripts/check-links.sh scripts/smoke.sh`, and `npx -y @redocly/cli lint spec/openapi.yaml`. The 2026-08-07 audit passed 5 contract tests, strict TypeScript, link/credential checks, shell syntax, 18-operation count, and warning-free Redocly lint.
- No `.env` or API key was present during the audit. Live `make smoke` and sandbox-write `make smoke-full` were not executed. Never run production or write smoke operations without explicit approval.
