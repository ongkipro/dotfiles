---
name: design-taste
description: >-
  Anti-slop design judgment for landing pages, marketing sites, storefront
  surfaces, portfolios, and redesigns. Declare a design read, set three
  dials, ship pages that don't look AI-templated. Two modes:
  Brand/Marketing (taste rules on) and DR/COD Funnel (conversion overrides
  aesthetics). Astro-first stack. Honors an existing design-context/token
  spec over its own defaults; emits design-tokens.md on new projects.
  Triggers: desain landing page, desain LP, layout LP, redesign situs,
  homepage design, hero section layout, 'kok keliatan AI banget',
  anti-slop, design review LP, ganti tampilan, portfolio site, storefront
  design, section layout, design tokens, design context. On 'bikin
  landing page' briefs, load together with astro-development: this skill
  leads visual direction, that one leads code. Pairs with
  astro-development, gsap-*, copywriting, seo-website-builder, shadcn-ui.
  NOT for admin/dashboard/data-dense UI (admin-dashboard), NOT for
  writing copy (copywriting/content), NOT a component installer.
---

# design-taste: Anti-Slop Design Judgment (Astro-first, funnel-aware)

Adapted from a public "tasteskill" for our stack and business. The original
assumed React/Next + Motion and pure brand-marketing pages. We build Astro on
Cloudflare Workers, and half our pages are direct-response COD funnels where
conversion beats aesthetics. Every rule below is contextual; read the brief
first, then pull only what fits.

---

## 0. MODE DETECTION (before anything else)

Pick ONE mode. It changes which rules fire.

| Mode | Signals | Rule set |
|---|---|---|
| **Brand / Marketing** | agency site, SaaS landing, portfolio, storefront home, "premium", "clean", brand awareness | All sections apply |
| **DR / COD Funnel** | LP produk COD, ads funnel, Scalev/order form, "yang penting convert", quiz/geo funnel | Sections apply EXCEPT the overrides in Section 6 |

If a page is both (storefront home that also sells), default Brand mode for
the shell, Funnel mode for the product/offer blocks.

Out of scope entirely: admin panels, dashboards, data tables, multi-step
product UI → use the `admin-dashboard` skill. Say so and stop.

## 1. DESIGN READ (one line, before any code)

State: **"Reading this as: <page kind> for <audience>, <mode>, with a <vibe>
language, leaning toward <aesthetic family / system>."**

- Read signals: page kind, vibe words the user used, reference URLs or
  screenshots, audience, existing brand assets, quiet constraints
  (trust-first commerce, regulated, accessibility-first). Constraints
  OVERRIDE aesthetic preference.
- Ambiguous brief → ask exactly ONE clarifying question. Confident → declare
  the read and proceed.
- **Anti-default discipline:** never default to AI-purple gradients, centered
  hero over dark mesh, three equal feature cards, glassmorphism everywhere,
  Inter + slate-900. These are the LLM defaults; reach past them
  deliberately.

## 1.5 DESIGN CONTEXT PRECEDENCE (tokens beat taste)

If the session or project carries a design spec — a `<design-context>` block,
a `design-tokens.md` / `DESIGN.md` in the repo, or an established theme in
the codebase — that spec WINS over every aesthetic default in this skill.
This skill then only polices execution quality (contrast, states, layout
discipline, AI tells), never repaints the brand.

Precedence, highest first:
1. Explicit design-context / token spec provided for the task
2. Brand assets already in the codebase (CSS variables, Tailwind config,
   existing components — extract before inventing)
3. This skill's defaults

Reading a design-context correctly:
- Tokens (colors, type scale, spacing, radius, shadows, motion durations)
  are law. Use them verbatim; do not "improve" the palette.
- The rationale section tells you WHY — apply its logic to new surfaces the
  spec doesn't cover, instead of falling back to this skill's taste.
- Its accessibility notes carry known traps (e.g. an accent that fails AA
  as text color and is button-background-only). Honor them exactly.
- If the design-context describes a dense product console (dense tables,
  13px base, fixed sidebar nav), you are in `admin-dashboard` territory:
  keep the tokens, hand the patterns to that skill.

When a project has NO spec yet and you make real design decisions, leave a
`design-tokens.md` behind in the repo so the next session inherits them:

```markdown
---
name: <project>
description: <one line: accent + canvas + personality in ten words>
colors: { primary, on-primary, primary-hover, ink, ink-muted, canvas,
          surface, border, link, status-* as needed }
typography: { display: family/size/weight, body: family/size/weight }
spacing: { base: 4px, scale: [...] }
radius: { sm, md, pill }   # must match the Shape Lock choice
shadows: { card, modal }
motion: { duration-base, easing }
---
## Rationale
2-4 short paragraphs: why this palette/type for this audience.
## Accessibility notes
Known contrast ratios and any token that is restricted (e.g. "primary
fails AA as text on canvas; button fill only").
```

## 2. THE THREE DIALS

`DESIGN_VARIANCE` (1 symmetric → 10 chaos) / `MOTION_INTENSITY` (1 static →
10 cinematic) / `VISUAL_DENSITY` (1 airy → 10 packed).

| Use case | VAR | MOT | DEN |
|---|---|---|---|
| DR / COD funnel LP (ID/MY market) | 3 | 2 | 5 |
| Storefront / e-commerce marketing | 5 | 4 | 4 |
| SaaS landing (volumform/volumup class) | 7 | 5 | 4 |
| Agency / creative (jasawebsite class) | 8 | 7 | 3 |
| Portfolio | 7 | 6 | 3 |
| Editorial / blog / kamus-style docs | 5 | 3 | 3 |
| Redesign - preserve | match existing | +1 | match |
| Redesign - overhaul | +2 | +2 | match |

Dial meanings, compressed: VAR 1-3 symmetric grid and centered OK; 4-7
offsets, mixed aspect ratios, left-aligned headers; 8-10 masonry, fractional
grids, big empty zones. MOT 1-3 hover/active only; 4-7 load-in cascades and
scroll reveals (CSS-first); 8-10 pin/scrub scrolltelling (GSAP). DEN 1-3
`py-32`+ gaps; 4-7 `py-16`-`py-24`; 8-10 tight, hairlines instead of cards,
mono numerals.

Asymmetric layouts (VAR ≥ 4) MUST collapse to single column below 768px,
declared explicitly per section.

## 3. STACK DEFAULTS (Astro-first — differs from the original on purpose)

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

## 4. DESIGN DIRECTIVES (bias correction)

### 4.1 Typography
- Display default: `text-4xl md:text-6xl tracking-tighter`; body
  `text-base leading-relaxed max-w-[65ch]`.
- **Hero font scale is planned with the asset:** headline >6 words never
  starts at `text-7xl`. A 4-line hero headline is a font-size error.
- Inter is discouraged as a reflex; pick Geist, Outfit, Satoshi, Cabinet
  Grotesk, or brand-appropriate. Inter is fine when the brief is genuinely
  neutral/Linear-style or accessibility-first.
- **Serif discipline:** serif display is NOT the default for "creative" or
  "premium" briefs; sans display is. Serif only when the brand names one or
  the aesthetic is genuinely editorial/luxury/heritage AND you can say why.
  Fraunces and Instrument Serif are banned as defaults (LLM favorites).
- Emphasis inside a headline = italic/bold of the SAME family. Never inject
  a serif word into a sans headline for "visual interest".
- Italic display words with descenders (`y g j p q`) need `leading-[1.1]`
  minimum + padding reserve, or they clip.

### 4.2 Color
- Max 1 accent color, locked for the WHOLE page. No blue CTA appearing on a
  warm-grey page at section 7.
- One neutral family per page (don't mix warm and cool grays).
- **LILA rule:** no AI-purple glow defaults. Neutral base + one
  high-contrast accent. If the brand IS purple, embrace it with intent.
- **Premium-consumer palette ban:** the beige/cream + brass/clay/oxblood +
  espresso family is the AI default for artisan/luxury/wellness briefs —
  banned as a reflex. Rotate real alternatives (cold luxury silver/chrome,
  forest green+bone+amber, black+tan, cobalt+cream, terracotta+slate,
  olive+brick+paper, monochrome+one pop). Allowed only when the brand
  explicitly owns those colors.
- No pure `#000` / `#fff`; off-black and off-white.
- Dark mode: dual-mode by default for consumer-facing pages (pick Tailwind
  `dark:` OR CSS variables, one strategy per project), WCAG AA contrast in
  both, brand accent stays recognisable. Exceptions: print-emulating
  editorial, and DR funnel LPs (single locked theme is fine — see §6).
- **Page theme lock:** one theme per page. Sections never flip
  light↔dark mid-scroll (one deliberate full theme-switch device max, and
  only when the brief calls for it).

### 4.3 Layout
- **Anti-center bias:** VAR > 4 avoids the centered-hero default; use split,
  left-content/right-asset, or asymmetric whitespace. Centered is right for
  manifesto/editorial briefs and funnel LPs.
- Cards only when elevation means hierarchy; otherwise `border-t`,
  `divide-y`, or space. Tint shadows to the background hue.
- **Shape lock:** one corner-radius system per page (all-sharp, all-soft, or
  all-pill), or a documented mixed rule followed everywhere.
- **Hero discipline (Brand mode):** fits initial viewport; headline ≤ 2
  lines; subtext ≤ 20 words; CTA visible without scroll; top padding ≤
  `pt-24`; max 4 text elements (eyebrow OR brand strip, headline, subtext,
  CTAs). Trust LOGO WALLS live UNDER the hero, never inside; a one-line
  text trust row (the `copywriting` LP template's hero trust row) may stay
  in the hero and counts as the one small text element.
- Nav: one line at desktop, ≤ 80px tall.
- **Section-layout repetition:** a layout family appears at most once per
  page; 8 sections need ≥ 4 families. Max 2 consecutive image/text zigzag
  splits — the 3rd breaks the pattern (full-width, stack, bento, marquee).
  Marquee itself: max ONE per page; a second marquee is lazy filler.
- Glassmorphism, when a premium brief legitimately calls for it: go beyond
  `backdrop-blur` — 1px inner border (`white/10`) + subtle inner top
  highlight — and provide a solid-fill fallback under
  `prefers-reduced-transparency`.
- **Eyebrow rationing:** max 1 uppercase-tracking micro-label per 3
  sections (hero counts). Default: drop the eyebrow, the headline is enough.
- **Split-header ban:** "big headline left + small floating paragraph
  right" as a section header is banned by default; stack vertically.
- Bento grids: exactly as many cells as content (no blank filler tiles),
  varied rhythm, and 2-3 cells with real visual variation (image, tint,
  pattern) — never all white-on-white text tiles.

### 4.4 States & forms
- Ship full cycles: skeleton loaders shaped like the final layout, composed
  empty states, inline form errors, `:active` press feedback
  (`scale-[0.98]`).
- Label above input, error below, no placeholder-as-label. Ever.
- **Contrast audits are mandatory:** every CTA readable against its
  background (WCAG AA 4.5:1); ghost buttons over photos get a scrim; form
  placeholders/labels/focus rings pass AA too.
- CTA label fits on one line at desktop (shorten label or widen button).

### 4.5 Content density (Brand mode)
- Section default: headline ≤ 8 words + sub ≤ 25 words + one visual or CTA.
- No data-dump sections on marketing pages: top 3-5 + "view all", or
  carousel/marquee/tabs. > 5 items never ships as a default `<ul>` with
  `divide-y` hairlines under every row — group into chunks or card grid.
- **One CTA label per intent** on Brand pages ("Get in touch" + "Let's
  talk" on one page = fail). (Funnel mode overrides this — §6.)
- Quotes ≤ 3 lines, attribution = name + role (+ company), real
  typographic quotes or none.
- **Copy self-audit before ship:** re-read every visible string; kill
  grammatically-broken lines, unclear referents, and AI-cute copy. Numbers
  are real, labeled mock, or absent — never invented precision. One copy
  register per page.
- Ownership split with `copywriting`: the word/line caps in this skill are
  LAYOUT budgets (the space the design reserves) and win on layout fit;
  wording, char limits, headline patterns, and meta rules come from
  `copywriting` and win on phrasing.

### 4.6 Images
1. Image-gen tool available → generate section-specific assets at the right
   aspect ratio. Never use generated people, testimonials, before/after
   imagery, or results as customer evidence.
2. Else approved brand assets or licensed stock photography.
3. Else labeled placeholder slots + tell the user what's needed. Never fill
   with div-based fake screenshots or hand-rolled decorative SVG
   illustrations.
- Even minimalist pages need 2-3 real images. Text + gradient blob is not a
  hero.
- Logo walls use real SVG logos (Simple Icons / brand assets) or a generated
  monogram for invented brands — not styled text spans. Logos only, no
  category labels under them, working in both themes.

## 5. AI TELLS (hard bans unless the brief asks)

Visual: neon/outer glows, pure black, oversaturated accents, gradient text
on big headers, custom cursors, crosshair/hairline decoration grids,
vertical rotated text, `<br>`-and-italic headline splits.

Micro-label slop: version labels in hero (`V0.6`, `BETA`), section-number
eyebrows (`001 · Capabilities`), `01/4` pagination on tiles, "Brand · No.
01" micro-meta, decoration strips at hero bottom (`DESIGN · BUILD · SHIP`),
floating top-right sub-text, weather/locale/time strips, scroll cues
("Scroll to explore"), decorative status dots, pills/labels overlaid on
photos, fake photo-credits (`Field study no. 12`), version footers
(`v1.4.2 · Build 0048`) on marketing pages, "Reservation 412 of 800" fake
counters, generic step labels ("Step 1 / Stage 2" — the verb is the label),
scoring/progress bars with filled background tracks as comparison visuals
(use a number + icon instead).

Copy slop: "Quietly trusted by", performative-craftsman labels ("Field
notes", "On our desks"), mock-humble asides, filler verbs (Elevate,
Seamless, Unleash, Next-Gen), "Jane Doe"/"Acme"/egg-avatar placeholder
data, fake-perfect numbers (99.99%). Replacements, not just bans: use
approved real data; for prototypes, label the data explicitly as sample
content instead of making it look real.

Separator slop: middle-dot `·` max once per metadata line. **Em-dash (`—`)
and en-dash-as-separator (`–`) are fully banned in visible page copy** —
headlines, body, quotes, captions, buttons, alt text. Use period, comma,
colon, parentheses, or plain hyphen. Zero tolerance; it is the #1 AI tell.
This ban outranks any dash separator shown inside `copywriting` skill
templates: keep the template's structure, substitute a colon or hyphen.

Fake product previews: no div-built fake dashboards/terminals/task lists.
Real screenshot, generated image, real mini-component, or nothing.

## 6. DR / COD FUNNEL MODE OVERRIDES

Funnel LPs (petanisejahtera/pesantren class) are direct-response pages for
mobile-first ID/MY ad traffic. Conversion evidence beats taste rules. In
this mode:

**Overridden (allowed and often required):**
- **Repeated CTA:** the order CTA repeats after every major persuasion
  block, plus sticky bottom button on mobile. The one-label rule still
  applies (same wording every time), the one-per-intent COUNT rule does
  not. This overrides the single-CTA-band shape in `copywriting`'s LP
  template; CTA WORDING still follows copywriting's rules.
- **Long-form copy:** story → problem → solution → proof → offer → FAQ.
  The 20-word/25-word caps do not apply; section rhythm does.
- **Urgency/scarcity:** allowed when backed by real data (real stock, real
  promo end). Fabricated countdowns and fake "412 of 800" counters stay
  banned — lying breaks trust and ad-account health.
- **Centered, stacked, symmetric layout:** correct here. VAR stays 2-4;
  fancy asymmetry hurts scan-speed on cheap Android devices.
- Single locked theme (usually light), no dark-mode variant required.
- Emotional/hype register within platform ad-policy limits; testimonial
  blocks may be long if scannable.

**NOT overridden (still mandatory):**
- Real product images and verified, consented testimonial evidence. Never
  generate customer portraits, quotes, ratings, or before/after proof.
- Contrast audits, label-above-input forms, inline errors — the order form
  IS the product; a broken form is a dead funnel.
- Performance: this traffic is mid-range Android on mobile data. MOT ≤ 3,
  zero JS animation libraries, LCP < 2.5s on the hero image, CLS < 0.1
  (reserve image space).
- All Section 5 AI-tell bans, the em-dash ban, the copy self-audit.
- Never rename form field names / IDs / slugs that tracking (Meta pixel,
  GTM, Scalev) depends on.

## 7. REDESIGN PROTOCOL

1. **Detect mode:** greenfield / preserve / overhaul. Ambiguous → ask once.
2. **Audit before touching:** brand tokens (colors, type, radii, logo), IA
   and conversion paths, content blocks worth keeping, patterns to retire,
   current dial reading, SEO baseline (ranking pages, meta, structured
   data — the #1 redesign risk; QA with `seo-website-builder`).
3. **Preserve unless asked:** slugs, anchor IDs, nav labels, copy voice,
   a11y wins, analytics event names/selectors. A purple brand stays purple.
4. **Modernisation levers, in order — stop when satisfied:** typography →
   spacing/rhythm → color recalibration → motion layer → hero recomposition
   → full block replacement (last resort). IA+SEO sound → targeted
   evolution (levers 1-4) wins ~70% of the value at ~40% of the risk.
5. **Never change silently:** URLs, nav labels, form field names/order,
   logo, legal/consent copy.

## 8. PRE-FLIGHT CHECK (run before delivering; any fail = not done)

Hybrid pages (§0) apply the Brand vs Funnel checks per block, by that
block's mode.

Universal:
- [ ] Mode + design read declared; dials stated and reasoned
- [ ] Design-context / repo tokens checked FIRST and used verbatim if
      present (§1.5); new real decisions written back to design-tokens.md
- [ ] ZERO em-dash/en-dash-separator in visible copy
- [ ] One accent color, one neutral family, one radius system, one theme
      (no mid-page inversion)
- [ ] Every CTA and form element passes WCAG AA contrast; no CTA wraps at
      desktop
- [ ] Real images per §4.6 — no div fake-screenshots, no text-only page
- [ ] No Section 5 AI tells (mechanical scan: eyebrow count ≤
      ceil(sections/3), no `·` chains, no decorative dots, no
      overlay pills, no version/locale strips, no scroll cues)
- [ ] Copy self-audit done; numbers real or labeled mock
- [ ] Motion: only transform/opacity, reduced-motion honored, no scroll
      listeners, every animation justified in one sentence
- [ ] Mobile collapse explicit per multi-column section; `100dvh` not
      `h-screen`
- [ ] Loading/empty/error states exist where data renders
- [ ] Web vitals plausible (LCP < 2.5s, INP < 200ms, CLS < 0.1); validate
      with the project's own scripts, `web-perf` skill for a real audit

Brand mode additionally:
- [ ] Hero: ≤ 2-line headline, ≤ 20-word subtext, CTA above fold, ≤ 4 text
      elements, logos below hero
- [ ] ≥ 4 layout families per ~8 sections; ≤ 2 consecutive zigzags; no
      split-headers; bento cells = content count with visual variety
- [ ] One CTA label per intent; quotes ≤ 3 lines
- [ ] Dark mode designed and eyeballed in both themes (exempt:
      print-emulating editorial per §4.2)

Funnel mode additionally:
- [ ] Sticky/repeated CTA identical wording; order form fields untouched
      for tracking; urgency claims backed by real data; MOT ≤ 3 and zero
      animation-library JS shipped

## 9. PAIRING MAP

| Need | Go to |
|---|---|
| Astro code, islands, content collections | `astro-development` |
| Pin/scrub scrolltelling code | `gsap-scrolltrigger` + `gsap-core` |
| Copy limits, headlines, meta, ALT rules | `copywriting` (source of truth) |
| Multi-asset content production | `content` |
| SEO QA / migration check | `seo-website-builder` |
| React components, charts, forms | `shadcn-ui` |
| Admin/dashboard/data-dense UI | `admin-dashboard` (this skill stops) |
| "Is there a built-in for this?" | `native-first` |
| Perf audit of the shipped page | `web-perf` |
