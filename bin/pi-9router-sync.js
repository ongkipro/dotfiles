#!/usr/bin/env node
// Refresh only Pi's existing 9Router providers from their public model catalogs.
// Inference credentials remain owned by Pi; this helper never opens auth stores.
//
// Model metadata follows Pi's own generated catalog: a `cc/<id>` row copies the
// built-in `anthropic/<id>` thinking levels, prompt-cache lifetimes and compat,
// and a `cx/<id>` row copies `openai-codex/<id>`. Limits and vision come from
// the gateway, which knows what its upstream account allows. Fields the gateway
// was not verified to carry are removed (see GATEWAY_UNVERIFIED).
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const modelsPath = path.join(os.homedir(), '.pi/agent/models.json');

// Verified 2026-10-31 on Pi 1.4.0 + 9Router 0.5.112: with these flags Pi moves
// the requested effort into mid-conversation system messages and the request
// carries output_config.effort "high" for every level, so `max` and `low` are
// not observable through the gateway. Without them the level is sent directly.
const GATEWAY_UNVERIFIED = [
  'supportsMidConvoEffort', 'supportsMidConvoSystemMessages',
  'supportsMidConvoToolChanges', 'allowedFallbackModels',
];

// Pi's built-in catalogs ship inside the installed pi-coding-agent package.
// PI_9ROUTER_OFFICIAL_DIR, when set, is the only providers directory tried (tests).
function loadOfficial() {
  const rel = 'pi-coding-agent/node_modules/@earendil-works/pi-ai/dist/providers';
  const candidates = [process.env.PI_9ROUTER_OFFICIAL_DIR];
  if (process.env.PI_9ROUTER_OFFICIAL_DIR === undefined) for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    try {
      const cli = fs.realpathSync(path.join(dir, 'pi'));
      candidates.push(path.join(cli, '../../../node_modules/@earendil-works/pi-ai/dist/providers'));
    } catch {}
  }
  if (process.env.PI_9ROUTER_OFFICIAL_DIR === undefined) {
    candidates.push(path.join(path.dirname(process.execPath), '../lib/node_modules/@earendil-works', rel));
  }
  for (const dir of candidates.filter(Boolean)) {
    const anthropic = path.join(dir, 'anthropic.models.js');
    const codex = path.join(dir, 'openai-codex.models.js');
    if (fs.existsSync(anthropic) && fs.existsSync(codex)) return { dir, anthropic, codex };
  }
  return null;
}

async function officialCatalogs() {
  const found = loadOfficial();
  if (!found) return { source: null, anthropic: {}, codex: {} };
  const { pathToFileURL } = require('node:url');
  const a = await import(pathToFileURL(found.anthropic).href);
  const c = await import(pathToFileURL(found.codex).href);
  return { source: found.dir, anthropic: a.ANTHROPIC_MODELS || {}, codex: c.OPENAI_CODEX_MODELS || {} };
}

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function modelMeta(row, existing = {}, official = { anthropic: {}, codex: {} }, providerBase = '') {
  if (!row || typeof row.id !== 'string' || !row.id.trim()) throw new Error('Invalid catalog model ID');
  const caps = row.capabilities || {};
  const model = { ...existing, id: row.id, name: existing.name || row.id };
  const derived = ['api', 'baseUrl', 'compat', 'thinkingLevelMap', 'promptCache'];
  // Without Pi's catalog (e.g. the timer's node cannot see Pi's install), keep
  // fields an earlier catalog-backed run derived instead of downgrading them.
  const keepDerived = !official.source && /^c[cx]\//.test(row.id) && derived.some(key => existing[key] !== undefined);
  if (!keepDerived) for (const key of derived) delete model[key];
  if (typeof caps.reasoning === 'boolean') model.reasoning = caps.reasoning;
  if (typeof caps.vision === 'boolean') model.input = caps.vision ? ['text', 'image'] : ['text'];
  for (const [key, value] of Object.entries({
    contextWindow: row.context_length ?? caps.contextWindow,
    maxTokens: row.max_completion_tokens ?? caps.maxOutput,
  })) {
    if (value !== undefined) {
      if (!Number.isInteger(value) || value <= 0) throw new Error('Invalid catalog token limit');
      model[key] = value;
    }
  }
  if (keepDerived) return model;
  if (row.id.startsWith('cc/')) {
    // The Anthropic client appends /v1/messages itself; a /v1 base doubles it.
    model.api = 'anthropic-messages';
    model.baseUrl = providerBase.replace(/\/v1\/?$/, '');
    const o = official.anthropic[row.id.slice(3)];
    if (o) {
      model.compat = clone(o.compat) || {};
      for (const key of GATEWAY_UNVERIFIED) delete model.compat[key];
      if (o.thinkingLevelMap) model.thinkingLevelMap = clone(o.thinkingLevelMap);
      if (o.promptCache) model.promptCache = clone(o.promptCache);
    } else {
      model.compat = { supportsStrictTools: false };
      if (caps.thinkingFormat === 'claude-adaptive') model.compat.forceAdaptiveThinking = true;
    }
  } else if (row.id.startsWith('cx/')) {
    // 9Router serves /v1/responses; it carries reasoning effort and prompt cache.
    // Codex compat is copied whole: verified 2026-10-31 that effort reaches the
    // gateway as sent and tool calls work through additional_tools/tool search.
    model.api = 'openai-responses';
    const o = official.codex[row.id.slice(3)];
    if (o?.compat) model.compat = clone(o.compat);
    if (o?.thinkingLevelMap) model.thinkingLevelMap = clone(o.thinkingLevelMap);
  }
  return model;
}

// Classifier rows (9Router kind "systemone", e.g. Jev) cannot chat; Pi lists
// classifiers separately, so they stay out of the chat model list.
async function isChatModel(base, id) {
  try {
    const url = `${base}/models/info?id=${encodeURIComponent(id)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(5000), redirect: 'error' });
    if (!response.ok) return true;
    const info = await response.json();
    return !info.kind || info.kind === 'llm';
  } catch {
    return true;
  }
}

async function main() {
  const original = fs.readFileSync(modelsPath, 'utf8');
  const config = JSON.parse(original);
  const providers = Object.entries(config.providers || {}).filter(([id]) => /^9router(?:-|$)/.test(id));
  if (!providers.length) throw new Error('No Pi 9Router provider configured; configure its device-local baseUrl first');
  const official = await officialCatalogs();
  const catalogs = new Map();
  for (const [, provider] of providers) {
    const base = new URL(provider.baseUrl);
    if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) {
      throw new Error('Expected an HTTP(S) baseUrl without credentials, query, or fragment');
    }
    const root = base.href.replace(/\/+$/, '');
    if (!catalogs.has(root)) {
      const response = await fetch(root + '/models', { signal: AbortSignal.timeout(10000), redirect: 'error' });
      if (!response.ok) throw new Error(`Catalog discovery failed (HTTP ${response.status}); existing configuration preserved`);
      const payload = await response.json();
      if (!Array.isArray(payload.data) || !payload.data.length) throw new Error('Empty or invalid model catalog');
      const ids = payload.data.map(row => modelMeta(row).id);
      if (new Set(ids).size !== ids.length) throw new Error('Duplicate catalog model IDs');
      const kinds = await Promise.all(payload.data.map(row => isChatModel(root, row.id)));
      const chat = payload.data.filter((_, i) => kinds[i]);
      if (!chat.length) throw new Error('Catalog has no chat models');
      catalogs.set(root, chat);
    }
    provider.authHeader = true;
    const existing = new Map((provider.models || []).map(model => [model.id, model]));
    provider.models = catalogs.get(root).map(row => modelMeta(row, existing.get(row.id), official, root));
  }
  if (fs.readFileSync(modelsPath, 'utf8') !== original) throw new Error('Pi models changed during discovery; retry explicitly');
  const temporary = `${modelsPath}.${process.pid}.tmp`;
  let created = false;
  try {
    fs.writeFileSync(temporary, JSON.stringify(config, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
    created = true;
    fs.renameSync(temporary, modelsPath);
  } finally {
    if (created && fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
  console.log(JSON.stringify({
    official: official.source ? 'pi catalog' : 'unavailable (gateway metadata only)',
    providers: providers.map(([id, p]) => ({ id, modelCount: p.models.length })),
  }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
