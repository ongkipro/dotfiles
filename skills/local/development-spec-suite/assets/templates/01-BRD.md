# Business Requirements Document (BRD)

> Template instruction: replace every `<placeholder>`, remove inapplicable sections, and label unknowns `TBD` with an owner and due date. Do not invent business facts.

## Document Control

| Field | Value |
|---|---|
| Purpose | Define the business case, operating constraints, measurable value, and stakeholder commitments that product and technical documents must satisfy. |
| Required when | Enterprise or regulated profile; multiple business owners; material commercial, procurement, contractual, or regulatory constraints. |
| Accountable owner | `<business sponsor>` |
| Responsible author | `<product or business analyst>` |
| Reviewers | `<finance, legal/privacy, product, operations, engineering>` |
| Status | `Draft / In Review / Approved / Superseded` |
| Version | `<semver or date>` |
| Last updated | `<YYYY-MM-DD>` |
| Approval record | `<approver, decision, date, evidence link>` |

**Inputs:** strategy, customer research, commercial model, contracts, regulatory analysis, financial assumptions, existing-system evidence.
**Outputs:** approved `BR-*` requirements, KPI definitions, constraints, funding/ownership decisions, and explicit handoff to `02-PRD.md`.
**Primary ID namespace:** `BR-<number>`. IDs are stable; never renumber accepted requirements. Mark retired IDs `Superseded` and link their replacement.

## 1. Executive Decision

- Decision requested: `<fund / investigate / build / migrate / retire>`
- Business problem: `<evidence-backed problem, affected party, and consequence>`
- Proposed business outcome: `<outcome, not solution detail>`
- Decision deadline and reason: `<date and trigger>`
- Recommendation: `<one sentence or TBD>`

## 2. Context and Evidence

| Evidence ID | Source and date | Observation | Confidence | Limitation |
|---|---|---|---|---|
| `E-1` | `<source>` | `<fact>` | `High/Medium/Low` | `<bias, sample, age>` |

Separate verified facts, assumptions, and hypotheses. Link research; do not copy sensitive customer data into this document.

## 3. Business Objectives and KPIs

| Objective | KPI | Baseline | Target and date | Measurement owner | Guardrail |
|---|---|---:|---:|---|---|
| `<objective>` | `<precise metric>` | `<value/source>` | `<value/date>` | `<role>` | `<metric that must not regress>` |

Define formula, source system, population, time window, exclusions, and reporting cadence for every KPI.

## 4. Stakeholders and Decision Rights

| Stakeholder/role | Interest | Decision authority | Consulted on | Approval required? |
|---|---|---|---|---|
| `<role>` | `<interest>` | `<scope>` | `<topics>` | `Yes/No` |

## 5. Business Scope

### In scope

- `<business capability, market, channel, or region>`

### Out of scope

- `<explicit exclusion and why>`

### Dependencies

- `<partner, contract, data source, policy, team, or platform>`

## 6. Business Requirements

Use RFC 2119 terms (`MUST`, `SHOULD`, `MAY`) only when their strength is intentional.

| ID | Requirement | Rationale/evidence | KPI | Priority | Owner | Acceptance evidence | Status |
|---|---|---|---|---|---|---|---|
| `BR-1` | `<The business MUST ...>` | `E-1` | `<KPI>` | `Must/Should/Could` | `<role>` | `<observable evidence>` | `Proposed` |

## 7. Commercial and Operating Model

Identify each contracting/selling/operating entity, target market, merchant-of-record or marketplace role, revenue/tax/payment responsibility, support region, and contractual jurisdiction. “Global” is not an operating model; record phased markets and explicit exclusions.

| Decision | Options considered | Selected option | Economic/operating implication | Owner |
|---|---|---|---|---|
| Revenue model | `<options>` | `<selected/TBD>` | `<pricing, margin, tax, support>` | `<role>` |
| Customer/tenant ownership | `<options>` | `<selected/TBD>` | `<sales, support, data role>` | `<role>` |
| Service commitment | `<options>` | `<selected/TBD>` | `<SLA/support hours>` | `<role>` |

Reference billing rules by `BILL-*` and reliability commitments by `SLO-*`/`DR-*`; do not duplicate them here.

## 8. Regulatory, Contractual, and Policy Drivers

| Driver | Applicability basis | Required outcome | Evidence owner | Downstream IDs |
|---|---|---|---|---|
| `<law/contract/policy>` | `<jurisdiction, data, customer clause>` | `<business obligation>` | `<role>` | `<PRIV-*, SEC-*, SLO-*>` |

This is an engineering input, not legal advice or proof of certification. Record legal counsel or auditor validation where required.

## 9. Financial Case

| Item | Assumption | Range | Source | Sensitivity/risk |
|---|---|---|---|---|
| Cost | `<assumption>` | `<low/base/high>` | `<source>` | `<impact>` |
| Benefit | `<assumption>` | `<low/base/high>` | `<source>` | `<impact>` |

Include total cost of ownership, implementation, migration, support, compliance, vendor, and exit costs. Link the controlled financial model instead of embedding confidential details.

## 10. Risks, Assumptions, Issues, Dependencies

| ID | Type | Description | Probability | Impact | Owner | Mitigation/validation | Due |
|---|---|---|---|---|---|---|---|
| `RAID-1` | `Risk/Assumption/Issue/Dependency` | `<statement>` | `<rating>` | `<rating>` | `<role>` | `<action>` | `<date>` |

## 11. Decision Log

| Date | Decision | Rationale | Decider | Affected IDs | Supersedes |
|---|---|---|---|---|---|
| `<date>` | `<decision>` | `<why>` | `<role>` | `<BR-*>` | `<decision or none>` |

## 12. Cross-Document Contract

- `02-PRD.md` translates accepted `BR-*` into observable `PR-*` and `NFR-*`.
- Billing references `BR-*` commercial outcomes; SLA/DRP references contractual commitments.
- Privacy/compliance owns `PRIV-*` and `CTRL-*`; this BRD owns only business applicability and desired outcomes.
- `TASKS.md` must not implement a `BR-*` directly without a primary product or technical requirement.

## 13. Validation and Approval Checklist

- [ ] Every material claim has a source, date, and confidence level.
- [ ] Every `BR-*` is singular, testable at business-outcome level, owned, and uniquely identified.
- [ ] KPIs have formulas, baselines, targets, windows, sources, owners, and guardrails.
- [ ] Scope, non-goals, commercial constraints, and operating ownership are explicit.
- [ ] Regulatory/contractual applicability has qualified review where required.
- [ ] Financial assumptions include uncertainty and exit costs; no sensitive values are exposed unnecessarily.
- [ ] Each accepted `BR-*` maps to at least one `PR-*`, or has a recorded reason not to.
- [ ] No product behavior, API payload, database schema, or security implementation is duplicated here.
- [ ] Required approvers recorded an explicit decision.
