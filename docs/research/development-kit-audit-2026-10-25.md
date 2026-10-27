# Development-Kit Completeness Audit — 2026-10-25

TASK-137, run `RUN-20261024T175250Z-7593b11a`. Compares the development kit with a
generic professional engineering kit (ten domains, ~30 per-repo files, persona
agents) and with open-source AI-coding kits and community evidence. Sources were
read only; no upstream installer, hook, or agent was executed.

## Verdict

No skill-level gap was found in the compared domains. The real gaps were in the
standalone (non-suite) repository templates: no home for a threat model, a test
strategy, a definition of done, a runbook, or quality/performance targets. Those
existed only in the 17-document suite or inside skill bodies. Routing had a
measured trigger gap for skill-system and onboarding requests.

## Evidence classes

### Primary standards (verified live 2026-10-25)

| Concern | Source | Adopted minimum |
|---|---|---|
| Threat model | [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/); [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [ASVS 5.0](https://asvs.owasp.org/) | Boundary/component, STRIDE threat, response (mitigate/eliminate/transfer/accept), enforcing file and test; ASVS L1 baseline, L2 with auth/payments/personal data |
| Test strategy | [Software Engineering at Google ch. 11](https://abseil.io/resources/swe-book/html/ch11.html); [Fowler, Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html); [Dodds, Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) | Layer → command → real versus substituted dependencies; real DB/HTTP where code serializes; no fixed coverage quota |
| Runbook | [SRE Workbook, On-Call](https://sre.google/workbook/on-call/); [SRE Book, Postmortem Culture](https://sre.google/sre-book/postmortem-culture/); [Fowler, ParallelChange](https://martinfowler.com/bliki/ParallelChange.html) | One entry per alert/probe: symptom, check, mitigation, rollback with migration phase, escalation; blameless note after downtime, data loss, or manual rollback |
| Performance | [web.dev Web Vitals](https://web.dev/articles/vitals); [SRE SLO chapter](https://sre.google/sre-book/service-level-objectives/) | p75 field LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1; backend targets as percentiles, value chosen per project |
| Definition of done | [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html) | Applies to every increment, distinct from per-item acceptance criteria |

### Open-source kits (pinned where read through `gh api`)

spec-kit `67e0f72`, BMAD-METHOD `61e01f8`, superpowers `2ce8aa1`, ECC `90606c8`,
claude-code `318b7e6`, claude-code-security-review `0c6a49f`, Taskmaster `c0c98d3`,
codex `970111f`, aider `5dc9490`; AGENTS.md standard, Kiro, and Cline docs pages.

- Adopted: BMAD's opt-in NFR clusters ("bounds, not adjectives") → `PRD.md`
  "Quality attributes"; Taskmaster's per-task test strategy and Kiro's
  "unchanged behavior" already match `TASKS.md` Regression Checks; BMAD's cut test
  ("would removing it change agent behavior?") supports keeping new sections
  conditional.
- Not adopted: persona agent directories (BMAD, ECC), a fixed 80% coverage floor
  (ECC), always-loaded per-domain steering files (Kiro), review-all-files memory
  updates (Cline), and a standalone `RUNBOOK.md`.

### Measurements and vendor guidance

- Gloaguen et al., [arXiv 2602.11988](https://arxiv.org/abs/2602.11988) (2026):
  context files did not generally improve task success and raised inference
  cost by over 20% on average. Supports adding conditional sections, not files,
  and keeping AGENTS.md additions short.
- Vercel, [AGENTS.md outperforms skills](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
  (2026-01-27): a skill was never invoked in 56% of their cases. Vendor
  measurement on one framework.
- Claude Code [skills documentation](https://code.claude.com/docs/en/skills),
  read 2026-10-25: the listing budget is 1% of the context window; on overflow,
  descriptions of the least-invoked skills are dropped; `skillOverrides`
  `"name-only"`, `skillListingBudgetFraction`, and `/skill-doctor` control it;
  description plus `when_to_use` is capped at 1,536 characters.
- Persona prompting: [arXiv 2512.05858](https://arxiv.org/abs/2512.05858) found no
  consistent accuracy gain (question answering, not agentic coding).
- Anthropic, [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents):
  start from real failures, include should-not-trigger cases, use pass^k.

Community limitation: Reddit, X, Hacker News threads, and YouTube transcripts were
not reachable from the research session; practitioner evidence is limited to
blogs (for example Böckeler's [spec-driven tools review](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)),
and anecdotes are not used as decision grounds.

## Changes

- Templates: `PRD.md` Quality attributes; `ARCHITECTURE.md` Threats and controls;
  `AGENTS.md` Test strategy and Definition of done; `OBSERVABILITY.md` Runbook;
  `RELEASE.md` points rollback commands at the runbook.
- Skills: `development-kit` description front-loads skill-system improvement,
  CLI onboarding, upstream adoption, and research-only workflow questions;
  `full-stack-development` covers cross-layer bug repair and requires both
  authorization and persistence checks across a boundary; `application-security`,
  `testing-engineering`, and `prd-taskbreaker` name the new canonical sections;
  `development-kit/references/reference-map.md` maps professional-kit concerns
  to existing homes.

## Decision trials

`ai-workflow-eval` decision-only trials, 20 synthetic cases. Each row is one
observed trial, not a reliability rate. PASS still means `behaviorResult:
UNVERIFIED` and semantic review required.

| Instruction revision | Runtime | Result |
|---|---|---|
| `bf50926a` (baseline) | Claude Code subagent, claude-opus-5-5 | 10/20 PASS |
| `bf50926a` (baseline) | Antigravity `agy` plan mode, sandboxed, model not exposed | 20/20 PASS |
| `bf50926a` (baseline) | Codex | Not run: account usage limit until 2026-10-31 |
| `8d3660f6` (templates, descriptions) | Claude Code subagent, claude-opus-5-5 | 13/20 PASS |

Semantic review of the baseline Claude failures: six owner or review-step
misses came from `development-kit` not being selected for skill-system,
onboarding, upstream-adoption, and research cases (description did not name
them). After the description change those cases selected `development-kit`. Persistent misses in both Claude trials: the tenant
and webhook repairs checked only one of authorization and persistence, which led
to the explicit both-sides rule in `full-stack-development`.

Final revision `938e4050` (all changes above):

| Runtime | Result |
|---|---|
| Antigravity `agy` plan mode, sandboxed, worktree unchanged | 20/20 PASS |
| Claude Code subagent A, claude-opus-5-5 | 11/20 PASS |
| Claude Code subagent B, claude-opus-5-5 | 10/20 PASS |

After independent-review fixes, revision `19bc86f8`: `agy` regression trial 20/20
PASS, worktree unchanged. Independent review (fresh Claude Code subagent):
FAIL with nine Markdown findings, all fixed, re-review PASS.

Interpretation, from transcripts and failure types:

- Owner-selection failures fell from four cases at baseline to zero in both
  final Claude trials. The description change is the only change those trials
  could observe: each Claude participant used three or four tool calls and
  opened no `SKILL.md` body, so it answered from the skill listing alone.
- For the same reason the body-level both-sides rule left the tenant and webhook
  misses unchanged. This is consistent with the vendor finding above: skill bodies do
  not influence a decision unless the skill is actually opened.
- Remaining Claude misses are generic steps (`preserve-scope`, `inspect-repo`,
  `independent-review`, `local-checks`). They measure participant diligence under
  a decision-only prompt more than guidance quality; `agy`, which read the
  guidance files, passed every case on both revisions it was graded on.
- Claude's aggregate did not improve: 10 at baseline, 13 at the intermediate
  revision `8d3660f6`, then 11 and 10 at the final revision. No improvement claim is
  made beyond the owner-selection change.

## Guidance-read labels (TASK-138)

`guidanceRead` makes the trial-method gap measurable. Claude Code subagent,
claude-opus-5-5, decision-only:

| Revision | Result | Failed with expected owner read | Failed with owner unread |
|---|---|---|---|
| `7adbeb12` (labels added) | 11/20 | 3 (all `development-kit`: independent review, scope) | 6 |
| `b08a52b0` (`development-kit` states review and scope for skill-system work) | 15/20 | 5 | 0 |

Both `development-kit` cases passed after the targeted wording. Remaining
read-labeled misses are single generic steps (`preserve-scope`, `local-checks`,
`trace-callers`, `check-persistence`); the persistence rule sits at byte 4726 of
`full-stack-development`, inside the 6,000 bytes the participant reported
reading, so more text is not expected to help. `guidanceRead` is self-reported.
One trial per revision; not a reliability rate.

## Open items

- Skill listing budget: 77 skills and about 37,000 description characters are
  likely above Claude Code's 1% listing budget. Mitigation is device-local
  (`skillOverrides` `"name-only"` for rarely used skills, or
  `skillListingBudgetFraction`) and belongs to the owner's settings decision, not
  this repository.
- `claude plugin validate ~/.claude/skills` (Claude Code 2.1.310) does not
  validate this layout: the symlinked directory is skipped and the real
  directory requires a plugin manifest. `skill-check` remains the frontmatter
  validator.
- Trial method: a decision-only participant that never opens guidance cannot
  test body-level rules. A future harness option could require the participant
  to report which guidance files it read, so non-reading trials are labeled
  instead of graded as guidance failures.
- Must-hold steps that matter in every repair belong where they are always seen
  (description, CORE, or a hook), not only in a skill body; CORE is at its byte
  budget, so this needs an owner decision.
- A Codex trial (usage limit until 2026-10-31) and more repeated trials remain.

## Runtime and evidence follow-up — 2026-10-26

Owner priorities are assessed as **Defect**, **Unverified**, or **Proposal**.
Existing behavior is **Verified** only within the stated probe. An untested
integration, a deferred trial, or a desired enhancement is not itself a bug.
`TASKS.md` remains the execution queue; this section records findings and
acceptance evidence, not another task state machine.

### Baseline and implemented slice (TASK-147)

Baseline: `db2d3e8`, clean working tree, local `main` equal to `origin/main`
after `git fetch origin`. Only this device was inspected. Device registry files
are historical inventory, not proof that another device has the same revision.

| Finding | Class and evidence | Change and completion criterion |
|---|---|---|
| Missing Git guard allowed shell operations | **Defect reproduced**: the manifest launcher returned exit 0 and no decision with an isolated HOME and a missing guard. Only JSON payloads were passed; no Git push ran. | Launcher emits a deny decision for a missing/non-executable guard, failed interpreter startup, or runtime failure; partial failed output is discarded. Installer migrates the known unsafe command without replacing custom timeouts; `--check` fails without writing until migrated. Both Claude and Codex variants are exercised. |
| Executed and manual PASS looked equivalent at the CLI | **Verified existing capability, incomplete presentation**: events already stored `executed` metadata; `--command` already derived status from exit code. | Events and CLI label `executed` versus `declared`. An observation cannot satisfy a required executable check. This is stronger classification, not a claim that command execution was absent before. |
| One fresh PASS could mask stale mandatory evidence | **Verified limitation**: `finish` required only one matching digest, and there was no mandatory-check declaration. | New runs may bind repeated `--require-check NAME`. Every named check must have a latest executed PASS matching the final surface, including newly added dirty files. Missing, manual, stale, and red-to-green cases are covered. Existing runs without this declaration retain legacy behavior; automatic inference from task prose is not implemented. |
| Missing cost became zero | **Defect reproduced**: omitting `--cost-usd` persisted `costUsd: 0.0`. | Schema v2 stores omitted cost as null. Reports expose cost coverage and known subtotal; incomplete totals and cost-per-success remain null. Explicit measured zero is valid. Legacy schema-v1 zero costs are treated as uncertain because their origin cannot be recovered. No historical metrics are rewritten. |
| Everyday Indonesian continuation found no execution truth | **Reproduced routing gap**: `lanjut yang tadi` returned no files although STATUS/TASKS existed. | Add bounded continuation terms and observed typo `lanjt`, with token boundaries. Positive and negative Indonesian/English cases exercise routing without adding a retrieval service. |

The existing suites passed before adding the new cases. The four expanded suites
failed before their implementation changes; the updated suites then passed.
They exercise local shell/filesystem and disposable Git repositories, not native
CLI hook trust or remote services. Final execution and independent-review
evidence belongs to delivery run `RUN-20261026T150445Z-aece36f1`.

### Activation evidence by runtime

| Runtime | Verified on this device | Still unverified or outside its capability |
|---|---|---|
| Codex | Instruction symlink resolves to generated `context/codex.md`; `ai-memory-link --check` passes. `codex debug prompt-input` renders the Codex adapter and all 77 owned skill names. Direct execution of the installed hook command allows a harmless status payload and denies a mirror-push payload. | Rendering proves discovery, not skill invocation. Direct hook execution does not prove trust or a native PreToolUse event. Changed definitions require interactive `/hooks` trust. TASK-140's model decision trial remains deferred until 2026-10-31. |
| Claude Code | Instruction symlink resolves to generated `context/claude.md`; all 77 owned skills are visible through the configured filesystem path. | Native discovery/listing budget and actual hook dispatch were not exercised. The previous audit's listing-budget concern is not a measured failure in this session. |
| Antigravity | Instruction symlink resolves to generated `context/antigravity.md`; all 77 owned skills are visible through its filesystem adapter. | Native discovery is unverified. No dotfiles hooks are wired; Git restrictions depend on agent behavior. |
| Pi | All 77 owned skills are visible on disk. Tracked shell wrapper appends generated `context/pi.md`. | The wrapper's presence does not establish which shell function another terminal loaded. Native discovery and actual context consumption are unverified. No dotfiles hooks are wired. |
| OMP | Instruction symlink resolves to generated `context/omp.md`; all 77 owned skills are visible on disk. `omp config path` and `omp config get modelRoles --json` identify its device-owned effective configuration; roles differ from the tracked reference. | Native skill discovery, provider availability, and actual role completions are unverified. The reference loads only when explicitly selected. No dotfiles hooks or equivalent backstop are claimed. |

### Remaining owner priorities and evidence needed

These findings retain the owner's P1/P2/P3 priorities. A **Proposal** is a
candidate improvement, not an accepted implementation contract. Select a bounded
target and its risk before implementation; keep existing deferred tasks and
their acceptance conditions intact.

| Area | Classification and remaining acceptance evidence |
|---|---|
| Other devices (P1) | **Unverified**. Read each device's actual HEAD, dirty state, generated context targets, runtime discovery, and safe native hook probe. Registered hardware or GitHub state cannot stand in for terminal evidence. No remote-device access was attempted. |
| Hook trust/dispatch (P1), capability reporting (P2) | **Unverified activation**, partly reported above. Prove a harmless native invocation and an inert denied payload in each hooked runtime. Keep wiring, direct command execution, trust, and dispatch as separate observations. Antigravity/Pi/OMP must not inherit a claim of hook protection. |
| OMP routing (P2) | Effective config lookup is **Verified locally**. Provider authentication and successful role execution remain **Unverified**; no paid completion or credential inspection was performed. Preserve TASK-091's device-specific scope. |
| Memory selection/Indonesian prompts (P1) | Bounded continuation cases are covered by TASK-147. Broader conversational terms, additional typos, relevant versus irrelevant memory, and cross-project isolation are **evaluation work**, not an assertion of global accuracy. Use synthetic project A/B fixtures and positive/negative cases before adding triggers. |
| Memory budgets/hygiene/reconciliation (P2) | Whole-file budget selection and explicit UNROUTABLE reporting already exist. Guaranteeing a useful excerpt or splitting an oversized canonical file is a **Proposal**. Run existing hygiene and compare individual stale claims against the owning repo; do not load or rewrite all memories as an audit shortcut. |
| Retrieval utility (P3) | **Unverified**. Path/byte telemetry proves selection frequency, not benefit. Evaluate relevant context, false selections, human corrections, and final outcomes on repeated comparable tasks. No vector database is justified by the current failures. |
| Skill access/routing/listing budget (P1) | Codex discovery is verified above; automatic correct use remains **Unverified**. Preserve actual read traces when available, expected owner selection for adjacent skills, and runtime-specific listing/budget evidence. Self-reported `guidanceRead` remains self-reported. |
| Skill contracts/negative cases/real execution/failure attribution (P2) | **Proposals for stronger evaluation**. Separate failure to discover, failure to open, inadequate guidance, and faulty execution. Test small tasks that should not trigger a full workflow; then evaluate actual generated code and flows. Extend the existing harness/owner rather than requiring all 77 bodies. |
| Skill consolidation (P3) | **Deferred owner decision**, TASK-142. Do not merge/delete based on count alone; reopen only on its documented budget condition. |
| UX complete flow (P1/P2) | **Existing methodology plus proposed execution trial**. Requires a named product and accepted actors/jobs, role permissions, information structure, end-to-end persistence/handoff, reuse of available input, full states, validation/recovery, realistic data, risky-action recovery, history when needed, useful search/bulk actions, accessibility, and target devices. A clinic example is not authorization to modify an unspecified clinic repository. |
| UI direction/render/rework (P1/P2/P3) | **Existing methodology plus proposed execution trial**. Record accepted typography, colors, density, references with reasons, screen hierarchy, tokens/components, and concrete rejection criteria in the existing project design artifact. Review actual render, fix significant findings, and recheck typography/copy/responsive behavior/assets. Motion needs a user benefit. Gradients/cards are not prohibited categories. |
| Functional versus visual acceptance (P1) | Separate typed executable gates are available; **criteria and real project evidence remain required**. A screenshot or browser opening cannot stand in for functional acceptance or a visual critique. No browser-visible product was changed in TASK-147. |
| Real integrations/reviewer provenance (P2) | **Unverified per target**. Exercise auth, persistence, and relevant service boundaries in an authorized non-production environment. Bind reviewer provenance to the actual reviewed surface; distinct names alone do not prove independent review. TASK-147 requires a separate actual reviewer. |
| CI reconciliation/macOS/mutation gaps (P2/P3) | **Existing pending verification**, TASK-096/TASK-089, TASK-143, TASK-097. This session did not fetch hosted CI or reproduce macOS. Do not close any of these from Linux fixtures or from a later unrelated green run. |
| Comparable model cohorts (P2) | **Verified limitation/proposed fix**: aggregation groups by job/capability, but recommendations compare across all groups with the same risk. Filter comparable job/capability cohorts before making model-choice claims. Unknown-cost handling alone does not fix comparability. |
| Human correction/rework/time to acceptance (P2) | Metric fields already exist for corrections, repairs, and duration; **measurement semantics and outcome utility are unverified**. Include correction and validation time; do not use first-response latency as completion time. |
| Release scope (P2) | **Verified limitation/proposed change**: `production-gate.tasks_gate` rejects any Pending or In progress task. Define release task IDs and dependency closure before changing it, so future backlog does not block a ready release and selected unfinished work still does. |
| Active integrations (P2) | **Unverified**. A manifest or installed MCP entry does not prove an active connection. Check only the integrations needed by the selected task, without dumping credentials or sessions. |
| Repeated outcome evaluations (P3) | **Proposal**. Run several comparable tasks and repeated trials with discovery/read/behavior labels; one successful trial is evidence for that trial, not a reliability estimate. |

Next execution order remains: activation evidence and safeguards; required-check
integrity; one complete admin experience contract through implementation and
render critique; one real cross-role flow; then measured retrieval, listing
budget, cost, and model comparison. No unrelated product scaffold or new
orchestrator is required to perform this evaluation.

### Independent review and local reconciliation

Separate reviewer `/root/review_runtime_evidence` returned APPROVE after finding
and rechecking the guard startup/runtime-failure case. The reviewer independently
ran all four focused suites and `git diff --check`; each passed. Provider:
OpenAI; exact model ID and reasoning setting were not exposed. Identity strings
alone are not the independence evidence: a separate agent actually inspected and
probed the implementation in this session.

The known unsafe launcher was reconciled into the local Codex and Claude hook
files after review. This changes the exact Codex hook definition; interactive
trust and native dispatch remain unverified. A subsequent `--check` can prove
safe known wiring, not trust. Repository changes remain uncommitted and unpushed.

## Parallel revalidation — 2026-10-26

The owner requested a fresh validation, semantic map review, and skill overkill
review in parallel. The original 12 executed checks still matched their recorded
surface, and six regression suites passed again. Separate agents nevertheless
found cases outside those suites. Audit run `RUN-20261026T154457Z-f8b80a09`
finished **FAIL** rather than treating structural success as semantic acceptance.
TASK-147 was reopened under `RUN-20261026T154909Z-c335be63`.

### Reproduced code issues and bounded repairs

| Class | Reproduction | Repair and regression boundary |
|---|---|---|
| Inherited freshness defect (P1) | A genuine behavior test passed against old generated code, then a generator changed that code within the same zero-exit command. Recording only the final digest certified source that failed the next real behavior test. | Record pre/post source fingerprints. Net source/path/HEAD changes produce executed UNVERIFIED even with exit 0; a stable successful rerun is needed. Cases cover generated clean files, new paths, already-dirty content, staging without content change, and ignored outputs. This does not monitor transient edits restored before return or prove that an arbitrary command tests the right behavior. |
| Incomplete known-launcher migration (P2) | A safe first hook group hid a later exact unsafe launcher; `--check` incorrectly returned success. | Inspect/migrate every exact known legacy command within the event, retaining matchers and timeouts. Fixtures exercise both Claude and Codex without executing any Git payload. |
| New irrelevant context selection (P2) | Standalone Indonesian next/continue words selected STATUS/TASKS for arithmetic, fiction, and cooking. Identical baseline fixtures selected none. | Use bounded continuation phrases/work context instead of standalone berikutnya/lanjutkan. Add those negative cases while preserving observed continuation/typo positives. This is a bounded keyword-router repair, not general semantic understanding. |

### System map semantic corrections

The source-backed review found eight groups of inaccurate descriptions:
Claude-only hook claims; unconditional Git blocking/parser claims; dev-ready's
provider/non-overlap/timing guarantees; OMP versus opt-in Pi bootstrap;
shared-memory decision authority; hygiene versus routing/secret-check ownership;
exact session restoration; and byte budgets/selector purpose. The map now
describes those boundaries. The telemetry note also distinguishes routing
selection from actual model use.

Coverage and retrieval checks remain separate evidence: `system-map --check`
covered 517 tracked members; the existing query fixture returned 65/72 first
and 72/72 within the first three results before these prose corrections. Final
checks must re-evaluate the changed map. The semantic review sampled high-impact
claims across runtime, memory, bootstrap, and evidence; it is not source-by-source
certification of all 517 entries.

### Skill overkill review: proposals, no skill edits

Metadata checks covered 77 skills: 37,205 description characters, 950,258 bytes
across the main SKILL.md bodies, and no main body over 500 lines. These source
sizes do not prove a runtime budget breach: bodies load on demand. Semantic
review covered 11 core skills and relevant references. The existing skill map
already groups owners and sibling routes; a new discovery mechanism is not
justified by this evidence.

| Candidate | Smallest proposed change; invariant to retain |
|---|---|
| Universal no-JavaScript form rule in `full-stack-development` | Preserve the accepted submission architecture; prefer native forms/actions where supported. Keep server validation, recovery, and persisted-outcome proof. An existing SPA does not automatically need a second submission path. |
| Geometry gate on every changed admin route | Reserve the full geometry pass for new/redesigned routes or dimension/typography/token/component/responsive changes. A label-only fix still needs affected-route browser inspection; escalate if wrapping/layout changes. |
| Unconditional command palette in the role-navigation reference | Add one only for a demonstrated frequent navigation/action need; reuse an existing palette. Keep server authorization and role-aware navigation. |
| TanStack API recipes repeated in the visual owner | Keep the presentation decision and route version-specific code to the installed-version implementation owner. Avoid maintaining the same recipe in multiple skills. |

One wording concern remains a proposal: `prd-taskbreaker`'s one-task-per-request
phrasing can conflict with authorized multi-task delivery. Prefer dependency-led
bounded runs; commits still require user authorization. No model behavior,
invocation frequency, token/time savings, or causal improvement was measured.
Separate UX, presentation, implementation, and browser evidence owners remain
useful; the collection as a whole is not shown to be overkill. TASK-142's
consolidation deferral remains intact. The owner explicitly requested discussion
before any new skill sitemap/discovery mechanism; no skill or registry was edited.

The independent source reviewer approved the scoped repairs after rerunning the
three affected suites, duplicate-group migration, and irrelevant-context probes.
The map reviewer approved the eight correction groups; the skill reviewer
confirmed the report's qualifications. These are separate actual review agents,
not renamed self-review. Final executable results and the approved surface are
bound by the reopened TASK-147 delivery run.
