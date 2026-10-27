// Local, synchronous reporting storage. No provider calls or credentials belong here.
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

const VERSION = 1;
const RENDERER = 'dotads-markdown-csv/1';
const DEFINITIONS = 'platform-base-metrics/1';
const RESOURCES = ['campaigns', 'adsets', 'ads', 'creatives'];
const LEVELS = ['account', 'campaign', 'adset', 'ad'];
const ID = /^act_\d+$/;
const DIGITS = /^\d+$/;
const SAFE = /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/;
const MEDIA = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.heic', '.bmp', '.tif', '.tiff', '.mp4', '.mov', '.webm', '.m4v', '.avi', '.mkv']);
const VIDEO = new Set(['.mp4', '.mov', '.webm', '.m4v', '.avi', '.mkv']);
const secretKey = /^(?:access[-_]?token|appsecret[-_]?proof|app[-_]?secret|client[-_]?secret|authorization|cookie|set-cookie|password|token|refresh[-_]?token|api[-_]?key|signature|sig)$/i;

function fail(message) { throw new Error(`dotads workspace: ${message}`); }
function object(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (object(value)) return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
function hash(value) { return createHash('sha256').update(value).digest('hex'); }
function json(value) { return `${JSON.stringify(value, null, 2)}\n`; }
function accountId(value) {
  const id = String(value ?? '');
  if (!ID.test(id)) fail('account ID must be a canonical act_<digits> string');
  return id;
}
function numericId(value, label) {
  if (typeof value !== 'string' || !DIGITS.test(value)) fail(`invalid ${label} ID`);
  return value;
}
function sameAccount(value, id) { return value === id || value === id.slice(4); }
function date(value, label) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value) fail(`invalid ${label} date`);
  return value;
}
function strings(value, label, allowed) {
  if (!Array.isArray(value) || value.some(item => typeof item !== 'string' || !item || (allowed && !allowed.includes(item))) || new Set(value).size !== value.length) fail(`invalid ${label}`);
  return [...value].sort();
}
function fieldMap(value, label) {
  if (!object(value)) fail(`invalid ${label}`);
  return Object.fromEntries(Object.entries(value).map(([name, fields]) => {
    if (!RESOURCES.includes(name)) fail(`invalid resource in ${label}`);
    return [name, strings(fields, `${label} ${name}`)];
  }));
}
function semantic(value) {
  if (Array.isArray(value)) {
    const result = value.map(semantic);
    return result.sort((a, b) => canonical(a).localeCompare(canonical(b)));
  }
  if (object(value)) return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, semantic(child)]));
  return value;
}
function sanitize(value, key = '') {
  if (secretKey.test(key)) return '[REDACTED]';
  if (Array.isArray(value)) return value.map(child => sanitize(child));
  if (object(value)) return Object.fromEntries(Object.entries(value).map(([name, child]) => [name, sanitize(child, name)]));
  if (typeof value !== 'string') return value;
  let result = value.replace(/\b(Bearer\s+)[^\s"'<>]+/gi, '$1[REDACTED]');
  // Provider error text sometimes embeds a URL rather than returning a URL field.
  result = result.replace(/\b[a-z][a-z0-9+.-]*:\/\/[^\s"'<>]+/gi, raw => {
    try {
      const url = new URL(raw);
      if (url.username || url.password) { url.username = 'REDACTED'; url.password = ''; }
      for (const name of [...url.searchParams.keys()]) if (secretKey.test(name) || /(?:token|secret|credential|password|signature)/i.test(name)) url.searchParams.set(name, '[REDACTED]');
      if (/(?:token|secret|password)=/i.test(url.hash)) url.hash = 'REDACTED';
      return url.href;
    } catch { return '[INVALID URL]'; }
  });
  return result.replace(/\b(access_token|appsecret_proof|client_secret|refresh_token|api_key|password)\s*[=:]\s*[^\s&,;"'<>]+/gi, '$1=[REDACTED]');
}

function noLinks(target, allowMissing = false) {
  const absolute = path.resolve(target);
  let current = path.parse(absolute).root;
  const parts = absolute.slice(current.length).split(path.sep).filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    let stat;
    try { stat = fs.lstatSync(current); } catch (error) {
      if (error.code === 'ENOENT' && allowMissing) return absolute;
      throw error;
    }
    if (stat.isSymbolicLink()) fail(`symlink is not allowed: ${current}`);
    if (i < parts.length - 1 && !stat.isDirectory()) fail(`not a directory: ${current}`);
  }
  return absolute;
}
function contained(base, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.includes('\\') || relative.split('/').some(part => !part || part === '.' || part === '..')) fail('invalid relative workspace path');
  const target = path.resolve(base, relative);
  if (!target.startsWith(`${path.resolve(base)}${path.sep}`)) fail('workspace path escapes its root');
  noLinks(target, true);
  return target;
}
function mkdir(target) {
  noLinks(target, true);
  fs.mkdirSync(target, { recursive: true, mode: 0o700 });
  const fd = fs.openSync(target, fs.constants.O_RDONLY | fs.constants.O_DIRECTORY | fs.constants.O_NOFOLLOW);
  try {
    const opened = fs.fstatSync(fd);
    if (!opened.isDirectory()) fail(`not a directory: ${target}`);
    fs.fchmodSync(fd, 0o700);
    noLinks(target);
    const saved = fs.lstatSync(target);
    if (saved.dev !== opened.dev || saved.ino !== opened.ino || (fs.fstatSync(fd).mode & 0o077) !== 0) fail(`private directory identity/permissions could not be verified: ${target}`);
    fs.fsyncSync(fd);
  } finally { fs.closeSync(fd); }
}
function readJson(target) {
  noLinks(target);
  if (!fs.lstatSync(target).isFile()) fail(`not a regular file: ${target}`);
  try { return JSON.parse(fs.readFileSync(target, 'utf8')); } catch { fail(`invalid JSON: ${target}`); }
}
function syncDir(target) {
  const fd = fs.openSync(target, fs.constants.O_RDONLY);
  try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
function writeNew(target, bytes) {
  noLinks(target, true);
  const fd = fs.openSync(target, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW, 0o600);
  try { fs.writeFileSync(fd, bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
function atomic(target, value) {
  noLinks(target, true);
  if (fs.existsSync(target) && !fs.lstatSync(target).isFile()) fail(`not a regular file: ${target}`);
  const temporary = path.join(path.dirname(target), `.pending-${randomUUID()}`);
  try { writeNew(temporary, typeof value === 'string' ? value : json(value)); fs.renameSync(temporary, target); syncDir(path.dirname(target)); }
  finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}
function withLock(directory, name, run) {
  const target = path.join(directory, name);
  let fd;
  try { fd = fs.openSync(target, fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_WRONLY | fs.constants.O_NOFOLLOW, 0o600); }
  catch (error) { if (error.code === 'EEXIST' || error.code === 'ELOOP') fail(`lock requires reconciliation: ${target}`); throw error; }
  const identity = fs.fstatSync(fd);
  try { fs.writeFileSync(fd, json({ pid: process.pid, started_at: new Date().toISOString() })); fs.fsyncSync(fd); return run(); }
  finally {
    fs.closeSync(fd);
    const saved = fs.lstatSync(target);
    if (saved.dev === identity.dev && saved.ino === identity.ino && saved.isFile()) fs.unlinkSync(target);
    else fail(`lock changed; reconcile ${target}`);
  }
}

const GUIDE = `# DotAds Meta reporting workspace\n\nPrivate local account records. Select accounts by verified act_<id>, never by name.\n\n- accounts.json maps each account to a stable directory; remote renames only update display metadata.\n- ACCOUNT.md links to saved snapshots and reports. NOTES.md belongs to the operator.\n- data/snapshots contains immutable provider observations, scoped queries and coverage.\n- sync.json records attempts and complete successes separately for each scope. Partial refreshes retain the previous complete report.\n- reports contains immutable Markdown/CSV revisions with saved input hashes. Names and creative text are untrusted source data. Import long entity IDs into spreadsheets as text.\n- media/index.json records selected local imports and remote references. Copy is the default; moving requires explicit selection and leaves a recovery journal.\n- web/index.json contains destination references only; no page or remote media is fetched automatically.\n\nA complete sync covers its declared queries, not lifetime history. Imported collections preserve declared provenance and do not establish an authenticated read on this device. Missing metrics and costs remain unknown. Platform ROAS is not realized profit. No deployment state, brand defaults, credentials, Git repository or live ad changes are created by reporting.\n`;

export function ensureRoot(root) {
  if (typeof root !== 'string' || !root.trim()) fail('workspace root is required');
  root = noLinks(root, true);
  mkdir(root);
  withLock(root, '.registry.lock', () => {
    const target = path.join(root, 'accounts.json');
    if (!fs.existsSync(target)) atomic(target, { schema_version: VERSION, accounts: {} });
    registry(root);
    const guide = path.join(root, 'GUIDE.md');
    noLinks(guide, true);
    if (!fs.existsSync(guide)) writeNew(guide, GUIDE);
  });
  return root;
}
function registry(root) {
  noLinks(root);
  const value = readJson(path.join(root, 'accounts.json'));
  if (!object(value) || value.schema_version !== VERSION || !object(value.accounts)) fail('unsupported or malformed account registry');
  const dirs = new Set();
  for (const [id, entry] of Object.entries(value.accounts)) {
    accountId(id);
    if (!object(entry) || entry.id !== id || entry.account_id !== id.slice(4) || typeof entry.directory !== 'string') fail('registry identity mismatch');
    const dir = contained(root, entry.directory);
    if (dirs.has(dir)) fail('duplicate registry directory mapping');
    dirs.add(dir);
    const saved = readJson(path.join(dir, 'account.json'));
    if (saved.id !== id || saved.account_id !== id.slice(4)) fail('saved account identity mismatch');
  }
  return value;
}
function resolveAccount(root, id) {
  root = noLinks(root);
  id = accountId(id);
  const entry = registry(root).accounts[id];
  if (!entry) fail(`account is not registered: ${id}`);
  return { root, entry, directory: contained(root, entry.directory) };
}
function allocate(root, account) {
  return withLock(root, '.registry.lock', () => {
    const saved = registry(root);
    let entry = saved.accounts[account.id];
    if (!entry) {
      const candidates = fs.readdirSync(root).filter(name => name === account.id || name.startsWith(`${account.id}--`));
      for (const name of candidates) noLinks(path.join(root, name));
      if (candidates.length) fail(`unregistered account directories require an explicitly selected existing directory: ${candidates.join(', ')}`);
      const slug = String(account.name || '').normalize('NFKD').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 60);
      const relative = `${account.id}${slug ? `--${slug}` : ''}`;
      const directory = contained(root, relative);
      if (fs.existsSync(directory)) fail(`unregistered existing directory requires explicit adoption: ${directory}`);
      mkdir(directory);
      writeNew(path.join(directory, 'account.json'), json(account));
      writeNew(path.join(directory, 'NOTES.md'), '# Operator notes\n\n');
      entry = { id: account.id, account_id: account.account_id, name: account.name ?? null, directory: relative };
      saved.accounts[account.id] = entry;
      atomic(path.join(root, 'accounts.json'), saved);
    }
    return { root, entry, directory: contained(root, entry.directory) };
  });
}
export function listLocalAccounts(root) {
  if (typeof root !== 'string' || !root.trim()) fail('workspace root is required');
  root = noLinks(root, true);
  if (!fs.existsSync(root)) return [];
  return Object.values(registry(root).accounts).sort((a, b) => a.id.localeCompare(b.id));
}

export function registerExisting(root, accountMetadata, selectedDirectory) {
  if (!object(accountMetadata)) fail('verified account metadata is required for existing registration');
  const id = accountId(accountMetadata.id);
  if (accountMetadata.account_id !== id.slice(4)) fail('existing registration account identity mismatch');
  if (typeof selectedDirectory !== 'string' || !selectedDirectory.trim()) fail('select an existing account directory explicitly');
  root = ensureRoot(root);
  const directory = noLinks(selectedDirectory), relative = path.relative(root, directory).split(path.sep).join('/');
  contained(root, relative);
  if (!fs.lstatSync(directory).isDirectory()) fail('selected existing account location must be a directory');
  const account = sanitize(structuredClone(accountMetadata));
  return withLock(root, '.registry.lock', () => {
    const saved = registry(root), current = saved.accounts[id];
    if (current && current.directory !== relative) fail('account already has a different registered directory; select its canonical workspace');
    if (Object.values(saved.accounts).some(entry => entry.directory === relative && entry.id !== id)) fail('selected existing directory belongs to another registered account');
    return withLock(directory, '.account.lock', () => {
      if (fs.existsSync(contained(directory, '.dotads-meta.lock'))) fail('selected project deployment lock requires reconciliation before registration');
      if (!current) for (const name of ['account.json', 'ACCOUNT.md', 'sync.json', 'registration.json', 'operational-references.json', 'adoption', 'data', 'reports', 'web', 'media/index.json']) {
        if (fs.existsSync(contained(directory, name))) fail(`unregistered generated reporting artifact requires reconciliation: ${name}`);
      }
      const inspected = inspectOperationalSource(directory, id);
      if (current) return { account_id: id, directory, workspace: directory, status: 'no_change', deployment_state: inspected.deployment_state };
      for (const file of inspected.files) {
        const now = inspectFile(contained(directory, file.path));
        if (now.sha256 !== file.sha256 || !sameIdentity(now.identity, file.identity)) fail('selected existing source changed during registration');
      }
      mkdir(directory);
      writeNew(path.join(directory, 'account.json'), json(account));
      writeNew(path.join(directory, 'registration.json'), json({ ...inspected, action: 'register_existing_directory', account_id: id, directory: relative, source_mutation: 'reporting_artifacts_only', deployment_ownership: 'same_original_directory', registered_at: new Date().toISOString() }));
      if (!fs.existsSync(contained(directory, 'NOTES.md'))) writeNew(path.join(directory, 'NOTES.md'), '# Operator notes\n\n');
      accountView(directory, account, { scopes: {} }); syncDir(directory);
      saved.accounts[id] = { id, account_id: account.account_id, name: account.name ?? null, directory: relative };
      atomic(path.join(root, 'accounts.json'), saved);
      return { account_id: id, directory, workspace: directory, status: 'registered', deployment_state: inspected.deployment_state, registration_path: path.join(directory, 'registration.json') };
    });
  });
}

function normalizeQuery(query, account) {
  const normalized = {
    definition_version: VERSION, account_id: account.id, timezone: account.timezone_name ?? null,
    since: query.since, until: query.until, level: query.level,
    fields: strings(query.fields, 'query fields'), breakdowns: strings(query.breakdowns ?? [], 'query breakdowns'),
    action_breakdowns: strings(query.action_breakdowns ?? [], 'action breakdowns'),
    time_increment: query.time_increment ?? 'all_days', attribution: semantic(query.attribution ?? {}),
    action_report_time: query.action_report_time ?? null, filters: semantic(query.filters ?? query.filtering ?? []),
    conversion_event_mapping: semantic(query.conversion_event_mapping ?? null),
    use_account_attribution_setting: query.use_account_attribution_setting ?? null,
    use_unified_attribution_setting: query.use_unified_attribution_setting ?? null,
  };
  return { normalized, query_id: `q_${hash(canonical(normalized))}` };
}
function validateCoverage(value, label) {
  if (!object(value) || !['complete', 'partial', 'unavailable', 'not_requested'].includes(value.status) || typeof value.pagination_exhausted !== 'boolean') fail(`invalid ${label} coverage`);
  if (value.status === 'complete' && !value.pagination_exhausted) fail(`${label} cannot be complete before pagination exhaustion`);
}
function entityFor(level, row, id) { return level === 'account' ? id : row[`${level}_id`]; }

export function validateCollection(input) {
  if (!object(input) || input.schema_version !== VERSION || !object(input.account) || !object(input.source) || !object(input.scope) || !object(input.resources) || !Array.isArray(input.insights)) fail('malformed collection envelope or unsupported schema');
  const account = input.account;
  const id = accountId(account.id);
  if (account.account_id !== id.slice(4)) fail('provider account identity mismatch');
  if (account.name != null && typeof account.name !== 'string') fail('invalid account name');
  if (account.currency != null && (typeof account.currency !== 'string' || !/^[A-Z]{3}$/.test(account.currency))) fail('invalid account currency');
  if (account.timezone_name != null) { try { new Intl.DateTimeFormat('en', { timeZone: account.timezone_name }); } catch { fail('invalid account timezone'); } }
  for (const key of ['kind', 'sdk_version', 'api_version']) if (typeof input.source[key] !== 'string' || !input.source[key]) fail(`missing source ${key}`);
  for (const key of ['started_at', 'finished_at']) if (typeof input.source[key] !== 'string' || !Number.isFinite(Date.parse(input.source[key]))) fail(`invalid source ${key}`);
  if (Date.parse(input.source.finished_at) < Date.parse(input.source.started_at)) fail('collection finished before it started');
  const scope = input.scope;
  date(scope.since, 'scope since'); date(scope.until, 'scope until');
  if (scope.since > scope.until) fail('scope date range is reversed');
  const levels = strings(scope.levels, 'scope levels', LEVELS);
  if (!levels.length) fail('scope requires at least one Insights level');
  strings(scope.breakdowns ?? [], 'scope breakdowns');
  if (!object(scope.attribution ?? {})) fail('invalid attribution scope');
  if (typeof scope.action_report_time !== 'string' || !scope.action_report_time) fail('missing action report time');
  const required = strings(scope.required_resources ?? RESOURCES, 'required resources', RESOURCES);
  strings(scope.optional_resources ?? [], 'optional resources', RESOURCES);
  const requestedFields = fieldMap(scope.inventory_fields ?? {}, 'inventory fields');
  const requiredFields = fieldMap(scope.required_inventory_fields ?? {}, 'required inventory fields');
  for (const [name, fields] of Object.entries(requiredFields)) if (fields.some(field => !requestedFields[name]?.includes(field))) fail('required inventory fields are outside requested inventory fields');
  const maps = {};
  for (const name of RESOURCES) {
    const resource = input.resources[name];
    validateCoverage(resource, name);
    if (!Array.isArray(resource.rows) || !Array.isArray(resource.errors)) fail(`invalid ${name} rows/errors`);
    if (resource.status === 'complete' && resource.errors.length) fail(`complete ${name} has collection errors`);
    if (required.includes(name) && resource.status === 'not_requested') fail(`required ${name} was not requested`);
    maps[name] = new Map();
    for (const row of resource.rows) {
      if (!object(row)) fail(`invalid ${name} row`);
      numericId(row.id, name);
      if (maps[name].has(row.id)) fail(`duplicate ${name} ID`);
      maps[name].set(row.id, row);
      if (!sameAccount(row.account_id, id)) fail(`${name} row has missing or cross-account identity`);
      for (const field of requiredFields[name] ?? []) if (resource.status === 'complete' && (!Object.hasOwn(row, field) || row[field] == null)) fail(`complete ${name} is missing required inventory field: ${field}`);
      for (const key of ['campaign_id', 'adset_id', 'creative_id']) if (row[key] != null) numericId(row[key], key);
      if (name === 'adsets' || name === 'ads') numericId(row.campaign_id, `${name} parent campaign`);
      if (name === 'ads') numericId(row.adset_id, 'ad parent adset');
    }
  }
  for (const ad of maps.ads.values()) {
    const parent = maps.adsets.get(ad.adset_id);
    if (parent && parent.campaign_id && ad.campaign_id && parent.campaign_id !== ad.campaign_id) fail('ad/adset campaign relationship mismatch');
    if (ad.creative && (!object(ad.creative) || (ad.creative.id != null && !DIGITS.test(ad.creative.id)))) fail('invalid ad creative relationship');
  }
  const queryIds = new Set();
  const seenLevels = new Set();
  for (const envelope of input.insights) {
    if (!object(envelope) || !object(envelope.query) || !Array.isArray(envelope.rows) || !Array.isArray(envelope.errors)) fail('invalid Insights envelope');
    if (envelope.required === false) fail('optional Insights queries must not bypass the declared required scope');
    const query = envelope.query;
    validateCoverage(envelope.coverage, 'Insights');
    if (envelope.coverage.status === 'complete' && envelope.errors.length) fail('complete Insights query has collection errors');
    if (!sameAccount(query.account_id, id)) fail('Insights query crosses accounts');
    if (query.since !== scope.since || query.until !== scope.until || !levels.includes(query.level) || canonical(strings(query.breakdowns ?? [], 'query breakdowns')) !== canonical(strings(scope.breakdowns ?? [], 'scope breakdowns')) || canonical(semantic(query.attribution ?? {})) !== canonical(semantic(scope.attribution ?? {})) || query.action_report_time !== scope.action_report_time) fail('Insights query does not match declared scope');
    if (query.timezone != null && query.timezone !== account.timezone_name) fail('Insights timezone does not match account');
    if (query.time_increment !== 'all_days' && !(Number.isInteger(query.time_increment) && query.time_increment > 0 && query.time_increment <= 90)) fail('unsupported Insights time increment');
    const normalized = normalizeQuery(query, account);
    if (query.query_id != null && query.query_id !== normalized.query_id) fail('query ID conflicts with normalized semantics');
    if (queryIds.has(normalized.query_id)) fail('duplicate Insights query');
    queryIds.add(normalized.query_id); seenLevels.add(query.level);
    const rowIds = new Set();
    for (const row of envelope.rows) {
      if (!object(row) || !sameAccount(row.account_id, id)) fail('invalid, missing-account or cross-account Insights row');
      const entity = entityFor(query.level, row, id);
      if (query.level !== 'account') numericId(entity, 'Insights entity');
      for (const key of ['campaign_id', 'adset_id', 'ad_id']) if (row[key] != null) numericId(row[key], key);
      const depth = LEVELS.indexOf(query.level);
      for (const [i, key] of ['campaign_id', 'adset_id', 'ad_id'].entries()) {
        if (i < depth) numericId(row[key], `Insights ${key}`);
        else if (row[key] != null) fail('Insights row carries IDs below requested query level');
      }
      const start = row.date_start ?? query.since, stop = row.date_stop ?? query.until;
      date(start, 'Insights row start'); date(stop, 'Insights row stop');
      if (start < query.since || stop > query.until || start > stop) fail('Insights row is outside query dates');
      for (const dimension of query.breakdowns ?? []) if (!Object.hasOwn(row, dimension)) fail(`missing returned breakdown: ${dimension}`);
      const rowKey = canonical([entity, start, stop, ...(query.breakdowns ?? []).slice().sort().map(key => [key, row[key]])]);
      if (rowIds.has(rowKey)) fail('duplicate Insights row grain');
      rowIds.add(rowKey);
      const ad = maps.ads.get(row.ad_id), adset = maps.adsets.get(row.adset_id);
      if (ad && ((row.adset_id && ad.adset_id && row.adset_id !== ad.adset_id) || (row.campaign_id && ad.campaign_id && row.campaign_id !== ad.campaign_id))) fail('Insights ad relationship mismatch');
      if (adset && row.campaign_id && adset.campaign_id && row.campaign_id !== adset.campaign_id) fail('Insights adset relationship mismatch');
    }
  }
  if (levels.some(level => !seenLevels.has(level))) fail('declared Insights level has no query envelope');
  return { valid: true, account_id: id, query_ids: [...queryIds].sort() };
}

function prepared(input) {
  validateCollection(input);
  const source = { ...input.source, ...(input.import_context != null ? { import_context: input.import_context } : {}) };
  const value = sanitize(structuredClone({ schema_version: input.schema_version, source, account: input.account, scope: input.scope, resources: input.resources, insights: input.insights }));
  value.insights = value.insights.map(envelope => ({ ...envelope, query: { ...envelope.query, query_id: normalizeQuery(envelope.query, value.account).query_id }, effective_settings: envelope.effective_settings ?? null }));
  const semantics = {
    schema_version: VERSION, collection_contract_version: value.scope.collection_contract_version ?? VERSION, account_id: value.account.id, timezone: value.account.timezone_name ?? null,
    query_ids: value.insights.map(item => item.query.query_id).sort(),
    required_resources: [...(value.scope.required_resources ?? RESOURCES)].sort(),
    optional_resources: [...(value.scope.optional_resources ?? [])].sort(),
    inventory_filters: semantic(value.scope.inventory_filters ?? {}),
    required_fields: semantic(value.scope.required_fields ?? {}),
    inventory_fields: fieldMap(value.scope.inventory_fields ?? {}, 'inventory fields'),
    required_inventory_fields: fieldMap(value.scope.required_inventory_fields ?? {}, 'required inventory fields'),
  };
  const required = semantics.required_resources.map(name => value.resources[name]);
  const queries = value.insights.map(item => item.coverage);
  const coverage = [...required, ...queries];
  const complete = coverage.every(item => item.status === 'complete' && item.pagination_exhausted);
  const useful = [...Object.values(value.resources), ...value.insights].some(item => item.rows.length || item.status === 'complete' || item.coverage?.status === 'complete');
  return { value, scope_key: `scope_${hash(canonical(semantics))}`, status: complete ? 'complete' : useful ? 'partial' : 'failed', semantics };
}
function requestScope(scope) {
  date(scope.since, 'request since'); date(scope.until, 'request until');
  if (scope.since > scope.until) fail('request date range is reversed');
  if (!object(scope.attribution ?? {}) || typeof scope.action_report_time !== 'string' || !scope.action_report_time) fail('invalid requested attribution or action report time');
  return { collection_contract_version: scope.collection_contract_version ?? VERSION, since: scope.since, until: scope.until, levels: strings(scope.levels, 'request levels', LEVELS), breakdowns: strings(scope.breakdowns ?? [], 'request breakdowns'), attribution: semantic(scope.attribution ?? {}), action_report_time: scope.action_report_time, inventory_filters: semantic(scope.inventory_filters ?? {}), required_resources: strings(scope.required_resources ?? RESOURCES, 'required resources', RESOURCES), required_fields: semantic(scope.required_fields ?? {}), inventory_fields: fieldMap(scope.inventory_fields ?? {}, 'inventory fields'), required_inventory_fields: fieldMap(scope.required_inventory_fields ?? {}, 'required inventory fields') };
}
function state(directory) {
  const target = path.join(directory, 'sync.json');
  noLinks(target, true);
  if (!fs.existsSync(target)) return { schema_version: VERSION, scopes: {}, last_scope_key: null };
  const value = readJson(target);
  if (value.schema_version !== VERSION || !object(value.scopes)) fail('malformed sync state');
  return value;
}
function emptyMedia() { return { schema_version: VERSION, assets: [], imports: [], remote_references: [] }; }
function index(directory, name) {
  const target = path.join(directory, name, 'index.json');
  noLinks(target, true);
  if (!fs.existsSync(target)) return name === 'media' ? emptyMedia() : { schema_version: VERSION, destinations: [] };
  const value = readJson(target);
  if (value.schema_version !== VERSION || (name === 'media' ? !Array.isArray(value.assets) || !Array.isArray(value.imports) || !Array.isArray(value.remote_references) : !Array.isArray(value.destinations))) fail(`invalid ${name} index`);
  if (name === 'media') {
    const account = readJson(path.join(directory, 'account.json'));
    const ids = new Set();
    for (const asset of value.assets) {
      if (!object(asset) || !/^[a-f0-9]{64}$/.test(asset.sha256) || ids.has(asset.sha256) || !/^media\/(images|videos)\/[^/]+$/.test(asset.path) || !MEDIA.has(path.extname(asset.path)) || path.basename(asset.path).slice(0, 64) !== asset.sha256 || !Number.isSafeInteger(asset.size) || asset.size < 0) fail('invalid or duplicate media asset');
      contained(directory, asset.path); ids.add(asset.sha256);
    }
    const operations = new Set();
    for (const operation of value.imports) {
      if (!object(operation) || !/^i_[a-f0-9]{64}$/.test(operation.operation_id) || operations.has(operation.operation_id) || operation.account_id !== account.id || !['copy', 'move'].includes(operation.mode) || typeof operation.source !== 'string' || path.resolve(operation.source) !== operation.source || !/^[a-f0-9]{64}$/.test(operation.sha256) || !object(operation.identity) || !['planned', 'source_claimed', 'destination_verified', 'indexed', 'source_cleanup_pending', 'complete', 'conflict'].includes(operation.state)) fail('invalid media import journal');
      if (operation.operation_id !== importId(operation.account_id, operation.source, operation.mode, operation)) fail('media import journal identity conflict');
      operations.add(operation.operation_id);
      if (!/^media\/(images|videos)\/[^/]+$/.test(operation.destination ?? '') || path.basename(operation.destination).slice(0, 64) !== operation.sha256) fail('invalid import destination');
      contained(directory, operation.destination);
      if (operation.mode === 'move' ? operation.claim !== path.join(path.dirname(operation.source), `.dotads-claim-${operation.operation_id}`, 'source') : operation.claim !== null) fail('invalid source claim path');
    }
  }
  return value;
}
function references(directory, value, snapshotId) {
  const media = index(directory, 'media'), web = index(directory, 'web');
  const creativeAds = new Map();
  for (const ad of value.resources.ads.rows) {
    const creative = ad.creative?.id ?? ad.creative_id;
    if (creative) creativeAds.set(creative, [...(creativeAds.get(creative) ?? []), ad.id]);
  }
  function walk(node, route, creativeId, adIds) {
    if (Array.isArray(node)) { node.forEach((child, i) => walk(child, `${route}.${i}`, creativeId, adIds)); return; }
    if (object(node)) { for (const [key, child] of Object.entries(node)) walk(child, `${route}.${key}`, creativeId, adIds); return; }
    if (typeof node !== 'string' || !node) return;
    const field = route.split('.').at(-1);
    const association = { snapshot_id: snapshotId, creative_id: creativeId, ad_ids: adIds, field: route };
    if (['image_hash', 'video_id', 'object_story_id', 'effective_object_story_id', 'source_instagram_media_id'].includes(field) || (field === 'hash' && /image/i.test(route))) {
      const record = { ...association, reference_type: field === 'hash' ? 'image_hash' : field, reference: node, availability: 'remote_reference', downloaded: false };
      if (!media.remote_references.some(item => canonical(item) === canonical(record))) media.remote_references.push(record);
      return;
    }
    if (['lead_gen_form_id', 'application_id', 'destination_type'].includes(field) || (field === 'app_link' && !/^https?:\/\//i.test(node))) {
      const record = { ...association, destination_type: field === 'app_link' ? 'deep_link' : field === 'destination_type' ? 'declared_type' : 'native', native_kind: field, native_reference: node, capture: null };
      if (!web.destinations.some(item => canonical(item) === canonical(record))) web.destinations.push(record);
      return;
    }
    if (!/^https?:\/\//i.test(node)) return;
    if (/(?:image|video|thumbnail|picture|source)/i.test(route) && /(?:url|source|picture)$/.test(field)) {
      const record = { ...association, url: node, availability: 'remote_reference', downloaded: false };
      if (!media.remote_references.some(item => canonical(item) === canonical(record))) media.remote_references.push(record);
    } else if (/^(?:link|url|link_url|website_url|object_url|destination_url|app_link)$/.test(field)) {
      const url = new URL(node); const normalized = new URL(node); normalized.hash = ''; normalized.searchParams.sort();
      const record = { ...association, original_tagged_url: node, page_identity: normalized.href, domain: url.hostname, destination_type: /(?:^|\.)(?:wa\.me|whatsapp\.com)$/i.test(url.hostname) ? 'messaging' : 'website', capture: null };
      if (!web.destinations.some(item => canonical(item) === canonical(record))) web.destinations.push(record);
    }
  }
  for (const creative of value.resources.creatives.rows) walk(creative, 'creative', creative.id, creativeAds.get(creative.id) ?? []);
  for (const ad of value.resources.ads.rows) walk(ad, 'ad', ad.creative?.id ?? ad.creative_id ?? null, [ad.id]);
  for (const adset of value.resources.adsets.rows) if (adset.destination_type) walk(adset.destination_type, 'adset.destination_type', null, value.resources.ads.rows.filter(ad => ad.adset_id === adset.id).map(ad => ad.id));
  mkdir(path.join(directory, 'media')); mkdir(path.join(directory, 'web'));
  atomic(path.join(directory, 'media/index.json'), media); atomic(path.join(directory, 'web/index.json'), web);
}
function accountView(directory, account, sync) {
  const lines = [`# ${md(account.name ?? account.id)}`, '', `Account: ${account.id} · Currency: ${md(account.currency ?? 'unknown')} · Timezone: ${md(account.timezone_name ?? 'unknown')}`, '', '[Operator notes](NOTES.md) · [Sync state](sync.json) · [Media index](media/index.json) · [Destination index](web/index.json)', '', 'Inventory is observed at collection time; it does not establish historical settings.', ''];
  for (const [key, scope] of Object.entries(sync.scopes)) {
    lines.push(`Scope \`${key}\``, '', `Latest attempt: ${scope.latest_attempt?.status ?? 'unknown'} (${scope.latest_attempt?.snapshot_id ?? 'none'}).`, `Last complete success: ${scope.last_complete_success?.snapshot_id ?? 'none'}.`, '');
    if (scope.current_report) lines.push(`[Current complete report](${scope.current_report.path}/REPORT.md)`, '');
  }
  if (sync.unmatched_latest_attempt) lines.push('A newer request failed with a different or unmatched scope. Default report selection is blocked; choose an explicit historical scope or complete the requested collection.', '');
  if (fs.existsSync(path.join(directory, 'operational-references.json'))) lines.push('[Selected operational project references](operational-references.json). Deployment state remains authoritative at its original project.', '');
  atomic(path.join(directory, 'ACCOUNT.md'), lines.join('\n'));
}
export function saveSnapshot(root, payload) {
  const { value, scope_key, status, semantics } = prepared(payload);
  root = ensureRoot(root);
  const { directory, entry } = allocate(root, value.account);
  const result = withLock(directory, '.account.lock', () => {
    const snapshotHash = hash(canonical(value));
    const snapshotId = `s_${value.source.finished_at.replace(/[^0-9]/g, '').slice(0, 17)}_${snapshotHash.slice(0, 20)}`;
    const parent = path.join(directory, 'data/snapshots'); mkdir(parent);
    const destination = contained(parent, snapshotId);
    if (!fs.existsSync(destination)) {
      const pending = path.join(parent, `.pending-${randomUUID()}`); mkdir(pending);
      const files = { 'account.json': value.account, ...Object.fromEntries(RESOURCES.map(name => [`${name}.json`, value.resources[name]])), 'insights.json': value.insights };
      const hashes = {};
      for (const [name, data] of Object.entries(files)) { const bytes = json(data); writeNew(path.join(pending, name), bytes); hashes[name] = hash(bytes); }
      writeNew(path.join(pending, 'manifest.json'), json({ schema_version: VERSION, snapshot_id: snapshotId, snapshot_hash: snapshotHash, account_id: value.account.id, scope_key, status, source: value.source, scope: value.scope, scope_semantics: semantics, files: hashes }));
      syncDir(pending); fs.renameSync(pending, destination); syncDir(parent);
    }
    readSnapshot(directory, snapshotId);
    // Publication precedes mutable indexes/pointers. Interrupted publication is safe to retry.
    references(directory, value, snapshotId);
    const sync = state(directory);
    const scopeState = sync.scopes[scope_key] ?? {};
    scopeState.request_scope = requestScope(value.scope);
    scopeState.request_key = `request_${hash(canonical(scopeState.request_scope))}`;
    scopeState.latest_attempt = { snapshot_id: snapshotId, snapshot_hash: snapshotHash, status, started_at: value.source.started_at, finished_at: value.source.finished_at, since: value.scope.since, until: value.scope.until };
    if (status === 'complete') scopeState.last_complete_success = { ...scopeState.latest_attempt };
    sync.scopes[scope_key] = scopeState; sync.last_scope_key = scope_key;
    delete sync.unmatched_latest_attempt;
    atomic(path.join(directory, 'account.json'), value.account);
    atomic(path.join(directory, 'sync.json'), sync);
    accountView(directory, value.account, sync);
    return { account_id: value.account.id, directory, workspace: directory, snapshot_id: snapshotId, snapshot_hash: snapshotHash, scope_key, status, snapshot_path: destination };
  });
  // Registry display metadata is updated without renaming the directory.
  withLock(root, '.registry.lock', () => { const saved = registry(root); saved.accounts[value.account.id] = { ...entry, name: value.account.name ?? null }; atomic(path.join(root, 'accounts.json'), saved); });
  return result;
}
export function recordFailure(root, id, scope, errorSummary) {
  const { directory } = resolveAccount(root, id);
  const requested = requestScope(scope);
  const key = `request_${hash(canonical(requested))}`;
  return withLock(directory, '.account.lock', () => {
    const sync = state(directory);
    const matching = Object.entries(sync.scopes).filter(([, item]) => item.request_key === key);
    const attempt = { status: 'failed', snapshot_id: null, requested_scope: requested, request_key: key, finished_at: new Date().toISOString(), error: sanitize(String(errorSummary)) };
    let scopeKey = null;
    if (matching.length === 1) {
      scopeKey = matching[0][0]; matching[0][1].latest_attempt = attempt;
      sync.last_scope_key = scopeKey; delete sync.unmatched_latest_attempt;
    } else {
      sync.unmatched_latest_attempt = attempt; sync.last_scope_key = null;
    }
    atomic(path.join(directory, 'sync.json'), sync);
    accountView(directory, readJson(path.join(directory, 'account.json')), sync);
    return { account_id: id, directory, status: 'failed', scope_key: scopeKey, request_key: key, matched_scope: matching.length === 1 };
  });
}
function readSnapshot(directory, id) {
  if (typeof id !== 'string' || !SAFE.test(id)) fail('invalid snapshot ID');
  const location = contained(directory, `data/snapshots/${id}`);
  const manifest = readJson(path.join(location, 'manifest.json'));
  if (manifest.schema_version !== VERSION || manifest.snapshot_id !== id || !object(manifest.files)) fail('invalid snapshot manifest');
  const identity = readJson(path.join(directory, 'account.json'));
  if (manifest.account_id !== identity.id) fail('snapshot account mismatch');
  const values = {};
  for (const name of ['account.json', ...RESOURCES.map(name => `${name}.json`), 'insights.json']) {
    const file = contained(location, name); noLinks(file);
    const bytes = fs.readFileSync(file);
    if (manifest.files[name] !== hash(bytes)) fail(`snapshot file hash mismatch: ${name}`);
    values[name] = readJson(file);
  }
  const value = { schema_version: VERSION, source: manifest.source, account: values['account.json'], scope: manifest.scope, resources: Object.fromEntries(RESOURCES.map(name => [name, values[`${name}.json`]])), insights: values['insights.json'] };
  // Unknown top-level provider metadata is intentionally not part of the public schema.
  if (hash(canonical(value)) !== manifest.snapshot_hash) fail('snapshot content hash mismatch');
  const checked = prepared(value);
  if (checked.scope_key !== manifest.scope_key || checked.status !== manifest.status) fail('snapshot scope or coverage mismatch');
  return { manifest, value, location };
}

function md(value) { return String(value).replace(/[\r\n]+/g, ' ').replace(/[\\`*_{}\[\]<>|]/g, character => `\\${character}`); }
function number(value) {
  if (value === '' || value == null || (typeof value !== 'string' && typeof value !== 'number')) return null;
  const parsed = Number(value); return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}
function outbound(row) {
  if (Array.isArray(row.outbound_clicks)) {
    const selected = row.outbound_clicks.filter(item => item.action_type === 'outbound_click');
    return selected.length === 1 ? number(selected[0].value) : null;
  }
  return number(row.outbound_clicks);
}
function ratio(numerator, denominator, scale = 1) { return numerator == null || denominator == null || denominator === 0 ? null : numerator / denominator * scale; }
function measured(row) {
  const spend = number(row.spend), impressions = number(row.impressions), clicks = outbound(row);
  return { spend, impressions, outbound_clicks: clicks, outbound_ctr_fraction: ratio(clicks, impressions), outbound_cpc: ratio(spend, clicks), cpm: ratio(spend, impressions, 1000), reach: number(row.reach), frequency: number(row.frequency) };
}
function queryTotals(envelope, account) {
  const query = envelope.query, buckets = new Map();
  for (const row of envelope.rows) {
    const key = canonical([entityFor(query.level, row, account.id), ...(query.breakdowns ?? []).slice().sort().map(name => [name, row[name]])]);
    const start = row.date_start ?? query.since, stop = row.date_stop ?? query.until;
    if ((buckets.get(key) ?? []).some(([a, b]) => start <= b && stop >= a)) return { available: false, reason: 'Overlapping date buckets; totals withheld.' };
    buckets.set(key, [...(buckets.get(key) ?? []), [start, stop]]);
  }
  if (envelope.coverage.status !== 'complete') return { available: false, reason: 'Query coverage is incomplete; totals withheld.' };
  const metrics = envelope.rows.map(measured);
  const sum = name => !metrics.length || metrics.some(row => row[name] == null) ? null : metrics.reduce((total, row) => total + row[name], 0);
  const spend = sum('spend'), impressions = sum('impressions'), clicks = sum('outbound_clicks');
  return { available: true, spend, impressions, outbound_clicks: clicks, outbound_ctr_fraction: ratio(clicks, impressions), outbound_cpc: ratio(spend, clicks), cpm: ratio(spend, impressions, 1000), reach: null, frequency: null };
}
function tableRows(value) {
  const records = [], inventory = { campaign: value.resources.campaigns.rows, adset: value.resources.adsets.rows, ad: value.resources.ads.rows };
  for (const envelope of value.insights) {
    const query = envelope.query, rows = inventory[query.level] ?? [], map = new Map(rows.map(row => [row.id, row])), seen = new Set();
    for (const row of envelope.rows) {
      const entity = entityFor(query.level, row, value.account.id), current = map.get(entity); seen.add(entity);
      records.push({ query_id: query.query_id, level: query.level, entity_id: entity, name: current?.name ?? row[`${query.level}_name`] ?? '', campaign_id: row.campaign_id ?? current?.campaign_id ?? '', adset_id: row.adset_id ?? current?.adset_id ?? '', inventory_resolution: query.level === 'account' || current ? 'resolved' : 'unresolved_historical', insights_status: 'measured_row', date_start: row.date_start ?? query.since, date_stop: row.date_stop ?? query.until, breakdowns_json: json(Object.fromEntries((query.breakdowns ?? []).map(key => [key, row[key]]))).trim(), ...measured(row), platform_row_json: json(row).trim(), inventory_json: current ? json(current).trim() : '' });
    }
    for (const current of rows) if (!seen.has(current.id)) records.push({ query_id: query.query_id, level: query.level, entity_id: current.id, name: current.name ?? '', campaign_id: current.campaign_id ?? '', adset_id: current.adset_id ?? '', inventory_resolution: 'resolved', insights_status: 'no_insights_row', date_start: query.since, date_stop: query.until, inventory_json: json(current).trim() });
  }
  for (const [level, rows] of Object.entries(inventory)) if (!value.insights.some(item => item.query.level === level)) for (const row of rows) records.push({ query_id: '', level, entity_id: row.id, name: row.name ?? '', campaign_id: row.campaign_id ?? '', adset_id: row.adset_id ?? '', inventory_resolution: 'resolved', insights_status: 'inventory_only', inventory_json: json(row).trim() });
  return records;
}
const COLUMNS = ['query_id', 'level', 'entity_id', 'name', 'campaign_id', 'adset_id', 'inventory_resolution', 'insights_status', 'date_start', 'date_stop', 'breakdowns_json', 'spend', 'impressions', 'outbound_clicks', 'outbound_ctr_fraction', 'outbound_cpc', 'cpm', 'reach', 'frequency', 'platform_row_json', 'inventory_json'];
function csv(rows) {
  const cell = value => {
    let text = value == null ? '' : String(value);
    if (typeof value === 'string' && /^[\s\u0000-\u001f\u007f]*[=+@-]/u.test(value)) text = `'${text}`;
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return `${[COLUMNS.join(','), ...rows.map(row => COLUMNS.map(name => cell(row[name])).join(','))].join('\n')}\n`;
}
function show(value) { return value == null ? 'unavailable' : String(value); }
export function renderReport(root, id, { snapshotId, scopeKey } = {}) {
  const { directory } = resolveAccount(root, id);
  return withLock(directory, '.account.lock', () => {
    const sync = state(directory);
    const selectedScope = scopeKey ?? (snapshotId ? readSnapshot(directory, snapshotId).manifest.scope_key : sync.last_scope_key);
    if (typeof selectedScope !== 'string' || !/^scope_[a-f0-9]{64}$/.test(selectedScope)) fail('no valid collection scope selected');
    const scopeState = sync.scopes[selectedScope];
    if (!scopeState) fail('selected scope has no saved collection');
    const selected = snapshotId ?? scopeState.last_complete_success?.snapshot_id;
    if (!selected) fail(`no complete success for selected scope; select a partial snapshot ID explicitly (${scopeState.latest_attempt?.snapshot_id ?? 'none'})`);
    const { manifest, value } = readSnapshot(directory, selected);
    if (manifest.scope_key !== selectedScope) fail('selected snapshot belongs to a different scope');
    const media = index(directory, 'media'), web = index(directory, 'web');
    for (const asset of media.assets) verifyAsset(directory, asset.path, asset.sha256);
    const mediaBytes = json(media), webBytes = json(web);
    const inputs = { snapshot_id: selected, snapshot_hash: manifest.snapshot_hash, scope_key: selectedScope, query_ids: value.insights.map(item => item.query.query_id), renderer_version: RENDERER, metric_definition_version: DEFINITIONS, media_index_hash: hash(mediaBytes), web_index_hash: hash(webBytes), economics: null, import_context: value.source.import_context ?? null, selection: { latest_attempt: scopeState.latest_attempt, last_complete_success: scopeState.last_complete_success ?? null, unmatched_latest_attempt: sync.unmatched_latest_attempt ?? null, explicit_snapshot: Boolean(snapshotId) } };
    const revision = `r_${hash(canonical(inputs))}`;
    const relative = `reports/${value.scope.since}_${value.scope.until}_${selectedScope}/${revision}`;
    const target = contained(directory, relative);
    const rows = tableRows(value);
    const lines = [`# ${md(value.account.name ?? id)} — Meta account report`, '', `Account: ${id}. Period: ${value.scope.since} through ${value.scope.until}. Timezone: ${md(value.account.timezone_name ?? 'unknown')}. Currency: ${md(value.account.currency ?? 'unknown')}.`, '', `Snapshot: [${selected}](../../../data/snapshots/${selected}/manifest.json). Status: **${manifest.status}**.`, `Source: ${md(value.source.kind)}; SDK ${md(value.source.sdk_version)}; requested API ${md(value.source.api_version)}; observed effective API ${md(value.source.effective_api_version ?? 'unknown')}.`, `Capture interval: ${md(value.source.started_at)} – ${md(value.source.finished_at)}. Remote data can change during collection.`, '', `Latest attempt for this exact scope: **${scopeState.latest_attempt.status}**, ${scopeState.latest_attempt.snapshot_id} (${scopeState.latest_attempt.finished_at}).`, ...(scopeState.latest_attempt.snapshot_id !== selected ? ['', '**Historical/stale selection:** this report retains its saved period and inputs; the latest attempt did not replace this snapshot.'] : []), '', '## Coverage and inventory', '', ...RESOURCES.map(name => `- ${name}: ${value.resources[name].rows.length} records, ${value.resources[name].status}, pagination exhausted: ${value.resources[name].pagination_exhausted}.`), '', 'Current inventory settings and names are observations at collection time. Historical rows with missing inventory remain in the exports. Inventory without an Insights row has unknown metrics; it is not measured zero.', '', '[Campaigns](campaigns.csv) · [Ad sets](adsets.csv) · [Ads](ads.csv) · [All query rows](insights.csv)', '', '## Separate measurement views', ''];
    if (value.source.import_context != null) lines.splice(8, 0, '', '**Imported collection; no authenticated provider read observed on this device.** The declared provider kind and versions describe the supplied data.', `Import context: ${md(canonical(value.source.import_context))}.`, '');
    if (sync.unmatched_latest_attempt) lines.push(`A newer failed request has a different or unmatched scope: ${md(canonical(sync.unmatched_latest_attempt.requested_scope))}. This explicitly selected report retains its actual saved dates.`, '');
    for (const name of RESOURCES) if (value.resources[name].errors.length) lines.push(`${name} collection errors: ${md(canonical(value.resources[name].errors))}`, '');
    for (const envelope of value.insights) {
      const query = envelope.query, totals = queryTotals(envelope, value.account);
      lines.push(`### ${query.level} · ${query.query_id}`, '', `Rows: ${envelope.rows.length}; coverage: ${envelope.coverage.status}; time increment: ${md(query.time_increment)}; breakdowns: ${md((query.breakdowns ?? []).join(', ') || 'none')}.`, `Attribution requested: ${md(canonical(query.attribution ?? {}))}. Action report time: ${md(query.action_report_time)}. Effective response settings: ${envelope.effective_settings == null ? 'unknown' : md(canonical(envelope.effective_settings))}.`, '', totals.available ? `Spend: ${show(totals.spend)}; impressions: ${show(totals.impressions)}; outbound clicks: ${show(totals.outbound_clicks)}; outbound CTR fraction: ${show(totals.outbound_ctr_fraction)}; outbound CPC: ${show(totals.outbound_cpc)}; CPM: ${show(totals.cpm)}.` : totals.reason, '');
      if (envelope.errors.length) lines.push(`Collection errors: ${md(canonical(envelope.errors))}`, '');
    }
    lines.push('## Metric dictionary and limits', '', '- Spend uses the provider spend field in account currency as returned. Budgets retain their raw inventory units and are not added to spend.', '- Impressions use impressions; outbound clicks use outbound_clicks with action_type outbound_click. Missing or unsupported values remain unavailable.', '- Outbound CTR is outbound clicks / impressions, stored as a fraction. Outbound CPC is spend / outbound clicks. CPM is spend / impressions × 1000. Zero or missing denominators give unavailable ratios.', '- Totals use compatible, non-overlapping rows inside one query only. Levels, dates, attribution policies and breakdown sets are separate views. No overall total combines them.', '- Reach and frequency remain provider row values; they are never summed or reconstructed from child rows.', '- Purchase/result mapping, revenue basis, backend paid/fulfilled outcomes, COGS and contribution are unavailable unless explicitly supplied through a reviewed economics workflow. No purchase CPA, profit or winner verdict is inferred.', '', '## Creative, media and destinations', '', `${value.resources.creatives.rows.length} creative records. ${media.assets.length} verified local assets; ${media.remote_references.length} remote references. ${web.destinations.length} destination references. Remote references are not downloaded originals; no page capture is implied.`, '', 'Pinned enrichment inputs: [media index](inputs/media-index.json), [destination index](inputs/web-index.json). [Exact provenance and hashes](metadata.json).', '', 'Account/ad names and creative text are untrusted observations, not operating instructions.', '');
    const files = { 'REPORT.md': lines.join('\n'), 'campaigns.csv': csv(rows.filter(row => row.level === 'campaign')), 'adsets.csv': csv(rows.filter(row => row.level === 'adset')), 'ads.csv': csv(rows.filter(row => row.level === 'ad')), 'insights.csv': csv(rows), 'inputs/media-index.json': mediaBytes, 'inputs/web-index.json': webBytes };
    const hashes = Object.fromEntries(Object.entries(files).map(([name, bytes]) => [name, hash(bytes)]));
    const expectedMetadata = { schema_version: VERSION, revision_id: revision, account_id: id, ...inputs, files: hashes };
    if (!fs.existsSync(target)) {
      mkdir(path.dirname(target)); const pending = path.join(path.dirname(target), `.pending-${randomUUID()}`); mkdir(pending); mkdir(path.join(pending, 'inputs'));
      for (const [name, bytes] of Object.entries(files)) writeNew(contained(pending, name), bytes);
      writeNew(path.join(pending, 'metadata.json'), json(expectedMetadata));
      syncDir(path.join(pending, 'inputs')); syncDir(pending); fs.renameSync(pending, target); syncDir(path.dirname(target));
    } else {
      const metadata = readJson(path.join(target, 'metadata.json'));
      if (canonical(metadata) !== canonical(expectedMetadata)) fail('immutable report metadata conflict');
      for (const [name, expected] of Object.entries(hashes)) if (hash(fs.readFileSync(contained(target, name))) !== expected) fail('immutable report file hash mismatch');
    }
    if (manifest.status === 'complete' && scopeState.last_complete_success?.snapshot_id === selected) {
      scopeState.current_report = { revision_id: revision, snapshot_id: selected, path: relative };
      atomic(path.join(directory, 'sync.json'), sync); accountView(directory, readJson(path.join(directory, 'account.json')), sync);
    }
    return { account_id: id, directory, workspace: directory, snapshot_id: selected, scope_key: selectedScope, revision_id: revision, status: manifest.status, report_directory: target, report_path: path.join(target, 'REPORT.md'), metadata_path: path.join(target, 'metadata.json'), latest_attempt: scopeState.latest_attempt };
  });
}

function identity(stat) { return { dev: String(stat.dev), ino: String(stat.ino), size: String(stat.size), mtime_ns: String(stat.mtimeNs) }; }
function sameIdentity(a, b) { return canonical(a) === canonical(b); }
function inspectFile(target) {
  noLinks(target);
  const fd = fs.openSync(target, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try {
    const before = fs.fstatSync(fd, { bigint: true });
    if (!before.isFile()) fail('media source must be a regular file');
    const digest = createHash('sha256'), buffer = Buffer.alloc(1024 * 1024);
    let count;
    while ((count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) digest.update(buffer.subarray(0, count));
    const after = fs.fstatSync(fd, { bigint: true });
    if (!sameIdentity(identity(before), identity(after)) || !sameIdentity(identity(after), identity(fs.lstatSync(target, { bigint: true })))) fail('media source changed while reading; preserve source');
    return { identity: identity(after), sha256: digest.digest('hex'), size: Number(after.size), nlink: Number(after.nlink) };
  } finally { fs.closeSync(fd); }
}
function verifyAsset(directory, relative, expected) {
  const file = contained(directory, relative), inspected = inspectFile(file);
  if (inspected.sha256 !== expected) fail('managed media hash mismatch');
  return inspected;
}
function saveIndex(directory, value) { atomic(path.join(directory, 'media/index.json'), value); }
function publishMedia(directory, source, relative, expected, expectedIdentity) {
  const destination = contained(directory, relative); mkdir(path.dirname(destination));
  if (fs.existsSync(destination)) { verifyAsset(directory, relative, expected); return; }
  const temporary = path.join(path.dirname(destination), `.pending-${randomUUID()}`);
  try {
    const before = inspectFile(source);
    if (before.sha256 !== expected || !sameIdentity(before.identity, expectedIdentity)) fail('selected source changed before copying');
    fs.copyFileSync(source, temporary, fs.constants.COPYFILE_EXCL); fs.chmodSync(temporary, 0o600);
    const fd = fs.openSync(temporary, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
    try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
    const copied = inspectFile(temporary), after = inspectFile(source);
    if (copied.sha256 !== expected || after.sha256 !== expected || !sameIdentity(after.identity, expectedIdentity)) fail('media source changed during copy; preserve source');
    try { fs.linkSync(temporary, destination); }
    catch (error) { if (error.code !== 'EEXIST') throw error; verifyAsset(directory, relative, expected); }
    syncDir(path.dirname(destination)); verifyAsset(directory, relative, expected);
  } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
}
function resultFor(directory, operation, extra = {}) {
  return { account_id: operation.account_id, directory, workspace: directory, operation_id: operation.operation_id, mode: operation.mode, status: operation.state, sha256: operation.sha256, destination: operation.destination, destination_path: contained(directory, operation.destination), source: operation.source, claim: operation.claim ?? null, ...extra };
}
function importId(id, source, mode, selected) { return `i_${hash(canonical({ account_id: id, source, mode, identity: selected.identity, sha256: selected.sha256, size: selected.size }))}`; }
export function importMedia(root, id, source, { move = false } = {}) {
  if (typeof move !== 'boolean') fail('move must be a boolean');
  if (typeof source !== 'string' || !source.trim()) fail('media source is required');
  const { directory } = resolveAccount(root, id);
  source = path.resolve(source);
  return withLock(directory, '.account.lock', () => {
    mkdir(path.join(directory, 'media'));
    const saved = index(directory, 'media');
    const pending = saved.imports.find(item => item.source === source && item.mode === (move ? 'move' : 'copy') && item.state !== 'complete');
    let operation = pending;
    if (!operation && !fs.existsSync(source)) {
      const completed = saved.imports.findLast(item => item.source === source && item.mode === (move ? 'move' : 'copy') && item.state === 'complete');
      if (completed && move) { verifyAsset(directory, completed.destination, completed.sha256); return resultFor(directory, completed, { already_imported: true }); }
      fail('selected media source is missing');
    }
    if (!operation) {
      const inspected = inspectFile(source);
      for (const asset of saved.assets) {
        const existing = verifyAsset(directory, asset.path, asset.sha256);
        if (sameIdentity(existing.identity, inspected.identity) || path.resolve(contained(directory, asset.path)) === source) return { account_id: id, directory, workspace: directory, status: 'complete', already_imported: true, destination: asset.path, destination_path: contained(directory, asset.path), sha256: asset.sha256, source_retained: true };
      }
      if (source === path.resolve(root) || source.startsWith(`${path.resolve(root)}${path.sep}`)) fail('managed workspace files cannot be imported as ordinary sources');
      const extension = path.extname(source).toLowerCase();
      if (!MEDIA.has(extension)) fail('select a supported image or video file, not metadata or a journal');
      const operationId = importId(id, source, move ? 'move' : 'copy', inspected);
      const previous = saved.imports.find(item => item.operation_id === operationId);
      if (previous) { verifyAsset(directory, previous.destination, previous.sha256); return resultFor(directory, previous, { already_imported: true, source_retained: true }); }
      const existing = saved.assets.find(item => item.sha256 === inspected.sha256);
      const destination = existing?.path ?? `media/${VIDEO.has(extension) ? 'videos' : 'images'}/${inspected.sha256}${extension}`;
      operation = { operation_id: operationId, account_id: id, mode: move ? 'move' : 'copy', source, original_name: path.basename(source), identity: inspected.identity, sha256: inspected.sha256, size: inspected.size, destination, imported_at: new Date().toISOString(), source_type: 'selected_local_file', relationships: [], state: 'planned', claim: move ? path.join(path.dirname(source), `.dotads-claim-${operationId}`, 'source') : null };
      saved.imports.push(operation); saveIndex(directory, saved);
    }
    let selectedSource = operation.mode === 'move' ? operation.claim : operation.source;
    if (operation.mode === 'move' && !fs.existsSync(operation.claim)) {
      if (['indexed', 'source_cleanup_pending', 'complete'].includes(operation.state)) {
        verifyAsset(directory, operation.destination, operation.sha256);
        operation.state = 'complete'; saveIndex(directory, saved);
        return resultFor(directory, operation, { already_imported: true, source_retained: fs.existsSync(operation.source) });
      }
      const current = inspectFile(operation.source);
      if (!sameIdentity(current.identity, operation.identity) || current.sha256 !== operation.sha256) fail('source identity changed before claim; no cleanup performed');
      const claimDir = path.dirname(operation.claim); noLinks(claimDir, true);
      // An exclusively created private same-filesystem directory makes the rename
      // target absent without relying on rename's platform-specific overwrite rules.
      try { fs.mkdirSync(claimDir, { mode: 0o700 }); }
      catch (error) { if (error.code === 'EEXIST') fail('existing source claim directory requires reconciliation'); throw error; }
      fs.renameSync(operation.source, operation.claim); syncDir(path.dirname(operation.source)); syncDir(claimDir);
      const claimed = inspectFile(operation.claim);
      if (!sameIdentity(claimed.identity, operation.identity) || claimed.sha256 !== operation.sha256) {
        operation.state = 'conflict'; operation.reason = 'Claim identity mismatch; source bytes retained.'; saveIndex(directory, saved);
        try {
          fs.linkSync(operation.claim, operation.source); // Atomic no-clobber restoration.
          syncDir(path.dirname(operation.source)); fs.unlinkSync(operation.claim); syncDir(claimDir);
        } catch (error) { if (error.code !== 'EEXIST') throw error; }
        fail(`source claim mismatch; reconcile ${operation.source} and ${operation.claim}`);
      }
      operation.state = 'source_claimed'; saveIndex(directory, saved);
    }
    const selected = inspectFile(selectedSource);
    if (!sameIdentity(selected.identity, operation.identity) || selected.sha256 !== operation.sha256) fail(`claimed/source file changed; preserve ${selectedSource}`);
    publishMedia(directory, selectedSource, operation.destination, operation.sha256, operation.identity);
    operation.state = 'destination_verified'; saveIndex(directory, saved);
    if (!saved.assets.some(item => item.sha256 === operation.sha256)) saved.assets.push({ sha256: operation.sha256, size: operation.size, path: operation.destination, media_type: operation.destination.includes('/videos/') ? 'video' : 'image', first_imported_at: operation.imported_at });
    operation.state = 'indexed'; saveIndex(directory, saved);
    verifyAsset(directory, operation.destination, operation.sha256);
    // Reread the durable index before deleting a selected source claim.
    const persisted = index(directory, 'media').imports.find(item => item.operation_id === operation.operation_id);
    if (!persisted || persisted.sha256 !== operation.sha256 || persisted.state !== 'indexed' || persisted.destination !== operation.destination) fail('media index verification failed; preserve source');
    if (operation.mode === 'move') {
      operation.state = 'source_cleanup_pending'; saveIndex(directory, saved);
      const current = inspectFile(operation.claim);
      if (!sameIdentity(current.identity, operation.identity) || current.sha256 !== operation.sha256 || current.nlink !== 1) return resultFor(directory, operation, { source_retained: true, reason: 'Claim identity/content or hardlink stability is uncertain; reconcile before cleanup.' });
      try { fs.unlinkSync(operation.claim); syncDir(path.dirname(operation.claim)); fs.rmdirSync(path.dirname(operation.claim)); syncDir(path.dirname(operation.source)); }
      catch (error) { return resultFor(directory, operation, { source_retained: fs.existsSync(operation.claim), reason: `Source cleanup unfinished: ${error.code ?? 'filesystem error'}` }); }
    }
    operation.state = 'complete'; saveIndex(directory, saved);
    return resultFor(directory, operation, { source_retained: operation.mode === 'copy' || fs.existsSync(operation.source) });
  });
}

function inspectOperationalSource(source, id) {
const brandPath = contained(source, 'brand.json'), brand = readJson(brandPath);
if (!object(brand) || brand.ad_account_id !== id) fail('selected project brand account is missing or mismatched');
function checkOwners(node, label) {
  if (Array.isArray(node)) { node.forEach(child => checkOwners(child, label)); return; }
  if (!object(node)) return;
  for (const [key, value] of Object.entries(node)) {
    if (['ad_account_id', 'account_id', 'adAccountId', 'accountId'].includes(key) && !sameAccount(value, id)) fail(`conflicting account ownership in ${label}`);
    if (['identity', '_meta'].includes(key) && object(value) && typeof value.id === 'string' && value.id.startsWith('act_') && value.id !== id) fail(`conflicting identity ownership in ${label}`);
    if (!secretKey.test(key)) checkOwners(value, label);
  }
}
checkOwners(brand, 'brand.json');
const statePath = contained(source, '.meta-state.json'); let deployment = 'absent';
if (fs.existsSync(statePath)) {
  const saved = readJson(statePath), groups = ['media_cache', 'campaigns', 'creatives', 'adsets', 'ads'];
  if (!object(saved) || saved.version !== 1 || groups.some(name => !object(saved[name]))) fail('unsupported or malformed selected deployment state');
  checkOwners(saved, 'deployment state (including identity/_meta)');
  const populated = groups.some(name => Object.keys(saved[name]).length);
  if (populated && saved.ad_account_id !== id) fail('populated deployment state has no verified top-level account binding');
  for (const name of groups) for (const record of Object.values(saved[name])) if (!object(record) || (name !== 'media_cache' && (typeof record.id !== 'string' || !record.id))) fail('malformed selected deployment record');
  deployment = populated ? 'account_bound' : 'empty';
}
const files = [], skipped = [];
function inventory(relative) {
  const target = contained(source, relative); noLinks(target);
  const stat = fs.lstatSync(target);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(target).sort()) {
      const child = `${relative}/${name}`;
      if (name.startsWith('.') || /(?:^|[._-])(?:secrets?|credentials?|tokens?|passwords?)(?:[._-]|$)/i.test(name)) { skipped.push(child); continue; }
      inventory(child);
    }
  } else {
    if (!stat.isFile()) fail('non-regular selected adoption input');
    if (files.length >= 10000) fail('selected project exceeds the 10000-file adoption bound');
    const inspected = inspectFile(target);
    if (/^(?:campaigns|memory)\//.test(relative) && path.extname(relative).toLowerCase() === '.json') {
      const records = readJson(target);
      if (!object(records) && !Array.isArray(records)) fail(`unresolved structured adoption input: ${relative}`);
      checkOwners(records, relative);
      const after = inspectFile(target);
      if (after.sha256 !== inspected.sha256 || !sameIdentity(after.identity, inspected.identity)) fail('structured source changed during adoption; generate a revised plan');
    }
    files.push({ path: relative, sha256: inspected.sha256, size: inspected.size, identity: inspected.identity });
  }
}
for (const relative of ['brand.json', '.meta-state.json', 'NOTES.md', 'campaigns', 'media', 'memory']) if (fs.existsSync(contained(source, relative))) inventory(relative);
files.sort((a, b) => a.path.localeCompare(b.path));
return { schema_version: VERSION, account_id: id, source, source_identity: { dev: String(fs.statSync(source).dev), ino: String(fs.statSync(source).ino) }, deployment_state: deployment, files, skipped, action: 'reference_only', source_mutation: false, deployment_ownership: 'original_project', media_transfer: false };
}

// Bounded onboarding: only a selected operational project's reference is adopted.
// Deployment state and all source files remain in place; this is not a migration.
export function planAdoption(root, id, source, { apply = false } = {}) {
  if (typeof apply !== 'boolean' || typeof source !== 'string' || !source.trim()) fail('adoption requires a selected project and boolean apply mode');
  const { directory } = resolveAccount(root, id);
  source = noLinks(source);
  if (!fs.lstatSync(source).isDirectory()) fail('selected adoption source must be a directory');
  if (source === directory) return { account_id: id, directory, source, status: 'no_change', reason: 'Reporting workspace is already registered.' };
  if (source === path.resolve(root) || source.startsWith(`${path.resolve(root)}${path.sep}`)) fail('another managed reporting location cannot be adopted as an operational project');
  return withLock(directory, '.account.lock', () => {
    const bound = inspectOperationalSource(source, id);
    const { files, deployment_state: deployment } = bound;
    const planId = `adoption_${hash(canonical(bound))}`;
    const location = contained(directory, `adoption/${planId}`), planPath = path.join(location, 'plan.json'), resultPath = path.join(location, 'result.json');
    const plan = { ...bound, plan_id: planId };
    if (!fs.existsSync(planPath)) {
      if (apply) fail('source changed or reviewed adoption plan is missing; create a revised plan before apply');
      mkdir(location); atomic(planPath, plan);
    } else if (canonical(readJson(planPath)) !== canonical(plan)) fail('adoption plan hash/identity conflict');
    const referencePath = path.join(directory, 'operational-references.json');
    let references = fs.existsSync(referencePath) ? readJson(referencePath) : { schema_version: VERSION, references: [] };
    if (references.schema_version !== VERSION || !Array.isArray(references.references) || references.references.some(item => item.account_id !== id || typeof item.source !== 'string')) fail('malformed operational references');
    const existing = references.references.find(item => item.source === source);
    const complete = existing?.plan_id === planId && fs.existsSync(resultPath);
    if (complete) {
      const result = readJson(resultPath);
      if (result.plan_id !== planId || result.account_id !== id || result.source !== source || result.action !== 'reference_only') fail('adoption result identity conflict');
      return { ...result, directory, status: 'no_change', plan_path: planPath, result_path: resultPath };
    }
    if (!apply) return { account_id: id, directory, source, plan_id: planId, status: 'planned', plan_path: planPath, files: files.length, deployment_state: deployment, action: 'reference_only' };
    // Detect a changed source between inventory and publication without reading hidden inputs.
    for (const file of files) { const current = inspectFile(contained(source, file.path)); if (current.sha256 !== file.sha256 || !sameIdentity(current.identity, file.identity)) fail('source changed during adoption; generate a revised plan'); }
    const reference = { account_id: id, source, plan_id: planId, plan_path: `adoption/${planId}/plan.json`, deployment_state: deployment, action: 'reference_only', deployment_ownership: 'original_project' };
    references.references = [...references.references.filter(item => item.source !== source), reference];
    atomic(referencePath, references);
    const result = { ...reference, status: 'complete', completed_at: new Date().toISOString(), source_mutation: false, media_transfer: false };
    atomic(resultPath, result); accountView(directory, readJson(path.join(directory, 'account.json')), state(directory));
    return { ...result, directory, plan_path: planPath, result_path: resultPath };
  });
}
