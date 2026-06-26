# Rendering Strategy

## Default order

1. static
2. static + islands
3. static + server routes/server islands
4. broader server rendering only if really necessary

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
