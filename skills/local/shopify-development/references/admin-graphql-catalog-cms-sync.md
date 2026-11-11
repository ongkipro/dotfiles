# Admin GraphQL Catalog, Sales Channels, CMS, Policies & Metaobject Sync

Use these patterns with `shopify store execute --store <shop>.myshopify.com` (see [`cli-5-operations.md`](cli-5-operations.md)) to audit or synchronize Shopify Admin data so Liquid themes and Hydrogen/headless storefronts never suffer from missing publications, `null` policies/pages, or invisible Metaobjects.

---

## 1. Sales Channel Publications Audit & Sync (The #1 "Missing Product" Cause)

A product or collection with `status: ACTIVE` in Shopify Admin is **still `null` in the Storefront API** unless it is published to the exact `Publication` backing your Hydrogen storefront or Headless channel!

### Audit All Sales Channels (`publications`)

```graphql
query AuditPublications {
  publications(first: 25) {
    nodes {
      id
      name
      autoPublish
      supportsFuturePublishing
      app {
        id
        title
        handle
      }
    }
  }
}
```

### Check Which Channels a Product / Collection Is Published To

```graphql
query CheckProductPublications($handle: String!) {
  productByHandle(handle: $handle) {
    id
    title
    status
    totalInventory
    resourcePublicationsV2(first: 20, onlyPublished: false) {
      nodes {
        isPublished
        publishDate
        publication {
          id
          name
        }
      }
    }
  }
}
```

### Publish a Product or Collection to Online Store + Hydrogen (`publishablePublish`)

*(Requires `write_publications` scope and `--allow-mutations` after explicit approval)*

```graphql
mutation PublishToStorefrontChannels($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) {
    publishable {
      publishedOnPublication(publicationId: "gid://shopify/Publication/123456789")
    }
    userErrors {
      field
      message
    }
  }
}
```

Variables example:
```json
{
  "id": "gid://shopify/Product/987654321",
  "input": [
    {"publicationId": "gid://shopify/Publication/111111111"},
    {"publicationId": "gid://shopify/Publication/222222222"}
  ]
}
```

---

## 2. Catalog, Variants & Collections Audit

### Full Storefront-Readiness Catalog Audit Query

Verify product counts, `ACTIVE` vs `DRAFT` status, zero-price or missing-SKU variants, missing featured media, and SEO metadata:

```graphql
query CatalogReadinessAudit($first: Int = 50, $after: String) {
  products(first: $first, after: $after, sortKey: UPDATED_AT, reverse: true) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      handle
      title
      status
      totalInventory
      featuredMedia {
        preview {
          image {
            url
            altText
          }
        }
      }
      seo {
        title
        description
      }
      variants(first: 50) {
        nodes {
          id
          title
          sku
          price
          compareAtPrice
          availableForSale
          inventoryQuantity
        }
      }
    }
  }
}
```

### Atomic Product & Variant Upsert (`productSet`)

Prefer `productSet` (`synchronous: true` for `< 100` variants) over legacy multi-step `productCreate` + `productVariantsBulkCreate` chains when synchronizing structured product specs, options, variants, and metafields idempotently:

```graphql
mutation UpsertProduct($input: ProductSetInput!, $synchronous: Boolean = true) {
  productSet(input: $input, synchronous: $synchronous) {
    product {
      id
      handle
      status
      variants(first: 50) {
        nodes {
          id
          sku
          price
        }
      }
    }
    userErrors {
      code
      field
      message
    }
  }
}
```

### `/collections/all` Headless Parity Check

Online Store Liquid synthesizes `/collections/all` automatically, **but the Storefront API does NOT** unless an actual collection with `handle: "all"` exists and is published! Audit collections before launching Hydrogen:

```graphql
query AuditCollections {
  collections(first: 50) {
    nodes {
      id
      handle
      title
      productsCount {
        count
      }
      ruleSet {
        appliedDisjunctively
        rules {
          column
          relation
          condition
        }
      }
    }
  }
}
```

---

## 3. CMS Pages, Blogs, Legal Policies & Navigation Menus

Never ship hardcoded institutional pages, fake blog JSON files, or static legal policies in frontend code while Shopify Admin is empty — Shopify Checkout links directly to Admin `shopPolicies`, creating legal and UX drift!

### Single-Query CMS, Menu & Legal Policy Audit

```graphql
query AuditCmsMenusAndPolicies {
  shop {
    name
    primaryDomain {
      host
      url
    }
    shopPolicies {
      id
      type
      title
      url
      body
    }
  }
  menus(first: 20) {
    nodes {
      id
      handle
      title
      items {
        id
        title
        type
        url
        items {
          id
          title
          type
          url
        }
      }
    }
  }
  pages(first: 50) {
    nodes {
      id
      handle
      title
      isPublished
      updatedAt
    }
  }
  blogs(first: 20) {
    nodes {
      id
      handle
      title
      articlesCount {
        count
      }
    }
  }
}
```

### Creating / Updating Institutional Pages & Legal Policies

- **Pages**: Use `pageCreate` / `pageUpdate` (`read_online_store_pages`, `write_online_store_pages`) with `isPublished: true`, clean semantic HTML in `body`, and descriptive non-CTA SEO metadata (`shopify-content-helper` rules).
- **Menus**: Use `menuCreate` / `menuUpdate` (`write_online_store_navigation`) for `main-menu` and `footer`, linking to real `COLLECTION`, `PAGE`, `BLOG`, `HTTP`, or `SHOP_POLICY` resources so Liquid and Hydrogen read the exact same navigation tree.
- **Policies**: Use `shopPolicyUpdate` (`write_legal_policies` when supported by app scopes, or guide merchant in `Settings -> Policies`) for `PRIVACY_POLICY`, `REFUND_POLICY`, `SHIPPING_POLICY`, `TERMS_OF_SERVICE`, and `CONTACT_INFORMATION`.
- **URL Redirects**: Before migrating a store or changing handles, bulk-verify `urlRedirects(first: 100)` and create missing 301s with `urlRedirectCreate({ urlRedirect: { path, target } })`.

---

## 4. Metaobjects & Metafields Schema Strategy

### Merchant-Owned (`custom.*`) vs App-Reserved (`$app:`) Namespaces

| Ownership Model | Namespace / Type Syntax | When to Use | Key Trade-off |
| --- | --- | --- | --- |
| **Merchant-Owned** | `custom.<key>` (Metafields) or unprefixed `<type>` (e.g., `route`, `section_hero`) | Storefront-specific CMS sections, material care specs, size charts, FAQ blocks managed directly in Shopify Admin (`Content -> Metaobjects`). | Editable by store staff and `shopify store execute` without deploying a custom app. |
| **App-Reserved** | `$app:<key>` / `$app:<type>` declared in `shopify.app.toml` | Companion custom Shopify apps or Checkout UI Extensions (`useAppMetafields()`). | Deploys atomically via `shopify app deploy`, protected from mutation by other apps, zero-latency reads in Checkout UI Extensions. |

### The Two Silent Storefront API `null` Traps on Metaobjects

When aHydrogen or Storefront API query (`metaobject(handle: ...)` or `metaobjects(type: ...)`) unexpectedly returns `null` even though entries exist in Admin:

1. **Trap 1 — Missing `PUBLIC_READ` Storefront Access**:
   - By default, `metaobjectDefinitionCreate` and `metafieldDefinitionCreate` set `access.storefront = NONE`!
   - **Fix**: Explicitly set `access: { storefront: PUBLIC_READ }` on every Metaobject and Metafield definition consumed by a storefront:
   ```graphql
   mutation CreateStorefrontMetaobjectDef($definition: MetaobjectDefinitionCreateInput!) {
     metaobjectDefinitionCreate(definition: $definition) {
       metaobjectDefinition {
         id
         type
         access {
           storefront
         }
       }
       userErrors {
         field
         message
       }
     }
   }
   ```
   With variables:
   ```json
   {
     "definition": {
       "name": "Route",
       "type": "route",
       "access": {
         "storefront": "PUBLIC_READ"
       },
       "capabilities": {
         "publishable": {"enabled": true},
         "translatable": {"enabled": true}
       },
       "fieldDefinitions": [
         {"key": "title", "name": "Title", "type": "single_line_text_field"},
         {"key": "sections", "name": "Sections", "type": "list.metaobject_reference"}
       ]
     }
   }
   ```
2. **Trap 2 — `publishable` Capability Enabled While Entry Is `DRAFT`**:
   - When `capabilities.publishable.enabled = true` on a Metaobject definition, newly created entries default to `status: DRAFT` and are **hidden from the Storefront API** until set to `ACTIVE`!
   - **Fix**: Pass `"capabilities": { "publishable": { "status": "ACTIVE" } }` in `metaobjectUpsert` / `metaobjectCreate`.

### Atomic Custom Data Writes (`metafieldsSet` & `metaobjectUpsert`)

- **`metafieldsSet`**: Writes up to **25 metafields atomically** across one or more `ownerId` resources (`Product`, `ProductVariant`, `Collection`, `Page`, `Shop`) with no prior metafield ID lookup required.
- **`metaobjectUpsert`**: Upserts a Metaobject by unique `handle: { type, handle }` idempotently — safe for repeatable content seeding scripts.
