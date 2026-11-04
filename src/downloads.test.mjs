import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const products = [
  {
    page: 'productos.html', name: 'Axhum Gestión 1.1.3',
    download: 'https://github.com/maurotaberna/AxhumGestion-releases/releases/download/v1.1.3/Axhum.Gestion-Setup-1.1.3.exe',
    release: 'https://github.com/maurotaberna/AxhumGestion-releases/releases/tag/v1.1.3',
  },
  {
    page: 'productos.html', name: 'Axhum Gestión + ARCA 1.1.3',
    download: 'https://github.com/maurotaberna/AxhumGestion-releases/releases/download/v1.1.3/Axhum.Gestion.%2B.ARCA-Setup-1.1.3.exe',
    release: 'https://github.com/maurotaberna/AxhumGestion-releases/releases/tag/v1.1.3',
  },
  {
    page: 'productos.html',
    name: 'Axhum Comanda 1.0.1',
    download: 'https://github.com/maurotaberna/AxhumComanda-releases/releases/download/v1.0.1/Axhum.Comanda-Setup-1.0.1.exe',
    release: 'https://github.com/maurotaberna/AxhumComanda-releases/releases/tag/v1.0.1',
  },
  {
    page: 'productos.html',
    name: 'Axhum Service 1.0.2',
    download: 'https://github.com/maurotaberna/AxhumService-releases/releases/download/v1.0.2/Axhum.Service-Setup-1.0.2.exe',
    release: 'https://github.com/maurotaberna/AxhumService-releases/releases/tag/v1.0.2',
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

test('Gestion 1.1.3 replaces earlier installers without candidate labels in every language', () => {
  for (const page of ['productos.html', 'en/products.html', 'pt/produtos.html', 'fr/produits.html', 'nl/producten.html']) {
    const html = readFileSync(new URL(`../builds/production/${page}`, import.meta.url), 'utf8');
    assert.match(html, /Axhum Gestión 1\.1\.3/);
    assert.match(html, /Axhum Gestión \+ ARCA 1\.1\.3/);
    assert.doesNotMatch(html, /Axhum Gestión(?: \+ ARCA)? 1\.1\.3 RC/);
    assert.doesNotMatch(html, /Axhum\.Gestion[^"\s]*-Setup-1\.1\.[12]\.exe/);
  }
});

test('Axhum Service 1.0.2 shows its trial and update details in every language', () => {
  for (const page of ['productos.html', 'en/products.html', 'pt/produtos.html', 'fr/produits.html', 'nl/producten.html']) {
    const html = readFileSync(new URL(`../builds/production/${page}`, import.meta.url), 'utf8');
    assert.match(html, /Axhum Service 1\.0\.2/);
    assert.match(html, /Windows 10\/11/);
    assert.match(html, /82[,.]5/);
    assert.doesNotMatch(html, /Axhum\.Service-Setup-1\.0\.1\.exe/);
  }
  const spanish = readFileSync(new URL('../builds/production/productos.html', import.meta.url), 'utf8');
  assert.match(spanish, /Windows protegió tu PC/);
  assert.match(spanish, /No desactives el antivirus ni SmartScreen/);
});
