# Completed Skill Contracts — 2026-10-10

TASK-114 and TASK-115 finished with PASS in their immutable delivery runs.
Contracts below are preserved verbatim; execution evidence stays in `.delivery/`.

### TASK-115: Optional code graphs and lossless concise dialogue

- **Requirement:** REQ-OPTIONAL-CODEGRAPH-AND-CONCISE-DIALOGUE (owner requests adopting recommendations for Ponytail, Graphify, and Caveman).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** skill-creator, codebase-navigation, volumx-writer.
- **Allowed Paths:** `skills/local/codebase-navigation/**`, `skills/local/full-stack-development/SKILL.md`, `skills/local/volumx-writer/SKILL.md`, `skills/local/volumx-writer/references/terminal-dialogue.md`, `skills/local/volumx-writer/references/dialogue-evaluation.md`, `skills/local/development-kit/references/ecosystem-adoption.md`, `bin/skill-map`, `skills/local/README.md`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** None; `bin/skill-map` changes only domain membership. The R3 skill-methodology change still requires independent review.
- **Canonical Contract Owners:** `ai.optional-codegraph`, `ai.concise-dialogue`.
- **Accepted Invariants:** ordinary navigation stays search-first; graph extraction is optional, bounded, code-only, outside the source tree; no upstream configuration installer, secret access, LLM extraction, or provider change; concise replies retain meaning, evidence, and requested depth; existing Ponytail principles remain canonical.
- **Regression Checks:** `python3 skills/local/codebase-navigation/scripts/check-pilot.py`, `skill-check`, `skill-map --check`, `ai-policy-lint`, `ai-doctor`, independent dialogue-case walkthrough, `git diff --check`.
- **Runtime Evidence:** real pinned Graphify on synthetic Python only; static alias call chain compared with text search. Dialogue walkthrough is instruction-level evidence, not a multi-provider benchmark.
- **Visual Contract:** Not applicable; no application UI changes.
- **Reopen Conditions:** graph extraction changes source files, concise guidance loses negation/claims unrun checks, or runtime skill links are missing.
- **Non-Scope:** global Graphify/MCP/proxy installation, new orchestrator, production scanning, application design, unrelated dirty work, commit/push.
- **Escalation Conditions:** adoption requires overwriting canonical runtime configuration or reading secrets.

### TASK-114: Adaptive, reference-led UI design and evidence

- **Requirement:** REQ-ADAPTIVE-UI-SKILLS (owner authorization 2026-10-09: remove rigid methodology while requiring researched references, rendered validation, and designer-quality critique).
- **Risk Level:** R3.
- **Job:** implementation.
- **Capability:** design-taste, skill-creator.
- **Allowed Paths:** `skills/local/design-taste/SKILL.md`, `skills/local/design-taste/scripts/design-gate.py`, `skills/local/design-taste/scripts/visual-review.py`, `skills/local/design-taste/scripts/test-design-gate.py`, `skills/local/design-taste/scripts/portfolio-scan.py`, `skills/local/design-taste/references/design-discovery.md`, `skills/local/design-taste/references/visual-review.md`, `skills/local/cross-cli/SKILL.md`, `config/ai/README.md`, `TASKS.md`, `.delivery/**`.
- **Protected Paths:** `skills/local/design-taste/scripts/design-gate.py`.
- **Canonical Contract Owners:** `ui.design-evidence`.
- **Accepted Invariants:** new directions use inspected references and research before visual code; existing accepted systems may supply maintenance evidence; taste heuristics are advisory, owner invariants and accessibility remain mandatory; a fresh independent reviewer may use the same model/provider; missing, corrupt, stale, or changed visual evidence cannot pass; no invented model provenance or self-written review.
- **Regression Checks:** `python3 skills/local/design-taste/scripts/test-design-gate.py`, `python3 skills/local/design-taste/scripts/test-portfolio-scan.py`, `skill-check`, `ai-policy-lint`, `ai-doctor`, `git diff --check`.
- **Runtime Evidence:** isolated fixtures: one sufficient reference and same-family separate review pass; empty JSON, unreadable images, one stale viewport, changed references, edited verdicts and missing review fail. Model calls are stubbed; no application visual-quality claim.
- **Visual Contract:** Not applicable; changes to shared instructions and evidence tooling only.
- **Reopen Conditions:** taste counters block a justified direction, reference evidence can be fabricated by empty files, or unavailable review is reported as passed.
- **Non-Scope:** application UI, model/provider configuration, secrets, deployment, commit/push; existing dirty memory remains untouched.
- **Escalation Conditions:** a fix requires changing runtime permissions or owner quality invariants.

