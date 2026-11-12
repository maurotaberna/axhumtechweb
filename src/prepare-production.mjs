import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { locales, pageKeys, routeFor } from './site-copy.mjs';

const [root, css, js, theme, analytics] = process.argv.slice(2);
if (!root || !css || !js || !theme || !analytics) throw new Error('Missing build arguments');
const versions = { 'styles.css': css, 'script.js': js, 'theme.js': theme, 'analytics.js': analytics };

// Las imagenes locales llevan ?v=<hash de contenido> para que Cloudflare no sirva versiones viejas.
const imageVersions = new Map();
function imageVersion(target) {
  if (!/\.(svg|png|webp|jpe?g|ico)$/i.test(target)) return '';
  if (!imageVersions.has(target)) {
    const file = join(root, decodeURIComponent(target));
    imageVersions.set(target, existsSync(file) ? createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 10) : '');
  }
  return imageVersions.get(target);
}

function pages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? pages(path) : entry.name.endsWith('.html') ? [path] : [];
  });
}

for (const file of pages(root)) {
  const path = relative(root, file).replaceAll('\\', '/');
  const base = new URL(path, 'https://axhumtech.com/');
  let html = readFileSync(file, 'utf8');
  html = html.replace(/\b(href|src)="([^"]+)"/g, (match, attribute, value) => {
    if (/^(https?:|mailto:|tel:|#|data:)/i.test(value)) return match;
    const resolved = new URL(value, base);
    let target = resolved.pathname;
    if (target.startsWith('/public/')) target = target.replace('/public/', '/');
    const asset = target.slice(target.lastIndexOf('/') + 1);
    const imageV = versions[asset] ? '' : imageVersion(target);
    if (versions[asset]) target += `?v=${versions[asset]}`;
    else if (imageV) target += `?v=${imageV}`;
    else if (attribute === 'href' && target.endsWith('/index.html')) target = target.slice(0, -10);
    else if (attribute === 'href' && target.endsWith('.html')) target = target.slice(0, -5);
    return `${attribute}="${target}${resolved.search && !versions[asset] && !imageV ? resolved.search : ''}${resolved.hash}"`;
  });
  html = html.replace(/(<meta property="og:image" content="https:\/\/axhumtech\.com)(\/[^"?]+)"/g, (match, start, target) => {
    const v = imageVersion(target);
    return v ? `${start}${target}?v=${v}"` : match;
  });
  writeFileSync(file, html, 'utf8');
}

const sitemap = Object.keys(locales).flatMap((locale) => pageKeys.map((page) => {
  const url = 'https://axhumtech.com' + routeFor(locale, page);
  const alternate = Object.entries(locales).map(([key, value]) =>
    `<xhtml:link rel="alternate" hreflang="${value.tag}" href="https://axhumtech.com${routeFor(key, page)}"/>`).join('');
  return `<url><loc>${url}</loc>${alternate}<xhtml:link rel="alternate" hreflang="x-default" href="https://axhumtech.com${routeFor('es', page)}"/></url>`;
})).join('');
writeFileSync(join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${sitemap}</urlset>`, 'utf8');
