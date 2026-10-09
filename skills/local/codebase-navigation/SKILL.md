---
name: codebase-navigation
description: Trace cross-file calls, dependencies, and change impact with repository search or optional Graphify code graphs. Not correctness review (testing-engineering), architecture decisions (adr-record), or shared memory.
---

# Codebase Navigation

Start with `rg`, definitions, imports, and callers. For a bounded lookup, stop
there. Use a graph when relationships across modules are costly to reconstruct,
or the user explicitly asks for Graphify. No graph is required for ordinary edits.

## Optional Graphify lane

Upstream: [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify).
The verified package is `graphifyy==0.9.82` (Python >= 3.10). `pipx run`
uses an isolated cached environment; the first run downloads dependencies.
If pipx is absent, use repository search and report that limitation rather than
installing system packages. Recheck official CLI help before changing versions.

Select the smallest authorized source subtree first. Inspect its file inventory
and upstream exclusions before extraction: `--code-only` skips documents and
LLM extraction, but is not a secret filter (JSON can still be code). Do not
scan a home directory, credentials, customer exports, or an unaudited mixed
data tree. Narrow the input or prepare an explicitly selected source-only copy.

Example, with a real selected source directory substituted for `/project/src`:

```bash
graph_work=$(mktemp -d)
pipx run --spec graphifyy==0.9.82 graphify extract /project/src --code-only --no-cluster --out "$graph_work"
pipx run --spec graphifyy==0.9.82 graphify path 'submit()' 'persist()' --graph "$graph_work/graphify-out/graph.json"
pipx run --spec graphifyy==0.9.82 graphify explain 'persist()' --graph "$graph_work/graphify-out/graph.json"
```

Replace example symbols with actual repository symbols. Upstream also provides
`query`, `affected`, and optional HTML export; inspect their help when needed.
Keep graph output outside the repository. Record input root, revision, and dirty
state with retained evidence; re-extract after relevant source changes. Use a
fresh output directory to avoid mixing old semantic results with new AST data.

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
an imported alias call chain, directed path lookup, skipped Markdown, zero LLM
tokens, and unchanged fixture sources; compares plain text search hits.
It downloads the package through pipx when uncached. It does not establish
performance or language coverage for a user's application.
