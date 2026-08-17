# Verification evidence

Verification should fail on the plausible bug introduced by the change. Reuse
repository scripts, fixtures, local auth state, and the lockfile's package
manager. Do not install a runner, access production, read secrets, or deploy to
obtain evidence.

## Evidence ladder

1. **Static contract check** — the narrowest existing typecheck or focused test
   covering the changed contract.
2. **Framework build** — the repository's build script when the change affects
   route analysis, prerendering, metadata generation, runtime compatibility,
   output, or bundles.
3. **Local runtime smoke** — start the project's real local runtime and exercise
   the affected route/action/handler.
4. **Browser evidence** — required for visible rendering, interaction, form,
   navigation, loading/error UI, responsiveness, or accessibility. Use
   `ui-validation`.
5. **Adapter-specific local evidence** — required when behavior depends on an
   adapter/emulator rather than plain `next dev`/`next start`.

A higher rung does not replace a different kind of evidence. A build can prove
that production compilation and route analysis completed; it cannot prove a
button works, a responsive layout fits, authorization rejects the right actor,
or a distributed cache invalidates.

## Choose commands from the repository

Inspect `package.json` and the lockfile. Prefer an existing `check`, `typecheck`,
`test:<area>`, `build`, `dev`, `start`, `smoke`, or `verify` script. Read a script
before running it; confirm that its default target is local and non-destructive.

Do not assume `next lint` exists. Next.js CLI commands vary by installed version.
If there is no script for a needed framework command, inspect the project-pinned
`next --help` using the lockfile's package manager before invoking it.

Use a supervised long-running process and stop only the process you started.
Never reclaim a port by killing unrelated processes. Pass an explicit local
origin to any smoke script that otherwise has a production default.

## Minimum evidence by change

| Change | Smallest useful evidence |
|---|---|
| Server Component read/render | Focused type/behavior check, then local request to the affected route and observed content/status |
| Client boundary or interaction | Local page in a real browser; exercise the interaction and inspect relevant console/network failures |
| Route Handler | Local request for the changed method; assert status, content type, safe body/headers, plus malformed and unauthorized cases when applicable |
| Server Action/form | Submit through the real page; observe pending/success or expected error and persistence/navigation; verify unauthorized mutation rejection with the existing harness |
| Cache/revalidation | Production-like local runtime: observe first read, repeated read, mutation, and post-mutation read; prove data/store call behavior rather than inferring from HTML alone |
| Loading/Suspense | Trigger a deterministically slow local fixture/state and observe fallback then resolved content; a screenshot of only the final page is insufficient |
| Error/not-found/redirect | Trigger the exact condition and assert final status/navigation plus safe rendered state |
| Metadata | Request/open the real parameterized route and inspect final head/metadata response; include missing-resource behavior |
| Runtime/output/adapter | Repository build plus the target's supported local emulator/runtime smoke; report unsupported or unexercised capabilities |
| Instrumentation | Start a fresh local server instance and observe bounded registration plus one traced/logged request without sensitive fields |
| Bundle change | Version-matched existing analyzer/build output showing the affected client import moved/changed; hand page-speed claims to `web-perf` |

## Trust-boundary smoke matrix

For a changed mutation or privileged read, exercise the rows that the endpoint
supports:

| Case | Expected observation |
|---|---|
| No session/credential | Rejected with the contract's safe status/state; no mutation |
| Authenticated wrong tenant/owner/role | Rejected; no existence or sensitive-data leak beyond accepted policy |
| Invalid or malformed input | Structured safe validation response; no partial mutation |
| Conflict/replay/duplicate | Domain-defined idempotent or conflict behavior |
| Authorized valid request | Exactly one committed mutation, intended revalidation/navigation |
| Downstream failure | Safe recoverable/error state, no secret/stack leak, transaction invariant preserved |

`application-security` defines the security cases and `testing-engineering` owns
permanent automated coverage. This file defines only the smallest implementation
evidence expected before claiming the Next.js boundary works.

## Cache evidence details

Do not verify cache behavior in development mode unless the official docs for the
installed version explicitly say it matches the target semantics. Use the local
production build/runtime or adapter emulator when safe.

Record:

- configured cache model and deployment form;
- key/scope and the identity of the observed data;
- first-read result and evidence of source work;
- repeated-read result and evidence of reuse/deduplication;
- mutation commit result;
- post-mutation result and evidence the intended cache entry changed;
- whether the test was single-process only.

Two equal HTML responses do not prove a cache hit. A fresh HTML response does not
prove all client/router caches refresh. Use existing safe query counters,
telemetry, response headers, or deterministic fixtures; do not add production
logging solely for a one-off check.

## Streaming evidence details

A Suspense boundary in source proves only structure. To claim streaming:

1. run the deployment-representative local runtime;
2. use a deterministic delayed data source;
3. observe the shell/fallback arrive before the delayed region through the
   browser network/timeline or a non-buffering local client;
4. confirm the proxy/adapter did not buffer;
5. report the actual observation and runtime.

Do not infer streaming from `next build`, a loading file, or a fast local response
where both chunks arrive together.

## Browser evidence

Load `ui-validation` after any visible change. At minimum:

- navigate through the actual route;
- exercise the critical interaction/form and the changed state;
- inspect relevant console errors and failed requests;
- check narrow and wide viewports when layout can change;
- exercise keyboard/focus semantics for affected controls;
- verify expected loading, error, empty, or pending state when changed.

A build, typecheck, unit test, source review, or screenshot alone is not UI
behavior evidence.

## Report format

Report only exercised claims:

```text
Command/runtime: <project script or local runtime>
Surface: <route, method, viewport, actor, and state>
Observed: <status/output/interaction and relevant negative case>
Not verified: <adapter, distributed cache, production env, or other boundary>
```

Do not convert “build succeeded” into “feature works,” “production-ready,” or
“deploy-compatible.”
