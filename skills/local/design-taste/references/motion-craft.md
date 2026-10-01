# Motion Craft: Timing, Easing, Choreography

Numeric starting points for web motion once a surface has earned motion
(`SKILL.md` §2: restrained feedback by default). Values are starting ranges to
tune on a real render, not laws. Direction and the motion thesis stay with
`impeccable` (`reference/animate.md`); GSAP API detail stays with the `gsap-*`
skills. This file supplies the numbers and the decision order.

Adapted from LottieFiles' `motion-design-skill` (MIT) and Emil Kowalski's
`skills` (MIT), paraphrased and filtered to what fits a restrained public-web
policy.

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
5. **Fallback:** the reduced-motion path (§6) is designed with the animation.

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
  objects despite tuned easing, add a small blur (a few px, always under 20px)
  during the transition. Heavy blur is expensive, especially in Safari.
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

```css
@media (prefers-reduced-motion: reduce) {
  * , *::before, *::after { animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
```

The blanket reset is a floor, not the design: also swap the specific cases above
and keep meaningful feedback visible. In GSAP use `gsap.matchMedia()`.

## 7. Modern CSS first, with fallbacks

Prefer native CSS before a library (`native-first`). Re-verify support before
relying on any feature; the platform moves quickly.

| Need | Native option | Guard |
| --- | --- | --- |
| Enter/exit from `display:none` | `@starting-style` + `transition-behavior: allow-discrete` | plain state change fallback |
| Animate to `height:auto` | `interpolate-size: allow-keywords` | instant toggle |
| Scroll-linked progress/reveal | `animation-timeline: scroll()/view()` inside `@supports` | content visible by default |
| Cross-page / state continuity | View Transitions API | no-transition fallback |
| Sibling stagger without JS | `sibling-index()` where supported, else a CSS var set per item | uniform timing |
| Popover / tooltip placement | popover attribute + anchor positioning | positioned fallback |

Content must be visible and usable in the default (unsupported) state.

## 8. Quality checklist

Critical (block delivery):
- No essential content hidden until a script or animation runs.
- Reduced-motion path exists and was checked; no autoplay flashing >3/second.
- No animation of layout properties in a hot path; no jank on a mid-range phone.
- Interruption works: re-triggering mid-animation, rapid hover, route change.

Important:
- Every animation answers "what would be lost if this were removed?"
- Durations/easings come from the tokens above, not per-element values.
- Exits are shorter than entrances; nothing repeated exceeds ~300ms.
- Offscreen and hidden-tab loops are paused.

## 8.1 Review method

Judge feel on the render, not in code: play at 2-5x duration (or the DevTools
animation inspector), step frame by frame to catch properties drifting apart,
test gestures on a real device, and look again the next day. Fix in this order
and stop when it feels right: **delete** the animation → **reduce** distance,
scale, or count → **easing** token → **origin** → make it **interruptible** →
move it to GPU-friendly properties → **asymmetric timing** (slow where the
user decides, fast where the system responds) → polish.

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Feels sluggish | duration too long for its frequency, or ease-in on entry | shorten, ease-out |
| Feels mechanical | linear/one easing everywhere | tokens per role, exit shorter |
| Choppy | animating layout properties, big blur/filter, main-thread work | transform/opacity, isolate layer, measure |
| Distracting | too many things moving, ambient loops | one lead element, cut ambient |
| Flash of content then animation | animation starts after paint | set initial state in CSS, animate from it |
| Different on phone | uncapped DPR/effects, no mobile scaling | scale durations, tier effects (`threejs` skill for canvas) |
