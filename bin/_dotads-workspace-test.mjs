#!/usr/bin/env node
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { ensureRoot, saveSnapshot, renderReport, importMedia, listLocalAccounts, validateCollection, recordFailure, planAdoption, registerExisting } from './_dotads-workspace.mjs';

function fixture(t) {
  const temporary = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'dotads-workspace-test-')));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  return { temporary, root: path.join(temporary, 'reports') };
}
function collection(id = '123', name = 'Example account') {
  return {
    schema_version: 1,
    source: { kind: 'offline-sdk-fixture', sdk_version: '24.0.1', api_version: 'v24.0', effective_api_version: null, started_at: '2026-10-01T00:00:00Z', finished_at: '2026-10-01T00:00:10Z' },
    account: { id: `act_${id}`, account_id: id, name, currency: 'USD', timezone_name: 'Asia/Jakarta' },
    scope: { since: '2026-09-01', until: '2026-09-30', levels: ['ad'], breakdowns: [], attribution: {}, action_report_time: 'conversion' },
    resources: {
      campaigns: { status: 'complete', pagination_exhausted: true, rows: [{ id: '1', account_id: id, name: 'Campaign' }], errors: [] },
      adsets: { status: 'complete', pagination_exhausted: true, rows: [{ id: '2', account_id: id, campaign_id: '1', name: 'Ad set' }], errors: [] },
      ads: { status: 'complete', pagination_exhausted: true, rows: [{ id: '3', account_id: id, campaign_id: '1', adset_id: '2', creative: { id: '4' }, name: 'Measured' }, { id: '5', account_id: id, campaign_id: '1', adset_id: '2', name: 'No spend row' }], errors: [] },
      creatives: { status: 'complete', pagination_exhausted: true, rows: [{ id: '4', account_id: id, image_url: 'https://cdn.example.test/photo.jpg', object_story_spec: { link_data: { link: 'https://example.test/product?variant=blue&utm_campaign=test' } } }], errors: [] },
    },
    insights: [{ query: { account_id: id, since: '2026-09-01', until: '2026-09-30', level: 'ad', fields: ['ad_id', 'spend', 'impressions', 'outbound_clicks'], breakdowns: [], time_increment: 'all_days', attribution: {}, action_report_time: 'conversion' }, coverage: { status: 'complete', pagination_exhausted: true }, rows: [{ account_id: id, ad_id: '3', campaign_id: '1', adset_id: '2', spend: '10', impressions: '100', outbound_clicks: [{ action_type: 'outbound_click', value: '0' }] }], errors: [] }],
  };
}
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');

test('local account listing is read-only and empty for an absent root while existing corrupt or linked roots fail', t => {
  const { temporary, root } = fixture(t);
  assert.deepEqual(listLocalAccounts(root), []); assert.equal(fs.existsSync(root), false);
  assert.deepEqual(listLocalAccounts(path.join(temporary, 'missing-parent/reports')), []);
  assert.equal(fs.existsSync(path.join(temporary, 'missing-parent')), false);
  fs.mkdirSync(root); fs.writeFileSync(path.join(root, 'accounts.json'), '{broken');
  assert.throws(() => listLocalAccounts(root), /invalid JSON/);
  const linked = path.join(temporary, 'linked-root'); fs.symlinkSync(root, linked);
  assert.throws(() => listLocalAccounts(linked), /symlink/);
  assert.throws(() => listLocalAccounts(path.join(linked, 'missing-child')), /symlink/);
  assert.equal(fs.readFileSync(path.join(root, 'accounts.json'), 'utf8'), '{broken');
});

test('verified IDs keep repeated names separate and renames preserve folders and notes', t => {
  const { root } = fixture(t);
  const first = saveSnapshot(root, collection());
  fs.writeFileSync(path.join(first.directory, 'NOTES.md'), 'Keep these operator decisions.\n');
  const renamed = collection('123', 'Renamed account'); renamed.source.finished_at = '2026-10-01T00:01:00Z';
  const next = saveSnapshot(root, renamed);
  const other = saveSnapshot(root, collection('456'));
  assert.equal(first.directory, next.directory);
  assert.notEqual(first.directory, other.directory);
  assert.equal(fs.readFileSync(path.join(first.directory, 'NOTES.md'), 'utf8'), 'Keep these operator decisions.\n');
  assert.match(fs.readFileSync(path.join(first.directory, 'ACCOUNT.md'), 'utf8'), /Renamed account/);
  assert.equal(listLocalAccounts(root).find(item => item.id === 'act_123').name, 'Renamed account');
  for (const name of ['brand.json', '.meta-state.json', '.git', 'campaigns']) assert.equal(fs.existsSync(path.join(first.directory, name)), false);
  assert.equal(fs.statSync(root).mode & 0o077, 0);
  assert.equal(fs.statSync(path.join(root, 'accounts.json')).mode & 0o077, 0);
});

test('malformed, conflicting and escaping registries stop without overwriting files', t => {
  const { root } = fixture(t); const saved = saveSnapshot(root, collection());
  const registryPath = path.join(root, 'accounts.json'); const original = fs.readFileSync(registryPath, 'utf8');
  for (const mutation of [
    value => { value.accounts.act_123.directory = '../escape'; },
    value => { value.accounts.act_123.id = 'act_999'; },
    value => { value.accounts.act_456 = { ...value.accounts.act_123, id: 'act_456', account_id: '456' }; },
    value => { value.accounts['../act_123'] = value.accounts.act_123; },
  ]) {
    const value = JSON.parse(original); mutation(value); const bad = JSON.stringify(value); fs.writeFileSync(registryPath, bad);
    assert.throws(() => saveSnapshot(root, collection())); assert.equal(fs.readFileSync(registryPath, 'utf8'), bad);
  }
  fs.writeFileSync(registryPath, '{broken'); assert.throws(() => listLocalAccounts(root), /invalid JSON/);
  fs.writeFileSync(registryPath, original);
  const account = read(path.join(saved.directory, 'account.json')); account.id = 'act_456'; fs.writeFileSync(path.join(saved.directory, 'account.json'), JSON.stringify(account));
  assert.throws(() => saveSnapshot(root, collection()), /saved account identity mismatch/);
});

test('symlinks and unreconciled locks cannot redirect workspace publication', t => {
  const { temporary, root } = fixture(t); ensureRoot(root);
  const outside = path.join(temporary, 'outside'); fs.mkdirSync(outside);
  fs.symlinkSync(outside, path.join(root, 'act_123--example-account'));
  assert.throws(() => saveSnapshot(root, collection()), /symlink/);
  fs.unlinkSync(path.join(root, 'act_123--example-account'));
  fs.writeFileSync(path.join(root, '.registry.lock'), '{}');
  assert.throws(() => saveSnapshot(root, collection()), /lock requires reconciliation/);
  fs.unlinkSync(path.join(root, '.registry.lock'));
  const saved = saveSnapshot(root, collection());
  fs.symlinkSync(outside, path.join(saved.directory, 'reports'));
  assert.throws(() => renderReport(root, 'act_123'), /symlink/);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test('existing public root becomes private through its verified directory descriptor', t => {
  const { temporary, root } = fixture(t); fs.mkdirSync(root, { mode: 0o755 }); fs.chmodSync(root, 0o755);
  ensureRoot(root); assert.equal(fs.statSync(root).mode & 0o777, 0o700);
  const outside = path.join(temporary, 'public'); fs.mkdirSync(outside, { mode: 0o755 }); fs.chmodSync(outside, 0o755);
  const linked = path.join(temporary, 'linked-root'); fs.symlinkSync(outside, linked);
  assert.throws(() => ensureRoot(linked), /symlink/); assert.equal(fs.statSync(outside).mode & 0o777, 0o755);
});

test('collection trust boundary rejects identity, scope, duplicate grain and resolved-parent conflicts', () => {
  for (const mutation of [
    value => { value.schema_version = 2; },
    value => { value.account.account_id = '999'; },
    value => { value.resources.ads.rows[0].account_id = '999'; },
    value => { delete value.resources.ads.rows[0].account_id; },
    value => { delete value.resources.adsets.rows[0].campaign_id; },
    value => { delete value.resources.ads.rows[0].adset_id; },
    value => { value.insights[0].query.until = '2026-09-29'; },
    value => { value.insights[0].rows.push({ ...value.insights[0].rows[0] }); },
    value => { value.resources.ads.rows[0].campaign_id = '99'; },
    value => { value.insights[0].rows[0].adset_id = '99'; },
    value => { value.resources.ads.pagination_exhausted = false; },
    value => { value.scope.levels = ['campaign']; value.insights[0].query.level = 'campaign'; },
    value => { value.scope.levels = ['account']; value.insights[0].query.level = 'account'; },
    value => { value.insights[0].required = false; value.insights[0].coverage = { status: 'unavailable', pagination_exhausted: false }; value.insights[0].rows = []; },
  ]) { const value = collection(); mutation(value); assert.throws(() => validateCollection(value)); }
  assert.equal(validateCollection(collection()).valid, true);
});

test('snapshot credentials are redacted while destination variants and provenance survive', t => {
  const { root } = fixture(t); const value = collection();
  value.resources.creatives.rows[0].access_token = 'fixture-secret-never-persist';
  value.resources.creatives.rows[0].image_url = 'https://cdn.example.test/photo.jpg?X-Amz-Signature=fixture-secret-never-persist&X-Goog-Signature=fixture-secret-never-persist';
  value.resources.creatives.rows[0].object_story_spec.link_data.link = 'https://name:fixture-secret-never-persist@example.test/product?variant=blue&access_token=fixture-secret-never-persist';
  const saved = saveSnapshot(root, value); const report = renderReport(root, 'act_123');
  const creativeBytes = fs.readFileSync(path.join(saved.snapshot_path, 'creatives.json'), 'utf8');
  assert.doesNotMatch(creativeBytes, /fixture-secret-never-persist/); assert.match(creativeBytes, /REDACTED/);
  const web = read(path.join(saved.directory, 'web/index.json'));
  assert.match(web.destinations[0].original_tagged_url, /variant=blue/);
  assert.equal(web.destinations[0].capture, null);
  assert.equal(read(path.join(saved.directory, 'media/index.json')).remote_references[0].downloaded, false);
  const metadata = read(report.metadata_path); assert.equal(metadata.economics, null);
  assert.equal(metadata.media_index_hash, sha(fs.readFileSync(path.join(report.report_directory, 'inputs/media-index.json'))));
});

test('destination and media metadata retain native references without fabricating downloads or host matches', t => {
  const { root } = fixture(t); const value = collection();
  value.resources.creatives.rows[0].image_hash = 'fixture-image-hash'; value.resources.creatives.rows[0].video_id = '555';
  value.resources.creatives.rows[0].object_story_spec.link_data = { link: 'https://notwhatsapp.com/product', call_to_action: { value: { lead_gen_form_id: '666', app_link: 'sampleapp://item/7?access_token=fixture-hidden' } } };
  const saved = saveSnapshot(root, value); const web = read(path.join(saved.directory, 'web/index.json')); const media = read(path.join(saved.directory, 'media/index.json'));
  assert.equal(web.destinations.find(item => item.domain === 'notwhatsapp.com').destination_type, 'website');
  assert.equal(web.destinations.find(item => item.native_kind === 'lead_gen_form_id').native_reference, '666');
  assert.equal(web.destinations.find(item => item.native_kind === 'app_link').destination_type, 'deep_link');
  assert.doesNotMatch(JSON.stringify(web), /fixture-hidden/);
  assert.ok(media.remote_references.some(item => item.reference_type === 'video_id' && item.reference === '555' && item.downloaded === false));
});

test('spreadsheet-formula names are exported as text while measured zero stays numeric', t => {
  const { root } = fixture(t); const value = collection();
  const dangerous = ['=1+1', ' +CMD()', '\t@SUM(A1:A2)', '\r\n-1+2'];
  value.resources.ads.rows = dangerous.map((name, i) => ({ id: String(i + 10), account_id: '123', name, campaign_id: '1', adset_id: '2' }));
  value.insights[0].rows = [{ account_id: '123', ad_id: '10', campaign_id: '1', adset_id: '2', spend: '0', impressions: '0', outbound_clicks: [{ action_type: 'outbound_click', value: '0' }] }];
  saveSnapshot(root, value); const report = renderReport(root, 'act_123');
  const bytes = fs.readFileSync(path.join(report.report_directory, 'ads.csv'), 'utf8');
  for (const name of dangerous) assert.ok(bytes.includes(`'${name}`));
  assert.match(bytes, /,0,0,0,/); assert.doesNotMatch(bytes, /,'0,/);
});

test('imported collections expose local import provenance instead of implying an authenticated read', t => {
  const { root } = fixture(t); const value = collection();
  value.source.kind = 'official-python-sdk';
  value.import_context = { kind: 'selected_local_json', authenticated_read_observed: false };
  const saved = saveSnapshot(root, value); const report = renderReport(root, 'act_123');
  assert.match(fs.readFileSync(report.report_path, 'utf8'), /Imported collection; no authenticated provider read observed on this device/);
  assert.equal(read(report.metadata_path).import_context.kind, 'selected_local_json');
  assert.equal(read(path.join(saved.snapshot_path, 'manifest.json')).source.import_context.authenticated_read_observed, false);
});

test('separate query views include zero-row inventory and unresolved history without hierarchy double counting', t => {
  const { root } = fixture(t); const value = collection();
  value.scope.levels.push('campaign');
  value.insights[0].rows.push({ account_id: '123', ad_id: '99', campaign_id: '98', adset_id: '97', spend: '0', impressions: '0' });
  value.insights.push({ ...structuredClone(value.insights[0]), query: { ...value.insights[0].query, level: 'campaign' }, rows: [{ account_id: '123', campaign_id: '1', spend: '10', impressions: '100', outbound_clicks: [{ action_type: 'outbound_click', value: '0' }] }] });
  const saved = saveSnapshot(root, value); const report = renderReport(root, 'act_123');
  const markdown = fs.readFileSync(report.report_path, 'utf8'), ads = fs.readFileSync(path.join(report.report_directory, 'ads.csv'), 'utf8');
  assert.match(ads, /No spend row/); assert.match(ads, /no_insights_row/); assert.match(ads, /unresolved_historical/);
  assert.match(markdown, /outbound CPC: unavailable/); assert.match(markdown, /outbound clicks: unavailable/);
  assert.doesNotMatch(markdown, /Spend: 20/); assert.match(markdown, /Purchase\/result mapping/);
  assert.equal(read(path.join(saved.snapshot_path, 'insights.json')).length, 2);
});

test('query IDs normalize field order, preserve distinct fields and reject missing breakdown grain', t => {
  const { root } = fixture(t); const first = saveSnapshot(root, collection());
  const reordered = collection(); reordered.insights[0].query.fields.reverse();
  const second = saveSnapshot(root, reordered); assert.equal(first.scope_key, second.scope_key);
  const otherFields = collection(); otherFields.insights[0].query.fields.push('reach');
  const third = saveSnapshot(root, otherFields); assert.notEqual(first.scope_key, third.scope_key);
  const broken = collection(); broken.scope.breakdowns = ['age']; broken.insights[0].query.breakdowns = ['age'];
  assert.throws(() => validateCollection(broken), /missing returned breakdown/);
  broken.insights[0].rows[0].age = '25-34';
  broken.insights[0].rows.push({ ...broken.insights[0].rows[0], age: '35-44' });
  assert.equal(validateCollection(broken).valid, true);
});

test('overlapping date buckets withhold totals rather than summing repeated measurement', t => {
  const { root } = fixture(t); const value = collection(); value.insights[0].query.time_increment = 1;
  value.insights[0].rows[0].date_start = '2026-09-01'; value.insights[0].rows[0].date_stop = '2026-09-02';
  value.insights[0].rows.push({ ...value.insights[0].rows[0], date_start: '2026-09-02', date_stop: '2026-09-03' });
  saveSnapshot(root, value); const report = renderReport(root, 'act_123');
  assert.match(fs.readFileSync(report.report_path, 'utf8'), /Overlapping date buckets; totals withheld/);
});

test('partial and failed attempts retain complete snapshots and current report pointers for the same scope', t => {
  const { root } = fixture(t); const complete = saveSnapshot(root, collection()); const original = renderReport(root, 'act_123');
  const partial = collection(); partial.source.finished_at = '2026-10-01T00:02:00Z'; partial.resources.creatives.status = 'partial'; partial.resources.creatives.pagination_exhausted = false; partial.resources.creatives.errors = ['permission unavailable'];
  const attempted = saveSnapshot(root, partial); assert.equal(attempted.status, 'partial');
  const sync = read(path.join(complete.directory, 'sync.json')).scopes[complete.scope_key];
  assert.equal(sync.last_complete_success.snapshot_id, complete.snapshot_id); assert.equal(sync.current_report.revision_id, original.revision_id);
  const fallback = renderReport(root, 'act_123'); assert.equal(fallback.snapshot_id, complete.snapshot_id);
  assert.match(fs.readFileSync(fallback.report_path, 'utf8'), /Historical\/stale selection/);
  const explicit = renderReport(root, 'act_123', { snapshotId: attempted.snapshot_id }); assert.equal(explicit.status, 'partial');
  assert.equal(read(path.join(complete.directory, 'sync.json')).scopes[complete.scope_key].current_report.revision_id, fallback.revision_id);
  recordFailure(root, 'act_123', collection().scope, 'offline transport failure access_token=fixture-hidden');
  const failed = read(path.join(complete.directory, 'sync.json')).scopes[complete.scope_key];
  assert.equal(failed.latest_attempt.status, 'failed'); assert.equal(failed.last_complete_success.snapshot_id, complete.snapshot_id);
  assert.doesNotMatch(JSON.stringify(failed), /fixture-hidden/);
  assert.equal(renderReport(root, 'act_123').snapshot_id, complete.snapshot_id);
});

test('a failed new period cannot silently show a complete report from a different scope', t => {
  const { root } = fixture(t); const saved = saveSnapshot(root, collection()); renderReport(root, 'act_123');
  const next = { ...collection().scope, since: '2026-10-01', until: '2026-10-15' };
  const failed = recordFailure(root, 'act_123', next, 'offline failure'); assert.equal(failed.matched_scope, false);
  assert.throws(() => renderReport(root, 'act_123'), /no valid collection scope/);
  assert.equal(renderReport(root, 'act_123', { scopeKey: saved.scope_key }).snapshot_id, saved.snapshot_id);
  assert.throws(() => recordFailure(root, 'act_999', next, 'failure'), /not registered/);
  assert.equal(listLocalAccounts(root).length, 1);
});

test('all-unavailable collections are retained as failed snapshots and require explicit report selection', t => {
  const { root } = fixture(t); const value = collection();
  for (const item of Object.values(value.resources)) Object.assign(item, { status: 'unavailable', pagination_exhausted: false, rows: [], errors: ['offline denied'] });
  Object.assign(value.insights[0], { coverage: { status: 'unavailable', pagination_exhausted: false }, rows: [], errors: ['offline denied'] });
  const saved = saveSnapshot(root, value); assert.equal(saved.status, 'failed');
  assert.throws(() => renderReport(root, 'act_123'), /no complete success/);
  assert.equal(renderReport(root, 'act_123', { snapshotId: saved.snapshot_id }).status, 'failed');
});

test('snapshot and report revisions are immutable, bind enrichment bytes, and detect corruption', t => {
  const { temporary, root } = fixture(t); const saved = saveSnapshot(root, collection()); const first = renderReport(root, 'act_123');
  const original = fs.readFileSync(first.report_path, 'utf8');
  assert.equal(renderReport(root, 'act_123').revision_id, first.revision_id);
  const source = path.join(temporary, 'new.png'); fs.writeFileSync(source, 'local selected image'); importMedia(root, 'act_123', source);
  const second = renderReport(root, 'act_123'); assert.notEqual(second.revision_id, first.revision_id);
  assert.equal(fs.readFileSync(first.report_path, 'utf8'), original);
  assert.equal(read(path.join(first.report_directory, 'inputs/media-index.json')).assets.length, 0);
  assert.equal(read(path.join(second.report_directory, 'inputs/media-index.json')).assets.length, 1);
  const metadata = read(second.metadata_path); fs.writeFileSync(second.metadata_path, JSON.stringify({ ...metadata, files: {} }));
  assert.throws(() => renderReport(root, 'act_123'), /immutable report metadata conflict/);
  fs.writeFileSync(second.metadata_path, JSON.stringify(metadata));
  fs.appendFileSync(path.join(saved.snapshot_path, 'ads.json'), '\n');
  assert.throws(() => renderReport(root, 'act_123'), /snapshot file hash mismatch/);
});

test('media copy deduplicates bytes while preserving each source and operation provenance', t => {
  const { temporary, root } = fixture(t); const saved = saveSnapshot(root, collection());
  const a = path.join(temporary, 'photo.png'), b = path.join(temporary, 'another.png'); fs.writeFileSync(a, 'image bytes'); fs.writeFileSync(b, 'image bytes');
  const first = importMedia(root, 'act_123', a), repeated = importMedia(root, 'act_123', a), other = importMedia(root, 'act_123', b);
  assert.equal(first.status, 'complete'); assert.equal(first.operation_id, repeated.operation_id); assert.notEqual(first.operation_id, other.operation_id);
  assert.equal(first.destination, other.destination); assert.equal(fs.readFileSync(a, 'utf8'), 'image bytes');
  const media = read(path.join(saved.directory, 'media/index.json')); assert.equal(media.assets.length, 1); assert.equal(media.imports.length, 2);
  fs.writeFileSync(b, 'different image bytes'); const changed = importMedia(root, 'act_123', b); assert.notEqual(changed.destination, first.destination);
  assert.equal(read(path.join(saved.directory, 'media/index.json')).assets.length, 2);
});

test('media move uses a verified claim, retains a replacement at the original pathname, and is idempotent', t => {
  const { temporary, root } = fixture(t); saveSnapshot(root, collection());
  const source = path.join(temporary, 'selected.mp4'); fs.writeFileSync(source, 'selected video bytes');
  const rename = fs.renameSync;
  fs.renameSync = function (from, to) { const result = rename(from, to); if (from === source) fs.writeFileSync(source, 'new replacement must remain'); return result; };
  let moved; try { moved = importMedia(root, 'act_123', source, { move: true }); } finally { fs.renameSync = rename; }
  assert.equal(moved.status, 'complete'); assert.equal(fs.readFileSync(source, 'utf8'), 'new replacement must remain');
  assert.equal(fs.readFileSync(moved.destination_path, 'utf8'), 'selected video bytes'); assert.equal(fs.existsSync(moved.claim), false);
  const secondSource = path.join(temporary, 'other.mp4'); fs.writeFileSync(secondSource, 'other video bytes');
  const second = importMedia(root, 'act_123', secondSource, { move: true }); assert.equal(fs.existsSync(secondSource), false);
  assert.equal(importMedia(root, 'act_123', secondSource, { move: true }).operation_id, second.operation_id);
});

test('same-file and hardlink imports never delete an existing managed asset', t => {
  const { temporary, root } = fixture(t); saveSnapshot(root, collection());
  const source = path.join(temporary, 'photo.png'); fs.writeFileSync(source, 'selected image'); const imported = importMedia(root, 'act_123', source);
  const same = importMedia(root, 'act_123', imported.destination_path, { move: true }); assert.equal(same.already_imported, true);
  const linked = path.join(temporary, 'hardlink.png'); fs.linkSync(imported.destination_path, linked);
  const hardlink = importMedia(root, 'act_123', linked, { move: true }); assert.equal(hardlink.already_imported, true);
  assert.equal(fs.existsSync(linked), true); assert.equal(fs.existsSync(imported.destination_path), true);
});

test('move recovery after deletion-before-completion verifies the destination and preserves replacement files', t => {
  const { temporary, root } = fixture(t); const saved = saveSnapshot(root, collection());
  const source = path.join(temporary, 'video.mp4'); fs.writeFileSync(source, 'video');
  const unlink = fs.unlinkSync;
  fs.unlinkSync = function (target) { const result = unlink(target); if (target.includes('.dotads-claim-') && path.basename(target) === 'source') { fs.writeFileSync(source, 'replacement'); throw Object.assign(new Error('offline injected cleanup interruption'), { code: 'EIO' }); } return result; };
  let interrupted; try { interrupted = importMedia(root, 'act_123', source, { move: true }); } finally { fs.unlinkSync = unlink; }
  assert.equal(interrupted.status, 'source_cleanup_pending');
  const resumed = importMedia(root, 'act_123', source, { move: true }); assert.equal(resumed.status, 'complete');
  assert.equal(fs.readFileSync(source, 'utf8'), 'replacement'); assert.equal(fs.readFileSync(resumed.destination_path, 'utf8'), 'video');
  assert.equal(read(path.join(saved.directory, 'media/index.json')).imports.length, 1);
});

test('source mutation and destination conflicts preserve source bytes and expose recovery state', t => {
  const { temporary, root } = fixture(t); const saved = saveSnapshot(root, collection());
  const source = path.join(temporary, 'moving.png'); fs.writeFileSync(source, 'original image');
  const copy = fs.copyFileSync;
  fs.copyFileSync = function (from, to, flags) { const result = copy(from, to, flags); fs.appendFileSync(from, ' externally changed'); return result; };
  try { assert.throws(() => importMedia(root, 'act_123', source, { move: true }), /changed during copy/); } finally { fs.copyFileSync = copy; }
  const operation = read(path.join(saved.directory, 'media/index.json')).imports[0];
  assert.equal(fs.existsSync(operation.claim), true); assert.match(fs.readFileSync(operation.claim, 'utf8'), /externally changed/);
  assert.throws(() => importMedia(root, 'act_123', source, { move: true }), /changed/);
  const other = path.join(temporary, 'conflict.png'); fs.writeFileSync(other, 'new image');
  const destination = path.join(saved.directory, 'media/images', `${sha('new image')}.png`); fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, 'unrelated target');
  assert.throws(() => importMedia(root, 'act_123', other), /hash mismatch/); assert.equal(fs.readFileSync(other, 'utf8'), 'new image'); assert.equal(fs.readFileSync(destination, 'utf8'), 'unrelated target');
});

test('mismatched claim restoration cannot overwrite an original pathname recreated during recovery', t => {
  const { temporary, root } = fixture(t); const saved = saveSnapshot(root, collection());
  const source = path.join(temporary, 'selected.png'); fs.writeFileSync(source, 'selected original');
  const rename = fs.renameSync, link = fs.linkSync;
  fs.renameSync = function (from, to) { if (from === source) fs.writeFileSync(source, 'externally changed selection'); return rename(from, to); };
  fs.linkSync = function (from, to) { if (to === source) fs.writeFileSync(source, 'recreated original pathname'); return link(from, to); };
  try { assert.throws(() => importMedia(root, 'act_123', source, { move: true }), /source claim mismatch/); }
  finally { fs.renameSync = rename; fs.linkSync = link; }
  const operation = read(path.join(saved.directory, 'media/index.json')).imports[0];
  assert.equal(operation.state, 'conflict'); assert.equal(fs.readFileSync(source, 'utf8'), 'recreated original pathname'); assert.equal(fs.readFileSync(operation.claim, 'utf8'), 'externally changed selection');
});

test('an existing claim directory is never adopted and default copy never resumes move cleanup', t => {
  const { temporary, root } = fixture(t); const saved = saveSnapshot(root, collection());
  const source = path.join(temporary, 'copy.png'); fs.writeFileSync(source, 'selected original');
  const mkdir = fs.mkdirSync;
  fs.mkdirSync = function (target, options) { if (String(target).includes('.dotads-claim-')) { mkdir(target, options); throw Object.assign(new Error('preexisting directory'), { code: 'EEXIST' }); } return mkdir(target, options); };
  try { assert.throws(() => importMedia(root, 'act_123', source, { move: true }), /requires reconciliation/); } finally { fs.mkdirSync = mkdir; }
  assert.equal(fs.existsSync(source), true); assert.throws(() => importMedia(root, 'act_123', source, { move: true }), /requires reconciliation/);
  const source2 = path.join(temporary, 'moving.png'); fs.writeFileSync(source2, 'multiply linked source'); fs.linkSync(source2, path.join(temporary, 'source2-hardlink.png'));
  const pending = importMedia(root, 'act_123', source2, { move: true }); assert.equal(pending.status, 'source_cleanup_pending');
  assert.throws(() => importMedia(root, 'act_123', source2), /source is missing/); assert.equal(fs.existsSync(pending.claim), true);
  const mediaPath = path.join(saved.directory, 'media/index.json'), media = read(mediaPath); media.imports[1].account_id = 'act_999'; fs.writeFileSync(mediaPath, JSON.stringify(media));
  assert.throws(() => importMedia(root, 'act_123', source2, { move: true }), /invalid media import journal/); assert.equal(fs.existsSync(pending.claim), true);
});

test('managed metadata, cross-account assets, symlink sources and corrupt indexes are refused before cleanup', t => {
  const { temporary, root } = fixture(t); const a = saveSnapshot(root, collection()); const b = saveSnapshot(root, collection('456'));
  const source = path.join(temporary, 'image.png'); fs.writeFileSync(source, 'image'); const imported = importMedia(root, 'act_123', source);
  assert.throws(() => importMedia(root, 'act_456', imported.destination_path, { move: true }), /managed workspace files/);
  assert.throws(() => importMedia(root, 'act_123', path.join(a.directory, 'account.json'), { move: true }), /managed workspace files/);
  const link = path.join(temporary, 'link.png'); fs.symlinkSync(source, link); assert.throws(() => importMedia(root, 'act_123', link, { move: true }), /symlink/);
  fs.writeFileSync(path.join(b.directory, 'media/index.json'), '{broken'); assert.throws(() => importMedia(root, 'act_456', source, { move: true }), /invalid JSON/);
  assert.equal(fs.existsSync(source), true); assert.equal(fs.existsSync(imported.destination_path), true);
});

function operationalProject(temporary, name = 'operational') {
  const source = path.join(temporary, name); fs.mkdirSync(source);
  fs.writeFileSync(path.join(source, 'brand.json'), JSON.stringify({ ad_account_id: 'act_123', brand: 'Selected project', token_env: 'META_ACCESS_TOKEN' }));
  fs.writeFileSync(path.join(source, '.meta-state.json'), JSON.stringify({ version: 1, ad_account_id: 'act_123', campaigns: { saved: { id: '1' } }, adsets: {}, ads: {}, creatives: {}, media_cache: {} }));
  fs.mkdirSync(path.join(source, 'media')); fs.writeFileSync(path.join(source, 'media/image.png'), 'source media bytes');
  fs.writeFileSync(path.join(source, 'NOTES.md'), 'Preserved project decisions.\n');
  fs.writeFileSync(path.join(source, '.env'), 'PRIVATE_UNREAD_SENTINEL');
  return source;
}

test('selected project adoption records a reviewed reference and leaves every source/state/media file authoritative', t => {
  const { temporary, root } = fixture(t); const saved = saveSnapshot(root, collection()); const source = operationalProject(temporary);
  const beforeState = fs.readFileSync(path.join(source, '.meta-state.json'), 'utf8');
  const readFile = fs.readFileSync, open = fs.openSync;
  fs.readFileSync = function (target, ...args) { if (String(target).endsWith('/.env')) assert.fail('adoption must not read .env'); return readFile(target, ...args); };
  fs.openSync = function (target, ...args) { if (String(target).endsWith('/.env')) assert.fail('adoption must not open .env'); return open(target, ...args); };
  let planned, applied;
  try { planned = planAdoption(root, 'act_123', source); applied = planAdoption(root, 'act_123', source, { apply: true }); }
  finally { fs.readFileSync = readFile; fs.openSync = open; }
  assert.equal(planned.status, 'planned'); assert.equal(applied.status, 'complete'); assert.equal(applied.action, 'reference_only');
  assert.equal(fs.readFileSync(path.join(source, '.meta-state.json'), 'utf8'), beforeState);
  assert.equal(fs.readFileSync(path.join(source, 'media/image.png'), 'utf8'), 'source media bytes');
  assert.equal(fs.readFileSync(path.join(source, 'NOTES.md'), 'utf8'), 'Preserved project decisions.\n');
  assert.equal(fs.existsSync(path.join(saved.directory, '.meta-state.json')), false);
  assert.equal(read(path.join(saved.directory, 'media/index.json')).assets.length, 0);
  const reference = read(path.join(saved.directory, 'operational-references.json')).references[0]; assert.equal(reference.source, source); assert.equal(reference.deployment_ownership, 'original_project');
  assert.equal(planAdoption(root, 'act_123', source, { apply: true }).status, 'no_change');
  assert.equal(planAdoption(root, 'act_123', saved.directory).status, 'no_change');
});

test('adoption requires a revised plan after source changes and refuses mixed ownership and symlinked assets', t => {
  const { temporary, root } = fixture(t); const saved = saveSnapshot(root, collection()); const source = operationalProject(temporary);
  const planned = planAdoption(root, 'act_123', source); fs.appendFileSync(path.join(source, 'NOTES.md'), 'New decision.\n');
  assert.throws(() => planAdoption(root, 'act_123', source, { apply: true }), /source changed or reviewed adoption plan is missing/);
  const revised = planAdoption(root, 'act_123', source); assert.notEqual(planned.plan_id, revised.plan_id);
  planAdoption(root, 'act_123', source, { apply: true });
  const stateFile = path.join(source, '.meta-state.json'), original = fs.readFileSync(stateFile, 'utf8');
  for (const mutation of [
    value => { value.ad_account_id = 'act_999'; },
    value => { delete value.ad_account_id; },
    value => { value.identity = { ad_account_id: 'act_999' }; },
    value => { value._meta = { identity: { account_id: '999' } }; },
  ]) { const value = JSON.parse(original); mutation(value); fs.writeFileSync(stateFile, JSON.stringify(value)); assert.throws(() => planAdoption(root, 'act_123', source)); }
  fs.writeFileSync(stateFile, original);
  const outside = path.join(temporary, 'outside.png'); fs.writeFileSync(outside, 'unselected external media'); fs.symlinkSync(outside, path.join(source, 'media/linked.png'));
  assert.throws(() => planAdoption(root, 'act_123', source), /symlink/);
  assert.equal(read(path.join(saved.directory, 'operational-references.json')).references.length, 1);
});

test('adoption refuses conflicting account scopes in selected campaign and memory JSON before persisting references', t => {
  const { temporary, root } = fixture(t); const saved = saveSnapshot(root, collection()); const source = operationalProject(temporary);
  fs.mkdirSync(path.join(source, 'memory')); fs.mkdirSync(path.join(source, 'campaigns'));
  const memory = path.join(source, 'memory/ads-memory.json'), campaign = path.join(source, 'campaigns/selected.json');
  fs.writeFileSync(memory, JSON.stringify({ unit_economics: { scope: { ad_account_id: 'act_999', currency: 'USD' } } }));
  assert.throws(() => planAdoption(root, 'act_123', source), /conflicting account ownership in memory\/ads-memory.json/);
  assert.throws(() => planAdoption(root, 'act_123', source, { apply: true }), /conflicting account ownership/);
  assert.equal(fs.existsSync(path.join(saved.directory, 'adoption')), false);
  assert.equal(fs.existsSync(path.join(saved.directory, 'operational-references.json')), false);
  fs.writeFileSync(memory, JSON.stringify({ observations: [{ scope: { ad_account_id: 'act_123' } }] }));
  fs.writeFileSync(campaign, JSON.stringify({ campaign: { name: 'Selected draft' }, _meta: { identity: { account_id: '999' } } }));
  assert.throws(() => planAdoption(root, 'act_123', source), /conflicting account ownership in campaigns\/selected.json/);
  fs.writeFileSync(campaign, JSON.stringify({ campaign: { name: 'Selected draft' }, _meta: { identity: { account_id: '123' } } }));
  const planned = planAdoption(root, 'act_123', source); assert.equal(planned.status, 'planned');
  assert.equal(planAdoption(root, 'act_123', source, { apply: true }).status, 'complete');
  fs.writeFileSync(memory, JSON.stringify({ observations: [{ scope: { ad_account_id: 'act_999' } }] }));
  assert.throws(() => planAdoption(root, 'act_123', source, { apply: true }), /conflicting account ownership/);
  assert.equal(read(path.join(saved.directory, 'operational-references.json')).references[0].plan_id, planned.plan_id);
});

test('explicit registration reuses an initialized legacy account folder without rewriting operational files', t => {
  const { root } = fixture(t); ensureRoot(root); const source = operationalProject(root, 'act_123--old-name');
  const paths = ['brand.json', '.meta-state.json', 'NOTES.md', 'media/image.png', '.env'];
  const before = Object.fromEntries(paths.map(relative => [relative, fs.readFileSync(path.join(source, relative), 'utf8')]));
  const account = collection('123', 'Remote renamed account').account;
  const registered = registerExisting(root, account, source); assert.equal(registered.status, 'registered');
  const saved = saveSnapshot(root, collection('123', 'Remote renamed account')); assert.equal(saved.directory, source);
  assert.equal(registerExisting(root, account, source).status, 'no_change');
  for (const relative of paths) assert.equal(fs.readFileSync(path.join(source, relative), 'utf8'), before[relative]);
  assert.equal(listLocalAccounts(root)[0].directory, 'act_123--old-name');
  assert.equal(read(path.join(source, 'registration.json')).deployment_ownership, 'same_original_directory');
  assert.equal(fs.existsSync(path.join(root, 'act_123--remote-renamed-account')), false);
});

test('unregistered old-name and multiple account folders require explicit selection before allocation', t => {
  const { root } = fixture(t); ensureRoot(root); const old = operationalProject(root, 'act_123--old-name');
  assert.throws(() => saveSnapshot(root, collection('123', 'New remote name')), /explicitly selected existing directory/);
  const another = operationalProject(root, 'act_123--another-name');
  assert.throws(() => saveSnapshot(root, collection()), /explicitly selected existing directory/);
  assert.equal(fs.existsSync(path.join(root, 'act_123--example-account')), false);
  registerExisting(root, collection().account, old); assert.equal(saveSnapshot(root, collection()).directory, old);
  assert.throws(() => registerExisting(root, collection().account, another), /different registered directory/);
  assert.equal(fs.existsSync(path.join(another, 'account.json')), false);
});

test('legacy registration rejects external, mixed-account, linked and unknown generated input without replacing originals', t => {
  const { temporary, root } = fixture(t); ensureRoot(root);
  const outside = operationalProject(temporary); assert.throws(() => registerExisting(root, collection().account, outside), /relative workspace path/);
  const source = operationalProject(root, 'act_123--legacy'), stateFile = path.join(source, '.meta-state.json'), state = fs.readFileSync(stateFile, 'utf8');
  const wrong = JSON.parse(state); wrong._meta = { identity: { account_id: '999' } }; fs.writeFileSync(stateFile, JSON.stringify(wrong));
  assert.throws(() => registerExisting(root, collection().account, source), /conflicting account ownership/);
  fs.writeFileSync(stateFile, state); fs.mkdirSync(path.join(source, 'memory'));
  const memory = path.join(source, 'memory/ads-memory.json'); fs.writeFileSync(memory, JSON.stringify({ unit_economics: { scope: { ad_account_id: 'act_999' } } }));
  assert.throws(() => registerExisting(root, collection().account, source), /conflicting account ownership/);
  fs.writeFileSync(memory, '{}'); fs.writeFileSync(path.join(source, 'sync.json'), '{unrecognized old report}');
  assert.throws(() => registerExisting(root, collection().account, source), /generated reporting artifact/);
  assert.equal(fs.readFileSync(path.join(source, 'sync.json'), 'utf8'), '{unrecognized old report}'); fs.unlinkSync(path.join(source, 'sync.json'));
  fs.symlinkSync(path.join(outside, 'media/image.png'), path.join(source, 'media/linked.png'));
  assert.throws(() => registerExisting(root, collection().account, source), /symlink/);
  assert.equal(fs.existsSync(path.join(source, 'account.json')), false); assert.equal(listLocalAccounts(root).length, 0);
  assert.equal(fs.readFileSync(stateFile, 'utf8'), state);
});

test('exact requested and required inventory field maps pin collection and failed-request scopes', t => {
  const { root } = fixture(t); const value = collection();
  value.scope.inventory_fields = { campaigns: ['id', 'account_id', 'name'] };
  value.scope.required_inventory_fields = { campaigns: ['id', 'account_id'] };
  const first = saveSnapshot(root, value);
  const reordered = structuredClone(value); reordered.scope.inventory_fields.campaigns.reverse();
  assert.equal(saveSnapshot(root, reordered).scope_key, first.scope_key);
  const failed = recordFailure(root, 'act_123', value.scope, 'offline failure'); assert.equal(failed.scope_key, first.scope_key);
  const changed = structuredClone(value); changed.scope.inventory_fields.campaigns.push('status');
  assert.notEqual(saveSnapshot(root, changed).scope_key, first.scope_key);
  const required = structuredClone(value); required.scope.required_inventory_fields.campaigns.push('name');
  assert.notEqual(saveSnapshot(root, required).scope_key, first.scope_key);
  const missing = structuredClone(required); delete missing.resources.campaigns.rows[0].name;
  assert.throws(() => validateCollection(missing), /missing required inventory field: name/);
  const wrongRequest = { ...value.scope, required_inventory_fields: { campaigns: ['id'] } };
  assert.equal(recordFailure(root, 'act_123', wrongRequest, 'different required fields').matched_scope, false);
  const invalid = structuredClone(value); invalid.scope.required_inventory_fields.campaigns.push('unknown_field');
  assert.throws(() => validateCollection(invalid), /outside requested inventory fields/);
});
