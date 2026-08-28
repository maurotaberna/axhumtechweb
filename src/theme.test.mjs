import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../builds/preview/theme.js', import.meta.url), 'utf8');
function page(saved, blocked = false) {
  const events = {};
  const attributes = {};
  const meta = {};
  let click;
  const button = { hidden: true, setAttribute: (key, value) => { attributes[key] = value; }, addEventListener: (_, callback) => { click = callback; } };
  const storage = { getItem: () => { if (blocked) throw Error('Disabled'); return saved; }, setItem: (_, value) => { if (blocked) throw Error('Disabled'); saved = value; } };
  const document = {
    documentElement: { dataset: {} }, readyState: 'loading',
    querySelector: () => ({ setAttribute: (key, value) => { meta[key] = value; } }),
    querySelectorAll: () => document.readyState === 'loading' ? [] : [button],
    addEventListener: (name, callback) => { events[name] = callback; },
  };
  runInNewContext(source, { document, window: { localStorage: storage, addEventListener: (name, callback) => { events[name] = callback; } } });
  const initial = document.documentElement.dataset.theme;
  document.readyState = 'interactive';
  events.DOMContentLoaded();
  return { document, initial, button, attributes, meta, click: () => click(), saved: () => saved, sync: (newValue) => events.storage({ key: 'axhum-theme', newValue, storageArea: storage }) };
}

test('defaults to light and exposes an accessible toggle after parsing', () => {
  const p = page(null);
  assert.equal(p.initial, 'light');
  assert.equal(p.button.hidden, false);
  assert.equal(p.attributes['aria-pressed'], 'false');
  assert.equal(p.meta.content, '#ffffff');
});
test('restores dark before parsing and persists explicit choices', () => {
  const p = page('dark');
  assert.equal(p.initial, 'dark');
  assert.equal(p.attributes['aria-pressed'], 'true');
  assert.equal(p.meta.content, '#101e2d');
  p.click();
  assert.equal(p.saved(), 'light');
  assert.equal(p.attributes.title, 'Activar modo oscuro');
  p.click();
  assert.equal(p.saved(), 'dark');
});
test('blocked storage does not prevent switching', () => {
  const p = page(null, true);
  p.click();
  assert.equal(p.document.documentElement.dataset.theme, 'dark');
});
test('invalid saved values fall back to light; tabs synchronize', () => {
  const p = page('unexpected');
  assert.equal(p.initial, 'light');
  p.sync('dark');
  assert.equal(p.attributes['aria-pressed'], 'true');
  p.sync(null);
  assert.equal(p.attributes['aria-pressed'], 'false');
});
test('every production page loads the versioned theme before CSS and has one toggle', () => {
  const root = new URL('../builds/production/', import.meta.url);
  for (const file of readdirSync(root).filter(name => name.endsWith('.html'))) {
    const html = readFileSync(new URL(file, root), 'utf8');
    assert.match(html, /<script src="\.\/theme\.js\?v=[a-f0-9]{10}"><\/script>/, file);
    assert.ok(html.indexOf('./theme.js') < html.indexOf('./styles.css'), file);
    assert.equal((html.match(/data-theme-toggle/g) || []).length, 1, file);
    assert.match(html, /aria-label="Modo oscuro" aria-pressed="false"[^>]+hidden/, file);
  }
});
