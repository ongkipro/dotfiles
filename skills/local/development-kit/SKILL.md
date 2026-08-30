---
name: development-kit
description: >-
  Route an idea, feature, or existing repository through the canonical product,
  specification, UX, visual design, implementation, verification, and release
  owners without creating competing documents. Use when the user asks for the
  development kit, a complete development workflow, which skills or Markdown
  artifacts to use, or how planning should hand off to UI/UX and full-stack
  delivery. Also routes safe extraction from an explicitly supplied worked
  example. Not a substitute for specialist methodology, implementation, or
  approval.
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
local worked-example directory exists.

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

## 2. Choose one planning lane

- Unresolved market, pricing, audience, or product direction:
  `product-intelligence` first.
- Bounded feature or ordinary repository work: `prd-taskbreaker`, using the
  repository's existing `PRD.md` and root `TASKS.md` when present.
- A genuinely multi-domain system whose product, architecture, data, IAM, API,
  security, privacy, operations, or UI contracts must stay traceable:
  `development-spec-suite`. It owns adaptive selection under `docs/spec/`;
  root `TASKS.md` remains the only execution queue.

Do not select a suite because a project merely feels large. Do not jump from
planning approval to implementation authorization.

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

1. **Reference discovery:** for a new surface or material redesign, inspect the
   repository first, then research a small, relevant set of professional
   products: local comparables when market language or operator behavior is
   local, and mature global comparables for broader pattern evidence. Extract
   principles; never copy brand, product policy, or unsupported interaction.
2. **Behavior:** admin/CMS uses `admin-product-ux`; commerce uses
   `storefront-ux`; other surfaces use the PRD plus the relevant product owner.
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
6. **Evidence:** `ui-validation` opens the real page, exercises the critical
   path, inspects narrow and wide layouts, and runs a visual critique/revision
   loop. A build or screenshot alone is insufficient.

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
