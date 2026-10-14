# Logistics, Courier Aggregator & Express Shipping

Covers: multi-courier shipping aggregators, domestic/international cargo
platforms, fulfillment centers, and COD logistics/tracking portals. Read
[README.md](README.md) first.

## 1. Job and decision path

Visitors arrive with one of three immediate operational tasks:

1. **Track a shipment (`Lacak Resi / AWB`):** paste one or more waybill numbers
   → view current transit stage, timestamped hub history, and exception recovery
   options if delivery failed.
2. **Compare shipping rates (`Cek Ongkir`):** enter origin and destination at
   sub-district (`Kecamatan`) granularity plus weight/dimensions → compare
   regular, express, and cargo services across couriers by price, SLA days, and
   COD eligibility.
3. **Evaluate seller shipping/COD terms (merchant acquisition):** verify courier
   coverage, pickup rules, COD fee percentage, disbursement schedule, shipping
   discount tiers, and Non-Delivery Report (`Kendala Pengiriman` / RTS) support
   → register or contact sales.

## 2. Market conventions — VERIFY per project

Confirm with the owner:

- **Address granularity:** Indonesian tariff lookup requires sub-district
  (`Kecamatan`) or postal code precision; confirm which location autocomplete
  database or courier API powers the rate check.
- **Supported couriers and service tiers:** which carriers (JNE, J&T, SiCepat,
  SAP, Ninja, ID Express, POS, Lion Parcel, Pahala/Indah Cargo) and service types
  (Regular, Next Day, Cargo/Trucking, Same Day) are actually integrated.
- **COD commercial terms:** exact COD fee %, minimum fee, disbursement cycle
  (daily, `H+1`, weekly), and return-shipping cost rules when a parcel is
  rejected (RTS).
- **Pickup vs drop-off rules:** minimum parcel count for free pickup, cutoff
  hours, and warehouse/drop-point coverage.
- **Volumetric divisor:** standard divisor (`(P × L × T) ÷ 6000` for regular air/
  land vs `÷ 4000` for cargo trucking/sea) used by the platform.

## 3. Must-have content inventory

- **Live or accurately scoped tariff calculator (`Cek Ongkir`)** and **AWB
  tracker (`Lacak Resi`)** if the platform exposes public lookup endpoints.
- **Verified list of integrated courier partners** and service categories.
- **Transparent fee and disbursement table** (COD fee %, shipping cashback/
  discount terms, settlement schedule, RTS handling).
- **Concrete COD settlement example** showing gross parcel value, shipping cost,
  COD fee deduction, and net disbursed amount.
- **Exception / NDR workflow explanation** showing how sellers are notified and
  how problem deliveries are resolved before return.
- **Support channels, SLA escalation path, and legal entity details.**

Ask the owner for any missing item; never invent courier partnerships, discount
percentages, or settlement speeds.

## 4. Reference set (to research)

Search queries for 3–6 live references (record chosen URLs and observations in
the project design artifact, never here):

- `aggregator kurir cek ongkir kecamatan lacak resi COD website`
- `multi-carrier shipping aggregator rate calculator tracking page`
- `ecommerce fulfillment COD settlement NDR management landing page`
- `cargo express shipping volumetric calculator tariff comparison table`

## 5. Recurring patterns

| Problem | Pattern that solves it | When it does not apply |
| --- | --- | --- |
| Visitors leave when forced to create an account just to check a rate or track an AWB | Place a tabbed or split `Cek Ongkir` + `Lacak Resi` utility directly above the fold with no registration wall | Private internal warehouse consoles with no public lookup |
| Shippers miscalculate chargeable weight for bulky, lightweight boxes | Inline collapsible volumetric calculator (`P × L × T cm`) beside the weight input that automatically highlights chargeable weight | Document-only courier services |
| Sellers distrust aggregators due to hidden COD deductions or slow payouts | Explicit fee breakdown table paired with a worked rupiah/ringgit payout calculation example | Non-COD freight forwarders |
| Recipients and sellers cannot tell whether a delayed parcel needs action | Tracking timeline that separates normal transit hubs from actionable delivery exceptions (`Kendala Pengiriman`: address unclear, recipient unreachable) | Marketing-only pages without tracking |

## 6. Category default to escape

Stock photos of cargo airplanes, container ships, andglobe network meshes on a
software aggregator that owns no aircraft or vessels; vague "fastest & cheapest
shipping in Indonesia" claims without a rate calculator or fee table; and hiding
COD fees or RTS terms in fine print.

## 7. Optional style directions

| Direction | Fit | Risk | Accessibility cost |
| --- | --- | --- | --- |
| **Utilitarian dispatch & tabular precision:** high-contrast light canvas, prominent search/calculator inputs, monospace waybill/postal codes, and scannable rate comparison tables | Public rate/tracking portals, courier aggregators, and high-volume seller tools | Can look sparse if the calculator results state is not designed | Low — high contrast and tabular layout suit rapid number scanning |
| **Operations control & workflow proof:** structured step-by-step diagrams showing pickup → hub transit → NDR rescue → daily settlement, paired with real dashboard previews | B2B merchant acquisition pages for COD aggregators and 3PL fulfillment centers | Dashboard previews become illegible on mobile if shrunk as full-screen screenshots | Medium — crop or rebuild key UI states as readable responsive cards |
| **Regional cargo & industrial freight:** sturdy typographic hierarchy, clear weight/tonnage tier matrices, route coverage maps, and direct dispatch contact | Heavy cargo, inter-island trucking/container forwarding, and B2B distribution | Route lists can become long without search/filter by province or city | Low when route tables remain keyboard- and mobile-friendly |

## 8. Mobile notes

- Sellers and buyers frequently paste AWB numbers or check rates from WhatsApp on
  a phone: ensure the AWB input supports one-tap paste, strips accidental
  leading/trailing spaces, and keeps results readable without horizontal table
  scrolling.
- In tariff comparison results on narrow screens, group courier name, service
  tier, SLA estimate, COD badge, and price into a compact two-line row rather
  than a 6-column table that clips the price.

## 9. Claim traps

- **Courier discount and cashback percentages:** state exact conditions (which
  couriers, which service tiers, whether discounts apply to COD or non-COD, and
  whether they are promotional or permanent).
- **Delivery SLA guarantees:** present transit days as carrier estimates unless
  the service includes an explicit money-back SLA guarantee.
- **Coverage claims:** do not claim "100% seluruh pelosok Indonesia" unless
  verified; let the sub-district rate lookup prove actual coverage.

## 10. Open questions

1. Does the public site have live API endpoints for `Cek Ongkir` (sub-district
   level) and `Lacak Resi`, or is it a merchant acquisition landing page?
2. Which exact courier partners and service tiers are active and approved for
   display?
3. What are the verified COD fee percentages, disbursement schedules, and
   shipping discount rules?
4. What is the primary merchant conversion action (self-serve dashboard sign-up,
   WhatsApp sales onboarding, or API documentation)?
