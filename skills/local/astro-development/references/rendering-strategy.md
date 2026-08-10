# Rendering Strategy

## Default order

1. static
2. static + client islands
3. static output + selected on-demand routes (`prerender = false`)
4. server islands (`server:defer`) for deferred dynamic fragments
5. `output: 'server'` only when most routes need request-time rendering

## Pick static when

- site is mostly content
- pages change at deploy time, not per request
- public marketing/blog/docs pages dominate
- performance and cacheability matter most

## Pick selective dynamic behavior when

- a form submits to the server
- a few routes need DB access
- one account page needs request-time data
- personalization is limited to a small part of the page

## Warning signs

- everything is using client hydration with little benefit
- server rendering is enabled globally for a mostly static site
- `client:load` is used everywhere by habit
- a whole React app is embedded when a tiny island would do

## Practical guidance

- keep headers, footers, cards, article content, and most sections static
- hydrate only mobile menus, filters, forms, or truly interactive widgets
- for public websites, start static and opt into dynamic pieces later

## Do not confuse the two island types

- A client island hydrates browser JavaScript with a `client:*` directive.
- A server island uses `server:defer`, requires an adapter, and fetches deferred
  server-rendered HTML. Its props must be serializable.
- A server island does not make an interactive component; add a client island
  inside only when browser behavior is also necessary.

`output: 'server'` changes the default prerendering behavior; it does not unlock
features unavailable to selectively on-demand routes. Under server output,
mark public static routes with `export const prerender = true`.
