---
name: mengantar-api
description: >-
  Architectural intelligence for integrating Mengantar API (Indonesian 3PL/Logistics Aggregator). 
  Handles expedition routing, COD workflows, balance management, and API constraints 
  (concurrency, sandbox traps, WooCommerce headers) for JNE, SiCepat, SAP, J&T, etc.
  Triggers: 'integrasi mengantar', 'bikin fitur ekspedisi', 'logistik api', 'aggregator kurir indonesia', 'cek ongkir', 'sistem cod'.
---

# Mengantar API: Logistics & Expedition Architecture

Use this skill when integrating local Indonesian shipping, courier estimation, and COD (Cash on Delivery) via the Mengantar API aggregator.

## Evidence and Currentness Boundary

This is private integration knowledge; no relevant canonical public upstream was found. Endpoint names, account behavior, courier constraints, percentages, and sandbox rules are point-in-time operational claims. Before implementation, compare them with the tenant's current Mengantar documentation/dashboard or support response and one observed sandbox call. Record the environment, account tier, retrieval date, and sanitized evidence. Current provider documentation and observed responses override this file.

This skill owns Mengantar-specific routing, COD, wallet, and courier constraints. It does not own storefront behavior, generic order modeling, payment accounting, or courier UI; hand those concerns to their relevant product/domain skills without copying this API contract.

## 1. CORE API TOPOLOGY
- **Base URL:** `{BASE_URL}/api/public/{API_KEY}`
- **Standard Header:** `Content-Type: application/json`.
- **Integrator Header:** If building for WooCommerce, ALWAYS inject `x-client-source: woocommerce`. Without this, orders default to `directCall` and analytics will be skewed.

### Server-Only Credential Boundary

Because the credential is embedded in the URL path, every Mengantar request must originate from a trusted backend. Never place the base URL or key in browser/mobile bundles, client-side fetches, analytics, exception messages, proxy access logs, or request traces; redact the credential-bearing path before logging. If a key reaches a client, repository, log, or third party, treat it as compromised and rotate/revoke it through the provider before sending another request.

## 2. ESTIMATION PRICING PATHS
Always pick the right estimation endpoint depending on the business model:
1. **Retail / App Level (`/order/estimate` and `/order/allEstimatePublic`):** Returns account-specific retail pricing and discounts. Never encode an assumed discount percentage.
2. **3PL / B2B Level (`/order/allEstimate3PL`):** Use this for system-to-system integration where raw courier pricing is required (no promotional markups).

**Route Validation Logic (Mandatory Check):**
Never allow checkout without evaluating these two boolean flags from the estimation response:
- `unsupported: true` -> Courier cannot reach destination. Hide courier.
- `unsupported_cod: true` -> Courier reaches destination, but COD is forbidden. Hide COD payment option.

## 3. ORDER CREATION PROTOCOLS
`POST /order` accepts an array of orders (Batch processing).

### A. Non-COD Wallet Flow
Non-COD shipments deduct from the Mengantar Wallet balance.
**The Insufficient Balance Trap:** If a user submits a non-COD order but lacks balance, the API does **not** fail. It creates a draft order with `isPaid: false` and `cnote_no: null`. 
**Implementation Rule:** Your system must handle this state gracefully by prompting the user to Top Up, then subsequently firing `POST /order/pay-unpaid` to acquire the tracking number.

### B. Concurrency Block (J&T, Ninja, SiCepat)
These couriers generate tracking numbers dynamically. 
**Architectural Rule:** NEVER fire concurrent (parallel) `/order` requests. You will receive a `409 Conflict` ("Sedang ada proses pembuatan order..."). Always queue or aggregate multiple user checkouts into a single batch array.

### C. Scheduling Constraint
`POST /time` requires the scheduled pickup (`date` + `time`) to be **at least 90 minutes** from `Date.now()`. If closer, the API rejects it.

## 4. SANDBOX ENVIRONMENT TRAPS
Treat these as historical sandbox observations to re-verify, not limitations to hardcode into product logic:
- **JNE Sandbox:** Origin `PICKUP_ADDRESS` MUST be mapped to Jakarta.
- **SAP Sandbox:** MUST be Non-COD, and the route MUST be Jakarta to Jakarta.
- **Balance Testing:** Sandbox balance requires manual top-up via Midtrans Sandbox Simulator.

## Bounded Sandbox Smoke Check

Use a sandbox key from a trusted backend and the provider's current documented method/payload for a Jakarta-to-Jakarta, non-COD estimate. Do not create an order or touch production.

The smoke passes only when the response is HTTP 2xx, parses as the documented JSON shape, includes at least one courier estimate, and exposes boolean `unsupported` and `unsupported_cod` route flags where the current contract specifies them. An authentication, validation, HTML, or undocumented-shape response is a failure. Record the sanitized request schema, status, relevant response fields, account/environment, and date without the credential-bearing URL. This observed result is the minimum evidence before claiming the integration contract is current.
