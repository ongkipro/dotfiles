// Sitemap + sitemap-index builder and validator. Zero dependencies. Node >= 18.
// Limits from Google "Build and Submit a Sitemap": 50,000 URLs or 50 MB uncompressed per file; UTF-8; absolute URLs;
// tag values entity-escaped; <priority> and <changefreq> are ignored by Google; <lastmod> only if consistently accurate.

export const LIMIT_URLS = 50_000;
export const LIMIT_BYTES = 50 * 1024 * 1024;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
const isAbs = (u) => { try { const x = new URL(u); return x.protocol === 'https:' || x.protocol === 'http:'; } catch { return false; } };

/** W3C Datetime: YYYY-MM-DD or full ISO 8601 with timezone. Rejects "now at build time" style fakes only by caller discipline. */
const W3C_SHAPE = /^(\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2})(:(\d{2})(\.\d+)?)?(Z|[+-](\d{2}):(\d{2})))?$/;
/** Shape AND calendar: rejects 2024-02-30, month 13, hour 24, offset +99:99. */
const W3C = { test: (s) => { const m = W3C_SHAPE.exec(s); if (!m) return false; const [y, mo, d] = [+m[1], +m[2], +m[3]]; if (mo < 1 || mo > 12 || d < 1) return false; if (d > new Date(Date.UTC(y, mo, 0)).getUTCDate()) return false; if (m[4]) { if (+m[5] > 23 || +m[6] > 59 || (m[8] !== undefined && +m[8] > 59)) return false; if (m[11] !== undefined && (+m[11] > 23 || +m[12] > 59)) return false; } return true; } };

/** entries: [{ url, lastmod?, alternates?: [{hreflang, href}], images?: [url] }]. Include ONLY canonical, indexable, 200 URLs. */
export function buildSitemap(entries) {
  if (entries.length > LIMIT_URLS) throw new Error(`> ${LIMIT_URLS} URLs: split into several files and use buildIndex()`);
  const seen = new Set();
  const hasAlt = entries.some((e) => e.alternates?.length), hasImg = entries.some((e) => e.images?.length);
  const ns = ['xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"', hasAlt && 'xmlns:xhtml="http://www.w3.org/1999/xhtml"', hasImg && 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'].filter(Boolean).join(' ');
  const body = entries.map((e) => {
    if (!isAbs(e.url)) throw new Error(`url must be absolute: ${e.url}`);
    if (e.url.includes('#')) throw new Error(`fragment in sitemap url: ${e.url}`);
    if (seen.has(e.url)) throw new Error(`duplicate url: ${e.url}`);
    seen.add(e.url);
    if (e.lastmod && !W3C.test(e.lastmod)) throw new Error(`lastmod not W3C Datetime: ${e.lastmod}`);
    for (const a of e.alternates ?? []) { if (!isAbs(a.href)) throw new Error(`alternate href must be absolute: ${a.href}`); if (!a.hreflang) throw new Error('alternate needs hreflang'); }
    for (const i of e.images ?? []) if (!isAbs(i)) throw new Error(`image url must be absolute: ${i}`);
    const alt = (e.alternates ?? []).map((a) => `<xhtml:link rel="alternate" hreflang="${esc(a.hreflang)}" href="${esc(a.href)}"/>`).join('');
    const img = (e.images ?? []).slice(0, 1000).map((i) => `<image:image><image:loc>${esc(i)}</image:loc></image:image>`).join('');
    return `<url><loc>${esc(e.url)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}${alt}${img}</url>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${ns}>\n${body}\n</urlset>\n`;
  if (Buffer.byteLength(xml, 'utf8') > LIMIT_BYTES) throw new Error('file exceeds 50 MB uncompressed: split it');
  return xml;
}

/** Split a big list into chunks of `size` (default 45,000 = Astro's default, leaves headroom under 50,000). */
export function chunk(entries, size = 45_000) { const out = []; for (let i = 0; i < entries.length; i += size) out.push(entries.slice(i, i + size)); return out; }

/** Sitemap index. Child sitemaps must live in the same directory as the index, or deeper (Google rule). */
export function buildIndex(items) {
  if (items.length > 50_000) throw new Error('index lists > 50,000 sitemaps');
  const body = items.map((i) => { if (!isAbs(i.url)) throw new Error(`url must be absolute: ${i.url}`); if (i.lastmod && !W3C.test(i.lastmod)) throw new Error(`lastmod not W3C Datetime: ${i.lastmod}`); return `<sitemap><loc>${esc(i.url)}</loc>${i.lastmod ? `<lastmod>${i.lastmod}</lastmod>` : ''}</sitemap>`; }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
  if (Buffer.byteLength(xml, 'utf8') > LIMIT_BYTES) throw new Error('index exceeds 50 MB uncompressed');
  return xml;
}

/** Cheap structural validator for an existing sitemap string. Returns a list of problems (empty = ok). */
export function validateSitemap(xml) {
  const problems = [];
  if (!/^<\?xml[^>]*encoding=["']UTF-8["']/i.test(xml.trimStart())) problems.push('missing UTF-8 XML declaration');
  const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  if (locs.length > LIMIT_URLS) problems.push(`${locs.length} URLs > ${LIMIT_URLS}`);
  if (Buffer.byteLength(xml) > LIMIT_BYTES) problems.push('> 50 MB');
  const dup = locs.filter((u, i) => locs.indexOf(u) !== i); if (dup.length) problems.push(`duplicate: ${dup[0]}`);
  for (const u of locs) { if (!isAbs(u)) problems.push(`not absolute: ${u}`); if (u.includes('#')) problems.push(`fragment: ${u}`); if (/^http:/.test(u)) problems.push(`http (should be https?): ${u}`); }
  for (const m of xml.matchAll(/<xhtml:link\b[^>]*\bhref="([^"]*)"/g)) if (!isAbs(m[1].replace(/&amp;/g, '&'))) problems.push(`alternate href not absolute: ${m[1]}`);
  for (const m of xml.matchAll(/<image:loc>([^<]*)<\/image:loc>/g)) if (!isAbs(m[1].replace(/&amp;/g, '&'))) problems.push(`image loc not absolute: ${m[1]}`);
  for (const m of xml.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)) if (!W3C.test(m[1])) problems.push(`bad lastmod: ${m[1]}`);
  if (/<(priority|changefreq)>/.test(xml)) problems.push('INFO: <priority>/<changefreq> are ignored by Google (harmless, but dead weight)');
  return problems;
}
