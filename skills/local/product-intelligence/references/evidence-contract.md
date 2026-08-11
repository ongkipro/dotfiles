# Evidence and Claim Contract

This reference governs product-intelligence claims. The canonical status enum, identifiers, task links, ownership, and runtime-evidence rules remain in [`development-spec-suite` requirements traceability](../../development-spec-suite/references/requirements-traceability.md); its source ledger and [`audit-sources.py`](../../development-spec-suite/scripts/audit-sources.py) remain the only source-record contract. Do not create a parallel status, source schema, or evidence namespace.

## Status and evidence kind are different fields

Use exactly the canonical statuses `Observed`, `Decision`, `Assumption`, `Proposal`, `Unknown`, and `Evidence`. Evidence kind describes provenance; it never changes lifecycle status.

| Evidence kind | Appropriate canonical status | Required provenance | What it may support |
|---|---|---|---|
| `direct-observation` | `Observed` | Exact repository/runtime/interview/transaction locator, observer or method, date, scope/population, and safe excerpt or result | Only the bounded behavior or statement actually observed |
| `external-publication` | `Evidence` | Canonical source-ledger ID, exact locator and safe excerpt, publisher, relevant dates, method/coverage, applicability, and limitations | Claims entailed within the source's population, unit, geography, period, and method |
| `calculated-result` | `Evidence` | Formula, every input and source/assumption link, unit, boundary, period, geography, currency/conversion when applicable, deterministic output, and reproducible calculation locator | The calculated result within its inputs, scenarios, and sensitivity |
| `inference` | `Proposal` | Supporting and refuting IDs, reasoning, confidence with reason, limitations, and next discriminating evidence | A recommendation, never an observed fact |
| `hypothesis` | `Assumption` | Scope, falsifiable prediction, owner, test/research action, and review trigger | A research or test target, never accepted evidence |
| `human-policy` | `Decision` | Accountable owner, options, selected option or unresolved gate, recommended default, evidence, trade-offs, consequence, and decision date/gate | The chosen policy or constraint, not empirical truth |
| `none` | `Unknown` | Missing field, owner, consequence, next evidence or decision, and due gate | An explicit gap only |

Evidence kind values are provenance mappings, not a second status enum. Direct observation includes lawful first-party observations but does not imply general prevalence. External or calculated claims without inspectable provenance remain `Unknown`, `Assumption`, or `Proposal` as applicable.

## Canonical source and claim fields

For each source, use the existing source ledger and preserve its permanent ID, exact locator, publisher/authority, title/version, publication/update and retrieval dates, evidence tier/type, method/coverage/sample, unit/population/geography/period, safe exact excerpt, limitations, applicability, conflicts/dependencies, review trigger, and reviewer. Search snippets, inaccessible citations, and repeated pages backed by the same underlying dataset are discovery leads, not independent accepted sources.

A consequential claim uses an existing applicable permanent identifier and records:

- one atomic statement and canonical status;
- separate evidence kind;
- supporting and refuting source/claim IDs;
- scope, date/period, method, and formula lineage when calculated;
- dependencies and counterevidence;
- confidence with reason, limitation, and applicability;
- decision impact and practical implication;
- next discriminating evidence, accountable owner, and review/expiry trigger.

Do not introduce another claim-ID family. For project-context claims, reuse the canonical `CTX-*` records. Keep existing accepted IDs unchanged.

## Conflicts and acceptance

Preserve conflicting values and definitions. Before recommending, reconcile or explicitly distinguish unit, boundary, population, period, geography, currency and conversion date, coverage, and method. Never average incompatible values or select the convenient one. If reconciliation is impossible, retain both, lower confidence, state the decision impact, and assign the next evidence or human decision.

A claim is acceptable only when its status and evidence kind match, required provenance resolves, its statement does not exceed the observed/source/calculation scope, conflicts are visible, limitations are decision-safe, and its owner accepts the applicable decision. Structural validity does not establish source credibility, entailment, semantic completeness, privacy safety, or truth; those remain human review responsibilities.

## First-party and customer boundary

A direct interview, observation, transaction, support record, or telemetry event can establish what happened in its recorded context. Qualitative evidence can establish that a workflow or problem exists, not its population prevalence. Telemetry can establish measured frequency, not unrecorded motivation or causality. Synthetic personas, generated interviews, reconstructed quotations, and imagined analytics are not first-party evidence. Store only approved safe excerpts or locators—never credentials, personal/customer/payment data, authentication material, or confidential raw content.

## Acceptance, completion, TEST, and EVID

These are separate and must not be collapsed:

- **Acceptance** defines observable conditions under which an accepted requirement would be satisfied. It is prospective.
- **Task `Done when`** defines the runnable completion check for implementation work and has exactly one primary requirement. Writing the text does not complete the task.
- **`TEST-*`** identifies the procedure, target, environment, and expected behavior used to evaluate a bounded claim. A test definition is not a result.
- **`EVID-*`** is fresh observed output from executing the linked test or runtime check against the named target/environment. It proves only that bounded claim at that time.

Research does not require accepted requirements, `TEST-*`, or runtime `EVID-*`. Planning must not claim passing proof. A build, lint, diagram, plan, generated file, unchecked checklist, agent agreement, or task-completion sentence is not runtime `EVID-*`.

## Safe and invalid examples

**Safe external claim:** `Evidence` + `external-publication`, linked to one canonical source record with an inspectable official table, exact rows, publication/retrieval dates, population, geography, period, method, excerpt, and limitations. The claim repeats only what those rows support.

**Invalid source laundering:** a search summary cites a consultancy page that cites an unnamed report, and the claim records the summary as if it were the original dataset. Repetition by several pages does not repair the missing method or locator. Keep it as a lead and mark the material claim `Unknown` or `Assumption` until the underlying source is inspectable.

**Safe demand claim:** observed interviews show that the sampled participants used a named workaround in a stated context. The claim is bounded to that sample and does not assert prevalence or willingness to pay.

**Invalid synthetic demand:** generated personas, simulated interviews, several agents agreeing, or public attention proxies are labelled “validated customer demand.” These can generate an `Assumption` or `Proposal`; they cannot become customer evidence, commitment, payment, or retention.

**Safe runtime proof:** a named `TEST-*` is executed on the declared revision and environment; fresh output is stored at a safe locator as `EVID-*`, linked to the exact requirement and result.

**Invalid fake proof:** a plan says “tests pass,” a task says “Done when tests pass,” an unchecked checklist marks the feature complete, or a generated mock output is assigned an `EVID-*` ID. None is an executed observation; planning must leave runtime proof absent rather than fabricate it.

See [Market Intelligence](market-intelligence.md), [Product and UX Handoff](product-handoff.md), and [Adaptive Artifact Routing](artifact-routing.md), or return to the [Product Intelligence skill](../SKILL.md).