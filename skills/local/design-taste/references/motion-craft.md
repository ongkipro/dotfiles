# Motion Craft: Timing, Easing, Choreography

Numeric starting points for web motion once a surface has earned motion
(`SKILL.md` §2: restrained feedback by default). Values are starting ranges to
tune on a real render, not laws. Direction and the motion thesis stay with
`SKILL.md`; GSAP API detail stays with the `gsap-*`
skills. This file supplies the numbers and the decision order.

Adapted from LottieFiles' `motion-design-skill` (MIT), Emil Kowalski's
`skills` (MIT), Motion's `ai-kit` (MIT per its package.json), ibelick's
`ui-skills` `fixing-motion-performance` (MIT), and the Vercel Web Interface
Guidelines (MIT), paraphrased and filtered to what fits a restrained public-web
policy. Platform support with dates: [motion-platform-support.md](motion-platform-support.md).
Researched 2026-10-08; sources in that file.

## 1. Decide in this order

1. **Purpose:** feedback, orientation (where did this come from), hierarchy, or
   one authored focal moment. No purpose, no motion.
2. **Frequency gate:** the more often it plays, the shorter and quieter it is.
   Actions triggered from the keyboard or used about 100+ times a day (command
   palette, shortcuts, list navigation) get **no animation**; deleting the
   animation is often the best fix. Hover ≈100ms opacity/color; routine state
   150-300ms; a one-time entrance may run 500ms+. Nothing repeated should exceed
   ~300ms. A motion proposal lists the candidates it rejected and why, so the
   reviewer sees what was deliberately left still.
3. **Personality (optional):** pick one and hold it site-wide. A mixed palette
   reads as unfinished.
4. **Property:** transform/opacity by default; add clip-path, mask, blur or
   filter only when the meaning needs them and they measure smooth.
5. **Tool:** the cheapest that works (§7.1): CSS transition (state, hover) →
   `@starting-style` (mount) → CSS animation (predetermined; stays smooth under
   main-thread load) → WAAPI `element.animate()` → a library. Never install a
   library for a fade. In React/Vue the framework removes an unmounting node at
   once, so an exit animation needs `AnimatePresence` (Motion) or an
   equivalent; CSS alone cannot animate it.
6. **Fallback:** the reduced-motion path (§6) is designed with the animation.

## 2. Duration by element

| Element | Duration | Notes |
| --- | --- | --- |
| Tooltip, micro-feedback | 80-200ms | low end for micro-feedback, up to ~200ms for a tooltip; chained tooltips instant (§5.1) |
| Button, toggle, checkbox | 120-180ms | press feedback under 100ms of latency |
| Dropdown, popover, tab indicator | 150-250ms | |
| Card lift, accordion | 200-350ms | |
| Modal, drawer, sheet | 250-400ms | |
| Page / route transition | 150-300ms | View Transitions crossfades sit at the short end; an authored one-off moment (launch, story section) may run longer |

- **Exit ≈ 65-75% of entrance** duration, quieter (often opacity only).
- **Distance scaling:** short travel (<50px) sits at the low end; long travel
  (>300px) at the high end. Constant duration for different distances looks
  wrong.
- **Latency ceilings:** hover response <100ms, press <150ms, drag start <50ms.
  Long feedback reads as lag, not polish.
- Mobile: shave ~20%. Never block interaction behind an intro.
- Evidence: NN/g (Laubheimer, 2020) puts most UI animation at 100-400ms and
  says animations start to feel like "a real drag" at 500ms; Emil Kowalski keeps
  UI animation under 300ms.

## 3. Easing tokens

Define once as custom properties and reuse; do not hand-tune per component.

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* arrivals, reveals */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);       /* exits only */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* on-screen repositioning */
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 400ms;
}
```

- Entries decelerate (ease-out); exits accelerate (ease-in); movement that
  stays on screen uses ease-in-out. Never ease-in an entrance.
- **Known disagreement:** some practitioners use ease-out for exits too,
  arguing that an ease-in start delays the moment the user is watching. Both are
  defensible. These tokens keep ease-in for exits because exits here are short
  (§2) and quieter; a project may choose ease-out exits instead, but record the
  choice and reason in its design artifact and apply it everywhere.
- `linear` is for opacity fades, progress, and continuous loops only.
- Never `scale(0)` for an entrance; start from ~0.95 with opacity.
- Overshoot/bounce/elastic only when the brand personality is playful, capped
  at ~10% overshoot, and never on errors or destructive confirmations.
- Hover and color changes may use plain `ease`; the role tokens are for
  movement.
- **Springs** suit gestures, sheets, layout moves, and toggles. Reference
  values (Material 3 tokens in androidx source, damping ratio / stiffness):
  Standard scheme spatial fast 0.9/1400, default 0.9/700, slow 0.9/300;
  effects (opacity, color) 1.0/3800, 1600, 800. Expressive scheme spatial
  fast 0.6/800, default 0.8/380, slow 0.8/200. SwiftUI's `spring` and
  `smooth` default to 0.5s with zero bounce. Use the Standard scheme for
  commerce, DR/COD, and admin; Expressive only for a playful brand.
- **CSS springs** exist as sampled `linear()` easings (Widely available since
  2026-06): fixed duration, and they cannot carry velocity when interrupted,
  so gestures need a real spring (Motion, GSAP Inertia). Time sibling
  animations from the requested duration, not the longer settle time.
- Material 3 durations for comparison: short 50-200ms, medium 250-400ms, long
  450-600ms; emphasized easing `cubic-bezier(0.2, 0, 0, 1)`. IBM Carbon:
  70/110/150/240/400/700ms with productive and expressive curves.
- GSAP mapping: `power3.out` ≈ ease-out, `power2.in` ≈ ease-in,
  `power2.inOut` ≈ ease-in-out; use `CustomEase` only for a token above that
  no named ease matches (see `gsap-core`, `gsap-plugins`).

## 4. Personality archetypes (pick at most one)

| Archetype | Durations | Easing | Overshoot | Fits |
| --- | --- | --- | --- | --- |
| Premium / editorial | 300-600ms | long ease-out, slow | none | luxury, portfolio, editorial |
| Corporate / utility | 120-250ms | plain ease-out | none | SaaS, docs, checkout |
| Energetic | 150-300ms | sharp ease-out | small | sports, launches, youth brands |
| Playful | 200-400ms | ease-out with spring feel | up to ~10% | consumer, kids, games |

Storefront and DR/COD flows default to Corporate/utility: motion must never
delay price, variant, cart, or form feedback.

## 5. Choreography budgets

- **Stagger:** list 40-60ms per item, grid 50-80ms, nav cascade 30-50ms;
  keep the total under ~400ms (cap the count, not just the step) and only for
  a set that arrives together. Do not stagger every scrolled section.
- **One hero at a time:** at any moment one element leads; supporting elements
  follow within ~100-200ms; no more than about a third of visible elements move
  at once.
- **Direction consistency:** the same kind of thing enters from the same
  direction; a panel exits the way it came in.
- **State feedback:** press = subtle scale (~0.97) or shade change under 100ms;
  hover-out may be slower than hover-in; error = a short (<400ms) horizontal
  nudge or color change with text, no overshoot; success = brief confirmation
  that resolves, not a celebration on routine actions; loading = skeleton
  shimmer with a slow (~1.5-2s) period, stopped when content arrives.
- **Ambient loops** (breathing scale 0.98-1.02 over 2-4s, float ±5-15px,
  layered parallax): decorative only, fewer than ~20 concurrent elements, paused
  offscreen and when the tab is hidden, and removed under reduced motion.

## 5.1 Interaction details

- **Interruptible by default:** anything that can re-trigger rapidly (toggles,
  toasts, hover) uses CSS **transitions**, which retarget from the current
  value; keyframe animations restart from zero and jump. Gestures a user may
  reverse mid-motion settle with a spring, which keeps velocity.
- **Origin from the trigger:** popovers, menus, and dropdowns scale from the
  element that opened them. Headless libraries expose the origin
  (Radix: `var(--radix-<component>-content-transform-origin)`, e.g.
  `--radix-popover-content-transform-origin`; Base UI: `var(--transform-origin)`).
  Modals and dialogs are exempt: they are not anchored, keep `center`.
- **Tooltip chaining:** keep the initial delay so tooltips do not fire on a
  passing cursor; once one is open, neighbours open instantly with no animation.
- **Hover motion is pointer-only:** wrap hover movement in
  `@media (hover: hover) and (pointer: fine)` so touch devices do not get stuck
  hover states. Color/opacity feedback may stay unguarded.
- **Hold to confirm:** the press fills slowly and linearly (around 1.5-2s) so the
  user can still decide; release snaps back fast (~200ms ease-out). Pair with a
  small press scale and a keyboard/AT alternative (confirmation dialog or
  explicit button), never hold-only.
- **Clip-path recipes** (`clip-path: inset(t r b l)`, GPU friendly, no extra
  layout): a tab indicator whose active color swaps by clipping a duplicate
  label row; a reveal from `inset(0 0 100% 0)` to `inset(0)`; a **before/after
  comparison slider** (two stacked images, the top one clipped by the handle
  position) — useful on beauty or renovation detail pages when the images are
  real, consented, and unretouched (see invented-info-tells.md).
- **Blur masks a crossfade seam:** when two overlapping states read as two
  objects despite tuned easing, add a small blur during the transition: about
  8px or less, one-shot only, never continuous or on large surfaces, hard
  ceiling 20px. Blur is expensive to paint, especially in Safari.
- **SVG transforms:** apply them to a `<g>` wrapper with
  `transform-box: fill-box` so the origin is the shape, not the viewport.
- **Animate the element, not its parent's variable:** driving child
  `transform`s from a CSS custom property on a parent recalculates style for
  every child each frame. Set `transform` on the moving element directly.

## 5.2 Gesture and drag

| Concern | Practice |
| --- | --- |
| Tracking | `setPointerCapture` once the drag starts so it continues outside the element |
| Intent | ~10px of travel (hysteresis) before committing to a drag, and lock the axis so a horizontal swipe does not fight page scroll |
| Dismissal | decide by velocity as well as distance: a flick above roughly 0.11 px/ms dismisses even when short |
| Where it was going | project the release point from velocity with exponential decay (deceleration rate around 0.998) and commit on the projected position |
| Edges | rubber-band past a boundary: resistance grows with overshoot (constant around 0.55) instead of a hard stop |
| Settling | a spring that inherits release velocity; low bounce (damping near critical) for sheets and drawers, more only for playful brands |
| Interrupt | a new animation starts from the live on-screen value, never from the old target |
| 1:1 tracking | the element follows the pointer for the whole drag; do not animate only on release |
| Multi-touch | ignore extra touch points once a drag has started |
| 2D settle | separate X and Y springs so each axis keeps its own velocity |
| Fallback | every drag action also has a button or keyboard path (`accessibility-notes.md`) |

Values are starting points to tune on a real phone, not constants to copy.

## 6. Reduced-motion substitution

Reduced motion means fewer and gentler animations, not none. Keep animations
that carry state; replace the vestibular triggers.

| Default | Reduced-motion replacement |
| --- | --- |
| Slide / travel | short cross-fade |
| Spring / overshoot | ease-out, no overshoot |
| Parallax, scroll-linked drift | static |
| Zoom / large scale, spin | fade |
| Autoplay video / looping ambient | paused, poster frame |
| Smooth scroll hijack | native scroll |

Default pattern: under reduce, remove movement (translate, scale, rotate,
parallax, scroll-linked transforms) and keep opacity and color feedback, so
state changes stay visible. This is how Motion's
`<MotionConfig reducedMotion="user">` and the Next.js View Transitions guide
behave.

```css
@media (prefers-reduced-motion: reduce) {
  .reveal, .slide-in, .card:hover { transform: none; }
  .reveal { transition-property: opacity; }
  ::view-transition-group(*), ::view-transition-old(*),
  ::view-transition-new(*) { animation: none; }
  .parallax, .marquee { animation: none; }
}
```

A blanket `animation-duration: 0.01ms` reset on `*` removes feedback too and
breaks `animationend` logic; use it only as a last-resort floor on an
inherited codebase, never as the design. In GSAP use `gsap.matchMedia()`.
WCAG: 2.2.2 (A) pause/stop/hide anything moving over 5s; 2.3.1 (A) no more
than three flashes per second; 2.3.3 (AAA) motion triggered by interaction
can be disabled (color, opacity, and blur alone do not count as motion).
`prefers-reduced-motion` appears on about half of pages (Web Almanac 2025).

### 6.1 Smooth scrolling

No Lenis or ScrollSmoother by default: they fight keyboard, scrollbar, anchor,
and find-in-page scrolling, break scroll-snap and iframes, and read as an
agency-template tell. Allow only to sync a WebGL scene with scroll, with
`anchors: true`, reduced motion honored, and keyboard and scrollbar
scrolling tested.

## 7. Modern CSS first, with fallbacks

Prefer native CSS before a library (`native-first`). Support status and dates
are in [motion-platform-support.md](motion-platform-support.md); re-verify
quarterly. As of 2026-10, Firefox has no scroll-driven animations and no
cross-document View Transitions, and `interpolate-size` is Chromium-only.

| Need | Native option | Guard |
| --- | --- | --- |
| Enter/exit from `display:none` | `@starting-style` + `transition-behavior: allow-discrete` | plain state change fallback |
| Animate to `height:auto` | `interpolate-size: allow-keywords` | instant toggle |
| Scroll-linked progress/reveal | `animation-timeline: scroll()/view()` inside `@supports` | content visible by default |
| Cross-page / state continuity | View Transitions API | no-transition fallback |
| Sibling stagger without JS | `sibling-index()` where supported, else a CSS var set per item | uniform timing |
| Popover / tooltip placement | popover attribute + anchor positioning | positioned fallback |

Content must be visible and usable in the default (unsupported) state.

**View Transitions craft** (Next.js View Transitions guide, 2026-09; Chrome
docs): use them for navigation-level changes (route, thumbnail → detail,
tab or theme swap), not for interaction-heavy or interruptible UI; one shared
named element per transition; `::view-transition { pointer-events: none }`
is set by default, so keep transitions short (crossfade ~150-250ms, morph
≤400ms); anchor persistent chrome (header) with its own name or none; use
transition types for direction (forward/back); include the reduced-motion
block from §6. In Astro prefer `@view-transition { navigation: auto }` and use
`<ClientRouter />` only when `transition:persist`, a fallback, or
`navigate()` is needed (`native-first` astro reference).

### 7.1 Library choice

| Need | Use | Notes |
| --- | --- | --- |
| State, hover, mount/unmount of native elements | CSS transitions, `@starting-style` | no dependency |
| Predetermined or scroll-linked effect | CSS animation, scroll timelines in `@supports` | runs off the main thread |
| Imperative one-off without a framework | WAAPI `element.animate()` | interruptible, returns a promise |
| React/shadcn springs, layout, exit, drag | Motion (`motion` 14.x, MIT) | import from `motion/react`; never install alongside `framer-motion` |
| Timelines, pinning, scrub, SVG morph, text splitting | GSAP (3.15, `gsap-*` skills) | free incl. all plugins since 2025-04-30 under the GSAP Standard no-charge license, not an OSI license; it forbids building a tool that competes with Webflow's visual animation builder |
| Illustrated interactive states | Rive or dotLottie | canvas has no accessibility tree: add text alternatives and a static poster |
| List add/remove/move with no design input | auto-animate | turns itself off under reduced motion |

Avoid: Theatre.js (public development dormant since 2024), `vaul` (README:
unmaintained; shadcn's Drawer moved to Base UI), Lenis by default (§6.1).

**Motion notes** (Motion `ai-kit` best practices, MIT): animating `transform`
as a string runs on WAAPI and the compositor; the `x`/`y`/`scale` shorthands
run on the main thread, so use them only to compose transforms or motion
values. Set `will-change` for CSS transitions and independent transforms only,
and remove it afterwards. `<MotionConfig reducedMotion="user">` at the root.
For API questions query `mcp.motion.dev` or `motion.dev/llms-full.txt`
rather than guessing; Motion+ (paid) components need the owner's consent.

## 8. Quality checklist

Critical (block delivery):
- No essential content hidden until a script or animation runs; the page works
  with JS off and in Firefox stable (no scroll-driven animations, no
  cross-document View Transitions).
- Reduced-motion path checked with `prefers-reduced-motion: reduce` emulated:
  no translate, scale, or parallax remains and state feedback is still visible.
  Nothing flashes more than three times per second; anything moving over 5s
  can be paused.
- Lighthouse shows no "non-composited animations" on key templates (40% of
  mobile pages had them, Web Almanac 2025); CLS ≤0.1 and INP ≤200ms on a
  throttled mid-range mobile profile. Compositor-friendly: transform, opacity,
  filter, clip-path; paint properties and CSS variables cost more; layout
  properties are not animated in a hot path (Motion performance tier list,
  2025-11).
- No animation driven by `scroll` events or `scrollY` polling (use scroll
  timelines or IntersectionObserver); every `requestAnimationFrame` loop has a
  stop condition; one animation system per component.
- Interruption works: re-triggering mid-animation, rapid hover, route change.
- Native scrolling, anchors, find-in-page, and Back/Forward behave normally.
- Animation libraries load only on routes that use them; canvas/3D/Rive have a
  static poster and a clamped device pixel ratio.

Important:
- Every animation answers "what would be lost if this were removed?"
- Durations/easings come from the tokens above, not per-element values.
- Exits are shorter than entrances; nothing repeated exceeds ~300ms.
- Offscreen and hidden-tab loops are paused.

## 8.1 Generated-motion tells

Remove these unless the design artifact records why this brand needs them:
fade-and-slide-up on every section, staggered letter-by-letter hero
headlines, glass cards over busy imagery ("Liquid Glass" revival; NN/g found
legibility problems, 2025-10), custom cursor followers, tilt-on-hover bento
cards, smooth-scroll libraries on brochure sites, marquee logo strips of
unknown companies, count-up numbers that are not real data, typewriter delay
on text that is already available, and shimmer/beam/border-glow buttons from
effect catalogs. Prefer one authored focal moment over scattered effects
(Anthropic `frontend-design`).

## 8.2 Review method

Judge feel on the render, not in code: play at 2-5x duration (or the DevTools
animation inspector), step frame by frame to catch properties drifting apart,
test gestures on a real device, and look again the next day. Fix in this order
and stop when it feels right: **delete** the animation → **reduce** distance,
scale, or count → **easing** token → **origin** → make it **interruptible** →
move it to GPU-friendly properties → **asymmetric timing** (slow where the
user decides, fast where the system responds) → polish.

## 8.3 Motion by surface

Defaults for all surfaces: `--dur-fast` 150ms / `--dur-base` 250ms /
`--dur-slow` 400ms, the easing tokens above, Standard-scheme springs only
through a library, `@starting-style` entry and exit on every dialog and
popover, the §6 reduced-motion pattern.

| Surface | Adopt | Avoid |
| --- | --- | --- |
| Company profile | native cross-document View Transition crossfade (~200ms); at most one hero entrance; a CSS scroll-driven progress bar or sticky-header shrink in `@supports`; hover lift on hover-capable pointers | smooth-scroll libraries, decorative WebGL, fade-up on every section, text splitting, glass, cursor effects |
| Storefront | thumbnail → product detail morph (≤400ms); add-to-cart feedback under 100ms; cart as a sheet; skeleton → content for 2-10s loads; gallery crossfade | anything that delays price, variant, cart, or checkout; parallax; autoplay carousels without pause; bouncy springs; 3D unless it is a product configurator |
| Landing / sales page | one authored focal moment (hero or one scroll-told section); a library lazy-loaded below the LCP element; count-up only for real figures | interaction-blocking intros, scroll-jacking, more than one text-split effect, glass over busy imagery |
| Advertorial (DR/COD) | essentially static; opacity-only reveals at most; video with poster and controls | motion near the CTA or form, smooth scroll, anything delaying content on low-end Android |
| Admin dashboard | corporate/utility timing 120-200ms; list add/remove with AnimatePresence or auto-animate; tab crossfade; Standard spring for sheets | motion on keyboard or high-frequency actions, chart entry animation on every refresh, View Transitions on table pagination, glass or backdrop blur |

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Feels sluggish | duration too long for its frequency, or ease-in on entry | shorten, ease-out |
| Feels mechanical | linear/one easing everywhere | tokens per role, exit shorter |
| Choppy | animating layout properties, big blur/filter, main-thread work | transform/opacity, isolate layer, measure |
| Distracting | too many things moving, ambient loops | one lead element, cut ambient |
| Flash of content then animation | animation starts after paint | set initial state in CSS, animate from it |
| Different on phone | uncapped DPR/effects, no mobile scaling | scale durations, tier effects (`threejs` skill for canvas) |
