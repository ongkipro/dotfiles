---
name: affiliate-portal-specs-project
description: Affiliate Portal — Medium-style affiliate publishing platform (spec stage)
metadata: 
  node_type: memory
  type: project
  originSessionId: 06f57980-704a-4ea8-b91d-0bb76c175aa4
---

**Affiliate Portal Engine** — like Medium, but writers monetize articles with their own affiliate links, inserted as clean advertorial "related product" blocks, through a moderated, SEO+social-driven platform.

- Spec repo: `~/Documents/Development/affiliate-portal-specs` (GitHub: ongkipro/affiliate-portal-specs). See [[folder-convention-dev]].
- Concept built from 0 (this stage): vision, market-validation (global English/US; Google Dec-2025 helpful-content risk → moderation gate = SEO moat), strategy (SEO + social), personas, user-stories (A–H), UX (flows + wireframes W1–W11 + article-page-spec studied from Medium + design-system), UML (Mermaid), schema-mvp + rls-mvp, api-spec-mvp, playbooks/prompts 01–11.
- **Locked MVP decisions:** single `affiliate_link` entity (name, short_description, affiliate_url server-only, banner, rating, tracking_slug) — NOT the old Product+Offer+Network (deferred "Later"); menu label "Affiliate Links"; niche = AI tools & SaaS; hosting = Vercel (Astro web + Next studio + Supabase); ownership column = `publisher_id`.
- Implementation repo `affiliate-portal-engine` was prototyped then deleted to redo concept-first (backup tar in old scratchpad). Next phase per user: deeper UI/UX, then build following playbooks 01–11.
