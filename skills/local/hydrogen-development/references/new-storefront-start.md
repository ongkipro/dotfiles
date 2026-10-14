# Starting a New Hydrogen Storefront or Migrating to Hydrogen 2026-10

Use this reference when scaffolding a brand-new Hydrogen storefront (`@shopify/hydrogen@2026.10.1`), adding Hydrogen to an existing framework (React Router 7, Next.js App Router, Astro, Nuxt, SvelteKit, SolidStart), or migrating a Classic Hydrogen (`<= 2026.4.x`) project to `2026.10`.

---

## 1. Starting a New Storefront (`2026.10+`)

### Official Templates, Setup CLI & Caret Version Trap

1. **CRITICAL SemVer Caret Trap (`^2026.4.0` vs `~2026.4.0`)**:
   - Both Classic Hydrogen (`2026.4.x`) and the new toolkit (`2026.10.x`) are published under `@shopify/hydrogen`, and `2026.10.1` is now npm `latest`.
   - Because of CalVer major `2026`, a caret range like `"@shopify/hydrogen": "^2026.4.0"` in a Classic storefront **resolves to `2026.10.x` on fresh install and breaks the build**!
   - If maintaining a Classic Hydrogen (`2026.4.x`) storefront without migrating yet, pin with a tilde range (`"~2026.4.0"`) or exact version (`"2026.4.7"`).
2. **Choose your starting path (`2026.10+`)**:
   - **React Router 7 on Oxygen (`Shopify/hydrogen/templates/react-router`)**: Start from Shopify's canonical React Router 7 template (`react-router@7.15.1`, `vite@8`, `react@19.2`, `@shopify/mini-oxygen@4.2.2`, `@shopify/cli@4.8.1`, `@remix-run/cookie`, `@remix-run/session`, `isbot`, Node `^22.12 || ^24`).
   - **Next.js 16+ App Router on Vercel (`vercel/shop`)**: Start from [Vercel Shop](https://github.com/vercel/shop) (`https://vercel.shop`, Next.js 16+ App Router + `@shopify/hydrogen`).
   - **Existing Framework Project (Astro, Nuxt, SvelteKit, SolidStart, React Router, Next.js)**: Run:
     ```bash
     npm install @shopify/hydrogen
     npx @shopify/hydrogen@latest setup
     ```
3. **Sync Packaged Agent Skills & TypeScript Plugin**:
   - Ensure `tsconfig.json` includes `"plugins": [{"name": "@shopify/hydrogen/ts-plugin"}]`.
   - Keep `hydrogen skills check --mode=warn` in the `dev` script and `hydrogen gql check --fail-on-warn` in `typecheck`:
     ```json
     {
       "scripts": {
         "dev": "hydrogen skills check --mode=warn && vite dev",
         "dev:https": "hydrogen skills check --mode=warn && vite dev",
         "build": "react-router build",
         "preview": "react-router build && vite preview",
         "deploy": "shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server",
         "typecheck": "react-router typegen && tsc && hydrogen gql check --fail-on-warn"
       }
     }
     ```
4. **Environment, `resolveShopIdentity` & `mock.shop` Bootstrap (`Shopify/mock-shop-starter`)**:
   - Pull linked store credentials via `npx shopify hydrogen env pull`.
   - `mock.shop` provides 100+ themed demo stores across subdomains (`pets.mock.shop`, `snowboards.mock.shop`, `furniture.mock.shop`, etc.; full catalog at `https://mock.shop/llms.txt`).
   - Follow `templates/react-router/app/lib/shop.ts` (`resolveShopIdentity`): auto-detect `mock.shop` when `env.MOCK_SHOP === '1' || !env.PRIVATE_STOREFRONT_API_TOKEN || isMockShopDomain(env.PUBLIC_STORE_DOMAIN)`.
   - On `mock.shop` (or whenever `PUBLIC_STOREFRONT_ID` is unset), use `type: 'public'` with no token, set `shopifyAnalytics: false`, `scriptShop.storefrontId: ''`, and `analytics.channel: 'headless'` so `<ShopifyScripts>` does not fire bogus analytics/PerfKit requests. On a live store with `PUBLIC_STOREFRONT_ID` set, use `type: 'private'`, `shopifyAnalytics: true`, and `analytics.channel: 'hydrogen'`.

---

## 2. Canonical Oxygen React Router 7 File Checklist (`templates/react-router` & `create-oxygen-template`)

1. **`react-router.config.ts`**:
   - Set `buildDirectory: 'dist'` (required so `shopify hydrogen deploy --assets-dir dist/client --worker-dir dist/server` finds the built worker and client assets), `ssr: true`, and `future: { v8_middleware: true }`.
2. **Required `app/entry.server.tsx` & `app/entry.client.tsx` (Workers Web Streams)**:
   - Because `@react-router/node` is removed on Oxygen (`workerd` has no Node stream runtime), `react-router typegen` and `react-router build` fail with `"Could not determine server runtime"` unless custom entry files exist!
   - `app/entry.server.tsx` must import `renderToReadableStream` from `react-dom/server`, render `<ServerRouter context={routerContext} url={request.url} />`, and `await body.allReady` when `isbot(request.headers.get('user-agent'))` is true.
   - `app/entry.client.tsx` must hydrate with `startTransition(() => { hydrateRoot(document, <StrictMode><HydratedRouter /></StrictMode>); })`.
3. **`vite.config.ts` (Oxygen CJS React Interop & Asset Inlining)**:
   - Remove the legacy `hydrogen()` Vite plugin. Use `plugins: [localHttps({ enabled }), ...oxygen({ entry: './server.ts' }), reactRouter(), tsconfigPaths()]` (`oxygen()` from `@shopify/mini-oxygen/vite` returns an array and must be spread).
   - **Mandatory `ssr.optimizeDeps.include` & `assetsInlineLimit: 0`**: Without `hydrogen()` in Vite, `react` and `react-dom` are CJS packages that fail inside `workerd` with `ReferenceError: module is not defined at .../react/jsx-dev-runtime.js`, and inline data-URI assets break in Oxygen workers. Always set:
     ```ts
     build: { assetsInlineLimit: 0 },
     ssr: {
       optimizeDeps: {
         include: [
           'react',
           'react/jsx-runtime',
           'react/jsx-dev-runtime',
           'react-dom',
           'react-dom/server',
           'react-router > set-cookie-parser',
           'react-router > cookie',
           'react-router',
         ],
       },
     },
     ```
4. **`server.ts` & Oxygen Sub-Request Cache**:
   - Pass `import.meta.env.MODE` (not `process.env.NODE_ENV`) to `createRequestHandler(serverBuild, import.meta.env.MODE)`.
   - Open `const cache = await caches.open('hydrogen-v1')`, bind `const waitUntil = executionContext.waitUntil.bind(executionContext)`, and pass both into `createStorefrontClient({ config: { cache, waitUntil, ... } })`.
   - **Never** use `lru-cache` or `createFetchWithCache` on Oxygen; furthermore, passing per-query `{ cache: Cache.long() }` to `storefrontClient.graphql()` when `config.cache` was omitted throws `StorefrontCacheConfigError`.
5. **Three-Place `routeTemplates` Wiring (`app/lib/routes.ts`)**:
   - Export `export const routeTemplates = createShopifyRouteTemplates()` from `app/lib/routes.ts` and pass `routeTemplates` to all three consumers:
     1. `handleShopifyRoutes({ ..., routeTemplates })` and `handleShopifyRedirects({ ..., routeTemplates })` in `app/root.tsx`
     2. `<ShopifyScripts routes={routeTemplates} navigate={navigate} ... />` in `app/root.tsx`
     3. `getPredictiveSearchItemUrl(item, { routes: routeTemplates })` in predictive search result components

---

## 3. Framework Wiring Map Across Stacks (`2026.10+`)

| Framework | Where `handleShopifyRoutes` / `handleShopifyRedirects` Live | Critical Runtime Nuances |
| --- | --- | --- |
| **React Router 7** (`templates/react-router`) | `export const middleware` in `app/root.tsx` + catch-all `app/routes/$.tsx` | Requires custom Web-streams `entry.server.tsx` + `entry.client.tsx` and Vite `ssr.optimizeDeps.include` for React on Oxygen. |
| **Next.js 16+ App Router** (`vercel/shop`) | **Split across two files**: `proxy.ts` (`export async function proxy(request: NextRequest)`) runs `handleShopifyRoutes` before routing and forwards `requestContext.getForwardedRequestHeaders()` (which sets `x-storefront-url`); `app/not-found.tsx` awaits `connection()` inside `<Suspense>`, reads `x-storefront-url` from `headers()`, and runs `handleShopifyRedirects`. | Because Next.js Server Components cannot commit `Set-Cookie` after `proxy.ts` finishes, RSC Customer Account reads use `ReadonlyCustomerSessionManager` (`isLoggedIn()` + `getAccessToken()`) and `redirect('/account/refresh?return_to=...')` once if the token is expired. |
| **Astro 6** (`examples/astro`) | `src/middleware.ts` (`defineMiddleware`) runs `handleShopifyRoutes`, populates `Astro.locals.storefront`, checks `response.status === 404` for `handleShopifyRedirects`, and calls `applyResponseHeaders`. | On static `export const prerender = true` pages, `Astro.clientAddress` throws because there is no live client connection—use a module-scoped `type: 'private_no_buyer_context'` client instead of `Astro.locals.storefront`. |
| **SvelteKit** (`examples/sveltekit`) | `src/hooks.server.ts` (`handle` hook) | `src/routes/+layout.svelte` (`createCartStore` + `renderShopifyScriptTags`). |
| **Nuxt 3/4** (`examples/nuxt`) | `server/middleware/shopify.ts` | `app.vue` (`@shopify/hydrogen/vue` `<CartProvider>` + `<ShopifyScripts>`). |

---

## 4. Classic Hydrogen (`<= 2026.4.x`) -> `2026.10` Migration Traps (`migrate-to-hydrogen-2026-10`)

When upgrading an existing Classic Hydrogen project (`2026.4.7` or earlier), watch for these high-frequency silent failure traps:

1. **Deferred root `cart` leaves Cart Drawer empty**: Delete the deferred `cart` promise and `<Await resolve={cart}>` from `app/root.tsx`. Instead, `await cartHandlers.get(...)` in the root loader, pass `data` (`{ cart, errors? }`) to `<CartProvider initialData={data}>`, and read `useCart((s) => s.data)` in all cart surfaces.
2. **Cart drawer stops opening on add-to-cart**: `useCartForm()` submits through `CartStore`, not React Router fetchers, so `useFetchers()` never sees the mutation. Open the drawer when `useCart((s) => s.pending.lines.size > 0)` transitions to `true`.
3. **Quantity buttons lock after one click**: Only disable line item controls when `line.id.startsWith('optimistic:')`, not for every `state.pending.lines.has(line.id)`.
4. **Competing route files shadow `handleShopifyRoutes`**: Delete old route files for `/api/cart`, `/cart` action-only endpoints, `/checkout`, `/discount/$code`, `/account/login`, `/account/authorize`, and `/account/logout`, but **keep** `app/routes/$.tsx` so root middleware executes on unmatched URLs.
5. **Removed UI & SEO exports**: Replace `<Image>` / `<MediaFile>` with `<img>` + Shopify CDN search params (`width`, `height`, `crop`), `<Money>` with `formatMoney()`, `<Pagination>` with `CollectionProvider` + `useCollection`, and `getSitemap()` / `getSeoMeta()` with `storefrontClient.graphql()` sitemap queries and native React Router `meta` exports.
6. **Migrate Markets -> Customer Accounts -> Analytics in order**: Markets sets `i18n` currency/language; Customer Accounts shares `sessionManager` with Cart; Analytics (`<ShopifyScripts>` + `window.Shopify.analytics` + `useCartAnalytics()`) depends on both.
