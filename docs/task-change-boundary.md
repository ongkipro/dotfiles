# Task Change Boundary

`delivery-ledger` owns the deterministic task change boundary. The boundary does
not make critical code immutable; it prevents unrelated, pre-existing, or
higher-risk changes from reaching `PASS` silently.

## Contract and flow

For every R1-R4 run, `delivery-ledger start` requires at least one `--allow`
pattern. It records the resolved base HEAD, declared risk, allowed and protected
patterns, and a content fingerprint for every tracked or untracked dirty path in
the initial `run_started` event. `.delivery/` is excluded because the ledger is
its canonical writer.

```text
TASKS.md contract
  -> delivery-ledger start (baseline + declared surface)
  -> implementation
  -> verification events
  -> optional requirement-linked scope expansion
  -> check-boundary (actual task-owned surface + effective risk)
  -> independent review when required
  -> finish
```

R0 runs may omit a boundary when the requested documentation or mechanical file
is self-evident. R1-R4 runs fail to start without an explicit surface. Patterns
are repository-relative, `/`-separated, and case-sensitive. `*` and `?` match
within one path segment; `**` crosses directories. Absolute paths, backslashes,
empty segments, `.` segments, and `..` segments are rejected.

Example:

```bash
delivery-ledger --repo . start \
  --task TASK-123 \
  --requirement REQ-4 \
  --risk R1 \
  --worker cart-developer \
  --model openai-codex/gpt-5.6-terra \
  --provider openai-codex \
  --reasoning-effort medium \
  --allow 'src/cart/**' \
  --allow 'src/components/cart/**' \
  --protect 'src/auth/**' \
  --protect 'db/migrations/**' \
  --protected-risk R3
```

If an allowed pattern overlaps initial dirty work, start returns `BLOCKED` as an
error. Continue only after reviewing the exact file and repeating an explicit
`--accept-dirty '<path-or-pattern>'`. This records permission to continue; it
does not relabel the existing work as task-owned. Any later fingerprint change
to that path remains `PREEXISTING` and requires review.

## Final surface classification

`check-boundary` compares the current worktree with the captured fingerprints.
It does not reset, clean, stash, restore, normalize, stage, or commit anything.
It classifies each actual task change as:

- `ALLOWED`: matches the declared surface.
- `OUT_OF_SCOPE`: does not match the declared surface.
- `PREEXISTING`: changed after being present in the initial dirty set.
- `PROTECTED`: matches a protected pattern, whether or not it is allowed.
- `UNKNOWN`: a filesystem object cannot be fingerprinted safely.

Tracked edits, staged edits, deletions, untracked files, and both sides of a
staged Git rename are included. Unchanged initial dirty paths remain separately
listed as `preexistingUnchanged`; they are never claimed as task changes.
Unexpected HEAD movement fails the boundary because a different commit makes
the captured worktree baseline ambiguous.

The report stores the actual changed paths, classifications, scope violations,
risk findings, effective risk, required review, residual failures, and a digest
of the final surface in the hash-chained run evidence.

## Scope expansion and risk

An out-of-scope file can be accepted only through a requirement-linked event:

```bash
delivery-ledger --repo . expand-scope \
  --path 'src/auth/session.ts' \
  --reason 'REQ-4 calls the shared session boundary' \
  --required-by 'TASK-123 REQ-4 acceptance criterion 4' \
  --risk R3 \
  --verification auth-regression \
  --verification cart-integration
```

The active task or requirement must appear in `--required-by`. A generic reason
such as `cleanup`, `refactor`, `while here`, or `better architecture` is not a
scope dependency. Every named verification must exist as a passing
`delivery-ledger record` event before the expansion can be accepted.

`diff-risk` remains the only sensitive-path classifier. Its explicit-path mode
classifies only task-owned paths, so unrelated initial dirty work cannot inflate
or hide task risk. Effective risk is the maximum of declared risk, diff risk,
protected-surface risk, and accepted-expansion risk. Protected changes, accepted
expansions, touched accepted dirty paths, risk escalation, and every R3/R4 result
require independent review:

```bash
delivery-ledger --repo . record --check auth-regression --status PASS
delivery-ledger --repo . record --check cart-integration --status PASS
delivery-ledger --repo . check-boundary       # exit 2: REVIEW_REQUIRED
delivery-ledger --repo . review-boundary \
  --reviewer security-reviewer \
  --reviewer-model claude-opus-5 \
  --reviewer-provider anthropic \
  --reviewer-reasoning xhigh
delivery-ledger --repo . finish --result PASS
```

Every R1-R4 run must declare a resolved route. `--model`, `--provider`, and
`--reasoning-effort` may not be `unknown`; a metric that genuinely does not
exist — a deterministic script has no model route — is recorded as
`unavailable: <reason>` so the gap is stated rather than invented.

The reviewer identifier must differ from the run's worker, and where policy
requires independent review the reviewer's model or provider must differ from
the implementer's too. Identities and routes are compared case- and
whitespace-insensitively, so re-casing a name is not a second reviewer. A review
binds to the latest boundary event and surface digest. Any later worktree change invalidates
it and requires another check and review.

## Parallel child runs

The parent run remains the single evidence owner. Each isolated worker is added
with `start-child`, including its allowed paths, accepted invariant, and
semantic owner. Two active children cannot share an owner even when their path
globs are disjoint; this catches semantic overlap such as two files modifying
the same session or pricing invariant.

```bash
delivery-ledger --repo . start-child \
  --child cart-api --task TASK-123-A --risk R2 \
  --allow 'src/cart/**' --owner commerce.pricing \
  --invariant 'totals use the accepted pricing rule'
delivery-ledger --repo . record-child \
  --child cart-api --check cart-regression --status PASS
delivery-ledger --repo . finish-child \
  --child cart-api --result PASS --patch /tmp/cart-api.patch
delivery-ledger --repo . integrate-child \
  --child cart-api --patch /tmp/cart-api.patch
```

A passing child needs passing checks and a patch whose paths fit its boundary.
The ledger records its digest and paths. Integration is denied while any child
is unfinished, if evidence changed, if a prior integrated patch owns the same
path, or if `git apply --check` fails. The parent applies finished patches one
at a time; parent `PASS` is denied until every child is successfully integrated.
No child patch is auto-applied by OMP.

## Result and exit semantics

| Result | Exit | Meaning |
|---|---:|---|
| `PASS` | 0 | Actual changes are allowed and the effective risk needs no additional review. |
| `REVIEW_REQUIRED` | 2 | The change is explainable, but protected/expanded/R3+ or accepted dirty work requires independent approval. |
| `FAIL` | 1 | HEAD moved, an unknown object changed, user work was touched without acceptance, scope expansion is unexplained, or required verification is missing. |
| `BLOCKED` | 1 at start | Initial dirty work overlaps the required surface without an explicit safe continuation. |

`finish --result PASS` recomputes the boundary. It requires a matching final
`boundary_check`, only passing verification events, and a bound approval for
`REVIEW_REQUIRED`. A stale, failed, or missing check denies completion.

## Known limitations

- This is a completion/evidence gate, not a filesystem write interceptor. It
  proves the final surface and denies `PASS`; it cannot stop an editor at the
  instant of an accidental write.
- Ignored files are outside Git's change surface. Secrets and generated outputs
  remain governed by repository ignore and security policy.
- Worktree fingerprints distinguish initial user content from later content but
  do not attribute individual lines when both user and task edits share one
  accepted dirty file. Such overlap always requires review.
- HEAD must remain fixed during a bounded run. Commit after the run finishes;
  otherwise start a fresh run against the new HEAD.
- Patterns deliberately use case-sensitive POSIX repository paths on Linux and
  macOS. No filesystem-dependent case folding is performed.
- Submodules and other non-file/non-symlink dirty objects fail safe as `UNKNOWN`
  until a dedicated invariant is added.
