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

## Watch upstream drift without auto-syncing

Every skill that learns from an upstream repository declares it in its own
directory:

- **Vendored or forked skills** use `.source` and `.local-fork` (owned by
  `_refresh-vendored.sh`).
- **Homegrown skills** use `.upstream` (`watch: <owner/repo> [path]`,
  `verified: YYYY-MM-DD`, `note: ...`). `.upstream` is watch-only and never
  fetches or overwrites skill files.

Run `skill-upstream` (or `skill-upstream --skill <name>`, `skill-upstream --list`
offline) to inspect commits touching watched paths since each skill's `verified`
date. Combine upstream drift with deduplicated usage and methodology evidence from
`ai-skill-evolution` before proposing any skill edit.

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

Rechecked 2026-10-10 against upstream sources and the real Graphify CLI; Graphify row rechecked 2026-11-16 against `graphifyy` 0.9.111; REA row rechecked 2026-10-30 against rea-agents 6.8.0 and upstream main c0c39022.

| Upstream | Local adoption | Deliberate non-adoption |
|---|---|---|
| [Ponytail](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md) | Existing `CORE.md`, `native-first`, and `lean-code-review` already cover the smallest complete change, caller tracing, reuse, and preservation of security/accessibility. | No duplicate skill or persistent lite/full/ultra toggle overriding explicit task depth. |
| [Graphify](https://github.com/Graphify-Labs/graphify) | `codebase-navigation` adds optional repository-local AST extraction and upstream graph queries through isolated `pipx run`, pinned to `graphifyy==0.9.111` (re-pinned from 0.9.82 on 2026-11-16). A runnable synthetic Python pilot checks alias calls, directed path lookup, skipped Markdown, YAML extracted as code, exit 4 for a missing symbol, zero LLM tokens, and unchanged sources. | No global installer, config overwrite, automatic indexing, watcher, MCP registration, or document-to-LLM extraction. One fixture does not prove production coverage or performance. |
| [REA — Reverse Engineer Anything](https://github.com/morluto/rea) (`rea-agents@6.8.0`, commit `c0c3902207d6`, MIT) | `black-magic` adopts 100% of upstream `.agents/skills/reverse-engineer-anything/` (`v55` `SKILL.md` body + all 7 `references/*.md` files, including `environments.md` for AgentEnv bundles) via deterministic `bin/rea-skill-sync` (`--upstream-dir`, `--remote`, `--pull`, `--check`, `--json`), while wrapping the `<240-char` `Not for` Codex boundary and `references/dotfiles-integration.md` for CLI-first execution and downstream handoffs (`openapi-spec`, `postgres-drizzle`, `design-taste`, `*-ads-signal-engine`, `application-security`, `full-stack-development`). | No unapproved global `rea setup` MCP registration (which injects 220+ MCP tool schemas into idle context across CLIs); owned source repositories stay with `codebase-navigation`. |
| [Caveman](https://github.com/JuliusBrussee/caveman) | `writer/references/terminal-dialogue.md` adopts concise natural replies while preserving technical payload, negation, uncertainty, user language, and status-vs-activation intent. | No duplicate skill, forced grammar/word quota, provider proxy, hidden output compression, or unmeasured token-saving claim. |

## Communication and agent-writing audit — 2026-11-15

Inspected `mattpocock/skills` at commit `5863806dd4e15c63174bee4e7515a4256792ecfa`
(2026-11-12, MIT), cloned read-only; no installer, plugin, or script was run.
Adaptations use local wording.

| Upstream skill | Local adoption | Deliberate non-adoption |
|---|---|---|
| [`writing-for-agents`](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/productivity/writing-for-agents/SKILL.md) | `writer/references/prompt-writing.md` gains the completion-criterion, positive-target, no-op, single-source, and pointer-wording levers. | No separate skill; "leading words" and the two-loads vocabulary are not adopted as house terms. |
| [`wait-what`](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/productivity/wait-what/SKILL.md) | `writer/references/terminal-dialogue.md` re-pitches a message that did not land, in plain Indonesian with the missing context. | No slash command; no ASD-STE100 requirement (it is an English standard). |
| [`diagnosing-bugs`](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/diagnosing-bugs/SKILL.md) | `full-stack-development` requires a run, repeatable, fast failing command before theorizing, a minimized reproduction, and prefix-tagged debug output. | No second debugging skill, no human-in-the-loop script template, no mandatory 3-5 hypothesis count (`chain-of-thought` already forbids inventing branches). |
| [`tdd`](https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/tdd/SKILL.md) | `testing-engineering` anti-patterns add the tautological expected value and bulk tests before implementation. | No mandatory test-first loop or seam confirmation with the user on every task; CORE's "one runnable check for non-trivial logic" stays the rule. |
| `grilling`, `grill-me`, `grill-with-docs` | None. CORE asks only when ambiguity changes target, scope, or authorization, and the owner has asked for fewer confirmation rounds. | A relentless interview conflicts with that rule. |
| `to-spec`, `to-tickets`, `implement`, `implement-spec`, `triage`, `wayfinder`, `setup-matt-pocock-skills` | None. `prd-taskbreaker`, `TASKS.md` contracts, and `delivery-ledger` own this flow. | An issue-tracker state machine would be a rival queue. |
| `handoff`, `retro`, `research`, `code-review`, `domain-modeling` | None new. `resume-brief`, `ai-learn`/`continuous-learning`, the `researcher` lane, `lean-code-review` plus cross-CLI review, and `adr-record` already own these. | Per-project `GLOSSARY.md` is a candidate for a project that asks for it, not a global convention. |

No measurement backs these adoptions yet; `ai-workflow-eval` cases
`foreign-text-in-output` and `english-terms-not-malay` are decision checks only.

## Scout audit — 2026-11-16

Three read-only research lanes (reports in `~/Documents/work/research/2026-11-16-scout-*.md`,
not tracked). Applied here only where the claim was checked locally.

| Upstream | Local adoption | Not adopted, or pending |
|---|---|---|
| [Graphify](https://github.com/Graphify-Labs/graphify) 0.9.111 (PyPI, 2026-11-15) | `codebase-navigation` re-pinned from 0.9.82; pilot passed; verified locally: `.yaml`/`.yml` extracted under `--code-only`, exit 4 for a missing symbol, 0 LLM tokens, source untouched. | Hooks, agent installers, cloud features. |
| [Ponytail](https://github.com/DietrichGebert/ponytail) `96608e07` | None; CORE "Code discipline", `native-first` and `lean-code-review` cover it. | Mandatory risk footer on every reply, mode toggles. |
| [Superpowers](https://github.com/obra/superpowers) `22f0b46`, [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) `39b723c` (MIT) | `cross-cli` rule 4: pinned non-empty range, untracked files, contract without author rationale, lowered-check leads. | Mandatory test-first deletion, auto-commits, fixed coverage targets, confidence interviews. |
| [trailofbits/skills](https://github.com/trailofbits/skills) `149d7b2` (CC-BY-SA-4.0), [getsentry/skills](https://github.com/getsentry/skills) `a582c51` (Apache-2.0) | `github-actions/references/security-boundaries.md` "AI agent steps", local wording. | Named action inputs (unverified here); pending: untrusted-skill inspection checklist, property-based-testing selection. |
| Vendor skills: `vercel/next.js` skills, `vercel-labs/agent-skills`, `cloudflare/skills`, `neondatabase/agent-skills`, `planetscale/skills`, `better-auth/skills` | None yet. | Pending per owning skill; each claim names version-gated APIs that must be checked against the installed version first. `better-auth/skills` has no license: no text reuse. |
| Memory designs: `tigerless-labs/agent-memory`, `siimvene/memspec`, `0Mattias/bettermemory`, `xChuCx/agent-memory`, `okf-memory/okf-agent-memory` | None yet. | Pending as tool work: section routing, bilingual staleness, outcome receipts, inbox triage, two-tier recall. Daemons, transcript ingestion and autonomous consolidation are rejected. |

## Full-repository recheck — 2026-11-20

Ponytail `96608e07` (MIT), Graphify `340268a` (0.9.112) with claims re-checked
at the pinned 0.9.111 tag `2b28033`, and Caveman `a192894` (Apache-2.0 since
3.0.0) were cloned read-only into `~/Documents/work/research/upstream-2026-11-19/`
and their source, skills, evals, and tests were read, not only the READMEs. Nothing
was installed. Adaptations use local wording.

| Upstream | Local adoption | Deliberate non-adoption |
|---|---|---|
| Ponytail `skills/ponytail-debt`, `ponytail-review` | `lean-code-review`: shortcut ledger for `lazy:` markers with a `no-trigger` tag; a marker naming its ceiling is a decision, not a finding, unless the expected load crosses it. | Session mode toggles, statusline/hooks, the `/ponytail-gain` benchmark card, a separate audit skill. |
| Graphify `cli.py`, `detect.py`, `__main__.py`, `llm.py` | `codebase-navigation`: `GRAPHIFY_BACKEND=none` (extract ignores unknown flags), `GRAPHIFY_NO_AUTO_REFRESH`, `GRAPHIFY_NO_CTA`; `--exclude`; built-in sensitive-file filter and tracked-file caveat; exit 3 ambiguous / 4 missing; `affected` for change impact; incremental merge reuses saved settings; avoid `graphify update`. Pilot now asserts `affected`, `--exclude` (proven by a mutation), `.env` skip, and exit 3. Pin stays 0.9.111: 0.9.112 fixes Java/Go/Rust/JS/C/SQL extractors only. | HTML exports (CDN scripts), `--postgres`, `--cargo`, `ingest`, query log, `.graphifyrc`, cloud. |
| Caveman `skills/caveman/SKILL.md`, `evals/` | `writer/terminal-dialogue.md`: brevity exemptions (security, irreversible, ordered steps, confused reader, questions), comments as payload, pre-send check. `dialogue-evaluation.md`: plain-concise control arm, host isolation, self-tested `must_include`/`must_not_include` hard-fail patterns, implemented in `ai-workflow-eval` as per-case `replyChecks` (three cases; `check` rejects patterns that do not separate their examples; grading proven by a mutation). | `caveman-compress` (sends files to a provider, overwrites), ultra/mega modes, proxy/engine/middleware, cavecrew agents, profile registry and drift bot, unmeasured token claims. |

Also considered and not adopted: a per-runtime "tested version" pin with drift
warnings in `ai-doctor` (Caveman `agents/profiles/*.json`). Runtime versions
change weekly, so the warning would fire constantly while proving nothing about
context loading; the live-path verification table in `config/ai/README.md`
stays the record. A deterministic before/after invariant checker for
wording-only rewrites (`caveman-compress/scripts/validate.py`) waits until such a
rewrite has actually regressed; `writer/references/preservation.md` covers it by
hand.

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
