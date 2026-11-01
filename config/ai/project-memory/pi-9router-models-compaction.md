---
name: pi-9router-models-compaction
description: Pi compaction headroom semantics (reserveTokens); Pi's built-in compaction is used; no live model catalog
metadata:
  node_type: memory
  type: project
---

# Pi Compaction Reference

Do not retain a live model catalog, account pool, quota, default model, or fallback
chain in memory. They drift independently of this file. See [[pi-9router-setup]]
and the [optional Pi contract](../../pi/README.md) for ownership.

Pi's built-in compaction runs on the active 9Router model (verified 2026-10-31:
a 69K-token session compacted to ~40K with the conversation facts kept). The
custom compact-free summarizer extension was never loaded by default and was
removed from dotfiles on 2026-11-02; `pi-9router-restore` deletes old copies.

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
