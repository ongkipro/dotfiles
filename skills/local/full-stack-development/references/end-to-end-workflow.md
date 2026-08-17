# End-to-End Workflow

Use this runbook only after the main skill activates full-stack orchestration.
It is a coordination checklist, not an implementation recipe. Specialist skills
own framework commands, APIs, security controls, test design, and deployment
mechanics.

## 1. Open one execution record

Keep a compact record in the repository's accepted task/status artifact or in the
response when no artifact exists. Do not create a new planning file merely to
hold it.

```text
Outcome / accepted requirement:
Non-goals:
Implementation approval:
Release/deploy approval:
Observed repository state:
Affected entry point and callers:
Canonical product/domain contract:
Canonical architecture/deployment contract:
Canonical data contract:
Canonical IAM contract:
Canonical API/event contract:
Canonical UI state contract:
Activated owners:
Trust boundaries and failure states:
Compatibility / migration / rollback decision:
Evidence required:
Unknowns, owner, and blocking effect:
```

An empty field means “not applicable” only when inspection proves that. Otherwise
mark it unknown and identify who can decide it.

## 2. Inspect and trace

Read narrowly, then trace one real path end to end:

1. repository instructions and accepted PRD/spec/task/status artifacts;
2. package manager, installed versions, and project scripts;
3. route/entry point and every affected caller;
4. domain types, validation, authorization, and tenant/object scope;
5. schema, constraints, migrations, query boundary, and transaction behavior;
6. API/event contract and every producer/consumer;
7. UI states and any existing visual tokens or component system;
8. tests, telemetry, CI/release configuration, and relevant runtime evidence.

Record conflicts instead of choosing the most convenient source. Executed code,
migrations, machine-readable contracts, and runtime results normally outrank
stale prose, but an accepted policy decision can require changing them.

## 3. Select the lane and stop line

| Evidence | Route now | Stop line |
|---|---|---|
| Acceptance behavior and policy are settled | Start bounded implementation | Before deployment unless separately authorized |
| New bounded feature needs requirements/tasks | `prd-taskbreaker` | Explicit implementation approval |
| Several specification domains need traceability | `development-spec-suite` plus activated artifact owners | Explicit implementation approval |
| Target user, outcome, market, policy, or product direction is unresolved | `product-intelligence`, then the smallest spec route | Accepted direction, accepted requirements, and explicit implementation approval |
| One settled specialist concern | Route directly to that owner; do not use this orchestrator | The specialist's own evidence boundary |

Do not infer implementation approval from approval to research, draft, review, or
initialize a repository. Do not infer deploy approval from implementation approval.

## 4. Build the owner and contract map

For every changed fact, designate one canonical owner and enumerate producers and
consumers. A minimal map looks like this:

| Contract | Canonical source | Producers | Consumers | Compatibility decision | Proof |
|---|---|---|---|---|---|
| Product behavior | Accepted requirement/screen contract | Entry action/job | UI, API, tests | Accepted behavior delta | Runtime scenario |
| Architecture/runtime | Accepted technical decision and installed deployment configuration | Framework/platform components | Application layers, operations, release path | Atomic/staged boundary change | Project-native build plus runtime smoke |
| Domain/data | Existing schema/migration/domain model | Writes/imports | Reads, reports, jobs | Expand/migrate/contract or clean cutover | Constraint/query/migration observation |
| IAM | Accepted policy and server enforcement | Identity/session context | Every sensitive operation | Role/scope transition | Authorized and denied scenarios |
| API/event | Existing OpenAPI/event schema or route contract | Server/publisher | UI/client/subscriber | Version/atomic cutover decision | Contract check plus real request/event |
| UI state | Accepted screen/journey contract | Server/client state | User and assistive technology | State migration if persisted | Browser scenario |
| Telemetry | Existing semantic convention/runbook | Changed runtime path | Operator/alert/SLO | Field/cardinality/redaction decision | Observed signal |

If one code change would silently redefine another owner's contract, stop and
resolve the contract first. Keep one vocabulary for identifiers, status values,
errors, timestamps, money, locale, and tenant scope across layers.

## 5. Activate the smallest specialist chain

The arrows show ownership order, not a requirement to load every skill listed.
Skip any concern that inspection proves absent.

| Common combination | Minimal chain |
|---|---|
| Astro admin/CMS on Cloudflare | `admin-product-ux` -> `admin-dashboard` -> `astro-development` (+ `shadcn-ui` only for a React/shadcn island) -> `workers-best-practices` when Worker code/bindings change -> `ui-validation` |
| Next.js admin/CMS with plain Postgres/Drizzle | `admin-product-ux` -> `admin-dashboard` -> `postgres-drizzle` -> `nextjs-development` (+ `shadcn-ui` when used) -> `ui-validation` |
| Next.js admin/CMS with Supabase | `admin-product-ux` -> `admin-dashboard` -> `supabase-stack` -> `nextjs-development` (+ `shadcn-ui` when used) -> `ui-validation` |
| Astro storefront on Cloudflare | `storefront-ux` when behavior is unsettled -> `storefront-development` -> `astro-development` -> `workers-best-practices` when Worker code/bindings change -> `ui-validation` |
| Next.js storefront with Postgres/Drizzle | `storefront-ux` when behavior is unsettled -> `storefront-development` -> `postgres-drizzle` -> `nextjs-development` -> `ui-validation` |
| REST API contract change | `openapi-spec` -> framework/runtime owner -> data/IAM owners actually affected -> `testing-engineering` |
| Better Auth change | `better-auth-security` -> host framework owner, with `application-security` for the end-to-end trust boundary and `testing-engineering` for behavior |
| Plain PostgreSQL/Drizzle backend change | `postgres-drizzle` -> host framework/runtime owner -> `testing-engineering` |
| Supabase backend change | `supabase-stack` -> host framework owner when application code changes -> `testing-engineering` |
| Worker API change | `openapi-spec` when a REST contract changes -> `workers-best-practices` -> activated data/IAM owners -> `testing-engineering` |
| CI workflow change | domain owner for commands/contracts -> `github-actions`; do not claim hosted success without a hosted run |
| Telemetry/SLO change | application owner for emitted behavior -> `observability-engineering`; add `application-security` when data classification or redaction boundaries change |

Cross-cutting owners are conditional:

- activate `application-security` for changed trust boundaries, authn/authz,
  untrusted input/output, secrets, uploads, webhooks, sensitive data, or elevated
  business risk;
- activate `observability-engineering` when operational signals, alerts, SLOs,
  incident diagnosis, or telemetry fields change;
- activate `testing-engineering` for permanent observable behavior and regression
  strategy;
- activate `github-actions` only when CI workflow engineering changes;
- activate `web-perf` only when performance is accepted scope, a regression risk,
  or a measured problem;
- consult `native-first` before a dependency, helper, wrapper, cache, validation
  layer, or abstraction is added.

## 6. Freeze the vertical delta

Before implementation, state the smallest cross-layer delta in observable terms:

```text
Given <authorized actor/system and initial state>,
when <entry action/event>,
then <observable result>,
and <persistent/event/telemetry state>,
while <named failure or denied path> produces <recoverable/safe outcome>.
```

List exact fields/statuses/errors whose meanings change, affected callers, and
whether compatibility is atomic or staged. Do not start frontend and backend
from separate interpretations of prose. Do not add optional future fields,
framework adapters, or a generalized service layer without accepted need.

## 7. Implement in dependency order

1. **Contract and safety decision:** accept the field/state/error/IAM delta,
   compatibility mode, migration path, and rollback boundary.
2. **Data and IAM foundation:** let `postgres-drizzle`, `supabase-stack`, or the
   applicable platform owner change canonical persistence and access policy.
3. **API/runtime path:** let `openapi-spec` own a changed REST contract and the
   installed framework owner implement it. Update every producer and consumer.
4. **Frontend or system consumer:** implement all loading, empty, success,
   validation, denied, conflict, failure, retry, and recovery states that apply.
5. **Cross-cutting behavior:** add only accepted telemetry/security behavior and
   focused automated coverage through their owners.
6. **Cutover:** remove obsolete callers, dead code, superseded schema paths,
   temporary feature scaffolding, and stale documentation once the real path is
   proven.

A vertical slice may be one edit sequence or several dependency-ordered tasks.
Keep each task bounded to one accepted primary outcome; parallelize only slices
whose contracts and files are independent.

## 8. Trust-boundary and error-state pass

Inspect the boundaries below when present. The named skill chooses controls; this
orchestrator only ensures the boundary is owned and proved.

| Boundary/state | Questions to settle | Owner/evidence |
|---|---|---|
| Authentication/session | Who establishes identity, expiry, revocation, and origin trust? | `better-auth-security` or platform auth owner; `application-security` reviews cross-stack exposure; exercise invalid/expired state |
| Authorization/tenancy | Which role, object, tenant, and transition is allowed? Is enforcement server-side at every entry? | Product/IAM contract plus `application-security`; exercise allowed and denied cases |
| Untrusted input/output | What validates shape/size/content and where is encoding or response minimization enforced? | Host owner plus `application-security`; malformed and boundary cases |
| Persistence/migration | What is atomic, idempotent, constrained, backfilled, reversible, or deliberately irreversible? | `postgres-drizzle` or `supabase-stack`; inspect and exercise the selected local migration path |
| External API/webhook/job | What happens on timeout, duplicate, reordering, partial failure, and retry? | Integration/runtime owner plus `testing-engineering`; use a real local/sandbox boundary when available |
| UI async mutation | What does the user see during pending, success, validation, conflict, denied, failure, and recovery? | Product/UI owner and `ui-validation` |
| Telemetry | Can fields expose secrets, credentials, session data, personal data, or unbounded cardinality? Is the failure diagnosable? | `observability-engineering` plus `application-security` where sensitive; observe a safe signal |
| Release/schema rollout | Can old and new versions overlap? What is the rollback point? | Framework/data owner and `github-actions` when CI changes; record limitation rather than assume production behavior |

Never log raw secrets or production customer data for proof. Use controlled local,
test, or approved sandbox data.

## 9. Pass evidence gates

Use project-native scripts and the activated specialists to choose exact commands.
Run the smallest check that would fail for a plausible defect in the accepted
behavior.

| Gate | Minimum acceptable observed evidence | Not sufficient |
|---|---|---|
| Scope and approval | Accepted outcome/non-goals and explicit implementation state | An idea, planning approval, or inferred consent |
| Contract alignment | Canonical delta plus all producers/consumers updated and a relevant contract/schema check | Matching TypeScript names with divergent runtime semantics |
| Static/build | Narrow project script covering touched code | Unrelated project-wide success or an unexecuted command |
| Data | Generated/selected migration or local schema path inspected and the affected invariant/query observed | Compilation or blindly applying production changes |
| IAM/security | Relevant allowed and denied/malformed scenarios produce safe outcomes | Hidden UI control or happy-path login only |
| Automated behavior | Focused test selected by `testing-engineering` passes and would fail for a plausible regression | Snapshot/source-text test with no behavior contract |
| Browser-visible behavior | `ui-validation` exercises the real flow, relevant viewport(s), keyboard/critical states, and records concrete observations | Build, screenshot alone, or component render without interaction |
| Non-UI runtime | Real local/sandbox endpoint, Worker, job, CLI, or integration path produces the expected response and state | Unit mock alone |
| Observability | Relevant success/failure signal is observed, useful, and redacted | A logging call present in source |
| Performance | `web-perf` records the requested/risk-relevant measurement and limitation | Guessed improvement or bundle size alone when runtime performance is claimed |
| CI/release | Changed workflow is owned by `github-actions`; local and hosted evidence are distinguished | YAML presence or local success claimed as hosted CI |

If a required environment is unavailable, finish all reachable gates and report
the exact missing system, attempted evidence, and unproved claim. Never replace a
real boundary with a fake fallback and call the feature complete.

## 10. Reconcile and clean up

After runtime proof:

- update accepted canonical artifacts whose facts changed; preserve their IDs and
  ownership conventions;
- remove obsolete code, aliases, old callers, temporary adapters, debug output,
  fixtures used only for manual proof, and superseded comments;
- retain tests only when they defend an observable contract;
- update existing operational/release documentation only when the changed
  behavior makes it inaccurate;
- do not add speculative compatibility layers, generic docs, changelogs, or
  templates outside repository convention;
- do not commit, push, merge, deploy, or apply production migrations without the
  corresponding explicit authorization.

## 11. Return the evidence packet

Report only observed results and clearly label inference:

```text
Outcome delivered:
Files/contracts changed and invariant protected:
Activated skills and why:
Verification command/scenario -> observed result:
Browser/runtime target and state observed:
Security/telemetry/performance evidence (when activated):
Migration/compatibility/rollback state:
Hosted CI or release evidence (if actually observed):
Unproved claims, blockers, overlap, and remaining risk:
```

A complete packet is concise but reproducible. It separates accepted criteria,
the procedure run, and the fresh result; it never turns a planned check into a
passing result.
