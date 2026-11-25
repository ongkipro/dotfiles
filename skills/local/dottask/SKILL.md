---
name: dottask
description: >-
  Operate the dottask team app (tasks, projects, DAG flow, IDR cash/reimburse ledger) through the `dottask` CLI or stdio MCP. Sole write path for operational data; the Web App is read-only except personal PIN change. Triggers: dottask, catat expense, buat task, TSK-, TRX-.
---

# dottask

Internal task + IDR ledger app at `https://dottasks.vercel.app` (prod) — repo `~/Projects/dottask`, contracts in its `AGENTS.md`/`PRD.md`/`STATUS.md`. All operational writes go through the `dottask` CLI (`~/dotfiles/bin/dottask`, `DOTTASK_REPO` override) or the `dottask` stdio MCP — never the browser, never hand SQL.

Canonical operator guide: `GET https://dottasks.vercel.app/guide` (device-token gated `text/markdown`; fetch with a `dtk_live_` bearer, e.g. `secrets-env get DOTTASK_DEVICE_TOKEN`). Source file `docs/agent-guide.md` in the repo — update it there and redeploy.

## Auth & endpoints

- Device token resolves inside the CLI via `secrets-env get DOTTASK_DEVICE_TOKEN`; never print, pass on argv, or store elsewhere. Missing/malformed → `device add` via `scripts/dottask-admin.ts` on a host trusted with `DATABASE_URL` (owner approval).
- `DOTTASK_API_URL` overrides the production default (https only; loopback http for tests). `.dottask.json` `{"project":"<slug>"}` at a repo root binds the default project.
- Members: `ongki` (admin), `feri` (member), `faiz` (viewer, web-only). A `viewer` can never own a device.

## Guardrails (mandatory)

1. **Dedup before create** — `dottask task list --project <p>` / `finance list` first; do not double-enter a task or ledger row.
2. **Confirm before sending** — any `finance expense|income|transfer` ≥ `Rp 1.000.000`, any `finance void`, and any `settle-reimburse` need explicit owner confirmation in the same turn (state amount + target).
3. **Always report codes** — echo the `TSK-*`/`TRX-*`/`PRJ-*`/`ATT-*` code back; never answer with titles alone.
4. **`--key` idempotency** — pass a stable `--key` when retrying a finance mutation after a timeout; never blind-retry a money write.
5. **Ledger integrity** — corrections only via `finance void <TRX-n> --reason`; never suggest SQL deletes or edits.

## Daily commands

```sh
dottask summary                                   # tasks, blockers, balances, pending reimburse
dottask task create "<title>" --project <slug> [--assignee m] [--priority p] [--depends-on TSK-n]
dottask task update TSK-n --status done [--note ..] [--attach <path>]
dottask finance expense <idr> "<desc>" --wallet <w> [--category c|--reimburse --member m] [--attach <path>]
dottask finance income <idr> "<desc>" --wallet <w>
dottask finance transfer <idr> --from <w> --to <w>
dottask finance settle-reimburse <member> --wallet <w>
dottask finance list --reconcile                  # cached vs ledger drift (OK/DRIFT)
dottask export pdf|csv <export-path> --out <file>
```

## Failure handling

- `401` → token revoked/unknown: `device list` via admin script; revoke + re-add, update `secrets-env`.
- `423` → member PIN locked (15 min): wait, or `member reset-pin` via admin script.
- Probe health before blaming the CLI: `curl -fsS https://dottasks.vercel.app/api/health/db` (`OBSERVABILITY.md` runbook).
