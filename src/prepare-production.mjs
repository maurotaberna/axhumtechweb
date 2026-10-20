import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { locales, pageKeys, routeFor } from './site-copy.mjs';

const [root, css, js, theme, analytics] = process.argv.slice(2);
if (!root || !css || !js || !theme || !analytics) throw new Error('Missing build arguments');
const versions = { 'styles.css': css, 'script.js': js, 'theme.js': theme, 'analytics.js': analytics };

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
    if (versions[asset]) target += `?v=${versions[asset]}`;
    else if (attribute === 'href' && target.endsWith('/index.html')) target = target.slice(0, -10);
    else if (attribute === 'href' && target.endsWith('.html')) target = target.slice(0, -5);
    return `${attribute}="${target}${resolved.search && !versions[asset] ? resolved.search : ''}${resolved.hash}"`;
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
