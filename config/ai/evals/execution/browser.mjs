#!/usr/bin/env node
// Exercise only the synthetic loopback execution fixture, never a live app.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { withBrowser } from '../../../../skills/local/design-taste/scripts/ui-ref.mjs';

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const origin = opt('--origin'), outArg = opt('--out');
if (args.length !== 4 || !origin || !outArg || !/^http:\/\/127\.0\.0\.1:[1-9][0-9]{0,4}$/.test(origin) || Number(new URL(origin).port) > 65535) {
  console.error('Usage: browser.mjs --origin http://127.0.0.1:PORT --out DIR');
  process.exit(2);
}
const out = resolve(outArg);
mkdirSync(out, { recursive: true });
const report = { status: 'FAIL', checks: [], screenshots: [], browserVersion: null,
  console: [], exceptions: [], network: [], exclusion: 'Only HTTP 503 for PATCH /api/orders/101 with JSON note=blocked-write, correlated by requestId. No other console, runtime, or network errors are excluded.' };
const saveReport = () => writeFileSync(join(out, 'browser-report.json'), JSON.stringify(report, null, 2) + '\n');
const check = (name, ok, detail = '') => {
  report.checks.push({ name, status: ok ? 'PASS' : 'FAIL', detail });
  if (!ok) throw new Error(name + (detail ? ': ' + detail : ''));
};
// Includes browser discovery. The transport's SIGTERM handler reaps its owned
// process groups and removes scratch profiles; it never uses an existing session.
const watchdog = setTimeout(() => {
  report.status = 'FAIL'; report.checks.push({ name: 'runner deadline', status: 'FAIL', detail: '120 seconds exceeded' });
  saveReport(); process.kill(process.pid, 'SIGTERM');
}, 120000);
watchdog.unref();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
// Feedback needs to be rendered, including when an ancestor hides its subtree.
const visible = `(element) => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0 || rect.bottom <= 0 || rect.right <= 0
      || rect.top >= innerHeight || rect.left >= innerWidth) return false;
  for (let node = element; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.display === 'none' || style.visibility !== 'visible'
        || Number(style.opacity) <= 0 || style.contentVisibility === 'hidden') return false;
  }
  return true;
}`;
const deadline = (promise, ms = 8000) => {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('CDP command deadline exceeded')), ms); })]).finally(() => clearTimeout(timer));
};
try {
  await withBrowser(async browser => {
    const send = (method, params) => deadline(browser.send(method, params));
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error('Browser evaluation failed');
      return result.result.value;
    };
    const wait = async (expression, name) => {
      const until = Date.now() + 10000;
      while (Date.now() < until) {
        if (await evaluate(expression)) return;
        await sleep(100); // Condition polling, not a fixed page-load delay.
      }
      throw new Error(name + ' did not become visible within 10 seconds');
    };
    const requests = new Map();
    const unsubscribe = browser.on(event => {
      const p = event.params || {};
      if (event.method === 'Runtime.exceptionThrown') report.exceptions.push({ text: p.exceptionDetails?.text || 'Runtime exception' });
      if (event.method === 'Runtime.consoleAPICalled' && p.type === 'error') report.console.push({ type: p.type, message: (p.args || []).map(a => String(a.value ?? a.description ?? '')).join(' ').slice(0, 500) });
      if (event.method === 'Network.requestWillBeSent') {
        let blocked = false;
        try { blocked = JSON.parse(p.request.postData || '{}').note === 'blocked-write'; } catch {}
        requests.set(p.requestId, { path: new URL(p.request.url).pathname, method: p.request.method, blocked });
      }
      if (event.method === 'Network.responseReceived' && p.response.status >= 400) {
        const request = requests.get(p.requestId) || {};
        report.network.push({ kind: 'response', path: request.path, method: request.method, status: p.response.status,
          expected: p.response.status === 503 && request.path === '/api/orders/101' && request.method === 'PATCH' && request.blocked === true });
      }
      if (event.method === 'Network.loadingFailed') report.network.push({ kind: 'failure', path: requests.get(p.requestId)?.path, error: p.errorText, expected: false });
    });
    try {
      report.browserVersion = (await send('Browser.getVersion')).product;
      await send('Runtime.enable'); await send('Network.enable');
      await send('Network.setCookie', { name: 'session', value: 'alpha-session', url: origin, httpOnly: true, sameSite: 'Lax' });
      await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
      const navigate = async () => {
        const loaded = browser.once('Page.loadEventFired', 8000);
        const result = await send('Page.navigate', { url: origin + '/' });
        if (result.errorText) throw new Error('Navigation failed: ' + result.errorText);
        if (!await deadline(loaded)) throw new Error('Page load deadline exceeded');
      };
      const input = async value => {
        const doc = await send('DOM.getDocument');
        const node = await send('DOM.querySelector', { nodeId: doc.root.nodeId, selector: '#note' });
        if (!node.nodeId) throw new Error('Missing note input');
        await send('DOM.focus', { nodeId: node.nodeId });
        const modifiers = process.platform === 'darwin' ? 4 : 2;
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', code: 'KeyA', modifiers, commands: ['selectAll'] });
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', code: 'KeyA', modifiers });
        await send('Input.insertText', { text: value });
      };
      const click = async () => {
        const point = await evaluate(`(() => { const e = document.querySelector('#save'); if (!e) return null; e.scrollIntoView({block:'center'}); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })()`);
        if (!point) throw new Error('Missing save button');
        await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...point, button: 'left', clickCount: 1 });
        await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...point, button: 'left', clickCount: 1 });
      };
      await navigate();
      await wait(`document.querySelector('#note')?.value === 'api-saved'`, 'initial API value');
      check('initial API value rendered', true);
      await input('browser-saved'); await click();
      await wait(`document.querySelector('#status')?.textContent.trim() === 'Saved'`, 'save confirmation');
      check('native input and click save', await evaluate(`(() => {const e=document.querySelector('#status');return e?.getAttribute('role')==='status' && (${visible})(e);})()`));
      await navigate();
      await wait(`document.querySelector('#note')?.value === 'browser-saved'`, 'persisted saved value');
      check('successful save persists across navigation', true);
      await input('blocked-write'); await click();
      await wait(`document.querySelector('#error')?.textContent.trim() === 'Could not save. Try again.'`, 'actionable error');
      check('failed write has actionable visible error', await evaluate(`(() => {const e=document.querySelector('#error');return e?.getAttribute('role')==='alert' && (${visible})(e);})()`));
      check('failed write retains input', await evaluate(`document.querySelector('#note').value === 'blocked-write'`));
      check('failed write allows retry', await evaluate(`!document.querySelector('#save').disabled && !document.querySelector('#note').disabled`));
      await navigate();
      await wait(`document.querySelector('#note')?.value === 'browser-saved'`, 'unchanged persisted value');
      check('failed write leaves persisted value unchanged', true);
      for (const width of [390, 1280]) {
        await send('Emulation.setDeviceMetricsOverride', { width, height: 844, deviceScaleFactor: 1, mobile: width === 390 });
        check(`no horizontal overflow at ${width}px`, await evaluate('document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1'));
        const screenshot = await send('Page.captureScreenshot', { format: 'png' });
        const filename = `${width}.png`; writeFileSync(join(out, filename), Buffer.from(screenshot.data, 'base64')); report.screenshots.push(filename);
      }
      check('deliberate failed write returned HTTP 503', report.network.some(e => e.expected));
      check('no runtime exceptions', report.exceptions.length === 0);
      check('no console errors', report.console.length === 0);
      check('no unexpected network failures', report.network.every(e => e.expected));
      report.status = 'PASS';
    } finally { unsubscribe(); }
  }, { throwOnUnavailable: true });
} catch (error) {
  report.status = error.code === 'BROWSER_UNAVAILABLE' ? 'UNVERIFIED' : 'FAIL';
  report.checks.push({ name: 'browser execution', status: report.status === 'UNVERIFIED' ? 'UNVERIFIED' : 'FAIL', detail: error.message });
} finally { clearTimeout(watchdog); saveReport(); }
console.log(`browser-execution: ${report.status}`);
process.exitCode = report.status === 'PASS' ? 0 : report.status === 'UNVERIFIED' ? 2 : 1;
