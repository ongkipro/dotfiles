---
name: tokophi-provider-brand-hidden
description: "TokoΦ white-label rule — hide provider brand names (KiriminAja, AutoLaris) from client surfaces; only super-admin shows them"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a3473a68-f7cb-4f46-aa14-c07821480525
---

In [[tokophi-project]], the underlying **provider/aggregator brand names must NOT be shown to the client** (merchant admin + storefront). This covers shipping (**KiriminAja**), the payment gateway (**AutoLaris**), and any future provider.

**Why:** platform-managed / white-label model (ADR 0004) — the platform (TokoΦ) provides shipping + payments "matang"; merchants and shoppers should see TokoΦ + generic labels, not the third-party vendor.

**How to apply:**
- Client-facing UI (merchant admin, storefront) → use generic labels only: courier service names (JNE/SiCepat), bank/method names ("Virtual Account BCA", "QRIS"), "ongkir real-time", "dikelola TokoΦ". Never render "KiriminAja"/"AutoLaris" in visible text.
- **Super-admin** (platform control plane, = us) MAY show the provider brand (it's the platform config view).
- Code comments / internal identifiers / `.env` keys keeping the brand are fine (not client-visible).

See [[kiriminaja-integration]] + [[autolaris-payment-integration]].
