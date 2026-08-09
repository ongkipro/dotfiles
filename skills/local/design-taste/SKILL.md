---
name: design-taste
description: >-
  Direct anti-slop visual judgment for landing pages, marketing sites,
  storefront shells, portfolios, and redesigns. Use for desain landing page,
  layout LP, homepage or hero design, storefront design, design review,
  redesign, design tokens, visual polish, or UI that looks AI-templated. Choose
  Brand/Marketing or DR/COD Funnel mode and honor existing project tokens over
  defaults. Defaults to a designed light theme (off-white, layered neutrals),
  with dark shipped only when it is genuinely designed rather than inverted. Pair with astro-development for Astro implementation. Not for
  admin/data-dense UI (admin-dashboard), commerce behavior (storefront-ux),
  copywriting, component installation, or browser evidence (ui-validation).
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
| **Brand / Marketing** | agency site, SaaS landing, portfolio, storefront home, editorial/blog/docs, "premium", "clean", brand awareness | All sections apply (editorial, docs, and portfolio also get §4.5.1) |
| **DR / COD Funnel** | LP produk COD, ads funnel, Scalev/order form, "yang penting convert", quiz/geo funnel | Sections apply EXCEPT the overrides in Section 6 |

If a page is both (storefront home that also sells), default Brand mode for
the shell, Funnel mode for the product/offer blocks.

For product discovery, variants, cart, checkout handoff, customer account,
inventory conflicts, or commerce analytics contracts, keep the visual direction
here and load `storefront-ux` for interaction behavior.

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
theme: { default: light, dark: shipped | out-of-scope,
         white-temperature: warm | cool, why: <one line> }
colors: { primary, on-primary, primary-hover, ink, ink-secondary, ink-muted,
          canvas, surface, raised, border, link, status-* as needed }
typography: { display: family/size/weight, body: family/size/weight }
spacing: { base: 4px, scale: [...] }
radius: { sm, md, pill }   # must match the Shape Lock choice
shadows: { card, modal }   # only for things that genuinely float
motion: { duration-base, easing }
---
## Rationale
2-4 short paragraphs: why this palette/type for this audience, and why the
canvas leans warm or cool.
## Accessibility notes
Known contrast ratios and any token that is restricted (e.g. "primary
fails AA as text on canvas; button fill only"). If dark ships, record the
pairs that needed re-deriving rather than inverting.
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
- Fluid display sizing with `clamp()` when a headline has to survive every width
  BETWEEN breakpoints: `text-[clamp(2rem,1.5rem+2.5vw,3.5rem)]`. **Always keep a
  `rem` term in the middle** — a pure-`vw` middle doesn't respond to browser
  zoom or user font size between the bounds, which puts WCAG 1.4.4 (200%
  resize) at risk. Hard breakpoint steps stay fine for short headlines.
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
- No pure `#000` / `#fff`; off-black and off-white. Define tokens in **OKLCH**,
  whose lightness is perceptual — an evenly-stepped neutral ladder (§4.2.1)
  derived in HSL comes out visually uneven. HSL only in a legacy repo already
  using it, and never `hsl(var(--token))` wrapped around an oklch value
  (`shadcn-ui`).
- **Page theme lock:** one theme per page. Sections never flip
  light↔dark mid-scroll (one deliberate full theme-switch device max, and
  only when the brief calls for it).
- Theme strategy is §4.2.1. One *switching* mechanism per project — a `.dark`
  class or `data-theme`, never both. Authoring is a separate axis: re-pointing
  CSS variables under the switch is the default, and `dark:` utilities are for
  one-off overrides the tokens can't express. Using both axes together is the
  normal shadcn pattern, not a violation.

### 4.2.1 Light-first theme policy

**Light is the canonical theme.** Design it first and treat it as the source of
truth: brand assets, screenshots, and print all assume it. Dark is a derived
mode — optional, and only shipped if it is actually designed.

**Choosing the white.** This is where "clean white" becomes either a real design
or the single most common AI tell.

- Never `#fff`, and never chroma 0. Commit to a temperature: warm off-white
  (paper, bone) around hue 60-90 for editorial, craft, food, human brands; cool
  off-white around hue 220-260 for clinical, technical, fintech. **Keep neutral
  chroma between roughly 0.003 and 0.012** — below that it is the undecided grey
  this rule exists to ban, above it reads as a tint rather than a temperature.
- **Three neutral steps minimum:** canvas → surface → raised (or sunken). One
  flat white with shadows sprinkled on top to fake depth is the Bootstrap-era
  tell. Build the hierarchy into the neutrals, not the shadows. Countable: three
  distinct neutral tokens in the token file.
- **Hairlines before shadows.** On light UI a 1px low-alpha border separates
  more cleanly than a drop shadow. Reserve shadow for things that genuinely
  float above the page: modal, dropdown, sticky bar.
- **Ink hierarchy, not grey mush.** Two or three ink levels. Primary and
  secondary ink ≥ 4.5:1 on canvas; muted ink ≥ 4.5:1 whenever it carries body
  copy. The 3:1 allowance applies only to WCAG 1.4.3 **large text** — ≥ 24px,
  or ≥ 18.66px **and** bold. 18.66px regular does not qualify. Body copy at
  `text-gray-400` is a contrast failure wearing a style's clothes.
- **White needs material** — see §4.6. A page of white, text, and rounded cards
  reads as generated.

Collision to avoid: clean white + Inter + slate ink + a grid of `rounded-xl`
shadowed cards is itself an LLM default (§1). White is the canvas, not the
design.

**Dark mode — ship it only if you will design it.** Half-built dark mode is
worse than none. When in scope:

- Dark is not inverted light. Re-derive it: use surface lightness for elevation
  instead of shadow, cut accent chroma so it stops vibrating against a dark
  ground, and re-check every contrast pair — pairs that pass AA on light
  routinely fail on dark.
- Images, logos, and illustrations that assumed a white ground need a dark
  variant or a container that keeps their own background.
- Set `color-scheme` per theme so native controls, scrollbars, and date pickers
  follow. Own it in **one** place: either the CSS rules (`:root` / `.dark`) or a
  library that manages the inline property on every theme change — `next-themes`
  does this correctly. What breaks is a hand-written inline `style.colorScheme`
  stamped once at boot: inline outranks every selector, so the `.dark` rule
  becomes dead code and native controls freeze in the boot-time scheme.
- DR/COD funnel LPs: single locked light theme, no toggle (§6).

**Resolution order — strict:**

1. **Stored explicit light/dark choice** (cookie or `localStorage`). Once set it
   wins; nothing below overrides it. A stored `'system'` is not a choice — it is
   an instruction to fall through to step 2.
2. **`prefers-color-scheme`** — the native adaptive signal.
3. **Light.**

**The toggle is three-state: Light / Dark / System**, System being the default
position. A two-state switch cannot express "follow my OS", so it strands every
user whose system already auto-schedules.

**Clock-adaptive theming is opt-in, never a default.** It *replaces* step 2
rather than stacking on it — never blend clock and `prefers-color-scheme`, they
will disagree at the boundary. The OS auto-schedule already encodes time and
location and arrives free via the media query. Device clock only, read
client-side: IP geolocation costs a round trip, is wrong behind a VPN, and adds
a privacy surface for a cosmetic feature. The first manual toggle disables it
permanently for that user.

**No-FOUC is mandatory.** Resolve the theme before first paint — a blocking
inline script in `<head>`, or server-render the class from a cookie. A dark mode
that flashes is not finished.

Do not write that script from memory. The naive four-line version has four
distinct failure modes (blocked storage, unknown stored values, Astro's
`ClientRouter` wiping the class on navigation, and "System" freezing at boot),
and on Tailwind v4 a `.dark` class does nothing at all without a `@custom-variant`
declaration. Working snippets for Astro, Astro SSR, and React, plus the CSS
`color-scheme` rule and a verification list, are in
[theme-implementation.md](references/theme-implementation.md).

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
- Every interactive element keeps a visible `focus-visible` ring. `outline:
  none` without a designed replacement is an accessibility bug, not a style.
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
  `copywriting` and win on phrasing — **except punctuation bans (§5), which are
  this skill's call on any surface it designs.** Practical consequence: a
  product title from `copywriting` carrying an en dash is correct in the store
  admin, and must be substituted when that same string renders on a page this
  skill owns.

### 4.5.1 Editorial, docs, and portfolio surfaces

These run in Brand mode. §2 assigns their dials, but §4.5 is written for
marketing sections, so two of its rules are suspended here: the per-section word
caps (long-form body copy is the point of the surface), and the ">5 items never
ships as a hairline `<ul>`" rule — an index of terms, posts, or projects **is** a
legitimate hairline list, and chunking it into cards is the actual error.
Everything else in §4.5 still applies, including the copy self-audit.

- **Measure wins over grid.** Keep §4.1's `max-w-[65ch]`; docs may go to 75ch
  where scanning beats reading. A full-bleed column of prose is a readability
  bug even when the layout could go wider.
- **Rhythm from one scale.** Heading space is asymmetric off the §4.1 spacing
  scale — roughly 2:1 above vs below (`mt-16 mb-8` at H2) — so a heading binds
  to the text it introduces instead of floating between two blocks.
- **Body furniture needs designing too**, and it is what actually distinguishes
  an editorial surface: figure + caption (caption is secondary ink, never
  centered under a left-aligned column), blockquote (indent or rule, not both),
  code blocks (own scroll container per §4.7, never the page), tables (header
  contrast + `overflow-x` wrapper), and footnote or reference rendering.
- **Docs:** current location always visible, nav reachable without scrolling
  back up, and only the open branch expanded past two levels. A term or entry
  page is a dense index, not a marketing section — density comes from §2's DEN
  dial, not from §4.5's airy defaults. Once it grows a fixed sidebar console and
  data tables, §1.5 hands it to `admin-dashboard`.
- **Portfolio: the work is the design.** An index card is one real image, the
  title, and one line of context, all visible without hover (§4.7). §2 gives
  portfolio VAR 7 / MOT 6 — spend that on the *index grid* (mixed aspect ratios,
  offset rows, load-in cascade), not on the card interior, which stays uniform
  so the work is what varies. Case-study detail follows problem → what you did →
  outcome, with real numbers or none at all.

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

### 4.7 Mobile & touch reality

Device behavior, not taste. §6 lists these as non-overridable in funnel mode.

- **iOS Safari auto-zoom:** any `<input>`, `<textarea>`, or `<select>` whose
  computed font-size is under 16px makes Safari zoom the page on focus and
  wreck the layout. Force `text-base` on mobile form controls. On a COD order
  form this is a conversion bug, not a cosmetic one.
- Kill the tap flash (`[-webkit-tap-highlight-color:transparent]`) **only where
  an `:active` state (§4.4) already supplies the feedback** — removing the
  highlight with nothing behind it is the touch version of `outline: none`.
- `select-none` on buttons and tabs. On cards, only the chrome — never the
  price, SKU, or product name, which people legitimately long-press to copy.
- Touch targets ≥ 44px. Never put a required action behind hover only.
- **Fluid over snapping:** card and tile grids use
  `grid-cols-[repeat(auto-fit,minmax(min(100%,<min>),1fr))]` with `gap`, so they
  resize at every pixel width. The `min(100%,…)` is required — a bare
  `minmax(<min>,1fr)` forces horizontal scroll on viewports narrower than the
  min track, i.e. exactly the cheap Android devices §6 targets. Reserve hard
  breakpoints for real layout changes (split → stack, sidebar → drawer), not
  for column counts.
- Bottom tab bars belong to app and storefront shells. Marketing and funnel
  pages don't get one; their mobile anchor is the sticky CTA (§6).

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
- Single locked light theme, no toggle, no dark-mode variant (§4.2.1).
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
- All of §4.7 (mobile and touch reality). The 16px input floor is a
  conversion rule here, not a style one.
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

## 9. PAIRING MAP

| Need | Go to |
|---|---|
| Theme switching code (pre-paint script, SSR cookie, `color-scheme`) | [theme-implementation.md](references/theme-implementation.md) |
| Astro code, islands, content collections | `astro-development` |
| Pin/scrub scrolltelling code | `gsap-scrolltrigger` + `gsap-core` |
| Copy limits, headlines, meta, ALT rules | `copywriting` (source of truth) |
| Multi-asset content production | `content` |
| SEO QA / migration check | `seo-website-builder` |
| React components, charts, forms | `shadcn-ui` |
| Admin/dashboard/data-dense UI | `admin-dashboard` (this skill stops) |
| "Is there a built-in for this?" | `native-first` |
| Storefront discovery, PDP, cart, checkout, account behavior | `storefront-ux` |
| Browser, viewport, keyboard, a11y, and visual evidence | `ui-validation` |
| Perf audit of the shipped page | `web-perf` |
