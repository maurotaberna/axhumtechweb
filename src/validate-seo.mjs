import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(process.argv[2] || fileURLToPath(new URL('../builds/production/', import.meta.url)));
const origin = 'https://axhumtech.com';
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const read = (name) => readFileSync(join(root, name), 'utf8');

// This validates the repository's static HTML conventions, not arbitrary HTML.
const attrs = (tag) => Object.fromEntries(
  [...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/gs)]
    .map(([, key, , value]) => [key.toLowerCase(), value]),
);
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))]
  .map(([tag]) => attrs(tag));
const schemaNodes = (value) => {
  if (!value || typeof value !== 'object') return [];
  return [value, ...Object.values(value).flatMap(schemaNodes)];
};

if (!existsSync(root)) {
  console.error('Build missing. Run ./src/build-production.ps1 first.');
  process.exit(1);
}

const files = readdirSync(root).filter((file) => file.endsWith('.html'));
const sitemap = read('sitemap.xml');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
const titles = new Set();
const canonicals = new Set();
let organization;
check(new Set(locations).size === locations.length, 'Duplicate sitemap URLs');
check(locations.length === files.length - 1, 'Sitemap must contain every page except 404');
for (const [, date] of sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
  check(/^\d{4}-\d{2}-\d{2}$/.test(date) && date <= new Date().toISOString().slice(0, 10),
    `Invalid or future sitemap lastmod: ${date}`);
}

for (const file of files) {
  const html = read(file);
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || '';
  const url = `${origin}/${file === 'index.html' ? '' : file.replace(/\.html$/, '')}`;
  const meta = tags(html, 'meta');
  const links = tags(html, 'link');
  const getMeta = (name) => meta.find((tag) => tag.name === name || tag.property === name)?.content;
  const titleMatches = [...head.matchAll(/<title>([\s\S]*?)<\/title>/gi)];
  const title = titleMatches[0]?.[1]?.trim();
  check(titleMatches.length === 1 && !!title && !titles.has(title), `${file}: missing or duplicate title`);
  titles.add(title);
  check(!!getMeta('description')?.trim(), `${file}: missing description`);
  check((html.match(/<h1\b/gi) || []).length === 1, `${file}: expected one h1`);
  check(tags(html, 'img').every((tag) => Object.hasOwn(tag, 'alt')), `${file}: image without alt`);
  check(/<html\b[^>]*lang="es-AR"/i.test(html), `${file}: missing Spanish language`);

  const canonical = links.filter((tag) => tag.rel === 'canonical');
  if (file === '404.html') {
    check(/\bnoindex\b/.test(getMeta('robots') || ''), `${file}: must be noindex`);
    check(canonical.length === 0, `${file}: must not have a canonical`);
  } else {
    check(canonical.length === 1 && canonical[0].href === url, `${file}: incorrect canonical`);
    canonicals.add(url);
    check(locations.includes(url), `${file}: canonical missing from sitemap`);
    check(/\bindex\b/.test(getMeta('robots') || '') && !/noindex|nofollow|none/.test(getMeta('robots') || ''),
      `${file}: indexation disabled`);
    check(getMeta('og:url') === url, `${file}: Open Graph URL differs from canonical`);
    check(!!getMeta('og:image') && !!getMeta('twitter:card'), `${file}: missing social metadata`);
  }

  const blocks = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  check(blocks.length > 0, `${file}: missing structured data`);
  const nodes = [];
  for (const [, block] of blocks) {
    check(!/&(?:#\d+|#x[0-9a-f]+|[a-z]+);/i.test(block), `${file}: HTML entity inside JSON-LD`);
    check(!/https:\/\/axhumtech\.com\/[^"\s]*\.html/.test(block), `${file}: redirect URL in JSON-LD`);
    try { nodes.push(...schemaNodes(JSON.parse(block))); }
    catch (error) { errors.push(`${file}: invalid JSON-LD: ${error.message}`); }
  }
  check(!nodes.some((node) => [node['@type']].flat().some((type) => ['LocalBusiness', 'ProfessionalService'].includes(type))),
    `${file}: remote company must not use a local-business schema`);
  if (file !== '404.html') {
    const org = nodes.find((node) => node['@type'] === 'Organization');
    check(org?.['@id'] === `${origin}/#organizacion` && org?.name === 'Axhum Tech', `${file}: missing company identity`);
    check(!org?.address && org?.description?.includes('100% remota'), `${file}: company must describe remote-only service`);
    if (org) {
      const serialized = JSON.stringify(org);
      organization ??= serialized;
      check(serialized === organization, `${file}: inconsistent company details`);
    }
  }

  // Resolve clean public URLs to the flat files emitted by the Pages build.
  for (const [tag] of html.matchAll(/<(?:a|link|img|script)\b[^>]*>/gi)) {
    const attributes = attrs(tag);
    const value = attributes.href ?? attributes.src;
    if (!value || /^(?:mailto:|tel:|data:|javascript:)/i.test(value)) continue;
    const target = new URL(value.replaceAll('&amp;', '&'), url);
    if (target.origin !== origin) continue;
    check(!target.pathname.endsWith('.html'), `${file}: internal link redirects: ${value}`);
    const relative = decodeURIComponent(target.pathname).replace(/^\//, '');
    const candidate = relative === '' ? 'index.html' : relative.includes('.') ? relative : `${relative}.html`;
    const path = resolve(root, candidate);
    check(path.startsWith(resolve(root) + (process.platform === 'win32' ? '\\' : '/')) && existsSync(path),
      `${file}: missing internal resource: ${value}`);
    if (target.hash && candidate.endsWith('.html') && existsSync(path)) {
      const ids = [...readFileSync(path, 'utf8').matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id);
      check(ids.includes(decodeURIComponent(target.hash.slice(1))), `${file}: missing anchor: ${value}`);
    }
  }
}
for (const url of locations) check(canonicals.has(url), `Sitemap URL has no indexable page: ${url}`);
const robots = read('robots.txt');
check(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'robots.txt missing sitemap');
check(!/^\s*Disallow:\s*\/\s*$/im.test(robots), 'robots.txt blocks crawling');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`SEO checks passed: ${files.length} HTML files, ${locations.length} indexable URLs, consistent remote company identity.`);
}
