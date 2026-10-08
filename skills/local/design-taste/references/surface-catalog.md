# Surface Catalog: Public Web Surface Types

Pick the surface before the style. Each entry: what it is (and how it differs
from its neighbors), the user's job, page anatomy, rules with evidence,
compliance, generated defaults to avoid, and research queries. Researched
2026-10-08 from primary sources (URLs in "Sources"); items marked
**(unverified)** came from snippets or secondary sources only. Laws change:
re-check the cited article before quoting it to an owner.

Deeper owners: commerce behavior → `storefront-ux` (Baymard detail);
admin/operator surfaces and intranets → `admin-product-ux` + `admin-dashboard`;
copy and claims wording → `copywriting`; SEO/structured data →
`seo-website-builder`. Category-specific content (skincare, food, services…)
lives in [niche-patterns/](niche-patterns/README.md); this file is by surface,
niche files are by industry. Use both.

## 0. Rules for every public surface

- **Identity:** show who is behind the page. Indonesia: UU ITE Pasal 9 and
  PP 80/2019 Pasal 13(1) (true, clear, honest information; identity backed by
  valid documents; must follow advertising ethics, which makes EPI binding for
  e-commerce). Malaysia: Consumer Protection (Electronic Trade Transactions)
  Regulations 2012 (P.U.(A) 458) Reg 3 + Schedule (name, registration no.,
  contact, main characteristics, full price incl. transport and tax, payment,
  T&Cs, delivery estimate).
- **Claims (EPI 2020, Bab III.A):** superlatives ("paling", "nomor satu",
  "ter-") need accountable proof (1.2.2); "100%", "murni", "asli" need proof
  (1.2.3a); "satu-satunya"/"hanya" need a specific explanation (1.2.3e);
  "gratis" only with no other cost to the consumer (1.2.3f); an asterisk must
  not hide price or availability (1.3); discounts must be real (4.8.4);
  testimonials individual, real, signed, reachable (1.16); comparisons only on
  identical technical criteria with method, source, date (1.18). UU 8/1999
  Pasal 9, 10, 11, 17 cover false availability, price, guarantee, and
  limited-time claims.
- **Fake urgency and reviews:** fake countdowns, false scarcity, false
  activity messages, disguised ads, hidden costs are named dark patterns (FTC
  "Bringing Dark Patterns to Light", 2022). Fake or AI-generated reviews and
  bought social-proof indicators are banned in the US (16 CFR 465, 2024).
- **Data capture:** UU PDP 27/2022 Pasal 20–22: a lawful basis; for consent,
  state purpose, data types, retention, and rights; consent bundled with other
  matters must be clearly separable or it is void; no pre-ticked boxes. Email
  marketing needs prior consent and a visible opt-out (EPI 4.6.10); cookies
  that carry personal data need prior consent (EPI 4.6.9).
- **Attention and reading:** 57% of viewing time is above the fold, 74% in
  the first two screens (NN/g eye-tracking, 2018, 120 users). Pages at a 5th–7th
  grade reading level converted 56% better than 8th–9th grade (Unbounce 2024,
  41k pages; correlational). GOV.UK: sentences ≤25 words, ≤5 sentences per
  paragraph.
- **Trust (NN/g 2016):** design quality, upfront disclosure (price, contact,
  policies), current and complete content, connection to the wider web.
- **Forms:** short, one column, label above field, no placeholder-as-label,
  mark optional fields "(optional)" instead of asterisks, specific inline
  errors plus an error summary that links to fields (NN/g 2016; GOV.UK).
- **Performance and search:** Core Web Vitals good at p75: LCP ≤2.5 s, INP
  ≤200 ms, CLS ≤0.1 (web.dev); used by Google ranking, but there is no single
  page-experience signal (Search Central, 2026-09-22). Full-page promotional
  interstitials can hurt search; consent dialogs are exempt.
- **Motion:** per-surface adopt/avoid list in
  [motion-craft.md §8.3](motion-craft.md); platform support dates in
  [motion-platform-support.md](motion-platform-support.md).
- **Accessibility:** WCAG 2.2 AA, including 2.4.11 Focus Not Obscured (sticky
  bars and cookie banners), 2.5.8 targets ≥24×24 px, 3.2.6 Consistent Help,
  3.3.7 Redundant Entry, 3.3.8 Accessible Authentication (no CAPTCHA-style
  cognitive tests).

## 1. Marketing and persuasion surfaces

### Company profile (compro)
- **Is / differs:** establishes who the organisation is for many audiences
  (buyers, recruits, press, investors); not one offer (landing page) and not
  a closing page (sales page). B2B service firms: also
  [professional-services.md](niche-patterns/professional-services.md).
- **Job:** "Is this company real, competent, right for me?" → what they do →
  proof → people and location → contact or shortlist. Users check claims
  against third-party reviews (NN/g About Us, 2019, 70+ users, 100 sites).
- **Anatomy:** plain statement of what/for whom/where → full service range →
  proof (permitted clients, cases with numbers, certifications held) → about
  (summary, history, real leadership) → how we work → prices or ranges where
  feasible → contact → footer with legal identity.
- **Rules:** company information at four levels: tagline, summary paragraph,
  subpages, footer (NN/g 2019). B2B buyers rank price as the information they
  need most; show typical-scenario prices or ranges if exact prices are
  impossible (NN/g 2013). Specific CTA labels ("Request a quote"), not "Get
  started" (NN/g 2017). Organization JSON-LD on home or About.
- **Avoid:** "leading innovative solutions provider", handshake stock photos,
  unbased counters ("500+ clients"), hero carousel, no address or registration.
- **Queries:** `company profile <industri> Indonesia "tentang kami"`,
  `<service> firm website case study page`, `about us page examples B2B`.

### Landing page (campaign, lead generation)
- **Is / differs:** one traffic source, one conversion; shorter than a sales
  page; a lead or sign-up rather than payment.
- **Job:** "Did I land where the ad promised?" → offer → trust → one action.
- **Anatomy:** headline echoing the ad → specific benefit and audience →
  primary action or form above the fold → true proof → 3–5 benefits → how it
  works → objection FAQ → repeated action → legal footer; thank-you page that
  says what happens next.
- **Rules:** match ad and keyword; key information at the top; easy action
  (Google Ads Help; landing-page experience is part of Quality Score). EPI
  4.6.7(d): the ad must match the destination content. Median conversion
  6.6% (Unbounce 2024; 3.8–12.3% by industry). Textareas and several dropdowns
  depress conversion more than single-line fields (HubSpot, 40k pages;
  correlational). Pop-ups need a visible close and must not block navigation
  (EPI 4.6.4).
- **Avoid:** full site navigation, competing CTAs, "Submit" buttons, 10-field
  forms for an ebook, fake timers, asterisked real price.
- **Queries:** `Unbounce conversion benchmark <industry>`,
  `Meta Ad Library <competitor>` then open the landing URLs.

### Sales page (long-form direct response)
- **Is / differs:** sells one paid offer end to end and closes payment; COD
  and order-form specifics in [surface-and-mode-rules.md §6](surface-and-mode-rules.md).
- **Job:** "Will it solve my problem, is it worth it, what is my risk?"
- **Anatomy:** headline matching traffic → problem and stakes → mechanism →
  itemised offer (no "and much more", EPI 4.8.6) → proof with typical results
  and sources → all-in price and instalment total → guarantee with method and
  time limit → FAQ (shipping, refunds) → order action → seller identity.
- **Rules:** length follows price, complexity, and awareness; it is not a
  law (Crazy Egg case +30% on a ~20× longer page, single case; Unbounce finds
  word count −18.6% correlated across mostly short lead pages). Five reviews
  vs none: +270% purchase likelihood, peak at 4.0–4.7 stars, verified badge
  +15% (Spiegel Research Center, 2017). Hidden extra cost is the top checkout
  abandonment reason, 40% (Baymard, 2025). Guarantee terms in full (EPI 1.5,
  1.6, 4.9.7); seller name, address, validity (EPI 4.9.2).
- **Avoid:** evergreen "ends tonight", strike-through prices never charged,
  unverifiable "as seen on" logos, price hidden until after a video, AI
  "customer" photos.
- **Queries:** `long-form sales page teardown <niche>`,
  `money-back guarantee sales page example <niche> Indonesia`.

### Advertorial (native ad, pre-sell page)
- **Is / differs:** paid content formatted like editorial that pre-sells
  before an offer. Its defining risk is format deception: the reader must
  know it is an ad **before** engaging (FTC "door-opener": a disclosure after
  the click does not cure it).
- **Anatomy:** ad label above the headline → editorial-style headline (no
  fake news masthead) → sponsor/brand byline → story (problem, discovery,
  mechanism) → product and producer named → proof with sources → label
  repeated mid-article → CTA → footer disclosure and sponsor identity.
- **Label rules (verified in the primary texts):**
  - EPI 2020 4.13.1: advertorial, infotorial, edutorial, inspitorial "harus
    secara jelas memuat jenis iklan informatif tersebut, tanpa bermaksud
    menyembunyikannya"; 4.13.2: name the product or producer; Penjelasan
    4.6.3 (online): advertorial and native ads mark themselves as ads with
    "#sponsor"; 4.1.1 (print): editorial-looking ads carry "Iklan No. …" at
    ≥10 pt.
  - Dewan Pers, Pedoman Pemberitaan Media Siber (2012) butir 6: label
    "advertorial", "iklan", "ads", "sponsored" or equivalent.
  - Malaysia Content Code 2022 Part 3, 6.3: label upfront with
    "Advertisement", "Advertisement Feature", "Ad", "Sponsored"; not "sp",
    "spon", "collab"; same language as the content; 6.4 paid editorial-style
    space must not be mistakable for editorial.
  - FTC Native Advertising Guide (2015): "Ad", "Advertisement", "Sponsored
    Advertising Content"; avoid "Promoted"; label in front of or above the
    headline and again on the landing page.
  - Paid links `rel="sponsored"` (Google Search Central).
- **Evidence:** only 7% of readers recognised native ads as advertising; the
  words "advertising" or "sponsored content" raised recognition about 7× over
  "brand voice"/"presented by"; a mid-article disclosure was noticed by 90% vs
  40% at the top (Wojdynski & Evans, Journal of Advertising, 2015). Label at
  the top for the law **and** mid-article for the reader.
- **Health, cosmetics, food (BPOM):** food ads (PerBPOM 6/2021 Pasal 14(1)):
  no unproven superlatives, no "satu-satunya", no "aman/tanpa efek samping"
  without full information, no unapproved health claims or testimonials, no
  health workers, religious figures, or officials. Cosmetics (PerBPOM
  18/2024, Lampiran VI): only notified products; no health-worker personas;
  no lab, ministry, or "notified/ISO/organic" claims without proof. Drugs:
  PerBPOM 7/2026 (read via aggregator; **confirm on jdih.pom.go.id**) requires
  BPOM approval of OTC ads and bars individuals other than formally engaged
  ad performers from promoting drugs.
- **Avoid:** fake mastheads, invented reporter bylines, fake comment
  sections, "Promoted" or "Partner" as the only label, footer-only disclosure,
  lab-coat endorsers for cosmetics or supplements, unfair before/after photos.
- **Queries:** `advertorial "konten ini merupakan kerja sama" kompas OR detik`,
  `site:pom.go.id iklan kosmetik tidak memenuhi ketentuan`,
  `site:ftc.gov native advertising`.

### Lead magnet, webinar, event registration
- **Job:** "Is this worth my email and time?" → preview → speaker → date,
  time, **time zone** (WIB/WITA/WIT/MYT) → short form → confirmation with
  calendar file.
- **Rules:** gate only high-value assets; show ungated samples; progressive
  profiling (NN/g gated content). Google Event rich results do not support
  virtual-only events; for in-person events change `eventStatus` instead of
  deleting the page. Prize draws need terms, period, draw date, and permit
  (EPI 4.8.2–4.8.3).
- **Avoid:** gating a blog post, phone + company size for a checklist,
  pre-ticked marketing consent, "3 seats left" for an unlimited room.

### Donation page
- **Job:** "Is it legitimate, and where does my money go?"
- **Anatomy:** specific appeal → mission → use of funds with amount-to-impact
  examples → proof (reports, audits) → preset + custom amount, one-time/monthly
  → legal entity and permit number → receipt with reference.
- **Rules:** donors look for mission and use of funds; only 4% of sites
  answered how money is used (NN/g, 2009). 1.6% of visitors donate; main
  donation page converts 11% desktop vs 8% mobile; mobile is 52% of visits but
  28% of revenue (M+R Benchmarks 2026). Indonesia: public fundraising needs a
  PUB permit (UU 9/1961, Permensos 8/2021 **(article numbers unverified)**);
  zakat needs authorisation.

### Government or public service page
- **Anatomy (GOV.UK):** start page (what, cost, time, alternatives, what you
  need, "Start now") → one question per page with Back link and "Continue" →
  check answers with Change links → confirmation with reference and what
  happens next.
- **Rules:** eligibility questions inside the service, not on the start page;
  no asterisks; never ask twice; avoid disabled buttons and guard double
  submit on the server. Indonesia: UU 25/2009 Pasal 21 service standard
  components (requirements, procedure, timeline, fee, product, complaints…):
  show at least these on the start page.

### Personal brand, portfolio
- **Rules:** 3–5 case studies, each with problem, role, process, outcome,
  learnings (NN/g, 2019, 204 hiring managers); authorship self-evident
  (Search Central helpful content); ProfilePage JSON-LD for About Me pages;
  disclose paid endorsements and affiliate links (FTC, CC 6.3, EPI 4.6.11b).
- **Avoid:** "passionate creative" hero, 20 context-free thumbnails, skill
  percentage bars, anonymous testimonials.

### Waitlist, pre-launch, coming soon
- **Rules:** honest status and ETA (or "no date yet"); one email field; a
  specific CTA ("Join the waitlist"); confirmation with the next update date.
  Malaysia CC 4.12(b) bans advertising unavailable products to test demand;
  Indonesia UU 8/1999 Pasal 9(1)(e) bans implying availability, Pasal 16
  requires pre-orders to meet the promised time. Counters must be real.
- **Avoid:** "Buy now" on a product that does not exist, fake queue
  positions, arbitrary countdowns.

## 2. Commerce surfaces (detail: `storefront-ux`)

### E-commerce storefront (single brand)
- **Job:** discover → find → evaluate PDP → cart → checkout → confirmation.
- **Evidence (Baymard):** cart abandonment averages 70.22% (50 studies,
  2025-09-22); reasons: extra costs 40%, slow delivery 20%, card distrust 19%,
  forced account 18%, long checkout 17%, total not visible upfront 12%. 65% of
  checkouts are mediocre or worse (344 sites). Field count matters more than
  step count; most checkouts need about 8 fields (2024). Guest checkout as a
  prominent top option. PLP: optimised lists cut abandonment from 67–90% to
  17–33%. Pagination or "Load more" over infinite scroll for goal-directed
  shopping, preserving position on Back (NN/g 2022). No auto-rotating
  carousels (NN/g; APG: pause control, stop on focus/hover).
- **Compliance:** Indonesia PP 80/2019 Pasal 13 (truthful offer and identity),
  27 (complaint channel with address, procedure, resolution time), 39 (offer
  must state specs, price, terms, payment, delivery, risks), 53–56 (electronic
  contract in Bahasa Indonesia, downloadable; no harmful standard clauses),
  69 (≥2 working days to exchange or cancel wrong, late, defective, damaged,
  or expired goods), 71 (refund mechanism). Malaysia Reg 3–4 (full price,
  review and correct before confirming, acknowledge the order).
- **Avoid:** prices hidden until checkout, forced sign-up, always-open coupon
  field, split name fields, disabled Buy without a reason.

### Marketplace (multi-vendor, buyer side)
- **Is / differs:** the buyer chooses a product **and** a seller and offer;
  trust splits between platform and seller.
- **Anatomy:** PDP seller block (name, badge, rating **count**, response time,
  ship-from) + other sellers list (price, shipping, ETA, rating) → seller store
  page → cart grouped by seller with per-seller shipping → vouchers (platform,
  store, shipping) with eligibility → chat → tracking → returns and disputes.
- **Evidence:** on Amazon the default offer often differs from what buyers
  prefer when shown a choice, and rating count (scale, not quality) swayed
  choice most (arXiv 2407.01732, 2024): show comparable, honestly computed
  per-offer metrics and an explainable default. Indonesia: cash/COD is the
  most-used payment method for 74.79% of e-commerce businesses (BPS Statistik
  E-Commerce 2024; business-side unit), so COD eligibility and fee belong
  before checkout. Show why a voucher is ineligible (minimum spend, payment,
  courier, category) before submit.
- **Compliance:** PP 80 Pasal 65–66 (platform-run delivery: periodic status);
  Malaysia Reg 5 (operators keep seller identity 2 years). Permendag 31/2023
  foreign-seller and USD 100 rules **(unverified, primary text not fetched)**.
- **Avoid:** one blended rating without count, hidden alternative sellers,
  "Free shipping" without conditions, vouchers that fail silently.

### Directory, listing, classifieds
- **Job:** what + where → list/map with filters → listing (photos, attributes,
  hours, contact) → contact or lead. Transaction usually off-site.
- **Rules:** LocalBusiness markup needs `name` and `address`; `aggregateRating`
  only when reviewing **other** businesses (no self-serving reviews).

### Booking and reservation
- **Job:** date/time + place → availability and **total** price → book →
  confirmation with change/cancel policy.
- **Evidence:** only 1 of 9 benchmarked accommodation sites was "decent";
  common failures: search not prioritised, non-transparent pricing, weak
  filters and reviews (Baymard, 2026-01-15).

## 3. Content and portal surfaces

### News or media portal
- **Rules:** Better Ads Standards ban, on mobile, ad density over 30%,
  pop-ups, prestitials, postitials with countdown, flashing ads, autoplay with
  sound, full-screen scrollover, large sticky ads. Speed pays: Akurat.co
  (Jakarta) cut LCP 4.6 → 3.7 s and saw +12% revenue in 3 months (Google case
  study); NDTV LCP 3.0 → 1.6 s with bounce −50% (web.dev). Front-load the
  first two paragraphs and headings (NN/g). Bylines, author pages, AI-use
  disclosure (Search Central).
- **Avoid:** autoplay with sound, sticky ads covering content (also fails
  WCAG 2.4.11), interstitial before content.

### Blog, editorial, documentation
- Editorial rules: [surface-and-mode-rules.md §4.5.1](surface-and-mode-rules.md).
- Documentation IA by Diátaxis: tutorials, how-to guides, reference,
  explanation (diataxis.fr); sidebar by type, search, versions, page TOC,
  copyable code.

### Customer, member, self-service portal
- **Is / differs:** authenticated area for an existing relationship (orders,
  billing, tickets); the core product lives elsewhere (unlike an app shell).
- **Anatomy:** dashboard of status and next actions → orders/subscriptions →
  billing → support tickets → profile, privacy, consent (UU PDP: access, copy,
  delete, withdraw consent).
- **Rules:** require an account only for repeat access; give one-off
  transactions a reference number instead (GOV.UK). No CAPTCHA-style tests
  (WCAG 3.3.8). Help in a consistent place (3.2.6). PP 80 Pasal 27 complaint
  channel with resolution time. Screens and states → `admin-product-ux`
  patterns apply to the signed-in area.

### Intranet, employee portal
- Route to `admin-product-ux`. NN/g Intranet Design Annual 2023 (latest
  verified): average team 21, project 25 months; themes of hybrid work and
  integrations **(themes unverified)**.

### Government service portal
- GOV.UK patterns above; Service Standard 14 points (solve a whole problem,
  everyone can use it, secure and private…).

### SaaS marketing site vs app shell
- Marketing site: [saas-b2b.md](niche-patterns/saas-b2b.md); pricing is the
  information buyers need most (NN/g 2013). App shell and signed-in product
  UI → `admin-product-ux` + `admin-dashboard`.

### LMS, community or forum
- No authoritative large-sample source was found; apply the general rules
  (progress for waits >10 s, pagination over infinite scroll, consistent
  help, children's data needs parental consent under UU PDP Pasal 25).

## 4. Components and states

Working definitions: UX is all aspects of the user's interaction with the
company, its services, and products (NN/g, Norman and Nielsen); IA is the
structure, navigation is the UI that exposes it (NN/g 2014); content design
starts from user needs (GOV.UK). Name components with component.gallery and
Open UI terms.

| Category | Components | Error-prone rules (source) |
| --- | --- | --- |
| Navigation | header, navigation, breadcrumbs, pagination, tabs, skip link, tree view, stepper, footer | site navigation is a disclosure pattern, never `role=menu`/`menubar`; tabs use roving tabindex and arrow keys (WAI-ARIA APG) |
| Forms | text input, textarea, select, combobox, checkbox, radio, switch, slider, date input, file upload, search | combobox keeps DOM focus on the input with `aria-activedescendant`; error summary above the h1, linked to fields, "Error: " title prefix (APG; GOV.UK) |
| Data display | table, list, card, badge, avatar, rating | native `table` before ARIA grid; cards only for comparable units (§4.3.1) |
| Feedback | alert, toast, progress, spinner, skeleton, empty state, error summary | spinner only for short waits, >10 s show progress; empty state = status + learning cue + direct path (NN/g) |
| Overlays | dialog, drawer, popover, tooltip, menu button | dialog traps Tab, Esc closes, focus returns to the trigger; destructive alert dialogs focus the least destructive action (APG) |
| Layout | hero, accordion, disclosure, carousel, separator | carousel: rotation control first in tab order, stop on focus/hover, prefer no auto-advance (APG; NN/g) |
| Commerce | price, variant selector, quantity, add to cart, mini-cart, offer list, seller card, voucher picker, shipping estimator, order summary | total cost visible before checkout; voucher eligibility explained before submit |
| Content | byline, article TOC, related links, comment thread, code block | byline and date on every article; descriptive link text |

**States every interactive component covers:** default, hover (150–200 ms
delay), focus visible, pressed (feedback within 100–150 ms; prevents double
submit), disabled (GOV.UK: avoid; explain why), loading, selected, empty,
error, success (NN/g button states 2025; NN/g heuristic 1; GOV.UK). Targets
≥24×24 px, focus never hidden by sticky UI (WCAG 2.5.8, 2.4.11).

## Sources

Law and codes: EPI Amandemen 2020 (p3i-pusat.com PDF), Dewan Pers Pedoman
Pemberitaan Media Siber 2012, UU 8/1999, UU 11/2008 ITE, UU 25/2009, UU
27/2022 PDP (jdih.kemenkeu.go.id), PP 80/2019 (peraturan.go.id), PerBPOM
6/2021, 1/2022, 18/2024 (peraturan.bpk.go.id, peraturan.go.id), PerBPOM 7/2026
(pasal.id, aggregator), Malaysia Content Code 2022 (contentforum.my), P.U.(A)
458/2012 ETT Regulations, FTC Native Advertising Guide 2015, Enforcement
Policy Statement (Federal Register 2016-04-18), Endorsement Guides 2023, 16 CFR
465 (2024), FTC dark patterns report 2022.
Research and guidance: NN/g (about-us 2019, scrolling-and-attention 2018,
trustworthy-design 2016, show-price 2013, get-started 2017, web-form-design
2016, content-behind-forms, donation-usability 2009, ux-design-portfolios
2019, infinite scrolling, auto-forwarding, empty states 2021, button states
2025, intranet design annual 2023), Baymard (cart abandonment 2025, checkout
fields 2024, guest checkout 2023, product lists, travel accommodations 2026),
Spiegel Research Center 2017, Unbounce Conversion Benchmark 2024, HubSpot form
fields, Conversion Rate Experts Crazy Egg case, M+R Benchmarks 2026,
Wojdynski & Evans 2015 (University of Georgia), arXiv 2407.01732, BPS
Statistik E-Commerce 2024 (via GoodStats), Better Ads Standards, Google case
study Akurat.co, web.dev NDTV and Core Web Vitals, Google Search Central
(page experience, interstitials, helpful content, spam policies, structured
data: Organization, ProfilePage, Event, Product, LocalBusiness, sponsored
links), Google Ads Help (landing page experience), GOV.UK Design System and
Service Manual, W3C WCAG 2.2 and WAI-ARIA APG, component.gallery, Open UI,
diataxis.fr.

Unverified, do not quote as fact: ISO 9241-210 wording, Permendag 31/2023
details, UU PDP agency status, Shopee voucher limits, ASA Malaysia code
clauses, CXL long-vs-short findings, ON24 webinar benchmarks, Malaysia PDPA
bilingual notice, Permensos 8/2021 article numbers, Permenkes 1787/2010
current status, POJK marketing rules.
