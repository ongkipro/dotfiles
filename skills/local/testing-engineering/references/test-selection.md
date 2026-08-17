# Contract and risk selection

Use this reference when one change could attract many tests. The goal is a small
portfolio in which each case catches a different plausible defect.

## Translate a diff into contracts

Trace outward from the changed code until reaching observable behavior:

1. **Entrypoint** — exported function, route, command, event consumer, scheduled
   job, server action, or UI action.
2. **Actor and authority** — anonymous user, account, tenant, role, service, or
   system job.
3. **Input and prior state** — valid, boundary, malformed, absent, stale, or
   duplicated input; relevant persisted state.
4. **Outcome** — response, state transition, durable event, rendered behavior,
   or external request.
5. **Failure behavior** — error category/status, rollback, retained state,
   retryability, and data disclosure.
6. **Temporal behavior** — ordering, duplicate delivery, expiration, concurrency,
   or eventual visibility.

Write each candidate as:

> Given **actor/input/state**, when **public action**, then **observable result**
> and **side-effect invariant**.

If the sentence names a private helper or mocked call rather than an observable
result, move outward.

## Prioritize the risks

Rank candidate failures without false precision:

| Dimension | Lower risk | Higher risk |
|---|---|---|
| Impact | Cosmetic/local and recoverable | Money, access, data loss, cross-tenant leak, irreversible effect |
| Likelihood | Mature unchanged path | New branch, integration, migration, race, retry, ambiguous requirement |
| Detectability | Immediate obvious error | Silent corruption, duplicate effect, stale data, intermittent failure |
| Reach | One internal caller | Public API, shared library, many tenants/consumers |

Cover high-impact silent failures first. Merge candidates when one faithful test
proves the same invariant; split when different setup or failure causes would be
hidden by a broad scenario.

## Choose the lowest faithful layer

### Unit

Choose a unit test when all behavior can be represented without lying about the
runtime. Good targets include policy tables, parsers, monetary calculations,
state transitions, pure validation, and error classification. Keep real values
at the boundary; a mock-only assertion is not a contract.

### Integration

Choose integration when correctness comes from collaboration or infrastructure:
serialization, middleware order, database constraints/transactions, filesystem,
queue delivery, runtime bindings, session handling, or framework request/response
semantics. Use the project's real test adapter and isolated resources.

### Contract

Choose contract tests when two independently changing components must agree:
HTTP provider and client, event producer and consumer, webhook verifier and
sender format, or owned adapter and vendor response mapping. Test accepted
examples and meaningful incompatibilities. Validate behavior against the
canonical artifact where one exists; `openapi-spec` owns REST specification
authoring.

A contract test is not a network test by definition. It may run a provider
in-process, replay accepted fixtures, or exercise a maintained sandbox. What
matters is that both sides agree on externally meaningful semantics without
asserting private implementation.

### E2E

Choose E2E only for assembled-system risk: routing plus session plus persistence,
a critical user journey, runtime deployment semantics, or a failure impossible
to reproduce faithfully below the surface. Keep it to critical paths and avoid
retesting every pure branch. Hand browser operation, responsive/visual checks,
hydration, keyboard behavior, and evidence to `ui-validation`.

## Minimum cases by change type

| Change | Minimum useful portfolio |
|---|---|
| Pure rule/calculation | Representative success plus the boundary/invariant changed |
| Bug fix | One regression reproducing the old failure at the nearest public boundary |
| API request/response | Accepted case plus changed error/compatibility case; integration if runtime serialization matters |
| Authorization | Permitted case, closest forbidden case, and no protected side effect/data leak |
| Database query/constraint | Real-engine success plus the constraint, transaction, or isolation failure at risk |
| Migration | Clean application; representative upgrade when existing data is at risk; post-migration read/write invariant |
| Retry/idempotency | First success, retryable failure then success, exhaustion, and duplicate effect invariant as applicable |
| External adapter | Owned mapping success plus relevant timeout/protocol/malformed response; optional explicit sandbox smoke |
| UI control | Semantic component behavior if valuable; actual browser and accessibility evidence via `ui-validation` |
| Refactor | Existing behavioral test; no new test when contract and risk are unchanged |

These are selection prompts, not quotas. Omit cases that cannot occur or prove no
new behavior; state why.

## Assertion quality

Prefer authoritative postconditions:

- response status/category and contractual fields;
- database rows and absence of forbidden rows;
- committed state transition and rollback behavior;
- durable event payload and cardinality;
- visible accessible state at a browser boundary;
- external request mapped at the owned adapter seam.

Avoid:

- exact whole-object equality when only a few fields are contractual;
- snapshots that hide why behavior changed;
- checking method call counts without checking the effect they protect;
- asserting exact timestamps, random IDs, unordered rows, or error prose unless
  explicitly part of the contract;
- testing language/runtime behavior, third-party internals, or generated code
  rather than the application's use of them.

## When to stop

Stop adding tests when each high-risk contract has one faithful failure signal,
remaining candidates duplicate that signal, and lower layers already isolate
branch detail. More tests are harmful when they lengthen feedback without adding
defect detection or freeze internal structure.
