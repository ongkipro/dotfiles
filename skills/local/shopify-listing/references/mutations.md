# Shopify CLI — Query & Mutation Cheat-Sheet

All via: `shopify store execute --store <store>.myshopify.com --query '...' [--variables '{...}'] [--allow-mutations]`
Output: parse JSON after the success banner (`sed -n '/^{/,$p'`). Mutations need `--allow-mutations`.

## Read / audit
```graphql
# Shop + product count
query { shop{ name primaryDomain{url} } productsCount{ count } }

# Paginate products (use endCursor as $cursor next page)
query($cursor:String){ products(first:50, after:$cursor){
  pageInfo{ hasNextPage endCursor }
  nodes{ id title handle status productType vendor totalInventory tags
         seo{ title description } descriptionHtml
         priceRangeV2{ minVariantPrice{ amount currencyCode } }
         category{ name fullName }
         options{ id name optionValues{ id name } }
         variants(first:40){ nodes{ id title sku inventoryQuantity selectedOptions{ name value } image{ url } } }
         media(first:30){ nodes{ ... on MediaImage{ id alt image{ url } } } }
} } }
```
Mine specs from junk `descriptionHtml` with regex on `<span>key</span>: <span>value</span>`. Drop origin/"NONE".

## Variant cleanup (remove country variants, keep market)
```graphql
# Delete non-US variant ids
mutation($pid:ID!,$vids:[ID!]!){ productVariantsBulkDelete(productId:$pid, variantsIds:$vids){ product{ variantsCount{count} } userErrors{ message } } }
# Delete the now-single-value "Ships From" option
mutation($pid:ID!,$opts:[ID!]!){ productOptionsDelete(productId:$pid, options:$opts, strategy:POSITION){ deletedOptionsIds userErrors{ message } } }
```
Keep variants whose "Ships From" == the chosen market (default `United States`). Never touch kept SKUs.

## Rename variant option + values
```graphql
mutation($pid:ID!,$option:OptionUpdateInput!,$vals:[OptionValueUpdateInput!]){
  productOptionUpdate(productId:$pid, option:$option, optionValuesToUpdate:$vals){ userErrors{ message } } }
# vars: option:{id, name:"Style"}  vals:[{id, name:"Tower Bridge (LED)"}, ...]
```
Identify code values by reading each variant's `image.url` (download + view).

## Update content + category
```graphql
# NOTE: type is ProductUpdateInput! (NOT ProductInput!) on current API versions
mutation($p:ProductUpdateInput!){ productUpdate(product:$p){ product{ id } userErrors{ message } } }
# p: { id, title, handle, descriptionHtml, seo:{title,description}, tags:[...], productType, category:"gid://shopify/TaxonomyCategory/tg-4" }
```

## Category (Shopify taxonomy = Google product category)
```graphql
query{ taxonomy{ categories(first:6, search:"puzzle"){ nodes{ id fullName } } } }
```
Common toy IDs: `tg-4` Puzzles · `tg-4-7` Jigsaw Puzzles · `tg-5` Toys · `tg-5-7` Building Toys · `tg-5-7-13` Marble Track Sets · `tg-5-10` Executive Toys (fidget) · `tg-5-13-9` Musical Boxes · `tg-5-26` Toy Weapons & Gadgets · `tg-5-18` Remote Control Toys. Always search for the best fit per niche.

## Image SEO
```graphql
# ALT text (write_products) — batch all of a product's media in one call
mutation($pid:ID!,$media:[UpdateMediaInput!]!){ productUpdateMedia(productId:$pid, media:$media){ mediaUserErrors{ message } } }
# Rename filename (needs write_files) — batch ~20/call; "Non-ready files" = skip/retry later
mutation($files:[FileUpdateInput!]!){ fileUpdate(files:$files){ userErrors{ message code } } }
# files: [{ id:"gid://shopify/MediaImage/...", filename:"<handle>-1.webp", alt:"..." }]
```

## Collections
```graphql
mutation($i:CollectionInput!){ collectionCreate(input:$i){ collection{ id handle } userErrors{ message } } }
mutation($id:ID!,$pids:[ID!]!){ collectionAddProductsV2(id:$id, productIds:$pids){ job{ done } userErrors{ message } } }
# SEO + cover image (Shopify fetches image.src from the URL). Same SEO rules as products.
mutation($i:CollectionInput!){ collectionUpdate(input:$i){ collection{ handle image{ url } } userErrors{ field message } } }
# i: { id, descriptionHtml, seo:{ title, description }, image:{ src:"https://...cover.png", altText:"<Collection> – <Store>" } }
```
Covers: generate a cohesive set with an image-gen MCP (e.g. Higgsfield `generate_image` → `marketing_studio_image`, consistent background + aspect ratio), download to verify, attach via `image.src`. Skip default smart collections (e.g. "Home page"/frontpage).

## Gotchas
- Online auth token expires mid-batch → `ACCESS_DENIED` → user re-auths. Make scripts resume-safe.
- `productUpdate` uses `ProductUpdateInput!`; `productSet` exists too. Verify type on type-mismatch errors.
- Handles must be globally unique; on "Handle already in use" append a distinguisher.
- `fileUpdate` needs `write_files` scope, separate from `write_products`.
