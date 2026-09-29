import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const products = [
  {
    page: 'productos.html',
    name: 'Axhum Gestión 1.0.9',
    download: 'https://github.com/maurotaberna/AxhumGestion-releases/releases/download/v1.0.9/Axhum.Gestion-Setup-1.0.9.exe',
    release: 'https://github.com/maurotaberna/AxhumGestion-releases/releases/tag/v1.0.9',
  },
  {
    page: 'productos.html',
    name: 'Axhum Gestión + ARCA 1.0.9',
    download: 'https://github.com/maurotaberna/AxhumGestion-releases/releases/download/v1.0.9/Axhum.Gestion.%2B.ARCA-Setup-1.0.9.exe',
    release: 'https://github.com/maurotaberna/AxhumGestion-releases/releases/tag/v1.0.9',
  },
  {
    page: 'productos.html',
    name: 'Axhum Comanda 1.0.1',
    download: 'https://github.com/maurotaberna/AxhumComanda-releases/releases/download/v1.0.1/Axhum.Comanda-Setup-1.0.1.exe',
    release: 'https://github.com/maurotaberna/AxhumComanda-releases/releases/tag/v1.0.1',
  },
  {
    page: 'productos.html',
    name: 'Axhum Service 1.0.1',
    download: 'https://github.com/maurotaberna/AxhumService-releases/releases/download/v1.0.1/Axhum.Service-Setup-1.0.1.exe',
    release: 'https://github.com/maurotaberna/AxhumService-releases/releases/tag/v1.0.1',
  },
];

for (const product of products) {
  test(`${product.name} keeps its verified public download`, () => {
    for (const build of ['preview', 'production']) {
      const html = readFileSync(new URL(`../builds/${build}/${product.page}`, import.meta.url), 'utf8');
      assert.equal((html.match(new RegExp(product.download.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length, 1, build);
      assert.ok(html.includes(product.release), build);
      assert.ok(html.includes(`data-track-product="${product.name}"`), build);
      assert.match(html, /Editor desconocido/);
      assert.match(html, /M&aacute;s informaci&oacute;n|Más información/);
      assert.match(html, /Ejecutar de todas formas/);
    }
  });
}

test('download section does not display hashes or outdated Gestión installers', () => {
  for (const build of ['preview', 'production']) {
    const html = readFileSync(new URL(`../builds/${build}/productos.html`, import.meta.url), 'utf8');
    assert.doesNotMatch(html, /SHA-256|1\.0\.4|82fb1009e01931a38df9904d932d176fef4efdd8b0a04d835585e447ee945733|CF59B0FC9CD2BD36C553E15CEAA0EB990D88EC75EDD9DEB6327F520AF638658A/i);
  }
});
