# Astro CLI under an AI agent

Verified on astro 7.4.11 in a Pi session, 2026-11-12, plus the CLI reference
(https://docs.astro.build/en/reference/cli-reference/) and the AI guide
(https://docs.astro.build/en/guides/build-with-ai/). Re-check after an Astro
minor release.

`astro check` (re-run on astro 7.4.11, 2026-11-12) needs `@astrojs/check` and
`typescript` in the project; when they are missing it opens an install prompt
that hangs a non-interactive agent, so add them as pinned dev dependencies or
pass `--yes` only when that install is intended. With TypeScript 7 (verified on 7.0.2) it prints
an error and exits 1 (`astro check` is slated for deprecation): pin TypeScript
6 for `astro check`, or type-check `.astro` files with
`@astrojs/ts-content-mapper` (needs TypeScript 7.1+, a `contentMappers` entry
in `tsconfig.json`, and `tsc --noEmit --runExternalCode`, which runs code from
`node_modules`), or report type-checking as not run.

### Dev and preview servers under an agent (Astro 7)

On Linux and macOS Astro detects an AI agent (`AI_AGENT` and similar variables;
Pi sets `AI_AGENT=pi`) and runs `astro dev` and `astro preview` as a detached
**background** process. Verified on astro 7.4.11 in a Pi session:

- The command returns at once and writes `.astro/dev.json` (or `preview.json`)
  with URL, port and PID. A second `astro dev` prints the running server
  instead of starting another, even with a different `--port` ("Dev server
  already running at …"); do not start an untracked one to "fix" this.
  `astro dev --background --force` replaces the running server (new PID);
  `--force` without `--background` clears the content layer cache and does not
  replace the running server. `--ignore-lock` starts a
  foreground server that `status`/`stop` do not track.
- Readiness: `curl -s <url>/_astro/status` returns `{"ok":true}` (dev only).
- Manage it with `astro dev status`, `astro dev logs [--follow]`, and stop it
  with `astro dev stop` before ending the task (same subcommands for
  `astro preview`). Do not `pkill` node: other sessions run servers too.
- For a URL the owner opens from another device, bind the reachable address
  from the device file (on `rich` the Tailscale IP):
  `astro dev --host <tailscale-ip> --port <free-port>`; background mode keeps it.
- Opt out of agent detection with `ASTRO_DEV_BACKGROUND=0` /
  `ASTRO_PREVIEW_BACKGROUND=0` when a harness must own a foreground process
  (for example Playwright `webServer`). The lock file is still written; a dead
  PID in it is ignored (`astro dev status` reports no server), so it is safe.
- Find slow builds with `astro build --timings` (7.4+).

Current docs for agents: the official Astro Docs MCP server (`search_astro_docs`,
wired as `astro-docs` in every runtime by `ai-mcp-sync`) answers API questions
from the live docs. Astro removed its `llms.txt` files; do not cite them.
