# Market Intelligence Contract

Use this contract only when market evidence could change the decision brief. Apply the shared [Evidence and Claim Contract](evidence-contract.md) to every consequential claim and recommendation.

## Written boundary and segmentation

Before sizing, comparing competitors, or making demand/pricing claims, write one falsifiable boundary:

`actor + problem/job + substitute set + geography + channel + constraints + reference period`

Keep three concepts separate: the commercial market customers treat as substitutable, statistical classification codes used to query data, and vendor/category labels. An industry code or analyst category must not silently define customer substitutability. Any analysis using an alternate boundary states the difference and why.

Segment only on observable differences that change need, buying, product, economics, compliance, or distribution action: problem/trigger; user, buyer, approver, or administrator; current alternative and workflow; organization size/industry; regulation; integrations; purchase motion; geography/language; urgency/frequency; and ability or willingness to pay. Every segment has explicit inclusion/exclusion criteria, an identification/reach or measurement basis, and a material action it changes. Otherwise, do not create it.

Competitor analysis covers the full substitute set: direct product, adjacent product, internal build, manual/spreadsheet workflow, service/outsourcing, and status quo. Separate observed capability and pricing facts from inferred positioning, strategy, adoption, revenue, share, or economics. Private figures remain `Unknown` without an inspectable method and source.

## Source, demand, and pricing ladders

Use a claim-specific source ladder; higher authority is not automatically higher fit:

1. revealed behavior and authoritative administrative/census evidence;
2. primary records, official registries, filings, procurement records, first-party competitor documentation, and lawful direct product observation;
3. fit-for-purpose focal customer research;
4. peer-reviewed syntheses and transparent established methods;
5. transparent industry research and named expert evidence;
6. attention/platform proxies such as trends, reviews, traffic estimates, jobs, repositories, and community discussion;
7. unattributed summaries, opaque totals, roundup pages, and generated recollection—discovery leads only.

Distinguish demand by increasing behavioral commitment:

1. attention;
2. a concrete problem episode and current workaround;
3. qualified stated intent;
4. costly commitment such as data access, integration time, champion action, budget-holder involvement, or a real offer;
5. paid, repeated, and retained behavior.

Desk research can establish documented population facts, alternatives, and proxies. It cannot by itself establish desirability, adoption, willingness to pay, or product-market fit. Customer evidence remains bounded to its sample and context. Stated intent is not commitment, and commitment is not paid or retained behavior.

Distinguish pricing evidence:

1. public list price, terms, packaging, and observed discount rules;
2. qualitative price conversations and budget-process evidence;
3. stated preference or hypothetical willingness to pay;
4. a real offer, budget allocation, signed commitment, deposit, or comparable costly action;
5. realized paid price with repeat, retention/churn, expansion, and refund context.

Never represent stated willingness to pay as revealed purchase behavior or apply a universal correction factor to convert it into paid demand.

## TAM, SAM, and SOM definitions

Print the chosen definitions beside every result:

- **TAM:** annual economic value if every eligible unit within the written boundary adopted at the stated normalized usage and price.
- **SAM:** TAM units the planned product can serve under actual product, geography, language, regulation, integration, and channel constraints in the chosen horizon.
- **SOM:** scenario-based annual revenue obtainable under capacity, ramp, win rate, sales cycle, onboarding, activation, retention/churn, expansion, competition, and realized price.

A common form is `eligible units × adoption or usage units per period × realized annual price per usage unit`, but the selected method must match the boundary and unit. Never define SOM as an arbitrary percentage of TAM.

## Auditable input rows

Each decision-material calculation input is a flat, reproducible row using an existing applicable permanent ID; do not create a new status or ID family. Record:

- target layer (`TAM`, `SAM`, `SOM`, or named cross-check), factor name, definition, and boundary;
- numeric value or low/base/high interval or named scenarios;
- atomic unit (for example person, seat, account, establishment, legal entity, transaction, or workload) and usage period;
- geography, reference period/year, and segment inclusion/exclusion;
- currency, FX source/date/basis, tax treatment, and recurring/one-time treatment when money or conversion is involved;
- canonical status and separate evidence kind;
- canonical source ID or deterministic formula/input lineage; a fixed owner-supplied scenario states that basis explicitly;
- method, population/coverage/sample, and source retrieval/observation date;
- overlap and deduplication rule;
- confidence with reason, limitation/applicability, and owner;
- range/scenario rationale, sensitivity, review trigger, and practical implication.

Every output preserves the formula, ordered input IDs, deterministic calculation locator, rounding/precision policy, output unit, and reconciliation against an independent cross-check. A reviewer must be able to reproduce the input values and arithmetic without reading narrative inference.

## Interval, scenario, and reconciliation rules

- Use a defensible interval or named scenarios for every decision-material uncertain input. Exact observations and fixed human-owned scenarios may remain points when labelled with their scope and basis.
- Do not replace uncertainty with spurious precision. Choose interval endpoints from evidence, explicit deterministic assumptions, or named scenarios; explain each choice.
- Run sensitivity on inputs capable of changing the decision and name the weakest material input.
- Keep units consistent; conversions must preserve source value, method, date, and formula lineage.
- Deduplicate overlapping entities and segments before aggregation and state the rule.
- Cross-check with an independent method or source where practical. Reconcile divergence in boundary, unit, geography, period, coverage, and method rather than averaging it away.
- Preserve desk evidence, customer evidence, stated intent, costly commitment, and paid/retained behavior as distinct inputs or claims.

## Trends

A trend claim defines metric, denominator, source method, geography/population, period and frequency, revisions, structural breaks, seasonality, and confounders. Normalized or sampled attention is not absolute demand. A decision-material trend should normally have at least two independent indicators; if only one exists, state the limitation and keep the implication conditional. Never infer causality, market size, or purchasing behavior solely from attention movement.

## Discovery tests and stop conditions

For each material hypothesis, propose the smallest test that can discriminate the pending decision. Before execution, record population/context, prediction, method, threshold, stopping rule, guardrails, result-to-decision mapping, owner, and horizon. Do not create a threshold after seeing results.

The decision brief sets breadth, source, time/cost, saturation, confidence, go/hold/stop, and decision-changing-evidence limits. Stop research when:

- a documented go, hold, or stop threshold is met;
- the next evidence cannot change the decision within the horizon;
- required source diversity and saturation are reached;
- the cost, privacy, legal, or access boundary is reached;
- sources remain irreconcilable after the defined reconciliation attempt; or
- a decision-critical input cannot be supported within the approved bounds.

In the last two cases, preserve the conflict or gap. Report **`Not estimable`** when a critical sizing input lacks a defensible source, interval, named scenario, or explicit owner-held deterministic assumption. State the missing input, why it is material, evidence attempted, consequence, owner, and smallest next evidence. Never manufacture an estimate to complete a table.

Every recommendation concludes with its exact claim or decision, evidence and counterevidence IDs, confidence with reason, limitation/applicability, practical implication, and next evidence or accountable decision owner.

See [Evidence and Claim Contract](evidence-contract.md), [Product and UX Handoff](product-handoff.md), and [Adaptive Artifact Routing](artifact-routing.md), or return to the [Product Intelligence skill](../SKILL.md).