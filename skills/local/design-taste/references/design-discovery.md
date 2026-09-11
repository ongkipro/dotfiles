# Public UI/UX Discovery and Reference Evidence

Use before a new surface or material redesign. Small changes inside an accepted
system reuse repository evidence. This reference owns research and direction;
`ui-validation` owns verification of the resulting interface.

## 1. Understand the task before looking for a style

Identify the audience's primary job, entry point, decision, desired outcome,
content/assets available, locale, device constraints, and existing brand system.
Separate supplied research from assumptions. Route unresolved market/product
questions to `product-intelligence`; do not invent a persona or interview.

Describe the primary journey as entry → understand/evaluate → action → result.
List material failure and recovery states. A public search page needs query,
results, no-results, loading, and retry semantics; a static article does not
need invented app states. Commerce and admin behavior retain their specialist
owners. Sketch information hierarchy before selecting components.

## 2. Research with a question

For each unresolved decision, say what a reference can answer: mobile navigation,
pricing comparison, product imagery, application steps, reading measure, or
state feedback. Search official product sites and relevant production examples,
not just galleries of attractive hero screenshots.

Usually inspect 2–4 relevant examples plus the applicable accessibility/design
system guidance. This is a research budget, not a quota: one close reference
can resolve a narrow question; a substantially different journey may need more.
Include a market/local-language reference when local trust or behavior matters.
Do not silently substitute a global SaaS page for a local purchase workflow.

For a public website, prefer references that solve a public website task.
Apple's marketing pages, Apple native HIG, Gemini's public marketing site,
Gemini's signed-in app, and Material component specifications are different
kinds of evidence. Name which one was examined. An application shell does not
supply a marketing page's information architecture.

## 3. Inspect, capture, and distinguish evidence

Use the installed browser tooling or native browser; reuse existing project
runners when appropriate. Do not install a UI library or browser automation
package just to look at a reference. Public read-only inspection is sufficient;
logins, protected screenshots, and live actions need the session's authorization.

For each reference used to justify a visual/interaction decision:

- Record the exact URL, access date, surface, viewport, and state.
- Open the relevant region, not just the homepage. Inspect narrow/wide
  behavior when responsive transfer is part of the claim.
- Capture and **inspect** the screenshot. Record the observed hierarchy,
  type/spacing relationships, grouping, imagery, navigation, and density.
- Exercise the relevant interaction when available and authorized: menu,
  disclosure, comparison, focus, or validation. A still image cannot establish
  focus management, error recovery, animation, or checkout behavior.
- State what was observed, what is inferred, and what remains unverified.
  DOM/computed-style inspection may establish tokens; screenshot color sampling
  is only an approximation and does not prove source CSS or measured contrast.

A search result, image search thumbnail, marketing claim, remembered screenshot,
or generated mockup cannot support a claim that the live UI was inspected.
Screenshots demonstrate appearance at their captured conditions, not universal
accessibility or performance. Do not copy another brand's assets or identity.

If a source is blocked, JavaScript-only, authenticated, region-specific, or
fails to render: record the failure, use an accessible relevant alternative,
and narrow the claim. If no suitable visual evidence is available, mark the
visual direction provisional. Continue authorized structural work, but do not
mark visual research or visual acceptance PASS. Report the exact missing
evidence instead of inventing it or repeatedly retrying the same blocked URL.

## 4. Transfer principles, not a collage

Record why an observed pattern fits the current user/content and what must not
transfer. Examples: preserve a product's clear information grouping; do not
copy its oversized hero when the current page needs immediate comparison.
Borrow Material's explicit selected/error states; do not automatically copy
its full component density or make every surface a rounded card.

Select one coherent direction. When alternatives are genuinely unresolved,
compare audience/job fit, brand continuity, content needs, accessibility,
responsive behavior, and implementation/runtime cost. Do not manufacture three
options when the user already chose one.

Identity comes from the subject: actual work, product details, useful diagrams,
photography, language, or a deliberate typographic/compositional relationship.
Do not bolt on a signature animation, decorative badge, or texture to make an
otherwise generic page appear distinctive. A utility page can remain quiet.

## 5. Keep the decision in the existing design owner

Extend the repository's accepted design artifact. Use `DESIGN.md` only if no
owner exists and durable decisions need a home. In a specification suite,
extend its existing design-system and UX-flow documents. Do not create a rival
PRD, task queue, or token file. Large research screenshots can remain in an
approved local artifact directory; record portable source/observation details
in the repository and do not commit authenticated captures or private data.

Minimum decision record:

```markdown
## Public experience
- Audience/job, primary action, assumptions:
- Entry → decision/action → outcome; critical recovery:
- Information hierarchy and content/assets:

## Reference evidence
| Source / inspected date | Surface, viewport, state, artifact | Observed | Inferred / unverified | Transfer / exclude |
| --- | --- | --- | --- | --- |

## Direction
- Accepted direction and why it fits:
- Brand/content identity; patterns intentionally repeated:
- Responsive transformation and density:
- Rejected alternative, only when a real choice existed:

## Tokens and behavior
- Semantic color pairs, type, spacing, shape, elevation:
- Theme scope; motion purpose and reduced-motion alternative:
- Relevant loading/empty/error/success/disabled states:
- Framework-native implementation and budget:

## Acceptance evidence
- Browser routes, viewports, interactions, and result:
- Reference comparison: discrepancy → revision → recheck:
- Remaining limitation and its impact:
```

Use executable token names and actual values where implemented. Do not claim a
reference-comparison pass by resemblance alone: explain how the transferred
principle helps the current task and survives realistic content.
