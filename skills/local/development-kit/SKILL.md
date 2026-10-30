---
name: development-kit
description: >-
  Route ideas, features, repositories, and skill-system changes to the canonical product, spec, UX, implementation, verification, and release owners. Not specialist methodology or approval; does not implement. Use when unsure which skill applies.
---

# Development Kit Control Plane

Own the route and gates, not every deliverable. Select the smallest complete
path, name the canonical artifact and specialist for each changed fact, and
keep one requirements source, one execution queue, and one implementation
truth.

Read [Reference map](references/reference-map.md) only when the requested path
or artifact owner is unclear. Read [Market engineering](references/market-engineering.md)
only for activated Indonesia/Malaysia market concerns. For cross-CLI skill
upgrades or comparisons with Claude, OpenAI, Kimi, or shadcn, read
[External ecosystem adoption](references/ecosystem-adoption.md). When changing
the shared skill system itself, also read
[Skill evaluation contract](references/skill-evaluation.md). Do not assume a
local worked-example directory exists. For runtime/model capability adaptation,
conversation continuity, or authorized dotfiles improvement, read
[Adaptive execution](references/adaptive-execution.md).

## 1. Resolve authority before work

1. Inspect repository instructions, existing product/spec/design/runtime
   documents, `TASKS.md`, code, tests, and status evidence. Disk wins.
2. If no repository exists, stage accepted planning under
   `~/Documents/work/prd/<slug>/`; promote it only through `project-init` after
   explicit development authorization.
3. Extend an existing canonical artifact. Never create a second PRD, task
   queue, architecture, UX contract, design-system spec, or readiness report.
4. Label unresolved facts `Unknown`, `Assumption`, or `Proposal`; Markdown is
   intent, not runtime proof.

## 2. Select the work type before planning

An actionable request to fix, build, or implement authorizes the scoped
reversible work when its target and intended behavior are clear. Preserve that
authorization across handoffs; ask only for a consequential missing decision or
an action outside it. Research, review, and planning alone do not authorize code.

- **Settled repair or maintenance:** reuse accepted requirements, design, and
  root tasks. Route one concern directly to its specialist; cross-layer work
  goes to `full-stack-development`. Do not require a new PRD or repeat an
  implementation permission question. A status request only reports evidence.
- **Skill-system audit or improvement:** keep the existing owner and evaluation
  contract; use a runtime-native `skill-creator` only when available. Pin
  upstream sources, compare with the existing owner, stay inside the requested
  scope, run regression checks, and get an independent review before claiming
  improvement. Research does not require a product spec pack or authorize edits.
- **Unsettled behavior or requested planning:** choose one lane below, then
  hand accepted work to delivery within the user's existing authorization.

Planning lanes:

- Unresolved market, pricing, audience, or product direction:
  `product-intelligence` first.
- Bounded feature needing requirements or tasks: `prd-taskbreaker`, using the
  repository's existing `PRD.md` and root `TASKS.md` when present.
- A genuinely multi-domain system whose product, architecture, data, IAM, API,
  security, privacy, operations, or UI contracts must stay traceable:
  `development-spec-suite`. It owns adaptive selection under `docs/spec/`;
  root `TASKS.md` remains the only execution queue.
- "Six documents before coding" requests: small/lean apps use
  `prd-taskbreaker` six-doc lite (`PRD.md`/`PLAN.md`/`DESIGN.md`/`TASKS.md`);
  platform or multi-domain systems use `development-spec-suite`.

Tenancy: a feature inside an existing multi-tenant repository stays in the
`prd-taskbreaker` lane, but its tasks carry tenant-scope constraints (tenant
context resolved from server-verified membership; a client-supplied ID is only a selector validated against it) and
negative cross-tenant verification on the production access path; isolation
review goes to `application-security`. Introducing or changing the tenancy
model itself (isolation model, tenant context, custom domains) is multi-domain:
`development-spec-suite` (`06-TENANT-ISOLATION.md`) and/or `adr-record`.

Do not select a suite because a project merely feels large. Do not jump from
planning approval to implementation authorization.

Match implementation owners to the installed stack. If no dedicated skill
exists, keep the framework and use its installed-version official documentation
plus the relevant domain/testing owners. Do not invent a skill, switch stacks,
or install an ecosystem bundle merely to complete the owner map.

Before experience work, resolve the product context: audience segments and
jobs, evidence-backed behavior, geography/market, language and locale, device
and input conditions, trust expectations, content/asset availability, and
whether the product is global, localized-global, or country-specific. Geography
does not by itself prove legal jurisdiction or user behavior. If market or
persona claims are unresolved, route to `product-intelligence`; never invent a
persona to make a design brief look complete.

## 3. Route experience work before visual code

Every maintained browser-visible surface needs an accepted experience contract
proportional to risk before the first visual edit:

For bounded maintenance, reuse the accepted screen behavior, tokens, and
references. Record the small delta inline and run browser validation; fresh
reference research or a redesign handoff is needed only when direction, behavior,
or a material constraint changes. Escalate if the existing contract cannot
resolve the change.

1. **Reference discovery:** for a new surface or material redesign, inspect the
   repository first, then research a small, relevant set of professional
   products: local comparables when market language or operator behavior is
   local, and mature global comparables for broader pattern evidence. When a
   supplied reference is a `.har`/`.saz` capture, shipped
   bundle/binary/APK/SQLite snapshot, or live interactive app whose runtime
   state, computed tokens, or API surface cannot be resolved by static
   screenshots alone, extract that evidence through `black-magic` first.
   Extract principles; never copy brand, product policy, or unsupported
   interaction.
2. **Behavior:** admin/CMS uses `admin-product-ux`; commerce uses
   `storefront-ux`; client-edited content sites choose their editing layer
   through `cms-content`; other surfaces use the PRD plus the relevant product
   owner.
   Define actor, job, journey, screens, states, permissions, recovery, content,
   and responsive outcomes.
3. **Presentation:** admin/data-dense UI uses `admin-dashboard`; marketing,
   public, portfolio, and campaign UI uses `design-taste`; storefront visual
   direction uses `design-taste` after `storefront-ux`.
4. **Visual system:** record accepted tokens, typography, density, shape,
   themes, component behavior, accessibility, and brand/white-label boundaries
   in the existing design artifact. In a suite these belong to
   `10-DESIGN-SYSTEM-WHITELABEL.md`; UX journeys and screen contracts belong to
   `17-UX-FLOWS-SCREEN-CONTRACTS.md`.
5. **Implementation:** route to the installed framework owner and `shadcn-ui`
   only for React-capable component mapping. A component library does not
   supply product workflow or visual direction.
6. **Evidence:** the visual owner (`design-taste` or `admin-dashboard`)
   critiques the build and its findings are fixed first; then `ui-validation` opens the real page, exercises the
   critical path, and inspects narrow and wide layouts. A build or screenshot
   alone is insufficient.

Small changes may keep this contract inline in the accepted task. Create or
extend a durable design/UX artifact only when decisions must be shared across
screens or sessions.

For a suite-backed product, a complete UI planning handoff contains both
`17-UX-FLOWS-SCREEN-CONTRACTS.md` (what users do and how screens behave) and
`10-DESIGN-SYSTEM-WHITELABEL.md` (what the product looks and feels like). For a
standalone product, the accepted `DESIGN.md` may combine those sections when
that remains one coherent source. Completeness is proportional: do not generate
empty documents for concerns that are absent.

Reject generic AI composition unless the job genuinely requires it: repeated
equal cards, cards nested in framed cards, excessive containers, uniform large
rounding, decorative badges, default bento grids, and KPI/chart shells without
an operator decision. Use hierarchy, whitespace, dividers, type, tables,
lists, split panes, timelines, and progressive disclosure according to the job.

## 4. Hand accepted work to delivery

Once behavior and required contracts are accepted, `full-stack-development`
owns cross-layer sequencing and invokes only the activated specialists. A
single settled concern routes directly to its specialist. Apply these gates:

`intent -> accepted contract -> UX/visual acceptance when visible -> implementation -> focused automated checks -> real runtime/browser proof -> independent review when risk requires -> release evidence`

Independent review of risky work uses a separate capable reviewer through
`cross-cli` or the runtime's native review lane. Same model/provider is eligible;
vendor diversity is useful when it adds perspective, not a prerequisite.
The parent owns integration and verification; self-review is not independent.

For a skill or AI-workflow change, define the new capability scenarios and the
existing regression scenarios before claiming improvement. Prefer executable,
deterministic graders; use model or human judgment only for explicitly
subjective criteria. A single successful run proves that run, not a reliability
rate.

Never silently cross planning, secret, destructive, production, migration,
deployment, commit, or push approval boundaries.

## 5. Safe pattern extraction

When the user supplies an existing development-kit or reference pack:

1. Open only the relevant artifact.
2. Classify extracted material as `Invariant`, `Candidate`, `Illustrative`, or
   `Current-source required`.
3. Re-verify vendor APIs, laws, pricing, quotas, platform behavior, and other
   changing facts from current primary sources.
4. Hand the actual edit or decision to the canonical owner in the reference
   map. Never copy fictional organizations, approvals, vendors, numbers,
   regions, legal conclusions, or acceptance status.

## Output contract

Return the chosen lane, canonical artifacts, activated specialists in order,
approval gates, executable evidence required, and unresolved blockers. Do not
create a `DEVELOPMENT-KIT.md`; this skill is the routing contract.
