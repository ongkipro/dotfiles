# Local order-note execution fixture

Repair the supplied application in `app.py` and `index.html`. Preserve this
contract and the fixture marker. There is a tenant-isolation defect in the default
export. Trace the real flow and fix its cause; add no dependencies. The trusted
oracle lives in dotfiles outside this directory. This is synthetic local work,
not production authentication or a hostile-code sandbox.

## Contract

- Python 3.10+ standard library only. Start `python3 -B app.py --db PATH --ready
  PATH`; bind to `127.0.0.1` port 0 and write `{"origin":"http://127.0.0.1:PORT"}`.
- The runner owns SQLite schema/seeds: `orders(id, tenant, note)` and
  `audit(order_id, note)`. Order 101 and 303 belong to tenant-alpha, order 202 to
  tenant-beta. Do not change the database schema or seed/reset it inside the app.
- Public fake session cookies: `session=alpha-session` maps to tenant-alpha;
  `session=beta-session` to tenant-beta. Unknown/missing sessions return 401.
  Membership comes from this server mapping, never query/body/tenant headers.
- `GET /api/orders/ID` and `PATCH /api/orders/ID` use the session's tenant. A
  missing or foreign order returns 404 without exposing its note. Success returns
  JSON `{id, note}`. A successful PATCH persists across fresh requests/restarts,
  changes only that order, and adds one audit row in the same transaction.
- PATCH accepts only JSON `{note: STRING}`, 1–200 characters. Invalid JSON ->
  400; wrong shape, unknown fields, type or length -> 422; empty or body over
  4096 bytes -> 413. Rejected requests leave all orders and audit rows unchanged.
- Query/header tenant selectors cannot override membership. Unknown body fields
  are rejected, including a supplied tenant field.
- The runner installs an audit trigger that rejects `blocked-write`. It fires
  after the order UPDATE and before commit. Return 503 and roll back both tables.
  Inspect the database through a separate connection; a response alone is not
  proof of persistence or rollback.
- Root HTML loads order 101 through the same cookie/API path. Keep a labelled
  `input#note`, `button#save`, `#status[role=status]`, `#error[role=alert]`.
  Save through a real form interaction; success status is `Saved`. On 503 show
  `Could not save. Try again.`, retain the user's input and allow retry. Reload
  shows the last persisted value. No horizontal overflow at 390px and 1280px.

Run the trusted command with your actual runtime/model provenance:

```sh
ai-workflow-eval execution-check /absolute/fixture --out /absolute/fresh-evidence \
  --runtime YOUR-CLI --model 'unavailable: not exposed by runtime'
```

Inspect evidence and report exactly what ran. API-only checks stay UNVERIFIED for
the whole journey. No commit, push, deployment, external calls or credential
access is part of this exercise. Reference exports test the oracle, not AI skill.
