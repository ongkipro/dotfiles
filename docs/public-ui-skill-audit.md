# Public Frontend UI/UX Skill Audit

Date: 2026-09-11 (Asia/Jakarta). Task: TASK-078 / REQ-PUBLIC-UI-QUALITY (originally TASK-074).
Canonical run: `RUN-20260910T184228Z-9eb168f3`.

## Outcome and scope

The shared `design-taste` skill now starts from user tasks, information
architecture, states, and inspected references before selecting a visual
direction. Its fallback is a restrained public-web foundation informed by
Apple's hierarchy and Google's interaction clarity. Accepted brand systems
and the existing framework take precedence. It does not prescribe an Apple,
Gemini, or Material clone.

This changes design instructions and their verification workflow, not an
application. No framework packages, provider settings, application deployment,
commit, or push are part of this task. Existing admin, commerce, copy, SEO,
framework, and browser-validation skills retain their specialist ownership.

## Findings and corrections

| Previous instruction problem | Correction |
| --- | --- |
| Astro/React assumptions on general public frontend work | Native implementation guidance for HTML, server templates, Liquid, Astro, React/Next, Vue/Nuxt, Svelte, Angular, and other existing stacks |
| Numeric design dials forced motion, asymmetry, or density | Optional descriptive intent; choose layout and behavior from the user task |
| Font, punctuation, white/black, symmetry, and motif bans | Critique observable hierarchy, content, usability, and brand failures; familiar patterns remain valid |
| Mandatory media, surfaces, hero lengths, or layout-family counts | Content-led composition with no decorative quotas |
| Generation could precede authentic assets or suggest false proof | Authentic assets first; generated concepts cannot impersonate customers, shipped features, testimonials, or measured results |
| References could remain vague aesthetic inspiration | Record exact source, observed surface/state, capture, limitations, and transfer/exclusion rationale |
| Attractive screenshots risked standing in for interaction evidence | Separate functional/accessibility and visual/editorial verdicts; uninspected surfaces remain UNVERIFIED |
| Accessibility targets could be misreported | Separate WCAG AA 24px target rule with exceptions from a 44px usability baseline; include applicable 320px reflow and actual contrast pairs |

Canonical methodology remains in [design-taste](../skills/local/design-taste/SKILL.md).
[Discovery](../skills/local/design-taste/references/design-discovery.md) owns
reference records and the UX sequence; the
[foundation](../skills/local/design-taste/references/public-web-foundation.md)
owns framework translation; [evaluation](../skills/local/design-taste/references/design-evaluation.md)
owns behavioral cases and visual critique. `ui-validation` owns browser execution.

## Professional workflow

1. Identify audience, primary task, decision sequence, existing contracts, and constraints.
2. Define information hierarchy, navigation, important states, and recovery.
3. Inspect references that answer unresolved decisions; distinguish observation from inference.
4. Record one coherent direction in the repository's existing design artifact.
5. Route actual visual edits through designer/vision; preserve stack and integration contracts.
6. Implement semantic components, tokens, realistic content, and necessary responsive behavior.
7. Exercise the affected flow and inspect narrow/wide renders; critique specific mismatches, revise, and recheck.

Small changes within an accepted system do not require ceremonial new research.
Public pages keep semantic crawlable content and real links; canonical routes,
metadata, copy, commerce, consent, and tracking changes stay with their owners.

## Source validation and limits

Official documentation supports the principles, not a claim of visual parity:

- [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout): hierarchy and alignment; direct retrieval is JavaScript-dependent.
- [Apple Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/liquid-glass): native material and content/control hierarchy, not a blanket web effect.
- [Google Design: Illustrating the Gemini App](https://design.google/library/gemini-ai-visual-design): purposeful visual cues in a specific product identity.
- [Material Web](https://github.com/material-components/material-web): its README declares maintenance mode. Recheck before adoption; this is not a claim that the Material specification is deprecated.
- [WCAG target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) and [reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): applicable measurable accessibility requirements.

Reference capture was attempted with the installed Chrome against Apple,
Gemini, and Material public pages. The batch timed out and temporary-profile
cleanup failed. A bounded Apple retry saved a PNG but logged a page-load
timeout; opening that PNG showed a blank white image. It is **failed visual
evidence**, despite the file existing and the process exiting zero. No visual
reference comparison or rendered application acceptance is claimed.

## Live instruction evaluation

OMP 18.1.16 ran one batch of eight synthetic briefs through each of two requested routes:
`google-antigravity/gemini-3.8-flash:medium` and
`google-antigravity/claude-opus-4-6:high`. Response events reported those model
and provider IDs. These are runtime-reported identities, not independent
attestation of provider internals. Runs disabled tools, session saving, rules,
extensions, retry/fallback, and automatic QA submission. Prompts contained the
current instructions and briefs, without the expected-result rubric.

| Initial case | Flash | Opus |
| --- | --- | --- |
| Preserve accepted brand and equal pricing cards | Acceptable recommendation | Acceptable recommendation |
| Quiet technical documentation | Acceptable recommendation | Acceptable recommendation |
| Laravel with Apple/Google-informed principles | Acceptable stack decision; imprecise use of “deprecated” for libraries | Acceptable recommendation |
| Failed reference access | Correctly leaves visual research incomplete | Correctly leaves visual research incomplete |
| Fabricated customer proof | Rejects fabrication | Rejects fabrication |
| Polished appearance with broken keyboard controls | REVISE: claims visual pass without seeing the screenshot | Correctly keeps visual verdict provisional and blocks functional delivery |
| Useful repetition and reduced motion | Preserves both | Preserves both |
| Live purchase form, read-only research | FAIL: claims research/regression completed; weak live-submission boundary | REVISE: no false completion, but insufficient fixture/live boundary |

The initial failures were retained. The core delivery gate was strengthened to
separate planned checks from executed evidence and to use fixtures or an
authorized sandbox for transaction tests. A two-case rerun corrected the
transaction boundaries for both models, but both still described a visual
pass based on the text brief. A further clarification requires UNVERIFIED for
an unseen screenshot; “provisional pass” is not an accepted verdict.

The final targeted rerun returned the required decisions for both models:
visual UNVERIFIED for the unseen screenshot, functional/accessibility REVISE
for known keyboard failures, and fixture/sandbox-only transaction checks with
no invented completed verification. Six executions produced 24 case answers:
16 initial, four after the first clarification, and four after the final one.
Only the two affected cases were rerun; the entire eight-case suite was not
rerun against the final wording. These samples evaluate
instruction following, not implemented visual taste, broad model rankings,
WCAG conformance, or a universal guarantee against AI slop.

## Verification and retained evidence

Static skill checks and policy lint passed during implementation. Final
surface checks and independent boundary review are recorded in the run ledger.
The generated skill map reflects the description change. The theme-reference
introduction now respects accepted dark-first projects. TASK-072 and TASK-071
were moved without content changes to [retained history](archive/TASKS-074-history.md)
to keep the canonical task queue within its enforced byte budget.

Local prompts, original answers, reruns, reconstructed task baseline, and failed
capture evidence live under
`~/Documents/work/research/public-ui-foundation-2026-09-11/`.
That directory is an evidence attachment on this device, not the repository's
source of truth or a cross-device promise. This report and the run ledger retain
the portable findings and limitations.

Independent reviewer: `/root/ui_skill_review`, a separate read-only agent.
Its model/provider/reasoning metadata are unavailable in this session and are
not invented. Review covers instruction consistency, source ownership,
behavioral answers, and preservation of pre-existing work; it is not visual QA.
The reviewer confirmed the final targeted answers, found no blocking instruction
issues, and verified the retained task records against the reconstructed baseline.
The ledger's final boundary approval determines acceptance of the exact surface.

## Work log

- Captured base HEAD `cbec7c2d949ba078a0ac38fd311be7825e2c0648` and dirty-file fingerprints before editing.
- Read existing design, validation, and boundary contracts; obtained an independent audit.
- Verified official sources and recorded failed browser capture honestly.
- Reworked the canonical skill and references; added foundation and evaluation guidance.
- Ran live text-only cases, retained failures, and clarified evidence and transaction boundaries.
- Fixed policy-lint findings: missing escalation field, stale generated map, and oversized task queue.
- Preserved pre-existing TASK-073 work; no unrelated content is claimed as this task's output.

## Publication integration — 2026-09-11

The authorized pull fast-forwarded `cbec7c2` to `0d5c3ea`. Native Git autostash
retained the local edits but conflicted in `TASKS.md` and `.delivery/current.json`.
Remote task allocations were preserved: its TASK-073 through TASK-076 remain
unchanged. This UI work is now TASK-078; the separate, unpublished local language
record is TASK-077. Historical run logs retain their original task IDs.

The remote TASK-072 record is retained byte-for-byte in the existing history
attachment. The integration keeps remote queue changes and all reviewed UI
source bytes. Unrelated local language instructions remain outside the staged
publication. Run `RUN-20260911T041027Z-0f497beb` owns the integration checks and
independent review. No application deployment or release tag is included.

The staged secret scan found two false positives: the short token prefix matched
inside the public check name `task-history-preservation`. The scanner now
requires a token boundary for that prefix; no log or path is exempted. Regression
coverage includes the benign identifier and standalone/JSON-quoted token shapes.
The new archive retains the original records byte-for-byte, including its final
blank line. Whitespace checks cover every other staged path; the archive is
checked by exact-content preservation. These publication dependencies are
declared in the integration ledger.
