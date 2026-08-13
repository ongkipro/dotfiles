# Next.js Commerce Patterns

This document outlines advanced, production-ready implementation patterns for Next.js App Router storefronts, extracted from reference commerce architectures. It focuses on optimistic state, headless URL-driven UI, and type-safe data fetching.

## 1. Server Actions + Optimistic Cart State Machine

The cart is managed using a robust combination of Next.js Server Actions for mutations and `React.useOptimistic` for instant UI feedback, avoiding heavy client-side state libraries.

### State Machine (`cart-context.tsx`)
- **Initialization:** The context consumes a `cartPromise` via `React.use()`, meaning the initial state is server-rendered without blocking the main render tree.
- **Optimistic Updates:** `useOptimistic(initialCart, cartReducer)` wraps the server cart. A pure reducer handles `ADD_ITEM` and `UPDATE_ITEM` actions.
- **Local Reconciliation:** When adding an item, the reducer calculates the new line item total and total cart quantity locally, creating a realistic optimistic payload that instantly reflects in the UI before the server responds.

### Mutation Execution (`actions.ts` & `add-to-cart.tsx`)
- **Form Actions:** Interactions are wrapped in `<form action={...}>`. This enables progressive enhancement, though the primary flow uses the `useActionState` (formerly `useFormState`) hook.
- **Synchronous Optimism:** The component calls the local `updateOptimisticCart` synchronously alongside dispatching the server action.
- **Cache Invalidation:** Server actions (like `addItem`, `removeItem`) call Shopify mutations and immediately use `updateTag(TAGS.cart)`. This forces Next.js to revalidate the cart cache, seamlessly syncing the optimistic state back to the authoritative server state.

## 2. Headless Variant Selector State Logic

Variant selection avoids complex React state (`useState`) and relies entirely on URL Search Parameters, making every product variation directly linkable and indexable.

### URL-Driven State (`variant-selector.tsx`)
- **Combination Mapping:** All available product variants and their selected options are mapped into a `combinations` array. This provides a fast local lookup for availability.
- **State Preservation:** When updating an option, the component merges the new selection with the *existing* `searchParams`. This ensures that other URL state (like `utm` tags or referral codes) is not destroyed.
- **Headless Routing:** Updates use `router.replace('?${params.toString()}', { scroll: false })`. This updates the URL and triggers a server component re-render to fetch the new variant's data without jumping the scroll position.
- **Validation:** Options are visually disabled if their combination does not exist in the `combinations` map or if `availableForSale` is false, preventing invalid mutation attempts.

## 3. Headless Search & Filter URL State Preservation

Search filtering follows the same headless, URL-driven philosophy as variant selection, maintaining sort orders and paths across navigations.

### Filter Component Architecture (`search/filter/index.tsx`)
- **Component Separation:** The UI is split into a desktop list (`FilterItemList`) and a mobile dropdown (`FilterItemDropdown`), both reading from the same `searchParams`.
- **Query Parameter Management:** The `SortFilterItem` constructs new URLs by appending its specific `sort` parameter while preserving existing `q` (search query) parameters.
- **Prefetching:** Next.js `<Link>` components are used with conditional prefetching (`prefetch={!active ? false : undefined}`). This optimizes bandwidth by not prefetching the currently active state.
- **Dropdown State:** The mobile dropdown uses a simple click-outside hook (`useEffect` with a `ref`) to manage its open state, while its active value is strictly derived from the current URL path or search parameters.

## 4. Type-safe GraphQL Mapping & SEO OpenGraph

Data fetching is strictly typed end-to-end, and SEO metadata is generated dynamically using Next.js conventions.

### Type-safe GraphQL (`lib/shopify/types.ts`)
- **Precise Overrides:** Base Shopify types are omitted and overridden with localized types where necessary (e.g., `Omit<ShopifyProduct, "variants" | "images"> & { variants: ProductVariant[]; images: Image[]; }`). This cleans up GraphQL Connection wrappers (`edges`, `node`) into flat arrays for UI consumption.
- **Fragment Colocation:** GraphQL fragments (`seoFragment`) are defined in isolated files (`lib/shopify/fragments/seo.ts`) and composed into larger queries. This ensures that the requested fields perfectly match the TypeScript interfaces.

### Dynamic SEO Generation (`app/product/[handle]/page.tsx`)
- **`generateMetadata`:** This Next.js function fetches the product independently (deduplicated by the Next.js `fetch` cache) to construct the `<head>`.
- **OpenGraph & Robots:** It maps the product's featured image to the `openGraph.images` array and uses a custom tag (`HIDDEN_PRODUCT_TAG`) to dynamically set `robots.index` and `robots.follow` to false for hidden products.
- **JSON-LD Schema:** The main page component renders a structured `<script type="application/ld+json">` tag with `schema.org/Product` and `AggregateOffer` types, directly driven by the type-safe product prop.
