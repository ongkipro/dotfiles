#!/usr/bin/env node
// Static SEO check for ONE built HTML file. Zero dependencies (regex-level, adequate for generated markup).
// Limits are the OWNER's conventions (title 55-70, description 120-155), NOT Google rules. Google sets no limit.
// Usage: node check-page.mjs dist/index.html https://example.com/   (second arg = expected canonical)
import { readFileSync } from 'node:fs';

const [file, expectedCanonical] = process.argv.slice(2);
if (!file) { console.error('usage: check-page.mjs <file.html> [expected-canonical]'); process.exit(2); }
const html = readFileSync(file, 'utf8');
const head = (html.match(/<head[\s>][\s\S]*?<\/head>/i) ?? [''])[0];
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&nbsp;/g, ' ');
// Exact attribute name: must follow the tag name or whitespace (so data-name / data-charset never match); value quoted or unquoted.
const attr = (tag, name) => {
  const esc = name.replace(/[.*+?^${}()|[\]\\:]/g, '\\$&');
  const re = new RegExp('(?:^<\\w+|\\s)' + esc + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s"\'>=<]+))', 'i');
  const m = tag.match(re);
  return m ? (m[1] ?? m[2] ?? m[3]) : undefined;
};
const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
const metaBy = (key, val) => metas.filter((m) => (attr(m, key) ?? '').toLowerCase() === val);
const content = (m) => decode(attr(m, 'content') ?? '');
const links = [...head.matchAll(/<link\b[^>]*>/gi)].map((m) => m[0]);

const out = []; const add = (level, id, msg) => out.push({ level, id, msg });
const same = (a, b) => { try { return new URL(a).href === new URL(b).href; } catch { return a === b; } };   // "https://x" === "https://x/" per URL standard

const robotsEarly = [...metas.filter((m) => ['robots', 'googlebot'].includes((attr(m, 'name') ?? '').toLowerCase()))].map((m) => decode(attr(m, 'content') ?? '')).join(',').toLowerCase();
const indexable = !/noindex|none/.test(robotsEarly);
// title
const titles = [...head.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)];
if (titles.length === 0) add('FAIL', 'title', 'missing <title>');
else {
  if (titles.length > 1) add('FAIL', 'title', `${titles.length} <title> elements`);
  const t = decode(titles[0][1]).trim();
  if (indexable && (t.length < 55 || t.length > 70)) add('WARN', 'title-length', `owner range 55-70, got ${t.length}: "${t}"`);
  if (/[|—]/.test(t)) add('WARN', 'title-separator', 'owner rule: separator " - " or ":", never "|" or em dash');
}
// description
const desc = metaBy('name', 'description');
if (desc.length !== 1) add('FAIL', 'description', `expected exactly 1 meta description, found ${desc.length}`);
else { const d = content(desc[0]).trim(); if (indexable && (d.length < 120 || d.length > 155)) add('WARN', 'description-length', `owner range 120-155, got ${d.length}`); if (!/\.$/.test(d)) add('WARN', 'description-end', 'owner rule: ends with a full stop'); }
// canonical
const canon = links.filter((l) => (attr(l, 'rel') ?? '').toLowerCase().split(/\s+/).includes('canonical'));
if (canon.length !== 1) add('FAIL', 'canonical', `expected exactly 1, found ${canon.length}`);
else { const h = attr(canon[0], 'href') ?? ''; if (!/^https:\/\//i.test(h)) add('FAIL', 'canonical-absolute', `must be an absolute https URL: "${h}"`); if (h.includes('#')) add('FAIL', 'canonical-fragment', 'fragment not allowed'); if (expectedCanonical && !same(h, expectedCanonical)) add('FAIL', 'canonical-match', `expected ${expectedCanonical}, got ${h}`); }
// robots meta
const robots = [...metaBy('name', 'robots'), ...metaBy('name', 'googlebot')].map(content).join(',').toLowerCase();
if (/noindex|none/.test(robots)) add('INFO', 'robots', `page is NOT indexable (${robots}); correct only if intentional`);
// viewport / charset / lang
if (metaBy('name', 'viewport').length === 0) add('FAIL', 'viewport', 'missing viewport meta');
if (!metas.some((m) => attr(m, 'charset') !== undefined || /http-equiv\s*=\s*["']?content-type/i.test(m))) add('FAIL', 'charset', 'missing charset');
if (!/<html[^>]*\slang=/i.test(html)) add('WARN', 'lang', 'missing <html lang> (accessibility; Google detects language from text)');
// Open Graph
const og = Object.fromEntries(metas.filter((m) => /^og:/i.test(attr(m, 'property') ?? '')).map((m) => [attr(m, 'property').toLowerCase(), content(m)]));
for (const k of ['og:title', 'og:type', 'og:image', 'og:url']) if (!og[k]) add('FAIL', k, `Open Graph requires ${k}`);
for (const k of ['og:description', 'og:site_name']) if (!og[k]) add('WARN', k, `recommended ${k}`);
if (og['og:image'] && !/^https:\/\//.test(og['og:image'])) add('FAIL', 'og:image-absolute', 'og:image must be absolute https');
if (og['og:image'] && !og['og:image:alt']) add('WARN', 'og:image:alt', 'ogp.me: if og:image is set, set og:image:alt');
if (og['og:url'] && canon.length === 1 && !same(og['og:url'], attr(canon[0], 'href'))) add('WARN', 'og:url-canonical', 'og:url should equal the canonical URL');
if (!metaBy('name', 'twitter:card').length) add('INFO', 'twitter:card', 'no twitter:card (X falls back to OG, card type defaults to summary)');
// JSON-LD
const ld = [...html.matchAll(/<script[^>]+type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
const types = [];
for (const [i, m] of ld.entries()) {
  try { const j = JSON.parse(m[1]); for (const n of [].concat(j, j?.['@graph'] ?? [])) if (n && typeof n === 'object') types.push(...[].concat(n['@type'] ?? [])); else add('WARN', 'json-ld', `block ${i + 1} contains a non-object node`); }
  catch (e) { add('FAIL', 'json-ld', `block ${i + 1} is not valid JSON: ${e.message}`); }
}
if (ld.length === 0) add('INFO', 'json-ld', 'no structured data found');
if (types.includes('BreadcrumbList') && !/<nav[^>]*breadcrumb|aria-label\s*=\s*["']breadcrumb/i.test(html)) add('WARN', 'breadcrumb-visible', 'BreadcrumbList present but no visible breadcrumb nav (markup must match visible content)');
// headings
const body = (html.match(/<body[\s\S]*<\/body>/i) ?? [html])[0];
const h1 = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => decode(m[1].replace(/<[^>]+>/g, '')).trim());
if (h1.length === 0) add('FAIL', 'h1', 'no <h1>'); else if (h1.length > 1) add('WARN', 'h1', `${h1.length} <h1> elements (valid HTML, but keep one clear main title)`);
if (h1[0] && titles[0] && !decode(titles[0][1]).toLowerCase().includes(h1[0].toLowerCase().slice(0, 25))) add('INFO', 'h1-title', 'H1 and <title> share little text; Google may rewrite the title link');
// images
const imgs = [...body.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
for (const im of imgs) { const src = attr(im, 'src') ?? '(none)'; const alt = attr(im, 'alt'); if (alt === undefined) add('FAIL', 'img-alt', `missing alt: ${src}`); else if (alt.trim() === '' ) add('INFO', 'img-alt-empty', `empty alt (ok only for decorative): ${src}`); else if (alt.length > 125) add('WARN', 'img-alt-length', `alt ${alt.length} chars (> 125 owner limit): ${src}`); if (!/\.(webp|svg|avif)(\?|$)/i.test(src) && !/^data:/.test(src)) add('INFO', 'img-format', `owner rule: WebP (SVG icons): ${src}`); }
// links
for (const m of body.matchAll(/<a\b[^>]*>/gi)) { const a = m[0]; const href = attr(a, 'href'); if (href === undefined) add('WARN', 'a-href', 'anchor without href is not crawlable'); else if (/^javascript:/i.test(href)) add('FAIL', 'a-js', `javascript: href not crawlable: ${href}`); else if (/^#\//.test(href)) add('FAIL', 'a-hash-route', `fragment route not crawlable: ${href}`); }

const rank = { FAIL: 0, WARN: 1, INFO: 2 };
out.sort((a, b) => rank[a.level] - rank[b.level]);
for (const r of out) console.log(`${r.level.padEnd(4)} ${r.id.padEnd(22)} ${r.msg}`);
const fails = out.filter((r) => r.level === 'FAIL').length;
console.log(`\n${file}: ${fails} fail, ${out.filter((r) => r.level === 'WARN').length} warn, ${out.filter((r) => r.level === 'INFO').length} info`);
process.exit(fails ? 1 : 0);
