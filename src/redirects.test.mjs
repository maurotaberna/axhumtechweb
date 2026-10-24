import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../public/_worker.js', import.meta.url), 'utf8');
const { default: worker } = await import(`data:text/javascript,${encodeURIComponent(source)}`);
const env = { ASSETS: { fetch: async () => new Response('active', { status: 200 }) } };

for (const [from, to] of [
  ['/webs', '/servicios#webs'],
  ['/software-a-medida', '/servicios#software'],
  ['/gestion', '/productos#escritorio'],
  ['/comanda', '/productos#escritorio'],
  ['/nosotros', '/#empresa'],
]) {
  test(`${from} redirects to ${to}`, async () => {
    const response = await worker.fetch(new Request(`https://axhumtech.com${from}`), env);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), `https://axhumtech.com${to}`);
  });
}

test('legacy URL retains query parameters', async () => {
  const response = await worker.fetch(new Request('https://axhumtech.com/webs.html?utm_source=google'), env);
  assert.equal(response.headers.get('location'), 'https://axhumtech.com/servicios?utm_source=google#webs');
});

test('current pages are served without redirect', async () => {
  const response = await worker.fetch(new Request('https://axhumtech.com/productos'), env);
  assert.equal(response.status, 200);
});

test('Netherlands visitor receives a non-redirecting Dutch hint', async () => {
  const request = new Request('https://axhumtech.com/locale-hint');
  Object.defineProperty(request, 'cf', { value: { country: 'NL' } });
  const response = await worker.fetch(request, env);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { language: 'nl' });
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
});
