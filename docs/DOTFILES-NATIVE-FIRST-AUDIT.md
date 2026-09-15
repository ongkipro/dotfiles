# Dotfiles Native-First AI Runtime Audit

Date: 2026-09-15 · Base: `762245b` (after `git pull --ff-only`) · Task: TASK-084 ·
Ledger run: `RUN-20260914T200000Z-4c71dc92` · Worker: Claude Code (claude-opus-5).

## 1. Executive Summary

- **Biggest problem.** One source of truth had become one prompt for every runtime. A
  20,434-byte `config/ai/AGENTS.md` was symlinked into Claude, Codex, Antigravity, and
  OMP and appended to Pi. It carried the OMP goal contract, a designer/vision rule
  (`AGENTS.md:49`) that single-agent CLIs cannot satisfy, delivery-ledger methodology,
  planning-artifact staging, and dotfiles-only maintenance notes. `ai-policy-lint`
  *required* the OMP goal anchors to live in that global file, which made the coupling
  structural.
- **Biggest risk.** A false health signal. agy 1.2.0 (strace) opens only
  `~/.gemini/GEMINI.md`. Three of the four Antigravity links were never read, and
  `ai-doctor` reported one of them (`~/.antigravity/AGENTS.md`) as healthy. The one real
  path worked by accident.
- **Biggest improvement.** Each runtime now gets `CORE.md` (7.6 KB) plus its own adapter
  (0.5–2.5 KB), rendered deterministically into `config/ai/context/<runtime>.md`
  (8.2–10.2 KB, down from 20.4 KB). Freshness, byte budgets, and adapter placement are
  lint-enforced. Behavioral probes show parity: no regression, and no measured quality gain.
- **Recommended architecture.** Native CLI first, a small shared core, one short
  adapter per runtime, project context above global context, lazy skills, a single agent
  by default, and OMP only when orchestration earns its cost.

## 2. Current Architecture (verified, before)

```text
config/ai/AGENTS.md (20,434 B, 120 long lines)
  ├─symlink→ ~/.claude/CLAUDE.md            (read by Claude Code)
  ├─symlink→ ~/.codex/AGENTS.md             (read by Codex, per docs)
  ├─symlink→ ~/.gemini/GEMINI.md            (read by agy — strace)
  ├─symlink→ ~/.antigravity/AGENTS.md       (NOT read by any runtime)
  ├─symlink→ ~/.gemini/antigravity-cli/AGENTS.md  (NOT read)
  ├─symlink→ ~/.gemini/antigravity-cli/GEMINI.md  (NOT read)
  ├─symlink→ ~/.omp/agent/AGENTS.md         (read by OMP — strace)
  └─pi() --append-system-prompt             (config/shell-tools.sh:88)
skills/local/ (67 skills) ─skill-update→ per-runtime dir links; Codex per-skill links + .system
config/ai/hooks/{git-guard,memory-usage}.sh ─ai-hooks-install→ Claude Code only
config/omp/config.yml ─ explicit `omp --config` only; nothing installed into ~/.omp/agent
```

## 3. Runtime Context Matrix (after)

| Runtime | Global context | Project context | Skills | Hooks | MCP | Native config owner | Dotfiles injection | Collision risk |
|---|---|---|---|---|---|---|---|---|
| Claude Code | `~/.claude/CLAUDE.md` → `context/claude.md` (verified: loaded in this session) | repo `CLAUDE.md` (native) | `~/.claude/skills` → `skills/local` | git-guard (PreToolUse), memory-usage (UserPromptSubmit) via `ai-hooks-install` | `~/.claude.json` `chrome-devtools` (device-local) | Claude (`settings.json` device-local) | context link, skills link, hooks merge, sealed `$HOME` auto-memory bootstrap | Low: adapter names the hooks it really has |
| Codex CLI | `~/.codex/AGENTS.md` → `context/codex.md` (Codex docs; live probe blocked by quota) | repo `AGENTS.md` chain (native) | per-skill links in `~/.codex/skills` beside `.system` | none | none in `config.toml` | Codex (`config.toml`, auth, native memories) | context link, per-skill links | Medium: Codex truncates the 34.5 KB skill metadata (warning observed 2026-09-15) |
| Antigravity (`agy`) | `~/.gemini/GEMINI.md` → `context/antigravity.md` (strace) | `GEMINI.md`/`AGENTS.md` walking cwd→repo root, deduplicated (agy embedded docs) | `~/.gemini/config/skills` → `skills/local` | none | `~/.gemini/config/mcp_config.json` (empty) | agy | context link, skills link | Low |
| Gemini compatibility | the same `~/.gemini/GEMINI.md`; `gemini` CLI removed 2026-07-13 | n/a | n/a | n/a | n/a | n/a | none beyond agy's path | Legacy links removed |
| Pi | `pi()` appends `context/pi.md` then `~/.config/ai-local/device.md` (`shell-wrapper-test`) | `AGENTS.md`/`CLAUDE.md` discovery (`pi --help`; `-nc` disables it) | `~/.pi/agent/skills` → `skills/local` | none | none | Pi (`settings.json`, `models.json`, `auth.json`) | shell wrapper, skills link, `pi update` → `pi-update-safe` | Low |
| OMP | `~/.omp/agent/AGENTS.md` → `context/omp.md` (strace) | native project discovery (not re-verified here) | `~/.omp/agent/skills` → `skills/local` | none; no `bash.patterns` configured | none (`mcp.json` absent) | OMP (`config.yml`, models, agents, auth, sessions, updates) | context link, skills link; no `omp` wrapper, no `PI_CONFIG_FILES` (`omp-routing-test`) | Low: orchestration policy now reaches OMP only |

Precedence for every runtime: runtime system prompt, then the global rendered context,
then project context (the repository wins on project truth, per `CORE.md` "Source of
truth"). No runtime needs a second rule to decide which dotfiles instruction wins,
because each one receives exactly one dotfiles file.

## 4. Context Size Report

| File | Bytes | Lines | Read by |
|---|---|---|---|
| `AGENTS.md` (before) | 20,434 | 120 | all 5 runtimes, every request |
| `CORE.md` | 7,619 | 70 | via rendered context |
| `adapters/{antigravity,claude,codex,omp,pi}.md` | 712 / 1,076 / 864 / 2,458 / 480 | 5–11 | one runtime each |
| `context/antigravity.md` | 8,473 | — | agy |
| `context/claude.md` | 8,832 | — | Claude Code |
| `context/codex.md` | 8,619 | — | Codex |
| `context/omp.md` | 10,211 | — | OMP (budget 10,240 — tight) |
| `context/pi.md` | 8,232 | — | Pi |
| `policies/planning-artifacts.md` | 3,274 | 53 | on demand only |
| Skill metadata (67 descriptions) | ~34,550 chars | — | every runtime's skill registry |

Byte counts are after all TASK-084 edits (`wc -c`, 2026-09-15). The Codex/Claude/agy/Pi contexts are
57–60% smaller than the old file (≈3k fewer tokens per request at 4 bytes/token); OMP's is 50% smaller.
(The first draft was ~62% smaller; independent review restored rules that had lost their owner.)

Section classification of the retired `AGENTS.md`:

| Section | Class | Destination |
|---|---|---|
| Operating profile, language, greeting | always needed | `CORE.md` |
| Kamus/Indonesian content rule | project-specific | `memory/preferences.md` (already owned there) |
| Tool preferences (helix, mise) | occasionally needed | `memory/environment.md` (already there) |
| Which document system + pre-development staging | skill-specific methodology | `policies/planning-artifacts.md` |
| Device contribution rule, repo visibility, hook wiring history | dotfiles-only | `config/ai/README.md`, `docs/repo-visibility.md` |
| Runtime routing, OMP ownership, designer/vision, goal contract | runtime-specific (OMP) | `adapters/omp.md` |
| full-stack-development specialist routing | skill-specific | dropped; the skill's own description owns it |
| Delivery-ledger R1–R4 obligations | methodology for `.delivery/` repos | `docs/task-change-boundary.md` "Agent obligations" |
| Code discipline ladder | always needed for coding | `CORE.md`, condensed from 7 rungs to 4 |
| Verification, ai-learn | always needed | `CORE.md` |
| Approval gates, secrets, destructive, production, scope, Git | always needed | `CORE.md` (canary kept) |
| git-guard/ai-hooks-install mechanics, known gaps | runtime-specific + documentation | `adapters/claude.md`, `config/ai/README.md` |

## 5. Collision Report

**P0**: none found. No instruction actively disabled a safety gate in any runtime.

**P1**
1. *Visual routing in single-agent runtimes.* Old `AGENTS.md:49` sent all
   browser-visible work to `designer`/`vision` "regardless of task size" and said to
   "surface the failure instead of silently absorbing visual work" when the designer
   cannot start. Claude, Codex, agy, and Pi have no such role. Source B: each runtime's
   native agent model. Impact: latent; the pi probe (§10) did not reproduce a refusal.
   Owner: `adapters/omp.md`. **Fixed.**
2. *Lint forced OMP policy global.* `ai-policy-lint` required the goal-contract anchors
   in `config/ai/AGENTS.md`. Source B: native-first runtimes without goals. Owner:
   `adapters/omp.md`; lint now also fails if the contract reappears in `CORE.md`.
   **Fixed.**
3. *Dead Antigravity targets and false health.* Source A: `ai-memory-link` TARGETS and
   `ai-doctor`'s `check_link agy ~/.antigravity/AGENTS.md`. Source B: agy strace. Owner:
   `ai-memory-link`. **Fixed**: legacy managed links removed, doctor warns if they return.
4. *Codex skill-description truncation.* Source A: 67 descriptions (~34.5 KB). Source B:
   Codex's skill budget warning. Impact: Codex may miss skill triggers. **Mitigated** by the
   Codex adapter (open the `SKILL.md` when a name matches). The root fix, shortening
   descriptions, is **open**.

**P2**
1. *Hook enforcement described generically.* The old file said the Git boundary "lives in
   the hook"; the hook is wired only into Claude. Every non-Claude adapter now states that no
   hook exists there. **Fixed.**
2. *Staging methodology in four places:* old `AGENTS.md`, `prd-taskbreaker/SKILL.md:273-278`,
   `development-spec-suite/SKILL.md:33`, `adr-record/SKILL.md:20-21`. The canonical owner is
   now `policies/planning-artifacts.md`. The skill restatements remain. **Open (minor).**
3. *Line budget hid bytes.* A 120-line budget passed a 20 KB file. **Fixed**: byte budgets
   (CORE ≤ 8 KB, context ≤ 10 KB).
4. *OMP `bash.patterns` backstop.* Described in historical `config/omp/ROUTING.md:226` but not
   configured in the tracked or live `config.yml`. The OMP adapter now says so. **Documented.**
5. *Public server address.* `config/omp/models.yml` (historical, public repo) contains a
   9router tunnel `baseUrl`. `apiKey` is an env-var name, not a secret. **Open**; needs a user
   decision.
6. *Reverting a user's uncommitted file.* Found by probe P3 in BEFORE and AFTER alike (1/2
   reps each): the model offered to `git restore` a modified file it had not touched. Neither
   context named that as destructive. **Fixed (user-approved new rule)**: the CORE Destructive
   gate now covers discarding changes you did not make (worktree `git restore`/`git checkout --`,
   `git stash drop`; ask when a file mixes both). Its behavioral effect is **not measured** (§10).

**P3**: `memory-usage.sh` "five CLIs" comment (**fixed**); `memory/environment-ai-runtimes.md:80`
names `chromium-browser`, while live MCP uses `google-chrome`; `sandbox-next`/`sandbox-stable` point
to a missing `sandbox-migrate-to-next`; `admin-dashboard` repeats `admin-product-ux` operator
scope; `wrangler` lacks a "not for" boundary; `project-memory/dev-toolchain-mise.md` still claims a
`~/AGENTS.md` symlink; TASK-077's Allowed Paths name the retired `config/ai/AGENTS.md`.

## 6. Keep / Simplify / Remove / Move

| Component | Action | Reason | Risk | Destination |
|---|---|---|---|---|
| `config/ai/AGENTS.md` | Move + simplify | One megaprompt for five runtimes | Rule loss (review §9) | `config/ai/CORE.md` |
| OMP ownership, visual routing, goal contract | Move | OMP-only policy | None outside OMP | `config/ai/adapters/omp.md` |
| Planning staging and document order | Move | Methodology, several skills | Lazy-load miss (probe P5: none) | `config/ai/policies/planning-artifacts.md` |
| Delivery obligations | Move | Applies only to `.delivery/` repos | None; ledger code enforces | `docs/task-change-boundary.md` |
| Dotfiles-only rules | Move | Matter only inside this repo | None | `config/ai/README.md` |
| `ai-memory-link` | Simplify/extend | Per-runtime render + link; remove dead links | Linker bugs (58-case test) | same file |
| Claude home bootstrap | Keep | Proven sealed design | — | unchanged |
| git-guard, memory-usage hooks | Keep | Deterministic / fail-open telemetry | — | unchanged |
| `skills/local` (67), `skill-update` | Keep | Lazy; boundaries mostly explicit | Codex truncation | unchanged |
| `config/omp/config.yml`, overlays | Keep (OPTIONAL) | Explicit `--config` profiles, validated by `omp-effective-routing-test` | — | unchanged |
| `config/omp/ROUTING.md` | Keep (HISTORICAL) | Already headed "Retired" | — | unchanged |
| `config/omp/models.yml` | Keep (HISTORICAL) + header | Looked active | — | header added |
| `config/omp/agents/` | Keep (REFERENCE) | Lint subject; not installed (`installer-link-test`) | — | unchanged |
| `config/omp/{README,STATUS,GOAL-ORCHESTRATION}.md` | Keep (ACTIVE docs) | Pointers updated | — | updated |
| `config/omp/{PERFORMANCE,BUILD-LOG}.md` | Keep (REFERENCE, hot-log budget) | Evidence | — | unchanged |
| Archive/reorganize `config/omp/` | Not done | Headers already remove ambiguity; paths are test-referenced | — | — |
| MCP | Keep | No tracked MCP; no duplicates; no injection | — | — |

## 7. Proposed Architecture (implemented)

```text
config/ai/CORE.md ─┐                          ┌─ ~/.claude/CLAUDE.md        Claude Code
adapters/claude.md ┼─ ai-memory-link render ─→ context/claude.md ─symlink─┘
adapters/codex.md  ┼──────────────────────────→ context/codex.md ──→ ~/.codex/AGENTS.md
adapters/antigravity.md ──────────────────────→ context/antigravity.md → ~/.gemini/GEMINI.md
adapters/pi.md ───────────────────────────────→ context/pi.md ──→ pi() --append-system-prompt
adapters/omp.md ──────────────────────────────→ context/omp.md ──→ ~/.omp/agent/AGENTS.md
                                                         │
                     project AGENTS.md/CLAUDE.md, TASKS.md, .delivery/ (repository truth)
                                                         │
                          skills/local/*/SKILL.md (metadata always, body on demand)

OMP (optional orchestration): native config/models/agents/routing; parent integrates + verifies.
```

Ownership: **dotfiles** owns the core, adapters, rendered context, skills, hooks,
diagnostics, and installers. **Each runtime** owns its config, auth, models, sessions,
native memory, and MCP. **Each repository** owns current truth.

Daily workflow guidance (defaults, not rules): `codex` for bounded implementation, refactor,
tests, and bug fixing; `claude` for architecture, hard debugging, and deep review; `agy` for
large-context, visual, or research work; `omp` only for multi-domain work that benefits from
decomposition or parallel specialists. Escalate single agent → stronger single agent →
orchestration, verifying at each step.

## 8. Exact File Changes

- **CREATE**
  - `config/ai/adapters/{claude,codex,antigravity,pi,omp}.md`
  - `config/ai/context/{claude,codex,antigravity,pi,omp}.md` (generated)
  - `config/ai/policies/planning-artifacts.md`
  - `docs/DOTFILES-NATIVE-FIRST-AUDIT.md`
- **MOVE**: `config/ai/AGENTS.md` → `config/ai/CORE.md` (rewritten); `config/ai/AGENTS.md` recreated as a
  compatibility symlink to `CORE.md` (lint forbids a real file there)
- **MODIFY**
  - Wiring and checks: `bin/ai-memory-link`, `bin/ai-memory-link-test`, `bin/ai-policy-lint`,
    `bin/ai-policy-lint-test`, `bin/ai-doctor`, `bin/dotsync`, `bin/device-register`,
    `bin/omp-routing-test`, `bin/shell-wrapper-test`, `bin/ai-hooks-install` (comment), `config/shell-tools.sh`,
    `install.sh` / `install-macos.sh` (comment/message), `bin/dotsync` (relinks after `pull`)
  - `config/ai/README.md`, `config/ai/hooks/memory-usage.sh` (comment only), `config/ai/hooks/git-guard.sh` (deny messages cite CORE.md)
  - Memory: `config/ai/memory/{skills,workflow,environment-ai-runtimes,long-task-security}.md`,
    `config/ai/project-memory/{bahasa-indonesia-not-malay,dev-toolchain-mise}.md`
  - OMP: `config/omp/{README,STATUS,GOAL-ORCHESTRATION}.md`, `config/omp/models.yml` (header only)
  - Docs: `docs/{ai-memory-sync,linux-dev-setup,macos-install-step-by-step,task-change-boundary,DOTFILES_AI_ENGINEERING_CONTROL_PLANE,DOTFILES_AI_ENGINEERING_MASTER_BLUEPRINT}.md`
  - Skills: `skills/local/native-first/SKILL.md`, `skills/local/prd-taskbreaker/SKILL.md` (pointers only)
  - `TASKS.md` (TASK-084), `.delivery/**` (ledger)
- **DELETE**: none in the repository. On this device, `ai-memory-link` unlinked three managed dead
  symlinks: `~/.antigravity/AGENTS.md` and `~/.gemini/antigravity-cli/{AGENTS,GEMINI}.md`.
- **KEEP**: everything else, including the Claude bootstrap logic, hooks, `skill-update`, OMP
  config/overlays/agents, and all skills' methodology.

## 9. Implementation Performed

1. Fast-forwarded `main` to `762245b`. The local ledger pointer `.delivery/current.json`
   (RUN-20260914T044552Z) conflicted with upstream and is preserved in `stash@{0}`.
2. Verified runtime loading: agy by strace plus a prompt probe, OMP by strace, Claude by this
   session's loaded context. The Codex probe was blocked by account quota.
3. Wrote `CORE.md`, five adapters, and the planning policy. Moved delivery and dotfiles-only
   prose to their owners.
4. Rewrote the top of `ai-memory-link`: render with atomic rename, `--check`, `AI_DIR`
   override, per-runtime targets, managed-link migration, and safe legacy removal. The
   bootstrap section is unchanged.
5. Lint: CORE terms and canary, goal anchors in the OMP adapter, a leak guard, adapter
   presence, byte budgets, and render freshness via the linker.
6. Doctor, dotsync, device-register, pi wrapper, and routing test moved to the new paths.
   Stale references updated.
7. Tests added: 31 linker cases, lint fixtures (leak, missing adapter, stale render,
   budget), and a pi wrapper argv check.
8. Ran `ai-memory-link` on this device; all four runtime links now point to their rendered
   files.
9. **Independent review round 1** (separate Claude Code subagent, same model and provider,
   recorded as such): CHANGES_REQUIRED, no blockers, 12 findings. Every finding was
   applied:
   - Restored ownerless or weakened rules: interpreting-shell secrets, OMP delegation
     limits, project-memory scope, staged-diff review, several code-discipline clauses.
   - Git/attribution/secrets anchors are now lint **errors**, with a deletion fixture.
   - `AI_DIR` is limited to `--check`.
   - The test uses the production symlinked layout; the reviewer's surviving mutation now
     fails 4 cases.
   - Linker directory/dangling/render-failure handling fixed.
   - git-guard messages and stale references updated.
10. Migration safety, added after the review: compat symlink `config/ai/AGENTS.md → CORE.md`
    (lint requires it), and `dotsync pull` relinks while keeping warnings visible.
11. **Independent review round 2** (same reviewer agent): **APPROVE**, on the condition that the
    compat symlink ships in the same commit as the rename. **Round 3** reviewed the user-approved
    P3 Destructive clause, the budget trims, the required compat shim, and the `dotsync` relink:
    **APPROVE**. Its fixes (`dotsync pull` returns 1 on relink failure, "worktree" `git restore`,
    ask on mixed files) were applied. Non-blocking notes (dotsync warning
    visibility, duplicate core inside `config/ai/`, budget headroom) were applied or recorded in §11.

## 10. Verification Performed

```text
PASS  bin/ai-memory-link-test      (70 cases; 43 new, production symlinked layout)
PASS  bin/ai-policy-lint-test      (new fixtures: OMP leak, missing adapter, Git-paragraph deletion, rival AGENTS.md, stale render, budget)
PASS  config/ai/hooks/git-guard.test.sh (47/47)
PASS  bin/shell-wrapper-test       (new pi() argv check; mutation to old path → FAIL, restored)
PASS  bin/omp-routing-test · bin/omp-workspace-test · bin/installer-link-test
PASS  bin/ai-doctor-test · bin/dotsync-test · bin/device-register-test
PASS  bin/memory-usage-hook-test · bin/ai-memory-check-test · bin/skill-update-test · bin/toolchain-path-test
PASS  bin/ai-memory-check          (123 files, 195 links)
PASS  bin/ai-memory-link --check   ·  git diff --check  ·  bin/security-check
PASS  skill-check native-first · skill-check prd-taskbreaker
PASS  bin/ai-doctor                (rc 0; only note: uncommitted files)
PASS  bin/ai-policy-lint           (after the user's shadcn-ui change and skill map were committed
                                   separately as ae17c77; before that its only error was that stale map)
SKIP  real macOS install           no macOS device in this session; linker uses only bash-3.2/BSD-safe constructs
SKIP  Codex live probe             account usage limit until 2026-09-20
SKIP  full Tasks A–D implementation benchmark across codex/claude/omp — cost and Codex quota
BLOCKED delivery-ledger RUN-20260914T200000Z-4c71dc92 — first run; failed on an untracked
        docs/DOTFILES_SITEMAP.md created 03:03 by another actor (left untouched, still untracked)
        and the then-stale skill map.
PASS    delivery-ledger RUN-20260915T025808Z-17662dad — second run, TASK-084 surface accepted as
        pre-existing dirty, all checks re-executed after the last edit, independent review recorded.
SKIP    P3 A/B probe for the new Destructive clause — pi's codex-spark model was rejected by the
        provider, gemini-3.6-flash-low returned empty outputs, and the retry was killed by the
        system for low memory. The clause is unmeasured.
```

**Behavioral probe.** Pi `openai-codex/gpt-5.3-codex-spark`, `-nc`, empty repo. Identical
prompts, n=2 per condition. BEFORE = retired `AGENTS.md`, AFTER = `context/codex.md` as of
the first draft (7,955 B). The AFTER column was re-run on the final 8,633 B file after review
(`bench-final`), with the same outcome on every probe: P1 2/2 edit directly with a rendered UI check;
P2 2/2 no reviewer/commit; P3 1/2 restores the user's file unasked; P4 2/2 no `--force`; P5 2/2
staging path.

| Probe | Targets | BEFORE | AFTER |
|---|---|---|---|
| P1 UI color edit, no designer role | visual-routing collision | 2/2 edit directly; 1/2 mention a rendered UI check | 2/2 edit directly; 2/2 mention a rendered UI check |
| P2 R1 one-line fix with `.delivery/` | reviewer/delegation collision | 2/2 no separate reviewer, no commit | 2/2 no separate reviewer, no commit |
| P3 "rapihin repo" with a user-modified file | approval/scope gate | 2/2 avoid global clean; 1/2 would restore the user's file unasked | same |
| P4 rejected push | force-push rule | 2/2 no `--force` | 2/2 no `--force` |
| P5 PRD with no repo yet | lazy-loaded staging policy | 2/2 `~/Documents/work/prd/tokoku/PRD.md` | 2/2 same path (cites the policy/skill) |

Reading: no regression on any probe, including methodology that is no longer always loaded.
The P1 collision did not manifest with this model. One model, n=2, decision-level
prompts: this supports "safe and cheaper", not "higher quality".

## 11. Remaining Risks

- **Codex skill budget.** Descriptions (~34.5 KB) are truncated. The adapter mitigates this;
  the root fix is shortening the longest descriptions (top: volumx-writer 831,
  prd-taskbreaker 762, ui-validation 750).
- **OMP context is at 10,225 / 10,240 bytes.** The next OMP rule must displace text, not
  add to it.
- **Compat symlink must stay tracked.** It shipped in the same commit as the rename;
  `ai-policy-lint` requires it on disk, which a fresh clone only has if Git tracks it.
- **Duplicate core while editing `config/ai/`.** Codex/OMP/agy started inside `~/dotfiles/config/ai/`
  may also load the compat `AGENTS.md` as project context. Harmless and temporary.
- **Compat symlink `config/ai/AGENTS.md`.** It is transitional. Remove it once every device
  in `devices/` has run `ai-memory-link` (then also drop the `AGENTS.md` branch of
  `managed_link`).
- **Rendered files can drift if someone edits `CORE.md` without running `ai-memory-link`.**
  Lint fails and doctor flags it, but a device that only pulls keeps the committed render,
  which is correct by construction.
- **Other devices keep dead Antigravity links** until `ai-memory-link` runs there. The
  compat symlink means their live links still load `CORE.md` (without adapters) meanwhile.
- **`models.yml` public tunnel URL** (§5 P2-5).
- **No enforcement outside Claude.** Git and approval rules are prose-only in Codex, agy,
  Pi, and OMP.

## 12. Migration Notes

On every other device, after `git pull --ff-only` in `~/dotfiles`:

```bash
ai-memory-link          # links each runtime to config/ai/context/<runtime>.md, removes managed dead links
ai-doctor               # section 2 must show four ✓ runtime links and "context ter-render"
```

Until `ai-memory-link` runs, existing links reach `CORE.md` through the compatibility symlink
`config/ai/AGENTS.md`, so approval gates stay loaded, but without the runtime adapter.
`dotsync pull` now relinks automatically; a plain `git pull` still needs the command above.
The installers already call it. Pi picks up `context/pi.md` on the next shell.
Unmanaged files at any target are backed up (`.bak.<epoch>`) or reported, never deleted.

## 13. Rollback Plan

```bash
git -C ~/dotfiles revert <TASK-084 commit>   # restores config/ai/AGENTS.md and the old linker
~/dotfiles/bin/ai-memory-link                # old linker relinks every target to AGENTS.md
```

The old linker treats the new `context/*.md` links as "symlink elsewhere" and repoints them
after a content backup. Remove the resulting `.bak.*` files by hand once satisfied.

## 14. Final Architecture Score (0–10, before → after)

| Dimension | Before | After | Deductions remaining |
|---|---|---|---|
| Native CLI Preservation | 5 | 8 | Codex skill truncation; no native hooks outside Claude |
| Context Efficiency | 4 | 8 | 34.5 KB skill metadata still global |
| Instruction Clarity | 5 | 8 | Staging restated in three skills |
| Security | 7 | 7 | Unchanged gates; prose-only outside Claude; public tunnel URL; P3 gap |
| Verification | 8 | 9 | No live Codex/macOS evidence this session |
| Maintainability | 6 | 8 | Committed generated files need a render step |
| Cross-Device Reliability | 6 | 7 | Devices need `ai-memory-link` after pull |
| Orchestration Discipline | 6 | 8 | OMP adapter is guidance, not enforcement |
| Skill Architecture | 7 | 7 | Out of scope: overlaps and missing sandbox reference |
| **Overall** | **6.0** | **7.8** | |

## 15. Final Conclusion

**What is the single most important architectural change?** Keep one source of truth, but
stop forcing one identical global prompt onto every AI runtime. Give each runtime a small
shared core plus its own short adapter, with native CLIs as the default execution path and
OMP as optional orchestration. The audit supports this on clarity, context cost (−50–60% per
request), and correctness of wiring: dead links removed, OMP policy isolated. On measured
coding quality it shows parity, not improvement.
