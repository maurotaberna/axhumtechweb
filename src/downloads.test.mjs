import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const products = [
  {
    page: 'comanda.html',
    name: 'Axhum Comanda 1.0.1',
    download: 'https://github.com/maurotaberna/AxhumComanda-releases/releases/download/v1.0.1/Axhum.Comanda-Setup-1.0.1.exe',
    release: 'https://github.com/maurotaberna/AxhumComanda-releases/releases/tag/v1.0.1',
    sha256: '82fb1009e01931a38df9904d932d176fef4efdd8b0a04d835585e447ee945733',
  },
  {
    page: 'service.html',
    name: 'Axhum Service 1.0.1',
    download: 'https://github.com/maurotaberna/AxhumService-releases/releases/download/v1.0.1/Axhum.Service-Setup-1.0.1.exe',
    release: 'https://github.com/maurotaberna/AxhumService-releases/releases/tag/v1.0.1',
    sha256: 'CF59B0FC9CD2BD36C553E15CEAA0EB990D88EC75EDD9DEB6327F520AF638658A',
  },
];

for (const product of products) {
  test(`${product.name} keeps its verified public download`, () => {
    for (const build of ['preview', 'production']) {
      const html = readFileSync(new URL(`../builds/${build}/${product.page}`, import.meta.url), 'utf8');
      assert.equal((html.match(new RegExp(product.download.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length, 2, build);
      assert.equal((html.match(new RegExp(product.release.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length, 2, build);
      assert.ok(html.includes(product.sha256), build);
      assert.ok(html.includes(`data-track-product="${product.name}"`), build);
      assert.match(html, /Editor desconocido/);
      assert.match(html, /M&aacute;s informaci&oacute;n|Más información/);
      assert.match(html, /Ejecutar de todas formas/);
    }
  });
}
