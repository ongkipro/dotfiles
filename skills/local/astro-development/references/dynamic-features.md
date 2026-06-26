# Dynamic Features

Use dynamic features surgically.

## Good candidates

- contact/lead forms
- newsletter signup
- authenticated account pages
- search APIs
- lightweight admin pages
- database-backed submissions

## Patterns

- keep public pages static where possible
- mark only necessary routes as server-rendered
- isolate admin/private concerns
- keep database code in a clear lib/data layer

## Database note

A database is optional for most marketing/content sites.
Use one only when the workflow needs stored user or operational data.
