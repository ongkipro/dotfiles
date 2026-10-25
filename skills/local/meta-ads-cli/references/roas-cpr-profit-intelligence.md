# Meta Ads ROAS, Lowest CPR, Profit Maximization & Multi-Source Memory System

Engineering and media-buying operating guide for achieving **maximum Net Profit, highest ROAS, and lowest Cost Per Result (CPR / CPA)** on conversion campaigns (`OUTCOME_SALES` / `OFFSITE_CONVERSIONS` / `VALUE`), powered by `dotads-meta learn` and `dotads-meta analyze`.

---

## 1. The Conversion Auction & Profit Equations

Meta's Lattice auction does not award impressions to the highest bidder alone; it ranks every candidate ad by **Total Value**:

$$\text{Total Value} = (\text{Advertiser Bid} \times \text{Estimated Action Rate } eCVR) + \text{Ad Quality / User Value}$$

Because Meta prices the winning impression just above the second-place ad's Total Value (VCG-style pricing), increasing your **Hook Rate, Hold Rate, Engagement, and CAPI Signal Match Quality** directly increases $\text{User Value}$ and $eCVR$—allowing you to win premium buyer impressions at a **30–50% lower effective CPM and CPR**.

### Decomposing CPR and ROAS into Physical Levers

$$\text{CPR (Cost Per Purchase)} = \frac{\text{CPM}}{1000 \times \text{CTR}_{\text{outbound}} \times \text{CVR}_{\text{landing}}}$$

$$\text{ROAS} = \frac{\text{AOV} \times \text{CVR}_{\text{landing}} \times \text{CTR}_{\text{outbound}} \times 1000}{\text{CPM}}$$

| Lever | Benchmark Target | Primary Owner & How to Improve |
| --- | --- | --- |
| **Hook Rate** (`3s Video Views / Impressions`) | `>= 30%` (Warning `< 25%`) | **First 3 Seconds:** Visual pattern interrupt, high-contrast on-screen headline overlay, direct callout to the buyer's core pain or desire in frame 1. |
| **Hold Rate** (`ThruPlays / 3s Video Views`) | `>= 25%` (Warning `< 20%`) | **Seconds 3–15 Pacing:** Cut scenes every 1.5–2.5 seconds, show the physical product mechanism/demo by second 4, use burned-in captions. |
| **Outbound CTR** (`Outbound Clicks / Impressions`) | `>= 1.5%` (Warning `< 1.0%`) | **Offer & CTA Clarity:** Clear value stack (bundle savings, free exchange/guarantee, urgency) and explicit verbal + visual CTA. |
| **Landing Page CVR** (`Purchases / Outbound Clicks`) | `>= 2.5% – 5.0%+` | **Funnel & Signal:** Fast mobile LCP (`< 2.5s`), 1:1 headline congruence with the ad hook, frictionless checkout, and deduplicated Server CAPI (`meta-ads-signal-engine`). |
| **Average Order Value (AOV)** | `1.4x – 1.8x` single-unit price | **Bundle Architecture:** Offer 1-Pack (Anchor), 2-Pack ("Most Popular — Save 15%"), and 3-Pack ("Best Value — Save 25% + Free Shipping"). Raising AOV raises ROAS and Max CPR immediately without needing cheaper traffic. |

---

## 2. True Unit Economics & COD RTS Profit Modeling

High dashboard ROAS can still lose money if COGS, shipping subsidies, or Cash-on-Delivery (COD) Return-to-Sender (RTS) rates are ignored. Always configure unit economics in the brand workspace first:

$$\text{Delivered Rate } d = 1 - r_{\text{RTS}}$$

$$\text{Contribution Margin per Order} = (\text{AOV} \times d) - ((\text{COGS} + \text{Shipping}) \times d) - (\text{RTS Penalty} \times r_{\text{RTS}})$$

$$\text{Max Break-Even CPR} = \text{Contribution Margin per Order}, \qquad \text{Break-Even ROAS} = \frac{\text{AOV}}{\text{Max Break-Even CPR}}$$

$$\text{Target Profit CPR} = \text{Contribution Margin per Order} - (\text{AOV} \times m_{\text{target}}), \qquad \text{Target ROAS} = \frac{\text{AOV}}{\text{Target Profit CPR}}$$

### Configure Unit Economics in `<workspace>/memory/`

```bash
# Example: IDR 250,000 AOV, IDR 75,000 COGS, IDR 15,000 shipping subsidy, 12% COD RTS rate, 20% target net margin
dotads-meta learn unit-economics \
  --brand ~/Documents/work/ads/brand-alpha/brand.json \
  --aov 250000 \
  --cogs 75000 \
  --shipping-fee 15000 \
  --cod-rts-rate 0.12 \
  --rts-penalty 20000 \
  --target-margin 0.20
```

This persists `unit_economics` into `<workspace>/memory/ads-memory.json` and renders `<workspace>/memory/MEMORY.md` with exact Break-Even ROAS, Max CPR, Target Profit CPR, Target ROAS, and **Recommended Cost Cap (`0.85 × Target CPR`)**.

### The ROAS-First Metric Hierarchy (`ROAS = (AOV × CVR) / CPC`)

**Final Target = ROAS (and Net Profit); CTR & CPC Are Secondary Diagnostic Levers Only:**

$$\text{CPC} = \frac{\text{Spend}}{\text{Outbound Clicks}} = \frac{\text{CPM}}{1000 \times \text{CTR}}, \qquad \text{CPR} = \frac{\text{CPC}}{\text{CVR}}, \qquad \text{ROAS} = \frac{\text{AOV}}{\text{CPR}} = \frac{\text{AOV} \times \text{CVR}}{\text{CPC}}$$

- **Primary Gate (`ROAS` & `Net Profit`):** An ad is a `SCALE_WINNER` if and only if **`ROAS >= Target ROAS`** (or `CPR <= Target CPR` when order revenue is not tracked). Even if an ad has a modest `CTR` (`1.1%`) or higher `CPC`, if its copy pre-qualifies buyers so `CVR` and `AOV` push **`ROAS >= Target ROAS`**, you **scale it**.
- **Why Cheap `CPC` / High `CTR` Alone Is a Trap:** Clickbait copy or spammy CTAs (`"Klik di sini!"`) artificially inflate `CTR` and lower `CPC`, but attract low-intent clickers (`CVR -> 0%`), collapsing **ROAS** below break-even.
- **When to Inspect `CTR` and `CPC`:** Only when **ROAS is below target**—use `Hook Rate`, `Hold Rate`, `Outbound CTR`, and `CPC` to isolate whether the ROAS bottleneck is in the creative (`CTR < 1.0%` / high `CPC` → `FIX_OFFER_OR_CTA`) or on the landing page/checkout (`CTR >= 1.0%` & healthy `CPC` but low `CVR` → `FIX_LANDING_CVR_OR_SIGNAL`).

---

## 3. Multi-Source Continuous Learning (`dotads-meta learn` & `analyze`)

Every brand workspace maintains its own structured intelligence store at `<workspace>/memory/ads-memory.json` and `<workspace>/memory/MEMORY.md`, learning continuously from four sources:

### Source A: Learn Automatically from 1st-Party Meta Ads Data (`dotads-meta analyze`)

Pull ad-level performance insights directly from Meta (or pass an existing JSON file), reconcile COD/backend delivery rate if needed, and run the automated 8-bucket diagnostic analyzer:

```bash
# Option 1: One-command live pull + COD delivery-rate reconciliation (e.g. 88% delivered) + memory capture
dotads-meta analyze --pull --date-preset last_7d --delivery-rate 0.88 --brand ./brand.json --record-memory

# Option 2: Analyze a saved insights JSON file (supports optional row-level real_purchases / real_revenue)
dotads-meta analyze ./insights-last-7d.json --brand ./brand.json --record-memory
```

`dotads-meta analyze` classifies every ad into one of 8 deterministic buckets and outputs a Day-2 `recommended_command` (scaling `+20%` for winners or `--status PAUSED` on `stop_loss` bleeders where `spend >= 1.5x Max CPR`):

| Classification | Trigger Condition | Automated Action & Memory Capture |
| --- | --- | --- |
| `SCALE_WINNER` | `purchases >= 1` and (`ROAS >= Target ROAS`, or `CPR <= Target CPR` when revenue is untracked) | Saved as `winner` in `ads-memory.json`. Emits Day-2 CLI plan to scale budget `+20%` every 24–48h or graduate into Advantage+ Sales CBO; brief 3 new hook variations on this angle. |
| `PROFITABLE_OPTIMIZE` | `ROAS >= Break-Even ROAS` but `< Target ROAS` | Keep active; test higher-AOV bundle on landing page or fresh 3s visual hook to push ROAS above target. |
| `MONITOR_EARLY` | `purchases == 0` and `spend < 1.0x Max Break-Even CPR` | Protected from premature pause and excluded from `loser` memory until spend reaches `1.0x–1.5x Max CPR`. |
| `CREATIVE_FATIGUE` | Below target ROAS with `Frequency >= 2.5` | Saved as `loser` (`angle`). Audience saturation—rotate a fresh creative concept (new 3s visual opener and persona). |
| `FIX_HOOK_FIRST_3S` | Below break-even and `Hook Rate < 25%` | Saved as `loser` (`hook`). Keep body video, replace first 3-second visual pattern interrupt and headline overlay. |
| `FIX_HOLD_BODY_PACING` | Below break-even, `Hook Rate >= 25%`, `Hold Rate < 20%` | Saved as `loser` (`format`). Tighten middle editing (cut every 1.5–2.5s), show product mechanism by second 4, add captions. |
| `FIX_OFFER_OR_CTA` | Below break-even, good Hook/Hold, `Outbound CTR < 1.0%` | Saved as `loser` (`offer`). Strengthen bundle offer, risk reversal/guarantee in headline/description, and align native `call_to_action` button without stuffing spammy text CTAs. |
| `FIX_LANDING_CVR_OR_SIGNAL` | `Outbound CTR >= 1.0%` & healthy `CPC`, but `ROAS < Break-Even ROAS` | Saved as `loser` (`landing-page`). Audit mobile page speed (`web-perf`), message congruence, COD form friction, CAPI EMQ (`meta-ads-signal-engine`), and enable `incremental_attribution`. |

### Source B: Learn from Competitor & Ad Library References (`--source competitor` / `reference`)

After researching competitor ads in `meta-ads-scout` (focusing on ads running continuously for `>= 30 days`, which signals profitable unit economics), record the extracted pattern into the brand memory:

```bash
dotads-meta learn add --brand ./brand.json \
  --source competitor \
  --category hook \
  --verdict insight \
  --title "Competitor 45-Day Active Hook: Split-Screen Wet Floor Slip Test" \
  --summary "Top competitor has scaled a 9:16 split-screen slip test video for 45+ days across ID/MY." \
  --action "Produce our own physical slip-resistance demonstration in first 3 seconds for next creative batch."
```

### Source C: Learn from Outsource, Agency Media Buyers & Audits (`--source outsource` / `audit` / `experiment`)

Capture external media-buyer playbooks, agency post-mortems, or split-test conclusions directly into the workspace memory:

```bash
dotads-meta learn add --brand ./brand.json \
  --source outsource \
  --category bidding \
  --verdict rule \
  --title "Cost Cap Floor at 0.85x Target CPR Prevents Payday CPM Spikes" \
  --summary "External media buyer test showed Lowest Cost CPMs spiked +40% on payday (25th-5th) with lower CVR, whereas Cost Cap at 0.85x Target CPR held CPA flat." \
  --action "Deploy a parallel Cost Cap campaign during payday windows with bid_amount set to recommended_cost_cap."
```

### Source D: Promote Verified Cross-Brand Invariants to Shared Dotfiles Memory (`ai-learn`)

When a lesson proved across multiple campaigns is a durable engineering or media-buying invariant (no client secrets or raw logs), capture a review candidate into the global dotfiles inbox:

```bash
ai-learn capture \
  --title "Use AUTOMATIC_FORMAT instead of dynamic_creative for multi-concept ad sets" \
  --symptom "Adding a second multi-asset creative to a dynamic_creative ad set failed validation" \
  --root-cause "Meta Marketing API restricts dynamic_creative: true ad sets to a single ad" \
  --invariant "Use ad_format: AUTOMATIC_FORMAT on each creative when testing multiple multi-asset concepts in one consolidated ad set" \
  --fix "Set ad_format: AUTOMATIC_FORMAT on creatives and omit dynamic_creative on the ad set" \
  --check "dotads-meta validate passes with multiple AUTOMATIC_FORMAT creatives in one ad set" \
  --scope shared
```

---

## 4. End-to-End High-ROAS & Low-CPR Execution Playbook

1. **Before Writing Any Campaign JSON:**
   - Run `dotads-meta learn list --brand ./brand.json` (or read `<workspace>/memory/MEMORY.md`).
   - Check `unit_economics` (`max_cpr_breakeven`, `target_cpr`, `target_roas`, `recommended_cost_cap`).
   - Review all `winner` hooks/angles to iterate on, and all `loser` hooks/angles to avoid repeating.
2. **Phase 1 — Creative Concept Testing (Low-Risk Discovery):**
   - Launch 3–5 genuinely distinct creative concepts (different visual opener, persona, and format to prevent **Andromeda Entity Collapse**).
   - Use either **Consolidated CBO with `"ad_format": "AUTOMATIC_FORMAT"`** (3 images/videos × 2 bodies × 2 titles per concept) or **Flex Budget (`"adset_budget_sharing": true`)** when strict per-concept spend minimums are needed.
3. **Phase 2 — Data Analysis & Memory Harvesting (After 2–3x Max CPR Spend per Concept):**
   - Pull insights and run `dotads-meta analyze insights.json --brand ./brand.json --record-memory`.
   - Pause `FIX_*` losers immediately and queue specific creative/funnel fixes based on the bottleneck (`Hook` vs `Hold` vs `CTR` vs `Landing CVR`).
4. **Phase 3 — Profitable Scaling (`ADVANTAGE_PLUS_SALES` + Cost Cap Protection):**
   - Graduate `SCALE_WINNER` creatives into the primary **Unified Advantage+ Sales Campaign** (`objective: "OUTCOME_SALES"`, CBO budget, `"advantage_audience": true`, `"incremental_attribution": true`, `"contextual_multi_ads": false`).
   - For high-budget scaling with strict margin protection, deploy a parallel **Cost Cap** ad set (`"bid_strategy": "COST_CAP"`, `"bid_amount": <recommended_cost_cap_in_minor_units>`) or **Minimum ROAS** (`"bid_strategy": "LOWEST_COST_WITH_MIN_ROAS"`) so Meta never bids on impressions whose expected CPR exceeds your profit ceiling.

---

## 5. AI-Aligned Conversion Ad Copy & Strict Market Localization (`ID` vs `MY`)

### 5.1 How Meta Andromeda NLP & Lattice Score Ad Copy

In the 2025–2026 Meta Ads architecture, **Ad Copy Is Semantic Targeting**:

1. **Multimodal Semantic Retrieval (Andromeda)**:
   - Andromeda's deep retrieval neural network tokenizes `body` (Primary Text), `title` (Headline), `description`, and on-screen video/image OCR text into dense semantic embeddings, matching those embeddings against users who recently exhibited high purchase intent for that specific problem, category, and price point.
   - When you fill the first 125 characters of `body` or the 27–40 characters of `title` with generic command clutter (`"Klik link di bawah!"`, `"Chat WA sekarang!"`, `"Beli sekarang juga sebelum kehabisan!"`), you starve Andromeda of the **domain nouns, buyer pain points, and product mechanism tokens** it needs to retrieve actual buyers.
2. **Lattice Ad Quality & Engagement-Bait Penalty**:
   - Meta's auction Total Value formula (`Bid × eCVR + Ad Quality`) penalizes ads that read like hard-sell spam, clickbait (`"Klik di sini"`), or off-funnel redirects (`"Hubungi WA"` on an `OFFSITE_CONVERSIONS` website checkout campaign).
   - Furthermore, on `OUTCOME_SALES` (`OFFSITE_CONVERSIONS`), telling users in the text to *"Chat WA"* while optimizing the ad set for website `PURCHASE` splits user behavior and trains the pixel on low-intent browsers instead of self-serve checkout buyers.
3. **The Native CTA Button Rule**:
   - Meta Ads already renders a dedicated, thumb-reachable UI button via `call_to_action` (`"SHOP_NOW"` or `"LEARN_MORE"`).
   - **Never waste `body`, `title`, or `description` repeating button commands.** Let the copy build **conviction and desire** (Problem → Mechanism → Proof → Risk Reversal), and let the native `call_to_action` button handle the click.

### 5.2 Field-by-Field Conversion Copy Architecture (`OUTCOME_SALES`)

| Creative Field | Mobile Viewport Limit | Role in Andromeda & Buyer Psychology | What to Write (High Conversion) | What to Avoid (Linted by `dotads-meta validate`) |
| --- | --- | --- | --- | --- |
| `body` / `bodies` (Primary Text) | **First 125 chars** visible before *"…Lihat Selengkapnya"* | **Semantic Retrieval + Scroll Stop + Mechanism** | Line 1: Specific situational symptom/problem (`"Tumit sering nyeri setelah berdiri atau jalan seharian?"`).<br>Line 2: Concrete mechanism + quantified proof (`"Insole dual-density memory foam menopang lengkung kaki dan meredam 68% tekanan tumit."`). | Generic greetings, ALL-CAPS shouting, emoji walls, `"Klik link di bawah"`, `"Chat WA sekarang"`, `"Beli sekarang juga"`. |
| `title` / `titles` (Headline) | **27–40 chars** (truncates past ~40 chars on mobile Feed) | **Value Prop / Offer Anchor next to the CTA button** | Concrete outcome, bundle value, or risk-reversal hook (`"Solusi Jalan Jauh Tanpa Pegal"`, `"Hemat 25% Paket 2 Pasang"`). | Repeating the brand name alone, `"Klik Di Sini"`, `"Order Sekarang Juga"`. |
| `description` / `descriptions` | **25–30 chars** (shown on high-intent Feed placements) | **Frictionless Trust Signal / Objection Killer** | Shipping speed, exchange guarantee, or social proof (`"Garansi tukar ukuran 14 hari"`, `"42.000+ pasang terjual di ID"`). | Pushy CTA commands or long sentences that get cut off mid-word. |
| `call_to_action` | Native UI Button | **Single Action Trigger** | `"SHOP_NOW"` (direct e-commerce/catalog) or `"LEARN_MORE"` (advertorial / high-ticket consideration). | Mixing website `SHOP_NOW` with `"Chat WA"` instructions inside the text. |

### 5.3 Strict Market Localization: Indonesia (`ID`) vs Malaysia (`MY`)

When `targeting_countries` targets **Indonesia (`["ID"]`)**, all copy (`title`, `body`, `description`, video subtitles, and image overlays) **must** use natural **Bahasa Indonesia for the Indonesian market**—**never** Malaysian Malay (`BM` / `MY`).

Even a single Malaysian Malay word in an Indonesian ad destroys native brand trust and can invert the meaning of your offer (most famously: **`"percuma"` means *"free"* in Malaysia, but means *"useless / sia-sia"* in Indonesia!**).

`dotads-meta validate` automatically scans creative text fields on `"ID"`-targeted ad sets and warns if any Malaysian Malay vocabulary leaks into Indonesian ad copy:

| Concept | Forbidden in Indonesia (`ID`) — *Malaysian Malay (`MY`)* | Mandatory in Indonesia (`ID`) — *Bahasa Indonesia* | Why It Matters for Conversion |
| --- | --- | --- | --- |
| Free / Complimentary | `percuma` (`"Penghantaran percuma"`) | `gratis` / `bebas ongkir` (`"Gratis ongkir"`) | In Indonesia, `"percuma"` means **"sia-sia / useless"**! Writing `"Penghantaran percuma"` tells Indonesian buyers your delivery is useless. |
| Shipping / Delivery | `penghantaran` | `pengiriman` / `ongkir` | `"Penghantaran"` is unnatural in Indonesian e-commerce. |
| Discount | `diskaun` / `potongan diskaun` | `diskon` / `potongan harga` / `hemat` | `"Diskaun"` immediately signals a non-Indonesian / translated ad. |
| Order / Pre-order | `tempah` / `tempahan` | `pesan` / `pesanan` / `pre-order` | In Indonesia, `"menempah"` is archaic/foreign; buyers say `"pesan"`. |
| Money-Back Guarantee | `wang dikembalikan` / `pulangan wang` | `garansi uang kembali` | `"Wang"` is Malaysian Malay; Indonesian uses `"uang"`. |
| Visit Website | `sila layari` / `layari laman web` | `cek selengkapnya` / `kunjungi website` | `"Sila layari"` is pure Malaysian formal phrasing. |
| Anytime | `bila-bila masa` | `kapan saja` | Idiomatic mismatch that breaks reading flow. |
| Mobile Phone | `telefon bimbit` / `telefon pintar` | `HP` / `smartphone` / `ponsel` | Nobody in Indonesia says `"telefon bimbit"`. |
| Staff / Team | `kakitangan` / `kaki tangan` | `tim` / `staf` / `tim CS` | In Indonesia, `"kaki tangan"` has a negative connotation (*"henchman / accomplice"*). |
| Side Effect | `kesan sampingan` | `efek samping` | Crucial for skincare/supplement/wellness compliance and clarity. |
| Size | `saiz` | `ukuran` / `size` | `"Saiz"` is Malaysian phonetic spelling. |

### 5.4 Canonical High-Converting Indonesian (`ID`) Ad Copy Examples

- **Example A — Problem/Mechanism/Proof (`OUTCOME_SALES`, Indonesia Market, Zero Pushy CTA in Text):**
  - `body`: `"Tumit sering nyeri setelah berdiri atau jalan lebih dari 4 jam? Insole ortopedi dual-density ini menopang lengkung kaki dan meredam 68% tekanan di titik tumpu. Sudah dipakai 42.000+ pekerja aktif di seluruh Indonesia."`
  - `title`: `"Jalan Seharian Tanpa Nyeri Tumit"`
  - `description`: `"Garansi tukar ukuran 14 hari"`
  - `call_to_action`: `"SHOP_NOW"`
- **Example B — Comparison / Value Bundle (`AUTOMATIC_FORMAT` Multi-Text Array, Indonesia Market):**
  - `bodies`:
    1. `"Kemeja biasa gampang kusut setelah 2 jam di perjalanan. Katun Tencel anti-kusut ini tetap rapi dari pagi sampai meeting sore tanpa perlu disetrika ulang."`
    2. `"Adem di cuaca tropis Indonesia dan tidak menerawang. Jahitan rantai ganda yang tetap presisi meski dicuci puluhan kali."`
  - `titles`:
    1. `"Tetap Rapi Seharian Tanpa Setrika"`
    2. `"Paket Hemat 2 Pcs — Gratis Tukar Size"`
  - `descriptions`:
    1. `"Dikirim di hari yang sama"`
  - `call_to_actions`: `["SHOP_NOW"]`
