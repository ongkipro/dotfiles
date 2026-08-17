# Primary-source ledger

Last reviewed: **2026-08-17**.

This ledger supports tool selection and the small number of direct commands in
`SKILL.md`; it is not a substitute for inspecting the repository. Runner,
configuration, fake-timer, mocking, isolation, retry, and CLI APIs are volatile.
Before changing a harness or using an option, check the installed package/runtime
version and its matching current official documentation. Project scripts and
lockfile versions are authoritative for execution.

## Node.js test runner

| Primary source | Use |
|---|---|
| [Node.js Test runner API](https://nodejs.org/api/test.html) | `node:test`, hooks, mocking, concurrency, timers, and runner behavior |
| [Node.js CLI `--test` options](https://nodejs.org/api/cli.html#--test) | Direct runner invocation and supported CLI flags |
| [Node.js source repository](https://github.com/nodejs/node) | Versioned documentation and implementation history |

Verified guidance used here:

- `node:test` is Node's built-in test module.
- `node --test` is the documented direct runner form; test-file arguments are
  supported by the Node CLI. Use it only when the repository already chooses the
  Node runner and the installed Node version supports the needed behavior.
- The generic `nodejs.org/api` URL tracks current documentation. For a project on
  an older LTS, select that version from the official version picker before using
  newer flags or APIs.

## Vitest

| Primary source | Use |
|---|---|
| [Vitest Getting Started](https://vitest.dev/guide/) | Supported versions, test discovery, config entry points, and `vitest run` |
| [Vitest CLI guide](https://vitest.dev/guide/cli) | Current non-watch invocation, filters, reporters, and CLI options |
| [Vitest Mocking Dates](https://vitest.dev/guide/mocking/dates) | Fake system time with Vitest's current API |
| [Vitest Test Context](https://vitest.dev/guide/test-context) | Per-test context and extension patterns |
| [Vitest source repository](https://github.com/vitest-dev/vitest) | Versioned source, releases, examples, and issues |

Verified guidance used here:

- `vitest run` is the documented one-shot, non-watch form.
- Invoke the locally installed binary through the repository's package manager or
  script. The official guide notes that `npx` may download a missing binary;
  therefore an undeclared transient `npx vitest` run is not acceptable evidence
  for this skill.
- Confirm the installed Vitest, Vite, and Node versions before adopting current
  examples. Do not assume fake-timer, pool, workspace/project, or coverage APIs
  match the latest site.

## Playwright Test

| Primary source | Use |
|---|---|
| [Writing tests](https://playwright.dev/docs/writing-tests) | Actions, web-first assertions, and test isolation overview |
| [Best practices](https://playwright.dev/docs/best-practices) | User-visible behavior, resilient locators, and controlled dependencies |
| [Test isolation](https://playwright.dev/docs/browser-contexts) | Browser-context isolation and setup tradeoffs |
| [Retries](https://playwright.dev/docs/test-retries) | Worker behavior, retry configuration, and flaky classification |
| [Playwright source repository](https://github.com/microsoft/playwright) | Versioned source, releases, and bundled test-runner implementation |

Playwright is cited for automated browser-test boundaries, isolation, and flake
evidence. `ui-validation` owns actual browser-visible QA and its command selection.
Do not infer that a declared package means browser binaries are installed, and do
not download them silently.

## Testing Library

| Primary source | Use |
|---|---|
| [Guiding Principles](https://testing-library.com/docs/guiding-principles/) | Prefer tests resembling real use and DOM behavior over component internals |
| [About Queries](https://testing-library.com/docs/queries/about/) | Current query priority, semantic queries, and query variants |
| [Async Methods](https://testing-library.com/docs/dom-testing-library/api-async/) | Current async waiting and disappearance APIs |
| [Testing Library organization](https://github.com/testing-library) | Official framework packages and source repositories |

Testing Library has no standalone command prescribed by this skill. Use it only
when the relevant package and DOM environment are already part of the project's
harness; real browser, visual, keyboard, and hydration evidence still belongs to
`ui-validation`.

## Standards

No external specification is used as a normative source in the current skill.
When a project contract explicitly adopts a standard (for example an HTTP RFC,
WCAG criterion, or schema specification), add the exact official stable URL and
revision here before turning it into assertions. Do not test a remembered
paraphrase of a standard.
