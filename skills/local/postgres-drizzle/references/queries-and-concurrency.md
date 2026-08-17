# Queries, transactions, indexes, and concurrency

Start from the observable invariant and a real query shape. Do not add an index, lock,
isolation level, retry loop, or cache before identifying the actual anomaly or plan.
Retrieve the installed Drizzle transaction/query API and driver error behavior before
implementation.

## Transaction design

List every read/write in the unit, the invariant at commit, possible competing
transactions, and external effects. Keep network/API calls, queue publication, email,
and file operations outside retryable transaction bodies unless an established outbox
or idempotency contract covers them.

PostgreSQL behavior to account for:

| Isolation | Relevant behavior | Engineering response |
|---|---|---|
| Read Committed | each statement gets a current snapshot; rows can change between statements | prefer atomic DML; lock/recheck where needed |
| Repeatable Read | transaction snapshot is stable; write conflicts can abort | retry whole safe transaction when SQLSTATE warrants |
| Serializable | detects dangerous dependency structures and may abort | bounded whole-transaction retry; idempotent external effects |

Stronger isolation is not a substitute for keys or constraints. `READ UNCOMMITTED` maps
to PostgreSQL's Read Committed behavior. Confirm exact target-version semantics from the
official transaction isolation documentation.

## Atomic write patterns

- Insert-or-update: use the intended unique arbiter and atomic conflict action. Decide
  whether “do nothing,” replace selected fields, accumulate, or reject is correct.
- State transition: guarded update with current state/version in the predicate; zero rows
  is a domain conflict, not success.
- Counters/inventory: update relative to current value with a constraint/predicate and
  inspect affected/returned rows; avoid read-compute-write races.
- Work claim: row locking with `SKIP LOCKED` can suit multi-consumer queues, but it gives
  an intentionally inconsistent view and requires lease/retry/failure semantics.
- Exactly-once claims: usually require a unique idempotency key plus transactional state,
  not faith in delivery behavior.

Map expected PostgreSQL SQLSTATE/constraint names to stable domain errors at the data
boundary. Do not expose raw SQL, parameters, or internal schema details to clients.

## Locking

Use the weakest lock that protects the stated invariant. Document:

- relation/rows/key/advisory namespace being locked;
- deterministic acquisition order across all code paths;
- wait/timeout/cancellation behavior;
- deadlock and serialization handling;
- what happens after worker death or transaction rollback.

Row locks protect selected rows, not absent rows or arbitrary predicates. Advisory locks
are application-defined coordination and do not enforce relational integrity; session-
level advisory locks are especially unsafe through transaction pools. Table DDL takes
relation locks that can queue behind long transactions and then block following traffic.
Inspect active transaction age and rehearse the operation rather than assuming the DDL
statement is small.

Retry only recognized transient transaction failures, and retry the complete transaction
from a clean boundary. Bound attempts and use jitter/backoff appropriate to the project.
Uniqueness/check/FK violations, syntax errors, authorization failures, and deterministic
bad input do not become transient because a retry library is available.

## Index design

Derive an index from a named query:

1. equality/range predicates and join keys;
2. tenant prefix and data distribution;
3. requested order, direction, null ordering, and stable tie-breaker;
4. selected columns and whether index-only access is realistic;
5. partial predicate and whether the query logically implies it;
6. expression/operator/operator class/collation;
7. write amplification, storage, vacuum, and overlapping-index cost.

Foreign keys do not automatically create an index on referencing columns. Unique or
primary-key enforcement creates supporting indexes, but these may not match tenant/query
ordering. Remove a redundant index only after checking all constraints and query shapes.

## Plans and measurements

Use representative parameters and data distribution. Plain `EXPLAIN` does not execute;
`EXPLAIN ANALYZE` executes the statement and can mutate data for DML. On an approved
non-production target, compare estimated versus actual rows, loops, total time, sort
method/spill, buffers when enabled, heap fetches, and filter rows. Look for stale
statistics, skew, correlation, or parameter sensitivity before forcing an index.

A sequential scan is not automatically wrong, and the presence of an index scan is not
proof of an improvement. Measure returned correctness and latency under realistic
concurrency. Do not paste plans containing literals or row data into public artifacts.
Production performance diagnosis and alerting belong to `observability-engineering` and
`web-perf` does not own database query plans.

## Pagination

Keyset pagination is the default for large/mutable ordered sets:

- define a deterministic total order ending in a unique immutable tie-breaker;
- make cursor fields match filter/tenant scope, direction, collation, and null semantics;
- compare tuples or an equivalent lexicographic predicate consistent with the order;
- fetch one extra row to determine continuation;
- encode cursors as opaque transport values and validate them at the API boundary;
- define whether updates can move an item between pages and whether snapshot consistency
  is required.

For descending/backward pages, reverse both comparison and order for retrieval, then
return results in the contract's presentation order. Mixed directions and nullable sort
keys need explicit predicates and matching indexes; never improvise them from a generic
cursor helper.

Offset/limit is reasonable for small, stable admin lists or explicit page-number UX when
scan cost and insert/delete drift are accepted. Always include deterministic order.
Counts may be expensive and snapshot-relative; do not promise an exact total without a
product need and query plan.

## Concurrency proof

A concurrency fix needs an executable two-session schedule, not a unit mock:

1. establish boundary data;
2. begin transaction A and reach the contested point;
3. begin transaction B and attempt the competing operation;
4. release/commit in the intended order;
5. observe blocking, returned rows, SQLSTATE/domain error, and final invariant;
6. repeat through the real Drizzle/driver path when that path owns retry/error mapping.

Use explicit timeouts so the proof fails rather than hangs. Clean only the isolated test
data you created; do not run concurrency experiments against production.
