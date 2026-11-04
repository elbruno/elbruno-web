import assert from 'node:assert/strict';
import { test } from 'node:test';
import { route, translations } from '../src/i18n/index';
import { projects } from '../src/data/profile';

test('language switching preserves every supported route', () => {
  for (const page of ['', 'about', 'projects', 'speaking'] as const) {
    assert.equal(route('es', page), `/es/${page ? `${page}/` : ''}`);
    assert.equal(route('en', page), `/${page ? `${page}/` : ''}`);
  }
});
test('translation structures have parity including array entries', () => {
  function shape(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(shape);
    if (value && typeof value === 'object')
      return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, shape(val)]));
    return typeof value;
  }
  assert.deepEqual(shape(translations.en), shape(translations.es));
});
test('project descriptions preserve the verified teleprompter identity', () => {
  const prompt = projects.find((project) => project.slug === 'PromptDot')!;
  assert.match(prompt.en, /teleprompter/);
  assert.match(prompt.es, /teleprompter/);
});
