---
name: design-taste
description: >-
  Visual direction and critique for public web pages: company profiles, landing/sales pages, portals, docs, storefront visuals. Not admin UI (admin-dashboard), commerce behavior (storefront-ux), copy, or SEO. Triggers: bikin website, compro, redesign.
---

# Design Taste — public frontend

A page is good when its reader understands the offer, trusts it, and can act.
Every visual decision traces to the reader's task, the real content, or an
inspected reference. If none of those explains a choice, drop it.

Paths below are relative to this skill's directory
(`~/dotfiles/skills/local/design-taste/`). "Owner" = the client whose site it
is. Read only this file up front; open a reference file when a step names it.

**Pick the path first:**
- Small change inside an accepted system (spacing, a component, copy slot):
  preserve the system, do it, run §5. Nothing else.
- New page or redesign: §1 → §2–§4 → §5.

No `design/brief.md` + `DESIGN.md` yet: start with `dotuiux init`/`teardown`
(skill `dotuiux`); run `dotuiux check <url>` before calling the UI done.

## 1. Before any visual edit (new page or redesign)

1. **Read what exists**: pages, content, assets, brand tokens, routes, and the
   `UI & Design` lines in `~/.config/ai/memory/preferences.md` (`rg -n 'UI & Design'`).
   Explicit user direction and an accepted repository design contract outrank
   this skill; preferences marked Invariant apply everywhere.
2. **Name the surface and its job** in one line ("compro for B2B logistics
   buyers: is this firm real and right for me?"). Open only the matching
   entry in [surface-catalog.md](references/surface-catalog.md):
   `rg -n '^### ' references/surface-catalog.md` lists them (Company profile,
   Landing page, Sales page, Advertorial, Storefront, Marketplace, Directory,
   Booking, Blog/docs, Portal, …); read that `###` block plus §0 (claims,
   identity, consent rules for ID/MY). Admin and operator screens go to
   `admin-product-ux` + `admin-dashboard`.
3. **Outline before layout**: sections in reading order, each with the one
   thing it must let the reader do; the states that matter. Missing content
   becomes a list for the owner; copy is written through `copywriting`.
4. **Inspect one or two references.** Find candidates with web search using
   the queries at the end of the surface entry (or the niche file); pick
   sites whose job matches. Capture: `node scripts/ui-ref.mjs capture <url>
   --out design/refs/<name>`, then open the PNGs. A supplied image counts. A
   URL list or a reference recalled from memory does not. Method only if
   needed: [design-discovery.md](references/design-discovery.md).
5. **Write the decision** into the project's `DESIGN.md` (create it at the
   repo root if none exists; if an accepted spec already holds design
   decisions, extend that instead of adding a second file), this short:

   ```markdown
   ## Direction — <page>
   Surface/job: …
   References: design/refs/<name> — what transfers: …
   Sections (in order): …
   Type / color / shape: …
   Composition contract (reference-driven only): C1 … C2 …
   ```

## 2. Direction rules

- **No brand yet.** Pick one primary color from the subject and references,
  derive the scale and a type pairing with
  [color-scales-and-skinning.md](references/color-scales-and-skinning.md),
  and set the business name as a plain wordmark in the display face; record
  all three as provisional in `DESIGN.md`. No logo mark is invented.
- **Typography.** Brand type first; a system stack for utilitarian surfaces.
  Clear hierarchy, 60–75ch prose measure as a starting point, `clamp()` sizes
  that keep a rem part, `text-wrap: balance`/`pretty` instead of `<br>`. Display
  tracking (≥24 px) at most −0.02em unless `DESIGN.md` says tighter. Test
  long titles and translations.
- **Color, shape, elevation.** Semantic tokens for canvas, text, action,
  border, state. One small radius and shadow vocabulary with fixed purposes.
  Hierarchy comes from scale, whitespace, alignment, and media placement
  before another container; between sections the owner's default is
  whitespace or a background shift, not a rule.
- **Theme.** Light is the fallback; accepted dark-first brands stay dark-first.
  A second theme is optional and must be designed, not inverted. Adaptive
  resolution: stored choice → system → fallback, resolved before first paint
  ([theme-implementation.md](references/theme-implementation.md)). When both
  themes ship, the toggle is three-state: Light / Dark / System.
- **Icons and assets.** Inline Lucide SVG on static sites, `lucide-react`
  where React is installed; one stroke weight, `currentColor`, `aria-hidden`
  beside a text label. Diagrams, crops, generated imagery, OG cards:
  [visual-asset-and-svg-craft.md](references/visual-asset-and-svg-craft.md).
- **Motion.** Restrained feedback by default; narrative motion only when it
  explains something and degrades under reduced motion
  ([motion-craft.md](references/motion-craft.md)).
- **Layout.** Repeat structure for comparable items; change it where the
  information changes. Hero size follows content. Plan the narrow
  transformation, not a scaled desktop. Keep DOM order meaningful.
- **Content.** Real content early. Approved brand assets first; generated
  imagery only as labelled illustration. Never invent customers, metrics,
  ratings, scarcity, "best seller" badges, timestamps, version strings, or
  citations to fill a slot — use a labelled placeholder the owner replaces.
  Markers that models add to look authentic:
  [invented-info-tells.md](references/invented-info-tells.md).
- **Distinct from the owner's other sites.** Reuse of a font, radius, or
  composition is fine when it fits this audience; reuse by habit is not.
  Shape language is a per-project research decision, not a house look.

## 3. Restraint — what not to add

Every element earns its place by helping the reader read, compare, trust, or
act. If removing it changes nothing for the reader, remove it.

- **Sections.** Only the sections the task needs. A compro needs offer,
  proof, how it works, contact — not also stats, logos, FAQ, testimonials,
  blog teaser, and newsletter because a template had slots for them.
- **Components.** No card, badge, pill, chip, icon tile, eyebrow label,
  divider, or shadow unless it groups or separates something the eye would
  otherwise miss. One container level; no boxes inside boxes.
- **Lines.** Between sections use whitespace or a background shift. A rule
  (`border-t`, `<hr>`) needs a recorded reason; never a border around every
  block, under every heading, and between every list item at once.
- **Text.** One headline that states the offer; body in the reader's words;
  no kicker above every heading, no summary paragraph repeating the heading,
  no filler sentence explaining what the next section is about. Cut adjectives
  that carry no information (premium, modern, seamless, powerful).
- **Navigation.** One primary nav with ≤ 6 items named after what the reader
  is looking for; the current page is visibly marked; one primary action per
  page, placed where the decision happens; footer repeats contact and legal,
  not the whole sitemap in four columns. No duplicate menus, no mega menu for
  five pages, no sticky bars stacked on sticky bars.
- **Decoration.** No gradients, blobs, glows, glass, abstract illustrations,
  or animated reveals as filler. Imagery is the owner's real product, place,
  or work; otherwise a labelled placeholder.

**Generic-page test.** At planning and again on the render, swap the business
name out in your head. If the page still reads as plausible for an unrelated
business, its direction is unsupported. Usual causes: badge → centered
headline → paragraph → two buttons → screenshot; the same 3-column card grid
for unrelated information; a bordered box around every section; equal weight
everywhere; cards because a `Card` primitive existed; a distinctive reference
flattened into a standard grid. Any of these can be right when the content
calls for it — a pricing comparison may be equal cards. Fix the unsupported
decision, not every familiar pattern, and fix composition before adding
decoration.

## 4. Implementation

Semantic HTML, CSS custom properties, responsive CSS, native controls, the
project's existing framework and components. Client JavaScript only for
behavior that needs it; no framework migration or universal component package
for styling. `native-first` decides dependencies; the framework skill owns
implementation. Default foundation when nothing is accepted:
[public-web-foundation.md](references/public-web-foundation.md).

For a reference-driven build, two passes: **macro** (reading order, page
frame, section rhythm, hero geometry, responsive transformation — render
narrow and wide before any detail), then **refinement** (tokens, type detail,
states, motion, polish). Skip the split for a small change.

Accessibility floor: real links for navigation, buttons for actions, visible
labels, errors that name the field and keep the input, keyboard order and
visible focus, no hover/color/drag-only meaning. WCAG AA text contrast 4.5:1
(3:1 large), 3:1 for required non-text indicators, measured on composited
colors with `python3 scripts/contrast.py "<fg> on <bg>"`. 44 px touch targets
as the house baseline (WCAG 2.2 minimum is 24 px). Checklist:
[accessibility-notes.md](references/accessibility-notes.md).

## 5. Done means seen

1. Render each changed view at ~390 px and ~1280 px (project dev server +
   the browser tool available in this runtime, or the project's Playwright)
   and open the images.
   A build or an overflow number is not a look.
2. Critique against §3 and the recorded direction; fix; re-render. Reference-
   driven: check each `C` item.
3. `ui-validation` for behavior, keyboard, states, both themes.
4. Report behavior and visual acceptance separately: PASS / REVISE /
   UNVERIFIED. Not rendered or not opened = UNVERIFIED, never "provisional".
   Name what was not checked.

Read-only reference access does not authorize live submissions; use fixtures
or a sandbox for purchase, account, and destructive flows.

## 6. Open only when the task needs it

| When | Reference |
| --- | --- |
| Choosing between several references, or recording a composition contract | design-discovery.md |
| Matching a strong reference's geometry exactly, then improving it | reference-fidelity.md |
| Editorial / media / funnel page, or a redesign of a live site | surface-and-mode-rules.md |
| Starting a brand in a listed niche (F&B, skincare, logistics, SaaS, …) | niche-patterns/README.md |
| New brand: palette from one seed color, type pairing; skinning a shared template | color-scales-and-skinning.md |
| Reviewing someone else's page, or changing this skill | design-evaluation.md |
| Storefront or marketplace visuals | public-experience-patterns.md |
| Claims, consent, and identity rules for ID/MY pages | surface-catalog.md §0 |

Pair with: `copywriting`/`writer` (words), `seo-website-builder`,
`storefront-ux`/`storefront-development` (commerce), `astro-development`/
`nextjs-development` (framework), `shadcn-ui` (React components only where
appropriate), `ui-validation` (browser evidence), `web-perf`.
