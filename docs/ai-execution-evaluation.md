# Local execution evaluation

TASK-119 extends the decision-only evaluator with one small observed coding
exercise. It reuses the existing `ai-workflow-eval` command and owned `ui-ref`
browser transport. It installs no dependency, invokes no model/provider, and
does not change CLI settings. OMP has no special role.

Use Python 3.10+ for the local app/oracle. The browser lane reuses the existing
Node 22+ transport and an available Chrome/Chromium installation.

## Run a repair trial

```sh
ai-workflow-eval execution-init ~/Projects/order-note-trial
# Give the exported README and app to a separate worker/session.
# The worker repairs only app.py and index.html, then reports actual checks.
ai-workflow-eval execution-check ~/Projects/order-note-trial \
  --out ~/Documents/work/research/order-note-trial-evidence \
  --runtime codex --model 'unavailable: runtime does not expose model ID'
```

Use the actual participating CLI/model when exposed. Runtime/model labels are
operator-supplied provenance, not automatic provider attestation. Neither command
chooses, downloads or calls an AI. The exercise works with any worker that can
edit the exported Python/HTML files and follow their English contract.

Export and evidence destinations must be fresh. Existing paths are preserved.
Evidence must be outside the candidate. The marker binds the exported contract
to the trusted fixture revision; changes require a new export. The checker reads
only the expected fixture files, starts the candidate with a minimal environment,
and owns its local process groups. Credentials and real session profiles are
not inputs. Candidate code is authorized local code: directory separation is
not an OS security sandbox and does not make hostile code safe to execute.

## What is checked

The deliberately defective default export omits tenant filtering in the shared
order lookup. The worker sees the functional contract, not a copy of the correct
implementation or the oracle source. The trusted tests and browser runner stay
in dotfiles outside the candidate directory.

The evaluator owns a fresh SQLite database with public synthetic orders and
fake server-side session memberships. It checks owned reads/writes, foreign
reads/writes, tenant spoofing through query/header/body, unknown order, missing
and invalid sessions, invalid payloads, collateral changes and audit atomicity.
Each rejected operation must leave both tables unchanged. Every database
assertion uses a separate connection.

A trigger rejects the audit insertion for `blocked-write` after the order UPDATE.
This exercises rollback after a real SQL mutation. The checker restarts the
application and checks the saved note and absence of partial state again.

The browser uses a fresh Chrome/Chromium profile and the same cookie/API path.
Native keyboard and mouse input saves a note, navigation confirms persistence,
then a failed write must show a visible actionable error, retain input and enable
retry. Reload must show the previous saved note. A further independent database
assertion checks the browser's writes and rollback. Screenshots and overflow
checks cover 390px and 1280px; the session owner inspects the actual images.

The runner records runtime exceptions, console errors and network failures. Its
only expected HTTP error is the deliberate blocked-write PATCH503, correlated
by request ID and body. Success requires every required browser assertion, two
PNG captures, matching exit status and independent database state. Screenshots
alone never prove the interaction or subjective design quality.

This is a restrained internal test fixture built from semantic native form
controls, not a new public product design. It makes no design-taste gate claim.
Public UI work still follows reference research, design direction and its
existing rendered-browser/design-gate contracts.

## Results and evidence

| Result | Exit | Meaning |
| --- | --- | --- |
| PASS | 0 | All API, transaction, restart, browser and database assertions passed. |
| FAIL | 1 | A behavioral assertion or execution infrastructure check failed. |
| UNVERIFIED | 2 | API passed, but the browser was unavailable or deliberately skipped. |

`--api-only` is useful for fast regression checks and always leaves the whole
journey UNVERIFIED. Missing Node/Chrome does the same. An unavailable dependency
must not be substituted with an invented successful browser result.

Each fresh evidence directory contains `report.json`, `browser-report.json`
when run, `390.png`, `1280.png`, synthetic `state.sqlite`, readiness files and
local process logs. Reports bind candidate/contract/oracle hashes,
actual Python/browser versions, provenance labels and case outcomes. The caller
retains attempts and records the durable summary in the existing delivery ledger.
No independent benchmark database or scheduler is created.

`execution-init DIR --reference` exports the correct implementation to test the
oracle. `ai-workflow-eval-test` exercises decision regression fixtures and API
mutants: missing tenant filter, missing commit and a commit before audit failure.
Only a failed relevant behavioral assertion counts as detecting a mutant;
startup/syntax failure is separately labelled infrastructure failure.

Run `ai-workflow-eval-test --browser` explicitly for the real reference journey,
disabled-submit, invisible-feedback and offscreen-feedback mutations. The normal test run
reports these browser cases as skipped; it does not certify them.

For TASK-119, an independent worker repaired a fresh defective export and the
session owner reran the external checker in a separate evidence directory.
Reference success and this coding trial are separate evidence types. A disabled
submit-handler mutation checks that browser interaction is necessary; invisible
feedback checks that matching text is not enough. Exact final outcomes and
hashes belong to the task's immutable delivery artifact.

One successful synthetic repair is one observed run. It provides no reliability
percentage, before/after model comparison, production authentication assurance,
hosted macOS result, or proof that an older model matches a newer one. Real
application delivery continues to require project-native checks and review.

## Implementation references

- [Chrome DevTools protocol](https://chromedevtools.github.io/devtools-protocol/):
  native browser input, runtime/network events and screenshots.
- [Python SQLite transactions](https://docs.python.org/3.12/library/sqlite3.html#transaction-control):
  explicit commit/rollback semantics; tested against installed Python 3.12.
- [Owned browser validation](../skills/local/ui-validation/SKILL.md) and
  [skill evaluation contract](../skills/local/development-kit/references/skill-evaluation.md).
