# OMP Development Routing

This file is the canonical policy for policy-driven autonomous orchestration and deterministic agent-to-model mappings in development work. Skills own methodology; this file selects who executes it. Do not copy model preferences into skills.

## Invariants

- OMP remains the session and context owner unless a specialist handoff is justified.
- Three capacity pools carry three different jobs, matched to what each is measurably best at rather than to a single cheapest-provider rule:
  - **Antigravity** is the volume pool and the largest allowance. It carries every context-hungry lane: source research, visual work, and mechanical support.
- **Codex** is the execution pool. **GPT-5.6 Terra** at medium owns ordinary main-session and delegated implementation; **GPT-5.6 Sol** at high is reserved for complex, high-risk implementation. Terra high owns planning.
- **Direct Anthropic** is the independent judgment pool for review, security, debugging, and costly-to-reverse architecture.
- `default` and `task` are Codex GPT-5.6 Terra at medium reasoning.
- `slow` is Codex GPT-5.6 Sol at high reasoning; `plan` is Codex GPT-5.6 Terra at high reasoning.
- `vision` is Gemini 3.1 Pro at high reasoning through Antigravity for browser-visible visual work.
- `research` is Gemini 3.7 Flash at `minimal`, matching `librarian`'s declared ordinary API/library lookup contract. Evidence-heavy research must deliberately escalate; it must not silently override that contract.
- `discovery`, `smol`, and `tiny` use Gemini 3.7 Flash (`high`, `medium`, and `medium` respectively). No reachable role or fallback uses Flash Lite.
Discovery and mechanical support are deliberately not the same lane, even though both are cheap and read-only. `scout` produces the compressed map the main session then makes decisions from, so a weak model there does not merely waste a call — it yields a confident, wrong map that the parent trusts, which is worse than no map at all. `sonic` only performs mechanical updates and data collection, where that failure mode does not exist. Routing them together would optimise the wrong thing.
- The advisor lane is tiered by model as well as by reasoning level, because consultation volume is not uniform. `advisor` is Claude Sonnet 5 at high for ordinary review and bounded consultation; `advisor-xhigh` and `advisor-max` are Claude Opus 5 for difficult debugging, security-sensitive review, and costly-to-reverse architecture. Independence, not tier, is what makes a review valuable here: every primary advisor selector is from a different vendor than the Antigravity and Codex workers it reviews.
- Every primary and fallback model must be present in the live catalog and advertise a context window larger than `compaction.thresholdTokens`, or a session can exceed the model's window before compaction fires. The current `default` recovery chain is Antigravity Gemini 3.7 Flash, then direct Anthropic Claude Sonnet 4.6.
- Normal recovery uses exactly the three directly connected providers: **Antigravity, Codex, and Anthropic**. For every base role, the primary and first two fallback hops span those three providers without repetition. The `advisor*` and `discovery` primaries are outside the Codex execution pool, and their first fallback stays outside it; Codex is accepted only as the final availability-over-independence hop. Output from that final hop still carries the assigned task and verification contract, but it is not independent review or discovery.
- 9Router is an explicit reserve, not a normal-path provider. No shared role, fallback chain, or `modelProviderOrder` entry may name it. Its definition stays in `models.yml` so an operator can select it deliberately with an operator-supplied overlay or model selection; that retained definition is capability, not a claim that the gateway, account, or model is available on any device. It was removed from normal routing on 2026-08-16 because its `ag/*` routes re-spend the Antigravity allowance while every route adds another transport and failure mode; the three direct providers already supply the required diversity.
- `advisor`, `advisor-xhigh`, and `advisor-max` map scarce, high-value Anthropic consultation to the Claude 5 family with task-proportional adaptive thinking.
- Provider fallback preserves task ownership and capability methodology. It does not preserve vendor independence when an independent lane reaches its documented final Codex hop.
- File extensions do not determine routing; classify the work itself.

The executable selectors live in `config.yml`. Provider metadata lives in `models.yml`. Machine-local credentials remain outside this repository.

## Risk-Aware Classification Framework (R0–R4)

Every development task is classified by risk to match execution models and verification rules:

| Risk Level | Description & Target Work | Recommended Execution Lane | Deterministic Verification |
|---|---|---|---|
| **R0** | Purely mechanical work that preserves behavior and established invariants, such as formatting, typo correction, or rote content and asset updates. | `volume` (`@smol`) | `ai-policy-lint` / `project-check` |
| **R1** | Bounded low-risk behavior change with local, well-understood invariants and straightforward failure modes, such as routine feature or CRUD work. | `precision` (`@task`) | `project-check` + `diff-risk` |
| **R2** | Moderate work across interacting concerns, or a non-trivial refactor that requires broader reasoning while established invariants remain clear. | `precision` (`@slow`) | `project-check` + `diff-risk` |
| **R3** | Correctness-sensitive logic: auth/login, payment/billing, DB schema/migrations, secrets, lockfiles. | `precision` + `reviewer` (`@slow` + `@advisor`); security-sensitive review uses `security-reviewer` (`@advisor-xhigh`) | `project-check` + `diff-risk` |
| **R4** | Costly-to-reverse / Critical: Destructive DB migration, security boundary, infrastructure topology. | `judgment` (`@architect` + `@advisor-max`) | Specialist Review + `project-check` |

High-nuance prose and PRD synthesis always route to `writer` / `plan` regardless of file extension; the applicable risk level still determines verification.

Use `bin/diff-risk` to verify diff risk automatically after edits. Use `bin/project-check` for deterministic repository verification.

## Selection policy

| Work | OMP role | Use when |
|---|---|---|
| Normal development | `default` | Features, APIs, backend work, database integration, bounded refactors, ordinary debugging, and tests |
| Reasoning-intensive development | `slow` | Complex auth or payments, concurrency, hard migrations, cross-package refactors, performance investigations, complex algorithms, and difficult regressions |
| Planning | `plan` | Architecture-sensitive plans where implementation decisions are costly to reverse |
| Visual frontend | `vision` | Visual hierarchy, responsive layout, component composition, accessibility review, and browser-visible QA |
| Independent consultation | `advisor` | Architecture review, deep root-cause debugging, major migration review, or security-sensitive second opinion |
| Mechanical or bounded support | `task` | Repetitive transformations and ordinary delegated implementation, followed by review when the diff is wide |

Task size alone is not an escalation signal. Escalate for reasoning complexity, specialist evidence, or a demonstrated blocker.

Codex has a deliberate effort ladder: `default` uses GPT-5.6 Sol at medium reasoning for the main session, while `task`, `slow`, and `plan` use the same model at high reasoning for delegated implementation, reasoning-intensive development, architecture, and prose. Moving from `default` to `slow` now buys additional reasoning effort without changing provider or model family. Use that lane for the work categories above, not as a reflexive retry for a bounded task.

Cross-vendor escalation remains the stronger response to model-shaped failure. When ordinary development shows repeated failed edits, thrashing tool calls, or a defect that survives one reasonable attempt, consult the advisor lane (`advisor`, then `advisor-xhigh` or `advisor-max`) for genuinely independent judgment rather than repeatedly increasing effort inside Codex.

## Policy-driven autonomous orchestration

The user starts `omp` and describes the desired outcome. The main worker MUST apply this policy to classify the dominant work, decompose multi-domain requests, and autonomously dispatch each matching typed specialist. Do not wait for the user to name an agent or model. Classification is a reasoned policy decision, not a deterministic runtime classifier. After an agent is selected, `task.agentModelOverrides` and `modelRoles` mechanically provide its deterministic agent-to-model mapping.

| Detected work | Automatic agent | Role | Model |
|---|---|---|---|
| Normal, bounded development | none; main session executes | `default` | Codex GPT-5.6 Sol Medium |
| Complex auth, payments, concurrency, migrations, algorithms, performance, or difficult regressions | `complex-developer` | `slow` | Codex GPT-5.6 Sol High |
| UI, UX, responsive layout, or browser-visible frontend | `designer` | `vision` | Antigravity Gemini 3.1 Pro High |
| Architecture-sensitive or costly-to-reverse decision | `architect` | `advisor-max` | Claude Opus 5 Max |
| Hard defect after reproduction or a failed reasonable path | `debugger` | `advisor-xhigh` | Claude Opus 5 XHigh |
| High-risk correctness review | `reviewer` | `advisor` | Claude Sonnet 5 High |
| Security-sensitive review | `security-reviewer` | `advisor-xhigh` | Claude Opus 5 XHigh |
| Source-verified external library or API research | `librarian` | `research` | Antigravity Gemini 3.7 Flash High |
| Read-only repository discovery feeding a decision | `scout` | `discovery` | Anthropic Claude Sonnet 5 Medium |
| Strictly mechanical updates or data collection | `sonic` | `smol` | Antigravity Gemini 3.7 Flash Medium |
| High-nuance prose, PRD synthesis, copy humanization, or brand-voice content | `writer` | `plan` | Codex GPT-5.6 Sol High |
Browser-visible visual, layout, responsive, accessibility, or UX work MUST route to `designer`/`vision` before the first browser-visible edit. This is a capability trigger, not a reasoning-complexity escalation, so it applies regardless of task size. Pure data, API, or non-visual wiring in a frontend file does not trigger `vision`. If the designer cannot start, surface the failure instead of silently implementing the visual work in the main `default` session.

Route by the substance of the task, not keywords or file extensions. Do not delegate ordinary work merely to demonstrate orchestration. Dispatch two or more independent slices together in one task batch so they can run concurrently, after defining their shared contract. Keep sequential dependencies ordered: finish a prerequisite before launching work that requires its result. Automatic task isolation may select a copy-on-write, overlay, worktree, or recursive-copy backend; it does not remove the need for explicit, non-overlapping ownership. Every specialist returns a bounded result to the parent OMP session; the parent retains context, integration, conflict resolution, and final verification ownership.

Claude 5 models use adaptive thinking by default. Keep `advisor` on Sonnet 5 at `high` for bounded consultation and ordinary review; reserve `advisor-xhigh` for difficult debugging and security-sensitive review, and `advisor-max` for costly-to-reverse architecture decisions, both on Opus 5. Escalating from Sonnet 5 to Opus 5 is a deliberate step, not an automatic one: prefer it when the question is genuinely hard rather than merely important. Explicit task scope and delegation limits are required because Opus 5 tends to verify and delegate more readily than Opus 4.8. Model-keyed fallback steps down to Antigravity Claude Opus 4.6 High, then Codex High, regardless of which Opus 5 advisor role was selected; fallbacks preserve task ownership and verification requirements.

Antigravity serves both the Gemini family and Claude Opus 4.6 here, so an Opus 5 advisor that cannot start first degrades to Opus 4.6 outside the Codex execution pool. Treat that review as one tier lower than requested. Codex is the final availability fallback only; if the task widget shows that hop, the result is not independent review and must not be represented as such.

Built-in agents ship with OMP; `config/omp/agents/` tracks a definition only where it changes something. The bundled roster is `designer`, `librarian`, `reviewer`, `scout`, `security-reviewer`, `sonic`, and `task`; the tracked specialists are `architect`, `complex-developer`, `debugger`, and `writer`. Five bundled agents are additionally tracked because their bundled model is wrong for this fleet — verified against `omp agents unpack`:

| Agent | Bundled default | Tracked | Why the override matters |
|---|---|---|---|
| `reviewer` | `@slow` | `@advisor` | Bundled, the reviewer runs on **Codex — the same pool it reviews**. This override is what makes vendor independence real rather than aspirational. |
| `security-reviewer` | *(none)* | `@advisor-xhigh` | Bundled declares no model at all. |
| `librarian` | `@smol` | `@research` | Flash Lite cannot carry evidence-heavy external reading. |
| `scout` | `@smol` | `@discovery` | A weak model here yields a confident wrong map. |
| `designer` | `@designer` | `@vision` | Keeps the visual lane on one role name. |

`sonic` and `task` are deliberately **not** tracked: their bundled model already matches this fleet, so a tracked copy would change nothing while shadowing any future upstream improvement to their directives. `task.agentModelOverrides` pins both deterministically regardless. Every one of the eleven agents has an entry there, so no agent silently resolves to `default`. Inspect the bundled definitions with `omp agents unpack --dir <tmp>` before assuming what one does — and before adding a tracked copy, diff against the bundled one to confirm it is doing work.

Bundled definitions carry their own `model` and `thinkingLevel` declarations, and `agentModelOverrides` is what makes routing deterministic on top of them. Two consequences follow. A role named in a bundled definition must exist here even when an override also covers it, which is why `designer` is defined as a role alias beside `vision`. And a role's reasoning suffix must be a level its model actually supports, because an agent may declare its own level independently: `librarian` declares `minimal`, so `research` uses Gemini 3.7 Flash, which supports it, rather than Gemini 3.1 Pro, which offers only `low` and `high`.

Two bundled agents can spawn further agents: `reviewer` may spawn `scout`, and `task` may spawn any agent. Combined with a concurrency limit of eight, a single delegated task can therefore expand into a wider fleet than the dispatching decision implies. Give `task` an explicitly bounded assignment, and treat nested spawning as delegation the parent still owns and must verify.

The model shown in the main OMP header remains the main context owner's model. The task widget's resolved-model badge identifies the model actually running each specialist; no `designer` task means no visual specialist was dispatched.

### Enforcement boundary

This document governs the main worker's classification and delegation decisions. OMP mechanically enforces configured role resolution, agent overrides, batch shape, concurrency limits, and isolation policy; it does not prove that a policy classification was correct. Autonomous routing also cannot overcome an unavailable executable, missing or expired provider authentication, exhausted quota, provider outage, or a model rejected by the provider. Configured fallbacks are best-effort recovery, not a success guarantee, and terminal provider/auth failures must be surfaced to the user.

### `approvalMode: yolo` — chosen, not drifted

`config.yml` keeps `tools.approvalMode: yolo` and `dev.autoqaConsent: granted` for uninterrupted terminal work. Ordered `bash.patterns` now deny known destructive Git, recursive-delete, privilege, and deployment forms before execution. This mechanical floor is deliberately narrow; permission is still not user approval.

What that buys has to be paid for elsewhere, so be explicit about where the boundary actually lives:

- **`AGENTS.md` remains the approval contract.** The OMP deny list blocks known command shapes; it cannot infer secrets, production intent, or every wrapper spelling.
- **Two mechanical backstops cover different runtimes.** OMP `bash.patterns` applies to parent and child Bash calls. `config/ai/hooks/git-guard.sh` provides deeper Git argument checks where the Claude hook is wired. Both retain documented subprocess ceilings.
- **Delegated work is bounded mechanically.** `task.isolation.apply` is false, recursion depth is one, and child LSP is enabled. Each child declares a file boundary, accepted invariants, and semantic owners in `delivery-ledger`; active children sharing an owner are rejected. After every child finishes, the parent applies each digest-bound patch sequentially and runs integration regression checks.

If this trade stops being wanted, the change is one line — but change it deliberately, and update this section rather than letting the config and the documentation disagree again.

### MCP admission gate

An MCP server enlarges both the capability surface and the trust boundary; its availability is not admission. Before enabling one in tracked configuration or as a global default:

- Require a capability gap that native OMP tools or an installed deterministic CLI cannot already fill. A natural-language wrapper around an equivalent native operation is convenience, not a gap.
- Keep project-specific servers project-scoped. Global admission requires a universal, frequently used capability.
- Pin the server version or source revision. Do not admit a floating `latest` dependency.
- Inventory every exposed tool as read-only, source-writing, destructive, networked, or secret-bearing. Expose only the minimum set; a server that cannot disable unneeded mutators must not be enabled globally under `approvalMode: yolo`.
- Prefer stdio or loopback transport. Non-loopback transport requires authentication, and credentials remain outside the repository.
- Reject nested-agent or nested-LLM tools unless they provide a proven capability that OMP routing cannot supply and their provider, cost, and data boundary are explicit.
- Require a bounded pilot, a health check, and a clean removal path before promotion. Do not make supporting services always-on until measured use justifies them.

This gate decides whether a capability enters the runtime. `AGENTS.md` approval gates still govern every admitted tool invocation, and native OMP editing and verification remain the default when they provide equal capability.

## Single-provider sessions

Occasionally a session should stay on one provider — to exercise a provider in isolation, to work while another is degraded, or simply to keep one piece of work on a single account. Overriding the main model with `--model` does not achieve this: specialist agents resolve through roles, so they keep their own providers and the session remains multi-model.

Use a config overlay instead, which replaces the whole role table for that run only:

```bash
omp --config ~/dotfiles/config/omp/overlays/codex-only.yml
omp --config ~/dotfiles/config/omp/overlays/antigravity-only.yml
```

Each overlay pins all thirteen roles to one provider, so every dispatched specialist follows, and confines recovery to that same provider — a session deliberately pinned to one provider should fail inside it rather than quietly restoring the routing the operator just opted out of. The tracked configuration is untouched; the next plain `omp` is back to normal.

Both overlays honour the same invariants as the main config: supported reasoning levels, context windows above the compaction threshold, and an image-capable model behind `vision` and `designer`. One capability genuinely cannot be preserved: Antigravity's Claude Opus 4.6 stops at `high` reasoning, so an Antigravity-only session has no equivalent to the `xhigh` and `max` advisor tiers that direct Anthropic Opus 5 provides. Treat advisor output from such a session as one tier lower than requested.

`omp-effective-routing-test` invokes OMP's own `models --config` loader before
its structural checks. OMP 17.3.5 still rejects the same documented global flag
when it precedes `config list`; that upstream parser defect is reported as
`PARTIAL`, not hidden by the test's YAML merge.

## Capability ownership

Existing capabilities remain the preferred owners:

- Architecture and specification packs: `development-spec-suite`, with `prd-taskbreaker`, `openapi-spec`, and `mermaid-diagram` for bounded outputs.
- UI and product surfaces: `admin-product-ux`, `admin-dashboard`, `design-taste`, `storefront-ux`, `shadcn-ui`, and `ui-validation` according to their declared boundaries.
- Implementation restraint: `native-first`.
- Code simplification review: `lean-code-review`.
- Platform and domain engineering: the existing stack-specific Cloudflare, Astro, storefront, Stripe, Supabase, and integration skills.

Do not create generic architecture, UI, backend, test, security, or review skills merely to mirror role names. Add a capability only when a real reusable methodology gap remains after checking existing owners.

## Context handoff

Keep the current context owner unless specialist capability is required, the current worker is demonstrably stuck, or independent review has high value. A standalone-CLI handoff must include:

```text
GOAL
CURRENT BEHAVIOR
EXPECTED BEHAVIOR
RELEVANT FILES
KNOWN CONSTRAINTS
WHAT HAS BEEN TRIED
CURRENT DIFF SUMMARY
OPEN QUESTION
```

The receiving worker returns analysis or a bounded artifact. OMP retains final integration and verification ownership.

## Routing examples

| Scenario | Route | Reason |
|---|---|---|
| Simple API endpoint | `default` | Normal bounded development |
| Dashboard redesign | `vision` | Visual hierarchy and browser-visible behavior dominate |
| Complex auth regression | `slow`; `advisor` only if blocked or independent review is valuable | High reasoning and security sensitivity |
| Algorithm latency optimization | `slow` | Requires baseline, metric, benchmark, and measured result |
| Mass mechanical rename | `task`, then review by the context owner | Repetitive bounded work; wide-diff risk remains, which is why `task` runs on the precision pool rather than the cheapest one |
| Major architecture migration | `plan` or `slow`; `advisor` for high-value consultation | Costly-to-reverse architecture decisions |
