// Safe JSON-LD helpers. Pure functions, no dependencies. Node >= 18.
// Rule from Google's general guidelines: markup must describe content that is visible on the page.

const ORIGIN = 'https://example.com'; // set once per site, no trailing slash

/** Escape for inline <script>. JSON.stringify alone does NOT stop "</script>" or "<!--" breakouts. */
export function serialize(node) {
  return JSON.stringify(node)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export const abs = (path) => new URL(path, ORIGIN).toString();

/** Breadcrumb: >= 2 items. Last item may omit `item` (Google uses the page URL). Position starts at 1. */
export function breadcrumb(trail) {
  if (!Array.isArray(trail) || trail.length < 2) throw new Error('BreadcrumbList needs at least 2 items');
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => {
      const last = i === trail.length - 1;
      const el = { '@type': 'ListItem', position: i + 1, name: t.name };
      if (!last || t.url) el.item = abs(t.url);
      return el;
    }),
  };
}

/** Home page only. Site name: one per domain/subdomain; WebSite node must be on the home page. */
export function webSite({ name, alternateName }) {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name, ...(alternateName && { alternateName }), url: abs('/') };
}

/** No required properties; add what is true. Logo: >= 112x112 px, crawlable, raster is safest. */
export function organization({ name, logoUrl, sameAs = [], email, telephone }) {
  return {
    '@context': 'https://schema.org', '@type': 'Organization', name, url: abs('/'),
    ...(logoUrl && { logo: abs(logoUrl) }),
    ...(sameAs.length && { sameAs }),
    ...(email && { email }), ...(telephone && { telephone }),
  };
}

/** Article / BlogPosting. author must be Person|Organization with url; one entry per author. ISO 8601 with timezone. */
export function article({ type = 'BlogPosting', headline, url, images, published, modified, authors, publisher }) {
  if (!authors?.length) throw new Error('article needs at least one author');
  return {
    '@context': 'https://schema.org', '@type': type, headline,
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(url) },
    image: images.map(abs),
    datePublished: published, ...(modified && { dateModified: modified }),
    author: authors.map((a) => ({ '@type': a.type ?? 'Person', name: a.name, ...(a.url && { url: abs(a.url) }) })),
    ...(publisher && { publisher: { '@type': 'Organization', name: publisher.name, ...(publisher.logoUrl && { logo: abs(publisher.logoUrl) }) } }),
  };
}

/** Product snippet: name + at least one of review | aggregateRating | offers. Price/availability must match the visible page. */
export function product({ name, url, images, description, sku, brand, price, currency, availability = 'InStock', rating }) {
  const node = {
    '@context': 'https://schema.org', '@type': 'Product', name, url: abs(url),
    image: images.map(abs), ...(description && { description }), ...(sku && { sku }),
    ...(brand && { brand: { '@type': 'Brand', name: brand } }),
  };
  if (price != null) node.offers = { '@type': 'Offer', url: abs(url), price: String(price), priceCurrency: currency, availability: `https://schema.org/${availability}` };
  if (rating && (!(rating.value >= 0) || !(rating.count > 0))) throw new Error('rating needs a numeric value and a positive count');
  if (rating) node.aggregateRating = { '@type': 'AggregateRating', ratingValue: rating.value, reviewCount: rating.count };
  if (!node.offers && !node.aggregateRating) throw new Error('Product needs offers, aggregateRating or review');
  return node;
}
