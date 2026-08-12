# OMP Development Routing

This file is the canonical policy for policy-driven autonomous orchestration and deterministic agent-to-model mappings in development work. Skills own methodology; this file selects who executes it. Do not copy model preferences into skills.

## Invariants

- OMP remains the session and context owner unless a specialist handoff is justified.
- Three capacity pools carry three different jobs, matched to what each is measurably best at rather than to a single cheapest-provider rule:
  - **Antigravity** is the volume pool and the largest allowance. It carries the main session and every context-hungry lane: ordinary development, discovery, source research, visual work, and planning judgment.
  - **Codex** is the precision pool. In measured use it produced the lowest tool-call error rate and the leanest tool loop, so it owns the two lanes where a wrong edit costs the most rework: complex implementation and delegated mechanical implementation. Both run as bounded specialists, so this precision is bought at modest volume.
  - **Direct Anthropic** is the judgment pool and the scarcest. It is reserved for Claude 5 consultation and review, which no other provider here serves.
- `default` is Gemini 3.6 Flash at medium reasoning through Antigravity. Ordinary development is the cheap lane by default; reasoning capacity is bought deliberately, not paid as a base rate.
- `slow` is Codex GPT-5.6 Sol at high reasoning, the explicit escalation step for reasoning-intensive implementation, reached automatically by classification or manually through the model cycle. `task` is the same model at medium reasoning for delegated mechanical implementation, where wide diffs make tool-call precision worth more than raw price.
- `plan` is Claude Opus 4.6 at high reasoning through Antigravity. Planning is judgment over evidence rather than a tool loop, so it stays on the volume pool while implementation precision stays on Codex.
- `vision` is Gemini 3.1 Pro at high reasoning through Antigravity for browser-visible visual work.
- `research` is Gemini 3.6 Flash at high reasoning through Antigravity, chosen for its million-token context during source-verified reading rather than for reasoning escalation. `librarian` grounds its answers through a required structured output of verbatim excerpts, repository paths, and line ranges, so evidence discipline comes from that contract rather than from model tier.
- `smol` is Gemini 3.1 Flash Lite for read-only discovery and strictly mechanical support, keeping a genuine cost step below `default`. `tiny` is the same model at minimal reasoning for internal short-form work.
- The advisor lane is tiered by model as well as by reasoning level, because consultation volume is not uniform. `advisor` is Claude Sonnet 5 at high for ordinary review and bounded consultation; `advisor-xhigh` and `advisor-max` are Claude Opus 5 for difficult debugging, security-sensitive review, and costly-to-reverse architecture. Independence, not tier, is what makes a review valuable here: every advisor model is from a different vendor than the Antigravity and Codex workers it reviews.
- Every model reachable from any role or fallback must have a context window larger than `compaction.thresholdTokens`, or a session can exceed the model's window before compaction ever fires. This rules out otherwise attractive small-window models such as Codex GPT-5.3 Codex Spark at 128K; the `default` overflow uses GPT-5.4 instead, which carries a million-token window.
- Recovery paths use only the three directly connected providers: Antigravity, Codex, and Anthropic. Every chain changes provider on its first hop, because falling back to another model inside an exhausted pool recovers nothing. 9Router stays configured as an optional manual route and holds no place in any fallback chain: a tunnelled transport is the wrong dependency precisely when something has already failed, and its measured cost reached three times the direct route for an identical model.
- `advisor`, `advisor-xhigh`, and `advisor-max` map scarce, high-value Anthropic consultation to the Claude 5 family with task-proportional adaptive thinking.
- Provider fallback may change transport, but must not change capability methodology.
- File extensions do not determine routing; classify the work itself.

The executable selectors live in `config.yml`. Provider metadata lives in `models.yml`. Machine-local credentials remain outside this repository.

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

Because `default` is now the cheap lane, escalation to `slow` is a normal and expected move rather than an exception. Escalate as soon as ordinary development shows reasoning strain — repeated failed edits, thrashing tool calls, or a defect that survives one reasonable attempt — instead of persisting at `default` to save cost. Cost discipline comes from a low base rate and a bounded context, not from refusing to escalate.

## Policy-driven autonomous orchestration

The user starts `omp` and describes the desired outcome. The main worker MUST apply this policy to classify the dominant work, decompose multi-domain requests, and autonomously dispatch each matching typed specialist. Do not wait for the user to name an agent or model. Classification is a reasoned policy decision, not a deterministic runtime classifier. After an agent is selected, `task.agentModelOverrides` and `modelRoles` mechanically provide its deterministic agent-to-model mapping.

| Detected work | Automatic agent | Role | Model |
|---|---|---|---|
| Normal, bounded development | none; main session executes | `default` | Antigravity Gemini 3.6 Flash Medium |
| Complex auth, payments, concurrency, migrations, algorithms, performance, or difficult regressions | `complex-developer` | `slow` | Codex GPT-5.6 Sol High |
| UI, UX, responsive layout, or browser-visible frontend | `designer` | `vision` | Antigravity Gemini 3.1 Pro High |
| Architecture-sensitive or costly-to-reverse decision | `architect` | `advisor-max` | Claude Opus 5 Max |
| Hard defect after reproduction or a failed reasonable path | `debugger` | `advisor-xhigh` | Claude Opus 5 XHigh |
| High-risk correctness review | `reviewer` | `advisor` | Claude Sonnet 5 High |
| Security-sensitive review | `security-reviewer` | `advisor-xhigh` | Claude Opus 5 XHigh |
| Source-verified external library or API research | `librarian` | `research` | Antigravity Gemini 3.6 Flash High |
| Read-only repository discovery or strictly mechanical support | `scout` or `sonic` | `smol` | Antigravity Gemini 3.1 Flash Lite |

Browser-visible visual, layout, responsive, accessibility, or UX work MUST route to `designer`/`vision` before the first browser-visible edit. This is a capability trigger, not a reasoning-complexity escalation, so it applies regardless of task size. Pure data, API, or non-visual wiring in a frontend file does not trigger `vision`. If the designer cannot start, surface the failure instead of silently implementing the visual work in the main `default` session.

Route by the substance of the task, not keywords or file extensions. Do not delegate ordinary work merely to demonstrate orchestration. Dispatch two or more independent slices together in one task batch so they can run concurrently, after defining their shared contract. Keep sequential dependencies ordered: finish a prerequisite before launching work that requires its result. Automatic task isolation may select a copy-on-write, overlay, worktree, or recursive-copy backend; it does not remove the need for explicit, non-overlapping ownership. Every specialist returns a bounded result to the parent OMP session; the parent retains context, integration, conflict resolution, and final verification ownership.

Claude 5 models use adaptive thinking by default. Keep `advisor` on Sonnet 5 at `high` for bounded consultation and ordinary review; reserve `advisor-xhigh` for difficult debugging and security-sensitive review, and `advisor-max` for costly-to-reverse architecture decisions, both on Opus 5. Escalating from Sonnet 5 to Opus 5 is a deliberate step, not an automatic one: prefer it when the question is genuinely hard rather than merely important. Explicit task scope and delegation limits are required because Opus 5 tends to verify and delegate more readily than Opus 4.8. Model-keyed fallback steps down to Antigravity Claude Opus 4.6 High, then Codex High, regardless of which Opus 5 advisor role was selected; fallbacks preserve task ownership and verification requirements.

Antigravity serves both the Gemini family and Claude Opus 4.6 here, so an Opus 5 advisor that cannot start degrades to Opus 4.6 on the primary capacity pool rather than leaving the reasoning tier entirely. Advisor roles are the only routes that depend on direct Anthropic access; if that provider is unavailable, expect silent degradation to Opus 4.6 and treat the resulting review as one tier lower than requested.

Built-in agents ship with OMP; only repository-specific specialist definitions are tracked under `config/omp/agents/` and installed at `~/.omp/agent/agents`. The bundled roster is `designer`, `librarian`, `reviewer`, `scout`, `security-reviewer`, `sonic`, and `task`; the tracked specialists are `architect`, `complex-developer`, and `debugger`. Every one of the ten has an entry in `task.agentModelOverrides`, so no agent silently resolves to `default`. Inspect the bundled definitions with `omp agents unpack --dir <tmp>` before assuming what one does.

Bundled definitions carry their own `model` and `thinkingLevel` declarations, and `agentModelOverrides` is what makes routing deterministic on top of them. Two consequences follow. A role named in a bundled definition must exist here even when an override also covers it, which is why `designer` is defined as a role alias beside `vision`. And a role's reasoning suffix must be a level its model actually supports, because an agent may declare its own level independently: `librarian` declares `minimal`, so `research` uses Gemini 3.6 Flash, which supports it, rather than Gemini 3.1 Pro, which offers only `low` and `high`.

Two bundled agents can spawn further agents: `reviewer` may spawn `scout`, and `task` may spawn any agent. Combined with a concurrency limit of eight, a single delegated task can therefore expand into a wider fleet than the dispatching decision implies. Give `task` an explicitly bounded assignment, and treat nested spawning as delegation the parent still owns and must verify.

The model shown in the main OMP header remains the main context owner's model. The task widget's resolved-model badge identifies the model actually running each specialist; no `designer` task means no visual specialist was dispatched.

### Enforcement boundary

This document governs the main worker's classification and delegation decisions. OMP mechanically enforces configured role resolution, agent overrides, batch shape, concurrency limits, and isolation policy; it does not prove that a policy classification was correct. Autonomous routing also cannot overcome an unavailable executable, missing or expired provider authentication, exhausted quota, provider outage, or a model rejected by the provider. Configured fallbacks are best-effort recovery, not a success guarantee, and terminal provider/auth failures must be surfaced to the user.

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
