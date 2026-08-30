# External Skill Ecosystem Adoption

Verified: 2026-08-30. Recheck upstream before relying on CLI syntax or current
package contents. Adopt transferable contracts, not vendor identity or runtime
configuration.

| Upstream | Useful contract | Local adoption | Deliberate non-adoption |
|---|---|---|---|
| [Anthropic Claude Code frontend-design](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md) | Ground a visual direction in the subject, audience, job, materials, and a deliberate memorable choice. | `design-taste` requires subject-derived reference research, a clear direction, and an anti-template signature. | “Bold” or “unforgettable” is not universal; operator UI, accessibility, storefront tasks, and direct-response constraints can require restraint. |
| [Anthropic Claude Code feature-dev](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev) | Explore the repository, clarify material ambiguity, compare architecture, implement, and review in phases. | `prd-taskbreaker` and `full-stack-development` use repository-first discovery, decision gates, implementation sequencing, and review/evidence. | Vendor agents and automatic delegation are not copied; each runtime owns orchestration and local approval policy. |
| [Anthropic skill-development](https://github.com/anthropics/claude-code/blob/main/plugins/plugin-dev/skills/skill-development/SKILL.md) | Strong trigger descriptions, progressive disclosure, reusable scripts/references/assets, and validation. | Canonical skills stay under `skills/local/<name>/`, with focused owners and deterministic scripts where repeated reliability matters. | Claude plugin-only manifests, agents, and settings do not become shared dotfiles runtime configuration. |
| [shadcn official skill](https://github.com/shadcn-ui/ui/tree/main/skills/shadcn) | Resolve project context, query current docs, inspect registry items, and compose copied source. | `shadcn-ui` requires `components.json`, `shadcn info`, current docs/view/dry-run, accepted UX/design contracts, and minimal component selection. | Registry blocks do not choose IA, workflow, brand, or visual direction; throwaway package runners are not QA evidence. |
| [OpenAI skill-creator](https://github.com/openai/skills/blob/main/skills/.system/skill-creator/SKILL.md) | Concise metadata, `SKILL.md`, and optional scripts/references/assets. | Same canonical portable skill package is shared across supported CLIs. | OpenAI-specific UI metadata is optional and does not become methodology truth. |
| [Kimi Code Agent Skills](https://github.com/MoonshotAI/kimi-code/blob/main/docs/en/customization/skills.md) | Layered skill discovery and explicit Mermaid/D2 flow decision loops. | The standard skill keeps explicit phases and gates; diagrams may document BEGIN/decision/revision/END behavior. | `type: flow`, Kimi-only arguments, model routing, and runtime paths are not placed in canonical cross-CLI skills because they change activation semantics elsewhere. |
| [Everything Claude Code (ECC)](https://github.com/affaan-m/ECC) | Distinguish new capability scenarios from regression scenarios, define expected behavior before editing, and prefer deterministic graders over model or human judgment. | `development-kit` uses the local [skill evaluation contract](skill-evaluation.md) for skill-system changes; repository checks and delivery evidence remain authoritative. | Do not install the stale [WorldFlowAI snapshot](https://github.com/worldflowai/everything-claude-code) or ECC wholesale. Universal coverage targets, package-runner commands, vendor agents/hooks, model routing, MCP bundles, memory runtimes, and `.claude/evals/` would conflict with repository scripts, approval gates, canonical artifacts, and runtime-native ownership. Reliability metrics require repeated controlled trials, not labels attached to one run. |

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
