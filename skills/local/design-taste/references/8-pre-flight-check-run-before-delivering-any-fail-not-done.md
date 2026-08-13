# 8. PRE-FLIGHT CHECK (run before delivering; any fail = not done)

Hybrid pages (§0) apply the Brand vs Funnel checks per block, by that
block's mode.

Universal:
- [ ] Mode + design read declared; dials stated and reasoned
- [ ] Design-context / repo tokens checked FIRST and used verbatim if
      present (§1.5); new real decisions written back to design-tokens.md
- [ ] ZERO em-dash/en-dash-separator in visible copy
- [ ] One accent color, one neutral family, one radius system, one theme; at
      most one deliberate full-page theme-switch device, brief-justified (§4.2)
- [ ] Light default designed, not accepted: stated warm/cool temperature, ≥ 3
      neutral steps, hairlines over blanket shadows, 2-3 contrast-passing ink
      levels (§4.2.1) — unless the project spec (§1.5) sets another canonical
      theme, which wins
- [ ] Greyscale check: with `filter: grayscale(1)`, section boundaries, primary
      vs secondary ink, and the primary CTA are still distinguishable by type
      scale, weight, spacing, or neutral step alone
- [ ] Every CTA and form element passes WCAG AA contrast; no CTA wraps at
      desktop
- [ ] Real images per §4.6 — no div fake-screenshots, no text-only page
- [ ] No Section 5 AI tells (mechanical scan: eyebrow count ≤
      ceil(sections/3), no `·` chains, no decorative dots, no
      overlay pills, no version/locale strips, no scroll cues)
- [ ] Copy self-audit done; numbers real or labeled mock
- [ ] Motion: only transform/opacity, reduced-motion honored, no scroll
      listeners, every animation justified in one sentence
- [ ] Mobile collapse specified per multi-column section — either a named
      breakpoint or a declared `auto-fit` min track (§4.7); `100dvh` not
      `h-screen`; form inputs ≥ 16px (no iOS zoom); tap targets ≥ 44px;
      visible focus ring on every interactive element
- [ ] Loading/empty/error states exist where data renders
- [ ] Web vitals plausible (LCP < 2.5s, INP < 200ms, CLS < 0.1); validate
      with the project's own scripts, `web-perf` skill for a real audit

Brand mode additionally:
- [ ] Hero: ≤ 2-line headline, ≤ 20-word subtext, CTA above fold, ≤ 4 text
      elements, logos below hero
- [ ] ≥ 4 layout families per ~8 sections; ≤ 2 consecutive zigzags; no
      split-headers; bento cells = content count with visual variety
- [ ] One CTA label per intent; quotes ≤ 3 lines
- [ ] Dark mode: either genuinely out of scope, or designed (not inverted),
      eyeballed in both themes, `color-scheme` set, three-state toggle,
      stored choice beating `prefers-color-scheme`, and no flash before
      first paint (§4.2.1)

Funnel mode additionally:
- [ ] Sticky/repeated CTA identical wording; order form fields untouched
      for tracking; urgency claims backed by real data; MOT ≤ 3 and zero
      animation-library JS shipped
