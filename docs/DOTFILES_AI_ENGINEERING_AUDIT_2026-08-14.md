# Dotfiles AI Engineering System — Comprehensive Audit & Improvement Roadmap

> [!CAUTION]
> **Immutable historical baseline; superseded for current-state decisions.**
> Preserve the body as evidence of the 2026-08-14 audit. It does not own live
> work or runtime state. Use [`../TASKS.md`](../TASKS.md) for task state, current
> disk and executable checks for behavior, and `config/omp/config.yml` plus
> `config/omp/STATUS.md` for current routing.

**Repository:** `ongkipro/dotfiles`  
**Audit date:** 2026-08-14  
**Scope:** Terminal-first AI development, OMP orchestration, full-stack/backend/frontend/admin dashboard development, architecture, long-running tasks, cheap-model utilization, reliability, verification, context economics, and model escalation.

---

## 1. Executive Summary

The current dotfiles repository has evolved well beyond a conventional shell configuration repository. It is already an **AI-native development operating system** with:

- OMP as the primary orchestration and context owner.
- Shared cross-runtime policy via `config/ai/AGENTS.md`.
- Shared memory and project-reference memory.
- Canonical reusable skills under `skills/local/`.
- Repository-local project state via `AGENTS.md`, `PRD.md`, `TASKS.md`, `STATUS.md`, `BUILD-LOG.md`, and `docs/architecture.md`.
- Deterministic model-role routing.
- Three capacity pools: volume, precision, and judgment.
- Cross-provider fallback chains.
- Explicit agent-to-model overrides.
- Context compaction and context-window invariants.
- Tool approval and Git safety policies.
- Multi-agent concurrency and task isolation.
- Real usage telemetry and model benchmarking.

The system is already structurally strong. The next major improvement should **not** be adding more generic agents or simply replacing models with newer frontier models.

The next evolution should be:

> **Move intelligence from expensive models into deterministic engineering infrastructure.**

The target is a system where inexpensive models perform most bounded implementation work, while expensive models are reserved for ambiguity, architecture, security, difficult debugging, and high-cost-to-reverse decisions.

A realistic target architecture is:

- **60–75%** of development tokens: cheap/fast worker models.
- **20–30%**: strong coding models.
- **5–10%**: frontier judgment/review models.

This does **not** mean cheap models become equivalent to Opus or GPT-5.6 Sol. It means the system removes enough ambiguity, planning burden, context burden, and verification burden that the cheap model only needs to execute a bounded contract.

---

# 2. Current System — What Is Already Strong

## 2.1 OMP is correctly positioned as the control plane

The current architecture establishes OMP as the primary development control plane rather than treating every provider CLI as an independent orchestrator.

OMP owns:

- session context,
- tool runtime,
- specialist dispatch,
- model routing,
- task isolation,
- integration,
- final verification ownership.

Standalone Claude, Codex, Antigravity, and Pi remain provider-specific handoff targets rather than competing context owners.

### Assessment

**Status: Strong / keep.**

This prevents duplicated orchestration logic and avoids the common failure mode where several agents each believe they own the entire project.

---

## 2.2 Shared AI policy is centralized correctly

Canonical policy lives at:

```text
config/ai/AGENTS.md
```

Adapters expose the same policy to supported runtimes such as Claude, Codex, Antigravity compatibility paths, Pi, and OMP.

This is one of the strongest design decisions in the repository because behavioral rules are maintained once instead of drifting between provider-specific prompts.

### Existing strengths

The policy already defines:

- disk-over-memory authority,
- terminal-first conventions,
- implementation restraint,
- YAGNI/native-first behavior,
- verification requirements,
- approval gates,
- Git safety,
- project state ownership,
- specialist routing expectations.

### Assessment

**Status: Strong / keep.**

Do not fork these policies into individual skills or model-specific prompt copies.

---

## 2.3 Project truth is correctly stored on disk

The repository-local development contract is currently:

```text
PROJECT/
├── AGENTS.md
├── PRD.md
├── TASKS.md
├── STATUS.md
├── BUILD-LOG.md
└── docs/
    └── architecture.md
```

This is essential for long-running work.

The project repository owns:

- requirements,
- current status,
- implementation state,
- architecture,
- accepted decisions,
- build evidence.

Cross-session project memory is explicitly reference-only and is not allowed to override repository truth.

### Assessment

**Status: Strong foundation, but task/status schemas need expansion.**

This architecture is the right foundation for reliable cheap-model execution because state does not depend on conversation memory.

---

## 2.4 Skills are centralized instead of duplicated

Canonical owned capabilities live under:

```text
skills/local/<skill-name>/SKILL.md
```

The runtime adapters expose the same skills to supported environments.

Existing capability ownership already covers areas such as:

- development specification,
- PRD/task breaking,
- API specification,
- diagrams,
- admin dashboard UX,
- UI validation,
- shadcn/ui,
- storefront work,
- native-first implementation,
- lean code review,
- platform-specific engineering.

### Assessment

**Status: Strong / avoid agent proliferation.**

Do not create generic `backend-agent`, `frontend-agent`, `database-agent`, or `test-agent` definitions unless there is a real reusable methodology gap.

Skills should define **how work is done**. Routing should decide **which model executes it**.

---

# 3. Current Routing Architecture

## 3.1 Existing three-pool model

The current model roles are effectively grouped into three capacity pools.

### Volume pool — Antigravity

Current examples:

```text
default   → Gemini 3.6 Flash : medium
research  → Gemini 3.6 Flash : high
smol      → Gemini 3.1 Flash Lite : medium
tiny      → Gemini 3.1 Flash Lite : minimal
vision    → Gemini 3.1 Pro : high
designer  → Gemini 3.1 Pro : high
```

### Precision pool — Codex

```text
slow      → GPT-5.6 Sol : high
plan      → GPT-5.6 Sol : high
task      → GPT-5.6 Sol : high
```

### Judgment pool — Anthropic

```text
advisor        → Claude Sonnet 5 : high
advisor-xhigh  → Claude Opus 5 : xhigh
advisor-max    → Claude Opus 5 : max
```

### Assessment

**Status: Conceptually correct.**

The separation between volume, precision, and judgment is sound.

However, there is currently an important economic gap between `smol/default` and `task/slow`.

That missing layer is the largest routing opportunity.

---

# 4. Evidence Already Collected

The current routing is unusually well grounded because it was rebuilt using real usage rather than list prices alone.

The recorded baseline covered approximately:

```text
11,651 calls
~70 hours of usage
1,253 subagent calls
```

A major finding was:

```text
95.8% of tokens = cache_read / conversation history rereading
0.22% of tokens = output
```

Another important finding:

```text
Main session = 97.7% of tokens
Subagents    = only 4.3% of cost
```

This means the dominant optimization problem is **not output token price**.

It is:

> **context size × number of turns × repeated rereading**

This finding should drive future architecture decisions.

### Existing measured model behavior

Recorded tool-call error rates included approximately:

```text
GPT-5.6 Sol       5.2%
Gemini 3.6 Flash  7.8%
Codex Spark      10.2%
```

GPT-5.6 Sol also showed a leaner tool loop than the cheaper Spark lane.

### Important conclusion

A cheap token price does not automatically produce cheap completed engineering work.

The relevant metric is:

```text
cost per successfully completed task
```

not:

```text
cost per million tokens
```

---

# 5. What Has Already Been Fixed Well

The repository has already addressed several non-trivial orchestration defects.

## 5.1 Compaction was given real limits

Current configuration includes approximately:

```text
thresholdTokens:   140000
keepRecentTokens:   40000
idleThreshold:     100000
dropUseless: true
midTurnEnabled: true
autoContinue: true
```

This corrected the earlier behavior where a million-token model could accumulate roughly 390K context per call and reread it repeatedly.

### Assessment

**Good fix. Keep monitoring.**

---

## 5.2 Context-window safety invariant exists

Every reachable model must have a context window larger than the compaction threshold.

This already prevented routing to a smaller-window model that could overflow before compaction occurred.

### Assessment

**Strong invariant. Preserve in automated tests.**

---

## 5.3 Fallback chains change provider early

Fallback chains are designed to switch provider on the first recovery hop instead of retrying inside a potentially exhausted pool.

9Router was removed from automatic recovery because a tunnelled transport is a poor dependency during another failure condition.

### Assessment

**Correct. Keep.**

---

## 5.4 Discovery was separated from mechanical work

`scout` and `sonic` were previously both cheap/mechanical lanes.

They are now separated because a bad repository map can poison all downstream reasoning, whereas mechanical data collection has a much lower consequence of semantic error.

Current idea:

```text
scout → research-quality model
sonic → cheap mechanical model
```

### Assessment

**Correct and important.**

This is a good example of routing based on downstream risk rather than token cost.

---

## 5.5 Explicit agent overrides are enforced

Current specialist agents have explicit model-role overrides instead of silently inheriting `default`.

### Assessment

**Strong. Preserve.**

Silent model resolution is dangerous in a multi-provider system.

---

# 6. Main Weaknesses / Missing Pieces

The following gaps are the primary opportunities identified in this audit.

---

# P0 — 1. Missing Cheap Development Execution Lane

## Problem

Current routing jumps too quickly from:

```text
Gemini Flash / Flash Lite
```

to:

```text
GPT-5.6 Sol
```

for delegated implementation.

The current `task` lane uses the precision model because wide or incorrect edits can cause expensive rework.

That decision is defensible, but it leaves a major cost-efficiency opportunity unused.

Many implementation tasks do not require frontier-level coding intelligence when:

- architecture has already been decided,
- requirements are explicit,
- existing repository patterns can be copied,
- acceptance criteria are deterministic,
- verification exists,
- the change is easily reversible.

Examples:

```text
CRUD endpoint
admin table
form wiring
DTO changes
schema validation
simple API integration
unit-test generation
fixture generation
bounded refactor
TypeScript errors
lint fixes
existing component pattern implementation
```

## Recommendation

Add a separate execution class conceptually named:

```text
cheap-dev
```

or:

```text
worker
```

The exact name is less important than the contract.

### Eligibility rules

A task MAY run on `cheap-dev` when all relevant conditions hold:

```text
- requirement is explicit
- architecture is already decided
- existing repository pattern exists
- expected diff is bounded
- change is reversible
- acceptance checks exist
- no security-sensitive logic
- no payment-critical logic
- no destructive migration
- no unclear cross-package architecture
```

Suggested initial bound:

```text
expected files touched <= 3–5
```

This should later be tuned from telemetry rather than treated as permanent doctrine.

### Escalation rule

```text
cheap-dev
   ↓
reasonable implementation attempt
   ↓
verification
   ↓
PASS → complete
FAIL → one bounded repair attempt
   ↓
still failing
   ↓
strong coding lane
```

Do not let cheap models thrash indefinitely to avoid escalation.

---

# P0 — 2. Task Contracts Are Too Minimal for Cheap Agents

## Problem

The current `TASKS.md` template mainly provides:

```text
In progress
Pending
Done
```

with the requirement that implementation tasks trace to accepted requirements and have runnable completion checks.

This is acceptable for frontier models, but insufficiently deterministic for aggressive cheap-model usage.

Cheap agents perform best when ambiguity is removed before execution.

## Recommendation

Expand the task schema.

### Proposed task format

```markdown
## TASK-014 — Add customer status filter

Requirement:
REQ-08

Risk:
R1

Execution class:
cheap-dev

Scope:
- admin customer list
- query parameter handling
- backend filter

Expected files:
- app/admin/customers/page.tsx
- api/customers/route.ts
- lib/customer-query.ts

Do not change:
- authentication
- database schema
- shared design system

Acceptance criteria:
- supports active/inactive filtering
- URL state persists
- existing pagination remains functional

Verification:
- npm test -- customer-query
- npm run typecheck
- npm run lint

Escalate when:
- API contract must change
- more than 5 files are required
- database schema change is discovered
- existing architecture conflicts with the requested behavior
```

### Why this matters

The system should make the cheap model answer:

```text
"Can I execute this contract?"
```

instead of:

```text
"What should the system design be?"
```

---

# P0 — 3. Verification Is Policy-Driven but Not Mechanical Enough

## Problem

`AGENTS.md` already states that agents must not claim success without running validation.

That is good policy, but cheap models are less reliable at choosing the correct validation sequence consistently.

Reliability should be enforced increasingly through deterministic tooling rather than prompt obedience.

## Recommendation

Add a canonical command such as:

```bash
project-check
```

Possible modes:

```bash
project-check --changed
project-check --full
project-check --ui
project-check --security
```

### Responsibilities

The command SHOULD discover project-native checks first.

For Node/TypeScript projects, for example, it might inspect `package.json` and select existing scripts rather than inventing commands.

Candidate sequence:

```text
format/check
lint
typecheck
unit tests
integration tests where available
build
browser/UI checks when required
```

### Required principle

Do not hard-code one universal stack workflow.

The tool should prefer repository-native commands and only use safe fallbacks when native commands are absent.

### Target lifecycle

```text
implement
   ↓
project-check --changed
   ↓
PASS
   ↓
diff-risk
   ↓
completion
```

---

# P1 — 4. Routing Needs an Explicit Risk Dimension

## Problem

Current routing is largely classification-based:

```text
normal development
complex implementation
visual work
architecture
review
security
research
```

This is useful, but complexity and risk are not the same.

A change can be technically simple while being expensive or dangerous if wrong.

Example:

```text
change one Stripe webhook status mapping
```

The diff may be four lines, but the business risk can be high.

## Recommendation

Introduce a lightweight risk classification.

### Proposed levels

```text
R0 — Mechanical
R1 — Bounded reversible
R2 — Cross-module / moderate impact
R3 — High-impact / correctness-sensitive
R4 — Costly-to-reverse / architecture / security / production critical
```

### Suggested routing

| Risk | Typical work | Minimum execution tier |
|---|---|---|
| R0 | rename, fixture, formatting, generated updates | cheap |
| R1 | CRUD, form, simple endpoint, bounded bug | cheap |
| R2 | multi-module feature, medium refactor | default/strong depending evidence |
| R3 | auth, payments, migration, concurrency | strong coding model |
| R4 | architecture, security boundaries, irreversible decisions | frontier judgment model |

### Important rule

**Risk should override apparent task simplicity.**

---

# P1 — 5. Long Tasks Need a More Formal Checkpoint Protocol

## Problem

The repository already stores durable state in `STATUS.md`, `TASKS.md`, and `BUILD-LOG.md`.

However, long autonomous development would benefit from a defined state machine and checkpoint cadence.

The purpose is not bureaucracy. It is context recovery.

If a session compacts, crashes, switches provider, or resumes tomorrow, the next worker should reconstruct current state from disk rather than rereading a huge conversation.

## Recommendation

Add task state semantics:

```text
planned
ready
implementing
verifying
blocked
done
```

### Checkpoint on meaningful boundaries

Examples:

```text
database completed
API contract completed
backend implementation completed
frontend completed
verification completed
```

Do NOT update durable state after every tiny tool action.

### Resume contract

A resumed worker should read in approximately this order:

```text
AGENTS.md
PRD.md / relevant requirement
TASKS.md
STATUS.md
BUILD-LOG.md recent entries
docs/architecture.md relevant section
git status
git diff
```

Then continue from the next verified action.

---

# P1 — 6. Add a Diff-Risk Gate

## Problem

A bounded task may unexpectedly expand.

A cheap model may be assigned a three-file CRUD task and finish with:

```text
14 files touched
auth code modified
migration added
new dependency added
lockfile changed
```

The task is no longer equivalent to the original risk profile.

## Recommendation

Create a deterministic helper conceptually named:

```bash
diff-risk
```

### Candidate signals

```text
number of files changed
unexpected directories touched
auth/security paths changed
migration files added
package manifest changed
lockfile changed
CI/deployment config changed
public API surface changed
schema changed
large deletion count
large generated diff
```

### Example output

```text
Risk: R3

Reasons:
- authentication module modified
- migration added
- expected 4 files, actual 11

Action:
strong reviewer required before completion
```

### Important principle

This should be mostly deterministic.

A model may explain the result, but the model should not be the only detector.

---

# P1 — 7. Build an Internal Development Benchmark Suite

## Problem

Public coding benchmarks are useful but do not accurately represent the exact workflow of this environment.

The repository already has the right philosophy: routing decisions have been driven by real usage evidence.

That should be extended into task-level model evaluation.

## Recommendation

Create a controlled benchmark suite based on actual recurring engineering work.

Possible structure:

```text
dev-bench/
├── crud-api/
├── react-form/
├── admin-table/
├── db-query/
├── bugfix/
├── refactor/
├── tests/
├── repo-discovery/
├── frontend-visual/
├── migration/
└── long-task/
```

### Metrics

Measure:

```text
pass/fail
first-pass success rate
wall-clock time
total token usage
cache-read tokens
estimated cost
tool calls
tool-call failures
number of retries
files touched
unnecessary files touched
test failures
human corrections
review findings
rollback rate
```

### Most important derived metric

```text
cost_per_successful_task
```

Secondary metrics:

```text
cost_per_first_pass_success
escalation_rate
human_correction_rate
regression_rate
```

### Why this matters

A model that is 5× cheaper per token but requires 3× more calls, larger context rereads, and frequent escalation may be more expensive in practice.

---

# P2 — 8. Context Budgeting Should Become Role-Aware

## Problem

The current global compaction settings already solve a major problem, but different worker classes do not require the same working context.

A cheap implementation worker should generally receive a compressed task packet rather than a giant session history.

## Recommendation

Explore role-specific working-context targets.

Conceptually:

```text
cheap worker     → 20–40K working context
normal main      → 60–100K
research         → 100–200K when justified
architect        → compressed evidence packet, not raw entire repo history
```

Exact values should be measured rather than hard-coded immediately.

### Principle

Large context should be treated as a capability to spend deliberately, not as free memory.

---

# P2 — 9. Architecture Calls Need Prepared Evidence Packets

## Problem

The current architecture route correctly uses expensive judgment models for costly-to-reverse decisions.

However, expensive architecture models should not spend most of their token budget discovering facts that cheaper specialists can collect reliably.

## Recommendation

Prepare an architecture evidence packet before frontier review.

### Suggested packet

```text
GOAL
CURRENT ARCHITECTURE
RELEVANT MODULES
CURRENT DATA FLOW
DEPENDENCY MAP
DATABASE / STORAGE IMPACT
FRAMEWORK CONSTRAINTS
KNOWN RISKS
REQUIREMENTS
ALTERNATIVES ALREADY CONSIDERED
OPEN DECISIONS
RELEVANT DIFF / HISTORY
```

### Pipeline

```text
scout
  ↓
repository map

librarian
  ↓
official framework/library constraints

cheap bounded workers
  ↓
dependency/schema summaries

        ↓
ARCHITECTURE PACKET
        ↓
Opus / frontier architect
        ↓
decision
```

The expensive model should spend tokens on judgment, not file enumeration.

---

# P2 — 10. Telemetry Should Close the Routing Feedback Loop

## Current strength

The system already records useful signals such as:

```text
model usage
cost per call
cost per million tokens
tool-call error rate
calls per turn
context consumption
```

## Missing signals

Add engineering-outcome metrics:

```text
first-pass success rate
verification pass rate
retry rate
escalation rate
human correction rate
review rejection rate
rollback rate
regression rate
diff size versus expected scope
time to successful completion
cost to successful completion
```

### Long-term goal

Routing should eventually be based on empirical profiles such as:

```text
cheap-model-X
CRUD first-pass: 91%
admin UI wiring: 87%
complex debugging: 42%
architecture: not eligible
```

instead of a generic belief that a model is "good at coding."

---

# 7. Areas That Should NOT Be Over-Engineered

## 7.1 Do not add generic agents for every discipline

Avoid unnecessary agent taxonomy such as:

```text
backend-agent
frontend-agent
react-agent
database-agent
test-agent
typescript-agent
```

unless each has a genuinely distinct methodology and routing need.

Prefer:

```text
clear task contract
+ capability skill
+ risk classification
+ correct execution tier
+ deterministic verification
```

---

## 7.2 Do not route purely by file extension

A `.tsx` file may contain:

- pure API wiring,
- visual UI work,
- authentication logic,
- state-machine logic.

The substance and risk of the change determine routing.

Keep the current principle.

---

## 7.3 Do not use cheap models for ambiguous discovery that feeds critical decisions

Cheap models are appropriate for mechanical collection.

They should not create an authoritative repository map when incorrect compression could mislead the entire downstream system.

The existing separation between `scout` and `sonic` is correct.

---

## 7.4 Do not optimize purely for token price

The internal evidence already shows why this fails.

Optimize:

```text
cost / successful task
```

not:

```text
cost / token
```

---

## 7.5 Do not let cheap workers endlessly self-repair

A cheap model that fails repeatedly becomes an expensive model with lower reliability.

Use bounded retry budgets.

Recommended default concept:

```text
attempt 1
verification
repair attempt 1
verification
still failing → escalate
```

Tune later from data.

---

# 8. Proposed Target Runtime Architecture

```text
                              USER
                                │
                                ▼
                              OMP
                     main session / context owner
                                │
                     classify work + risk
                                │
            ┌───────────────────┼────────────────────┐
            │                   │                    │
            ▼                   ▼                    ▼
         RESEARCH           IMPLEMENTATION         VISUAL
      scout/librarian           router             designer
            │                   │                    │
            │          ┌────────┼────────┐           │
            │          │        │        │           │
            │          ▼        ▼        ▼           │
            │       cheap-dev  strong   slow         │
            │       R0 / R1    R2/R3    hard         │
            │          │        │        │           │
            └──────────┴────────┴────────┴───────────┘
                                │
                                ▼
                         project-check
                                │
                         ┌──────┴──────┐
                         │             │
                       PASS           FAIL
                         │             │
                         │      bounded repair
                         │             │
                         │        still failing
                         │             │
                         │          escalate
                         │
                         ▼
                           diff-risk
                                │
                  ┌─────────────┼─────────────┐
                  │             │             │
                R0/R1          R2/R3          R4
                  │             │             │
                  ▼             ▼             ▼
                DONE        strong review   frontier
                                          advisor/architect
                                                │
                                                ▼
                                         final verification
                                                │
                                                ▼
                                               DONE
```

---

# 9. Proposed Model-Economics Strategy

The system should aim for **tiered intelligence spending**.

## Tier A — Cheap / volume workers

Target workload:

```text
60–75%
```

Good candidates include whichever inexpensive models win the internal benchmark for each task class.

Use for:

```text
CRUD
forms
admin tables
API wiring
DTO/schema updates
unit tests
fixtures
bounded transformations
simple bug fixes
mechanical refactors
lint/type fixes
documentation updates
```

Do not permanently hard-code one provider as the definition of cheap work. Benchmark and replace as evidence changes.

---

## Tier B — Strong coding engineers

Target workload:

```text
20–30%
```

Use for:

```text
cross-module implementation
complex refactor
authentication
payments
performance investigation
complex database work
non-trivial migrations
concurrency
hard regressions
cheap-worker escalation
```

Current GPT-5.6 Sol precision routing fits this tier well.

---

## Tier C — Frontier judgment

Target workload:

```text
5–10%
```

Use for:

```text
costly-to-reverse architecture
security review
high-risk design review
hard root-cause debugging
critical migration decisions
independent correctness review
```

Current Opus 5 advisor routing fits this role.

---

# 10. Full-Stack Task Suitability Matrix

| Work type | Cheap lane | Strong lane | Frontier review |
|---|---:|---:|---:|
| CRUD endpoint | Preferred | Escalation only | No |
| DTO / validation schema | Preferred | If cross-system | Rare |
| Admin table | Preferred | If complex state | No |
| Form implementation | Preferred | If complex domain logic | No |
| API client wiring | Preferred | If protocol complexity | Rare |
| Pagination/filter/search | Preferred | If performance-sensitive | Rare |
| Unit tests | Preferred | Complex test architecture | No |
| Fixture generation | Preferred | No | No |
| TypeScript fixes | Preferred | Difficult generic/type architecture | No |
| Mechanical refactor | Preferred | Wide/high-risk diff | Review depending diff |
| Database query | Preferred when bounded | Complex query/performance | Rare |
| Database migration | No by default | Preferred | High-impact review |
| Authentication | No by default | Preferred | Security review |
| Payments | No by default | Preferred | Review for critical flow |
| Concurrency | No | Preferred | If architectural |
| Security boundaries | No | Support only | Preferred |
| Architecture | Evidence collection only | Alternatives analysis | Preferred decision owner |
| Visual dashboard implementation | Wiring may be cheap | Strong if complex | Designer/vision owns visual judgment |
| Long task execution | Yes, decomposed | Escalation & integration | Judgment only |

---

# 11. Recommended File-Level Changes

The following is a recommended implementation map, not an instruction to modify the repository blindly.

## P0 candidate files

### `config/omp/ROUTING.md`

Add:

- cheap implementation eligibility,
- bounded retry policy,
- explicit risk override principles,
- escalation contract.

### `config/omp/config.yml`

After candidate-model benchmarking:

- add `cheap-dev` model role,
- map a bounded worker agent or execution path to it,
- add safe provider fallback,
- preserve context-window and reasoning invariants.

### `config/templates/TASKS.md`

Expand task schema with:

```text
requirement
risk
execution class
scope
expected files
do-not-change boundaries
acceptance criteria
verification
escalation conditions
```

### `config/templates/STATUS.md`

Add explicit lifecycle support:

```text
planned
ready
implementing
verifying
blocked
done
```

### `config/ai/AGENTS.md`

Keep additions short.

Only add universal rules such as:

- bounded retry before escalation,
- disk checkpoint requirements for long tasks,
- risk escalation rule.

Do not duplicate routing tables here.

---

## New helper candidates

### `bin/project-check`

Purpose:

```text
repository-native deterministic verification
```

### `bin/diff-risk`

Purpose:

```text
classify unexpected/high-risk diff expansion
```

### `bin/dev-bench`

Purpose:

```text
run controlled model/task benchmarks and emit comparable metrics
```

Possible supporting location:

```text
dev-bench/
```

or a dedicated testing/fixtures path if a cleaner repository convention already exists.

---

# 12. Recommended Implementation Order

## Phase 0 — Baseline before changing routing

**Goal:** preserve current measured performance so changes are comparable.

Actions:

1. Snapshot current routing metrics.
2. Record current model/task success samples.
3. Define initial cheap-worker task classes.
4. Define what counts as a successful task.
5. Define escalation and retry metrics.

Deliverable:

```text
baseline report
```

Do not change routing yet.

---

## Phase 1 — Strengthen task contracts

**Priority: P0**

Actions:

1. Expand `TASKS.md` template.
2. Add risk field.
3. Add execution class.
4. Add expected-file scope.
5. Add `Do not change` section.
6. Add acceptance checks.
7. Add escalation conditions.

Why first:

Cheap models should not be introduced before tasks are bounded enough for them.

Acceptance criteria:

- A worker can identify exactly what is in scope.
- A worker knows how success is verified.
- A worker knows when it must stop and escalate.

---

## Phase 2 — Mechanical verification

**Priority: P0**

Build `project-check`.

Start small.

Recommended initial support:

```text
Node / TypeScript package.json projects
```

Rules:

1. Discover existing scripts.
2. Prefer repository-native scripts.
3. Do not invent destructive commands.
4. Return machine-readable pass/fail summary where practical.
5. Support a fast `--changed` mode.

Acceptance criteria:

```text
same repository + same diff → deterministic check selection
```

---

## Phase 3 — Diff risk detection

**Priority: P1**

Build `diff-risk`.

Start with deterministic heuristics:

```text
file count
path patterns
manifest changes
lockfile changes
migration changes
auth/security files
CI/deployment files
unexpected deletions
```

Do not start with an LLM classifier.

Acceptance criteria:

- bounded task that expands into high-risk paths is automatically flagged.

---

## Phase 4 — Internal benchmark suite

**Priority: P1**

Create representative tasks from real workflows.

Initial recommended benchmark classes:

```text
CRUD API
admin data table
React form
simple bugfix
test generation
bounded refactor
repo discovery
```

Candidates should include current cheap and strong models.

Measure:

```text
first-pass success
final success
cost
wall time
tool errors
retry count
human correction
```

Acceptance criteria:

A cheap model may be promoted into `cheap-dev` only with measured evidence.

---

## Phase 5 — Add `cheap-dev` routing

**Priority: P0/P1 after evidence**

Do not choose the model only from public benchmarks.

Choose the model that wins the internal bounded-task benchmark on:

```text
cost_per_successful_task
```

Then:

1. add role,
2. add fallback,
3. verify reasoning suffix support,
4. verify context window,
5. verify provider availability,
6. run routing regression tests,
7. run real shadow tasks.

Initially keep cheap-dev scope conservative.

---

## Phase 6 — Add checkpoint protocol

**Priority: P1**

Update templates and policy so long tasks checkpoint at meaningful milestones.

Acceptance criteria:

A new session should be able to recover work state from repository files and Git state without requiring the previous chat transcript.

---

## Phase 7 — Architecture evidence packets

**Priority: P2**

Add a reusable methodology, preferably by extending an existing architecture/spec skill if ownership already exists rather than creating a duplicate generic skill.

Acceptance criteria:

Frontier architect receives compressed verified evidence instead of performing broad repository discovery itself.

---

## Phase 8 — Close telemetry feedback loop

**Priority: P2**

Measure model performance by task class.

Eventually routing decisions should be revisited periodically using data such as:

```text
first-pass success
cost per success
escalation rate
human correction rate
regression rate
```

Do not automatically change production routing from a tiny sample.

Require minimum evidence and explicit review.

---

# 13. Proposed Risk Model

## R0 — Mechanical

Examples:

```text
rename
fixture update
formatting
generated metadata
simple data collection
```

Execution:

```text
cheap model
```

Review:

```text
deterministic check
```

---

## R1 — Bounded reversible development

Examples:

```text
CRUD endpoint
admin filter
simple form
existing-pattern component
simple API wiring
```

Execution:

```text
cheap-dev
```

Review:

```text
project-check + diff-risk
```

---

## R2 — Moderate / cross-module

Examples:

```text
feature touching frontend + backend
non-trivial state changes
larger refactor
cross-package integration
```

Execution:

```text
default or strong coding model depending evidence
```

Review:

```text
strong model when diff or domain justifies it
```

---

## R3 — Correctness-sensitive

Examples:

```text
authentication
payment logic
non-trivial migration
performance-critical query
concurrency
high-impact data transformation
```

Execution:

```text
strong coding model
```

Review:

```text
independent reviewer when impact warrants
```

---

## R4 — Costly-to-reverse / critical judgment

Examples:

```text
architecture
security boundary
production topology
major migration strategy
public contract redesign
critical infrastructure decision
```

Execution:

```text
strong specialist implementation where needed
```

Decision/review:

```text
frontier advisor / architect
```

---

# 14. Cheap Model Design Rules

The following principles should govern all future cheap-model integration.

## Rule 1 — Cheap models execute; the system decides

Do not ask the cheap model to invent architecture when architecture can be prepared beforehand.

---

## Rule 2 — Narrow context beats giant context

Give bounded workers:

```text
goal
scope
relevant files
constraints
acceptance criteria
verification
```

not the entire historical session unless required.

---

## Rule 3 — Verification should be executable

Prefer:

```text
npm test
npm run typecheck
specific integration test
browser check
```

over prose claims such as:

```text
"this should work"
```

---

## Rule 4 — Retry is bounded

Do not optimize cost by allowing endless cheap retries.

Escalation is a feature, not a failure.

---

## Rule 5 — High-risk simplicity is still high risk

A four-line auth/payment change is not a cheap task merely because the diff is small.

---

## Rule 6 — Discovery quality is leverage

Repository maps, API facts, and dependency facts that feed downstream decisions deserve reliable evidence even when they are read-only tasks.

---

## Rule 7 — Model choice is replaceable

The system contract should survive model churn.

Do not write `cheap-dev` methodology around one vendor's quirks.

---

# 15. Long-Task Operating Protocol

For large full-stack work such as:

```text
backend
frontend
admin dashboard
database
API
authentication
queue/workers
integration
tests
deployment preparation
```

recommended execution is:

## Step 1 — Establish accepted specification

```text
PRD.md
docs/architecture.md
TASKS.md
```

## Step 2 — Break into dependency-aware tasks

Example:

```text
T1 schema
T2 backend domain
T3 API
T4 frontend data client
T5 admin UI
T6 tests
T7 integration verification
```

## Step 3 — Mark task risk

```text
R0–R4
```

## Step 4 — Route bounded work to cheapest proven tier

Do not route by prestige.

## Step 5 — Verify each boundary

Do not wait until the entire system is finished before discovering broken assumptions.

## Step 6 — Checkpoint durable state

Update:

```text
TASKS.md
STATUS.md
BUILD-LOG.md
```

at meaningful milestones.

## Step 7 — Escalate failures, not token volume

Large task size alone does not require the strongest model.

Escalate because of:

```text
ambiguity
reasoning strain
failed attempts
security risk
architecture risk
correctness risk
```

## Step 8 — Final integration remains with context owner

Specialists return bounded results.

OMP integrates and verifies the final system.

---

# 16. Proposed Success Metrics for the Improved System

The upgrade is successful only if it improves engineering economics without increasing regressions.

## Cost metrics

```text
cost per successful task
cost per first-pass success
cost per feature
cache-read tokens per completed task
frontier-model token share
```

## Quality metrics

```text
first-pass verification rate
final verification rate
regression rate
rollback rate
review rejection rate
human correction rate
```

## Routing metrics

```text
cheap-dev completion rate
cheap-dev escalation rate
strong-model escalation rate
advisor invocation rate
false escalation rate
missed escalation incidents
```

## Context metrics

```text
average main-session context size
average worker context size
compactions per long task
resume success after compaction/session restart
```

## Target direction

A healthy system should show:

```text
cheap-dev usage ↑
cost per success ↓
main-session context reread ↓
regressions stable or ↓
human corrections stable or ↓
frontier usage concentrated on high-risk decisions
```

---

# 17. Prioritized Backlog

| Priority | Work | Expected impact | Dependency |
|---|---|---:|---|
| P0 | Expand task contract | Very High | None |
| P0 | Build `project-check` | Very High | Task contract helpful |
| P0 | Define cheap-dev eligibility | Very High | Task/risk schema |
| P1 | Add R0–R4 risk classification | Very High | Task schema |
| P1 | Build `diff-risk` | High | Risk model |
| P1 | Build internal dev benchmark | Very High | Representative tasks |
| P1 | Select & wire `cheap-dev` model | Very High | Benchmark evidence |
| P1 | Formalize checkpoint lifecycle | High | Template update |
| P2 | Role-aware context budgets | High | More telemetry |
| P2 | Architecture evidence packet | High | Existing architecture skill ownership |
| P2 | Outcome telemetry | High | Benchmark/check infrastructure |
| P2 | Periodic routing review process | Medium/High | Outcome data |

---

# 18. Recommended Immediate Next Actions

If only the highest-value work is done next, use this order:

## Action 1

Redesign `config/templates/TASKS.md` into a bounded execution contract.

## Action 2

Define the R0–R4 risk model in `ROUTING.md` without changing models yet.

## Action 3

Build `project-check` with repository-native script discovery.

## Action 4

Build `diff-risk` with deterministic heuristics.

## Action 5

Create a small real-world internal benchmark suite.

Start with approximately 5–10 representative bounded tasks rather than building a giant benchmark framework immediately.

## Action 6

Benchmark cheap candidates against the current strong baseline.

Judge them using:

```text
cost per successful task
```

plus correctness and human repair effort.

## Action 7

Only after evidence exists, add `cheap-dev` to `config.yml`.

## Action 8

Run shadow mode first:

```text
cheap worker proposes implementation
strong/current path remains authoritative
compare results
```

or use isolated non-critical tasks before broad promotion.

## Action 9

After sufficient successful samples, increase cheap-dev eligibility gradually.

## Action 10

Re-audit model routing based on measured outcomes rather than launch hype or public benchmark rankings.

---

# 19. Final Architecture Principle

The current repository already has a strong AI orchestration foundation.

The next level is not:

```text
find the smartest model and use it everywhere
```

and not:

```text
find the cheapest model and force it to do everything
```

The better system is:

```text
               SYSTEM INTELLIGENCE
                       │
       ┌───────────────┼───────────────┐
       │               │               │
   requirements      routing       verification
       │               │               │
   architecture      risk model      tests
       │               │               │
   task contracts    escalation     diff guards
       │               │               │
   disk state        telemetry      checkpoints
       └───────────────┼───────────────┘
                       │
                       ▼
                  MODEL EXECUTION
                       │
          cheapest proven model that
          can safely complete the task
```

The strategic principle should be:

> **Intelligence in the system, not intelligence in every token.**

For this dotfiles architecture, the highest-value next milestone is to evolve OMP from a **smart model router** into a **risk-aware, evidence-driven engineering runtime**.

Once that layer exists, inexpensive models can handle a materially larger share of backend, frontend, admin dashboard, testing, refactoring, and long-running implementation work without requiring the same expensive model for every turn.

---

# 20. Definition of Done for the Next Major Dotfiles Version

The next orchestration milestone can be considered complete when all of the following are true:

- [ ] Tasks have explicit requirement traceability.
- [ ] Tasks declare risk level.
- [ ] Tasks declare execution class or eligibility.
- [ ] Tasks define scope and explicit non-scope.
- [ ] Tasks define runnable acceptance checks.
- [ ] Tasks define escalation conditions.
- [ ] `project-check` provides deterministic repository-native verification.
- [ ] `diff-risk` detects unexpected scope/risk expansion.
- [ ] A small internal benchmark suite exists.
- [ ] Candidate cheap models have been evaluated on real project-shaped tasks.
- [ ] `cheap-dev` is selected from measured evidence, not vendor claims.
- [ ] Cheap workers use bounded retry budgets.
- [ ] Long tasks checkpoint durable state at meaningful boundaries.
- [ ] Resumed sessions can continue from disk without relying on old conversation history.
- [ ] High-risk tasks bypass cheap execution even when the code diff is small.
- [ ] Architecture decisions receive prepared evidence packets.
- [ ] Routing telemetry records first-pass success and escalation rate.
- [ ] Cost is evaluated per successful engineering outcome.
- [ ] Existing provider/context/fallback invariants remain passing.
- [ ] Frontier models are concentrated on judgment rather than routine implementation volume.

---

## Final Priority Summary

```text
P0
├── richer TASKS contract
├── deterministic project-check
└── cheap-dev execution specification

P1
├── R0–R4 risk routing
├── diff-risk
├── internal dev benchmark
├── cheap-dev model selection
└── long-task checkpoint protocol

P2
├── adaptive context budgets
├── architecture evidence packets
├── engineering outcome telemetry
└── periodic evidence-based routing optimization
```

**Current condition:** Strong foundation.  
**Main limitation:** Precision models are still used too broadly because bounded cheap execution lacks enough deterministic guardrails.  
**Recommended direction:** Add task/risk/verification infrastructure first, then expand cheap-model usage based on measured success.
