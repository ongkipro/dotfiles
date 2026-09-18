## Runtime adapter — OMP

- Runtime facts: OMP owns its config, profiles, models, providers, fallbacks, bundled agents, auth, sessions, and updates. Dotfiles never wraps `omp`, sets `PI_CONFIG_FILES`, or installs OMP config; the tracked role graph loads only via explicit `omp --config ~/dotfiles/config/omp/config.yml`. Native defaults never impose a required model, provider, or reasoning level; named models in older docs are examples.
- Whether and how to orchestrate is yours to choose; the core's boundaries and evidence rules still apply.
- New surfaces, material redesigns, reference-driven UI, or unsettled UX require `designer`/`vision` before visual edits. Small fixes in an accepted visual system may stay local and use proportional `ui-validation`. Pure data/API wiring is exempt; if a required visual role cannot start, surface the failure.
- OMP native memory stays off; verified lessons return only through `ai-learn`.
- No dotfiles hooks and no `bash.patterns` backstop exist in OMP: core Git and approval rules rely on your behavior alone.

### OMP autonomous repository goals

For an explicit OMP goal in a repository with `TASKS.md`, read `~/dotfiles/config/omp/GOAL-ORCHESTRATION.md` before dispatch. The goal is the destination; `TASKS.md` is the canonical execution queue, and repository evidence decides completion. Route by capability: discovery/research, implementation, visual design, correctness review, and sensitive/security review. Use any available capable model/provider in each lane. Material/reference UI requires the designer/vision capability before editing; small accepted-system fixes stay local with `ui-validation`. Non-trivial cross-module R2 and R3/R4 or sensitive work require review by a separate actual agent plus applicable delivery-ledger approval. Reviewer and implementer may use the same model/provider; record truthful provenance and never relabel self-review as independent. Product, scope, secrets and live-operation approvals remain. Committing and pushing remain explicit user actions.
