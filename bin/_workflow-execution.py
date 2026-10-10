"""Trusted local behavioral oracle for ai-workflow-eval; stdlib only."""
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import signal
import sqlite3
import subprocess
import sys
import time
from urllib.error import HTTPError
from urllib.request import Request, build_opener, ProxyHandler

FIXTURE_ID = 'order-note-v1'
FILES = ('app.py', 'index.html', 'README.md')
SEEDS = [(101, 'tenant-alpha', 'alpha-original'),
         (202, 'tenant-beta', 'beta-private'), (303, 'tenant-alpha', 'alpha-collateral')]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def export_fixture(root, destination, reference=False):
    source = root / 'config/ai/evals/execution'
    destination = destination.absolute()
    if destination.exists() or destination.is_symlink():
        raise ValueError('fixture destination must be fresh; existing files are preserved')
    destination.mkdir(parents=True)
    for name in FILES:
        shutil.copyfile(source / name, destination / name)
    if not reference:
        path = destination / 'app.py'
        text = path.read_text()
        original = "WHERE id = ? AND tenant = ?',\n                      (order_id, tenant)"
        if text.count(original) != 1:
            raise ValueError('trusted fixture defect injection no longer matches')
        path.write_text(text.replace(original, "WHERE id = ?',\n                      (order_id,)", 1))
    marker = {'schemaVersion': 1, 'fixtureId': FIXTURE_ID,
              'exportMode': 'reference' if reference else 'repair',
              'sourceHashes': {name: digest(source / name) for name in FILES}}
    (destination / '.workflow-fixture.json').write_text(json.dumps(marker, indent=2) + '\n')
    return {'fixture': str(destination.resolve()), 'mode': marker['exportMode'],
            'instruction': 'Read README.md. Only app.py and index.html are repair targets.'}


def validate_candidate(root, candidate):
    candidate = candidate.resolve(strict=True)
    for name in (*FILES, '.workflow-fixture.json'):
        path = candidate / name
        if path.is_symlink() or not path.is_file() or path.stat().st_size > 1024 * 1024:
            raise ValueError(f'expected bounded regular fixture file: {name}')
    marker = json.loads((candidate / '.workflow-fixture.json').read_text())
    source = root / 'config/ai/evals/execution'
    if (marker.get('schemaVersion') != 1 or marker.get('fixtureId') != FIXTURE_ID
            or marker.get('sourceHashes') != {name: digest(source / name) for name in FILES}
            or digest(candidate / 'README.md') != digest(source / 'README.md')):
        raise ValueError('fixture contract/revision mismatch; export a fresh fixture')
    return candidate, {name: digest(candidate / name) for name in (*FILES, '.workflow-fixture.json')}


def seed_database(path):
    with sqlite3.connect(path) as db:
        db.executescript('''
          CREATE TABLE orders(id INTEGER PRIMARY KEY, tenant TEXT NOT NULL, note TEXT NOT NULL);
          CREATE TABLE audit(order_id INTEGER NOT NULL, note TEXT NOT NULL);
          CREATE TRIGGER reject_blocked_audit BEFORE INSERT ON audit
          WHEN NEW.note = 'blocked-write' BEGIN SELECT RAISE(FAIL, 'synthetic write failure'); END;
        ''')
        db.executemany('INSERT INTO orders VALUES (?, ?, ?)', SEEDS)


def snapshot(path):
    # New independent connection for every assertion, never the app's connection.
    with sqlite3.connect(path, timeout=2) as db:
        return {'orders': db.execute('SELECT id, tenant, note FROM orders ORDER BY id').fetchall(),
                'audit': db.execute('SELECT order_id, note FROM audit ORDER BY rowid').fetchall()}


def require(condition, message):
    if not condition:
        raise AssertionError(message)


def browser_outcome(browser, code, out):
    if not isinstance(browser, dict):
        return 'FAIL'
    status = browser.get('status')
    if status not in ('PASS', 'FAIL', 'UNVERIFIED') or code != {'PASS': 0, 'FAIL': 1, 'UNVERIFIED': 2}.get(status):
        return 'FAIL'
    if status == 'PASS':
        checks = browser.get('checks', [])
        expected = {'initial API value rendered', 'native input and click save',
                    'successful save persists across navigation', 'failed write has actionable visible error',
                    'failed write retains input', 'failed write allows retry',
                    'failed write leaves persisted value unchanged', 'no horizontal overflow at 390px',
                    'no horizontal overflow at 1280px', 'deliberate failed write returned HTTP 503',
                    'no runtime exceptions', 'no console errors', 'no unexpected network failures'}
        if (not isinstance(checks, list) or not checks or any(not isinstance(c, dict) or c.get('status') != 'PASS' for c in checks)
                or not expected <= {c.get('name') for c in checks}
                or not browser.get('browserVersion') or browser.get('screenshots') != ['390.png', '1280.png']):
            return 'FAIL'
        for name in browser['screenshots']:
            path = out / name
            if not path.is_file() or path.is_symlink():
                return 'FAIL'
            with path.open('rb') as capture:
                magic = capture.read(8)
            if magic != b'\x89PNG\r\n\x1a\n':
                return 'FAIL'
    return status


def minimal_env():
    return {key: value for key, value in os.environ.items()
            if key in ('PATH', 'HOME', 'LANG', 'TMPDIR', 'CHROME_BIN')}


def stop(process):
    if process is not None and process.poll() is None:
        try:
            os.killpg(process.pid, signal.SIGTERM)
        except ProcessLookupError:
            pass
        try:
            process.wait(timeout=3)
        except subprocess.TimeoutExpired:
            os.killpg(process.pid, signal.SIGKILL)
            process.wait(timeout=3)


def start_app(candidate, database, out, number):
    ready = out / f'ready-{number}.json'
    log = (out / f'app-{number}.log').open('wb')
    process = subprocess.Popen([sys.executable, '-B', str(candidate / 'app.py'),
                                '--db', str(database), '--ready', str(ready)],
                               cwd=candidate, env=minimal_env(), stdout=log, stderr=log,
                               start_new_session=True)
    log.close()
    try:
        deadline = time.monotonic() + 8
        while time.monotonic() < deadline and process.poll() is None:
            if ready.exists():
                origin = json.loads(ready.read_text()).get('origin', '')
                match = re.fullmatch(r'http://127\.0\.0\.1:([0-9]{1,5})', origin)
                require(match is not None and 0 < int(match[1]) < 65536, 'app must bind numeric loopback')
                return process, origin
            time.sleep(.05)
        raise RuntimeError('app did not become ready within 8 seconds; inspect local app log')
    except BaseException:
        stop(process)
        raise


def api_checks(origin, database, record):
    opener = build_opener(ProxyHandler({}))

    def request(method, path, body=None, session='alpha-session', headers=None):
        data = body if isinstance(body, bytes) else json.dumps(body).encode() if body is not None else None
        actual_headers = {'Content-Type': 'application/json', **(headers or {})}
        if session is not None:
            actual_headers['Cookie'] = 'session=' + session
        req = Request(origin + path, data=data, method=method, headers=actual_headers)
        try:
            response = opener.open(req, timeout=3)
        except HTTPError as exc:
            response = exc
        with response:
            raw = response.read(16385)
            require(len(raw) <= 16384, 'bounded API response required')
            return response.status, json.loads(raw)

    def denied(method, path, status, body=None, **kwargs):
        before = snapshot(database)
        actual, payload = request(method, path, body, **kwargs)
        require(actual == status, f'expected HTTP {status}, got {actual}')
        require('note' not in payload and 'beta-private' not in json.dumps(payload), 'foreign data leaked')
        require(snapshot(database) == before, 'rejected request changed persistent state')

    def own_read():
        require(request('GET', '/api/orders/101') == (200, {'id': 101, 'note': 'alpha-original'}), 'own read mismatch')
        require(request('GET', '/api/orders/202', session='beta-session') == (200, {'id': 202, 'note': 'beta-private'}), 'beta membership mismatch')

    record('own-read', own_read)
    record('foreign-read', lambda: denied('GET', '/api/orders/202', 404))
    record('foreign-write', lambda: denied('PATCH', '/api/orders/202', 404, {'note': 'stolen'}))
    record('spoof-query', lambda: denied('PATCH', '/api/orders/202?tenant=tenant-beta', 404, {'note': 'stolen'}))
    record('spoof-header', lambda: denied('PATCH', '/api/orders/202', 404, {'note': 'stolen'}, headers={'X-Tenant': 'tenant-beta'}))
    record('spoof-body', lambda: denied('PATCH', '/api/orders/202', 422, {'note': 'stolen', 'tenant': 'tenant-beta'}))
    record('missing-order', lambda: denied('PATCH', '/api/orders/999', 404, {'note': 'missing'}))
    for session in (None, 'unknown-session'):
        label = 'missing' if session is None else 'invalid'
        record(f'{label}-session-read', lambda s=session: denied('GET', '/api/orders/101', 401, session=s))
        record(f'{label}-session-write', lambda s=session: denied('PATCH', '/api/orders/101', 401, {'note': 'bad'}, session=s))
    for label, body, status in [('json', b'{bad', 400), ('type', {'note': 1}, 422),
                                ('shape', [], 422), ('empty', {'note': ''}, 422),
                                ('long', {'note': 'a' * 201}, 422), ('size', b'x' * 4097, 413)]:
        record(f'invalid-{label}', lambda b=body, s=status: denied('PATCH', '/api/orders/101', s, b))

    def save():
        require(request('PATCH', '/api/orders/101', {'note': 'api-saved'}) == (200, {'id': 101, 'note': 'api-saved'}), 'save response mismatch')
        state = snapshot(database)
        require(state['orders'] == [(101, 'tenant-alpha', 'api-saved'), *SEEDS[1:]], 'write missing or collateral mutation')
        require(state['audit'] == [(101, 'api-saved')], 'audit missing or non-atomic')
        require(request('GET', '/api/orders/101') == (200, {'id': 101, 'note': 'api-saved'}), 'fresh GET lost saved note')

    record('own-write-persistence', save)
    record('write-failure-rollback', lambda: denied('PATCH', '/api/orders/101', 503, {'note': 'blocked-write'}))


def execute(root, args):
    candidate, before_hashes = validate_candidate(root, args.directory)
    out = args.out.absolute()
    if out.exists() or out.is_symlink() or out.resolve().is_relative_to(candidate):
        raise ValueError('evidence directory must be fresh and outside the candidate')
    out.mkdir(parents=True)
    out = out.resolve()
    database = out / 'state.sqlite'
    seed_database(database)
    report = {'schemaVersion': 1, 'fixtureId': FIXTURE_ID, 'behaviorResult': 'UNVERIFIED',
              'provenance': {'runtime': args.runtime, 'model': args.model,
                             'python': sys.version.split()[0], 'mode': 'local-execution'},
              'candidateHashes': before_hashes,
              'oracleHashes': {str(path.relative_to(root)): digest(path) for path in
                              [root / 'bin/_workflow-execution.py', root / 'bin/ai-workflow-eval',
                               *sorted((root / 'config/ai/evals/execution').glob('*')),
                               root / 'skills/local/design-taste/scripts/ui-ref.mjs'] if path.is_file()},
              'checks': [], 'limitations': 'Synthetic authorized code on loopback; not an OS sandbox, production-auth review, or general model benchmark.'}

    def record(name, fn):
        try:
            fn()
            report['checks'].append({'id': name, 'result': 'PASS'})
        except (AssertionError, OSError, ValueError, RuntimeError, sqlite3.Error) as exc:
            report['checks'].append({'id': name, 'result': 'FAIL', 'detail': str(exc)[:500]})

    process = browser_process = None
    try:
        process, origin = start_app(candidate, database, out, 1)
        api_checks(origin, database, record)
        stop(process); process = None
        process, origin = start_app(candidate, database, out, 2)

        def restart_check():
            state = snapshot(database)
            require(state == {'orders': [(101, 'tenant-alpha', 'api-saved'), *SEEDS[1:]],
                              'audit': [(101, 'api-saved')]}, 'persistence/rollback failed after restart')
            opener = build_opener(ProxyHandler({}))
            with opener.open(Request(origin + '/api/orders/101', headers={'Cookie': 'session=alpha-session'}), timeout=3) as response:
                require(json.load(response) == {'id': 101, 'note': 'api-saved'}, 'restart GET mismatch')

        record('restart-persistence', restart_check)
        browser_report = out / 'browser-report.json'
        if args.api_only:
            report['checks'].append({'id': 'browser-journey', 'result': 'UNVERIFIED', 'detail': '--api-only requested'})
        elif shutil.which('node') is None:
            report['checks'].append({'id': 'browser-journey', 'result': 'UNVERIFIED', 'detail': 'Node is unavailable'})
        else:
            with (out / 'browser.log').open('wb') as log:
                browser_process = subprocess.Popen(['node', str(root / 'config/ai/evals/execution/browser.mjs'),
                                                    '--origin', origin, '--out', str(out)],
                                                   env=minimal_env(), stdout=log, stderr=log, start_new_session=True)
                try:
                    code = browser_process.wait(timeout=90)
                except subprocess.TimeoutExpired:
                    stop(browser_process)
                    code = 1
            if browser_report.exists():
                browser = json.loads(browser_report.read_text())
                report['browser'] = browser
                outcome = browser_outcome(browser, code, out)
            else:
                outcome = 'UNVERIFIED' if code in (2, 3) else 'FAIL'
            report['checks'].append({'id': 'browser-journey', 'result': outcome, 'exitCode': code})
            if outcome == 'PASS':
                def browser_db():
                    state = snapshot(database)
                    require(state['orders'] == [(101, 'tenant-alpha', 'browser-saved'), *SEEDS[1:]], 'browser write/rollback not persisted independently')
                    require(state['audit'] == [(101, 'api-saved'), (101, 'browser-saved')], 'browser audit transaction mismatch')
                record('browser-database', browser_db)
    except (OSError, ValueError, RuntimeError, AssertionError, sqlite3.Error) as exc:
        report['checks'].append({'id': 'execution-infrastructure', 'result': 'FAIL', 'detail': str(exc)[:500]})
    finally:
        stop(browser_process)
        stop(process)
    record('candidate-unchanged', lambda: require(validate_candidate(root, candidate)[1] == before_hashes, 'candidate changed while running'))
    statuses = {check['result'] for check in report['checks']}
    report['behaviorResult'] = 'FAIL' if 'FAIL' in statuses else 'UNVERIFIED' if 'UNVERIFIED' in statuses else 'PASS'
    try:
        report['databaseState'] = snapshot(database)
    except sqlite3.Error as exc:
        report['checks'].append({'id': 'final-database', 'result': 'FAIL', 'detail': str(exc)[:500]})
        report['behaviorResult'] = 'FAIL'
    (out / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    return {'behaviorResult': report['behaviorResult'], 'report': str(out / 'report.json'),
            'checks': len(report['checks'])}, {'PASS': 0, 'FAIL': 1, 'UNVERIFIED': 2}[report['behaviorResult']]
