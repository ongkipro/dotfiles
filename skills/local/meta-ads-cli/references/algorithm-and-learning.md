# Meta delivery, measurement and learning considerations

Reviewed **2026-11-05**. Read this before turning account evidence into a
hypothesis, experiment or campaign change. It explains what Meta has published
about its delivery and measurement systems and what that implies for
`dotads-meta` learning. Tracking implementation belongs to
`meta-ads-signal-engine`; economics rules to
[performance interpretation](roas-cpr-profit-intelligence.md); dated API facts
to the [source record](api-and-evidence.md).

Labels used below: **Meta** = Meta's own published statement; **third-party** =
reporting or interpretation by others; **local** = this skill's operating
heuristic. Meta-reported lifts are internal averages without public method or
baseline; they are not a forecast for an account.

## 1. How delivery works (what Meta has published)

| Stage | Published facts | What it does not establish |
| --- | --- | --- |
| Eligibility | Targeting, placements, policy and budget define who may see an ad. 2026 Andromeda enforces "full fidelity of production targeting semantics" (Meta, 2026-10-28). | That targeting is irrelevant. |
| Retrieval — Andromeda | 2026 version scores **every eligible ad** at "over one billion ads per second", ~100x the 2024 system, "near ranking-level" quality (Meta, 2026-10-28). A parallel generative retrieval model built on GenRecs adds candidates (Meta via AdExchanger, 2026-10). | A rule that drops "duplicate" ads or a reset after edits. |
| Content understanding — GenRecs | Ads are described by shared **semantic tokens** (attributes such as category, brand, style) instead of isolated IDs. New ads/products can inherit what the model knows about similar items; helps cold-start and "tail" inventory most. Reported +0.35% conversions with GEM and the Adaptive Ranking Model, Meta internal data, February 2026 (Meta, 2026-10-19). | That cold start is solved: "You still have to learn" (Meta exec via AdExchanger). |
| Foundation model — GEM | One central model predicts CTR across surfaces and CVR across major goals; its knowledge is **transferred** to hundreds of real-time ranking models. GEM itself is **not** evaluated inside live ad requests. Long engagement history doubled in production. Reported +18.9% conversions, +12% CTR across surfaces; 5.8% / 4.1% / 1.6% conversion uplift on Facebook / Instagram / off-site over the past year (Meta, 2026-10-13). | That an ad-set layout controls GEM's access to user history. |
| Ranking and auction | Total value combines bid, estimated action rate and ad quality (Meta, 2023 foundation). Budget and pacing limit opportunities. | Current coefficients or every internal stage. |

Meta's stated direction: advertisers "don't have to change any settings" to
benefit, and "the more advertisers are willing to use automation levers, the
faster they'll see performance improvements" (Meta exec via AdExchanger). Treat
that as a vendor position to test, not proof that broad automation suits every
offer, market or margin.

### Practical consequences (local, testable)

- **Creative is the main targeting input.** Retrieval and semantic tokens read
  the ad's text and visuals. Distinct concepts (problem, benefit, proof,
  demonstration, format) give the system different things to match; cosmetic
  variants of one idea add little.
- **Signal quality decides what is learned.** The system optimizes the event you
  select, as Meta receives it. Wrong, duplicated or late events teach the wrong
  objective faster. Fix the signal before reading performance.
- **Consolidation helps learning volume.** Fewer ad sets sharing the same goal
  reach the event volume needed to stabilize. Split only for a concrete reason
  (market, economics, serviceability, a controlled test).
- **New products are not fully cold.** Similar items already in the account or
  category can transfer knowledge; still expect a learning period.

## 2. Learning phase

- **Meta:** delivery explores during learning after a new ad set or a
  significant edit; performance is less stable and cost per result usually
  higher. Ad sets "usually exit the learning phase after around 50
  optimization events since its last significant edit"; Meta recommends a goal
  that happens about **50 times per week**, counted within the chosen
  attribution setting.
- **Meta — significant edits:** pausing the ad set (beyond a short time), any
  change to the optimization event, targeting/audience or creative, and adding
  ads. Bid strategy and budget changes may count depending on magnitude. Ads
  Manager shows "Last significant edit".
- **Local:** read the ad set's own learning status in Ads Manager rather than
  assuming a fixed count or day limit; the display can differ by account.

Learning implications for `dotads-meta`:

1. Record every material change as a dated event before judging its effect; a
   result window that spans a significant edit is a mixed sample.
2. Compare windows only after learning status is known. "Learning limited" is a
   volume/structure finding, not proof the creative failed.
3. If the purchase event cannot reach ~50/week per ad set, a higher-volume
   optimization event or consolidation is a hypothesis to test — not a rule.

## 3. Measurement changes that alter reported numbers

These change **reported counts**; a shift around these dates does not by itself
prove a sales change. Meta states the March click change does not change
billing. For the Pixel AI feature and on-device conversions, Meta has not said
whether delivery or bidding is affected, so treat them as possible confounders
as well. Historical and current data are not directly comparable across these
dates.

| Date | Change | Source |
| --- | --- | --- |
| 2026-01-12 | Ads Insights API stopped returning `7d_view` and `28d_view`. Remaining: 1d click, 7d click, 28d click, 1d engaged view, 1d view, plus the ad set's default. Unique-count and hourly breakdowns limited to 13 months, `frequency_value` to 6 months; totals stay 37 months. | Meta developer blog, 2025-10-16 |
| 2026-03 (gradual) | Click-through attribution for website and in-store conversions counts **link clicks only**. Likes, shares, saves and comments move to **engage-through** (renamed engaged-view). Video engaged view threshold reduced from 10 s to 5 s. | Meta, 2026-03-03 |
| 2026-04 | Pixel AI feature can add page/product details (name, availability, business details) to events; existing pixels got a 30-day review notice, then on by default, adjustable in Events Manager. | Meta, 2026-04 |
| 2026-11-12 (gradual) | "Measure conversions on customer devices": eligible pixels match ad views to purchases on the buyer's device; on by default; works alongside Pixel/CAPI; attribution windows/models unchanged. Conditions per Meta Help Center: not for people in EU/UK, Pixel directly on the page (not iframe/img), site requires login by email or phone. Opt-out: Events Manager → Data sources → pixel → Settings. | Meta Help Center via third-party reports |

Not stated by Meta for the device-side setting: whether recovered conversions
carry value/currency, whether they feed bidding, browser coverage. Expect
reported conversions/ROAS to shift around this date without a sales change;
compare against backend orders before concluding anything.

Attribution models (Meta): **standard** (chosen windows), **incremental**
(optimizes and reports conversions predicted to be caused by the ad), and
**custom** (shares external attribution data; limited availability). Meta calls
Conversion Lift the gold standard for causal measurement. Attributed results,
including incremental attribution, remain model estimates.

## 4. From evidence to learning in `dotads-meta`

Apply these checks when moving an entry along observation → hypothesis →
experiment → outcome (`learn record`):

| Check | Why |
| --- | --- |
| Same attribution setting and click definition across compared windows | March 2026 click change and January 2026 window removals change counts. |
| Learning status and last significant edit known for each window | Learning-phase data is unstable by design. |
| Signal verified (event, dedup, value, EMQ) before reading CPA/ROAS | Bad signals bias both delivery and reporting. |
| Backend orders reconciled for purchase claims | Device-side and modeled conversions can raise reported numbers. |
| Overlapping windows treated as one view, not independent samples | Yesterday ⊂ 7d ⊂ 30d ⊂ 90d. |
| Creative concept, not just ad ID, recorded | Semantic tokens group similar content; the concept is the testable unit. |
| Prediction, alternatives and falsification written before the test | Prevents fitting a story to noise. |

The stage fields are owned by the
[learning lifecycle contract](account-workspace-runtime.md#account-learning-and-private-cross-device-handoff):
a **hypothesis** needs prediction, alternatives and falsification; an
**experiment** needs change, control, primary metric, event mapping, decision
threshold, duration, rollback and a positive minimum sample. Name one change and
the event it should move; do not skip the hypothesis stage.

## 5. Improving ads: decision order (local)

1. **Signal and destination** — event correctness, dedup, value, match quality,
   landing page speed/relevance, stock and checkout. Use `meta-ads-signal-engine`.
2. **Economics** — target CPA/ROAS from margin and delivery/COD rates; see
   [performance interpretation](roas-cpr-profit-intelligence.md).
3. **Structure** — enough budget per ad set to approach the learning threshold
   for the chosen event; consolidate where goals and economics match.
4. **Creative concepts** — several distinct concepts per batch; refresh by
   concept when frequency rises and results decay, not on a fixed calendar.
5. **Automation** — Advantage+ audience/placements and creative features are
   candidates; review brand-sensitive generative features before opting in.
6. **Change discipline** — batch edits, log them, avoid repeated significant
   edits during learning; judge after learning and conversion lag.

Every live change still follows the dry-run → approval → PAUSED gate.

Marketplace campaigns (Shopee CPAS) follow the same delivery system but a
different signal owner, results fields and economics: see
[CPAS Collaborative Ads](cpas-collaborative-ads.md).

## 6. Adaptive targeting liquidity (Broad vs. Audience Controls) & multi-horizon diagnostic timing

Reviewed **2026-11-07**. Treat the mechanisms below as **adaptive first-principles baselines (priors to test and calibrate per business model, funnel, and unit economics)**—never as static, one-size-fits-all dogma.

### 6.1 Auction liquidity vs. precision boundary (`Audience Controls` vs. `Audience Suggestions`)

1. **Auction liquidity and clearing prices:** In Meta's Total Value auction
   (`Bid × Estimated Action Rate + Ad Quality`), every hard constraint added to
   an ad set (narrow age brackets, gender locks, stacked interests, placement or
   region exclusions) shrinks the eligible candidate pool. A smaller pool forces
   the pacing engine to bid in denser auctions to spend the daily budget,
   increasing **CPM** and **CPC**.
2. **Interest deprecation and `Audience Controls` vs. `Audience Suggestions`:**
   Meta removed Detailed Targeting Exclusions and consolidated/deprecated
   thousands of granular interest categories. Under **Advantage+ Audience
   (`targeting_automation.advantage_audience = 1`)**, Meta splits inputs into:
   - **Audience Controls (Hard Fences):** `Locations` (include/exclude),
     `Minimum Age` (`age_min`), `Languages`, and `Custom Audience Exclusions`.
     Delivery never crosses these boundaries.
   - **Audience Suggestions (Soft Hints):** `Detailed Targeting (Interests)`,
     `Maximum Age` (`age_max`), `Gender`, and `Custom/Lookalike Seeds`. The
     algorithm uses these only as a warm-start hint and expands past them
     whenever it predicts cheaper conversions elsewhere.
3. **Adaptive starting baseline vs. context-specific hard controls:**
   - **Starting Baseline (`OUTCOME_SALES` / `OFFSITE_CONVERSIONS`):** **0 Interests**
     (empty detailed targeting) + **Advantage+ Audience (`advantage_audience: 1`)**
     + **All Genders** + **Broad Age (`18–65+` or offer-appropriate `age_min`)**
     + **Advantage+ Placements**. Let Andromeda/GenRecs/GEM match buyers via
     creative hooks and conversion signals when the pixel/dataset has clean
     bottom-of-funnel feedback.
   - **When Hard Controls Are Justified (Context-Driven Exceptions):**
     1. *Legal, regulatory, or purchasing-power floors:* setting `age_min`
        (e.g., `21+` or `25+` for credit, high-ticket, or COD fraud prevention)
        inside `Audience Controls` while keeping `Advantage+ Audience` active.
     2. *Physical serviceability & unit-economics geo boundaries:* excluding
        non-serviceable regions or regions with negative contribution margin
        (`excluded_geo_locations`).
     3. *Empirically verified demographic leakage:* locking hard gender or age
        (`Original Audience` / `advantage_audience: 0`) when an account's own
        multi-week demographic breakdown proves material spend (>15%) is leaking
        to a non-converting segment, or when running an isolated holdout test.
     4. *Technical routing constraints:* e.g., restricting placements or devices
        when a destination requires native mobile app handoff (such as CPAS
        universal links) or a placement-specific creative format.

### 6.2 Multi-horizon diagnostic & audit timing protocol (cycle- & economics-aware)

New or newly edited ad sets frequently show inflated CPM/CPA during their first
3–12 hours due to three backend mechanisms:
1. **Probabilistic exploration ("Rough Start"):** Wide initial confidence
   intervals force the algorithm to sample diverse auction pockets before
   narrowing into exploitation mode.
2. **Intraday diurnal pacing:** Consumer conversion rates vary across the 24-hour
   day (often peaking in evening prime time). Auditing mid-day after 4–8 hours
   captures discovery spend before peak conversion hours complete.
3. **Conversion and attribution latency (24–72 hours+):** Buyers often complete
   checkout or lead qualification hours or days after clicking (`7d_click`), and
   Ads Insights API reporting lags by minutes to hours (and 24–72h for delayed
   or modeled events).

Never rely on an intraday `<24h` panic pause or a static currency cutoff divorced
from the offer's `Target_CPA`, `AOV`, and conversion lag. Apply the **4-Stage
Multi-Horizon Diagnostic Protocol**:

| Stage | Observation Horizon | Diagnostic Scope | Adaptive Action Rule | Anti-Pattern to Avoid |
| --- | --- | --- | --- | --- |
| **Stage 0: Sanity Check** | **0 – 6 Hours** | Technical health only: HTTP 200 destination, `LPV / Outbound Clicks >= 50%`, Pixel/CAPI firing, policy status, budget/currency check. | Fix broken URL, broken pixel, or budget typo. | **Never pause or edit** for high CPM, high CPC, high CPA, or 0 conversions. |
| **Stage 1: First Diurnal Gate (Zero-Intent Stop-Loss)** | **Minimum 24 Hours** *(>= 1 full diurnal cycle; prefer completed `yesterday` window)* | Require `Runtime >= 24h` AND spend reaching the account's declared test threshold (e.g., `>= 1.0x Target_CPA` or owner stop-loss floor). Inspect leading indicators (`CTR`, `CPLPV`, `ATC`, `IC`, or qualified lead actions). | Propose `PAUSE` **only if** `Conversions == 0` **AND** mid-funnel intent is absent (`ATC <= 1`, `IC == 0`). If mid-funnel intent is active (`ATC >= 2–3` or `IC >= 1`), **hold to Stage 2**. | Pausing an ad at 24h when it already generates strong mid-funnel (`ATC` / `IC`) velocity. |
| **Stage 2: Multi-Day Funnel & Conversion Gate** | **48 – 72 Hours** *(2–3 full diurnal cycles)* | Cumulative `Spend >= 1.5x–2.0x Target_CPA` (adjusted for B2B/high-ticket lag). Evaluate step-by-step funnel ratios (`Click -> LPV -> ATC -> IC -> Conversion`). | - `Conversions == 0` after 48–72h & `>= 1.5x–2.0x Target_CPA` &rarr; propose `PAUSE`.<br>- High `ATC/LPV` (`>= 15%`) but low `IC/ATC` (`< 20%`) &rarr; diagnose checkout friction, shipping/payment shock, or broken event firing rather than blaming targeting. | Repeated micro-edits that reset learning before a hypothesis completes. |
| **Stage 3: Cohort & Scaling Review** | **3 – 7 Days (`last_7d` / `last_30d`)** | Evaluate stabilized CPA, ROAS, and backend contribution margin after attribution lag settles. | - **Scale Up / Out**: `3–7d CPA <= Target_CPA` (or `ROAS >= Target_ROAS`).<br>- **Prune / Rebuild**: multi-day cumulative economics remain below break-even after `>= 2x–3x Target_CPA`. | Killing a campaign with profitable `last_7d` / `last_30d` unit economics over a single soft day (`yesterday`). |

## 7. Adaptive scaling mechanics, coupled configuration hierarchy & continuous evolution

### 7.1 Scale Up (Vertical) vs. Scale Out (Horizontal) under Andromeda & GEM

1. **Scale Up (Vertical Scaling — Pacing Elasticity & Bid Controls):**
   - **Pacing multiplier mechanics:** Under `LOWEST_COST_WITHOUT_CAP` (*Highest Volume*), increasing `daily_budget` raises the shadow pacing multiplier $\lambda(t)$ so the budget exhausts by `23:59`.
   - **Gradual cadence (+15% to +25% every 48–72 hours):** Keeps the ad set inside its calibrated `eCVR` distribution without triggering a **Significant Edit** reset (`~50 optimization events / 7 days`).
   - **Why abrupt +50%–200% jumps spike marginal CPA:** Large budget jumps force the pacing engine to clear lower-`eCVR` auctions within the same 24h window, spiking marginal CPA during re-exploration.
   - **Transitioning from Uncapped Lowest Cost to Bid/Value Controls:** Every audience/creative pool has a marginal efficiency ceiling under `LOWEST_COST_WITHOUT_CAP` (see `config/ai/memory/meta-ads.md` for the owner's current IDR ceiling priors). When scaling beyond that ceiling or into larger daily budgets, test **`COST_CAP`**, **`LOWEST_COST_WITH_BID_CAP`**, or **`LOWEST_COST_WITH_MIN_ROAS`** (paired with `roas_average_floor` once weekly conversion volume supports value modeling) so the auction acts as an automated margin brake.
2. **Scale Out (Horizontal Scaling — Orthogonal Signals & Funnel Expansion):**
   - **Why cloning identical ad sets/creatives stalls:** **Andromeda** and **GenRecs** map identical or cosmetically tweaked creatives to the same **semantic token cluster (Entity ID)**. Duplicating the same creative across multiple broad ad sets causes **Auction Overlap** and fragments conversion volume across ad sets (`Learning Limited`).
   - **Adaptive Scale-Out vectors (choose based on the bottleneck):**
     1. *Creative concept diversification (Primary lever):* Launch genuinely distinct creative angles (problem-agitate hook, product demonstration, social proof/comparison, founder/expert narrative, or format shift) so GenRecs generates distinct semantic tokens that retrieve new buyer cohorts. Keep ad count per ad set proportional to budget (typically 3–5 distinct concepts; avoid crowding >6 ads into a micro-budget ad set).
     2. *Destination & offer architecture:* Match the destination funnel to the buying journey—e.g., low-friction 1-step embedded checkout forms for single-SKU impulse/COD offers, high-trust comparison/bundle pages for multi-SKU storefronts, or instant/qualified forms for consultative leads—and test AOV-lifting bundles to increase VCG `Total Value`.
     3. *Channel & objective diversification:* Expand across complementary conversion surfaces (e.g., Website `PURCHASE`, Marketplace Collaborative Ads `CPAS`, Click-to-WhatsApp `CTWA` with CAPI purchase callback, or `incremental_attribution: true` tests).

### 7.2 Coupled Configuration Hierarchy (Campaign -> Ad Set -> Ad -> Signal)

Treat campaign settings, ad-set optimization, creative tokens, landing-page friction, and Pixel/CAPI signal quality as **one coupled system**:

| Layer & Parameter | Adaptive Baseline for Conversion / Purchase | Algorithmic Mechanism & When to Adapt |
| --- | --- | --- |
| **Campaign: `objective`** | `"OUTCOME_SALES"` (or `"OUTCOME_LEADS"` for lead funnels) | Selects GEM's prediction head. Never use `OUTCOME_TRAFFIC` or `OUTCOME_ENGAGEMENT` when the business goal is sales or qualified leads. |
| **Campaign: Budget Mode** | CBO (`daily_budget` on Campaign) or ABO (`"adset_budget_sharing": true` optional) | CBO dynamically routes marginal spend to the highest-`Total Value` ad set; use ABO when strict per-cell test isolation is required. (Legacy `smart_promotion_type: "AUTOMATED_SHOPPING_ADS"` was retired in v25/v26). |
| **Campaign / Ad Set: `bid_strategy`** | `"LOWEST_COST_WITHOUT_CAP"` (discovery/moderate scale) &rarr; `"COST_CAP"` / `"LOWEST_COST_WITH_BID_CAP"` / `"LOWEST_COST_WITH_MIN_ROAS"` (high scale) | Uncapped bidding maximizes volume at lower budgets; cost/bid/ROAS caps protect contribution margin when scaling budget aggressively. |
| **Ad Set: `optimization_goal` & `promoted_object`** | `"OFFSITE_CONVERSIONS"` + `{"pixel_id": "<ID>", "custom_event_type": "PURCHASE"}` | Optimizes `eCVR` for completed purchases. Switch to `"VALUE"` only when AOV variance is wide, conversion volume is sufficient, or paired with `LOWEST_COST_WITH_MIN_ROAS` (`VALUE` with uncapped bidding on small budgets can spike CPM 2x–3x). |
| **Ad Set: `attribution_spec`** | `7d_click + 1d_view (+ 1d_ev)` or `incremental_attribution: true` | Provides full click + view-through signal density to exit learning faster. Only restrict to `7d_click` / `1d_click` when running a deliberate long-cycle or view-inflation holdout test, as click-only attribution reduces counted optimization events and can raise CPM. |
| **Ad Set: `advantage_audience` & `targeting`** | `advantage_audience: 1` + Broad + hard `Audience Controls` only where justified | Maximizes Andromeda retrieval liquidity while respecting hard serviceability, legal, or empirically proven demographic boundaries (§6.1). |
| **Ad Set: Placements** | **Advantage+ Placements** (for standard web funnels) | Lets GEM allocate across FB, IG, Reels, Stories, and AN by marginal CPA. Restrict placements only when technical routing requires it (e.g., Shopee CPAS mobile-only FB Feed/Reels) or when placement breakdown data proves persistent waste. |
| **Ad / Creative: Format & DOF** | Distinct hook concepts + selective `degrees_of_freedom_spec` (`OPT_IN` safe polish; `OPT_OUT` destructive crop/hallucination) | Preserves clean multimodal semantic tokens for GenRecs while preventing auto-crop from cutting key visual proof or GenAI from altering regulated claims. |
| **Destination & Signal (`Pixel + CAPI`)** | Friction-matched LP + `url_tags` + paired Browser Pixel & Server CAPI (`event_id` 48h dedup, raw `_fbc`/`_fbp`, normalized PII `EMQ >= 8.0`) | High post-click `eCVR` and deterministic server-side attribution directly raise `Total Value = Bid × eCVR + Ad Quality`, lowering VCG clearing prices across every auction. |

### 7.3 Continuous Evolution Loop (How to Update Skills & Memory from Future Data)

Platform APIs, ranking models, and market economics evolve continuously. Never freeze a single campaign's outcome as permanent law:
1. **Observe with provenance:** Capture multi-window data (`yesterday`, `last_7d`, `last_30d`, `last_90d`, `this_month`) and separate `7d_click` from `1d_view` and platform claims from backend settled orders.
2. **Diagnose by layer:** Isolate whether a shift comes from **Auction/Targeting** (`CPM`, `Frequency`), **Creative** (`Outbound CTR`, `Thumbstop`), **Destination Funnel** (`LPV/Click`, `ATC/LPV`, `IC/ATC`, `Pur/IC`), or **Signal/Attribution** (`EMQ`, dedup, `attribution_spec`).
3. **Test as a controlled hypothesis:** Record the hypothesis in the account's private `memory/ads-memory.json` (`dotads-meta learn record`), run across at least 1–3 full diurnal cycles (`24–72h`), and reconcile with backend contribution margin.
4. **Promote only generalizable mechanisms:** Keep account-specific figures, product winners, and temporary workarounds in the private workspace (`NOTES.md` / `MEMORY.md`). Promote only de-identified, repeatable **mechanisms and decision trees** into shared skills and memory—always framed as adaptable baselines that future evidence can refine or supersede.

## Sources (retrieved 2026-11-05)

- [Andromeda 2026](https://engineering.fb.com/2026/10/28/ml-applications/meta-andromeda-next-gen-ads-retrieval-gpu-co-design/) · [GEM 2026](https://engineering.fb.com/2026/10/13/ml-applications/metas-generative-ads-model-gem-scaling-the-central-model-and-compute-engine-for-frontier-ads-ai/) · [GenRecs tokenization](https://engineering.fb.com/2026/10/19/ml-applications/genrecs-tokenization-transforming-ads-recommendation-at-meta-with-stable-model-vocabulary/)
- [AdExchanger on GenRecs/GEM/Andromeda](https://www.adexchanger.com/ai/meta-has-a-new-ad-ranking-system-built-on-llms-plus-upgrades-to-andromeda-and-gem/) (third-party reporting of Meta statements)
- [Learning phase guidance](https://www.facebook.com/business/help/910877842876429) · [Last significant edit](https://www.facebook.com/business/help/942374239243867) · [Zero-conversion guide](https://www.facebook.com/business/help/197634954160445)
- [Insights API attribution changes](https://developers.facebook.com/blog/post/2025/10/16/ads-insights-api-metric-availability-updates/) · [Click attribution change](https://www.facebook.com/business/news/click-attribution) · [Attribution models](https://www.facebook.com/business/help/460276478298895)
- [Pixel and Conversions API updates](https://www.facebook.com/business/news/pixel-conversionsapi-updates) · [On-device conversions (PPC Land)](https://ppc.land/meta-pixel-will-count-more-conversions-from-nov-12-unless-advertisers-opt-out/)

Help Center pages are JavaScript-rendered; their statements here come from
search extracts and third-party quotations. Re-open them before relying on an
exact threshold.
