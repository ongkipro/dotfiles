---
name: design-taste
description: >-
  Research, design, and critique public frontend UI/UX across frameworks: landing pages,
  marketing sites, public product flows, editorial/docs, portfolios, and storefront visuals.
  Use for UI/UX workflow, reference research, Apple/Google/Material-inspired web design,
  redesign, design tokens, visual polish, or AI-templated UI. Start from user tasks and
  existing brand evidence; use a restrained, lightweight public-web foundation when no
  accepted system exists. Require inspected references for new directions and rendered
  critique for visual claims. Pair with the installed framework skill and ui-validation.
  Not the owner of admin workflows, commerce business rules, copywriting, SEO, or library installation.
---

# Design Taste — Public Frontend UI/UX

Produce an experience that helps its audience understand, decide, and act.
A fashionable palette or component library does not establish quality.
Anti-slop means decisions justified by the user's task, real content, and
observed evidence. It is not a font, punctuation, color, or layout blacklist.

## 0. Mode and ownership

Identify the surface and its primary user job before choosing a visual style.

| Surface | Priority | Pair when needed |
| --- | --- | --- |
| Brand / marketing | Understand the offer, evaluate evidence, choose a next step | copywriting, seo-website-builder |
| Public product flow | Complete search, booking, onboarding, application, or another customer task | existing product/UX contract; full-stack-development for cross-layer changes |
| Editorial / docs / portfolio | Find, read, compare, or inspect work | content, seo-website-builder |
| Storefront / commerce | Find, compare, configure, and purchase products | storefront-ux, storefront-development |
| DR / COD funnel | Evaluate a real offer and complete the order | copywriting, existing funnel/integration owner |

Admin/operator work routes to `admin-product-ux` and `admin-dashboard`.
A public documentation sidebar or comparison table does not make a page an
admin dashboard. Hybrid pages assign priorities by region without competing
primary actions. Storefront visuals also load
[public-experience-patterns.md](references/public-experience-patterns.md).

## 1. Design read and UX workflow

State the audience, task, surface, accepted constraints, and intended direction
briefly. Infer ordinary choices from the repository and user context; ask only
when missing information materially changes the target or scope.

For a new public experience or material redesign:

1. **Understand:** inspect existing pages, content, assets, routes, analytics or
   research actually supplied, and the problem to solve. Distinguish evidence
   from assumptions. Do not invent personas or conversion findings.
2. **Structure:** identify the primary task, information hierarchy, navigation,
   decision sequence, and essential trust or explanatory content. Use a short
   content outline or flow before arranging components.
3. **Model behavior:** record entry → decision/action → outcome, including
   relevant loading, empty, error, success, disabled, and recovery states.
   Preserve input and provide a next step when an action fails.
4. **Research:** inspect relevant references using
   [design-discovery.md](references/design-discovery.md). A list of URLs is not
   research evidence. Resolve which principles transfer before styling.
5. **Choose:** select a coherent direction, responsive composition, and token
   source. Compare alternatives only when the choice is material. A low-detail
   wireframe is useful when hierarchy is unresolved, not mandatory ceremony.
6. **Implement:** deliver the primary journey with realistic content in the
   existing framework. Follow the session's designer/vision routing requirement
   before visual edits; if that capability cannot start, report the limitation.
7. **Validate and revise:** use `ui-validation` to exercise behavior, inspect
   narrow/wide renders, compare against the accepted direction, fix concrete
   discrepancies, and reopen the changed views.

Small changes inside an accepted system skip new discovery and preserve that
system. Scale documentation to the change; never turn a spacing fix into a PRD.

## 1.5. Design context precedence

Explicit user direction and accepted repository design contracts outrank this
skill's defaults. Inspect brand assets, existing tokens, components, content,
and locale before inventing replacements. Preserve names, URLs, tracking,
legal/consent text, and accessibility behavior unless their change is authorized.

Tokens are the starting contract, not permission to ship an inaccessible pair.
When a conflict is found, identify the failing use and make or propose the
smallest authorized correction; do not silently recolor the entire brand.

Extend the existing `DESIGN.md` or accepted design specification. In a suite,
use its existing design and UX owners. Never create a competing token file or
queue. See the minimum record in `design-discovery.md`.

## 2. Variance, motion, and density

Use these as descriptive decisions, not mandatory numerical scores:

- **Variance:** stable repeated structures for comparable information;
  distinctive composition where the content needs it. Symmetry, centered
  headings, repeated cards, and plain lists are all legitimate.
- **Motion:** restrained feedback by default. Add orientation or narrative
  motion only when it explains something and survives reduced-motion needs.
  An agency or portfolio does not automatically require animation.
- **Density:** match reading, comparison, and task frequency. Whitespace groups
  content and supports hierarchy; it is not a quota of empty screen space.

If a project already uses 1–10 dials, retain them as shorthand with a concrete
rationale. Do not derive forced masonry, animation, or section sizes from a
numeric threshold. Existing numbered reference paths remain compatibility
pointers to these decisions.

## 3. Framework-neutral implementation

The fallback foundation is
[public-web-foundation.md](references/public-web-foundation.md): Apple-informed
hierarchy and restraint, Google/Material-informed state clarity, translated to
web conventions. It is an adaptable starting point, not a universal branded
skin. Reference-specific claims require current source verification.

Use semantic HTML, CSS custom properties, responsive CSS, and native controls
first. Reuse the project's components and dependencies. Add client JavaScript
only for behavior that needs it. Styling must not force a framework migration,
full-page hydration, or a universal component package. `native-first` owns the
dependency decision; the installed framework skill owns implementation.

Prefer opacity/transform for simple motion, but choose the correct technique
for the actual state change and measure expensive work. Do not hide essential
content behind a reveal script. Reduced motion must keep content and controls
available. Preserve native scroll, zoom, focus, and browser history behavior.

## 4. Design directives

### 4.1. Typography

Use the brand's type first; a system stack is a valid lightweight default.
Inter, serif, and any other family are neither inherently good nor AI slop.
Choose for content, language coverage, reading, and loading cost. Verify font
licensing and use project-native loading or self-hosted subsets where suitable.
Do not copy proprietary brand font assets merely to resemble a reference.

Define a clear type hierarchy and comfortable reading measure; roughly 60–75ch
is a starting point for long prose, not a universal width. Use responsive sizes
that retain a rem contribution and work with zoom. Test long titles and real
translations. A headline may wrap; do not force two lines or rewrite meaning
to satisfy a screenshot. Avoid fixed-height text containers and clipped glyphs.

### 4.2. Color, shape, and elevation

Use semantic tokens for canvas, text, action, border, state, and surfaces that
actually exist. Default to a restrained neutral base and a clear primary
accent when no brand is established. Additional accents, pure white/black,
neutral grays, and gradients are valid when their role and contrast are clear.
Do not invent three surfaces, a tint, or a texture solely to pass a rule.

Use a small radius and elevation vocabulary with consistent purposes. Cards
may group content without implying elevation. Reserve strong shadow/blur for
layers where separation matters. Repeated rounded boxes around every heading,
paragraph, and section usually create noise. A functional chip or badge is not
slop merely because it is rounded.

### 4.2.1. Theme policy

Light is the fallback for an unspecified public website. Accepted dark-first
brands remain dark-first. A second theme is optional; if supplied, design its
contrast, media, surfaces, and control states independently and verify both.
Single-theme sites need no theme toggle or theme JavaScript.

When adaptive light/dark is in scope: explicit stored choice → system
preference → project fallback (light if unspecified). A stored system choice
continues following the OS. Offer Light / Dark / System when users control it.
Use one theme-switch mechanism and one owner of `color-scheme`; resolve before
first paint, tolerate blocked storage, and preserve behavior after navigation.
Do not add clock or location-based theming by default. Existing implementations
are in [theme-implementation.md](references/theme-implementation.md).

### 4.3. Layout and composition

Arrange the content according to the decision sequence. Keep navigation and
primary actions recognizable. Choose a hero's height, text measure, and image
proportion from its content; a full-screen hero is not a requirement.

Repeat structures for comparable items. Change composition where information
or emphasis changes. Never require a fixed number of layout families, images,
feature cards, asymmetric sections, or zigzags. A carousel must solve a real
browsing need and keep keyboard/touch controls; do not use one to hide a list.

Plan responsive transformations, not just scaled desktop columns. Navigation,
comparison, media, forms, and sticky regions must retain their hierarchy on
narrow screens and at zoom. Breakpoints follow content fit rather than one
mandatory framework breakpoint. Keep DOM order meaningful for keyboard and
screen-reader navigation.

### 4.4. States, forms, and accessibility

Use real links for navigation and buttons for actions. Controls have visible
labels or clear accessible names; placeholders never replace persistent form
labels. Prefer labels above fields when that improves scanning. Error messages
identify the field and recovery action; submission preserves entered data.

Test keyboard order, visible focus, accessible names/states, dialog focus
management, pending feedback, and recovery. Do not fake working controls or
success. Do not rely on hover, color, dragging, or motion alone.

For WCAG AA, normal text needs 4.5:1; large text can use 3:1 (at least 24 CSS px,
or about 18.66 CSS px bold). Required non-text control/state indicators use the
applicable 3:1 rule, not the body-text rule. Measure actual composited colors,
including text over media. Aim for 44px touch controls as a house usability
baseline; WCAG 2.2 AA target size is 24px with specified exceptions, not a
blanket 44px requirement. Sources are in `public-web-foundation.md`.

### 4.5. Content and assets

Use real content early. Specific offers, examples, product details, and honest
proof provide identity. If removing the brand name leaves a page equally
suitable for unrelated businesses, inspect whether the content and hierarchy
are too generic. A generic shared component is not itself a failure.

Approved authentic brand/product assets come first. Generated imagery can be
an illustration or clearly identified concept, never fabricated customer,
product, testimonial, screenshot, or performance evidence. A text-led page
can be complete without decorative images. Do not invent customers, metrics,
scarcity, ratings, previews, or citations to fill a layout.

`copywriting` and `volumx-writer` own wording. This skill owns space and
readability, not a punctuation blacklist. Preserve accurate quoted/legal text,
locale, and meaning. Keep action labels consistent for the same intent and
make differing intents distinguishable. Specific content beats filler slogans.

## 5–7. Surface rules, anti-slop critique, and redesign

Read [surface-and-mode-rules.md](references/surface-and-mode-rules.md) for
editorial, media, mobile, funnel, and redesign details. Apply its evidence-based
critique instead of a mechanical style ban list. A missing or blocked reference
must remain unverified; do not claim visual research from a search snippet.

## 8. Delivery gate

Separate proposed work from observed evidence. A brief, attractive screenshot
description, or planned check is not an executed result. Without actual tool
evidence, report inspection and verification as pending; never say references
were recorded, regressions verified, or a visual verdict passed. A text-only
evaluation can judge the proposed decisions, not an unseen interface.
Use PASS, REVISE, or UNVERIFIED as distinct verdicts. In a text-only brief
describing a polished screenshot that you have not seen, visual = UNVERIFIED;
do not call it a pass or a provisional pass. Known keyboard failures still
make functional/accessibility = REVISE and block delivery.

Read-only reference access does not authorize live submissions. Test purchase,
account, payment, and destructive flows with fixtures or an authorized sandbox;
do not place real orders or mutate production to obtain design evidence.

Before describing a new or materially changed UI as ready, establish:

- The primary user task, decision sequence, and content are clear.
- The accepted tokens and brand were preserved or deliberately changed within scope.
- New directions have inspected references and a recorded transfer rationale;
  unavailable evidence and provisional choices are explicitly named.
- The actual interface was viewed at relevant narrow/wide sizes, compared to
  its direction, and revised where needed. Important flows and recovery work.
- Readability, keyboard/focus, contrast, reflow, touch, and reduced motion were
  checked where affected. A screenshot alone does not prove interaction.
- No fabricated evidence, decorative filler, or unsupported product behavior
  is presented as real. No accessibility or usability compromise is justified
  merely by saying Apple, Google, modern, premium, or anti-slop.
- Asset and JavaScript costs were checked using project tools where affected;
  a quality adjective or Lighthouse score does not prove good visual design.

Use [design-evaluation.md](references/design-evaluation.md) for review cases and
separate behavioral/visual verdicts. Critical failures block completion; minor
remaining design trade-offs are reported. Never guarantee universal absence of
AI slop from a prompt, static scan, or one model-generated sample.

## 9. Pairing and reference ownership

| Need | Owner |
| --- | --- |
| Reference evidence, UX sequence, direction record | design-discovery.md |
| Default public-web foundation, sources, framework translation | public-web-foundation.md |
| Editorial/media/mobile/funnel specifics, redesign | surface-and-mode-rules.md |
| Existing theme code | theme-implementation.md |
| Storefront visual decision hierarchy | public-experience-patterns.md |
| Instruction evaluation and rendered critique | design-evaluation.md; ui-validation owns browser execution |
| Audience/market uncertainty | product-intelligence |
| Admin workflows and dense operator UI | admin-product-ux, admin-dashboard |
| Commerce behavior and implementation | storefront-ux, storefront-development |
| Astro / Next.js implementation | astro-development / nextjs-development |
| React components where appropriate | shadcn-ui; not a universal public-site theme |
| Copy, localization, content, search concerns | copywriting, volumx-writer, content, seo-website-builder |
| Cross-layer implementation | full-stack-development |
| Dependencies / runtime performance | native-first / web-perf |

Vue, Svelte, Angular, Liquid, server templates, and plain HTML keep their native
stack and existing components; do not require a React or Astro adapter merely
to follow this skill. Load specialist animation skills only when earned.

The retained numbered references are compatibility pointers, not independent
rules. Update canonical sources above, not those pointers. `rationale.md` and
`accessibility-notes.md` remain optional project-record templates; project
facts belong in the project's accepted design artifact, never in this skill.
