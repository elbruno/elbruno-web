import assert from 'node:assert/strict';
import { test } from 'node:test';
import { indexingPolicy } from '../src/lib/indexing';

test('default and staging builds block indexing; production needs an explicit verified origin', () => {
  assert.equal(indexingPolicy().noindex, true);
  assert.match(indexingPolicy('staging').robots, /Disallow: \//);
  assert.throws(() => indexingPolicy('production'), /SITE_ORIGIN/);
  assert.throws(() => indexingPolicy('production', 'https://preview.example.com'), /SITE_ORIGIN/);
  assert.throws(() => indexingPolicy('prod'), /SITE_ENV/);
  const production = indexingPolicy('production', 'https://elbruno.com');
  assert.equal(production.noindex, false);
  assert.match(production.robots, /Allow: \//);
  assert.match(production.robots, /Sitemap: https:\/\/elbruno.com\/sitemap-index.xml/);
});
