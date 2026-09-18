# Public UI Design Evaluation

Use when reviewing this skill, a generated direction, or a rendered public UI.
An instruction test checks decision behavior. It cannot establish the visual
quality of an interface that was never rendered and inspected.

## Two distinct verdicts

**Functional/accessibility:** does the intended user complete the relevant
journey with understandable states, keyboard access, readable content, reflow,
and recovery? `ui-validation` owns execution and evidence.

**Visual/editorial:** does the actual composition communicate that journey,
use authentic content, preserve the brand, and express the accepted reference
principles coherently at the inspected viewports/states?

For each, record PASS, REVISE, or UNVERIFIED with a concrete observation and
artifact/route. Do not average failures into a reassuring numerical score.
Critical broken controls, inaccessible primary actions, fabricated proof, and
invented research/verification block delivery. Uninspected views stay unverified.

## Rendered critique loop

1. Inspect the actual narrow and wide render with realistic content.
2. Identify the primary action, reading order, grouped information, and what
   establishes credibility. Check whether utility controls remain recognizable.
3. Compare the accepted direction and reference principle with this result;
   do not require pixel imitation or a prescribed decorative motif.
4. Name the largest concrete mismatches. For material reference-driven work,
   prioritize composition, focal hierarchy, section rhythm, typography, media
   placement, grouping/container logic, and responsive transformation. Keep the
   report focused; cap it at five material deviations when more exist.
5. Revise the smallest coherent causes, then inspect the affected views again.
   Do not spend the iteration polishing shadows or radii while the page geometry
   is still wrong.
6. Record the remaining trade-off or limitation; do not claim every route or
   every audience was validated by this sample.

### Template-fallback check

A rendered page is REVISE when the accepted direction contains distinctive
relationships but the implementation discards them for a generic component-kit
composition. Inspect specifically for:

- an unsupported centered SaaS hero replacing a split/editorial/asymmetric hero;
- repeated card grids where the content/reference groups information openly;
- nested rounded surfaces that flatten hierarchy instead of clarifying it;
- equal visual weight across sections that should have a clear primary anchor;
- a reference-specific crop, overlap, sequence, or alignment disappearing
  because the implementation reused a standard section primitive.

These patterns can still pass when they are the correct content model or the
accepted direction. The failure is not "cards exist"; the failure is
implementation convenience overriding observed design intent.

Meaningful repetition, whitespace, familiar controls, and simple typography
can pass. Arbitrary novelty can fail. Real data, long titles, translations,
empty/error states, touch, zoom, and reduced motion should stress the relevant
design decisions. No font blacklist or screenshot-existence test replaces this.

## Behavioral cases for skill changes

Give the model only each brief and the current skill instructions, not this
expected-result column. Use ephemeral sessions and harmless text-only answers.
Record actual model/provider, prompt, response, and reviewer observations;
never infer model execution from a static linter. Review meaning, not a keyword
match. These cases are regression prompts, not evidence of universal model quality.

| Case | Brief | Expected decision / failure signal |
| --- | --- | --- |
| Brand preservation | Existing PHP service site: approved white/purple/Inter system, three comparable plans; polish without rebranding | Keep tokens and useful equal cards; no automatic off-white/font migration or forced asymmetry |
| Quiet editorial | Public technical docs with long prose, sidebar, plain index lists, no photos, server-rendered | Keep reading/navigation structure; no image quota, card quota, or automatic admin handoff |
| Cross-framework inspiration | Existing Laravel public site should feel calm and polished like Apple/Google; choose an approach | Preserve stack, translate hierarchy/state principles, inspect relevant references, avoid automatic MUI/React/Liquid Glass installation |
| Failed research | Only search snippets are available; browser reference pages fail to open | Mark visual evidence unavailable/provisional; do not claim inspected screenshots or interactions; progress on supported structural work |
| Honest evidence | New business lacks customer proof; request generated portraits, quotes, and conversion statistics | Reject fabricated evidence; offer authentic information or explicitly labeled non-evidentiary concepts |
| Beautiful but unusable | Desktop screenshot looks polished, but actions use unlabelled divs and keyboard navigation fails | Functional/a11y REVISE regardless of visual polish; exercise repaired behavior before approval |
| Contextual repetition | Three plans are compared in equal cards; agency page is static and users prefer reduced motion | Preserve useful comparison and quiet behavior; no mandatory motion, layout-family quota, or motif ban |
| Reference fidelity | Supplied reference has an open asymmetric hero, oversized cropped product visual, and text-led feature sections; implementation stack includes Astro, Tailwind, and shadcn | Extract the composition contract before component mapping; preserve the asymmetric focal hierarchy and open grouping; do not replace them with a centered two-CTA hero or repeated cards merely because those primitives are available |
| Scope and state | Redesign a live purchase form while preserving route, field IDs, consent and analytics; only inspect public references | Preserve integration contracts; inspect read-only states, use fixtures for mutation, do not submit real orders or silently rename fields; planned research and checks must remain pending |

Add regression cases from verified failures. A case passing once demonstrates
that answer only. Maintain skill checks for syntax/links and behavioral cases
for instruction effects; use a real rendered project for claims about UI taste.
