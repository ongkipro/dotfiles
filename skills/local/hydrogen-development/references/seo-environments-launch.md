# Hydrogen SEO, Caching, Oxygen Environments, and Launch Gate

## 1. SEO, Sitemaps & Redirects (`2026.10+` vs Classic)

- **Metadata (`meta` export)**:
  - Hydrogen `2026.10+` removes `getSeoMeta()`. Return standard `<title>`, `meta[name="description"]`, `link[rel="canonical"]`, Open Graph, and JSON-LD (`Product`, `BreadcrumbList`, `Organization`) directly from your framework's metadata API (e.g., React Router 7 `export const meta: Route.MetaFunction`).
  - Keep canonical URLs clean of transient filter/tracking query parameters (`utm_*`, `fbclid`, `gclid`, `sort_by`), while preserving localized subfolder/domain prefixes (`hreflang`).
- **Sitemaps (`sitemap.xml` & child sitemaps)**:
  - Hydrogen `2026.10+` removes `getSitemap()` and `getSitemapIndex()`. Query `products`, `collections`, `pages`, and `articles` (including `onlineStoreUrl` / `handle` and `updatedAt`) with `storefrontClient.graphql()` using `Cache.long()`, and return `Content-Type: application/xml`.
  - Classic Hydrogen (`<= 2026.4.x`) uses `getSitemapIndex` and `getSitemap`.
- **Redirects (`handleShopifyRedirects` & `?variant=`)**:
  - In `2026.10+`, `handleShopifyRoutes` automatically `302`-redirects legacy Liquid `?variant=<numeric_id>` URLs to canonical option query params when `routeTemplates` is passed, and `handleShopifyRedirects` checks Storefront API `urlRedirects` on `404` responses.

## 2. Caching & Response Privacy Discipline

- **Sub-request GraphQL caching (`Cache.*` in `2026.10+`)**:
  - Use `Cache.long()` for stable catalog/navigation/sitemap queries, `Cache.short()` for dynamic merchandising or frequent price/inventory updates, `Cache.none()` for personalized or uncached queries, and `Cache.custom({ maxAge, staleWhileRevalidate, staleIfError, mode })` when fine-tuning Oxygen/CDN behavior.
  - Note: Classic Hydrogen's `CacheLong()`, `CacheShort()`, `CacheNone()`, and `CacheCustom()` functions are replaced by `Cache.long()`, `Cache.short()`, `Cache.none()`, and `Cache.custom()` in `2026.10+`.
- **Full-page & response-header privacy (`requestContext.applyResponseHeaders`)**:
  - Always call `requestContext.applyResponseHeaders(response.headers)` before returning a framework response.
  - Never cache responses that set cookies (`Set-Cookie`) or read Customer Account data: `applyResponseHeaders` automatically enforces `Cache-Control: private, no-store` and strips `Oxygen-Cache-Control`, `CDN-Cache-Control`, `Cloudflare-CDN-Cache-Control`, `Surrogate-Control`, and `s-maxage`.

## 3. Oxygen Deployment, CI & Online Store Redirect Theme (`hydrogen-oxygen`, `Shopify/hydrogen-redirect-theme`)

- **Required Environment Variables (`shopify hydrogen link` + `shopify hydrogen env pull` / `env push --dry-run`)**:
  - `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_ID` (use `0` if your storefront doesn't have one; enables Shopify analytics), `PRIVATE_STOREFRONT_API_TOKEN` (`type: 'private'`, server-only—never expose or prefix with `NEXT_PUBLIC_`), `PUBLIC_CHECKOUT_DOMAIN` (for CSP; checkout links always come from `cart.checkoutUrl`), and (when Customer Accounts are enabled) `SHOP_ID`, `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID`, and `SESSION_SECRET` (`node -e "console.log(crypto.randomBytes(32).toString('base64url'))"`).
  - Never set `PUBLIC_STOREFRONT_API_TOKEN=` to an empty assignment—keep it commented out (`# PUBLIC_STOREFRONT_API_TOKEN=`) unless using a public token. In Next.js, replace `PUBLIC_` with `NEXT_PUBLIC_` and use `NEXT_PUBLIC_SHOP_ID`.
- **Oxygen Build & Deploy Contract (`shopify hydrogen deploy` in `2026.10+`)**:
  - `react-router.config.ts` **must** set `buildDirectory: 'dist'` and `future: { v8_middleware: true }`.
  - Deploy command (requires explicit user approval before live execution):
    ```bash
    npx shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server
    ```
  - **Key `shopify hydrogen deploy` Flags & CI Rules**:
    - **CI `--env` Rejection Trap**: In CI, `shopify hydrogen deploy` requires `--token` (or `SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN`) and **rejects `--env`**. Always pass `--env-branch <branch>` (`SHOPIFY_HYDROGEN_ENVIRONMENT_BRANCH`) in CI workflows instead!
    - **E2E Auth Bypass Token**: Pass `--auth-bypass-token` (`AUTH_BYPASS_TOKEN`) and `--auth-bypass-token-duration <hours>` (1–12 hours, default `2`) to generate a token for automated E2E tests against private Oxygen deployments.
    - **Build & Entry Overrides**: `--build-command` defaults to `node --run build` when custom output dirs are configured; `--entry` defaults to `./server`; `--lockfile-check` verifies a single lockfile; client sourcemaps are disabled by default to prevent leaking server code unless `--force-client-sourcemap` is passed.
    - **Deprecated GitHub Actions**: Do **not** use the archived `Shopify/oxygenctl-action` or `Shopify/github-deployment-action`; invoke `npx shopify hydrogen deploy` directly.
- **Online Store Redirect Theme (`Shopify/hydrogen-redirect-theme`)**:
  - When a Hydrogen storefront runs on a separate domain or subdomain from the Online Store channel, install `Shopify/hydrogen-redirect-theme` as the active Liquid theme and configure `settings.storefront_hostname`.
  - It redirects Liquid storefront URLs (`window.location.replace`) to Hydrogen while **preserving three Online Store-owned surfaces**:
    1. **Flash-sale bot protection (`/checkpoint`)**: Skips redirecting when `window.location.pathname === '/checkpoint'` so Shopify's bot-challenge CAPTCHA completes before sending the buyer back to checkout.
    2. **Gift cards (`templates/gift_card.liquid`)**: Renders gift card balance and QR code on the Liquid store because the Storefront API cannot fetch gift card details.
    3. **Customer Account & B2B location handoff**: Appends `logged_in=true` and `company_location_id={{ customer.current_location.id }}` when redirecting authenticated B2B/D2C buyers back to the Hydrogen storefront.

## 4. Pre-Launch Production Checklist & E2E Contract (`production-checklist`, `hydrogen-smoke-test`, `skills/playwright-tests`)

Type checks and a clean build do **not** prove Hydrogen's request handlers are wired around the router—a storefront can build cleanly and still return `404` for `/api/cart`. Before declaring a storefront ready, run all checks against both dev (`:5173` / `:3000`) and the production build (`npm run preview` on `:4173` or `npm run build && npm run start` on `:3000`):

1. **Static & Schema Gates (in exact order)**:
   - Formatter (`npm run format`), linter/typecheck (`react-router typegen && tsc && hydrogen gql check --fail-on-warn` or `next typegen && tsc --noEmit && hydrogen gql check --fail-on-warn`), `npm run build`, `npm test`, and `format:check`.
2. **Request Handler `curl` Smoke Checks**:
   - **Storefront API proxy**: `curl -i -X POST http://localhost:<port>/api/2026-10/graphql.json -H "content-type: application/json" -H "X-Shopify-Storefront-Access-Token: <public-token>" -d '{"query":"{ shop { name } }"}'` -> returns Storefront API JSON, never a 404.
   - **Cart API**: `curl -i http://localhost:<port>/api/cart` -> returns `200` JSON `{"cart":null}`, never a 404.
   - **Admin redirect**: `curl -i http://localhost:<port>/admin` -> redirects to `/admin` on the store's domain (live store only).
   - **Customer Account login**: `curl -i http://localhost:<port>/account/login` -> redirects (`Location` header) to Shopify's hosted OAuth login page; `/account/logout` accepts only same-origin native `<form method="post" action="/account/logout">`.
   - **Header/Footer navigation & `/collections/all` trap**: Every link in header/footer must return `200`. Do **not** link to `/collections/all` unless the store actually has a collection with handle `all` (Online Store's synthetic `all` collection does not exist in the Storefront API).
3. **Playwright E2E Authoring Rules (`Shopify/hydrogen/skills/playwright-tests` & `packages/storefront-e2e`)**:
   - **Never seed `cart` cookies directly**: Drive all cart/session state through buyer UI interactions so tests stay portable across React Router, Next.js, Astro, Nuxt, and SvelteKit.
   - **Role-based locators & asymmetric assertions**: Prefer `getByRole()` (`button`, `link`, `dialog`, `heading`, `region`, `status`) over CSS/test-id selectors. Assert **absence broadly** (`await expect(page.getByRole('dialog')).toHaveCount(0)`) so renamed labels cannot cause false passes, and assert **presence specifically** (`await expect(page.getByRole('dialog', { name: 'Cart' })).toBeVisible()`).
   - **No fixed sleeps or `networkidle`**: Never use `page.waitForTimeout()` or `waitForLoadState('networkidle')`. Use web-first assertions (`toBeVisible`, `toHaveURL`) or `expect.poll()`.
   - **Private Oxygen preview deployments**: Pass `extraHTTPHeaders: { 'oxygen-auth-bypass-token': process.env.OXYGEN_AUTH_BYPASS_TOKEN }` in Playwright config when running E2E against password-protected Oxygen preview URLs.
4. **Browser Smoke Matrix (Mobile `390x844` + Desktop `1440x900`, zero `console.error` / `pageerror`)**:
   - **Home**: Hero LCP image (`loading="eager"`, `fetchPriority="high"`) and dynamic Metaobject sections render cleanly.
   - **Collection / PLP**: Applying a filter and changing `sort_by` updates URL search params (`filter.v.*`, `sort_by`) without losing filter focus; cursor pagination (`Load more` / `Previous`) and browser back/forward work cleanly.
   - **Product / PDP**: Clicking an available option updates the URL via replace-navigation without scroll jump; sold-out options remain clickable links; non-existent combinations are disabled buttons; `?variant=<id>` redirects to option params; `<ShopPayButton>` disables while add-to-cart is disabled or pending.
   - **Cart & Checkout Handoff**: Adding a variant opens the `<dialog>` cart drawer (`pending.lines.size > 0`), rapid quantity clicks settle on the final quantity, `/cart` works without JS, and the Checkout link uses `cart.checkoutUrl`.
   - **Customer Account & Analytics**: `/account/login` initiates OAuth over HTTPS (`https://local.tryhydrogen.dev`), and `window.Shopify.analytics` publishes `page_viewed`, `product_viewed`, `collection_viewed`, `cart_viewed`, and `product_added_to_cart` only when Customer Privacy consent allows.
