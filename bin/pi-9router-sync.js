#!/usr/bin/env node
// Refresh only Pi's existing 9Router providers from their public model catalogs.
// Inference credentials remain owned by Pi; this helper never opens auth stores.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const modelsPath = path.join(os.homedir(), '.pi/agent/models.json');

function modelMeta(row, existing = {}) {
  if (!row || typeof row.id !== 'string' || !row.id.trim()) throw new Error('Invalid catalog model ID');
  const caps = row.capabilities || {};
  const model = { ...existing, id: row.id, name: existing.name || row.id };
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
  if (row.id.startsWith('cc/')) {
    model.api = 'anthropic-messages';
    model.compat = { ...model.compat, supportsStrictTools: false };
    if (caps.thinkingFormat === 'claude-adaptive') {
      model.compat.forceAdaptiveThinking = true;
      model.thinkingLevelMap = { low: 'low', medium: 'medium', high: 'high', xhigh: null, max: null };
    }
  } else if (row.id.startsWith('cx/')) {
    model.api = 'openai-completions';
    model.compat = { ...model.compat, supportsReasoningEffort: true };
  }
  return model;
}

async function main() {
  const original = fs.readFileSync(modelsPath, 'utf8');
  const config = JSON.parse(original);
  const providers = Object.entries(config.providers || {}).filter(([id]) => /^9router(?:-|$)/.test(id));
  if (!providers.length) throw new Error('No Pi 9Router provider configured; configure its device-local baseUrl first');
  const catalogs = new Map();
  for (const [, provider] of providers) {
    const base = new URL(provider.baseUrl);
    if (!['http:', 'https:'].includes(base.protocol) || base.username || base.password || base.search || base.hash) {
      throw new Error('Expected an HTTP(S) baseUrl without credentials, query, or fragment');
    }
    const url = base.href.replace(/\/+$/, '') + '/models';
    if (!catalogs.has(url)) {
      const response = await fetch(url, { signal: AbortSignal.timeout(10000), redirect: 'error' });
      if (!response.ok) throw new Error(`Catalog discovery failed (HTTP ${response.status}); existing configuration preserved`);
      const payload = await response.json();
      if (!Array.isArray(payload.data) || !payload.data.length) throw new Error('Empty or invalid model catalog');
      const ids = payload.data.map(row => modelMeta(row).id);
      if (new Set(ids).size !== ids.length) throw new Error('Duplicate catalog model IDs');
      catalogs.set(url, payload.data);
    }
    provider.authHeader = true;
    const existing = new Map((provider.models || []).map(model => [model.id, model]));
    provider.models = catalogs.get(url).map(row => modelMeta(row, existing.get(row.id)));
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
  console.log(JSON.stringify({ providers: providers.map(([id, p]) => ({ id, modelCount: p.models.length })) }));
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
