# OMP Development Routing

This file is the canonical model-routing policy for development work. Skills own methodology; this file selects who executes it. Do not copy model preferences into skills.

## Invariants

- OMP remains the session and context owner unless a specialist handoff is justified.
- `default` and `task` are Codex GPT-5.6 Sol at medium reasoning.
- `slow` and `plan` are Codex GPT-5.6 Sol at high reasoning.
- `vision` is Gemini 3.1 Pro through Antigravity for browser-visible visual work.
- `advisor` is Anthropic Claude Opus 4.8 at high reasoning for scarce, high-value consultation.
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

## Mandatory automatic orchestration

The user starts `omp` and describes the desired outcome. The main worker MUST classify the dominant work, decompose multi-domain requests, and autonomously dispatch each matching typed specialist. Do not wait for the user to name an agent or model. `task.agentModelOverrides` selects each worker model deterministically.

| Detected work | Automatic agent | Role | Model |
|---|---|---|---|
| Normal, bounded development | none; main session executes | `default` | Codex GPT-5.6 Sol Medium |
| Complex auth, payments, concurrency, migrations, algorithms, performance, or difficult regressions | `complex-developer` | `slow` | Codex GPT-5.6 Sol High |
| UI, UX, responsive layout, or browser-visible frontend | `designer` | `vision` | Gemini 3.1 Pro |
| Architecture-sensitive or costly-to-reverse decision | `architect` | `advisor` | Claude Opus 4.8 High |
| Hard defect after reproduction or a failed reasonable path | `debugger` | `advisor` | Claude Opus 4.8 High |
| High-risk correctness or security review | `reviewer` or `security-reviewer` | `advisor` | Claude Opus 4.8 High |
| Source-verified external library or API research | `librarian` | `slow` | Codex GPT-5.6 Sol High |
| Read-only repository discovery or strictly mechanical support | `scout` or `sonic` | `smol` | Gemini Flash Lite |

Route by the substance of the task, not keywords or file extensions. Do not delegate ordinary work merely to demonstrate orchestration. When two or more slices are independent, dispatch them together in one task batch so their assigned models run concurrently; define shared contracts before launch and keep dependencies sequential. Each specialist returns its result to the main session, which retains context, integration, conflict resolution, and final verification ownership.

The tracked specialist definitions live under `config/omp/agents/` and are installed at `~/.omp/agent/agents`.

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

## Deterministic scenarios

| Scenario | Route | Reason |
|---|---|---|
| Simple API endpoint | `default` | Normal bounded development |
| Dashboard redesign | `vision` | Visual hierarchy and browser-visible behavior dominate |
| Complex auth regression | `slow`; `advisor` only if blocked or independent review is valuable | High reasoning and security sensitivity |
| Algorithm latency optimization | `slow` | Requires baseline, metric, benchmark, and measured result |
| Mass mechanical rename | `task`, then review by the context owner | Repetitive bounded work; wide-diff risk remains |
| Major architecture migration | `plan` or `slow`; `advisor` for high-value consultation | Costly-to-reverse architecture decisions |
