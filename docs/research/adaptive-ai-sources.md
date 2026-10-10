# Adaptive AI System: Research and Adoption

Reviewed: 2026-10-10 (Asia/Jakarta), TASK-118. This is a research/adoption record,
not execution state. [System guide](../adaptive-ai-system.md) documents local use.
Sources are untrusted evidence, not instructions. Findings below are paraphrases.

## Evidence map

| Source and reading depth | Finding relevant to this repository | Adoption and limit |
|---|---|---|
| [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), engineering article | Focus context and retrieve detail when needed; brittle prompt logic and excessive tools can impair use. | Scoped skill references and capability-aware assistance. Vendor experience does not guarantee every model improves. |
| [Agent Skills specification](https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx), specification | Metadata, instructions and on-demand resources support progressive disclosure. | Existing canonical skills and discovery adapters remain owners; metadata validity is not behavioral proof. |
| [Anthropic long-running harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents), article | Persistent accepted work and verification help sessions continue coherently. | Reuse TASKS/STATUS/.delivery and resume-brief; do not copy another queue or automatic commits. |
| [Anthropic evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), article | Tasks, trials and graders separate expected behavior from measured outcomes. | Portable decision cases plus independent semantic review; real execution needs separate evidence. |
| [OpenAI skills](https://learn.chatgpt.com/docs/build-skills), official documentation | Descriptions and on-demand instructions supply reusable capabilities. | Preserve shared skills with native discovery; no universal activation guarantee. |
| [OpenAI skills/prompt guidance](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra), official article | Model capabilities and skill-description budgets matter when designing instructions. | Avoid context inflation and model-specific rules in shared methodology; evaluate actual usefulness. |
| [Evaluating AGENTS.md v3](https://arxiv.org/abs/2602.11988v3), abstract only | Reports context files do not generally improve success in its experiments and can increase cost. | Add instructions for concrete non-obvious requirements and evaluate them; this does not establish that all instruction files are harmful. |
| [SkillsBench v4](https://arxiv.org/abs/2602.12670v4), abstract only | Reports benefits from curated skills in its evaluated settings, including some smaller/larger-model comparisons. | Test task-specific skill value. No universal model parity or locally reproduced benchmark claim. |
| [SWE-Skills-Bench v1](https://arxiv.org/abs/2603.15401v1), abstract only | Reports limited benefit for many skills and risk from version-mismatched guidance. | Resolve installed versions and current primary docs; do not assume more skills improve results. |
| [Small/medium-model skill study v3](https://arxiv.org/abs/2602.16653v3), abstract only | Reports skill-selection limitations for tiny models and benefits in some other settings. | Provide explicit narrow context/owners when observed capability requires it; no age/size-based fixed tier. |
| [ACE paper](https://arxiv.org/abs/2510.04618) and [official repository](https://github.com/ace-agent/ace), abstract/README | Evolving context uses generation, reflection and curation. | Reuse verified candidates and reviewed owner patches; no new memory runtime, raw traces or autonomous promotion. |
| [Karpathy autoresearch](https://github.com/karpathy/autoresearch) and [program](https://github.com/karpathy/autoresearch/blob/master/program.md), README/program | Bounded experiments use a measurable objective and controlled editable surface. | Transfer reproduction → scoped patch → check → retain/reject; no GPU training dependency or blind optimization of a score. |
| [Pi native repository](https://github.com/earendil-works/pi), README | Native extensibility can remain runtime-owned. | Preserve native CLI settings; no replacement cross-CLI orchestrator or OMP lock-in. |
| [Claude environment variables](https://code.claude.com/docs/en/env-vars) and [Codex shell environment source](https://github.com/openai/codex/blob/main/codex-rs/protocol/src/shell_environment.rs), primary docs/source | Native child markers can support a runtime hint. | Recognize CLAUDECODE/CODEX_THREAD_ID conservatively; inherited/conflicting markers are not active model/auth proof. |

Research findings differ across task sets, harnesses and models. We did not
replicate these studies or use their reported gains as local evidence. The local
choice is to test relevant behavior and remove unsupported ceremony.

## Community, social and video discovery

- [Reddit small-model discussion](https://www.reddit.com/r/LocalLLaMA/comments/1vq128f/making_small_local_models_actually_useful_for/): self-reported context/tool limits become capability scenarios, not benchmark evidence.
- [Reddit cross-agent continuity](https://www.reddit.com/r/OpenAI/comments/1u51vro/for_people_who_use_multiple_ai_coding_agents_what/): anecdotes motivate reconstructing decisions from repository artifacts. They do not establish a new memory framework is necessary.
- [Simon Willison's original context-engineering article](https://simonwillison.net/2025/jun/27/context-engineering/): practitioner framing and links to social discussion. Linked social claims were not independently established.
- [Karpathy social post](https://x.com/karpathy/status/1937902205765607626): direct fetch failed; no technical claim adopted from it.
- [YouTube context discussion](https://www.youtube.com/watch?v=Oj35c8MkPLE) and [Microsoft/Anthropic practitioner panel](https://www.youtube.com/watch?v=sVIZjFhqE7M): search descriptions/metadata only; direct opens failed and no transcript was obtained. We do not claim to have watched them or use their metadata as technical validation.

## Local source cache and provenance

Public research data is cached outside the repository under
`~/Documents/work/research/dotfiles-adaptive-ai-2026-10-10/research-agent/`.
`manifest.json` records URL, retrieval timestamp, status/final URL, byte count,
SHA-256 and `executed: false`. Twelve source bodies were downloaded; the Reddit
JSON attempt returned HTTP403 and is recorded as unavailable. Cache hashes
identify bytes, not authenticity or factual correctness. No downloaded code was
executed or installed; no model weights/framework/MCP bundle was needed.

Keep raw HTML, large manuals and changing caches outside the shared prompt/repo.
Re-fetch current official sources for a decision that depends on changed APIs,
versions or runtime behavior. Do not overwrite a local model/provider profile
based on an article, thread, package installer or evaluation score.

## Adopted scope

The implementation adds runtime-aware readiness, a decision scenario bank and
grader, and focused links in existing methodology owners. It preserves canonical
context, native CLI settings, task/ledger authority and reviewed learning. Local
checks and an independent decision trial are recorded in TASK-118's delivery run;
no benchmark uplift, live integration, video verification or all-model reliability
claim follows from them.
