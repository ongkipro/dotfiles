#!/usr/bin/env node
// ui-ref — measure a reference page and compare a build against it (TASK-103).
//
// Eyeballing a reference is where "close enough" turns into generic layout and
// drifted type. This records what the reference actually renders — section
// geometry, column structure, type scale, palette, radii — at fixed viewports,
// then measures a build against the same numbers. No dependencies: Node 22+
// talks to an installed Chrome/Chromium over the DevTools protocol.
//
//   node ui-ref.mjs capture URL --out DIR [--viewports 390,768,1440]
//   node ui-ref.mjs compare REF_DIR URL --out DIR
//
// capture writes DIR/ref.json and DIR/<width>.png. compare captures URL the
// same way into DIR, then writes DIR/report.md and DIR/report.json; exit 1 when
// any finding exceeds its threshold, 0 when within tolerance.
// Read-only: it only loads pages. Chrome path: $CHROME_BIN or auto-detected.
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir, homedir } from "node:os";
import { createServer } from "node:http";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const die = (m, code = 2) => { console.error(`ui-ref: ${m}`); process.exit(code); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Page.navigate only answers once the request commits, so a browser whose
// network stalls would wait forever; every navigation is raced against a clock.
const within = (p, ms) => Promise.race([p, sleep(ms).then(() => null)]);

function chromeCandidates() {
  const c = [process.env.CHROME_BIN, "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium", "/usr/bin/chromium-browser", "/snap/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium"];
  const pw = join(homedir(), ".cache", "ms-playwright");
  if (existsSync(pw)) for (const d of readdirSync(pw).filter((d) => d.startsWith("chromium-")).sort().reverse())
    c.push(join(pw, d, "chrome-linux64", "chrome"), join(pw, d, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"));
  return [...new Set(c.filter((p) => p && existsSync(p)))];
}

// Start one browser and return a minimal CDP client. A snap browser has a
// private /tmp, so its profile must live under ~/snap/<name>/common.
async function launch(bin) {
  const base = bin.includes("/snap/") ? join(homedir(), "snap", "chromium", "common") : tmpdir();
  mkdirSync(base, { recursive: true });
  const profile = mkdtempSync(join(base, "ui-ref-"));
  const proc = spawn(bin, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
    "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "--mute-audio",
    "--disable-extensions", "about:blank"], { stdio: "ignore", detached: true });
  // Own process group, so renderer and GPU children die with the browser.
  const close = async () => {
    try { process.kill(-proc.pid, "SIGKILL"); } catch { try { proc.kill("SIGKILL"); } catch {} }
    await sleep(200); rmSync(profile, { recursive: true, force: true });
    live.delete(close);
  };
  live.add(close);
  try {
    let port;
    for (let i = 0; i < 100 && !port; i++) {
      await sleep(100);
      const f = join(profile, "DevToolsActivePort");
      if (existsSync(f)) port = readFileSync(f, "utf8").split("\n")[0];
    }
    if (!port) throw new Error("no DevTools port");
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
    const opened = await within(new Promise((res, rej) => { ws.onopen = () => res(true); ws.onerror = rej; }), 10000);
    if (!opened) throw new Error("DevTools WebSocket did not open");
    let id = 0; const pending = new Map(); const waiters = []; const listeners = new Set();
    ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
      else if (m.method) {
        for (const listener of listeners) listener(m);
        for (const w of waiters.splice(0)) w(m);
      }
    };
    const send = (method, params = {}) => new Promise((res, rej) => { pending.set(++id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
    const once = (method, ms) => new Promise((res) => {
      const t = setTimeout(() => res(null), ms);
      const check = (m) => { if (m.method === method) { clearTimeout(t); res(m); } else waiters.push(check); };
      waiters.push(check);
    });
    await send("Page.enable");
    return { send, once, close, on(listener) { listeners.add(listener); return () => listeners.delete(listener); } };
  } catch (e) { await close(); throw e; }
}

// Browsers still running when the process is interrupted are killed on exit.
const live = new Set();
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, async () => { for (const c of [...live]) await c(); process.exit(130); });

// Some installs start fine but never load a network page (seen on Ubuntu with
// /opt Chrome and Playwright's Chromium while snap Chromium works). Probe each
// candidate against a local HTTP server and keep the first that loads it.
export async function withBrowser(fn, { throwOnUnavailable = false } = {}) {
  const server = createServer((_, res) => res.end("<title>ok</title>")).listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const probeUrl = `http://127.0.0.1:${server.address().port}/`;
  let browser, tried = [];
  // Remember the browser that worked so later runs skip the slow probe.
  const cache = join(homedir(), ".cache", "ui-ref", "browser");
  const cached = existsSync(cache) ? readFileSync(cache, "utf8").trim() : "";
  const order = [...new Set([process.env.CHROME_BIN, cached, ...chromeCandidates()].filter((p) => p && existsSync(p)))];
  try {
    for (const bin of order) {
      try {
        const b = await launch(bin);
        const loaded = b.once("Page.loadEventFired", 8000);
        await within(b.send("Page.navigate", { url: probeUrl }), 8000);
        if (await loaded) {
          browser = b;
          if (bin !== cached) { mkdirSync(join(homedir(), ".cache", "ui-ref"), { recursive: true }); writeFileSync(cache, bin); }
          break;
        }
        await b.close(); tried.push(`${bin} (no network load)`);
      } catch (e) { tried.push(`${bin} (${e.message})`); for (const c of [...live]) await c(); }
    }
  } finally { server.close(); }
  if (!browser) {
    const message = `no working Chrome/Chromium; tried: ${tried.join("; ") || "none found"}. Set CHROME_BIN.`;
    if (throwOnUnavailable) { const error = new Error(message); error.code = "BROWSER_UNAVAILABLE"; throw error; }
    die(message, 3);
  }
  try { return await fn(browser); } finally { await browser.close(); }
}

// Runs inside the page. Returns geometry and computed-style tallies only — no
// page text beyond short heading labels, no cookies or storage.
const EXTRACT = String.raw`(async () => {
  const H = () => document.documentElement.scrollHeight;
  // Bounded: infinite-scroll pages keep growing, so stop at 40 steps / 20000px.
  for (let y = 0, i = 0; y < Math.min(H(), 20000) && i < 40; y += innerHeight * 0.8, i++) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
  scrollTo(0, 0); await new Promise(r => setTimeout(r, 400));
  const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0; };
  const tally = (m, k, w = 1) => { if (k) m[k] = (m[k] || 0) + w; };
  const top = (m, n = 8) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n).map(([v, c]) => ({ v, c }));
  const fam = {}, size = {}, weight = {}, color = {}, bg = {}, radius = {}, roles = {};
  const els = [...document.body.querySelectorAll('*')].slice(0, 6000);
  const vw = innerWidth, area = innerWidth * innerHeight;
  for (const el of els) {
    if (!visible(el)) continue;
    const s = getComputedStyle(el), r = el.getBoundingClientRect();
    const ownText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (ownText) {
      const len = el.textContent.trim().length;
      tally(fam, s.fontFamily.split(',')[0].replace(/["']/g, '').trim(), len);
      tally(size, s.fontSize, len); tally(weight, s.fontWeight, len); tally(color, s.color, len);
      const tag = el.tagName.toLowerCase();
      const role = /^h[1-6]$/.test(tag) ? tag : tag === 'button' || el.getAttribute('role') === 'button' ? 'button' : tag === 'a' ? 'a' : tag === 'p' ? 'p' : null;
      if (role && !roles[role]) roles[role] = { size: s.fontSize, weight: s.fontWeight, lineHeight: s.lineHeight, letterSpacing: s.letterSpacing, family: s.fontFamily.split(',')[0].replace(/["']/g, '').trim(), transform: s.textTransform };
    }
    const b = s.backgroundColor;
    if (b && b !== 'rgba(0, 0, 0, 0)' && r.width * r.height > area * 0.01) tally(bg, b, r.width * r.height);
    if ((b !== 'rgba(0, 0, 0, 0)' || s.borderStyle !== 'none') && s.borderRadius !== '0px') tally(radius, s.borderTopLeftRadius);
  }
  // A transparent section shows whatever is behind it; record that colour.
  const effectiveBg = (el) => { for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor;
    if (c && !/rgba\(.*,\s*0\)$/.test(c) && c !== 'transparent') return c; } return 'rgb(255, 255, 255)'; };
  // Sections: descend through single full-width wrappers, then take blocks.
  let root = document.body;
  for (let i = 0; i < 4; i++) {
    const kids = [...root.children].filter(visible);
    // Descend only through a wrapper whose siblings are all negligible (e.g. a
    // framework root div); a header or footer beside <main> keeps us here.
    const real = kids.filter(k => k.getBoundingClientRect().height >= 40);
    if (real.length === 1) root = real[0]; else break;
  }
  // A lone <main> among header/footer is expanded in place so its sections count.
  const blocks = [...root.children].filter(visible).flatMap(el =>
    el.tagName === 'MAIN' && el.children.length > 1 ? [...el.children].filter(visible) : [el]);
  const sections = [];
  for (const el of blocks) {
    const r = el.getBoundingClientRect(); if (r.height < 40) continue;
    const s = getComputedStyle(el);
    // Columns: distinct left edges of content-sized children, searched two levels deep.
    // Columns = most content-sized children crossed by one horizontal line, so
    // staggered and masonry layouts count like aligned grids.
    let cols = 1;
    for (const c of [el, ...el.children].slice(0, 6)) {
      const boxes = [...c.children].filter(k => { const kr = k.getBoundingClientRect(); return visible(k) && kr.width > r.width * 0.12 && kr.width < r.width * 0.95; })
        .map(k => k.getBoundingClientRect());
      for (const b of boxes) {
        const y = b.top + b.height / 2;
        cols = Math.max(cols, Math.min(6, boxes.filter(o => o.top <= y && o.bottom >= y).length));
      }
    }
    const h = el.querySelector('h1,h2,h3');
    sections.push({ tag: el.tagName.toLowerCase(), y: Math.round(r.top + scrollY), h: Math.round(r.height),
      bg: effectiveBg(el), cols, imgs: el.querySelectorAll('img,picture,svg,video').length,
      heading: h ? { tag: h.tagName.toLowerCase(), size: getComputedStyle(h).fontSize, text: h.textContent.trim().slice(0, 50) } : null });
  }
  const headingMax = Math.max(0, ...[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(visible).map(h => parseFloat(getComputedStyle(h).fontSize)));
  return { url: location.href, width: vw, height: H(), title: document.title.slice(0, 80), headingMax,
    type: { families: top(fam, 4), sizes: top(size, 10), weights: top(weight, 5), roles },
    color: { text: top(color, 6), background: top(bg, 6) }, radius: top(radius, 6), sections };
})()`;

async function capture(url, out, widths) {
  mkdirSync(out, { recursive: true });
  const result = { capturedAt: new Date().toISOString(), viewports: {} };
  await withBrowser(async ({ send, once }) => {
    for (const w of widths) {
      await send("Emulation.setDeviceMetricsOverride", { width: w, height: w < 600 ? 844 : 900, deviceScaleFactor: 1, mobile: w < 600 });
      const loaded = once("Page.loadEventFired", 30000);
      await within(send("Page.navigate", { url }), 30000);
      if (!(await loaded)) process.stderr.write(`ui-ref: ${w}px load event not seen in 30s; measuring what rendered\n`);
      await sleep(800);
      process.stderr.write(`ui-ref: ${w}px loaded, measuring\n`);
      const { result: r, exceptionDetails } = await send("Runtime.evaluate", { expression: EXTRACT, awaitPromise: true, returnByValue: true });
      if (exceptionDetails) throw new Error(`extraction failed at ${w}px: ${exceptionDetails.text}`);
      result.viewports[w] = r.value;
      const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true,
        clip: { x: 0, y: 0, width: w, height: Math.min(r.value.height, 16000), scale: 1 } });
      writeFileSync(join(out, `${w}.png`), Buffer.from(shot.data, "base64"));
    }
  });
  writeFileSync(join(out, "ref.json"), JSON.stringify(result, null, 2));
  return result;
}

// ---- comparison --------------------------------------------------------------
const px = (v) => parseFloat(v) || 0;
function lab(rgb) {
  const m = String(rgb).match(/[\d.]+/g); if (!m || (m.length > 3 && +m[3] === 0)) return null;
  const f = (c) => { c /= 255; return c > 0.04045 ? ((c + 0.055) / 1.055) ** 2.4 : c / 12.92; };
  const [r, g, b] = m.slice(0, 3).map(Number).map(f);
  const xyz = [(r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047, r * 0.2126 + g * 0.7152 + b * 0.0722, (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883]
    .map((t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116));
  return [116 * xyz[1] - 16, 500 * (xyz[0] - xyz[1]), 200 * (xyz[1] - xyz[2])];
}
// A transparent colour has no comparable value: report no difference, not 99.
const dE = (a, b) => { const x = lab(a), y = lab(b); return x && y ? Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) : 0; };

export function compareViewports(ref, got) {
  const f = [];
  const add = (sev, what, detail) => f.push({ sev, what, detail });
  const rs = ref.sections, gs = got.sections;
  if (rs.length !== gs.length) add("major", "section count", `reference ${rs.length}, build ${gs.length}`);
  for (let i = 0; i < Math.min(rs.length, gs.length); i++) {
    const a = rs[i], b = gs[i], ratio = b.h / a.h;
    if (ratio < 0.8 || ratio > 1.25) add("major", `section ${i + 1} height`, `reference ${a.h}px, build ${b.h}px (x${ratio.toFixed(2)})`);
    if (a.cols !== b.cols) add("major", `section ${i + 1} columns`, `reference ${a.cols}, build ${b.cols}`);
    if (a.heading && b.heading) {
      const r = px(b.heading.size) / px(a.heading.size);
      if (r < 0.85 || r > 1.15) add("minor", `section ${i + 1} heading size`, `reference ${a.heading.size}, build ${b.heading.size}`);
    }
    if (dE(a.bg, b.bg) > 12) add("minor", `section ${i + 1} background`, `reference ${a.bg}, build ${b.bg} (dE ${dE(a.bg, b.bg).toFixed(0)})`);
  }
  if (ref.headingMax && got.headingMax) {
    const r = got.headingMax / ref.headingMax;
    if (r < 0.85 || r > 1.15) add("major", "largest heading", `reference ${ref.headingMax}px, build ${got.headingMax}px`);
  }
  for (const role of ["h1", "h2", "h3", "p", "button"]) {
    const a = ref.type.roles[role], b = got.type.roles[role];
    if (!a || !b) continue;
    const r = px(b.size) / px(a.size);
    if (r < 0.85 || r > 1.15) add("major", `${role} size`, `reference ${a.size}, build ${b.size}`);
    if (Math.abs(px(b.weight) - px(a.weight)) >= 200) add("minor", `${role} weight`, `reference ${a.weight}, build ${b.weight}`);
    if (a.family.toLowerCase() !== b.family.toLowerCase()) add("minor", `${role} font family`, `reference ${a.family}, build ${b.family}`);
  }
  for (const { v } of ref.color.background.slice(0, 3)) {
    const near = Math.min(...got.color.background.map((g) => dE(v, g.v)), 99);
    if (near > 10) add("minor", "palette", `reference background ${v} has no build match (nearest dE ${near.toFixed(0)})`);
  }
  const rr = ref.radius[0]?.v, gr = got.radius[0]?.v;
  if (rr && gr && Math.abs(px(rr) - px(gr)) > 4) add("minor", "dominant radius", `reference ${rr}, build ${gr}`);
  const hr = got.height / ref.height;
  if (hr < 0.8 || hr > 1.25) add("major", "page length", `reference ${ref.height}px, build ${got.height}px`);
  return f;
}

async function compare(refDir, url, out) {
  const ref = JSON.parse(readFileSync(join(refDir, "ref.json"), "utf8"));
  const widths = Object.keys(ref.viewports).map(Number);
  const got = await capture(url, out, widths);
  const report = { reference: refDir, build: url, viewports: {} };
  let md = `# UI fidelity report\n\nReference: \`${refDir}\` · Build: ${url}\n\nThresholds: section height x0.8–1.25, columns equal, type ±15%, colour dE ≤ 10–12, radius ±4px.\n`;
  let majors = 0;
  for (const w of widths) {
    const f = compareViewports(ref.viewports[w], got.viewports[w]);
    report.viewports[w] = f; majors += f.filter((x) => x.sev === "major").length;
    md += `\n## ${w}px — ${f.length ? f.length + " finding(s)" : "within tolerance"}\n\nScreenshots: \`${refDir}/${w}.png\` vs \`${out}/${w}.png\`\n\n`;
    md += f.length ? f.map((x) => `- **${x.sev}** ${x.what}: ${x.detail}`).join("\n") + "\n" : "";
  }
  md += `\nNumbers measure structure, not taste: inspect both screenshots before calling a match, and note every deliberate improvement as an intended deviation.\n`;
  writeFileSync(join(out, "report.json"), JSON.stringify(report, null, 2));
  writeFileSync(join(out, "report.md"), md);
  console.log(md);
  return majors;
}

// CLI only when run directly, so tests can import compareViewports.
if (process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href) {
  const [cmd, ...rest] = process.argv.slice(2);
  const opt = (name, def) => { const i = rest.indexOf(name); if (i < 0) return def; const v = rest[i + 1]; rest.splice(i, 2); return v; };
  if (cmd === "capture") {
    const out = opt("--out"); const widths = opt("--viewports", "390,768,1440").split(",").map(Number);
    const [url] = rest; if (!url || !out) die("usage: ui-ref.mjs capture URL --out DIR [--viewports 390,768,1440]");
    const r = await capture(url, out, widths);
    for (const [w, v] of Object.entries(r.viewports))
      console.log(`${w}px: ${v.sections.length} sections, height ${v.height}px, h1 ${v.type.roles.h1?.size ?? "-"}, fonts ${v.type.families.map((x) => x.v).join(" / ")}`);
    console.log(`wrote ${out}/ref.json and screenshots`);
  } else if (cmd === "compare") {
    const out = opt("--out"); const [refDir, url] = rest;
    if (!refDir || !url || !out) die("usage: ui-ref.mjs compare REF_DIR URL --out DIR");
    process.exit((await compare(refDir, url, out)) > 0 ? 1 : 0);
  } else {
    die("usage: ui-ref.mjs capture URL --out DIR [--viewports 390,768,1440] | compare REF_DIR URL --out DIR");
  }
}
