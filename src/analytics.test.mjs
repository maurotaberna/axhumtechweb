import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../builds/preview/analytics.js', import.meta.url), 'utf8');

test('analytics is configured but does not load Google before consent', () => {
  let domReady;
  let externalScripts = 0;
  const window = { addEventListener() {} };
  const document = {
    readyState: 'loading',
    addEventListener(name, callback) {
      if (name === 'DOMContentLoaded') domReady = callback;
    },
    createElement() {
      externalScripts += 1;
      return {};
    },
    head: { appendChild() { externalScripts += 1; } },
  };
  const localStorage = { getItem: () => null };

  runInNewContext(source, { window, document, localStorage });

  assert.equal(typeof domReady, 'function');
  assert.equal(externalScripts, 0);
  assert.equal(window.dataLayer, undefined);
  assert.match(source, /var measurementId = "G-0QX9YV7TZ6";/);
});

test('analytics only permits non-sensitive commercial context', () => {
  assert.match(source, /\["path", "product", "channel", "interest", "budgetBand"\]/);
  assert.doesNotMatch(source, /\["(?:name|email|phone|message|detail|business)"/i);
  assert.match(source, /allow_google_signals: false/);
  assert.match(source, /allow_ad_personalization_signals: false/);
});

test('every production page loads one versioned analytics script before the site script', () => {
  const root = new URL('../builds/production/', import.meta.url);
  for (const file of readdirSync(root).filter(name => name.endsWith('.html'))) {
    const html = readFileSync(new URL(file, root), 'utf8');
    assert.equal((html.match(/analytics\.js/g) || []).length, 1, file);
    assert.match(html, /<script src="\.\/analytics\.js\?v=[a-f0-9]{10}" defer><\/script>/, file);
    assert.ok(html.indexOf('./analytics.js') < html.indexOf('./script.js'), file);
  }
});
