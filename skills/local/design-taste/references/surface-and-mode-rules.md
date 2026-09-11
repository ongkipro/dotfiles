# Surface Rules, Anti-Slop Critique, and Redesign

Applies after the task, brand, and evidence decisions in `SKILL.md`. These rules
protect usable behavior; they do not impose a universal visual theme.

## §4.5.1 Editorial, docs, and portfolio

- Long-form content needs a comfortable measure, semantic headings, readable
  paragraphs, and navigation appropriate to its length. Plain lists and
  repeated index rows are often the right design.
- Design captions, quotations, code blocks, tables, and references. Keep
  horizontal scrolling within genuinely two-dimensional content, not the page.
- Docs need orientation, findability, and useful cross-links. A sidebar and a
  data table do not turn public documentation into an admin application.
- Portfolio work supplies the identity: real work, clear context, relevant
  process, and honest outcomes. A regular grid can make projects easier to
  compare; do not force mixed ratios, load-in cascades, or decorative chrome.
- Text-led articles, service pages, and technical references do not need an
  image quota. Add images/diagrams only when they explain or substantiate.

## §4.6 Assets and product truth

Prefer approved authentic brand assets, product photography, and screenshots
of the actual product. Use appropriately licensed alternatives where relevant.
Generated illustrations or concept mockups must not impersonate shipped
features, customers, testimonials, before/after results, or verified evidence.
A labeled prototype may illustrate a proposal; it is not a product screenshot.

Do not automatically generate imagery because the tool exists. A diagram or
working mini-component can be more useful than a bitmap; choose the medium
for the information. Reuse the installed icon system; a simple native/CSS/SVG
mark is valid when appropriate. Avoid fake dashboard/terminal previews that
suggest nonexistent product capability. Use no preview when it adds no value.

No invented logos or customer relationships in trust strips. Respect branding,
asset rights, image context, alternative text, focal points, responsive sizing,
and reserved media geometry. Text logos are legitimate when that is the actual
brand asset. Missing proof stays missing, not filled with generated evidence.

## §4.7 Mobile, touch, and input

- Make required actions reachable without hover. Preserve text selection where
  users may copy names, prices, identifiers, or prose. Do not remove native
  focus or touch feedback without an equally clear replacement.
- Aim for 44px touch targets; use the precise WCAG criterion and exceptions
  when making compliance claims. Avoid tightly packed small icons.
- Use at least 16px mobile form text as a practical Safari auto-zoom precaution;
  verify computed style and behavior. Never disable browser zoom to hide a bug.
- Choose grid wrapping and breakpoints from content fit. `minmax()` tracks must
  shrink safely on narrow screens. A named breakpoint is valid when navigation
  or composition actually changes; no universal 768px single-column rule.
- Test content expansion, browser zoom, missing/long media, and narrow reflow.
  Sticky navigation/actions must not obscure content, validation, focus, consent
  controls, or the on-screen keyboard; account for device safe areas.
- Bottom navigation belongs where repeated top-level tasks justify it. A
  marketing page does not automatically need a bottom tab bar or sticky CTA.

## §5 Evidence-based anti-slop review

A familiar style is not a defect by itself. Look for observable mismatches:

| Failure pattern | Inspect | Corrective decision |
| --- | --- | --- |
| Generic page with interchangeable brand names | Is the offer, proof, content, or user decision specific? | Replace filler with authentic information and organize around the actual task |
| Repeated card/bento shell around unrelated content | Does grouping help scan, compare, or act? | Use simpler sections, lists, tables, or media where they fit; keep repeated comparison units |
| Forced novelty | Do asymmetry, motion, typography, or shape obstruct reading/action? | Remove the unnecessary treatment; keep meaningful identity |
| Decorative chrome without information | Does a badge, eyebrow, counter, grid, or status dot explain anything? | Remove it unless it communicates a real category, state, sequence, or constraint |
| Weak content disguised by effects | Is the page useful with effects removed? | Fix hierarchy and evidence before adding presentation |
| Fake product or social proof | Can the source or implemented behavior be verified? | Use authentic evidence, a clearly labeled concept, or omit it |
| App shell pasted onto a public page | Does this audience need persistent app navigation and panels? | Restore the public decision/reading path |
| Style-only success claim | Were realistic states and responsive behavior examined? | Exercise the affected flow and inspect rendered results |

Gradients, pure white/black, Inter, serif, centered headings, equal cards,
ordinary progress indicators, and meaningful beta/version labels are not
inherently slop. Neither is correct punctuation. Judge purpose, execution,
coherence, and context; do not replace one automatic aesthetic with another.

Do not count every visual motif or score a page green from keyword absence.
Use the review rubric in `design-evaluation.md`. Record concrete discrepancies
and inspect revisions; disclose a remaining limitation rather than asserting
that a prompt guarantees professional taste.

## §6 DR / COD funnels

Conversion goals do not override truthful claims, accessibility, or consent.
Use the audience's language, actual product details, transparent offer terms,
verified proof, and a clear order/recovery path. Longer copy can be appropriate.

Repeated actions can help after important decision blocks, but do not add a CTA
after every section by default. Use consistent wording for the same intent.
Sticky order actions are conditional on context, occlusion, keyboard/reflow,
and usable access to the actual form. Show urgency only when verified by real
stock or deadlines; never fabricate scarcity or countdowns.

Preserve integration field names, IDs, tracking selectors, attribution, and
checkout/order boundaries. Pair with the relevant integration owner for those
changes. Keep mobile payload and motion restrained; validate the actual page
with `web-perf` rather than claim field performance from a layout rule.

A locked light theme is a reasonable default for an unspecified funnel, not a
reason to discard an accepted brand or a user's explicit theme requirement.
Real product images and consented testimonials remain evidence, not decorations.

## §7 Redesign protocol

1. Inspect the existing behavior, content, brand/tokens, SEO/route contracts,
   accessibility, performance evidence, and the actual complaint.
2. Establish what must remain and what is authorized to change. Preserve useful
   conventions and existing user learning; do not repaint for novelty alone.
3. Fix the earliest real cause: information hierarchy, content, affordances,
   state/recovery, then the visual treatment that expresses them. Spacing alone
   cannot repair a confusing task flow, and motion is never a mandatory step.
4. Use inspected references for unresolved design decisions. Choose the smallest
   coherent change that satisfies the accepted objective.
5. Validate critical journeys, responsive transformations, semantics, and visual
   execution after the change. Keep URLs, tracking, form contracts, and legal
   meaning within their authorized scope; route SEO and copy to their owners.

Do not attach invented conversion/risk percentages to a redesign strategy.
Report actual evidence, constraints, and residual uncertainty.
