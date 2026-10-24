import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { locales, pageKeys, routeFor } from './site-copy.mjs';

const output = new URL('../builds/production/', import.meta.url);
const pages = {
  es: ['index.html', 'servicios.html', 'productos.html', 'contacto.html'],
  en: ['en/index.html', 'en/services.html', 'en/products.html', 'en/contact.html'],
  pt: ['pt/index.html', 'pt/servicos.html', 'pt/produtos.html', 'pt/contato.html'],
  fr: ['fr/index.html', 'fr/services.html', 'fr/produits.html', 'fr/contact.html'],
  nl: ['nl/index.html', 'nl/diensten.html', 'nl/producten.html', 'nl/contact.html'],
};

test('every institutional page has a complete language selector and reciprocal SEO links', () => {
  for (const [locale, files] of Object.entries(pages)) {
    files.forEach((file, index) => {
      const html = readFileSync(new URL(file, output), 'utf8');
      assert.match(html, new RegExp(`<html lang="${locales[locale].tag}"`), file);
      assert.match(html, new RegExp(`<link rel="canonical" href="https://axhumtech.com${routeFor(locale, pageKeys[index])}"`), file);
      for (const [other, spec] of Object.entries(locales)) {
        assert.ok(html.includes(`hreflang="${spec.tag}" href="https://axhumtech.com${routeFor(other, pageKeys[index])}"`), file);
        assert.ok(html.includes(`data-locale-choice="${other}"`), file);
      }
      assert.ok(!html.includes('undefined'), file);
      assert.equal((html.match(/data-theme-toggle/g) || []).length, 1, file);
    });
  }
});

test('translated product pages disclose that external product sites remain Spanish', () => {
  for (const locale of ['en', 'pt', 'fr', 'nl']) {
    const html = readFileSync(new URL(pages[locale][2], output), 'utf8');
    assert.match(html, /product-language/);
    assert.match(html, /axhumgestion\.com\.ar/);
    assert.match(html, /axenda\.date/);
  }
});

test('contact form keeps stable interest values across languages', () => {
  for (const files of Object.values(pages)) {
    const html = readFileSync(new URL(files[3], output), 'utf8');
    for (const value of ['web', 'software', 'automatizacion', 'gestion', 'axenda', 'otro']) {
      assert.ok(html.includes(`<option value="${value}"`), files[3]);
    }
  }
});

test('Dutch interactions include native consent, theme and WhatsApp copy', () => {
  const analytics = readFileSync(new URL('../builds/production/analytics.js', import.meta.url), 'utf8');
  const theme = readFileSync(new URL('../builds/production/theme.js', import.meta.url), 'utf8');
  const script = readFileSync(new URL('../builds/production/script.js', import.meta.url), 'utf8');
  assert.ok(analytics.includes('Analytische cookies'));
  assert.ok(theme.includes('Donkere modus inschakelen'));
  assert.ok(script.includes('Hallo Axhum Tech, ik wil graag een project bespreken.'));
  assert.ok(script.includes("fr', 'nl'"));
});

test('language selector uses a centered CSS chevron rather than a font glyph', () => {
  const html = readFileSync(new URL('en/index.html', output), 'utf8');
  const css = readFileSync(new URL('styles.css', output), 'utf8');
  assert.match(html, /<summary aria-label="Choose language">EN<\/summary>/);
  assert.doesNotMatch(html, /⌄/);
  assert.match(css, /\.language-menu summary\{[^}]*align-items:center;justify-content:center/);
  assert.match(css, /\.language-menu summary::after\{[^}]*border-right:2px solid/);
});
