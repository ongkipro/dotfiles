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

## 1. CORE API TOPOLOGY
- **Base URL:** `{BASE_URL}/api/public/{API_KEY}`
- **Standard Header:** `Content-Type: application/json`.
- **Integrator Header:** If building for WooCommerce, ALWAYS inject `x-client-source: woocommerce`. Without this, orders default to `directCall` and analytics will be skewed.

## 2. THE THREE PRICING TIERS (Estimation)
Always pick the right estimation endpoint depending on the business model:
1. **Retail / App Level (`/order/estimate` & `/order/allEstimatePublic`):** Returns prices with Mengantar's retail discounts (usually 20%).
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
If testing on Sandbox (`api-key-sandbox`), hardcode these limitations to prevent false-negative debugging:
- **JNE Sandbox:** Origin `PICKUP_ADDRESS` MUST be mapped to Jakarta.
- **SAP Sandbox:** MUST be Non-COD, and the route MUST be Jakarta to Jakarta.
- **Balance Testing:** Sandbox balance requires manual top-up via Midtrans Sandbox Simulator.
