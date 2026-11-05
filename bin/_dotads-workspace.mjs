// Local, synchronous reporting storage. No provider calls or credentials belong here.
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const VERSION = 1;
const RENDERER = 'dotads-markdown-csv/2';
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
      const candidates = fs.readdirSync(root).filter(name => name === account.id || name.startsWith(`${account.id}--`) || name.endsWith(` (${account.id})`));
      for (const name of candidates) noLinks(path.join(root, name));
      if (candidates.length) fail(`unregistered account directories require an explicitly selected existing directory: ${candidates.join(', ')}`);
      const slug = String(account.name || '').normalize('NFKD').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 60);
      const display = String(account.name || 'Ad Account').normalize('NFKC')
        .replace(/[<>:"/\\|?*\x00-\x1f\x7f]/g, '-').replace(/^[. ]+|[. ]+$/g, '').slice(0, 100) || 'Ad Account';
      const relative = fs.existsSync(path.join(root, 'bm.json')) ? `${display} (${account.id})` : `${account.id}${slug ? `--${slug}` : ''}`;
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
export function prepareAccount(root, id, name) {
  id = accountId(id);
  root = ensureRoot(root);
  const existing = registry(root).accounts[id];
  if (existing) return resolveAccount(root, id).directory;
  if (typeof name !== 'string' || !name.trim()) fail('a new account workspace requires an explicit account name');
  const account = { id, account_id: id.slice(4), name: name.trim(), identity_source: 'LOCAL_INPUT_UNVERIFIED' };
  const result = allocate(root, account);
  accountView(result.directory, account, { scopes: {} });
  return result.directory;
}

export function ensureBMAssets(root) {
  noLinks(root);
  const bm = readJson(path.join(root, 'bm.json'));
  if (bm.schema_version !== VERSION || !DIGITS.test(bm.id)) fail('shared assets require a BM workspace');
  for (const relative of ['assets', 'assets/images', 'assets/videos', 'assets/temporary', 'assets/temporary/images', 'assets/temporary/videos']) mkdir(contained(root, relative));
  const guide = contained(root, 'assets/ASSETS.md');
  if (!fs.existsSync(guide)) writeNew(guide, '# Shared BM assets\n\nImages and videos are content-addressed copies, reusable by all accounts in this BM. Importing does not upload to Meta or prove a creative association.\n\n`temporary/` is opt-in scratch storage. Nothing is automatically deleted. Preserve campaign source files; do not point durable manifests at temporary copies. Move operations into temporary storage are prohibited.\n');
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
  // Source-level provenance is loader-owned on imports; legacy top-level metadata cannot override it.
  const source = { ...(input.import_context != null ? { import_context: input.import_context } : {}), ...input.source };
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
  const isMedia = ['media', 'assets', 'assets/temporary'].includes(name);
  if (!fs.existsSync(target)) return isMedia ? emptyMedia() : { schema_version: VERSION, destinations: [] };
  const value = readJson(target);
  if (value.schema_version !== VERSION || (isMedia ? !Array.isArray(value.assets) || !Array.isArray(value.imports) || !Array.isArray(value.remote_references) : !Array.isArray(value.destinations))) fail(`invalid ${name} index`);
  if (isMedia) {
    const owners = name === 'media' ? [readJson(path.join(directory, 'account.json')).id] : Object.keys(registry(directory).accounts);
    const validPath = value => typeof value === 'string' && value.startsWith(`${name}/`) && /^(images|videos)\/[^/]+$/.test(value.slice(name.length + 1));
    const ids = new Set();
    for (const asset of value.assets) {
      if (!object(asset) || !/^[a-f0-9]{64}$/.test(asset.sha256) || ids.has(asset.sha256) || !validPath(asset.path) || !MEDIA.has(path.extname(asset.path)) || path.basename(asset.path).slice(0, 64) !== asset.sha256 || !Number.isSafeInteger(asset.size) || asset.size < 0) fail('invalid or duplicate media asset');
      contained(directory, asset.path); ids.add(asset.sha256);
    }
    const operations = new Set();
    for (const operation of value.imports) {
      if (!object(operation) || !/^i_[a-f0-9]{64}$/.test(operation.operation_id) || operations.has(operation.operation_id) || !owners.includes(operation.account_id) || !['copy', 'move'].includes(operation.mode) || typeof operation.source !== 'string' || path.resolve(operation.source) !== operation.source || !/^[a-f0-9]{64}$/.test(operation.sha256) || !object(operation.identity) || !['planned', 'source_claimed', 'destination_verified', 'indexed', 'source_cleanup_pending', 'complete', 'conflict'].includes(operation.state)) fail('invalid media import journal');
      if (operation.operation_id !== importId(operation.account_id, operation.source, operation.mode, operation)) fail('media import journal identity conflict');
      operations.add(operation.operation_id);
      if (!validPath(operation.destination) || path.basename(operation.destination).slice(0, 64) !== operation.sha256) fail('invalid import destination');
      contained(directory, operation.destination);
      if (operation.mode === 'move' ? operation.claim !== path.join(path.dirname(operation.source), `.dotads-claim-${operation.operation_id}`, 'source') : operation.claim !== null) fail('invalid source claim path');
    }
  }
  return value;
}
function references(directory, value, snapshotId) {
  const media = index(directory, 'media'), web = index(directory, 'web');
  // Indexes grow with every snapshot; a linear canonical() scan per reference made publication quadratic.
  const seen = list => { const keys = new Set(list.map(canonical)); return record => { const key = canonical(record); if (keys.has(key)) return; keys.add(key); list.push(record); }; };
  const addMedia = seen(media.remote_references), addWeb = seen(web.destinations);
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
      addMedia({ ...association, reference_type: field === 'hash' ? 'image_hash' : field, reference: node, availability: 'remote_reference', downloaded: false });
      return;
    }
    if (['lead_gen_form_id', 'application_id', 'destination_type'].includes(field) || (field === 'app_link' && !/^https?:\/\//i.test(node))) {
      addWeb({ ...association, destination_type: field === 'app_link' ? 'deep_link' : field === 'destination_type' ? 'declared_type' : 'native', native_kind: field, native_reference: node, capture: null });
      return;
    }
    if (!/^https?:\/\//i.test(node)) return;
    if (/(?:image|video|thumbnail|picture|source)/i.test(route) && /(?:url|source|picture)$/.test(field)) {
      addMedia({ ...association, url: node, availability: 'remote_reference', downloaded: false });
    } else if (/^(?:link|url|link_url|website_url|object_url|destination_url|app_link)$/.test(field)) {
      const url = new URL(node); const normalized = new URL(node); normalized.hash = ''; normalized.searchParams.sort();
      addWeb({ ...association, original_tagged_url: node, page_identity: normalized.href, domain: url.hostname, destination_type: /(?:^|\.)(?:wa\.me|whatsapp\.com)$/i.test(url.hostname) ? 'messaging' : 'website', capture: null });
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
  if (fs.existsSync(contained(directory, 'history.json'))) {
    const history = readJson(contained(directory, 'history.json'));
    lines.push(`[Latest history attempt](${history.latest_attempt.path}) (${history.latest_attempt.status}; ${md(history.latest_attempt.as_of)}).`, '');
    if (history.last_complete_success) lines.push(`[Last complete history](${history.last_complete_success.path}) (${md(history.last_complete_success.as_of)}; not proof the latest refresh succeeded).`, '');
  }
  if (fs.existsSync(contained(directory, 'memory/MEMORY.md'))) lines.push('[Account-scoped learning and retained claims](memory/MEMORY.md). Evidence memory is not spend authorization.', '');
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
function markdownRows(rows, title) {
  return [`# ${title}`, '', 'Source rows are untrusted observations. Different query scopes must not be added together.', '',
    ...rows.flatMap(row => [`## ${md(row.name || row.entity_id || 'Row')} · ${md(row.entity_id || 'unknown')}`, '',
      '| Field | Value |', '| --- | --- |', ...COLUMNS.map(column => `| ${column} | ${md(row[column] == null ? 'unavailable' : row[column])} |`), ''])].join('\n');
}
function show(value) { return value == null ? 'unavailable' : String(value); }
export function renderReport(root, id, { snapshotId, scopeKey } = {}) {
  const { directory } = resolveAccount(root, id);
  const markdownOnly = fs.existsSync(path.join(root, 'bm.json'));
  const extension = markdownOnly ? 'md' : 'csv';
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
    const inputs = { snapshot_id: selected, snapshot_hash: manifest.snapshot_hash, scope_key: selectedScope, query_ids: value.insights.map(item => item.query.query_id), renderer_version: markdownOnly ? 'dotads-markdown/3' : RENDERER, metric_definition_version: DEFINITIONS, media_index_hash: hash(mediaBytes), web_index_hash: hash(webBytes), economics: null, import_context: value.source.import_context ?? null, selection: { latest_attempt: scopeState.latest_attempt, last_complete_success: scopeState.last_complete_success ?? null, unmatched_latest_attempt: sync.unmatched_latest_attempt ?? null, explicit_snapshot: Boolean(snapshotId) } };
    const revision = `r_${hash(canonical(inputs))}`;
    const relative = `reports/${value.scope.since}_${value.scope.until}_${selectedScope}/${revision}`;
    const target = contained(directory, relative);
    const rows = tableRows(value);
    const lines = [`# ${md(value.account.name ?? id)} — Meta account report`, '', `Account: ${id}. Period: ${value.scope.since} through ${value.scope.until}. Timezone: ${md(value.account.timezone_name ?? 'unknown')}. Currency: ${md(value.account.currency ?? 'unknown')}.`, '', `Snapshot: [${selected}](../../../data/snapshots/${selected}/manifest.json). Status: **${manifest.status}**.`, `Source: ${md(value.source.kind)}; SDK ${md(value.source.sdk_version)}; requested API ${md(value.source.api_version)}; observed effective API ${md(value.source.effective_api_version ?? 'unknown')}.`, `Capture interval: ${md(value.source.started_at)} – ${md(value.source.finished_at)}. Remote data can change during collection.`, '', `Latest attempt for this exact scope: **${scopeState.latest_attempt.status}**, ${scopeState.latest_attempt.snapshot_id} (${scopeState.latest_attempt.finished_at}).`, ...(scopeState.latest_attempt.snapshot_id !== selected ? ['', '**Historical/stale selection:** this report retains its saved period and inputs; the latest attempt did not replace this snapshot.'] : []), '', '## Coverage and inventory', '', ...RESOURCES.map(name => `- ${name}: ${value.resources[name].rows.length} records, ${value.resources[name].status}, pagination exhausted: ${value.resources[name].pagination_exhausted}.`), '', 'Current inventory settings and names are observations at collection time. Historical rows with missing inventory remain in the exports. Inventory without an Insights row has unknown metrics; it is not measured zero.', '', `[Campaigns](campaigns.${extension}) · [Ad sets](adsets.${extension}) · [Ads](ads.${extension}) · [All query rows](insights.${extension})`, '', '## Separate measurement views', ''];
    if (value.source.import_context != null) lines.splice(8, 0, '', '**Imported collection; no authenticated provider read observed on this device.** The declared provider kind and versions describe the supplied data.', `Import context: ${md(canonical(value.source.import_context))}.`, '');
    if (sync.unmatched_latest_attempt) lines.push(`A newer failed request has a different or unmatched scope: ${md(canonical(sync.unmatched_latest_attempt.requested_scope))}. This explicitly selected report retains its actual saved dates.`, '');
    for (const name of RESOURCES) if (value.resources[name].errors.length) lines.push(`${name} collection errors: ${md(canonical(value.resources[name].errors))}`, '');
    for (const envelope of value.insights) {
      const query = envelope.query, totals = queryTotals(envelope, value.account);
      lines.push(`### ${query.level} · ${query.query_id}`, '', `Rows: ${envelope.rows.length}; coverage: ${envelope.coverage.status}; time increment: ${md(query.time_increment)}; breakdowns: ${md((query.breakdowns ?? []).join(', ') || 'none')}.`, `Attribution requested: ${md(canonical(query.attribution ?? {}))}. Action report time: ${md(query.action_report_time)}. Effective response settings: ${envelope.effective_settings == null ? 'unknown' : md(canonical(envelope.effective_settings))}.`, '', totals.available ? `Spend: ${show(totals.spend)}; impressions: ${show(totals.impressions)}; outbound clicks: ${show(totals.outbound_clicks)}; outbound CTR fraction: ${show(totals.outbound_ctr_fraction)}; outbound CPC: ${show(totals.outbound_cpc)}; CPM: ${show(totals.cpm)}.` : totals.reason, '');
      if (envelope.errors.length) lines.push(`Collection errors: ${md(canonical(envelope.errors))}`, '');
    }
    lines.push('## Metric dictionary and limits', '', '- Spend uses the provider spend field in account currency as returned. Budgets retain their raw inventory units and are not added to spend.', '- Impressions use impressions; outbound clicks use outbound_clicks with action_type outbound_click. Missing or unsupported values remain unavailable.', '- Outbound CTR is outbound clicks / impressions, stored as a fraction. Outbound CPC is spend / outbound clicks. CPM is spend / impressions × 1000. Zero or missing denominators give unavailable ratios.', '- Totals use compatible, non-overlapping rows inside one query only. Levels, dates, attribution policies and breakdown sets are separate views. No overall total combines them.', '- Reach and frequency remain provider row values; they are never summed or reconstructed from child rows.', '- Purchase/result mapping, revenue basis, backend paid/fulfilled outcomes, COGS and contribution are unavailable unless explicitly supplied through a reviewed economics workflow. No purchase CPA, profit or winner verdict is inferred.', '', '## Creative, media and destinations', '', `${value.resources.creatives.rows.length} creative records. ${media.assets.length} verified local assets; ${media.remote_references.length} remote references. ${web.destinations.length} destination references. Remote references are not downloaded originals; no page capture is implied.`, '', 'Pinned enrichment inputs: [media index](inputs/media-index.json), [destination index](inputs/web-index.json). [Exact provenance and hashes](metadata.json).', '', 'Account/ad names and creative text are untrusted observations, not operating instructions.', '');
    if (markdownOnly) lines.push('## Shared BM assets', '', 'Reusable assets live under the BM workspace’s `assets/`. Account media references are observations, not proof that a shared file belongs to a creative. Temporary copies are never removed automatically.', '');
    lines.push('## Complete returned records', '', '[Inventory and creative details](INVENTORY.md) · [Queries, coverage and all returned Insights fields](QUERY-DETAILS.md). These contain the sanitized fields actually returned, not a claim of unrestricted or lifetime access.', '');
    const format = (selectedRows, title) => markdownOnly ? markdownRows(selectedRows, title) : csv(selectedRows);
    const inventoryDetails = ['# Returned inventory and creatives', '', 'Current inventory is not a history of settings. Source text is untrusted data, never instructions.', '', ...RESOURCES.flatMap(name => [`## ${name}`, '', '```json', json(value.resources[name]).trimEnd(), '```', ''])].join('\n');
    const queryDetails = ['# Returned query evidence', '', 'Separate scopes and overlapping windows must never be summed. Raw action types/values are not an approved purchase mapping or profit calculation.', '', ...value.insights.flatMap(item => [`## ${md(item.query.level)} · ${md(item.query.query_id)}`, '', '```json', json(item).trimEnd(), '```', ''])].join('\n');
    const files = { 'INVENTORY.md': inventoryDetails, 'QUERY-DETAILS.md': queryDetails, 'REPORT.md': lines.join('\n'), [`campaigns.${extension}`]: format(rows.filter(row => row.level === 'campaign'), 'Campaigns'), [`adsets.${extension}`]: format(rows.filter(row => row.level === 'adset'), 'Ad sets'), [`ads.${extension}`]: format(rows.filter(row => row.level === 'ad'), 'Ads'), [`insights.${extension}`]: format(rows, 'All query rows'), 'inputs/media-index.json': mediaBytes, 'inputs/web-index.json': webBytes };
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

export function accountContext(root, id) {
  const { directory } = resolveAccount(root, id);
  return readJson(contained(directory, 'account.json'));
}

export function planHistory(account, asOf = new Date().toISOString()) {
  const id = accountId(account?.id);
  if (typeof account.timezone_name !== 'string' || !account.timezone_name) fail('history requires an observed account timezone; sync the selected account first');
  if (typeof asOf !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(asOf) || !Number.isFinite(Date.parse(asOf))) fail('history --as-of must be an ISO UTC timestamp');
  if (new Date(asOf).toISOString().slice(0, 19) !== asOf.slice(0, 19)) fail('history --as-of has an invalid calendar date');
  const parts = new Intl.DateTimeFormat('en', { timeZone: account.timezone_name, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(asOf));
  const part = name => parts.find(item => item.type === name).value;
  const today = `${part('year')}-${part('month')}-${part('day')}`;
  // Calendar dates, not elapsed local hours: DST cannot move the boundaries.
  const offset = days => { const value = new Date(`${today}T00:00:00Z`); value.setUTCDate(value.getUTCDate() - days); return value.toISOString().slice(0, 10); };
  return { schema_version: VERSION, account_id: id, timezone: account.timezone_name, currency: account.currency ?? null, as_of: new Date(asOf).toISOString(), today,
    periods: [{ key: 'yesterday', since: offset(1), until: offset(1), includes_incomplete_today: false },
      ...[7, 30, 90].map(days => ({ key: `last_${days}d`, since: offset(days), until: offset(1), includes_incomplete_today: false })),
      { key: 'this_month', since: `${today.slice(0, 7)}-01`, until: today, includes_incomplete_today: true }] };
}

export function validateHistoryCollection(payload, plan, period) {
  validateCollection(payload);
  if (payload.account.id !== plan.account_id || payload.account.timezone_name !== plan.timezone || (payload.account.currency ?? null) !== plan.currency ||
      payload.scope.since !== period.since || payload.scope.until !== period.until || canonical([...payload.scope.levels].sort()) !== canonical([...LEVELS].sort()) ||
      (payload.scope.breakdowns ?? []).length || Object.keys(payload.scope.attribution ?? {}).length || payload.scope.action_report_time !== 'conversion' ||
      payload.insights.length !== LEVELS.length || payload.insights.some(item => item.query.time_increment !== 'all_days' ||
        ['filters', 'filtering', 'action_breakdowns'].some(key => item.query[key] != null && (!Array.isArray(item.query[key]) || item.query[key].length)) ||
        item.rows.some(row => (row.date_start ?? period.since) !== period.since || (row.date_stop ?? period.until) !== period.until)) ||
      RESOURCES.some(name => !(payload.scope.required_resources ?? RESOURCES).includes(name))) fail('history collection identity, timezone, currency or whole-period measurement scope mismatch');
}

export function publishHistory(root, id, plan, attempts) {
  const { directory } = resolveAccount(root, id), account = accountContext(root, id);
  if (plan.account_id !== id || canonical(plan) !== canonical(planHistory(account, plan.as_of)) || !Array.isArray(attempts) || attempts.length !== plan.periods.length || new Set(attempts.map(item => item.period)).size !== plan.periods.length) fail('history plan or period coverage mismatch');
  const periods = plan.periods.map(period => {
    const attempt = attempts.find(item => item.period === period.key);
    if (!attempt) fail('history period has no attempt');
    if (!attempt.snapshot_id) return { ...period, status: 'failed', reason: 'Collection failed; no snapshot published. This is not empty history or measured zero.' };
    const { manifest, value } = readSnapshot(directory, attempt.snapshot_id);
    validateHistoryCollection(value, plan, period);
    const report = renderReport(root, id, { snapshotId: attempt.snapshot_id });
    const query = value.insights.find(item => item.query.level === 'account'), totals = queryTotals(query, value.account);
    if (query.coverage.status === 'complete' && query.rows.length === 1) Object.assign(totals, { reach: measured(query.rows[0]).reach, frequency: measured(query.rows[0]).frequency });
    return { ...period, status: manifest.status, snapshot_id: manifest.snapshot_id, snapshot_hash: manifest.snapshot_hash, scope_key: manifest.scope_key,
      report: path.relative(directory, report.report_path).split(path.sep).join('/'), source: manifest.source,
      inventory: Object.fromEntries(RESOURCES.map(name => [name, { status: value.resources[name].status, observed_rows: value.resources[name].rows.length }])),
      insights: value.insights.map(item => ({ level: item.query.level, query_id: item.query.query_id, coverage: item.coverage, observed_rows: item.rows.length, requested_attribution: item.query.attribution ?? {}, requested_action_report_time: item.query.action_report_time, effective_settings: item.effective_settings ?? null })), account_metrics: totals };
  });
  const status = periods.every(item => item.status === 'complete') ? 'complete' : 'partial';
  const observed = periods.some(item => item.insights?.some(query => query.observed_rows > 0));
  const summary = { schema_version: VERSION, renderer: 'dotads-history/2', plan, status,
    analysis_eligibility: status !== 'complete' ? 'INCOMPLETE_EVIDENCE' : observed ? 'OBSERVATIONAL_REVIEW_ONLY' : 'NO_OBSERVED_HISTORY', periods };
  const revision = `h_${hash(canonical(summary)).slice(0, 32)}`, relative = `reports/history/${revision}`, target = contained(directory, relative);
  const lines = ['# Account history evidence', '', `Account: ${id} · Timezone: ${md(plan.timezone)} · Currency: ${md(plan.currency ?? 'unknown')}`,
    `Planning reference: ${md(plan.as_of)} · Collection coverage: **${status}** · Analysis: **${summary.analysis_eligibility}**`, '',
    'Each window is an independent whole-period query. Windows overlap: never sum them, and never sum daily reach or average frequency. This month includes incomplete today. Reporting delays and later attribution restatements can change all windows.', '',
    '| Period | Since | Until | Coverage | Account spend | Account impressions | Evidence |', '| --- | --- | --- | --- | --- | --- | --- |'];
  for (const item of periods) lines.push(`| ${item.key}${item.includes_incomplete_today ? ' (incomplete today)' : ''} | ${item.since} | ${item.until} | ${item.status} | ${item.account_metrics?.spend ?? 'unknown'} | ${item.account_metrics?.impressions ?? 'unknown'} | ${item.report ? `[Snapshot report](../../../${item.report})` : 'No snapshot'} |`);
  lines.push('', '## Evidence and limitations', '',
    'See [observations.json](observations.json) for snapshot hashes, query IDs, requested versus unknown/observed effective settings, per-resource coverage, row counts, versions and collection times. Snapshot reports retain available creatives, destinations, targeting, objectives, budgets and raw action/value observations.', '',
    'An exhausted, successful query with no rows is not a permission error, missing metric, or measured zero. Empty accessible inventory/history does not prove the account is new or recover lifetime history. Inventory describes collection time, not historical settings. Imported observations do not prove authenticated access. Missing metrics remain unknown.', '',
    'Requested attribution and action-report time are not proof of effective server behavior. Platform purchase/value/ROAS observations are not realized profit: merchant outcome, refund/COD, fee and margin joins are required. No winner, causal explanation or budget change is inferred here.', '',
    '## Review and experiment workflow', '',
    'Observation: cite an exact snapshot/query/entity and metric, including absent or partial evidence. Hypothesis: state a falsifiable explanation, alternatives and confidence; it is not a finding. Experiment: define one change, a control, primary metric/event mapping, decision threshold, duration, minimum sample and rollback. Decision: record observed outcomes and confounders after the test, separately from the hypothesis.', '',
    'History also appends scoped observations to account-local memory/ads-memory.json and memory/MEMORY.md. It never promotes hypotheses, experiments or outcomes automatically. Use learn record for evidence-pinned lifecycle records; NOTES.md remains operator-owned. No campaigns, existing claims or spend are changed, and no model is retrained. No optimization decision is justified by absent or incomplete history.', '');
  const files = { 'HISTORY.md': lines.join('\n'), 'observations.json': json(summary) };
  return withLock(directory, '.account.lock', () => {
    if (!fs.existsSync(target)) {
      mkdir(path.dirname(target)); const pending = path.join(path.dirname(target), `.pending-${randomUUID()}`); mkdir(pending);
      for (const [name, bytes] of Object.entries(files)) writeNew(contained(pending, name), bytes);
      syncDir(pending); fs.renameSync(pending, target); syncDir(path.dirname(target));
    } else for (const [name, bytes] of Object.entries(files)) if (hash(fs.readFileSync(contained(target, name))) !== hash(bytes)) fail('immutable history file hash mismatch');
    const pointer = contained(directory, 'history.json'), saved = fs.existsSync(pointer) ? readJson(pointer) : { schema_version: VERSION, account_id: id };
    if (saved.schema_version !== VERSION || saved.account_id !== id) fail('history index identity mismatch');
    const result = { revision_id: revision, status, analysis_eligibility: summary.analysis_eligibility, path: `${relative}/HISTORY.md`, as_of: plan.as_of };
    saved.latest_attempt = result;
    if (status === 'complete') saved.last_complete_success = result;
    atomic(pointer, saved);
    const learning = historyLearning(root, id, directory, summary);
    accountView(directory, account, state(directory));
    return { account_id: id, ...result, report_path: path.join(target, 'HISTORY.md'), observations_path: path.join(target, 'observations.json'), learning };
  });
}

// One account-local memory owner; older brand records remain intact and unscoped.
function learningScope(root, id) {
  const account = accountContext(root, id);
  if (!account.timezone_name) fail('learning requires a saved account timezone');
  const bmFile = contained(root, 'bm.json'), hasBM = fs.existsSync(bmFile), bm = hasBM ? readJson(bmFile) : null;
  if (hasBM && (!object(bm) || bm.schema_version !== VERSION || typeof bm.id !== 'string' || !DIGITS.test(bm.id))) fail('invalid learning BM identity');
  return { ad_account_id: id, bm_id: bm?.id ?? null, currency: account.currency ?? null, timezone: account.timezone_name };
}
function scopedEntry(entry, scope) {
  return entry?.learning_version === 1 && object(entry.scope) && Object.entries(scope).every(([key, value]) => entry.scope[key] === value);
}
function accountMemory(directory, scope) {
  const file = contained(directory, 'memory/ads-memory.json');
  const value = fs.existsSync(file) ? readJson(file) : { version: 1, brand: scope.ad_account_id, unit_economics: null, entries: [] };
  if (value.version !== 1 || !Array.isArray(value.entries) || (value.learning_scope && canonical(value.learning_scope) !== canonical(scope))) fail('learning memory identity or schema conflict');
  return value;
}
export function learningMarkdown(memory) {
  const lines = ['# Account learning memory', '', `Scope: ${md(canonical(memory.learning_scope))}`, '',
    'Private observational evidence and user-recorded claims, not model training, verified causality, independent replication, spend authorization or realized profit. Overlapping windows are not independent samples. Imported evidence does not prove authenticated access on this device.', '',
    '## Unit economics', '', 'Existing assumptions are retained, not verified by history or imported learning.', '', '```json', json(memory.unit_economics ?? null).trimEnd(), '```', ''];
  for (const entry of memory.entries) {
    lines.push(`## ${md(entry.title ?? entry.id ?? 'Legacy claim')}`, '',
      `Stage: ${md(entry.stage ?? 'legacy/unscoped')} · Source: ${md(entry.source ?? 'unknown')} · ID: ${md(entry.id ?? 'unknown')}`, '',
      md(entry.summary ?? ''), '', '```json', json(entry).trimEnd(), '```', '');
  }
  for (const receipt of Object.values(memory.learning_imports ?? {})) lines.push(`[Imported evidence — unverified origin](${receipt.path.replace(/\.json$/, '.md')})`, '');
  return lines.join('\n');
}
function saveAccountMemory(directory, scope, memory) {
  mkdir(contained(directory, 'memory'));
  memory.learning_scope = scope; memory.updated_at = new Date().toISOString();
  atomic(contained(directory, 'memory/ads-memory.json'), memory);
  atomic(contained(directory, 'memory/MEMORY.md'), learningMarkdown(memory));
}
function historyLearning(root, id, directory, summary) {
  const scope = learningScope(root, id), memory = accountMemory(directory, scope);
  let added = 0;
  for (const period of summary.periods.filter(item => item.snapshot_id)) {
    const eligibility = period.status !== 'complete' ? 'INCOMPLETE_EVIDENCE' : period.insights.some(query => query.observed_rows > 0) ? 'OBSERVATIONAL_REVIEW_ONLY' : 'NO_OBSERVED_HISTORY';
    const entry = { learning_version: 1, source: 'data', category: 'history', verdict: 'insight', stage: 'observation',
      title: `${period.key}: ${period.since} through ${period.until}`, summary: `${period.status} collection; ${eligibility}. Current inventory and whole-period Insights are separate observations.`,
      scope: { ...scope, since: period.since, until: period.until },
      evidence: period.insights.map(query => ({ snapshot_id: period.snapshot_id, snapshot_hash: period.snapshot_hash, query_id: query.query_id, entity_id: null })),
      metrics: period.account_metrics, history_context: { period: period.key, period_status: period.status, analysis_eligibility: eligibility, includes_incomplete_today: period.includes_incomplete_today },
      confidence: 'UNASSESSED', replication_status: 'NOT_ESTABLISHED' };
    entry.id = `learning_${hash(canonical(entry))}`;
    if (!memory.entries.some(item => item.id === entry.id)) { memory.entries.push({ ...entry, created_at: period.source.finished_at }); added++; }
  }
  // Regenerate the derived Markdown on retry after a partial filesystem failure.
  saveAccountMemory(directory, scope, memory);
  return { added, entries: memory.entries.filter(entry => scopedEntry(entry, scope)).length, memory_path: path.join(directory, 'memory/MEMORY.md') };
}
function validateEvidenceRecord(record, scope) {
  if (!object(record) || Object.keys(record).some(key => !['snapshot_id', 'snapshot_hash', 'collection'].includes(key)) || !/^s_[0-9]+_[a-f0-9]{20}$/.test(record.snapshot_id ?? '') || !/^[a-f0-9]{64}$/.test(record.snapshot_hash ?? '') || !object(record.collection)) fail('invalid portable snapshot evidence');
  const checked = prepared(record.collection), value = checked.value;
  if (value.account.id !== scope.ad_account_id || (value.account.currency ?? null) !== scope.currency || value.account.timezone_name !== scope.timezone || hash(canonical(value)) !== record.snapshot_hash || hash(canonical(record.collection)) !== record.snapshot_hash || record.snapshot_id !== `s_${value.source.finished_at.replace(/[^0-9]/g, '').slice(0, 17)}_${record.snapshot_hash.slice(0, 20)}`) fail('portable snapshot hash or identity mismatch');
  return value;
}
function validateLearningEntry(entry, scope, records) {
  if (!scopedEntry(entry, scope) || Object.keys(entry).some(key => !['learning_version', 'source', 'category', 'verdict', 'stage', 'title', 'summary', 'scope', 'evidence', 'parent_id', 'protocol', 'confidence', 'replication_status', 'metrics', 'history_context', 'id', 'created_at'].includes(key)) || Object.keys(entry.scope).some(key => !['ad_account_id', 'bm_id', 'currency', 'timezone', 'since', 'until'].includes(key)) || !/^learning_[a-f0-9]{64}$/.test(entry.id ?? '') || !['observation', 'hypothesis', 'experiment', 'outcome'].includes(entry.stage) || !Array.isArray(entry.evidence) || !entry.evidence.length || typeof entry.title !== 'string' || !entry.title.trim() || typeof entry.summary !== 'string' || !entry.summary.trim() || entry.verdict !== 'insight' || entry.confidence !== 'UNASSESSED' || entry.replication_status !== 'NOT_ESTABLISHED') fail('invalid scoped learning entry');
  const content = { ...entry }; delete content.id; delete content.created_at;
  if (entry.id !== `learning_${hash(canonical(content))}`) fail('learning entry content hash mismatch');
  date(entry.scope.since, 'learning since'); date(entry.scope.until, 'learning until');
  if (entry.scope.since > entry.scope.until) fail('learning date range reversed');
  for (const ref of entry.evidence) {
    if (!object(ref) || Object.keys(ref).some(key => !['snapshot_id', 'snapshot_hash', 'query_id', 'entity_id'].includes(key))) fail('invalid learning evidence reference fields');
    const record = records.get(ref.snapshot_id);
    if (!record || record.snapshot_hash !== ref.snapshot_hash) fail('learning evidence snapshot is absent or mismatched');
    const value = record.collection, query = value.insights.find(item => item.query.query_id === ref.query_id);
    if (!query || (ref.entity_id != null && !query.rows.some(row => entityFor(query.query.level, row, scope.ad_account_id) === ref.entity_id)) || query.query.since < entry.scope.since || query.query.until > entry.scope.until) fail('learning query, entity or date scope mismatch');
  }
}
function validateLifecycle(entry, entries) {
  if (entry.stage === 'observation' && entry.parent_id != null) fail('observation must not claim a lifecycle parent');
  const previous = { hypothesis: 'observation', experiment: 'hypothesis', outcome: 'experiment' }[entry.stage];
  const parent = entries.find(item => item.id === entry.parent_id && item.stage === previous);
  if (previous && (!parent || ['ad_account_id', 'bm_id', 'currency', 'timezone', ...(entry.stage === 'outcome' ? [] : ['since', 'until'])].some(key => parent.scope[key] !== entry.scope[key]))) fail('learning parent stage or scope mismatch');
  const required = entry.stage === 'hypothesis' ? ['prediction', 'alternatives', 'falsification'] : entry.stage === 'experiment' ? ['change', 'control', 'primary_metric', 'event_mapping', 'decision_threshold', 'duration', 'rollback'] : entry.stage === 'outcome' ? ['observed_result', 'confounders', 'conclusion'] : [];
  if (required.some(key => typeof entry.protocol?.[key] !== 'string' || !entry.protocol[key].trim()) || (entry.stage === 'experiment' && (!Number.isInteger(entry.protocol?.minimum_sample) || entry.protocol.minimum_sample < 1))) fail('learning stage requires a complete explicit protocol');
}
function evidenceFor(directory, memory, entries) {
  const records = new Map(), wanted = new Set(entries.flatMap(entry => entry.evidence.map(ref => ref.snapshot_id)));
  for (const id of wanted) if (fs.existsSync(contained(directory, `data/snapshots/${id}`))) {
    const { manifest, value } = readSnapshot(directory, id);
    records.set(id, { snapshot_id: id, snapshot_hash: manifest.snapshot_hash, collection: value });
  }
  for (const [digest, receipt] of Object.entries(memory.learning_imports ?? {})) {
    if (!/^[a-f0-9]{64}$/.test(digest) || receipt.path !== `imports/${digest}.json`) fail('invalid learning import receipt');
    const bytes = fs.readFileSync(contained(directory, `memory/${receipt.path}`));
    if (hash(bytes) !== digest) fail('imported learning evidence hash mismatch');
    const bundle = JSON.parse(bytes);
    for (const record of bundle.evidence) if (wanted.has(record.snapshot_id) && !records.has(record.snapshot_id)) records.set(record.snapshot_id, record);
  }
  for (const id of wanted) if (!records.has(id)) fail('learning evidence is missing; no export or reuse allowed');
  return records;
}
export function listLearning(root, id) {
  const { directory } = resolveAccount(root, id), scope = learningScope(root, id), memory = accountMemory(directory, scope);
  const entries = memory.entries.filter(entry => scopedEntry(entry, scope)), records = evidenceFor(directory, memory, entries);
  for (const record of records.values()) validateEvidenceRecord(record, scope);
  for (const entry of entries) { validateLearningEntry(entry, scope, records); validateLifecycle(entry, entries); }
  return { scope, entries, evidence_integrity: 'VERIFIED_BYTES_NOT_ORIGIN', unscoped_entries: memory.entries.filter(entry => !scopedEntry(entry, scope)).length, memory_path: path.join(directory, 'memory/MEMORY.md') };
}
export function recordLearning(root, id, input) {
  const { directory } = resolveAccount(root, id), scope = learningScope(root, id);
  return withLock(directory, '.account.lock', () => {
    const memory = accountMemory(directory, scope);
    const entry = sanitize({ learning_version: 1, source: input.source ?? 'data', category: input.category ?? 'history', verdict: 'insight', stage: input.stage,
      title: input.title, summary: input.summary, scope: { ...scope, since: input.since, until: input.until }, evidence: input.evidence,
      parent_id: input.parent_id ?? null, protocol: input.protocol ?? null, confidence: 'UNASSESSED', replication_status: 'NOT_ESTABLISHED' });
    entry.id = `learning_${hash(canonical(entry))}`;
    if (!Array.isArray(entry.evidence) || entry.evidence.some(ref => !object(ref) || !SAFE.test(ref.snapshot_id ?? ''))) fail('invalid learning evidence references');
    const records = evidenceFor(directory, memory, [entry]);
    for (const record of records.values()) validateEvidenceRecord(record, scope);
    validateLearningEntry(entry, scope, records); validateLifecycle(entry, memory.entries.filter(item => scopedEntry(item, scope)));
    const existing = memory.entries.find(item => item.id === entry.id);
    if (!existing) memory.entries.push({ ...entry, created_at: new Date().toISOString() });
    saveAccountMemory(directory, scope, memory);
    return { entry: existing ?? memory.entries.at(-1), added: !existing, memory_path: path.join(directory, 'memory/MEMORY.md') };
  });
}
function validateLearningBundle(bundle, scope) {
  if (!object(bundle) || Object.keys(bundle).some(key => !['schema_version', 'kind', 'scope', 'entries', 'evidence'].includes(key)) || bundle.schema_version !== 1 || bundle.kind !== 'dotads-account-learning' || canonical(bundle.scope) !== canonical(scope) || !Array.isArray(bundle.entries) || !Array.isArray(bundle.evidence)) fail('learning bundle BM/account/currency/timezone or schema mismatch');
  const records = new Map();
  for (const record of bundle.evidence) {
    validateEvidenceRecord(record, scope);
    if (records.has(record.snapshot_id)) fail('duplicate portable snapshot');
    records.set(record.snapshot_id, record);
  }
  const ids = new Set();
  for (const entry of bundle.entries) {
    validateLearningEntry(entry, scope, records); validateLifecycle(entry, bundle.entries);
    if (ids.has(entry.id)) fail('duplicate portable learning ID');
    ids.add(entry.id);
  }
  const referenced = new Set(bundle.entries.flatMap(entry => entry.evidence.map(ref => ref.snapshot_id)));
  if (records.size !== referenced.size) fail('portable bundle contains unrelated evidence');
  return bundle;
}
export function exportLearning(root, id, output) {
  const { directory } = resolveAccount(root, id), scope = learningScope(root, id);
  return withLock(directory, '.account.lock', () => {
    const memory = accountMemory(directory, scope), entries = memory.entries.filter(entry => scopedEntry(entry, scope));
    const records = evidenceFor(directory, memory, entries);
    const bundle = validateLearningBundle({ schema_version: 1, kind: 'dotads-account-learning', scope, entries, evidence: [...records.values()] }, scope);
    if (canonical(sanitize(bundle)) !== canonical(bundle)) fail('portable output contains credential-bearing fields or URLs');
    const bytes = json(bundle);
    if (Buffer.byteLength(bytes) > 128 * 1024 * 1024) fail('learning bundle exceeds the 128 MiB offline ceiling');
    const target = noLinks(output, true), repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    if (target === repo || target.startsWith(`${repo}${path.sep}`) || target === root || target.startsWith(`${path.resolve(root)}${path.sep}`)) fail('export must be outside the code checkout and live workspace');
    // Existing destination directories only: never provision a sync/network destination implicitly.
    noLinks(path.dirname(target));
    if ((fs.statSync(path.dirname(target)).mode & 0o077) !== 0) fail('export parent directory must be private (0700)');
    writeNew(target, bytes); syncDir(path.dirname(target));
    return { account_id: id, entries: entries.length, snapshots: records.size, output: target, sha256: hash(bytes), transferred: false };
  });
}
export function importLearning(root, id, input) {
  const { directory } = resolveAccount(root, id), scope = learningScope(root, id), file = noLinks(input);
  if (!fs.lstatSync(file).isFile() || fs.statSync(file).size > 128 * 1024 * 1024) fail('learning bundle must be a regular file up to 128 MiB');
  const raw = fs.readFileSync(file, 'utf8'), bundle = validateLearningBundle(JSON.parse(raw), scope);
  // Refuse credentials rather than silently changing hashed/imported evidence.
  if (canonical(sanitize(bundle)) !== canonical(bundle)) fail('portable input contains credential-bearing fields or URLs');
  return withLock(directory, '.account.lock', () => {
    const memory = accountMemory(directory, scope), byId = new Map(memory.entries.map(entry => [entry.id, entry]));
    for (const entry of bundle.entries) if (byId.has(entry.id) && canonical(byId.get(entry.id)) !== canonical(entry)) fail('learning ID conflict; explicit reconciliation required, nothing overwritten');
    const records = evidenceFor(directory, memory, memory.entries.filter(entry => scopedEntry(entry, scope)));
    for (const record of bundle.evidence) if (records.has(record.snapshot_id) && canonical(records.get(record.snapshot_id)) !== canonical(record)) fail('learning snapshot conflict; explicit reconciliation required');
    const digest = hash(raw), relative = `imports/${digest}.json`, saved = contained(directory, `memory/${relative}`);
    mkdir(contained(directory, 'memory/imports'));
    if (fs.existsSync(saved)) { if (hash(fs.readFileSync(saved)) !== digest) fail('immutable imported bundle hash mismatch'); }
    else writeNew(saved, raw);
    const markdown = ['# Imported account learning evidence', '', '**Imported, unverified origin. No authenticated Meta read occurred on this device.** Source declarations below are supplied evidence, not authentication or causal proof.', '', `Bundle SHA-256: ${digest}`, '', '```json', json(bundle).trimEnd(), '```', ''].join('\n');
    const mdFile = contained(directory, `memory/imports/${digest}.md`);
    if (fs.existsSync(mdFile)) { if (fs.readFileSync(mdFile, 'utf8') !== markdown) fail('immutable imported Markdown conflict'); }
    else writeNew(mdFile, markdown);
    let added = 0;
    for (const entry of bundle.entries) if (!byId.has(entry.id)) { memory.entries.push(entry); added++; }
    memory.learning_imports = { ...memory.learning_imports, [digest]: { path: relative, authenticated_read_observed: false } };
    saveAccountMemory(directory, scope, memory);
    return { account_id: id, added, total_entries: memory.entries.filter(entry => scopedEntry(entry, scope)).length, sha256: digest, authenticated_read_observed: false, memory_path: path.join(directory, 'memory/MEMORY.md') };
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
function saveIndex(directory, value, storage = 'media') { atomic(path.join(directory, storage, 'index.json'), value); }
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
export function importMedia(root, id, source, { move = false, shared = false, temporary = false } = {}) {
  if ([move, shared, temporary].some(value => typeof value !== 'boolean')) fail('media options must be boolean');
  if (temporary && (!shared || move)) fail('temporary assets require shared copy mode, never a move');
  if (typeof source !== 'string' || !source.trim()) fail('media source is required');
  const account = resolveAccount(root, id);
  if (shared) ensureBMAssets(root);
  const directory = shared ? root : account.directory;
  const storage = shared ? (temporary ? 'assets/temporary' : 'assets') : 'media';
  const persist = saved => saveIndex(directory, saved, storage);
  source = path.resolve(source);
  return withLock(directory, shared ? '.assets.lock' : '.account.lock', () => {
    mkdir(path.join(directory, storage));
    const saved = index(directory, storage);
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
      const destination = existing?.path ?? `${storage}/${VIDEO.has(extension) ? 'videos' : 'images'}/${inspected.sha256}${extension}`;
      operation = { operation_id: operationId, account_id: id, mode: move ? 'move' : 'copy', source, original_name: path.basename(source), identity: inspected.identity, sha256: inspected.sha256, size: inspected.size, destination, imported_at: new Date().toISOString(), source_type: 'selected_local_file', relationships: [], state: 'planned', claim: move ? path.join(path.dirname(source), `.dotads-claim-${operationId}`, 'source') : null };
      saved.imports.push(operation); persist(saved);
    }
    let selectedSource = operation.mode === 'move' ? operation.claim : operation.source;
    if (operation.mode === 'move' && !fs.existsSync(operation.claim)) {
      if (['indexed', 'source_cleanup_pending', 'complete'].includes(operation.state)) {
        verifyAsset(directory, operation.destination, operation.sha256);
        operation.state = 'complete'; persist(saved);
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
        operation.state = 'conflict'; operation.reason = 'Claim identity mismatch; source bytes retained.'; persist(saved);
        try {
          fs.linkSync(operation.claim, operation.source); // Atomic no-clobber restoration.
          syncDir(path.dirname(operation.source)); fs.unlinkSync(operation.claim); syncDir(claimDir);
        } catch (error) { if (error.code !== 'EEXIST') throw error; }
        fail(`source claim mismatch; reconcile ${operation.source} and ${operation.claim}`);
      }
      operation.state = 'source_claimed'; persist(saved);
    }
    const selected = inspectFile(selectedSource);
    if (!sameIdentity(selected.identity, operation.identity) || selected.sha256 !== operation.sha256) fail(`claimed/source file changed; preserve ${selectedSource}`);
    publishMedia(directory, selectedSource, operation.destination, operation.sha256, operation.identity);
    operation.state = 'destination_verified'; persist(saved);
    if (!saved.assets.some(item => item.sha256 === operation.sha256)) saved.assets.push({ sha256: operation.sha256, size: operation.size, path: operation.destination, media_type: operation.destination.includes('/videos/') ? 'video' : 'image', first_imported_at: operation.imported_at });
    operation.state = 'indexed'; persist(saved);
    verifyAsset(directory, operation.destination, operation.sha256);
    // Reread the durable index before deleting a selected source claim.
    const persisted = index(directory, storage).imports.find(item => item.operation_id === operation.operation_id);
    if (!persisted || persisted.sha256 !== operation.sha256 || persisted.state !== 'indexed' || persisted.destination !== operation.destination) fail('media index verification failed; preserve source');
    if (operation.mode === 'move') {
      operation.state = 'source_cleanup_pending'; persist(saved);
      const current = inspectFile(operation.claim);
      if (!sameIdentity(current.identity, operation.identity) || current.sha256 !== operation.sha256 || current.nlink !== 1) return resultFor(directory, operation, { source_retained: true, reason: 'Claim identity/content or hardlink stability is uncertain; reconcile before cleanup.' });
      try { fs.unlinkSync(operation.claim); syncDir(path.dirname(operation.claim)); fs.rmdirSync(path.dirname(operation.claim)); syncDir(path.dirname(operation.source)); }
      catch (error) { return resultFor(directory, operation, { source_retained: fs.existsSync(operation.claim), reason: `Source cleanup unfinished: ${error.code ?? 'filesystem error'}` }); }
    }
    operation.state = 'complete'; persist(saved);
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
