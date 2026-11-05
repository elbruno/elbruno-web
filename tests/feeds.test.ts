import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { feedExcerpt, normalize, parseFeed, plainText } from '../src/lib/feeds/parse';
import { validateSnapshot } from '../src/lib/feeds/model';
import type { Snapshot } from '../src/lib/feeds/model';
import { refreshFeed, refreshRepository } from '../src/lib/feeds/refresh';

const now = Date.parse('2026-11-04T13:00:00Z');
const fixture = readFileSync(new URL('./fixtures/rss.xml', import.meta.url), 'utf8');
test('RSS is sanitized, sorted and deduplicated with invalid entries removed', () => {
  const entries = parseFeed(fixture, 'blog', now);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].title, 'Newer');
  assert.equal(entries[1].title, 'Older & useful');
  assert.equal(entries[1].summary, 'A safe summary.');
});
test('Atom alternate links and publication dates are parsed', () => {
  const entries = parseFeed(
    '<feed><entry><id>one</id><title>A video</title><link rel="self" href="https://example.com/self"/><link rel="alternate" href="https://example.com/watch"/><published>2026-11-01T10:00:00Z</published></entry></feed>',
    'youtube',
    now,
  );
  assert.equal(entries[0].url, 'https://example.com/watch');
});
test('unsafe and oversized XML is rejected', () => {
  assert.throws(() => parseFeed('<!DOCTYPE rss [<!ENTITY x "x">]><rss/>', 'blog'), /not allowed/);
  assert.throws(() => parseFeed('x'.repeat(2_000_001), 'blog'), /size/);
  assert.throws(() => parseFeed('<rss>', 'blog'), /XML/);
  assert.throws(() => parseFeed('<rss><channel/></rss>', 'blog'), /valid published/);
});
test('normalization filters future dates and caps entries at three deterministically', () => {
  const entries = Array.from({ length: 6 }, (_, index) => ({
    id: String(index),
    title: 'Title',
    url: `https://example.com/${index}`,
    publishedAt: `2026-11-0${index + 1}T00:00:00Z`,
    source: 'podcast',
  }));
  const actual = normalize(entries, now);
  assert.equal(actual.length, 3);
  assert.equal(actual[0].id, '3');
  assert.deepEqual(normalize(entries, now), actual);
});
test('text is bounded and encoded HTML is never kept as markup', () => {
  assert.equal(plainText('&lt;img src=x&gt; &#x1F916;', 80), 'img src=x 🤖');
  assert.equal(plainText('x'.repeat(500)).length, 180);
});
test('snapshot rejects invalid metadata and duplicate URLs', () => {
  const entries = parseFeed(fixture, 'blog', now);
  const snapshot = {
    sources: { blog: 'https://example.com', podcast: null, youtube: null },
    entries,
    repositories: [],
  };
  assert.doesNotThrow(() => validateSnapshot(snapshot));
  assert.throws(
    () => validateSnapshot({ ...snapshot, entries: [entries[0], entries[0]] }),
    /duplicate/,
  );
  assert.throws(
    () =>
      validateSnapshot({
        ...snapshot,
        repositories: [{ name: 'fake', url: 'https://github.com/x/y', description: '', stars: -1 }],
      }),
    /metadata/,
  );
});

test('greeting-only excerpts are omitted without inventing article summaries', () => {
  assert.equal(feedExcerpt('Hi!'), '');
  assert.equal(
    feedExcerpt('<p>Hi!</p> <p>A source-backed excerpt.</p>'),
    'A source-backed excerpt.',
  );
  assert.equal(feedExcerpt('History of AI'), 'History of AI');
  assert.equal(feedExcerpt('Hello! <script>bad()</script>Real content.'), 'Real content.');
});

test('RSS timeouts, missing fields and malformed responses retain exact last-good data and timestamps', async () => {
  const previous: Snapshot = {
    sources: { blog: 'https://example.com/feed/', podcast: null, youtube: null },
    entries: parseFeed(fixture, 'blog', now),
    repositories: [],
    fetchedAt: { blog: '2026-11-01T00:00:00Z' },
  };
  for (const request of [
    async () => {
      throw new Error('TimeoutError');
    },
    async () => '<rss>',
    async () => '<rss><channel><item><title>Missing date and URL</title></item></channel></rss>',
  ]) {
    const result = await refreshFeed(previous, 'blog', 'https://example.com/feed/', request, now);
    assert.equal(result.snapshot, previous);
    assert.match(result.warning!, /keeping last known good/);
  }
  const success = await refreshFeed(
    previous,
    'blog',
    'https://example.com/feed/',
    async () => fixture.replace('Newer', 'Newer source title'),
    now,
  );
  assert.equal(success.warning, undefined);
  assert.equal(success.snapshot.fetchedAt?.blog, new Date(now).toISOString());
  assert.equal(previous.fetchedAt?.blog, '2026-11-01T00:00:00Z');
  const unchanged = await refreshFeed(
    previous,
    'blog',
    'https://example.com/feed/',
    async () => fixture,
    now,
  );
  assert.equal(unchanged.snapshot, previous);
});

test('GitHub rate limits, malformed metadata and unexpected ownership retain known repository data', async () => {
  const project = { slug: 'example', url: 'https://github.com/elbruno/example' };
  const previous = { name: 'example', url: project.url, description: 'Verified', stars: 4 };
  for (const request of [
    async () => {
      throw new Error('HTTP 403 rate limit');
    },
    async () => {
      throw new Error('HTTP 429');
    },
    async () => 'not JSON',
    async () =>
      JSON.stringify({
        name: 'example',
        html_url: 'https://github.com/other/example',
        description: '',
      }),
    async () => JSON.stringify({ name: 'example', html_url: project.url, stargazers_count: -1 }),
  ]) {
    const result = await refreshRepository(project, previous, request);
    assert.equal(result.repository, previous);
    assert.match(result.warning!, /keeping last known good/);
  }
  const result = await refreshRepository(project, previous, async () =>
    JSON.stringify({
      name: 'example',
      html_url: project.url,
      description: 'From API',
      stargazers_count: 7,
      updated_at: '2026-11-05T00:00:00Z',
    }),
  );
  assert.equal(result.warning, undefined);
  assert.equal(result.repository?.stars, 7);
});
