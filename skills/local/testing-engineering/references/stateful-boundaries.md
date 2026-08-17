# Stateful and trust-boundary testing

Use this reference when correctness depends on persisted state, migrations,
identity, external systems, retries, or concurrent execution. Platform-specific
setup stays with the owning specialist and the repository's existing harness.

## Database behavior and migrations

Use the actual database engine in an isolated environment when the risk involves
SQL semantics, constraints, generated/default values, transactions, locks,
isolation, indexes, triggers, or migrations. A repository fake remains useful
for pure application policy, but it cannot prove those properties.

### Data isolation checklist

- Allocate unique database/schema/namespace or rows per test worker using the
  established harness.
- Make tenant, account, idempotency, and external IDs unique; do not assume an
  empty shared table.
- Choose transaction rollback only when code under test does not open independent
  connections or commit outside that transaction.
- If cleanup is explicit, register it before the action and execute it even after
  assertion failure. Cleanup failure must remain visible.
- Never connect to production or a shared developer database. Validate the target
  identity before destructive setup.
- Run tests in arbitrary order and, where CI does so, multiple workers. Isolation
  is not proven by a serial local pass.

### Migration evidence

Separate migration generation/review from behavioral evidence.
`postgres-drizzle` owns Drizzle and PostgreSQL implementation decisions.
Testing should prove the accepted migration contract:

1. apply the migration chain to a clean isolated database;
2. exercise post-migration reads and writes through the application boundary;
3. if deployed data may exist, seed the smallest representative old shape and
   upgrade it;
4. assert preserved/backfilled data, new constraints/defaults, and application
   compatibility;
5. test rollback only when rollback is an accepted, supported operational
   contract—never invent a destructive reverse migration for test symmetry.

Cover uniqueness, foreign keys, nullability, precision/timezone, and transaction
behavior only when touched or consequential. Do not assert generated SQL text as
a proxy for applying it.

## Authentication and authorization

Model identity separately from authority. A useful matrix selects applicable
states rather than mechanically testing every cell:

| State | Expected invariant |
|---|---|
| No/invalid session | Authentication required; no protected data or mutation |
| Expired/revoked state | Rejected according to accepted session contract; no stale authority |
| Valid identity, wrong tenant/owner | No cross-boundary existence/data disclosure or mutation |
| Valid identity, insufficient role/scope | Forbidden operation; unchanged protected state |
| Valid authorized identity | Intended result limited to authorized scope |
| Elevated/admin identity | Explicitly allowed actions only; audit behavior if contractual |

Test at the enforcement boundary, not only the UI hiding a control. When denial
could reveal existence, compare externally observable responses according to the
accepted security contract. Assert that denied operations emit no durable job,
email, payment, or data mutation. Do not log or snapshot session cookies, tokens,
passwords, reset links, OAuth credentials, or secrets.

`application-security` owns threat modeling and cross-stack control design;
`better-auth-security` owns Better Auth configuration and hardening. Tests encode
the resulting policy and guard it from regression.

## External services

Define the boundary the application owns: request construction, response/error
mapping, webhook verification, and retry classification. Fake there rather than
mocking business logic or rebuilding the vendor SDK.

A focused fake should be able to produce only meaningful protocol conditions:

- accepted response;
- documented permanent error;
- documented retryable error or timeout;
- malformed/partial response if the adapter must defend against it;
- duplicate or out-of-order webhook/event if delivery semantics allow it.

Keep recorded fixtures minimal, reviewed, scrubbed of credentials and personal
data, and tied to a documented vendor version. A recorded happy response alone
cannot prove current sandbox connectivity.

Use a real sandbox smoke check when all are true:

- an official maintained sandbox/test mode exists;
- approved credentials are available without reading or exposing secrets;
- the operation cannot affect production and has bounded cost/rate impact;
- test resources can be uniquely named and safely cleaned up;
- the check is explicitly selected, not hidden in the hermetic default suite.

Report service/environment, operation, created identifiers in a non-sensitive
form, cleanup outcome, and what remains unproved. A sandbox success does not
replace deterministic timeout/error/retry tests.

## Retry, idempotency, and partial failure

First write the invariant. Examples:

- one charge/order/email for one idempotency key;
- repeated delivery converges to the same stored result;
- a retry never overwrites a newer state;
- attempts stop after the accepted bound;
- permanent errors do not retry;
- retryable errors preserve enough state to resume safely.

Then select only reachable schedules:

1. first attempt succeeds;
2. retryable failure precedes success;
3. retryable failures exhaust the bound;
4. permanent failure stops immediately;
5. duplicate request/event arrives before or after completion;
6. process fails after external effect but before local acknowledgement;
7. simultaneous executions contest the same logical operation.

Do not wait through real backoff. Use the installed fake clock or an injected
scheduler seam established by the production design, then assert attempts and
final authoritative state. Avoid asserting the exact internal sequence unless
it is externally contractual.

## Deterministic concurrency

Replace sleeps and hopeful timing with synchronization:

- a barrier releases two operations only after both reach the contested point;
- a deferred promise pauses an adapter between read and write;
- database locks/transactions create the actual conflict being tested;
- a harness scheduler advances queued work deterministically.

Assert the safety property after all operations settle: balance non-negative,
capacity not exceeded, one winner, no lost update, no duplicate effect, or
explicit conflict response. Repeat runs can expose a race but are not the proof;
the controlled interleaving and invariant are.

## Error-state fidelity

Exercise errors at the boundary that can actually produce them. Preserve useful
causes for operators while returning only the accepted client-facing category.
Tests should distinguish validation, authentication, authorization, conflict,
not-found, dependency failure, timeout, and internal failure only where the
contract does. Never make a test pass by swallowing an unexpected exception or
mapping every failure to one generic success-shaped fallback.
