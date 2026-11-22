---
name: codebase-navigation
description: >-
  Trace cross-file calls, dependencies, and change impact with repository search or optional Graphify graphs. Not correctness review (testing-engineering), architecture decisions (adr-record), or shipped binary/bundle/HAR analysis (black-magic).
---

# Codebase Navigation

Start with `rg`, definitions, imports, and callers. For a bounded lookup, stop
there. Use a graph when relationships across modules are costly to reconstruct,
or the user explicitly asks for Graphify. No graph is required for ordinary edits.
For shipped binaries, Electron `.asar` bundles, minified web bundles without
repository source, `.har`/`.saz` captures, Android `.apk`s, or `.sqlite`
snapshots, use `black-magic` instead.

## Optional Graphify lane

Upstream: [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify).
The verified package is `graphifyy==0.9.111` (Python >= 3.11, < 3.15; re-pinned from 0.9.82 on 2026-11-16 after the pilot passed). `pipx run`
uses an isolated cached environment; the first run downloads dependencies.
If pipx is absent, use repository search and report that limitation rather than
installing system packages. Recheck official CLI help before changing versions.

Select the smallest authorized source subtree first. Inspect its file inventory
and upstream exclusions before extraction: `--code-only` skips documents and
LLM extraction, but is not a secret filter: JSON and, since 0.9.95, `.yaml`/`.yml`
(compose files, CI workflows, manifests) are extracted as code. Do not
scan a home directory, credentials, customer exports, or an unaudited mixed
data tree. Narrow the input or prepare an explicitly selected source-only copy.
Exclude paths with repeatable `--exclude <gitignore-pattern>` (it overrides
ignore files) rather than committing a `.graphifyignore`. Parent `.gitignore`
files up to the VCS root apply, but ignore rules never drop files Git already
tracks. A built-in filter skips `.env*`, key/cert files, and credential
dotfiles; it is a heuristic, so read extract's "potentially sensitive" and
"ignored" output lines. `extract` silently ignores unknown flags, so a typo in
`--code-only` would enable the LLM pass: always set `GRAPHIFY_BACKEND=none`.

Example, with a real selected source directory substituted for `/project/src`:

```bash
export GRAPHIFY_BACKEND=none GRAPHIFY_NO_AUTO_REFRESH=1 GRAPHIFY_NO_CTA=1
graph_work=$(mktemp -d)
gfy() { pipx run --spec graphifyy==0.9.111 graphify "$@"; }
gfy extract /project/src --code-only --no-cluster --exclude 'vendor/' --out "$graph_work"
graph="$graph_work/graphify-out/graph.json"
gfy path 'submit()' 'persist()' --graph "$graph"
gfy explain 'persist()' --graph "$graph"
gfy affected 'persist()' --depth 2 --graph "$graph"   # change impact: who reaches this
```

The environment keeps the run offline (no LLM backend), stops graphify from
rewriting skill copies it installed earlier, and suppresses the cloud prompt
and its counter file.

Replace example symbols with actual repository symbols. `path`, `explain`,
`affected`, and `query` exit 3 when a name is ambiguous (qualify it) and 4 when
it is not in the graph; neither means "no dependency". `affected` also accepts
a file path and `--relation`; none of these commands emit JSON, so parse
`graph.json` (NetworkX node-link) when structured data is needed. Skip the HTML
exports: they load scripts from CDNs when opened.
Keep graph output outside the repository. Record input root, revision, and dirty
state with retained evidence; re-extract after relevant source changes. Use a
fresh output directory (or `--force`): an existing one triggers an incremental
merge that reuses its saved `--exclude`/`--code-only` settings. Do not use
`graphify update`; it writes `graphify-out/` into the current directory.

Graph edges are navigation leads. Read the cited source and search callers
before changing behavior; dynamic calls, framework wiring, reflection, and
unsupported syntax may be missing. An absent edge does not prove no impact.
Compare usefulness against the same task with `rg`; do not claim universal
speed, token savings, or complete dependency coverage from one fixture.

Do not run upstream `install`, runtime installers, hook installers, global
indexing, watchers, or MCP configuration as part of this lane. Those change
shared configuration or background behavior beyond repository navigation.

## Executable pilot

`python3 scripts/check-pilot.py` (path relative to this skill) runs the pinned
upstream against synthetic Python files in a temporary directory. It verifies
an imported alias call chain, directed path lookup, `affected` callers,
`--exclude`, the `.env` filter, skipped Markdown, exit 3 (ambiguous) and 4
(missing), zero LLM tokens, and unchanged fixture sources; compares plain text
search hits.
It downloads the package through pipx when uncached. It does not establish
performance or language coverage for a user's application.
