# Shopify AI Toolkit Router

Shared local router for Shopify development work.

## Why this exists

The official Shopify AI Toolkit already provides rich Shopify development skills for Claude, Gemini, and Codex, including docs search and validation. This local router exists to:

- auto-detect Shopify development tasks on this machine
- avoid naming conflicts with official Shopify Toolkit skills
- coexist with existing business/store-operation skills already available locally
- document install and privacy decisions before the official toolkit is installed

## Current analysis

- Official repo: `https://github.com/Shopify/Shopify-AI-Toolkit`
- Current local state: official Shopify AI Toolkit is **not installed** in Claude, Antigravity/Gemini, or Codex here
- Existing local skills already cover store/content workflows, but not the same Shopify dev-tooling scope
- Shopify CLI is installed locally

## What the official toolkit covers

- Shopify docs search
- GraphQL/Liquid/UI validation
- Shopify app, extension, Hydrogen, Functions, and API guidance
- multi-client packaging for Claude/Codex/Gemini/Cursor and others
- built-in Shopify dev skills already including areas like CLI, Liquid, Hydrogen, Functions, Admin, and Storefront GraphQL

## Important privacy note

The official toolkit sends telemetry by default according to its README and embedded skill instructions. If later installed, consider setting:

```bash
OPT_OUT_INSTRUMENTATION=true
```

before using it in sensitive workflows.

## Router policy

1. Prefer the official Shopify AI Toolkit if it is installed
2. If not installed, use this router to classify the task correctly
3. Do not hijack existing store-operation skills like Shopify content/products/setup workflows
4. Use this only for Shopify development work: apps, APIs, extensions, Hydrogen, Functions, Liquid, CLI, validation
5. Do not install supporting upstream repos separately when the official toolkit already covers that area
