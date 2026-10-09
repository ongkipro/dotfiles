---
name: pi-9router-models-compaction
description: Pi compaction headroom semantics and source-owned optional compact-free fallback behavior; no live model catalog
metadata:
  node_type: memory
  type: project
---

# Pi Compaction Reference

Do not retain a live model catalog, account pool, quota, default model, or fallback
chain in memory. They drift independently of this file. See [[pi-9router-setup]]
and the [optional Pi contract](../../pi/README.md) for ownership.

The tracked [compact-free implementation](../../pi/extensions/compact-free/index.mjs)
handles `session_before_compact`, tries the actual `COMPACT_MODELS` array in
order, and falls back to normal compaction when its candidates cannot succeed.
Read the implementation rather than treating its introductory comment or an
old successful run as today's provider availability. Its breadcrumb log is
device-local evidence; avoid copying conversation content into shared memory.

## Durable debugging lesson

`reserveTokens` is reserved headroom, not a maximum context length. In the Pi
implementation observed during the original incident, compaction was triggered
when `contextTokens > contextWindow - reserveTokens`. An oversized reserve
therefore caused early compaction. Recheck the installed Pi implementation
before changing settings; do not infer current defaults or limits from this
historical formula.

When diagnosing compaction, distinguish the active model's context window,
headroom, retained recent tokens, and the summarizer's output limit. Verify with
an actual local compaction event before claiming a fix. Do not invoke a paid
provider or access credentials without the relevant authorization.
