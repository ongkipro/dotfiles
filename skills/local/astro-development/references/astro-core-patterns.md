# Astro Core Patterns

## Prefer Astro-first composition

- layouts in `src/layouts/`
- reusable static sections in `src/components/`
- framework components only where interaction exists
- route files in `src/pages/`

## Good defaults

- use TypeScript
- keep props typed
- keep page data loading close to the route when simple
- extract helpers into `src/lib/` when reused

## Avoid

- turning everything into React by default
- pushing static content through client state
- unnecessary global stores
- oversized component abstractions too early

## Images

- use Astro image features when possible
- prefer responsive images
- always provide meaningful alt text for content images

## Styling

- Tailwind is fine if already chosen
- keep tokens and spacing consistent
- avoid generic AI-looking patterns unless the user explicitly wants them
