# Skill Evaluation Contract

Use this contract when creating or materially changing a shared skill,
development workflow, routing rule, hook policy, or cross-CLI adapter. It does
not replace the repository's validators, tests, delivery ledger, or independent
review gates.

## Define before editing

Record the smallest useful evaluation set:

- **Capability scenario:** a representative request the changed system must
  handle that the previous version could not handle reliably.
- **Regression scenario:** an established request, invariant, or runtime that
  must keep working.
- **Expected route:** the owner, canonical artifact, approval boundary, and
  evidence the scenario should select.
- **Failure signal:** an observable result that makes the scenario fail.

Do not manufacture a large benchmark for a wording-only correction. Do not
accept a metadata validator as proof that the methodology produces the intended
route.

## Grade with the strongest available evidence

Use this order:

1. **Deterministic executable evidence:** schema validation, unit or regression
   test, fixture, policy lint, link/sync check, boundary check, or runtime probe.
2. **Structured model review:** only for semantic routing, document quality, or
   other criteria that cannot be fully encoded. Give the reviewer the expected
   behavior, evidence, and explicit fail conditions.
3. **Human judgment:** required for subjective direction, consequential product
   or policy choices, and approval boundaries owned by the user.

Model review cannot overrule a failed executable check. A screenshot cannot
prove interaction, and a successful interaction cannot prove accepted visual
quality.

## Report honestly

- Report the exact scenario and executed check, not merely `PASS`.
- Separate capability evidence from regression evidence.
- State skipped, unavailable, or environment-dependent checks.
- One pass proves one observed run. Report reliability percentages, `pass@k`,
  or repeated-success metrics only after independent, controlled trials whose
  sample and conditions are recorded.
- Persist durable evidence in the repository's existing test, task, status,
  build-log, or delivery-ledger system. Never create `.claude/evals/` or another
  competing execution truth by default.

## Cross-CLI regression set

For an owned canonical skill, verify at minimum:

- valid skill metadata and progressive-disclosure structure;
- the expected trigger and owner boundary remain clear;
- no runtime-specific model, agent, MCP, secret, or approval policy leaked into
  the shared methodology;
- runtime adapters still resolve to the canonical owned source;
- repository policy lint and task-boundary checks pass.

Add scenario-specific tests for the behavior changed. Do not impose a universal
coverage percentage or install throwaway tooling merely to produce a green
report.

## Portable decision scenarios

`ai-workflow-eval check` validates the shared scenario bank. `prompt` emits only
synthetic context/conversations, a response schema and global choices; `grade`
checks a supplied response against the current suite and instruction revision.
It invokes no provider and runs no simulated action. See
[system procedures](../../../../docs/adaptive-ai-system.md) for trial/review usage.

A decision PASS still leaves behavior UNVERIFIED and semantic review REQUIRED.
Review natural-language replies against each case rubric for contradictory
actions, lost constraints and invented evidence; structured flags are not truth.
Use isolated project-native execution tests for real full-stack claims. Record
actual runtime/model when exposed, otherwise an explicit unavailable reason.
Synthetic fixture success validates the grader, not the model.

## Observed execution

For a small portable coding trial, `ai-workflow-eval execution-init DIR` exports
a deliberately defective synthetic order-note application. A separate worker
repairs only that copy. `execution-check DIR --out FRESH_DIR --runtime ACTUAL
--model ACTUAL` starts it on loopback and applies an external HTTP/SQLite/browser
oracle. Reference exports verify the oracle; they are not model trials.

See [execution procedures](../../../../docs/ai-execution-evaluation.md). Full PASS
requires the real browser journey and independent database assertions. Missing
Node/browser or `--api-only` remains UNVERIFIED; behavioral failures are FAIL.
Preserve attempts, revision hashes, exact provenance gaps and visual review.
This synthetic exercise complements project-native tests and independent review;
it cannot certify general model capability or production authorization.
