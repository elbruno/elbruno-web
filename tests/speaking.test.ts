import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bios } from '../src/data/speaking';
test('all six factual draft biographies have useful requested lengths', () => {
  for (const language of ['en', 'es'] as const) {
    for (const length of ['50', '100', '200'] as const) {
      const count = bios[language][length].split(/\s+/).length;
      assert.ok(
        count >= Number(length) * 0.8 && count <= Number(length) * 1.2,
        `${language}/${length}: ${count} words`,
      );
      assert.match(bios[language][length], /Bruno Capuano/);
      assert.ok(!bios[language][length].includes('\u2014'));
    }
  }
});
