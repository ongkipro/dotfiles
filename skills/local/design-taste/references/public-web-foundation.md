# Lightweight Public Web Foundation

Use only when a public frontend has no accepted design system. User direction,
brand assets, audience needs, and repository contracts take precedence. This
is a web translation of useful Apple/Google principles, not an Apple clone,
Gemini clone, Material component package, or new design-system dependency.

## What transfers

| Influence | Useful principle | Web application | What does not automatically transfer |
| --- | --- | --- | --- |
| Apple layout guidance | Content hierarchy, alignment, recognizable controls | Clear reading order, stable navigation, strong product/content emphasis | Native window chrome, platform-only interactions, oversized launch-page composition |
| Apple materials | Separate controls from content where layering helps | Restrained overlay/navigation treatment with readable solid fallback | Liquid Glass on every section, costly full-page blur |
| Google / Material | Consistent roles and understandable interaction states | Semantic color tokens; visible selected, pending, error and focus states | Full Material component geometry, an app shell on every public page |
| Gemini design | Purposeful cues and motion that explain activity | Calm feedback and progressive disclosure for real interactive behavior | Sparkles, gradients, chat composer, or generated previews as universal branding |

The foundation is deliberately plain enough to inherit a brand. It is not a
claim that all public websites should look alike. A local service site, product
catalog, publication, and SaaS landing have different decision sequences.

## Starting choices, not hard rules

- **Canvas:** a readable light canvas when unspecified. White is valid. Existing
  dark-first brands remain intact; do not force a theme toggle.
- **Type:** brand type or a system sans stack. Choose editorial display type
  when it serves content, not as a premium cue. Keep body text readable and
  test long/localized content, mixed scripts, zoom, and font loading.
- **Color:** neutral structure with a clear primary action and meaningful state
  colors. Use semantic tokens, not a prescribed Apple blue or Google palette.
- **Spacing:** a compact coherent scale; separate groups more than their parts.
  Adapt density to reading/comparison/action, not a fixed section-padding quota.
- **Shape:** consistent purposes for controls, groups, media, and overlays.
  A pill can be right for a chip and wrong for an entire article section.
- **Depth:** spacing and borders before widespread shadow. Translucency is
  optional; readability and performance must survive without it.
- **Motion:** brief, functional feedback by default. No required scroll reveal,
  parallax, autoplay background, custom cursor, or motion package.
- **Content:** real offer, product, work, or information. The page must remain
  useful when decorative effects are removed. Images are conditional on the job.

## Framework translation

Keep one design contract and semantic token vocabulary; implement it in the
existing stack. Cross-framework does not mean sharing a JavaScript runtime.

| Existing stack | Implementation starting point |
| --- | --- |
| Plain HTML, server templates, Liquid | Semantic markup, CSS variables, native forms and links; minimal enhancement |
| Astro | Static components; islands only for behavior requiring client state |
| React / Next.js | Existing components and styles; server rendering where appropriate; client boundaries only where needed |
| Vue / Nuxt, Svelte / SvelteKit | Native components, rendering, and lifecycle; reuse installed accessible primitives |
| Angular | Existing Angular components and design tokens; Angular Material only when it fits the project |
| Other framework | Preserve its native rendering and component contracts; apply the same UX and token decisions |

A design-system reference is not an installation instruction. React-only
libraries are not the universal answer. Use existing accessible primitives for
complex controls rather than improvising dialog/combobox behavior. Verify a
candidate library's current maintenance, accessibility, imports, and actual
bundle effect before adding it. `@material/web` currently declares maintenance
mode; recheck the official repository before any recommendation to adopt it.
There is no blanket promise that custom components are lighter or more accessible.

For public frontend, preserve semantic crawlable content, route/canonical
contracts, real link navigation, and reading order. Hydration must not be needed
to reveal the main content. SEO ownership remains `seo-website-builder`.

## Accessibility and performance evidence

Use the current applicable WCAG requirements and project acceptance criteria.
Normal text generally requires 4.5:1, large text 3:1; required non-text UI
indicators generally require 3:1 against adjacent colors. Measure actual pairs
and states rather than declaring a palette accessible by its name.

Aim for 44px touch controls for usability. WCAG 2.2 AA 2.5.8 specifies 24×24 CSS
px with documented spacing, inline, equivalent, native-control, and essential
exceptions; do not mislabel a house 44px target as that AA rule. Test reflow at
320 CSS px where applicable, zoom, keyboard, visible focus, long text, and
reduced motion. A 390px screenshot alone does not prove WCAG reflow conformance.

Use project-specific asset and JavaScript budgets, measure the shipped surface,
and distinguish local lab measurements from real-user metrics. No universal
bundle threshold or Lighthouse score proves good UX or visual distinctiveness.

## Sources and verification status

Reviewed 2026-09-11; revalidate changeable vendor/library facts before applying.
The vendor documentation supports principles, not measured equivalence to a
rendered website. Record actual visual research separately via design-discovery.

- [Apple HIG: Layout](https://developer.apple.com/design/human-interface-guidelines/layout): hierarchy and alignment. A JavaScript-only fetch is not a rendered inspection.
- [Apple: Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/liquid-glass): native platform materials and content/control hierarchy.
- [Google Design: Illustrating the Gemini App](https://design.google/library/gemini-ai-visual-design): purposeful cues, shapes, and motion in a specific product identity.
- [Material Web official repository](https://github.com/material-components/material-web): Material 3 web components and declared maintenance status; distinguish specification from package choice.
- [WCAG 2.2: Contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
- [WCAG 2.2: Non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).
- [WCAG 2.2: Target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
- [WCAG 2.2: Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
