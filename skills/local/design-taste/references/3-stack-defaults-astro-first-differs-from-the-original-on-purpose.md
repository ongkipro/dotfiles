# 3. STACK DEFAULTS (Astro-first — differs from the original on purpose)

Climb this ladder; stop at the first rung that holds (see `native-first`):

1. **Static Astro component + plain CSS.** Most sections need zero JS.
2. **CSS-only motion:** transitions, `animation-delay` cascades, CSS
   scroll-driven animations (`animation-timeline: view()`) with an
   `@supports` fallback to static. Covers most MOT 4-7 needs.
3. **Vanilla JS + IntersectionObserver** in a `<script>` tag for reveal
   logic CSS can't express.
4. **GSAP + ScrollTrigger** only for real pin/scrub scrolltelling (MOT
   8-10). Load the `gsap-scrolltrigger` / `gsap-core` skills for canonical
   code; lazy-load GSAP below the fold.
5. **Framework island** (React/Svelte) only when the section is genuinely
   interactive stateful UI, never just for animation. In React projects,
   Motion (`motion/react`) and `shadcn-ui` skill apply.

Taste rules in this skill are stack-agnostic; this section's ladder is for
Astro/JS projects. On Shopify Liquid themes keep the judgment and route
code to the official shopify plugin skills.

Hard rules regardless of rung:

- **Motion must be motivated.** Valid reasons: hierarchy, storytelling,
  feedback, state transition. "It looked cool" is not a reason; if you
  cannot state the reason in one sentence, drop the animation.
- **Motion claimed = motion shown.** A page declaring MOT > 4 must
  actually move (hero entry, scroll reveals, CTA hover at minimum). If
  you cannot ship working motion in scope, drop the dial to 3 and ship a
  clean static page; never half-build motion that breaks.
- Animate ONLY `transform` and `opacity`. `will-change` sparingly.
- Grain/noise overlays only on fixed `pointer-events-none`
  pseudo-elements, never on scrolling containers (continuous GPU repaints
  destroy mobile FPS).
- `window.addEventListener('scroll')` and scroll math in state are banned →
  IntersectionObserver / ScrollTrigger / CSS scroll-driven only.
- Any motion above MOT 3 honors `prefers-reduced-motion` (CSS: gate behind
  `@media (prefers-reduced-motion: no-preference)`).
- `min-h-[100dvh]` for full-height heroes, never `h-screen`.
- Grid over flex-percentage math.
- Fonts self-hosted with `font-display: swap` (or `astro:assets` fonts /
  `next/font`); never a Google Fonts `<link>` in production.
- Dependency discipline (check installed deps before importing, prefer
  the platform built-in) is owned by `native-first`; apply it as-is.
- **Icons:** reuse whatever the project already uses. If none: one library
  max per project (`@phosphor-icons/react` class or an Astro-friendly SVG
  set), standardized strokeWidth. Hand-rolling a SIMPLE geometric mark
  (circle, monogram, wordmark) is fine per lazy-dev rules; hand-drawing
  complex icon paths is not.
- Emoji in UI: off by default; only for an explicitly playful/social brief.
