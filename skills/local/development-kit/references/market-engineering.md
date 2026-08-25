# Indonesia and Malaysia Market Overlay

Adaptive engineering aid only; not legal, tax, privacy, certification, payment, logistics, or market advice. It must not block unrelated product development. Activate a concern only when the real product, entity, users, data, transaction, territory, or contract triggers it.

## Activation policy

- Keep the secure engineering baseline: authorization, tenant isolation where applicable, financial integrity, replay safety, secrets, trust-boundary validation, migration safety, and recovery evidence.
- Treat locale, language, payment rail, tax, invoicing, residency, registration, logistics, messaging channel, currency, and regional infrastructure as optional capabilities until project facts activate them.
- Indonesia and Malaysia are separate jurisdictions and markets. Never copy a conclusion, identifier format, tax rule, payment method, privacy deadline, or hosting assumption from one into the other.
- Unknown market detail blocks only the dependent decision, such as production payments or tax calculation; it does not block unrelated development.

## Source discipline

For every activated policy-relevant claim record:

- authority and instrument;
- exact article/section or official API product and endpoint;
- version, legal/status date where available, and retrieval date;
- trigger facts and unknown facts;
- qualified owner and decision;
- engineering impact, safeguards, evidence, and recheck trigger.

Prefer current official legislation portals and official vendor documentation for the applicable country. Secondary explainers may help discovery but do not own the requirement.

## Indonesia authorities to recheck when triggered

- [UU No. 27 Tahun 2022 — Pelindungan Data Pribadi](https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022): roles, rights, processing duties, breach notice, transfers, and sanctions. Article 46 is the source for written breach notification no later than `3 x 24` hours; do not reuse that deadline for portability or every data-subject request.
- [PP No. 71 Tahun 2019 — Penyelenggaraan Sistem dan Transaksi Elektronik](https://peraturan.bpk.go.id/Details/122042/pp-no-71-tahun-2019): electronic-system obligations and location rules. Article 20 distinguishes Public Scope and Private Scope operators; do not assert mandatory Indonesian hosting for every private SaaS without a separate applicable rule or contract.
- [UU No. 7 Tahun 2021 — Harmonisasi Peraturan Perpajakan](https://peraturan.bpk.go.id/Details/185162/uu-no-7-tahun-2021): statutory tax framework. Tax computation must be effective-dated and policy-owned rather than a permanent `0.11` constant.
- Current implementing tax regulations and official DJP guidance for the actual taxable supply, invoice, buyer, and effective date. For example, [DJP discussion of PMK 131/2024](https://www.pajak.go.id/id/artikel/pmk-1312024-tarif-ppn-sebelas-dua-belas) explains the 12% statutory rate and `11/12` other-value mechanism for covered non-luxury supplies; the tax owner must confirm applicability.

Recheck current PSE registration, sector, financial-services, health, telecommunications, consumer-protection, electronic-signature, records, and licensing obligations only when trigger facts activate them. For Malaysia, retrieve the current official instruments and regulator or vendor material for the exact activated concern; this reference intentionally carries no copied Indonesia conclusion or unverified Malaysia rule.

## Engineering contracts

### Identity and local data

- Keep legal name, display name, phone, address, bank, business-registration fields, and any country-specific legal or tax identifier distinct.
- Do not collect NIK, NPWP, Malaysian identifiers, or other sensitive national identifiers unless a documented purpose, applicable basis, access policy, retention, masking, export, and erasure path require them.
- Validation syntax is not authority verification. Identifier formats and migration rules change; use current official policy and label legacy compatibility explicitly.
- Normalize phone numbers to E.164 where downstream systems support it; preserve the original user-entered representation only when required.

### Locale, time, and money

- Use the project-selected locale such as `id-ID`, `ms-MY`, or `en-MY`, the explicit applicable business timezone, ISO currency codes, and native `Intl` formatting; never force every supported market or language into every product.
- Store instants in UTC and the business timezone/offset needed to reproduce legal or financial cutoffs.
- Store money in integer minor units with explicit currency and rounding policy. Never use binary floating point for ledger or tax calculations.
- Effective-date tax policies, invoice numbering, inclusive/exclusive pricing, withholding, and rounding belong to the finance/tax owner.

### Payments

- Decide gateway and product from actual merchant entity, settlement currency, payment methods, licensing boundary, refund/reversal needs, recurring-payment model, and reconciliation operations.
- Verify webhook authentication against the current official documentation for the exact API. A Midtrans Core API `signature_key` body formula, a Snap notification, and another vendor's HMAC header are not interchangeable.
- Persist provider event identity, raw immutable receipt where lawful, normalized state, idempotency outcome, ledger impact, and reconciliation status.
- Model pending, challenge, settlement, expiration, denial, cancellation, refund, chargeback, duplicate, out-of-order, delayed, and unknown-provider states where the chosen rail exposes them.
- Grant entitlement from server-authoritative, verified, reconciled payment state; never from browser redirect alone.

### Logistics and COD

- Separate rate quote, booking, pickup, manifest, tracking, delivery, COD remittance, return-to-origin, cancellation, and dispute states.
- Treat courier service codes, coverage, volumetric-weight divisors, cutoffs, COD fees, insurance, address rules, and tracking transitions as vendor-owned effective-dated data.
- Preserve idempotency across order creation and booking; reconcile COD remittance independently from shipment delivery.
- Use `mengantar-api` when that aggregator is selected; do not generalize its sandbox, concurrency, balance, header, or courier constraints to other providers.

### Privacy and operations

- Maintain processing purpose, category, data subject, processor, storage/remote access, retention/deletion, recipient, transfer, security, evidence, owner, and status.
- A database region alone does not prove compliance; account for backups, logs, analytics, support access, email, object storage, subprocessors, and incident tooling.
- Breach workflow must preserve discovery time, assessment, notification decision, recipients, content, dispatch evidence, remediation, and lessons while minimizing leaked data in incident artifacts.
- Legal holds, backup expiry, immutable financial records, and data-subject rights require explicit conflict-resolution policy.

## Claims to reject without primary evidence

Reject unsourced claims such as card penetration, WhatsApp or email open rates, universal QRIS preference, fixed gateway market share, absolute domestic-hosting mandates, universal `72-hour` rights fulfillment, permanent `11%` PPN, guaranteed payment success improvements, or fixed courier coverage. Keep them out of normative requirements until verified for the relevant date, market, segment, and product decision.
