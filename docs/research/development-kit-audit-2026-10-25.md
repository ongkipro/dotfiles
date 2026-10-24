# Development-Kit Completeness Audit — 2026-10-25

TASK-137, run `RUN-20261024T175250Z-7593b11a`. Compares the development kit with a
generic professional engineering kit (ten domains, ~30 per-repo files, persona
agents) and with open-source AI-coding kits and community evidence. Sources were
read only; no upstream installer, hook, or agent was executed.

## Verdict

No skill-level gap was found in the compared domains. The real gaps were in the
standalone (non-suite) repository templates: no home for a threat model, a test
strategy, a definition of done, a runbook, or quality/performance targets. Those
existed only in the 17-document suite or inside skill bodies. Routing had a
measured trigger gap for skill-system and onboarding requests.

## Evidence classes

### Primary standards (verified live 2026-10-25)

| Concern | Source | Adopted minimum |
|---|---|---|
| Threat model | [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/); [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html); [ASVS 5.0](https://asvs.owasp.org/) | Boundary/component, STRIDE threat, response (mitigate/eliminate/transfer/accept), enforcing file and test; ASVS L1 baseline, L2 with auth/payments/personal data |
| Test strategy | [Software Engineering at Google ch. 11](https://abseil.io/resources/swe-book/html/ch11.html); [Fowler, Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html); [Dodds, Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) | Layer → command → real versus substituted dependencies; real DB/HTTP where code serializes; no fixed coverage quota |
| Runbook | [SRE Workbook, On-Call](https://sre.google/workbook/on-call/); [SRE Book, Postmortem Culture](https://sre.google/sre-book/postmortem-culture/); [Fowler, ParallelChange](https://martinfowler.com/bliki/ParallelChange.html) | One entry per alert/probe: symptom, check, mitigation, rollback with migration phase, escalation; blameless note after downtime, data loss, or manual rollback |
| Performance | [web.dev Web Vitals](https://web.dev/articles/vitals); [SRE SLO chapter](https://sre.google/sre-book/service-level-objectives/) | p75 field LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1; backend targets as percentiles, value chosen per project |
| Definition of done | [Scrum Guide 2020](https://scrumguides.org/scrum-guide.html) | Applies to every increment, distinct from per-item acceptance criteria |

### Open-source kits (pinned where read through `gh api`)

spec-kit `67e0f72`, BMAD-METHOD `61e01f8`, superpowers `2ce8aa1`, ECC `90606c8`,
claude-code `318b7e6`, claude-code-security-review `0c6a49f`, Taskmaster `c0c98d3`,
codex `970111f`, aider `5dc9490`; AGENTS.md standard, Kiro, and Cline docs pages.

- Adopted: BMAD's opt-in NFR clusters ("bounds, not adjectives") → `PRD.md`
  "Quality attributes"; Taskmaster's per-task test strategy and Kiro's
  "unchanged behavior" already match `TASKS.md` Regression Checks; BMAD's cut test
  ("would removing it change agent behavior?") supports keeping new sections
  conditional.
- Not adopted: persona agent directories (BMAD, ECC), a fixed 80% coverage floor
  (ECC), always-loaded per-domain steering files (Kiro), review-all-files memory
  updates (Cline), and a standalone `RUNBOOK.md`.

### Measurements and vendor guidance

- Gloaguen et al., [arXiv 2602.11988](https://arxiv.org/abs/2602.11988) (2026):
  context files did not generally improve task success and raised inference
  cost by over 20% on average. Supports adding conditional sections, not files,
  and keeping AGENTS.md additions short.
- Vercel, [AGENTS.md outperforms skills](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
  (2026-01-27): a skill was never invoked in 56% of their cases. Vendor
  measurement on one framework.
- Claude Code [skills documentation](https://code.claude.com/docs/en/skills),
  read 2026-10-25: the listing budget is 1% of the context window; on overflow,
  descriptions of the least-invoked skills are dropped; `skillOverrides`
  `"name-only"`, `skillListingBudgetFraction`, and `/skill-doctor` control it;
  description plus `when_to_use` is capped at 1,536 characters.
- Persona prompting: [arXiv 2512.05858](https://arxiv.org/abs/2512.05858) found no
  consistent accuracy gain (question answering, not agentic coding).
- Anthropic, [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents):
  start from real failures, include should-not-trigger cases, use pass^k.

Community limitation: Reddit, X, Hacker News threads, and YouTube transcripts were
not reachable from the research session; practitioner evidence is limited to
blogs (for example Böckeler's [spec-driven tools review](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)),
and anecdotes are not used as decision grounds.

## Changes

- Templates: `PRD.md` Quality attributes; `ARCHITECTURE.md` Threats and controls;
  `AGENTS.md` Test strategy and Definition of done; `OBSERVABILITY.md` Runbook;
  `RELEASE.md` points rollback commands at the runbook.
- Skills: `development-kit` description front-loads skill-system improvement,
  CLI onboarding, upstream adoption, and research-only workflow questions;
  `full-stack-development` covers cross-layer bug repair and requires both
  authorization and persistence checks across a boundary; `application-security`,
  `testing-engineering`, and `prd-taskbreaker` name the new canonical sections;
  `development-kit/references/reference-map.md` maps professional-kit concerns
  to existing homes.

## Decision trials

`ai-workflow-eval` decision-only trials, 20 synthetic cases. Each row is one
observed trial, not a reliability rate. PASS still means `behaviorResult:
UNVERIFIED` and semantic review required.

| Instruction revision | Runtime | Result |
|---|---|---|
| `bf50926a` (baseline) | Claude Code subagent, claude-opus-5-5 | 10/20 PASS |
| `bf50926a` (baseline) | Antigravity `agy` plan mode, sandboxed, model not exposed | 20/20 PASS |
| `bf50926a` (baseline) | Codex | Not run: account usage limit until 2026-10-31 |
| `8d3660f6` (templates, descriptions) | Claude Code subagent, claude-opus-5-5 | 13/20 PASS |

Semantic review of the baseline Claude failures: six owner or review-step
misses came from `development-kit` not being selected for skill-system,
onboarding, upstream-adoption, and research cases (description did not name
them). After the description change those cases selected `development-kit`. Persistent misses in both Claude trials: the tenant
and webhook repairs checked only one of authorization and persistence, which led
to the explicit both-sides rule in `full-stack-development`.

Final revision `938e4050` (all changes above):

| Runtime | Result |
|---|---|
| Antigravity `agy` plan mode, sandboxed, worktree unchanged | 20/20 PASS |
| Claude Code subagent A, claude-opus-5-5 | 11/20 PASS |
| Claude Code subagent B, claude-opus-5-5 | 10/20 PASS |

After independent-review fixes, revision `19bc86f8`: `agy` regression trial 20/20
PASS, worktree unchanged. Independent review (fresh Claude Code subagent):
FAIL with nine Markdown findings, all fixed, re-review PASS.

Interpretation, from transcripts and failure types:

- Owner-selection failures fell from four cases at baseline to zero in both
  final Claude trials. The description change is the only change those trials
  could observe: each Claude participant used three or four tool calls and
  opened no `SKILL.md` body, so it answered from the skill listing alone.
- For the same reason the body-level both-sides rule left the tenant and webhook
  misses unchanged. This is consistent with the vendor finding above: skill bodies do
  not influence a decision unless the skill is actually opened.
- Remaining Claude misses are generic steps (`preserve-scope`, `inspect-repo`,
  `independent-review`, `local-checks`). They measure participant diligence under
  a decision-only prompt more than guidance quality; `agy`, which read the
  guidance files, passed every case on both revisions it was graded on.
- Claude's aggregate did not improve: 10 at baseline, 13 at the intermediate
  revision `8d3660f6`, then 11 and 10 at the final revision. No improvement claim is
  made beyond the owner-selection change.

## Guidance-read labels (TASK-138)

`guidanceRead` makes the trial-method gap measurable. Claude Code subagent,
claude-opus-5-5, decision-only:

| Revision | Result | Failed with expected owner read | Failed with owner unread |
|---|---|---|---|
| `7adbeb12` (labels added) | 11/20 | 3 (all `development-kit`: independent review, scope) | 6 |
| `b08a52b0` (`development-kit` states review and scope for skill-system work) | 15/20 | 5 | 0 |

Both `development-kit` cases passed after the targeted wording. Remaining
read-labeled misses are single generic steps (`preserve-scope`, `local-checks`,
`trace-callers`, `check-persistence`); the persistence rule sits at byte 4726 of
`full-stack-development`, inside the 6,000 bytes the participant reported
reading, so more text is not expected to help. `guidanceRead` is self-reported.
One trial per revision; not a reliability rate.

## Open items

- Skill listing budget: 77 skills and about 37,000 description characters are
  likely above Claude Code's 1% listing budget. Mitigation is device-local
  (`skillOverrides` `"name-only"` for rarely used skills, or
  `skillListingBudgetFraction`) and belongs to the owner's settings decision, not
  this repository.
- `claude plugin validate ~/.claude/skills` (Claude Code 2.1.310) does not
  validate this layout: the symlinked directory is skipped and the real
  directory requires a plugin manifest. `skill-check` remains the frontmatter
  validator.
- Trial method: a decision-only participant that never opens guidance cannot
  test body-level rules. A future harness option could require the participant
  to report which guidance files it read, so non-reading trials are labeled
  instead of graded as guidance failures.
- Must-hold steps that matter in every repair belong where they are always seen
  (description, CORE, or a hook), not only in a skill body; CORE is at its byte
  budget, so this needs an owner decision.
- A Codex trial (usage limit until 2026-10-31) and more repeated trials remain.
