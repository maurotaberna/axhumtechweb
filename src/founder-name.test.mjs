import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const name = 'Mauro Gustavo Exequiel Taberna';
const pages = ['index.html', 'servicios.html', 'productos.html', 'contacto.html', '404.html'];

test('the founder name is spelled consistently in the published site', () => {
  for (const build of ['preview', 'production']) {
    for (const page of pages) {
      const html = readFileSync(new URL(`../builds/${build}/${page}`, import.meta.url), 'utf8');
      assert.ok(html.includes(name), `${build}/${page}`);
      assert.doesNotMatch(html, /Exequel/i, `${build}/${page}`);
    }
  }
});

test('active content sources use the same founder name', () => {
  for (const path of ['build-site.mjs', '../content/commercial/founder.md', '../content/pages/sobre-axhum-tech.md', '../docs/brand-content-audit.md']) {
    const content = readFileSync(new URL(path, import.meta.url), 'utf8');
    assert.ok(content.includes(name), path);
    assert.doesNotMatch(content, /Exequel/i, path);
  }
});
