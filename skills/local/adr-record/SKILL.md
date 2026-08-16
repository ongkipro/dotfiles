---
name: adr-record
description: 'Create a structured Architecture Decision Record (ADR) for technical, architecture, stack, and consequence decisions. Triggers: ''buat ADR'', ''architecture decision record'', ''adr-record'', ''adr'', ''write adr'', ''record decision''.'
---

# Architecture Decision Record (ADR)

Record an important architecture decision with its context, status, alternatives, and consequences. Artifacts are English unless the target repository explicitly requires another documentation language.

## Ownership and handoffs

`adr-record` owns full standalone ADR documents and the canonical filename convention. It does not own a project-wide PRD/TASKS workflow or a multi-document specification pack.

- Use `prd-taskbreaker` for PRD/PLAN/TASKS. Its ADR-lite block is enough for a small, local decision; hand a costly-to-reverse decision to this skill for a full ADR.
- In a `development-spec-suite` pack, Technical Design owns the `ADR-*` index row and traceability link. This skill writes the referenced full ADR without creating a second decision register.
- Use `volumx-writer` only to rewrite, translate, or humanize an existing ADR without changing its decision.

## Workflow

1. **Locate the scope.** If `~/Projects/<project>/` already exists, read its project instructions and existing decision records, and use its established ADR directory or `docs/adr/`. If it does not exist yet, use the `~/Documents/work/prd/<project>/` staging directory instead — see Storage.
2. **Allocate the next ID.** Scan `docs/adr/` and `adr/` (or the `~/Documents/work/prd/<project>/` staging directory before the repository exists) for existing canonical `ADR-[0-9]+-*.md` files and legacy `[0-9]+-*.md` files. Parse the numeric prefixes, take the highest ID, add one, and left-pad to four digits. Start at `0001` when no ADR exists. Never reuse an ID, including a rejected or superseded one.
3. **Clarify the decision.** Capture the problem, decision drivers, viable alternatives, and affected components.
4. **Write the ADR.** Use `ADR-NNNN-<slug>.md`, for example `ADR-0007-d1-drizzle-orm.md`, and the template below.
5. **Update supersession links.** When replacing an accepted decision, mark the old ADR `Superseded by ADR-NNNN` and link the new ADR back to it. Preserve both files.

If concurrent work could allocate the same number, re-scan immediately before writing. Do not guess an ID from memory.

## Canonical ADR format

```markdown
# ADR-NNNN: [Decision title]

- **Status:** [Proposed | Accepted | Rejected | Superseded by ADR-NNNN]
- **Date:** [YYYY-MM-DD]
- **Author:** [Author name]
- **Deciders:** [Decision makers]
- **Supersedes:** [ADR-NNNN | None]

## 1. Context
Explain the technical problem or business need.
- What is constrained today?
- Which decision drivers and constraints matter?
- Which viable alternatives were considered?

## 2. Decision
State the selected technical or architecture decision explicitly.
- Why was this option selected over the alternatives?
- Which components or modules are affected?

## 3. Consequences
Describe the expected effects.
- **Positive:** Benefits and enabled capabilities.
- **Negative:** Trade-offs, risks, technical debt, or new dependencies.
- **Neutral:** Operational facts that remain important.
```

## Storage

- Default: the repository's existing ADR directory, otherwise `docs/adr/`.
- Before `~/Projects/<project>/` exists: `~/Documents/work/prd/<project>/ADR-NNNN-<slug>.md` is the mandatory staging location for an early planning artifact — never treat it as authoritative on its own. Once development is explicitly authorized, `project-init --from-docs ~/Documents/work/prd/<project>/` copies it into `docs/adr/ADR-NNNN-<slug>.md` in the repository, without changing its ID, without deleting the staged copy, and without overwriting a divergent existing file. The repository copy is canonical from that point; the Documents copy remains a non-authoritative snapshot.
