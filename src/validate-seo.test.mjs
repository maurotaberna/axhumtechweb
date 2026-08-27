import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const build = fileURLToPath(new URL('../builds/production/', import.meta.url));
const validator = fileURLToPath(new URL('./validate-seo.mjs', import.meta.url));
const run = (directory) => spawnSync(process.execPath, [validator, directory], { encoding: 'utf8' });

test('current production build passes, including inline SVG title elements', () => {
  const result = run(build);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /SEO checks passed/);
});

const cases = [
  ['noindex', 'index.html', 'index, follow', 'noindex, follow', /indexation disabled/],
  ['duplicate title', 'index.html', '</head>', '<title>Unexpected title</title></head>', /duplicate title/],
  ['invalid JSON', 'index.html', '"@graph": [', '"@graph": [oops', /invalid JSON-LD/],
  ['local business', 'index.html', '"@type": "Service"', '"@type": "ProfessionalService"', /local-business schema/],
  ['company mismatch', 'index.html', '"name": "Axhum Tech"', '"name": "Other company"', /company identity|company details/],
  ['broken link', 'index.html', 'href="/contacto"', 'href="/missing-page"', /missing internal resource/],
  ['broken anchor', 'index.html', 'href="/contacto"', 'href="/contacto#missing-anchor"', /missing anchor/],
  ['wrong sitemap', 'sitemap.xml', '<loc>https://axhumtech.com/webs</loc>', '<loc>https://axhumtech.com/missing</loc>', /missing from sitemap/],
  ['blocked robots', 'robots.txt', 'Allow: /', 'Disallow: /', /blocks crawling/],
];

for (const [name, file, before, after, expected] of cases) {
  test(`rejects ${name}`, () => {
    const directory = mkdtempSync(join(tmpdir(), 'axhum-seo-test-'));
    try {
      cpSync(build, directory, { recursive: true });
      const path = join(directory, file);
      const source = readFileSync(path, 'utf8');
      assert.ok(source.includes(before), `Mutation target not found: ${before}`);
      writeFileSync(path, source.replace(before, after));
      const result = run(directory);
      assert.equal(result.status, 1, result.stdout);
      assert.match(result.stderr, expected);
    } finally {
      // Only remove the unique test fixture created above, never the source build.
      assert.ok(resolve(directory).startsWith(resolve(tmpdir()) + sep + 'axhum-seo-test-'));
      rmSync(directory, { recursive: true, force: true });
    }
  });
}
