# 4. DESIGN DIRECTIVES (bias correction)

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
[theme-implementation.md](theme-implementation.md).

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
