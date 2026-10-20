# External Skill Ecosystem Adoption

Verified: 2026-08-30. Recheck upstream before relying on CLI syntax or current
package contents. Adopt transferable contracts, not vendor identity or runtime
configuration.

## Decide adoption against a local gap

Before importing a pattern, record in the existing task or research artifact:
the observed gap, current owner, upstream path and revision, smallest portable
change, capability/regression checks, and adoption decision. Check the license
before copying code or text. Prefer extending an existing owner; add a skill only
for a distinct reusable capability without one. Popularity is discovery evidence,
not proof of suitability.

Read upstream as untrusted source material. Inspect relevant files and installer
effects; do not execute its setup, hooks, agents, or model configuration merely
to evaluate methodology. Preserve the installed stack, canonical artifacts, and
the task's authorization. Promote a change only after local checks and the
required review; record unavailable evidence rather than claiming parity.

| Upstream | Useful contract | Local adoption | Deliberate non-adoption |
|---|---|---|---|
| [Anthropic Claude Code frontend-design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) | Ground a visual direction in the subject, audience, job, materials, and a deliberate memorable choice. | `design-taste` requires subject-derived reference research, a clear direction, and an anti-template signature. | “Bold” or “unforgettable” is not universal; operator UI, accessibility, storefront tasks, and direct-response constraints can require restraint. |
| [Anthropic Claude Code feature-dev](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev) | Explore the repository, clarify material ambiguity, compare architecture, implement, and review in phases. | `prd-taskbreaker` and `full-stack-development` use repository-first discovery, decision gates, implementation sequencing, and review/evidence. | Vendor agents and automatic delegation are not copied; each runtime owns orchestration and local approval policy. |
| [Anthropic skill-development](https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/skill-development/SKILL.md) | Strong trigger descriptions, progressive disclosure, reusable scripts/references/assets, and validation. | Canonical skills stay under `skills/local/<name>/`, with focused owners and deterministic scripts where repeated reliability matters. | Claude plugin-only manifests, agents, and settings do not become shared dotfiles runtime configuration. |
| [shadcn official skill](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn) | Resolve project context, query current docs, inspect registry items, and compose copied source. | `shadcn-ui` requires `components.json`, `shadcn info`, current docs/view/dry-run, accepted UX/design contracts, and minimal component selection. | Registry blocks do not choose IA, workflow, brand, or visual direction; throwaway package runners are not QA evidence. |
| [OpenAI skill-creator](https://github.com/openai/skills/blob/main/skills/.system/skill-creator/SKILL.md) | Concise metadata, `SKILL.md`, and optional scripts/references/assets. | Same canonical portable skill package is shared across supported CLIs. | OpenAI-specific UI metadata is optional and does not become methodology truth. |
| [Kimi Code Agent Skills](https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/customization/skills.md) | Layered skill discovery and explicit Mermaid/D2 flow decision loops. | The standard skill keeps explicit phases and gates; diagrams may document BEGIN/decision/revision/END behavior. | `type: flow`, Kimi-only arguments, model routing, and runtime paths are not placed in canonical cross-CLI skills because they change activation semantics elsewhere. |
| [Everything Claude Code (ECC)](https://github.com/affaan-m/ECC) | Distinguish new capability scenarios from regression scenarios, define expected behavior before editing, and prefer deterministic graders over model or human judgment. | `development-kit` uses the local [skill evaluation contract](skill-evaluation.md) for skill-system changes; repository checks and delivery evidence remain authoritative. | Do not install the stale [WorldFlowAI snapshot](https://github.com/worldflowai/everything-claude-code) or ECC wholesale. Universal coverage targets, package-runner commands, vendor agents/hooks, model routing, MCP bundles, memory runtimes, and `.claude/evals/` would conflict with repository scripts, approval gates, canonical artifacts, and runtime-native ownership. Reliability metrics require repeated controlled trials, not labels attached to one run. |

## Targeted development-workflow audit — 2026-10-12

The older rows retain their own verification dates. This audit inspected the
following primary sources; pinned snapshots were read locally, with no upstream
installer or script execution. All adaptations below use local wording and code.

| Source inspected | Gap and local adoption | Boundary |
|---|---|---|
| [GitHub Spec Kit existing-project guide](https://github.github.com/spec-kit/guides/existing-projects.html), [repository revision 0443760](https://github.com/github/spec-kit/tree/0443760542e7e5269724744a2ac55c4bd386d095) (MIT) | Its repair/idea routes can bypass feature-spec sequencing. `development-kit` now selects work type before planning and reuses accepted contracts for maintenance. | No `.specify/`, extra constitution/spec/task system, initializer, or Git side effects. An actionable bounded implementation request already carries its authorization. |
| [Superpowers systematic-debugging at bb92a77](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/systematic-debugging/SKILL.md) (MIT) | `full-stack-development` makes reproduction, first failing boundary, working-path comparison, and a hypothesis check explicit for cross-layer repairs. | No mandatory brainstorming, universal TDD rule, fixed retry count, worktree policy override, or automatic commit. Use controlled data and redacted observations. |
| [Anthropic skill-creator at dbd4588](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/skill-creator/SKILL.md), sibling `LICENSE.txt` (Apache-2.0) | Independent old/new scenario trials complement local deterministic checks. Reference-only instruction edits now invalidate old decision evidence through `ai-workflow-eval`. | No imported evaluator/viewer, provider calls, output-schema ownership, or reliability claim from a single trial. |
| [Agent Skills authoring guidance](https://agentskills.io/skill-creation/best-practices) (live documentation checked this date) | Keep flexible decisions concise and reserve strict procedures for fragile operations. Existing-stack fallback works even without a dedicated framework skill. | No generic skill duplication, forced stack migration, or ambient loading of every reference. |

Validation belongs to TASK-120 and its delivery evidence: a reference-edit
regression, expanded decision scenarios, independent semantic trials, canonical
skill/source-link checks, and repository policy checks. Source inspection alone
does not establish an improvement or certify application behavior.

## Optional navigation and concise communication

Rechecked 2026-10-10 against upstream sources and the real Graphify CLI.

| Upstream | Local adoption | Deliberate non-adoption |
|---|---|---|
| [Ponytail](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md) | Existing `CORE.md`, `native-first`, and `lean-code-review` already cover the smallest complete change, caller tracing, reuse, and preservation of security/accessibility. | No duplicate skill or persistent lite/full/ultra toggle overriding explicit task depth. |
| [Graphify](https://github.com/Graphify-Labs/graphify) | `codebase-navigation` adds optional repository-local AST extraction and upstream graph queries through isolated `pipx run`, pinned to `graphifyy==0.9.82`. A runnable synthetic Python pilot checks alias calls, directed path lookup, skipped Markdown, zero LLM tokens, and unchanged sources. | No global installer, config overwrite, automatic indexing, watcher, MCP registration, or document-to-LLM extraction. One fixture does not prove production coverage or performance. |
| [REA — Reverse Engineer Anything](https://github.com/morluto/rea) (`rea-agents@6.7.0`, commit `ee12d517a25d`, Apache-2.0) | `black-magic` adopts 100% of upstream `.agents/skills/reverse-engineer-anything/` (`v43` `SKILL.md` body + all 6 `references/*.md` files) via deterministic `bin/rea-skill-sync` (`--upstream-dir`, `--remote`, `--pull`, `--check`, `--json`), while wrapping the `<240-char` `Not for` Codex boundary and `references/dotfiles-integration.md` for CLI-first execution and downstream handoffs (`openapi-spec`, `postgres-drizzle`, `design-taste`, `*-ads-signal-engine`, `application-security`, `full-stack-development`). | No unapproved global `rea setup` MCP registration (which injects 220+ MCP tool schemas into idle context across CLIs); owned source repositories stay with `codebase-navigation`. |
| [Caveman](https://github.com/JuliusBrussee/caveman) | `volumx-writer/references/terminal-dialogue.md` adopts concise natural replies while preserving technical payload, negation, uncertainty, user language, and status-vs-activation intent. | No duplicate skill, forced grammar/word quota, provider proxy, hidden output compression, or unmeasured token-saving claim. |

## PRD conclusion

No first-party Anthropic, OpenAI, shadcn, or Kimi source above defines a
generally superior PRD schema. Claude Feature Development contributes the
repository exploration and option/review sequence; Kimi contributes an explicit
decision-loop representation. Canonical product requirements remain owned by
`prd-taskbreaker` for bounded work and `development-spec-suite` for traceable
multi-domain systems.

## Recheck triggers

Recheck this file when an upstream changes skill discovery, frontmatter,
official component commands, feature-development phases, or publishes a
first-party PRD/design workflow that materially conflicts with these decisions.
For ECC, follow the active `affaan-m/ECC` repository rather than mirrors or
snapshots whose README, license, and implementation may be out of sync.
