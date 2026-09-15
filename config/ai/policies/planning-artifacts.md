# Planning Artifacts — Which Document, Where

Canonical owner of the planning-document resolution order and the
pre-development staging contract. Referenced from the shared core
(`config/ai/CORE.md`) and applied by `prd-taskbreaker`, `development-spec-suite`,
`adr-record`, `development-kit`, and `project-init`. Moved verbatim in substance
from the former always-loaded `AGENTS.md` on 2026-09-15 (TASK-084).

## Which document system — three producers, one order

Three things can produce a "PRD" and two can produce an "architecture" document.
Resolve in this order and do not create a rival document beside an existing one:

1. **The repository already has it.** Extend the existing file. A second
   `PRD.md` under a different name is a split source of truth.
2. **A feature inside an existing repo** → skill `prd-taskbreaker` → root
   `PRD.md` + `TASKS.md`. This is the default and covers most work.
3. **A new product or system spanning several specification domains** — data
   model, tenant isolation, IAM, billing, compliance, SLA — → skill
   `development-spec-suite` and its numbered pack. Reach for it because the
   domains genuinely apply, not because the project feels large.
4. **`config/templates/`** produces neither. It is the delivery-contract scaffold
   `project-init` renders into a repo; its `PRD.md` is a placeholder for (2), or
   an entrypoint/link to `docs/spec/02-PRD.md` when a suite pack (3) is active —
   never a competing PRD. Its `ARCHITECTURE.md` records the shape actually built,
   not the product specification: when both exist, `04-SYSTEM-ARCHITECTURE.md` is
   the design and `ARCHITECTURE.md` is the record, and the record wins on what
   the code does. Root `TASKS.md` stays the sole canonical execution queue in
   every case, standalone or suite — it is never duplicated beside `02-PRD.md`.

## Pre-development staging and repository authority

Before `~/Projects/<slug>/` exists, every accepted planning artifact — standalone
`PRD.md`/`PLAN.md`/`TASKS.md`, `docs/adr/ADR-NNNN-<slug>.md`, or a
`development-spec-suite` pack (detected by `CONTEXT-RECORD.md`) — is drafted
under `~/Documents/work/prd/<slug>/`. This staging is mandatory: no skill or agent
writes a planning artifact directly into a project directory that does not exist
yet, and the staged copy is never authoritative on its own.

Coding starts only after explicit development authorization.
`project-init --from-docs ~/Documents/work/prd/<slug>/` — combined with
`--stack <profile>` for a new project or `--repo <path> --stack
existing-repository` for one that already exists — copies the accepted staged
artifacts into `~/Projects/<slug>/`: standalone files land at the project root and
`docs/adr/`; a suite pack lands under `docs/spec/`. The source stays in place as
a retained, non-authoritative snapshot; a divergent existing destination file
fails the copy instead of being silently overwritten, and an identical
destination file is a safe no-op. From that point the repository copy is
canonical; never re-consult the `~/Documents/` copy once promotion has happened.

Once the repository exists, committed `PRD.md` + `TASKS.md` (+ `PLAN.md`,
`docs/adr/`, `docs/spec/`) live at the project root so they are versioned with the
code.
