# Agribusiness, Farm Inputs & Commodity B2B

Covers: agricultural inputs (seeds, fertilizers, crop protection, soil
amendments, animal feed), plantation tools/machinery, and B2B harvest/commodity
trading surfaces. Read [README.md](README.md) first.

## 1. Job and decision path

Two distinct buyer paths often share or split across these surfaces:

- **Field growers and agricultural kiosks (retail / semi-wholesale):** identify
  whether the product solves a specific crop/stage/pest problem → verify active
  ingredient (`bahan aktif`) and official registration → check dosage per tank
  or hectare → compare pack sizes (sachet/bottle vs sack/carton) and unit cost →
  order via checkout, marketplace, or WhatsApp consultation with an agronomist.
- **B2B distributors, cooperatives, and commodity offtakers:** verify commodity
  grade specifications (moisture content, purity, germination rate, mesh size) →
  check minimum order quantity (MOQ), packaging unit (sack/tonnage/container),
  and origin warehouse → request quotation, sample, or cargo shipping schedule.

## 2. Market conventions — VERIFY per project

Confirm with the owner:

- **Official registration display:** whether products carry Kementan RI
  registration numbers (fertilizers, pesticides, certified seed varieties), SNI,
  or COA (Certificate of Analysis), and which exact numbers apply per SKU.
- **Sales channel split:** direct on-site order vs WhatsApp consultation with a
  field agronomist/sales rep vs official store links (Shopee, Tokopedia, TikTok
  Shop) for retail packs.
- **Unit and tier pricing:** retail pack (`eceran`) vs carton/sack (`dus/karung`)
  vs tonnage (`ritase/kontainer`), and whether wholesale tiers are public or
  quote-only.
- **Shipping and COD boundaries:** whether COD is restricted to small retail
  parcels while heavy sacks/drums use cargo freight (`JNE Trucking`, `Indah
  Cargo`, local truck charter) with bank transfer or down-payment terms.
- **Language and terminology:** Bahasa Indonesia with familiar field terms
  (`bahan aktif`, `dosis per tangki 16L`, `interval semprot`, `HST / Hari
  Setelah Tanam`, `kadar air`) vs English for export commodity buyers.

## 3. Must-have content inventory

- **Active composition and concentration** (`bahan aktif` / nutrient NPK ratio /
  commodity grade parameters) per SKU.
- **Target crop, growth stage, or pest/issue** and application method (foliar
  spray, soil drench, broadcast, seed treatment).
- **Dosage and application table** (rate per liter, per 16L sprayer tank, or per
  hectare, plus safety/pre-harvest interval where regulated).
- **Packaging unit, net weight/volume, and storage shelf life.**
- **Real packaging or commodity photos** (sack label, bottle, granule/seed
  closeup) and verified registration numbers where applicable.
- **Origin warehouse / shipping coverage** and handling lead time.

Ask the owner for any missing item; never invent registration numbers, lab test
results, or field-trial yields.

## 4. Reference set (to research)

Search queries for 3–6 live references (record chosen URLs and observations in
the project design artifact, never here):

- `"pupuk" OR "benih" katalog produk spesifikasi dosis site:.co.id`
- `agricultural inputs seed fertilizer product specification table website`
- `B2B agricultural commodities spec sheet moisture grade origin website`
- `crop protection product page active ingredient dosage table`

## 5. Recurring patterns

| Problem | Pattern that solves it | When it does not apply |
| --- | --- | --- |
| Growers search and compare by active ingredient or nutrient ratio before brand marketing names | Surface active composition, concentration, and target crop directly on listing cards and immediately below the PDP title | Pure equipment/tools where mechanical dimensions and power source are the primary spec |
| Buyers cannot translate per-hectare or per-liter rates into how many packs to buy | HTML dosage matrix by crop/stage paired with a simple land-area or sprayer-tank quantity calculator | Single-unit machinery or bespoke B2B contracts |
| Retail buyers and bulk kiosk/B2B buyers get confused by a single price | Explicit unit selector or tier table separating retail pack price, carton/sack price, and B2B MOQ inquiry | Businesses selling strictly one channel (e.g. export-only container loads) |
| Heavy sacks and drums cannot ship via standard regular courier rates | Clear weight and freight callout near the purchase action explaining regular parcel vs cargo trucking options | Lightweight seed packets or digital advisory services |

## 6. Category default to escape

Stock drone photos of European wheat fields, generic leaf-in-hand icons, bright
emerald-green-everything palettes, and vague "modern sustainable agritech"
slogans that hide what the product actually is, what is inside it, and how much
it costs per kilogram or liter.

## 7. Optional style directions

| Direction | Fit | Risk | Accessibility cost |
| --- | --- | --- | --- |
| **Field-manual clarity:** bright glare-resistant light surfaces, sturdy high-contrast typography, prominent specification tables, and clear pack photography | Farm inputs, fertilizers, crop protection, and seed catalogs read outdoors on mobile | Can feel utilitarian if packaging photography is weak | Low — high contrast and tabular structure aid outdoor reading |
| **Warm harvest & earth:** warm paper-toned canvas, grounded editorial headings, macro grain/commodity photography, and origin provenance storytelling | Export commodities (coffee, cocoa, spices, coconut derivatives) and organic/specialty producers | Warm low-contrast text can wash out on dim or sunlit screens if contrast is not checked | Medium — verify muted labels and table borders pass contrast |
| **Industrial supply catalog:** compact grid density, filterable technical parameters, SKU/registration codes in monospace, and fast repeat-order tables | B2B agro-chemical distributors, kiosk restocking portals, and poultry/feed supply | Can overwhelm first-time retail growers if not paired with crop-based navigation | Low when touch targets and table scroll are preserved on mobile |

## 8. Mobile notes

- Many growers and field agents browse outdoors under direct sunlight on mid- to
  low-end Android phones: prioritize high-contrast light mode, generous touch
  targets, and light page weight over heavy video banners or dark-mode effects.
- Keep dosage tables and grade specifications in real HTML tables or stacked
  key-value cards rather than text baked into pinch-to-zoom images.

## 9. Claim traps

- **Kementan RI / SNI / Organic certificates:** never display registration
  numbers or certification logos unless supplied and verified for that exact
  product.
- **Harvest yield multipliers:** avoid unsubstantiated guarantees ("panen pasti
  naik 2x lipat", "100% bebas hama permanen"). Present trial outcomes only when
  the owner provides real location, crop variety, and baseline conditions.
- **Pesticide safety:** preserve mandatory handling, dilution, and protective
  equipment warnings from the official label.

## 10. Open questions

1. Is the primary audience individual growers, agricultural kiosks/resellers, or
   B2B commodity buyers?
2. Which official registration numbers (Kementan RI, SNI, lab COA) are confirmed
   for display?
3. Do buyers check out directly on-site, order via WhatsApp consultation, or
   redirect to marketplace stores?
4. What are the packaging units, wholesale tier thresholds, and cargo shipping
   rules for heavy orders?
