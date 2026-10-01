---
name: adr-record
description: 'Create, supersede, or deprecate a structured Architecture Decision Record (ADR) for costly-to-reverse technical, architecture, and stack decisions. Not for PRD/TASKS (prd-taskbreaker), small local choices, or rewording an ADR (volumx-writer). Triggers: ''buat ADR'', ''architecture decision record'', ''adr-record'', ''adr'', ''write adr'', ''record decision''.'
---

# Architecture Decision Record (ADR)

Record an important architecture decision with its context, status, alternatives, and consequences. Artifacts are English unless the target repository explicitly requires another documentation language.

## Ownership and handoffs

`adr-record` owns full standalone ADR documents and the canonical filename convention. It does not own a project-wide PRD/TASKS workflow or a multi-document specification pack.

- Use `prd-taskbreaker` for PRD/PLAN/TASKS. Its ADR-lite block is enough for a small, local decision; hand a costly-to-reverse decision to this skill for a full ADR.
- Root `DECISIONS.md` is the repository's only decision index; each ADR gets one row there linking its file. In a `development-spec-suite` pack, Technical Design also declares the same `ADR-NNNN` as the pack's traceability link, never a second register or number. Rule: `~/.config/ai/policies/planning-artifacts.md` (Decision records).
- Use `volumx-writer` only to rewrite, translate, or humanize an existing ADR without changing its decision.

## When to write one

Write a full ADR when a decision is architecturally significant: it adds a dependency or platform, sets a pattern other code must follow (data access, errors, API conventions, auth), is hard to reverse once code depends on it, has at least two real alternatives with non-obvious trade-offs, or contradicts an accepted ADR. One ADR records one decision.

Skip it for routine choices inside an established pattern, bug fixes, style already enforced by linters, or a decision an existing ADR already covers. While coding, if you hit one of the triggers above, stop and propose the ADR to the user before continuing; if they decline, leave a short `why` comment instead. (Trigger list adapted from vercel/ai `adr-skill` and adr.github.io's "architecturally significant" definition.)

## Workflow

1. **Locate the scope.** If `~/Projects/<project>/` already exists, read its project instructions and existing decision records, and use its established ADR directory or `docs/adr/`. If it does not exist yet, use the `~/Documents/work/prd/<project>/` staging directory instead — see Storage.
2. **Allocate the next ID.** Scan `docs/adr/` and `adr/` (or the `~/Documents/work/prd/<project>/` staging directory before the repository exists) for existing canonical `ADR-[0-9]+-*.md` files and legacy `[0-9]+-*.md` files. Parse the numeric prefixes, take the highest ID, add one, and left-pad to four digits. Start at `0001` when no ADR exists. Never reuse an ID, including a rejected or superseded one.
3. **Clarify the decision.** Read related ADRs and the affected code first, then capture the problem, why now, decision drivers, at least two considered options, the user's preferred option, non-goals, affected components, and how compliance will be confirmed. Ask one question at a time for gaps; never fill a section by guessing. Before drafting, show a short intent summary (title, drivers, options, chosen option, confirmation) and get it confirmed.
4. **Write the ADR.** Use `ADR-NNNN-<slug>.md`, for example `ADR-0007-d1-drizzle-orm.md`, and the template below.
5. **Index it.** Add or update the `DECISIONS.md` row (ID = linked `ADR-NNNN`, current status). In a suite pack, add the matching Technical Design `ADR-NNNN` row.
6. **Update supersession links.** When replacing an accepted decision, mark the old ADR `Superseded by ADR-NNNN` and link the new ADR back to it. Preserve both files. Use `Deprecated` when a decision no longer applies and nothing replaces it.

An `Accepted` ADR is immutable in substance: change only its status line and supersession links, or append a dated note under More Information. A changed decision is a new ADR that supersedes the old one. A `Proposed` ADR may be edited freely until accepted.

The number is provisional until the ADR merges into the default branch, because parallel branches each see the same "highest + 1". Before merge, rebase onto the default branch, re-scan, and if the number was taken, renumber the file, title, `DECISIONS.md` row, and every reference. The merged tree must have no duplicate number, legacy files included: `ls docs/adr adr 2>/dev/null | grep -oE '^(ADR-)?[0-9]+' | sed 's/^ADR-//; s/^0*//' | sort | uniq -d` prints nothing. Do not guess an ID from memory.

## Canonical ADR format

```markdown
# ADR-NNNN: [Decision title]

- **Status:** [Proposed | Accepted | Rejected | Deprecated | Superseded by ADR-NNNN]
- **Date:** [YYYY-MM-DD]
- **Author:** [Author name]
- **Deciders:** [Decision makers]
- **Supersedes:** [ADR-NNNN | None]
- **Consulted / Informed:** [Optional: experts consulted; people kept informed]

## 1. Context
Explain the technical problem or business need and why it must be decided now.
- What is constrained today?
- **Decision drivers:** the forces and constraints that rank the options.
- **Non-goals:** what this decision deliberately does not address.

## 2. Considered Options
- **Option A — [name]:** Good, because …; Bad, because …
- **Option B — [name]:** Good, because …; Bad, because …

## 3. Decision
Chosen option: "[name]", because [the drivers it satisfies that the others do not].
- Which components or modules are affected?

## 4. Consequences
- **Positive:** Benefits and enabled capabilities.
- **Negative:** Trade-offs, risks, technical debt, or new dependencies.
- **Neutral:** Operational facts that remain important.

## 5. Confirmation
How implementation and ongoing compliance are checked: a test, lint/architecture rule, review checklist item, or metric. Name the concrete check.

## 6. More Information
Optional: links to issues, specs, benchmarks; when to revisit this decision.
```

The headings map to MADR 4.0.0 (Context and Problem Statement, Decision Drivers, Considered Options, Decision Outcome, Consequences, Confirmation, Pros and Cons of the Options, More Information). When the repository already uses another ADR layout (Nygard's Status/Context/Decision/Consequences, plain MADR, or adr-tools), keep its headings, numbering, and directory instead of imposing this one. Sections 2, 5, and 6 may be dropped for a small decision; Context, Decision, and Consequences may not.

## Storage

- Default: the repository's existing ADR directory, otherwise `docs/adr/`.
- Canonical staging contract: `~/.config/ai/policies/planning-artifacts.md`. Before `~/Projects/<project>/` exists: `~/Documents/work/prd/<project>/ADR-NNNN-<slug>.md` is the mandatory staging location for an early planning artifact — never treat it as authoritative on its own. Once development is explicitly authorized, `project-init --from-docs ~/Documents/work/prd/<project>/` copies it into `docs/adr/ADR-NNNN-<slug>.md` in the repository, without changing its ID, without deleting the staged copy, and without overwriting a divergent existing file. The repository copy is canonical from that point; the Documents copy remains a non-authoritative snapshot.

## Sources (accessed 2026-10-02)

- MADR 4.0.0 (latest release, 2024-09-17) template: <https://github.com/adr/madr/blob/4.0.0/template/adr-template.md>
- ADR definitions (AD, ASR, ADR): <https://adr.github.io/>
- ADR immutability and good-ADR traits ("Don't alter existing information in an ADR"): <https://github.com/joelparkerhenderson/architecture-decision-record>
- When-to-write triggers and intent-summary gate, paraphrased: vercel/ai `skills/adr-skill/SKILL.md` <https://github.com/vercel/ai/blob/main/skills/adr-skill/SKILL.md>; match-existing-convention rule: addyosmani/agent-skills `documentation-and-adrs` <https://github.com/addyosmani/agent-skills/blob/main/skills/documentation-and-adrs/SKILL.md>
