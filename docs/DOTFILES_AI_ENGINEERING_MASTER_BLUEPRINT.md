# Dotfiles AI Engineering — Master Architecture Blueprint & Audit Specification

> [!CAUTION]
> **Immutable historical baseline; superseded for current-state decisions.**
> Preserve the body as the 2026-08-15 blueprint snapshot; “Definitive” below is
> historical. Use [`../TASKS.md`](../TASKS.md) for live work, current disk and
> executable checks for behavior, and `config/omp/config.yml` plus
> `config/omp/STATUS.md` for current routing.

**Repository:** `ongkipro/dotfiles`  
**Document Status:** Definitive Unified Master Architecture Specification  
**Baseline Date:** 2026-08-15  
**Scope:** OMP Orchestration, Multi-Provider Capacity Pools, Risk-Aware Model Routing (R0–R4), Deterministic Verification Tooling, Task Execution Contracts, Prompt-Injection Security Boundaries, and Cross-Platform (Linux/macOS) Parity.

---

## 1. Executive Summary & Core Philosophy

The `dotfiles` repository is an AI-native development operating system. It separates five core engineering concepts:

```text
JOB → CHANGE RISK → REQUIRED CAPABILITIES → MODEL CANDIDATES → MEASURED SELECTION
```

### Core Architecture Axiom:
> **"Intelligence in contracts, tools, evidence, and routing — not in every token."**

Instead of relying on expensive frontier LLMs for routine tasks, the system shifts intelligence into deterministic engineering infrastructure:
- **Bounded, mechanical, and high-volume lanes:** `@smol`, `@tiny` via Antigravity Gemini 3.7 Flash / 3.1 Flash Lite.
- **The main session and every delegated implementation lane:** `@default`, `@task`, `@slow`, `@plan` via Codex GPT-5.6 Sol.
- **Frontier judgment, kept scarce:** `@advisor`, `@advisor-xhigh`, `@advisor-max`, `@architect` via Claude Sonnet 5 / Opus 5.

> The earlier 60–75 / 20–30 / 5–10 token split described the arrangement before
> 2026-08-16, when the main session ran on the volume pool. Since the main session
> is 97.7% of tokens and now runs on Codex, that split inverts. Do not quote
> percentages from this document; measure them from `~/.omp/stats.db` instead.

---

## 2. Telemetry Baseline & Context Economics

Analysis of **11,651 calls across ~70 hours of real usage** revealed:
- **95.8% of token usage:** Cache-read / context rereading in conversation history.
- **0.22% of token usage:** Output generation.
- **97.7% of tokens:** Consumed in the main session.

### Strategic Conclusion:
The primary economic bottleneck is **repeated loading of large, weakly bounded context into the main session**.
The leverage point is not raw output token pricing, but **cost per successfully completed task**.

---

## 3. Capacity Pools & Specialist Taxonomy

OMP manages thirteen explicit model roles across three capacity pools. The
authoritative list is `config/omp/config.yml`; verify against it before quoting
this table.

| Capacity Pool | Roles | Primary Responsibility | Primary Model Provider |
|---|---|---|---|
| **Volume Pool** | `research`, `vision`, `designer`, `smol`, `tiny` | Main session context ownership, broad research, visual QA, mechanical data collection | Antigravity (Gemini 3.7 Flash / 3.1 Pro / 3.1 Flash Lite) |
| **Precision Pool** | `default`, `task`, `slow`, `plan` | Delegated implementation, complex reasoning, algorithms, architecture planning | Codex (GPT-5.6 Sol) |
| **Judgment Pool** | `discovery`, `advisor`, `advisor-xhigh`, `advisor-max` | Read-only repository discovery feeding a decision (`scout`), independent consultation, deep debugging, security audits, high-impact review | Anthropic (Claude Sonnet 5 / Opus 5) |

> **`default` sits in the Precision Pool by decision, 2026-08-16.** It moved from
> Antigravity Gemini 3.7 Flash to Codex GPT-5.6 Sol High so that ordinary full-stack
> development runs on the model with the lowest measured tool-call error rate; `smol`
> rose to Gemini 3.7 Flash so mechanical work did not regress. One consequence to
> keep in mind: `default`, `task`, `slow`, and `plan` are now the same model at the
> same tier, so escalation within Codex buys nothing — escalate cross-vendor to the
> advisor lane instead. Rationale and evidence: `config/omp/BUILD-LOG.md`. Read
> `config/omp/config.yml` — never this table — for the live answer.

`discovery` was split out of `research` because the two share a shape but not a
failure profile: `librarian` returns verbatim excerpts a reader can check, while
`scout` returns an interpreted map the parent session acts on without re-reading
the source. See `config/omp/ROUTING.md` for the full rationale.

---

## 4. Risk-Aware Classification Framework (R0–R4)

Every task is classified by risk level to select execution lanes and verification requirements:

| Risk Level | Work Characterization | Execution Lane | Deterministic Verification |
|---|---|---|---|
| **`R0`** | Documentation (`*.md`), typo fixes, static assets, pure mechanical updates. | Volume (`@smol`) | `ai-policy-lint` / `project-check` |
| **`R1`** | Bounded low-risk feature/CRUD edit (<= 3 files, <= 150 lines changed). | Precision (`@task`) | `project-check` + `diff-risk` |
| **`R2`** | Moderate multi-module feature or non-trivial refactor (4–10 files). | Precision Lane (`@slow`) | `project-check` + `diff-risk` |
| **`R3`** | Correctness-sensitive logic: auth/login, payment/billing, DB schema/migrations, secrets, lockfiles. | Precision + Independent Review (`@slow` + `@advisor-xhigh`) | `project-check` + `diff-risk` |
| **`R4`** | Costly-to-reverse / Critical: Destructive DB migration, security boundary, infrastructure topology. | Judgment Lane (`@architect` + `@advisor-max`) | Specialist Review + `project-check` |

---

## 5. Deterministic Engineering Tooling

To ensure zero-trust completion claims, dotfiles provides three core executable scripts in `bin/`:

1. **`project-check` (`bin/project-check`)**: Native, runtime-neutral test runner. Automatically detects Node (`npm`/`pnpm`/`bun` typecheck/lint/test/build), Go (`go vet`/`go test`), Python (`pytest`/`ruff`), Rust (`cargo check`/`cargo test`), and PHP (`phpunit`).
2. **`diff-risk` (`bin/diff-risk`)**: Deterministic Git diff classifier. Inspects staged/unstaged changes, flags sensitive path triggers (auth, payment, DB, secrets, lockfiles), and outputs risk level (R0–R4) with lane recommendations.
3. **`ai-policy-lint` (`bin/ai-policy-lint`)**: Semantic linter for policy and routing alignment across `AGENTS.md`, `ROUTING.md`, `config.yml`, OMP agents, skills, and templates.

---

## 6. Task Execution Contract Standard

Every project task in `config/templates/TASKS.md` follows an explicit execution contract:

```markdown
### TASK-001: [Short Task Title]
- **Requirement:** REQ-001 (from PRD.md)
- **Risk Level:** R1 (R0=negligible, R1=low/bounded, R2=moderate, R3=correctness/sensitive, R4=architecture/critical)
- **Execution Class:** volume / precision / judgment
- **Scope:** [Exact files or components to touch]
- **Non-Scope:** [Explicitly untouched paths or systems]
- **Verification:** `project-check` or `npm test -- path/to/test.ts`
- **Escalation Condition:** Fail verification after 1 repair attempt, or require auth/payment/migration contract changes.
```

---

## 7. Security Boundaries & Cross-Platform Parity (Linux / macOS)

### Prompt-Injection & Security Guards:
- **`secrets.enabled: true`**: Blocks reading of `.env` files or leaking credentials in prompt history.
- **`git-guard.sh`**: PreToolUse hook enforcing approval gates for `git push --force`, `git reset --hard`, `commit --amend`, or destructive operations.
- **Approval Gates:** Always-on for system-wide `sudo`, production deploys (`wrangler deploy`, Shopify theme push), and secret access.

### macOS & Linux Parity:
- Both operating systems share **identical policy sources** (`config/ai/AGENTS.md`), **identical skill capabilities** (`skills/local/`), and **identical OMP routing** (`config/omp/`).
- `install-macos.sh` provides macOS-native symlinking (`~/.zshrc` support, Homebrew/Mise PATH resolution, BSD vs GNU `sed` safety, and `merge.ours` snapshot protection).

---

## 8. Definition of Done & Verification Summary

The dotfiles operating system is verified through continuous self-testing:
- `ai-doctor --self-test`, `ai-policy-lint` (0 errors), and `security-check`.
- 31 regression suites: 30 under `bin/*-test` plus `config/ai/hooks/git-guard.test.sh` (47 guard cases).
- `project-check` & `diff-risk` operational on Linux; the macOS installer path is
  correct by review but has not been executed on a Mac (see `TASKS.md`, TASK-007).

Counts here go stale quickly. Run the suites rather than trusting this list.
