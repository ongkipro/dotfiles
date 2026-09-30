# Motion Craft: Timing, Easing, Choreography

Numeric starting points for web motion once a surface has earned motion
(`SKILL.md` §2: restrained feedback by default). Values are starting ranges to
tune on a real render, not laws. Direction and the motion thesis stay with
`impeccable` (`reference/animate.md`); GSAP API detail stays with the `gsap-*`
skills. This file supplies the numbers and the decision order.

Adapted from LottieFiles' `motion-design-skill` (MIT), filtered to what fits a
restrained public-web policy.

## 1. Decide in this order

1. **Purpose:** feedback, orientation (where did this come from), hierarchy, or
   one authored focal moment. No purpose, no motion.
2. **Frequency:** the more often it plays, the shorter and quieter it is.
   Hover ≈100ms opacity/color; routine state 150-300ms; a one-time entrance may
   run 500ms+. Nothing repeated should exceed ~300ms.
3. **Personality (optional):** pick one and hold it site-wide. A mixed palette
   reads as unfinished.
4. **Property:** transform/opacity by default; add clip-path, mask, blur or
   filter only when the meaning needs them and they measure smooth.
5. **Fallback:** the reduced-motion path (§6) is designed with the animation.

## 2. Duration by element

| Element | Duration | Notes |
| --- | --- | --- |
| Tooltip, micro-feedback | 80-120ms | must feel instant |
| Button, toggle, checkbox | 120-180ms | press feedback under 100ms of latency |
| Dropdown, popover, tab indicator | 150-250ms | |
| Card lift, accordion | 200-350ms | |
| Modal, drawer, sheet | 250-400ms | |
| Page / route / view transition | 300-500ms | 600ms only for an authored moment |

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

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Feels sluggish | duration too long for its frequency, or ease-in on entry | shorten, ease-out |
| Feels mechanical | linear/one easing everywhere | tokens per role, exit shorter |
| Choppy | animating layout properties, big blur/filter, main-thread work | transform/opacity, isolate layer, measure |
| Distracting | too many things moving, ambient loops | one lead element, cut ambient |
| Flash of content then animation | animation starts after paint | set initial state in CSS, animate from it |
| Different on phone | uncapped DPR/effects, no mobile scaling | scale durations, tier effects (`threejs` skill for canvas) |
