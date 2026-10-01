---
name: cms-content
description: >-
  Choose and implement the content-editing layer when clients edit their own
  site content: Astro content collections, git-based CMS (Keystatic, Decap,
  TinaCMS), Payload on Postgres, or Shopify metaobjects. Not visual design
  (design-taste), commerce flows (storefront-ux), schema engineering
  (postgres-drizzle), or deploy (vps-deploy). Use for "client wants to edit
  content", CMS selection, editor roles and approvals, previews, media storage,
  content modeling, migrating content between CMSes, and handing a site over
  to non-technical editors.
---

# CMS: content the client edits

Clients always edit their own content. Pick the **smallest system that gives a
non-technical editor a safe login, a preview, and media upload**, without
adding a server the project does not otherwise need.

Facts below were verified against official docs on **2026-10-02**; CMS pricing,
versions, and runtime support change often. Re-check the vendor page before
quoting a price or committing to a hosting target, and say when a fact is
unverified.

## 1. Decide

| Situation | Default | Why | Upgrade when |
|---|---|---|---|
| Commerce content | **Shopify** products + metaobjects | Editors already log in to Shopify; no extra system | Editorial volume outgrows metaobjects |
| Landing page, company profile (1–2 editors) | **Astro content collections + TinaCloud** (email login, visual editing), or **Keystatic Cloud** when the site already has a Node-capable server runtime | Files stay in git, no database, editor needs no GitHub account | — |
| Blog / news (2–5 editors, frequent posts) | **TinaCloud** or **Keystatic Cloud Pro** (CDN images) | Visual editing or image CDN avoid repo bloat | Rebuilds get slow or content becomes relational → Payload |
| Catalogue with relations, per-role permissions | **Payload v3 on Postgres** (VPS/Coolify) | Relational data, auth, drafts; same Postgres/Drizzle stack | — |
| Multi-step approvals | Git: **TinaCloud Team Plus**, or **Decap editorial workflow** with Decap Turbo / Git Gateway logins (never GitHub accounts for clients); app: **Payload** drafts + access rules | Review before publish | Ready-made enterprise workflows (Strapi Enterprise, Directus) only on explicit request |

Clients never get GitHub accounts or repository write access; pick a login
mode where editors sign in with email or the CMS's own accounts. On Cloudflare
Workers, Keystatic is not officially documented (its docs only say it needs
Node.js APIs); prefer TinaCloud there unless a preview deploy proves Keystatic
works (see the Keystatic note below).

Ask only what changes the choice: number of editors, whether content is
relational, whether approvals are required, and whether the site already has a
server. Default to the git-based row when unsure.

## 2. Verified notes per option

**Astro content layer.** Build-time collections use `glob()`/`file()` loaders;
custom loaders can read any CMS or API. Live collections
(`src/live.config.ts`, `defineLiveCollection`) fetch per request, without MDX
or image optimization — use them only for content that must change without a
rebuild. Confirm the installed Astro version's docs before using live
collections.

**Keystatic.** Needs React and a server-capable Astro adapter (API routes);
`@keystatic/astro` 6.0.0 peers Astro 5–7 and React 18/19. Modes: local (dev
only), GitHub (each editor needs a GitHub account with write access, plus a
GitHub App), Keystatic Cloud (editors without GitHub accounts; free up to 3
users per team, Pro from $10/month plus $5/month per user beyond 3, Pro adds
Cloud Images). Images are committed to the repo by default. Core is still 0.x
(0.6.9).
**Cloudflare Workers:** not officially documented. Community evidence (one
public repo) runs GitHub mode on Workers with the admin routes as
`prerender: false`, but the GitHub App **creation** step needs `fs` and fails
under workerd: create the app once under a local Node adapter, then set
`KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
`KEYSTATIC_SECRET`, and `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` as Worker
secrets/build vars. Cloud mode on Workers remains unverified. Prove either
mode on a preview deploy before promising it.

**Decap CMS.** MIT, actively maintained. GitHub backend needs editor GitHub
accounts and an OAuth proxy (can be a Worker); Git Gateway can run without
Netlify with your own JWT issuer. Editorial workflow turns edits into PRs.
Decap Turbo (managed hosting, public preview) adds hosted auth with
invite-based editors, roles, and an S3-compatible media library; it has a Free
plan (low daily request cap) and paid Pro/Enterprise tiers in EUR.

**TinaCMS.** Strong Astro support with click-to-edit. TinaCloud: editors sign
up with email; plans are per project (Free 2 users; Team $24; Team Plus $41
with Editorial Workflow; Business $249 — per project per month). Self-hosting
needs your own auth, a database adapter, and a Git provider, and loses
TinaCloud's media CDN, branch switching, and search. `@tinacms/datalayer` is
not MIT ("SEE LICENSE IN LICENSE" on npm): read it before self-hosting.

**Payload v3.** MIT, installs into a Next.js app (admin, auth, REST/GraphQL).
`@payloadcms/db-postgres` is built on Drizzle and uses migrations in production.
Access control is functions you write (no built-in RBAC); drafts, autosave, and
scheduled publish exist; multi-step approval is built from status fields plus
access rules. Live preview works in the admin. Owned by Figma since 2025.

**Shopify metaobjects.** Defined in Settings → Custom data, edited under
Content → Metaobjects with normal staff logins, readable through the Storefront
API. Limits apply per plan (definitions, fields per definition). High lock-in,
no extra cost.

## 3. Implementation checklist

1. **Model content first**: list types, fields, required/optional, relations,
   localization (ID/EN), slugs, and SEO fields; mirror it in the Astro
   collection schema (Zod) or Payload collections. Hand SEO field rules to
   `seo-website-builder`.
2. **Editor safety**: validation on every field the layout depends on (title
   length, image alt text, required hero image); sensible defaults; no raw HTML
   fields unless the client needs them.
3. **Media**: set size limits and target formats; for git-based CMS keep images
   out of the repo when volume is high (Cloud images, R2/S3).
4. **Preview**: a branch/preview deploy or the CMS's live preview; the client
   must see changes before publishing.
5. **Publish path**: deploy hook or rebuild on merge for static sites; cache
   invalidation for live content.
6. **Access**: one account per editor, least privilege, no shared logins;
   remove the developer's personal account from the client's workspace at
   handover. Secrets (OAuth app, tokens) live in the host's secret store, never
   in the repo.
7. **Handover**: a one-page editor guide in the client's language (login, edit,
   preview, publish, image sizes), plus a restore path (git history or database
   backups — `vps-deploy` for Payload).

## 4. Verify before calling it done

- Log in as an **editor role**, not admin, and complete: create, edit, upload an
  image, preview, publish, and see it live.
- Required-field validation blocks a broken publish.
- A content change does not require a developer (no manual rebuild step left).
- For Payload: migrations run cleanly on a fresh database, and a restore from
  backup has been rehearsed.
- Record the CMS choice and its reason in the project's DECISIONS or design
  artifact.

## Sources (accessed 2026-10-02)

- Keystatic Cloud plans and Cloud Images: https://keystatic.com/docs/cloud
- Keystatic Astro install ("needs to run serverside code and use Node.js
  APIs"): https://keystatic.com/docs/installation-astro
- Community Keystatic-on-Workers setup (evidence, not vendor support):
  https://github.com/elsewisemgmt/elsewise
- TinaCloud plans: https://tina.io/pricing
- Decap Turbo plans and preview status: https://decapcms.org/docs/turbo-billing/
  and https://decapcms.org/blog/decap-turbo-public-preview/
- Payload joins Figma (2025-06-17): https://payloadcms.com/posts/blog/payload-is-joining-figma
- Versions from the npm registry on the same date: `@keystatic/core` 0.6.9,
  `@keystatic/astro` 6.0.0, `tinacms` 3.14.2, `decap-cms-app` 3.16.3,
  `payload` 3.90.2 (`@payloadcms/db-postgres` depends on `drizzle-orm`).
