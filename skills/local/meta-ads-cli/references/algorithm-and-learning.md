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

## Sources (retrieved 2026-11-05)

- [Andromeda 2026](https://engineering.fb.com/2026/10/28/ml-applications/meta-andromeda-next-gen-ads-retrieval-gpu-co-design/) · [GEM 2026](https://engineering.fb.com/2026/10/13/ml-applications/metas-generative-ads-model-gem-scaling-the-central-model-and-compute-engine-for-frontier-ads-ai/) · [GenRecs tokenization](https://engineering.fb.com/2026/10/19/ml-applications/genrecs-tokenization-transforming-ads-recommendation-at-meta-with-stable-model-vocabulary/)
- [AdExchanger on GenRecs/GEM/Andromeda](https://www.adexchanger.com/ai/meta-has-a-new-ad-ranking-system-built-on-llms-plus-upgrades-to-andromeda-and-gem/) (third-party reporting of Meta statements)
- [Learning phase guidance](https://www.facebook.com/business/help/910877842876429) · [Last significant edit](https://www.facebook.com/business/help/942374239243867) · [Zero-conversion guide](https://www.facebook.com/business/help/197634954160445)
- [Insights API attribution changes](https://developers.facebook.com/blog/post/2025/10/16/ads-insights-api-metric-availability-updates/) · [Click attribution change](https://www.facebook.com/business/news/click-attribution) · [Attribution models](https://www.facebook.com/business/help/460276478298895)
- [Pixel and Conversions API updates](https://www.facebook.com/business/news/pixel-conversionsapi-updates) · [On-device conversions (PPC Land)](https://ppc.land/meta-pixel-will-count-more-conversions-from-nov-12-unless-advertisers-opt-out/)

Help Center pages are JavaScript-rendered; their statements here come from
search extracts and third-party quotations. Re-open them before relying on an
exact threshold.
