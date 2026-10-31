// robots.txt: builder + a tester that implements GOOGLE's matching rules, so you can prove what a rule set does BEFORE deploying.
// Google rules (Crawling infrastructure, "How Google interprets robots.txt"):
//  - supported fields: user-agent, allow, disallow, sitemap. Others (crawl-delay, noindex, host) are ignored by Google.
//  - one group per crawler: the MOST SPECIFIC user-agent match; groups with the same agent are merged; specific groups are NOT merged with "*".
//  - per URL: the rule with the LONGEST path wins; on a tie (conflict) the LEAST restrictive rule (allow) wins.
//  - '*' = any chars, '$' = end of URL; matching is case-sensitive on the path; file max 500 KiB; UTF-8.
//  - robots.txt controls CRAWLING, not indexing: a disallowed URL can still be indexed without a snippet. Use noindex (crawlable!) to exclude.

export function parse(text) {
  const groups = []; let cur = null; let lastWasAgent = false; const sitemaps = [];
  for (const raw of text.replace(/^\uFEFF/, '').split(/\r\n|\r|\n/)) {
    const line = raw.replace(/#.*/, '').trim(); if (!line) continue;
    const i = line.indexOf(':'); if (i < 0) continue;
    const field = line.slice(0, i).trim().toLowerCase(), value = line.slice(i + 1).trim();
    if (field === 'user-agent') { if (!lastWasAgent) { cur = { agents: [], rules: [] }; groups.push(cur); } cur.agents.push(value.toLowerCase()); lastWasAgent = true; continue; }
    if (field === 'sitemap') { sitemaps.push(value); continue; }          // not tied to a group; does NOT end a user-agent run
    if (field !== 'allow' && field !== 'disallow') continue;               // any other field is ignored by Google's parser
    lastWasAgent = false;
    if (cur && value !== '') cur.rules.push({ type: field, path: value });
  }
  return { groups, sitemaps };
}

// '$' anchors the end only as the LAST character of the pattern; anywhere else it is a literal '$' (Google: "designates the end of the URL").
const toRegex = (p) => { const end = p.endsWith('$'); const body = end ? p.slice(0, -1) : p; return new RegExp('^' + body.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + (end ? '$' : '')); };
const specificity = (agent, token) => (agent === '*' ? 0 : token.startsWith(agent) ? agent.length : -1);

export function isAllowed(parsed, userAgentToken, urlPath) {
  const token = userAgentToken.toLowerCase(); let best = -1; const merged = [];
  for (const g of parsed.groups) for (const a of g.agents) best = Math.max(best, specificity(a, token));
  if (best < 0) return { allowed: true, rule: null };
  for (const g of parsed.groups) if (g.agents.some((a) => specificity(a, token) === best)) merged.push(...g.rules);
  let win = null;
  for (const r of merged) {
    if (!toRegex(r.path).test(urlPath)) continue;
    if (!win || r.path.length > win.path.length || (r.path.length === win.path.length && r.type === 'allow')) win = r;
  }
  return { allowed: !win || win.type === 'allow', rule: win };
}

/** groups: [{ userAgent: string|string[], allow?: string[], disallow?: string[] }], sitemaps: absolute URLs */
export function build({ groups, sitemaps = [] }) {
  const lines = [];
  for (const g of groups) { for (const ua of [].concat(g.userAgent)) lines.push(`User-agent: ${ua}`); for (const a of g.allow ?? []) lines.push(`Allow: ${a}`); for (const d of g.disallow ?? []) lines.push(`Disallow: ${d}`); lines.push(''); }
  for (const s of sitemaps) { if (!/^https?:\/\//.test(s)) throw new Error(`Sitemap must be an absolute URL: ${s}`); lines.push(`Sitemap: ${s}`); }
  const txt = lines.join('\n') + '\n';
  if (Buffer.byteLength(txt) > 500 * 1024) throw new Error('robots.txt exceeds Google 500 KiB limit');
  return txt;
}
