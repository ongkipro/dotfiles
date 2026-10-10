"""Synthetic local evaluation app. Public fake sessions; never production auth."""
import argparse
from contextlib import closing
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import re
import sqlite3

SESSIONS = {'alpha-session': 'tenant-alpha', 'beta-session': 'tenant-beta'}


def owned_order(db, order_id, tenant):
    return db.execute('SELECT id, note FROM orders WHERE id = ? AND tenant = ?',
                      (order_id, tenant)).fetchone()


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def respond(self, status, data, content_type='application/json'):
        body = data if isinstance(data, bytes) else json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(body)

    def context(self):
        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get('Cookie', ''))
            tenant = SESSIONS.get(cookie['session'].value) if 'session' in cookie else None
        except Exception:
            tenant = None
        if not tenant:
            self.respond(401, {'error': 'Unauthorized'})
            return None
        match = re.fullmatch(r'/api/orders/(\d+)', self.path.split('?', 1)[0])
        if not match:
            self.respond(404, {'error': 'Not found'})
            return None
        return int(match[1]), tenant

    def do_GET(self):
        if self.path == '/':
            self.respond(200, Path(__file__).with_name('index.html').read_bytes(), 'text/html; charset=utf-8')
            return
        if self.path == '/favicon.ico':
            self.respond(204, b'')
            return
        context = self.context()
        if context is None:
            return
        with closing(sqlite3.connect(self.server.db_path)) as db:
            row = owned_order(db, *context)
        self.respond(200, {'id': row[0], 'note': row[1]}) if row else self.respond(404, {'error': 'Not found'})

    def do_PATCH(self):
        context = self.context()
        if context is None:
            return
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 4096:
                self.respond(413, {'error': 'Request too large or empty'})
                return
            payload = json.loads(self.rfile.read(length))
            if (not isinstance(payload, dict) or set(payload) != {'note'}
                    or not isinstance(payload['note'], str) or not 1 <= len(payload['note']) <= 200):
                self.respond(422, {'error': 'Use a note of 1 to 200 characters'})
                return
        except (ValueError, UnicodeError):
            self.respond(400, {'error': 'Invalid JSON'})
            return
        with closing(sqlite3.connect(self.server.db_path)) as db:
            if not owned_order(db, *context):
                self.respond(404, {'error': 'Not found'})
                return
            try:
                db.execute('UPDATE orders SET note = ? WHERE id = ?', (payload['note'], context[0]))
                db.execute('INSERT INTO audit(order_id, note) VALUES (?, ?)', (context[0], payload['note']))
                db.commit()
            except sqlite3.Error:
                db.rollback()
                self.respond(503, {'error': 'Could not save. Try again.'})
                return
        self.respond(200, {'id': context[0], 'note': payload['note']})


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--db', type=Path, required=True)
    parser.add_argument('--ready', type=Path, required=True)
    args = parser.parse_args()
    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    server.db_path = args.db
    args.ready.write_text(json.dumps({'origin': f'http://127.0.0.1:{server.server_port}'}))
    server.serve_forever()


if __name__ == '__main__':
    main()
