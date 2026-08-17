---
name: ongki-pro-site
description: "ongki.pro portfolio — REDESIGNED 2026-07-04 to a full scroll-story (Astro+GSAP ScrollTrigger); time-of-day WIB phase palette (8 fases) + celestial boot loader + constellation bg; Three.js Core REMOVED; LIVE on main (Vercel). Old design backed up at ~/projects/(old) ongki.pro"
metadata: 
  node_type: memory
  type: project
  originSessionId: ec759fe5-aa4a-472c-80c3-485d3027656e
---

Personal portfolio site **ongki.pro** ("Digital Growth Systems Builder" — funnel/conversion architecture, paid media, Shopify, analytics, AI workflows). Repo github.com/ongkipro/ongki.pro. Local clone was DELETED on 2026-06-30 — plan is to rebuild from 0 but keep the understanding below for the update.

**Stack (original):** React 19 + Vite 6 + Tailwind v4 (@tailwindcss/vite) + react-router-dom v7 SPA + react-helmet-async (SEO) + motion + lucide-react. Originally a Google AI Studio app (Gemini API key refs in vite.config/.env.example but Gemini not actually used in code).

**Architecture:**
- SPA in `src/` — `App.tsx` (router, lazy pages), `main.tsx`, `index.css`. Pages: Home, About, Capabilities, Work, Clients, Insights, Contact. Components: Layout (header/nav/footer), SEO, ScrollToTop, SystemAnimation (decorative SVG).
- Per-route static `index.html` files (about/, capabilities/, work/, clients/, insights/, contact/) each with own `<title>`/meta for SEO; all listed as separate Vite rollup inputs in vite.config.ts.
- `server.ts` = Express wrapping Vite middleware (dev) / serving `dist` (prod), port 3000. `npm run dev` = `tsx server.ts`.
- Deploy: **Vercel** (vercel.json — cleanUrls, rewrites per route → index.html, SPA fallback). public/ has favicon.svg, robots.txt, sitemap.xml.

**Aesthetic/content:** monochrome "system/protocol" tech look (mono fonts, [BRACKET_TAGS], "Protocol v2.4", system status dots, DEPLOY_STATUS). Copy in Bahasa Indonesia. Page <title> in repo used "|" separator (note: my convention is " - " per [[title-separator-convention]]).

**REBUILT 2026-06-30** as a one-screen premium site (not the old multi-page React). Stack: Astro 5 + Tailwind v4 + GSAP + Three.js + TypeScript; fonts self-hosted via fontsource (Space Grotesk display / Inter body / JetBrains Mono labels); icons @lucide/astro; cn() in src/lib/utils.ts. One accent #5d7bff (electric blue-violet). Files: src/pages/index.astro (boot orchestration), components/{Hero,LoadingScreen,ThreeCore.ts,ContactReveal,SystemTags}, styles/global.css (@utility glass/hairline, bg layers). ThreeCore = abstract Digital Core (orb + fresnel rim shader + fog + rings + nodes + particles), tiered desktop/tablet/mobile, RAF paused on tab hidden, rebuilds on breakpoint cross. Hidden email get@ongki.pro assembled in JS after 2s hold-to-verify (never in static HTML) + copy. Loading = staged GSAP boot counter. Build/verify clean across viewports.

When rebuilding, follow [[folder-convention-dev]] (~/projects = code), [[no-ai-commit-trailer]], [[git-identity-noreply]].

**REDESIGN 2026-07-04 (LIVE on `main`):** Full **scroll-story** one-pager (Astro + GSAP ScrollTrigger): 01 Hero → 02 The System (6 caps) → 03 Compounding (principles) → 04 Proof (real work w/ factual metrics: 125 products/251 pages/16 modules etc.) → 05 Contact (reused hold-to-reveal email). Signature = **"System Blueprint"** SVG (hub-and-spoke SITE/SHOP/SEO/ADS→GROWTH→AUTO/AGENT, DrawSVG self-draw) — replaced the Three.js Digital Core (removed; old components Hero/SystemTags/LoadingScreen/ThreeCore still in repo, unused). Display font = **Bricolage Grotesque** (ties to Kamus). **Time-of-day WIB palette**: 8 phases (dini/subuh/pagi/siang/senja/petang/malam via `html[data-phase]` overriding Tailwind v4 `--color-accent`/`--glow` CSS vars → whole UI re-tints; `@property` smooth transition; auto re-check every 5min; `?phase=` override for preview). **Celestial boot loader** (sun/moon positioned at real WIB time on a sky arc + tech boot counter). **Constellation** canvas bg (drift+twinkle+mouse-parallax, phase-tinted, fills empty space). Custom cursor (dot+ring, desktop). GitHub link+logo (inline SVG mark) in header/contact/footer. SEO restored (JSON-LD Person+WebSite, meta). Content-guard removed. Responsive desktop/tablet/mobile. Dev: `npx astro dev` (localhost:4321). Redesign built on branch `redesign` then FF-merged to `main` + pushed (Vercel auto-deploy). Backup of OLD design at `~/projects/(old) ongki.pro`.
