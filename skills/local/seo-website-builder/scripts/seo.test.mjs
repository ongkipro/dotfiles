import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serialize, breadcrumb, webSite, organization, article, product } from './jsonld.mjs';
import { buildSitemap, buildIndex, validateSitemap, chunk, LIMIT_URLS } from './sitemap.mjs';
import { parse, isAllowed, build } from './robots.mjs';
const HERE = dirname(fileURLToPath(import.meta.url));

// 1. serialize must neutralise script breakouts
const evil = serialize({ name: '</script><script>alert(1)</script>' });
assert.ok(!evil.includes('</script>') && !evil.includes('<'), 'raw < must not survive');
assert.equal(JSON.parse(evil).name, '</script><script>alert(1)</script>', 'round-trips to the original text');

// 2. breadcrumb rules
const b = breadcrumb([{ name: 'Home', url: '/' }, { name: 'Books', url: '/books' }, { name: 'Award Winners' }]);
assert.deepEqual(b.itemListElement.map((x) => x.position), [1, 2, 3]);
assert.equal(b.itemListElement[2].item, undefined, 'last item may omit item');
assert.equal(b.itemListElement[1].item, 'https://example.com/books', 'item must be absolute');
assert.throws(() => breadcrumb([{ name: 'Only', url: '/' }]), /at least 2/);

// 3. site name + organisation
assert.equal(webSite({ name: 'Example', alternateName: 'EX' }).url, 'https://example.com/');
assert.equal(organization({ name: 'Ex', logoUrl: '/logo.png' }).logo, 'https://example.com/logo.png');

// 4. article: one author object per author, never a merged string
const a = article({ headline: 'H', url: '/a', images: ['/i.jpg'], published: '2026-10-01T08:00:00+07:00',
  authors: [{ name: 'A', url: '/team/a' }, { name: 'B' }], publisher: { name: 'Ex', logoUrl: '/logo.png' } });
assert.equal(a.author.length, 2);
assert.match(a.datePublished, /[+-]\d\d:\d\d$/, 'timezone present');
assert.throws(() => article({ headline: 'H', url: '/a', images: [], published: 'x', authors: [] }), /author/);

// 5. product needs offers or rating
assert.throws(() => product({ name: 'P', url: '/p', images: ['/p.jpg'] }), /offers/);
const p = product({ name: 'P', url: '/p', images: ['/p.jpg'], price: 125000, currency: 'IDR', rating: { value: 4.6, count: 12 } });
assert.equal(p.offers.priceCurrency, 'IDR');
assert.equal(typeof p.offers.price, 'string');



// ---------- sitemap + robots ----------
const xml = buildSitemap([
  { url: 'https://example.com/', lastmod: '2026-10-01' },
  { url: 'https://example.com/a?x=1&y=2', lastmod: '2026-10-02T08:00:00+07:00',
    alternates: [{ hreflang: 'id', href: 'https://example.com/a' }, { hreflang: 'en', href: 'https://example.com/en/a' }], images: ['https://cdn.example.com/a.webp'] },
]);
assert.ok(xml.includes('x=1&amp;y=2'), 'ampersand is entity-escaped');
assert.ok(xml.includes('xmlns:xhtml') && xml.includes('xmlns:image'), 'extension namespaces declared only when used');
assert.deepEqual(validateSitemap(xml), [], 'own output validates clean');
assert.throws(() => buildSitemap([{ url: '/relative' }]), /absolute/);
assert.throws(() => buildSitemap([{ url: 'https://e.com/#x' }]), /fragment/);
assert.throws(() => buildSitemap([{ url: 'https://e.com/a' }, { url: 'https://e.com/a' }]), /duplicate/);
assert.throws(() => buildSitemap([{ url: 'https://e.com/a', lastmod: '04/06/2022' }]), /lastmod/);
assert.throws(() => buildSitemap(Array.from({ length: LIMIT_URLS + 1 }, (_, i) => ({ url: `https://e.com/${i}` }))), /split/);
assert.equal(chunk(Array.from({ length: 100_000 }, (_, i) => i)).length, 3, '100k URLs -> 3 files at 45k');
assert.ok(validateSitemap('<urlset><url><loc>http://e.com/a#b</loc><priority>1</priority></url></urlset>').length >= 3, 'validator catches bad input');
assert.ok(buildIndex([{ url: 'https://example.com/sitemap-0.xml', lastmod: '2026-10-01' }]).includes('<sitemapindex'));

// ---------- robots: reproduce Google's own documented examples ----------
const t = (rules, url, ua = 'Googlebot') => isAllowed(parse(rules), ua, url).allowed;
assert.equal(t('User-agent: *\nallow: /p\ndisallow: /', '/page'), true, 'allow:/p is more specific');
assert.equal(t('User-agent: *\nallow: /folder\ndisallow: /folder', '/folder/page'), true, 'tie -> least restrictive (allow)');
assert.equal(t('User-agent: *\nallow: /page\ndisallow: /*.htm', '/page.htm'), false, 'longer rule wins -> disallow');
assert.equal(t('User-agent: *\nallow: /page\ndisallow: /*.ph', '/page.php5'), true, 'tie on length? allow(5) vs /*.ph(5) -> allow');
assert.equal(t('User-agent: *\nallow: /$\ndisallow: /', '/'), true, 'allow:/$ matches only the root');
assert.equal(t('User-agent: *\nallow: /$\ndisallow: /', '/page.htm'), false);
assert.equal(t('User-agent: *\ndisallow: /fish', '/Fish.asp'), true, 'case-sensitive path');
assert.equal(t('User-agent: *\ndisallow: /*.php$', '/filename.php?parameters'), true, '$ anchors the end');
assert.equal(t('User-agent: *\ndisallow: /*.php$', '/folder/filename.php'), false);
// specific group is NOT merged with *
const g = 'User-agent: googlebot-news\nDisallow: /fish\nUser-agent: *\nDisallow: /carrots\nUser-agent: googlebot\nDisallow: /shrimp';
assert.equal(t(g, '/carrots', 'Googlebot'), true, 'googlebot has its own group, "*" rules do not apply');
assert.equal(t(g, '/carrots', 'Storebot-Google'), false, 'no specific group -> falls back to *');
assert.equal(t(g, '/shrimp', 'Googlebot'), false);
// same agent declared twice is merged
assert.equal(t('User-agent: googlebot-news\nDisallow: /fish\nUser-agent: *\nDisallow: /carrots\nUser-agent: googlebot-news\nDisallow: /shrimp', '/shrimp', 'googlebot-news'), false, 'groups for the same agent are merged');
// unsupported fields are ignored, sitemap does not split a group
assert.equal(t('User-agent: a\nCrawl-delay: 5\nNoindex: /x', '/x', 'a'), true, 'crawl-delay/noindex ignored by Google');
assert.equal(parse('User-agent: a\nSitemap: https://e.com/s.xml\nUser-agent: b\nDisallow: /').groups.length, 1, 'sitemap line between agents does not start a new group');
// empty Disallow = allow everything; BOM tolerated
assert.equal(t('\uFEFFUser-agent: *\nDisallow:', '/anything'), true);
// build
const out = build({ groups: [{ userAgent: '*', allow: ['/'], disallow: ['/cart', '/*?*sort='] }, { userAgent: ['GPTBot', 'ClaudeBot'], disallow: ['/'] }], sitemaps: ['https://example.com/sitemap-index.xml'] });
assert.ok(out.endsWith('Sitemap: https://example.com/sitemap-index.xml\n'));
assert.throws(() => build({ groups: [], sitemaps: ['/sitemap.xml'] }), /absolute/);
assert.equal(isAllowed(parse(out), 'GPTBot', '/').allowed, false);
assert.equal(isAllowed(parse(out), 'Googlebot', '/produk/x').allowed, true);
assert.equal(isAllowed(parse(out), 'Googlebot', '/list?sort=price').allowed, false, 'faceted URL blocked');



// ---------- check-page: the checker itself must be able to FAIL ----------
const run = (file, canonical) => { try { return { code: 0, out: execFileSync('node', [join(HERE, 'check-page.mjs'), join(HERE, 'fixtures', file), ...(canonical ? [canonical] : [])], { encoding: 'utf8' }) }; } catch (e) { return { code: e.status, out: e.stdout }; } };
const good = run('good.html', 'https://example.com/panduan/kopi-arabika-gayo');
assert.equal(good.code, 0, 'good fixture passes: ' + good.out);
const bad = run('bad.html');
assert.equal(bad.code, 1, 'bad fixture must fail');
for (const id of ['title', 'canonical', 'viewport', 'og:type', 'json-ld', 'img-alt', 'a-js', 'a-hash-route']) assert.ok(bad.out.includes(id), `bad fixture must report ${id}`);
assert.ok(run('good.html', 'https://example.com/other').out.includes('canonical-match'), 'wrong expected canonical is caught');


// ---------- regressions found by independent review (2026-10-31) ----------
// robots: '$' anchors only at the END of a pattern; elsewhere it is a literal character
assert.equal(t('User-agent: *\nDisallow: /foo$bar', '/foo'), true, '"$" mid-path is literal, so /foo is not blocked');
assert.equal(t('User-agent: *\nDisallow: /foo$bar', '/foo$bar'), false, 'literal match still blocks');
// sitemap: every URL-bearing field must be absolute; index lastmod validated
assert.throws(() => buildSitemap([{ url: 'https://e.com/a', alternates: [{ hreflang: 'en', href: '/rel' }] }]), /alternate href/);
assert.throws(() => buildSitemap([{ url: 'https://e.com/a', images: ['rel.jpg'] }]), /image url/);
assert.throws(() => buildIndex([{ url: 'https://e.com/s.xml', lastmod: 'not-a-date' }]), /lastmod/);
// jsonld: incomplete rating must not produce a hollow AggregateRating
assert.throws(() => product({ name: 'P', url: '/p', images: ['/i.jpg'], price: 1, currency: 'IDR', rating: {} }), /rating/);
// check-page: exact attribute names, null JSON-LD, unquoted attributes
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
const tmp = mkdtempSync(join(tmpdir(), 'seo-'));
const page = (head) => { const f = join(tmp, 'p.html'); writeFileSync(f, `<!doctype html><html lang=en><head>${head}<title>x</title></head><body><h1>a</h1></body></html>`); try { return execFileSync('node', [join(HERE, 'check-page.mjs'), f], { encoding: 'utf8' }); } catch (e) { return e.stdout; } };
assert.ok(page('<meta charset=utf-8><meta data-name="description" content="wrong">').includes('found 0'), 'data-name is not name');
assert.ok(page('<meta data-charset="utf-8">').includes('missing charset'), 'data-charset is not charset');
assert.ok(!page('<meta charset=utf-8>').includes('missing charset'), 'unquoted charset accepted');
assert.ok(page('<meta charset=utf-8><script type="application/ld+json">null</script>').includes('non-object node'), 'null JSON-LD handled, not a crash');


// calendar validity, and validateSitemap must also police alternates/images (second review round)
for (const bad of ['2024-02-30', '2024-13-01', '2023-02-29', '2024-04-31', '2026-10-01T24:00:00Z', '2026-10-01T10:61:00Z', '2026-10-01T10:00:00+99:99']) assert.throws(() => buildIndex([{ url: 'https://e.com/s.xml', lastmod: bad }]), /lastmod/, `rejects ${bad}`);
for (const ok of ['2024-02-29', '2026-10-31', '2026-10-01T09:30:00+07:00', '2026-10-01T09:30:00.123Z']) assert.doesNotThrow(() => buildIndex([{ url: 'https://e.com/s.xml', lastmod: ok }]), `accepts ${ok}`);
const relXml = '<?xml version="1.0" encoding="UTF-8"?><urlset><url><loc>https://e.com/a</loc><xhtml:link rel="alternate" hreflang="en" href="/rel"/><image:image><image:loc>rel.jpg</image:loc></image:image></url></urlset>';
const problems = validateSitemap(relXml);
assert.ok(problems.some((p) => p.includes('alternate href')) && problems.some((p) => p.includes('image loc')), 'validator flags relative alternate/image: ' + problems);

console.log('seo scripts: all assertions passed');
