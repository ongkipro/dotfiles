# Shopify AI Toolkit Router Decisions

## Non-conflict policy

Do not reuse official Shopify toolkit skill names like:
- `shopify-admin`
- `shopify-dev`
- `shopify-functions`
- `shopify-hydrogen`
- `shopify-liquid`

This local router must keep a distinct name so the official toolkit can be installed later without collisions.

## Existing local skill boundaries

Prefer existing local store-operation skills first when the task is about:
- product creation/import
- content pages/blog posts/navigation
- Shopify connection/setup for store access

Use this router first when the task is about:
- app code
- CLI workflows
- extension config/code
- GraphQL authoring/validation
- Hydrogen development
- Functions development
- Liquid code and schema-aware validation

## Future install policy

If the official Shopify AI Toolkit is installed later:
1. keep this router thin
2. have it prefer the official toolkit skills immediately
3. retain privacy warning about telemetry default
4. keep business/store-operation skills separate from app-dev skills
