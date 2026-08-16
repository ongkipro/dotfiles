# Skill validation cases

These cases match the assertions in the Turnstile Spin PRD. Run them after editing this skill to confirm an agent loading it can still execute the wizard end-to-end.

## Test 1: New-widget creation exposes only safe metadata

From the dotfiles harness, run:

```sh
bin/turnstile-secret-test
```

The fixture generates a synthetic sentinel at runtime, returns it as the API's one-time widget secret, and separately inspects helper stdout, helper stderr, and the isolated temporary runtime filesystem. The widget helper must return exactly `status`, `sitekey`, and `secret_configuration` metadata without exposing or persisting the sentinel.

Expected exit code: 0.

## Test 2: Existing-widget guarded metadata matches the sitekey and secret

```sh
printf '%s' "$WIDGET_SECRET" |
  scripts/validate.sh \
    --sitekey "$SITEKEY" \
    --account-id "$ACCOUNT_ID" \
    --expected-domains '["example.com","localhost","127.0.0.1"]'
```

Expected exit code: 0 for all valid clearance levels: `no_clearance`, `interactive`, `managed`, and `jschallenge`. A secret from another sitekey must fail.

## Test 3: Runtime checks match the protected surface

Inspect every generated frontend and backend pair:

- The widget has a meaningful action such as `signup`, `login`, or `contact`.
- The backend requires the same `result.action` value.
- The backend requires `result.hostname` to match its deployment-specific frontend hostname allowlist.
- A production hostname allowlist does not contain `localhost` or `127.0.0.1`.

## Test 4: Same-page retries reset the correct widget

Native forms that navigate do not need reset logic. For each same-page flow, verify that the code retains the widget ID returned by `turnstile.render()` and calls `turnstile.reset(widgetId)` after the request completes. Multiple protected surfaces must not share a widget ID or reset without an ID.

## Test 5: Skill persists to a bundle location

After Step 11:

```sh
test -f .claude/skills/turnstile-spin/SKILL.md \
  || test -f .codex/skills/turnstile-spin/SKILL.md \
  || test -f .opencode/skills/turnstile-spin/SKILL.md
```

Expected exit code: 0. File-oriented rules targets install the hosted `prompt.md` directly instead of using `persist-skill.sh`.

## Test 6: Existing-backend boundary fails closed

For a pure-static fixture with no server-side handler or provider hook, the wizard must stop before widget creation and must not propose or deploy a Worker, Pages Function, proxy, sidecar, or new form backend.

The retained historical deployment helper must fail without resolving packages, reading credentials, copying a template, or contacting Cloudflare:

```sh
scripts/worker-deploy.sh
```

Expected exit code: 2. Expected JSON reason: `extra_infrastructure_out_of_scope`.

## Running all cases

The new-widget flow must never request or accept the widget secret; the user configures it directly in the destination secret store. Only the separately confirmed existing-widget recovery flow may pass a retrieved secret through standard input to `validate.sh`; it must never export the value or place it in a command argument.

(`run-all.sh` is not bundled with this skill; the cases above are intended to be wired into the consuming agent's own test harness, or run by hand after a deploy.)
