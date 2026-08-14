# Dotfiles AI Engineering — Master Architecture Blueprint & Audit Specification

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
- **60–75% of execution tokens:** Volume/cheap worker models (`@smol`, `@task` via Antigravity Gemini 3.6 Flash / Flash Lite).
- **20–30% of execution tokens:** Precision coding models (`@slow` via Codex GPT-5.6 Sol).
- **5–10% of execution tokens:** Frontier judgment models (`@advisor-max`, `@architect` via Claude Opus 5).

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

OMP manages twelve explicit model roles across three capacity pools:

| Capacity Pool | Roles | Primary Responsibility | Primary Model Provider |
|---|---|---|---|
| **Volume Pool** | `default`, `research`, `vision`, `designer`, `smol`, `tiny` | Main session context ownership, broad research, visual QA, mechanical data collection | Antigravity (Gemini 3.6 Flash / 3.1 Pro) |
| **Precision Pool** | `task`, `slow`, `plan` | Delegated implementation, complex reasoning, algorithms, architecture planning | Codex (GPT-5.6 Sol) |
| **Judgment Pool** | `advisor`, `advisor-xhigh`, `advisor-max` | Independent consultation, deep debugging, security audits, high-impact review | Anthropic (Claude Sonnet 5 / Opus 5) |

---

## 4. Risk-Aware Classification Framework (R0–R4)

Every task is classified by risk level to select execution lanes and verification requirements:

| Risk Level | Work Characterization | Execution Lane | Deterministic Verification |
|---|---|---|---|
| **`R0`** | Documentation (`*.md`), typo fixes, static assets, pure mechanical updates. | Volume / Cheap-dev (`@smol`) | `ai-policy-lint` / `project-check` |
| **`R1`** | Bounded low-risk feature/CRUD edit (<= 3 files, <= 150 lines changed). | Volume / Cheap-dev (`@task`) | `project-check` + `diff-risk` |
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
- **Execution Class:** volume / cheap-dev (or precision / judgment)
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
- `ai-doctor --self-test` (15/15 gates passing).
- `git-guard.test.sh` (21/21 unit tests passing).
- `ai-policy-lint` (0 errors).
- `project-check` & `diff-risk` (100% operational across Linux & macOS).
