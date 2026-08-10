# Discovery and Domain

## Operational frame

Capture only facts that change the product:

- actor, role, tenant/object scope
- trigger and desired outcome
- frequency, volume, concurrency, and time pressure
- failure cost and regulatory/audit sensitivity
- source of truth and external systems
- terminology operators already use

Ask for concrete recent examples. Abstract preferences produce generic screens;
real failed orders, duplicated leads, and approval escalations expose missing
states.

## Object map

For every first-class object, record identity, human label, owner, scope,
relationships, decision attributes, lifecycle, actions, and audit history.
Distinguish an object from a view: “Unpaid invoices” is normally a filtered view
of invoices. Distinguish stored status from a derived condition such as overdue.

## Information architecture

Group navigation by operator work:

- operations: queues and objects handled daily
- monitoring: health, exceptions, and alerts
- reporting: analysis and exports
- configuration: rules, templates, integrations
- governance: users, roles, audit, tenant administration

Do not default to `Dashboard / Users / Analytics / Settings`. Use proven domain
nouns and jobs.
